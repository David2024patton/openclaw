import fs from "node:fs/promises";
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";
import type { WizardProject } from "../gateway/wizard-data-store.js";

/**
 * Creates the complete folder structure for a wizard project
 */
export async function createProjectFolders(project: WizardProject): Promise<void> {
  const stateDir = resolveStateDir();
  const projectDir = path.join(stateDir, "wizard-projects", sanitizeProjectName(project.name));
  
  // Create all required folders
  const folders = [
    path.join(projectDir, "tasks"),
    path.join(projectDir, "agents"),
    path.join(projectDir, "research"),
    path.join(projectDir, "logs"),
    path.join(projectDir, "media"),
    path.join(projectDir, "media", "img"),
    path.join(projectDir, "media", "img", "userprompt"),
    path.join(projectDir, "media", "video"),
    path.join(projectDir, "media", "audio"),
    path.join(projectDir, "debug"),
    path.join(projectDir, "debug", "fix"),
    path.join(stateDir, "global_debug"),
    path.join(stateDir, "global_debug", "fix"),
  ];
  
  for (const folder of folders) {
    await fs.mkdir(folder, { recursive: true });
  }
  
  // Create .gitignore in project folder
  const gitignorePath = path.join(projectDir, ".gitignore");
  const gitignoreContent = `# OpenClaw Project
node_modules/
.env
*.log
.DS_Store
*.tmp
*.cache
`;
  await fs.writeFile(gitignorePath, gitignoreContent, "utf-8");
  
  console.log(`[Project Folders] Created folder structure for project: ${project.name}`);
}

/**
 * @deprecated Use createProjectFolders instead
 */
export async function initializeProjectFolders(project: WizardProject): Promise<void> {
  return createProjectFolders(project);
}

/**
 * Get the project directory path
 */
export function getProjectDir(project: WizardProject): string {
  const stateDir = resolveStateDir();
  return path.join(stateDir, "wizard-projects", sanitizeProjectName(project.name));
}

/**
 * Get paths for specific project folders
 */
export function getProjectFolderPaths(project: WizardProject) {
  const projectDir = getProjectDir(project);
  return {
    projectDir,
    tasksDir: path.join(projectDir, "tasks"),
    agentsDir: path.join(projectDir, "agents"),
    researchDir: path.join(projectDir, "research"),
    logsDir: path.join(projectDir, "logs"),
    mediaDir: path.join(projectDir, "media"),
    mediaImgDir: path.join(projectDir, "media", "img"),
    mediaUserPromptDir: path.join(projectDir, "media", "img", "userprompt"),
    mediaVideoDir: path.join(projectDir, "media", "video"),
    mediaAudioDir: path.join(projectDir, "media", "audio"),
    debugDir: path.join(projectDir, "debug"),
    debugFixDir: path.join(projectDir, "debug", "fix"),
  };
}

/**
 * Get global debug and fix folder paths
 */
export function getGlobalDebugFolders() {
  const stateDir = resolveStateDir();
  return {
    globalDebugDir: path.join(stateDir, "global_debug"),
    globalFixDir: path.join(stateDir, "global_debug", "fix"),
  };
}

/**
 * Save a file to the appropriate project folder based on type
 */
export async function saveProjectFile(
  project: WizardProject,
  type: "log" | "agent" | "research" | "media" | "debug" | "fix",
  filename: string,
  content: string | Buffer,
  subfolder?: string,
): Promise<string> {
  const paths = getProjectFolderPaths(project);
  let targetDir: string;
  
  switch (type) {
    case "log":
      targetDir = paths.logsDir;
      break;
    case "agent":
      targetDir = paths.agentsDir;
      break;
    case "research":
      targetDir = paths.researchDir;
      break;
    case "media":
      targetDir = subfolder ? path.join(paths.mediaDir, subfolder) : paths.mediaDir;
      break;
    case "debug":
      targetDir = paths.debugDir;
      break;
    case "fix":
      targetDir = paths.debugFixDir;
      // Also save to global fix folder
      const globalFix = getGlobalDebugFolders().globalFixDir;
      const globalFixPath = path.join(globalFix, filename);
      await fs.writeFile(globalFixPath, content, "utf-8");
      break;
    default:
      targetDir = paths.projectDir;
  }
  
  await fs.mkdir(targetDir, { recursive: true });
  const filePath = path.join(targetDir, filename);
  await fs.writeFile(filePath, content, typeof content === "string" ? "utf-8" : undefined);
  
  return filePath;
}

/**
 * Save debug report with global copy
 */
export async function saveDebugReport(
  project: WizardProject,
  filename: string,
  content: string,
): Promise<{ projectPath: string; globalPath: string }> {
  const paths = getProjectFolderPaths(project);
  const globalPaths = getGlobalDebugFolders();
  
  const projectPath = path.join(paths.debugDir, filename);
  const globalPath = path.join(globalPaths.globalDebugDir, filename);
  
  await fs.mkdir(paths.debugDir, { recursive: true });
  await fs.mkdir(globalPaths.globalDebugDir, { recursive: true });
  
  await fs.writeFile(projectPath, content, "utf-8");
  await fs.writeFile(globalPath, content, "utf-8");
  
  return { projectPath, globalPath };
}

function sanitizeProjectName(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_]/g, "_");
}
