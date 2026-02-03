import { getWizardTasksByStatus, getWizardProjectById, updateWizardTask, type WizardTask } from "../gateway/wizard-data-store.js";
import { browserScreenshotAction, browserNavigate } from "../browser/client-actions.js";
import { loadConfig } from "../config/config.js";
import { resolveBrowserConfig } from "../browser/config.js";
import { resolveGatewayPort } from "../config/paths.js";
import { saveMediaBuffer } from "../media/store.js";

let isInitialized = false;
const activeVisualTests = new Set<string>();

export function startVisualTestingMonitor() {
  if (isInitialized) return;
  
  isInitialized = true;
  console.log("[Visual Testing Monitor] Initialized (event-driven)");
}

// Event-driven trigger - call this when tasks move to testing/done status
export async function triggerVisualTestingCheck() {
  if (!isInitialized) {
    startVisualTestingMonitor();
  }
  
  // Only check if not already processing
  if (activeVisualTests.size === 0) {
    await checkAndProcessVisualTests();
  }
}

export function stopVisualTestingMonitor() {
  isInitialized = false;
  activeVisualTests.clear();
  console.log("[Visual Testing Monitor] Stopped");
}

function isWebTask(task: WizardTask): boolean {
  // Check if task is web-related
  const webLabels = ["frontend", "ui", "website", "web", "page", "dashboard", "login", "admin"];
  if (task.labels?.some(label => webLabels.includes(label))) {
    return true;
  }
  
  const text = `${task.title} ${task.description || ""}`.toLowerCase();
  const webKeywords = [
    "page", "website", "web", "ui", "frontend", "dashboard", "login", "admin",
    "html", "css", "javascript", "react", "vue", "angular", "component", "view"
  ];
  
  return webKeywords.some(keyword => text.includes(keyword));
}

async function checkAndProcessVisualTests() {
  // Get tasks that are in "testing" or "done" status and are web-related
  const testingTasks = await getWizardTasksByStatus("testing");
  const doneTasks = await getWizardTasksByStatus("done");
  const allTasks = [...testingTasks, ...doneTasks];
  
  const webTasks = allTasks.filter(
    (task) =>
      isWebTask(task) &&
      !activeVisualTests.has(task.id) &&
      !task.attachments?.some(att => att.type === "image/screenshot")
  );
  
  for (const task of webTasks) {
    activeVisualTests.add(task.id);
    processTaskVisualTest(task).catch((err) => {
      console.error(`[Visual Testing Monitor] Error processing task ${task.id}:`, err);
      activeVisualTests.delete(task.id);
    });
  }
}

async function processTaskVisualTest(task: WizardTask) {
  try {
    console.log(`[Visual Testing Monitor] Processing visual test for task: ${task.title}`);
    
    // Get project to find dev server URL
    let devServerUrl: string | undefined;
    if (task.projectId) {
      const project = await getWizardProjectById(task.projectId);
      devServerUrl = project?.devServerUrl;
    }
    
    if (!devServerUrl) {
      console.log(`[Visual Testing Monitor] No dev server URL for task ${task.id}, skipping visual test`);
      activeVisualTests.delete(task.id);
      return;
    }
    
    // Take screenshot using browser
    let screenshotUrl: string | undefined;
    try {
      const cfg = loadConfig();
      const resolved = resolveBrowserConfig(cfg.browser, cfg);
      if (!resolved.enabled) {
        console.log(`[Visual Testing Monitor] Browser not enabled for task ${task.id}`);
        activeVisualTests.delete(task.id);
        return;
      }
      
      const gatewayPort = resolveGatewayPort(cfg);
      const baseUrl = `http://127.0.0.1:${gatewayPort || 18790}`;
      
      // Navigate to dev server URL first
      await browserNavigate(baseUrl, {
        profile: "openclaw",
        url: devServerUrl,
      });
      
      // Wait a moment for page to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Take screenshot
      const screenshotResult = await browserScreenshotAction(baseUrl, {
        profile: "openclaw",
        fullPage: true,
        type: "png",
      });
      
      if (!screenshotResult?.path) {
        console.log(`[Visual Testing Monitor] Failed to take screenshot for task ${task.id}`);
        activeVisualTests.delete(task.id);
        return;
      }
      
      screenshotUrl = screenshotResult.path;
    } catch (err) {
      console.error(`[Visual Testing Monitor] Error taking screenshot:`, err);
      activeVisualTests.delete(task.id);
      return;
    }
    
    if (!screenshotUrl) {
      console.log(`[Visual Testing Monitor] No screenshot URL for task ${task.id}`);
      activeVisualTests.delete(task.id);
      return;
    }
    
    // Attach screenshot to task
    const attachment = {
      id: `screenshot-${Date.now()}`,
      name: `Visual Test - ${task.title}`,
      url: screenshotUrl,
      type: "image/screenshot",
    };
    
    const currentAttachments = task.attachments || [];
    await updateWizardTask(task.id, {
      attachments: [...currentAttachments, attachment],
    }, {
      agentId: "visual-testing-monitor",
      agentName: "Visual Testing Monitor",
      agentType: "automated",
      action: "screenshot_added",
      description: `Screenshot taken for visual verification`,
    });
    
    console.log(`[Visual Testing Monitor] Screenshot attached to task ${task.id}`);
    activeVisualTests.delete(task.id);
  } catch (err) {
    console.error(`[Visual Testing Monitor] Error in processTaskVisualTest:`, err);
    activeVisualTests.delete(task.id);
  }
}
