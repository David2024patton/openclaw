/**
 * Predefined task label taxonomy for OpenClaw Wizard
 * 
 * Labels are organized by category to help LLMs and users select appropriate tags.
 * Each label has:
 * - id: unique identifier
 * - name: display name
 * - category: grouping for UI organization
 * - description: what the label means
 * - keywords: trigger words that suggest this label
 */

export type TaskLabel = {
  id: string;
  name: string;
  category: string;
  description: string;
  keywords: string[];
  color?: string; // Optional color for UI
};

export const TASK_LABELS: TaskLabel[] = [
  // Code & Development
  {
    id: "code",
    name: "Code",
    category: "Development",
    description: "General coding task",
    keywords: ["code", "coding", "programming", "develop", "write code"],
    color: "#3b82f6",
  },
  {
    id: "bug",
    name: "Bug",
    category: "Development",
    description: "Fix a bug or error",
    keywords: ["bug", "error", "fix", "broken", "issue", "crash", "exception"],
    color: "#ef4444",
  },
  {
    id: "feature",
    name: "Feature",
    category: "Development",
    description: "Add new feature or functionality",
    keywords: ["feature", "add", "implement", "new", "create", "build"],
    color: "#10b981",
  },
  {
    id: "refactor",
    name: "Refactor",
    category: "Development",
    description: "Refactor or improve existing code",
    keywords: ["refactor", "improve", "optimize", "cleanup", "restructure"],
    color: "#8b5cf6",
  },
  {
    id: "test",
    name: "Test",
    category: "Development",
    description: "Write or run tests",
    keywords: ["test", "testing", "unit test", "integration", "qa"],
    color: "#f59e0b",
  },
  {
    id: "documentation",
    name: "Documentation",
    category: "Development",
    description: "Write or update documentation",
    keywords: ["documentation", "docs", "readme", "comment", "explain"],
    color: "#06b6d4",
  },

  // Technology Stack
  {
    id: "python",
    name: "Python",
    category: "Technology",
    description: "Python-related task",
    keywords: ["python", "py", ".py", "pip", "django", "flask", "pandas"],
    color: "#3776ab",
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "Technology",
    description: "JavaScript/TypeScript task",
    keywords: ["javascript", "js", "typescript", "ts", "node", "react", "vue"],
    color: "#f7df1e",
  },
  {
    id: "frontend",
    name: "Frontend",
    category: "Technology",
    description: "Frontend/UI work",
    keywords: ["frontend", "ui", "ux", "interface", "design", "css", "html"],
    color: "#ec4899",
  },
  {
    id: "backend",
    name: "Backend",
    category: "Technology",
    description: "Backend/server work",
    keywords: ["backend", "server", "api", "endpoint", "database", "db"],
    color: "#f97316",
  },
  {
    id: "database",
    name: "Database",
    category: "Technology",
    description: "Database-related task",
    keywords: ["database", "db", "sql", "query", "migration", "schema"],
    color: "#84cc16",
  },

  // Communication & Admin
  {
    id: "email",
    name: "Email",
    category: "Communication",
    description: "Email-related task",
    keywords: ["email", "mail", "send email", "check email", "inbox"],
    color: "#6366f1",
  },
  {
    id: "meeting",
    name: "Meeting",
    category: "Communication",
    description: "Meeting or call",
    keywords: ["meeting", "call", "phone", "zoom", "conference", "standup"],
    color: "#14b8a6",
  },
  {
    id: "review",
    name: "Review",
    category: "Communication",
    description: "Review something (PR, document, etc.)",
    keywords: ["review", "pr review", "code review", "check", "look at"],
    color: "#a855f7",
  },
  {
    id: "approval",
    name: "Approval",
    category: "Communication",
    description: "Need approval or confirmation",
    keywords: ["approve", "approval", "confirm", "ok", "yes", "permission"],
    color: "#22c55e",
  },

  // Project Management
  {
    id: "urgent",
    name: "Urgent",
    category: "Priority",
    description: "Urgent task requiring immediate attention",
    keywords: ["urgent", "asap", "immediate", "critical", "emergency"],
    color: "#dc2626",
  },
  {
    id: "blocked",
    name: "Blocked",
    category: "Status",
    description: "Task is blocked by something",
    keywords: ["blocked", "waiting", "dependency", "can't proceed"],
    color: "#f59e0b",
  },
  {
    id: "research",
    name: "Research",
    category: "Activity",
    description: "Research or investigation task",
    keywords: ["research", "investigate", "find out", "look into", "analyze"],
    color: "#8b5cf6",
  },
  {
    id: "planning",
    name: "Planning",
    category: "Activity",
    description: "Planning or design task",
    keywords: ["plan", "planning", "design", "architecture", "strategy"],
    color: "#06b6d4",
  },

  // Infrastructure & DevOps
  {
    id: "deployment",
    name: "Deployment",
    category: "DevOps",
    description: "Deploy or release task",
    keywords: ["deploy", "deployment", "release", "publish", "ship"],
    color: "#10b981",
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    category: "DevOps",
    description: "Infrastructure or ops work",
    keywords: ["infrastructure", "ops", "devops", "server", "docker", "kubernetes"],
    color: "#6366f1",
  },
  {
    id: "security",
    name: "Security",
    category: "DevOps",
    description: "Security-related task",
    keywords: ["security", "secure", "vulnerability", "auth", "encryption"],
    color: "#ef4444",
  },
];

/**
 * Get all labels grouped by category
 */
export function getLabelsByCategory(): Record<string, TaskLabel[]> {
  const grouped: Record<string, TaskLabel[]> = {};
  for (const label of TASK_LABELS) {
    if (!grouped[label.category]) {
      grouped[label.category] = [];
    }
    grouped[label.category].push(label);
  }
  return grouped;
}

/**
 * Suggest labels for a task based on title and description
 * Returns label IDs sorted by relevance
 */
export function suggestLabels(title: string, description?: string): string[] {
  const text = `${title} ${description || ""}`.toLowerCase();
  const scores = new Map<string, number>();

  for (const label of TASK_LABELS) {
    let score = 0;
    for (const keyword of label.keywords) {
      const keywordLower = keyword.toLowerCase();
      // Exact match gets higher score
      if (text.includes(keywordLower)) {
        score += text.split(keywordLower).length - 1; // Count occurrences
      }
    }
    if (score > 0) {
      scores.set(label.id, score);
    }
  }

  // Sort by score (descending) and return top 5
  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id);
}

/**
 * Get label by ID
 */
export function getLabelById(id: string): TaskLabel | undefined {
  return TASK_LABELS.find((label) => label.id === id);
}

/**
 * Get labels by IDs
 */
export function getLabelsByIds(ids: string[]): TaskLabel[] {
  return ids.map((id) => getLabelById(id)).filter((label): label is TaskLabel => label !== undefined);
}
