/**
 * Simplified predefined task labels for OpenClaw Wizard
 * These are the ONLY labels that can be used - models must choose from this list
 */

export type TaskLabel = {
  id: string;
  name: string;
  color: string;
  description: string;
};

export const PREDEFINED_LABELS: TaskLabel[] = [
  {
    id: "bug",
    name: "Bug",
    color: "#ef4444", // Red
    description: "Fix a bug or error",
  },
  {
    id: "feature",
    name: "Feature",
    color: "#10b981", // Green
    description: "Add new feature or functionality",
  },
  {
    id: "refactor",
    name: "Refactor",
    color: "#8b5cf6", // Purple
    description: "Refactor or improve existing code",
  },
  {
    id: "test",
    name: "Test",
    color: "#f59e0b", // Amber
    description: "Write or run tests",
  },
  {
    id: "documentation",
    name: "Documentation",
    color: "#06b6d4", // Cyan
    description: "Write or update documentation",
  },
  {
    id: "research",
    name: "Research",
    color: "#6366f1", // Indigo
    description: "Research or investigation task",
  },
  {
    id: "deployment",
    name: "Deployment",
    color: "#ec4899", // Pink
    description: "Deploy or release task",
  },
  {
    id: "security",
    name: "Security",
    color: "#dc2626", // Dark red
    description: "Security-related task",
  },
];

export function getLabelById(id: string): TaskLabel | undefined {
  return PREDEFINED_LABELS.find((label) => label.id === id);
}

export function getLabelsByIds(ids: string[]): TaskLabel[] {
  return ids.map((id) => getLabelById(id)).filter((label): label is TaskLabel => label !== undefined);
}
