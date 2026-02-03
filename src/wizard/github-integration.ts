import { getWizardProjectById, updateWizardProject, getWizardProjects } from "../gateway/wizard-data-store.js";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import { resolveStateDir } from "../config/paths.js";

const execAsync = promisify(exec);

export async function createGitHubRepoForProject(projectId: string, isPrivate: boolean = true): Promise<string | null> {
  try {
    const project = await getWizardProjectById(projectId);
    if (!project) {
      console.error(`[GitHub Integration] Project ${projectId} not found`);
      return null;
    }
    
    if (project.githubRepo) {
      console.log(`[GitHub Integration] Project ${projectId} already has GitHub repo: ${project.githubRepo}`);
      return project.githubRepo;
    }
    
    // Create repo name from project name (sanitize)
    const repoName = project.name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    
    // Create private GitHub repo
    const visibility = isPrivate ? "--private" : "--public";
    const { stdout, stderr } = await execAsync(`gh repo create ${repoName} ${visibility} --source=. --remote=origin --push 2>&1 || true`);
    
    if (stderr && !stderr.includes("already exists")) {
      console.error(`[GitHub Integration] Error creating repo: ${stderr}`);
      return null;
    }
    
    // Get repo URL
    const { stdout: repoUrl } = await execAsync(`gh repo view ${repoName} --json url -q .url 2>&1 || echo ""`);
    const repoUrlClean = repoUrl.trim();
    
    if (!repoUrlClean) {
      console.error(`[GitHub Integration] Failed to get repo URL for ${repoName}`);
      return null;
    }
    
    // Update project with repo URL
    await updateWizardProject(projectId, {
      githubRepo: repoUrlClean,
    });
    
    console.log(`[GitHub Integration] Created GitHub repo for project ${projectId}: ${repoUrlClean}`);
    return repoUrlClean;
  } catch (err) {
    console.error(`[GitHub Integration] Error creating GitHub repo:`, err);
    return null;
  }
}

export async function commitTaskProgress(projectId: string, taskId: string, message: string): Promise<boolean> {
  try {
    const project = await getWizardProjectById(projectId);
    if (!project || !project.githubRepo) {
      return false; // No repo to commit to
    }
    
    const stateDir = resolveStateDir();
    const projectDir = path.join(stateDir, "wizard-projects", project.name.replace(/[^a-zA-Z0-9-_]/g, "_"));
    
    // Check if project directory exists and is a git repo
    try {
      await fs.access(path.join(projectDir, ".git"));
    } catch {
      // Not a git repo, initialize it
      await execAsync(`cd "${projectDir}" && git init`);
      
      // Add remote if repo exists
      if (project.githubRepo) {
        await execAsync(`cd "${projectDir}" && git remote add origin ${project.githubRepo}.git || git remote set-url origin ${project.githubRepo}.git`);
      }
    }
    
    // Add all files
    await execAsync(`cd "${projectDir}" && git add -A`);
    
    // Check if there are changes to commit
    try {
      const { stdout: statusOutput } = await execAsync(`cd "${projectDir}" && git status --porcelain`);
      if (!statusOutput.trim()) {
        console.log(`[GitHub Integration] No changes to commit for task ${taskId}`);
        return true; // No changes, but that's OK
      }
    } catch (err) {
      // If status check fails, try to commit anyway
    }
    
    // Commit with proper escaping
    const escapedMessage = message.replace(/"/g, '\\"').replace(/\$/g, "\\$");
    try {
      await execAsync(`cd "${projectDir}" && git commit -m "${escapedMessage}"`);
      console.log(`[GitHub Integration] Committed: ${message}`);
    } catch (err: any) {
      // Check if error is just "nothing to commit"
      if (err?.stderr?.includes("nothing to commit") || err?.message?.includes("nothing to commit")) {
        console.log(`[GitHub Integration] No changes to commit for task ${taskId}`);
        return true;
      }
      console.error(`[GitHub Integration] Commit failed:`, err);
      return false;
    }
    
    // Push to GitHub
    try {
      // Try main branch first, then master
      await execAsync(`cd "${projectDir}" && git push -u origin main 2>&1 || git push -u origin master 2>&1`);
      console.log(`[GitHub Integration] Pushed to GitHub for task ${taskId}`);
    } catch (err: any) {
      // Log but don't fail - might not have write access or branch doesn't exist yet
      const errorMsg = err?.stderr || err?.message || String(err);
      if (!errorMsg.includes("remote:") && !errorMsg.includes("Permission denied")) {
        console.warn(`[GitHub Integration] Push failed (might be expected): ${errorMsg}`);
      }
    }
    
    console.log(`[GitHub Integration] Committed task progress for ${taskId} in project ${projectId}`);
    return true;
  } catch (err) {
    console.error(`[GitHub Integration] Error committing task progress:`, err);
    return false;
  }
}

export async function initializeProjectGitRepo(projectId: string): Promise<boolean> {
  try {
    const project = await getWizardProjectById(projectId);
    if (!project) {
      return false;
    }
    
    const stateDir = resolveStateDir();
    const projectDir = path.join(stateDir, "wizard-projects", project.name.replace(/[^a-zA-Z0-9-_]/g, "_"));
    
    // Ensure project directory exists
    await fs.mkdir(projectDir, { recursive: true });
    
    // Initialize git repo if it doesn't exist
    try {
      await fs.access(path.join(projectDir, ".git"));
    } catch {
      await execAsync(`cd "${projectDir}" && git init`);
      
      // Create .gitignore
      await fs.writeFile(
        path.join(projectDir, ".gitignore"),
        `node_modules/
.env
*.log
.DS_Store
dist/
build/
`
      );
      
      // Create initial README
      await fs.writeFile(
        path.join(projectDir, "README.md"),
        `# ${project.name}

${project.description || ""}

## Project Details

${project.prompt ? `### Original Prompt\n\n${project.prompt}\n\n` : ""}
${project.research ? `### Research\n\n${project.research}\n\n` : ""}
${project.features ? `### Features\n\n${project.features}\n\n` : ""}

## Status

${project.status}

## GitHub Repository

${project.githubRepo || "Not yet created"}
`
      );
      
      // Initial commit
      await execAsync(`cd "${projectDir}" && git add -A && git commit -m "Initial commit: ${project.name}" || true`);
    }
    
    return true;
  } catch (err) {
    console.error(`[GitHub Integration] Error initializing git repo:`, err);
    return false;
  }
}
