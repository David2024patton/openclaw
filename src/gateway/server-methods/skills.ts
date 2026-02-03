import type { OpenClawConfig } from "../../config/config.js";
import type { GatewayRequestHandlers } from "./types.js";
import { resolveAgentWorkspaceDir, resolveDefaultAgentId } from "../../agents/agent-scope.js";
import { installSkill } from "../../agents/skills-install.js";
import { buildWorkspaceSkillStatus } from "../../agents/skills-status.js";
import { loadWorkspaceSkillEntries, type SkillEntry } from "../../agents/skills.js";
import { loadConfig, writeConfigFile } from "../../config/config.js";
import { getRemoteSkillEligibility } from "../../infra/skills-remote.js";
import {
  ErrorCodes,
  errorShape,
  formatValidationErrors,
  validateSkillsBinsParams,
  validateSkillsInstallParams,
  validateSkillsStatusParams,
  validateSkillsUpdateParams,
} from "../protocol/index.js";
import { Type } from "@sinclair/typebox";
import fs from "node:fs/promises";
import path from "node:path";
import { CONFIG_DIR, resolveUserPath } from "../../utils.js";

function listWorkspaceDirs(cfg: OpenClawConfig): string[] {
  const dirs = new Set<string>();
  const list = cfg.agents?.list;
  if (Array.isArray(list)) {
    for (const entry of list) {
      if (entry && typeof entry === "object" && typeof entry.id === "string") {
        dirs.add(resolveAgentWorkspaceDir(cfg, entry.id));
      }
    }
  }
  dirs.add(resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg)));
  return [...dirs];
}

function collectSkillBins(entries: SkillEntry[]): string[] {
  const bins = new Set<string>();
  for (const entry of entries) {
    const required = entry.metadata?.requires?.bins ?? [];
    const anyBins = entry.metadata?.requires?.anyBins ?? [];
    const install = entry.metadata?.install ?? [];
    for (const bin of required) {
      const trimmed = bin.trim();
      if (trimmed) {
        bins.add(trimmed);
      }
    }
    for (const bin of anyBins) {
      const trimmed = bin.trim();
      if (trimmed) {
        bins.add(trimmed);
      }
    }
    for (const spec of install) {
      const specBins = spec?.bins ?? [];
      for (const bin of specBins) {
        const trimmed = String(bin).trim();
        if (trimmed) {
          bins.add(trimmed);
        }
      }
    }
  }
  return [...bins].toSorted();
}

