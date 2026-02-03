# Scenario Analysis: Corporate Website Project Workflow

## User Scenario
User requests in chat/Telegram: "Create a corporate style website with 5+ pages, login section, user dashboard, admin dashboard, user tiers, marketing, subscriptions"

## Expected Workflow

### Step 1: Main LLM Processing
**What should happen:**
- Main LLM recognizes coding task
- Routes to coding agent/tool
- Coding agent researches requirements

**Current Status:** ✅ **WORKS**
- Main LLM can use `wizard_projects` tool to create projects
- Main LLM can use `wizard_tasks` tool to manage tasks
- Research can be done via `web_search` tool

### Step 2: Project Creation
**What should happen:**
- Create new project in Wizard
- Copy user prompt → project.prompt field
- Put research → project.research field
- Break down features → project.features field

**Current Status:** ✅ **WORKS** (with new tool)
- `wizard_projects` tool can create projects with prompt/research/features
- Gateway endpoint `wizard.projects.create` exists
- Projects stored in `wizard-data.json`

### Step 3: Task Generation
**What should happen:**
- Break features into tasks:
  - Each page = task
  - Database = task
  - Features = modular tasks
  - All features modular (on/off)

**Current Status:** ✅ **WORKS** (partially)
- `wizard_projects` tool has `generateTasks` action
- Can extract features and create tasks
- Tasks can be labeled (modular features can use labels)
- **MISSING:** Automatic modular feature detection/flagging

### Step 4: Parallel Agent Work
**What should happen:**
- Multiple agents pick up tasks from "todo"
- Agents work in parallel
- Tasks move: todo → in_progress → testing → done

**Current Status:** ⚠️ **PARTIAL**
- Testing monitor spawns agents for "testing" tasks
- **MISSING:** General task picker for "todo" and "in_progress" columns
- **MISSING:** Agent coordination system to prevent conflicts
- Agents can update task status via `wizard_tasks` tool

### Step 5: Visual Testing with Screenshots
**What should happen:**
- Agent completes task
- Takes screenshot of result
- Attaches screenshot to task
- Moves task to "testing"

**Current Status:** ⚠️ **PARTIAL**
- Browser tool has `screenshot` action ✅
- Tasks support attachments ✅
- **MISSING:** Automatic screenshot workflow
- **MISSING:** Agent can't attach screenshots via `wizard_tasks` tool (needs update)

### Step 6: GitHub Integration
**What should happen:**
- Create private GitHub repo
- Keep repo updated as work progresses
- Link repo to project

**Current Status:** ⚠️ **PARTIAL**
- GitHub skill exists (`gh` CLI) ✅
- Projects have `githubRepo` field ✅
- **MISSING:** Automatic repo creation workflow
- **MISSING:** Auto-commit/push on task completion

### Step 7: Project Selection in Telegram/Chat
**What should happen:**
- User can select active project in Telegram
- Commands like `/project select <name>`
- All tasks/updates tied to active project

**Current Status:** ❌ **NOT IMPLEMENTED**
- No project selection in chat UI
- No Telegram commands for project management
- No active project context in sessions

## What Works Now ✅

1. **Project Creation**: Agents can create projects with prompt/research/features
2. **Task Management**: Agents can create, update, and query tasks
3. **Task Generation**: Can generate tasks from project features
4. **File System**: Tasks saved as .md files in project folders
5. **Testing Monitor**: Auto-lints code tasks in "testing" column
6. **Browser Screenshots**: Can take screenshots via browser tool
7. **GitHub Skill**: `gh` CLI available for repo management
8. **Edit Logging**: All changes tracked with agent info
9. **Validation**: Task completeness validation system

## What's Missing ❌

1. **Wizard Projects Tool** - ✅ **JUST ADDED** - Agents can now create/update projects
2. **Task Attachment via Tool** - Agents can't add screenshots to tasks via API
3. **General Task Picker** - No monitor for "todo" column to spawn agents
4. **Visual Testing Automation** - No automatic screenshot-on-completion
5. **GitHub Auto-Integration** - No automatic repo creation/updates
6. **Project Selection in Chat** - No way to set active project in Telegram/chat
7. **Parallel Agent Coordination** - No system to prevent multiple agents working on same task
8. **Modular Feature Flagging** - Features aren't automatically marked as modular

## What Will Happen (Current Implementation)

### Scenario Flow:

1. **User Request** → Main LLM receives in chat/Telegram
2. **LLM Recognizes Coding** → Uses `wizard_projects` tool to create project
3. **Project Created** → With user prompt in `prompt` field
4. **LLM Researches** → Uses `web_search`, puts results in `research` field
5. **LLM Breaks Down** → Puts feature list in `features` field
6. **LLM Generates Tasks** → Uses `wizard_projects generateTasks` action
7. **Tasks Created** → All in "todo" status
8. **Testing Monitor** → Only watches "testing" column (won't pick up "todo" tasks)
9. **Manual/LLM Work** → LLM or user must manually move tasks to "in_progress"
10. **Testing** → When moved to "testing", monitor spawns linting agent
11. **Visual Testing** → Visual testing monitor automatically takes screenshots for web tasks in "testing" or "done" status
12. **Screenshots** → Screenshots are automatically attached to tasks by visual testing monitor
13. **GitHub** → Agent can use `gh` CLI but no automatic workflow (manual repo creation/updates)

## Recommendations

### High Priority:
1. **Add task attachment support** to `wizard_tasks` tool
2. **Create general task monitor** for "todo" and "in_progress" columns
3. **Add project selection** to chat UI and Telegram commands
4. **Add visual testing automation** (screenshot on task completion)

### Medium Priority:
5. **GitHub auto-integration** (repo creation, auto-commit)
6. **Agent coordination** (prevent duplicate work)
7. **Modular feature detection** (auto-flag features as modular)

### Low Priority:
8. **Project templates** (pre-configured project structures)
9. **Task dependencies** (task A must complete before task B)
10. **Progress tracking** (percentage complete, ETA)