export const skillsHandlers: GatewayRequestHandlers = {
  "skills.status": ({ params, respond }) => {
    if (!validateSkillsStatusParams(params)) {
      respond(
        false,
        undefined,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid skills.status params: ${formatValidationErrors(validateSkillsStatusParams.errors)}`,
        ),
      );
      return;
    }
    const cfg = loadConfig();
    const workspaceDir = resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg));
    const report = buildWorkspaceSkillStatus(workspaceDir, {
      config: cfg,
      eligibility: { remote: getRemoteSkillEligibility() },
    });
    respond(true, report, undefined);
  },
  "skills.bins": ({ params, respond }) => {
    if (!validateSkillsBinsParams(params)) {
      respond(
        false,
        undefined,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid skills.bins params: ${formatValidationErrors(validateSkillsBinsParams.errors)}`,
        ),
      );
      return;
    }
    const cfg = loadConfig();
    const workspaceDirs = listWorkspaceDirs(cfg);
    const bins = new Set<string>();
    for (const workspaceDir of workspaceDirs) {
      const entries = loadWorkspaceSkillEntries(workspaceDir, { config: cfg });
      for (const bin of collectSkillBins(entries)) {
        bins.add(bin);
      }
    }
    respond(true, { bins: [...bins].toSorted() }, undefined);
  },
  "skills.install": async ({ params, respond }) => {
    if (!validateSkillsInstallParams(params)) {
      respond(
        false,
        undefined,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid skills.install params: ${formatValidationErrors(validateSkillsInstallParams.errors)}`,
        ),
      );
      return;
    }
    const p = params as {
      name: string;
      installId: string;
      timeoutMs?: number;
    };
    const cfg = loadConfig();
    const workspaceDirRaw = resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg));
    const result = await installSkill({
      workspaceDir: workspaceDirRaw,
      skillName: p.name,
      installId: p.installId,
      timeoutMs: p.timeoutMs,
      config: cfg,
    });
    respond(
      result.ok,
      result,
      result.ok ? undefined : errorShape(ErrorCodes.UNAVAILABLE, result.message),
    );
  },
  "skills.update": async ({ params, respond }) => {
    if (!validateSkillsUpdateParams(params)) {
      respond(
        false,
        undefined,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid skills.update params: ${formatValidationErrors(validateSkillsUpdateParams.errors)}`,
        ),
      );
      return;
    }
    const p = params as {
      skillKey: string;
      enabled?: boolean;
      apiKey?: string;
      env?: Record<string, string>;
    };
    const cfg = loadConfig();
    const skills = cfg.skills ? { ...cfg.skills } : {};
    const entries = skills.entries ? { ...skills.entries } : {};
    const current = entries[p.skillKey] ? { ...entries[p.skillKey] } : {};
    if (typeof p.enabled === "boolean") {
      current.enabled = p.enabled;
    }
    if (typeof p.apiKey === "string") {
      const trimmed = p.apiKey.trim();
      if (trimmed) {
        current.apiKey = trimmed;
      } else {
        delete current.apiKey;
      }
    }
    if (p.env && typeof p.env === "object") {
      const nextEnv = current.env ? { ...current.env } : {};
      for (const [key, value] of Object.entries(p.env)) {
        const trimmedKey = key.trim();
        if (!trimmedKey) {
          continue;
        }
        const trimmedVal = value.trim();
        if (!trimmedVal) {
          delete nextEnv[trimmedKey];
        } else {
          nextEnv[trimmedKey] = trimmedVal;
        }
      }
      current.env = nextEnv;
    }
    entries[p.skillKey] = current;
    skills.entries = entries;
    const nextConfig: OpenClawConfig = {
      ...cfg,
      skills,
    };
    await writeConfigFile(nextConfig);
    respond(true, { ok: true, skillKey: p.skillKey, config: current }, undefined);
  },
  "skills.getContent": async ({ params, respond }) => {
    const validated = Type.Object({
      skillKey: Type.String(),
    }).safeParse(params);
    
    if (!validated.success) {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.INVALID_REQUEST, `invalid params: ${formatValidationErrors(validated.error.errors)}`),
      );
      return;
    }
    
    try {
      const cfg = loadConfig();
      const workspaceDir = resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg));
      const entries = loadWorkspaceSkillEntries(workspaceDir, { config: cfg });
      const entry = entries.find((e) => {
        const skillKey = e.metadata?.skillKey || e.skill.name;
        return skillKey === validated.data.skillKey;
      });
      
      if (!entry) {
        respond(false, undefined, errorShape(ErrorCodes.NOT_FOUND, `Skill ${validated.data.skillKey} not found`));
        return;
      }
      
      const content = await fs.readFile(entry.skill.filePath, "utf-8");
      respond(true, { skillKey: validated.data.skillKey, content, filePath: entry.skill.filePath }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, `Failed to get skill content: ${String(err)}`));
    }
  },
  "skills.saveContent": async ({ params, respond }) => {
    const validated = Type.Object({
      skillKey: Type.String(),
      content: Type.String(),
    }).safeParse(params);
    
    if (!validated.success) {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.INVALID_REQUEST, `invalid params: ${formatValidationErrors(validated.error.errors)}`),
      );
      return;
    }
    
    try {
      const cfg = loadConfig();
      const workspaceDir = resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg));
      const entries = loadWorkspaceSkillEntries(workspaceDir, { config: cfg });
      const entry = entries.find((e) => {
        const skillKey = e.metadata?.skillKey || e.skill.name;
        return skillKey === validated.data.skillKey;
      });
      
      if (!entry) {
        respond(false, undefined, errorShape(ErrorCodes.NOT_FOUND, `Skill ${validated.data.skillKey} not found`));
        return;
      }
      
      // Only allow editing workspace and managed skills (not bundled)
      if (entry.skill.source === "openclaw-bundled") {
        respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "Cannot edit bundled skills"));
        return;
      }
      
      await fs.writeFile(entry.skill.filePath, validated.data.content, "utf-8");
      respond(true, { ok: true, skillKey: validated.data.skillKey }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, `Failed to save skill content: ${String(err)}`));
    }
  },
  "skills.create": async ({ params, respond }) => {
    // Manual validation - Typebox doesn't have .safeParse()
    const p = params as any;
    
    if (!p || typeof p !== "object") {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "Invalid params"));
      return;
    }
    
    if (!p.skillName || typeof p.skillName !== "string") {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "skillName is required"));
      return;
    }
    
    if (!p.content || typeof p.content !== "string") {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "content is required"));
      return;
    }
    
    try {
      // Normalize skill name
      const skillName = p.skillName.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      if (!skillName) {
        respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "Invalid skill name"));
        return;
      }
      
      // Use managed skills directory for new skills
      const managedSkillsDir = path.join(CONFIG_DIR, "skills");
      await fs.mkdir(managedSkillsDir, { recursive: true });
      
      const skillDir = path.join(managedSkillsDir, skillName);
      if (await fs.access(skillDir).then(() => true).catch(() => false)) {
        respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, `Skill ${skillName} already exists`));
        return;
      }
      
      await fs.mkdir(skillDir, { recursive: true });
      const skillMdPath = path.join(skillDir, "SKILL.md");
      await fs.writeFile(skillMdPath, p.content, "utf-8");
      
      respond(true, { ok: true, skillName, skillKey: skillName, filePath: skillMdPath }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, `Failed to create skill: ${String(err)}`));
    }
  },
  "skills.delete": async ({ params, respond }) => {
    const validated = Type.Object({
      skillKey: Type.String(),
    }).safeParse(params);
    
    if (!validated.success) {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.INVALID_REQUEST, `invalid params: ${formatValidationErrors(validated.error.errors)}`),
      );
      return;
    }
    
    try {
      const cfg = loadConfig();
      const workspaceDir = resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg));
      const entries = loadWorkspaceSkillEntries(workspaceDir, { config: cfg });
      const entry = entries.find((e) => {
        const skillKey = e.metadata?.skillKey || e.skill.name;
        return skillKey === validated.data.skillKey;
      });
      
      if (!entry) {
        respond(false, undefined, errorShape(ErrorCodes.NOT_FOUND, `Skill ${validated.data.skillKey} not found`));
        return;
      }
      
      // Only allow deleting workspace and managed skills (not bundled)
      if (entry.skill.source === "openclaw-bundled") {
        respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "Cannot delete bundled skills"));
        return;
      }
      
      // Delete the skill directory
      const skillDir = path.dirname(entry.skill.filePath);
      await fs.rm(skillDir, { recursive: true, force: true });
      
      respond(true, { ok: true, skillKey: validated.data.skillKey }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, `Failed to delete skill: ${String(err)}`));
    }
  },
  "skills.test": async ({ params, respond }) => {
    // Test skill by validating its structure
    const validated = Type.Object({
      skillKey: Type.String(),
    }).safeParse(params);
    
    if (!validated.success) {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.INVALID_REQUEST, `invalid params: ${formatValidationErrors(validated.error.errors)}`),
      );
      return;
    }
    
    try {
      const cfg = loadConfig();
      const workspaceDir = resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg));
      const entries = loadWorkspaceSkillEntries(workspaceDir, { config: cfg });
      const entry = entries.find((e) => {
        const skillKey = e.metadata?.skillKey || e.skill.name;
        return skillKey === validated.data.skillKey;
      });
      
      if (!entry) {
        respond(false, undefined, errorShape(ErrorCodes.NOT_FOUND, `Skill ${validated.data.skillKey} not found`));
        return;
      }
      
      // Basic validation: check if SKILL.md exists and has valid frontmatter
      const content = await fs.readFile(entry.skill.filePath, "utf-8");
      const hasFrontmatter = content.startsWith("---");
      const hasName = content.includes("name:");
      const hasDescription = content.includes("description:");
      
      const isValid = hasFrontmatter && hasName && hasDescription;
      const issues: string[] = [];
      if (!hasFrontmatter) issues.push("Missing YAML frontmatter");
      if (!hasName) issues.push("Missing 'name' field in frontmatter");
      if (!hasDescription) issues.push("Missing 'description' field in frontmatter");
      
      respond(true, {
        ok: isValid,
        skillKey: validated.data.skillKey,
        isValid,
        issues: issues.length > 0 ? issues : undefined,
        message: isValid ? "Skill structure is valid" : `Validation failed: ${issues.join(", ")}`,
      }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, `Failed to test skill: ${String(err)}`));
    }
  },
};
