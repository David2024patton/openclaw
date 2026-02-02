# 🦞 OpenClaw — Enhanced Personal AI Assistant

<p align="center">
    <picture>
        <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text-dark.png">
        <img src="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text.png" alt="OpenClaw" width="500">
    </picture>
</p>

<p align="center">
  <strong>Personal AI Assistant with Enhanced Features for Windows</strong>
</p>

<p align="center">
  <a href="https://github.com/David2024patton/openclaw"><img src="https://img.shields.io/badge/GitHub-David2024patton%2Fopenclaw-blue?style=for-the-badge" alt="GitHub"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License"></a>
</p>

---

## 🚀 Quick Start (Windows with Docker)

### Prerequisites

- **Windows 10/11** with **WSL2** installed
- **Docker Desktop** for Windows
- **Git** for cloning the repository

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/David2024patton/openclaw.git
   cd openclaw
   ```

2. **Set up environment variables:**
   
   Create a `.env` file in the `openclaw` directory with the following:
   ```env
   # Gateway Configuration
   OPENCLAW_GATEWAY_PORT=45934
   OPENCLAW_BRIDGE_PORT=18790
   OPENCLAW_GATEWAY_BIND=lan
   
   # Docker Image
   OPENCLAW_IMAGE=openclaw:local
   
   # Config and Workspace Directories (Windows paths)
   OPENCLAW_CONFIG_DIR=C:/Users/YourUsername/.clawdbot
   OPENCLAW_WORKSPACE_DIR=C:/Users/YourUsername/clawd
   
   # Ollama Configuration (Windows host accessible from Docker)
   OLLAMA_API_KEY=ollama-local
   OLLAMA_HOST=http://host.docker.internal:11434
   
   # Gateway Authentication
   OPENCLAW_GATEWAY_TOKEN=your-secure-token-here
   OPENCLAW_GATEWAY_PASSWORD=your-password-here
   
   # Telegram Bot (Optional)
   TELEGRAM_BOT_TOKEN=your-telegram-bot-token
   
   # SearXNG Configuration (Optional)
   SEARXNG_BASE_URL=http://your-searxng-instance.com
   
   # Gemini API (Optional)
   GEMINI_API_KEY=your-gemini-api-key
   ```

3. **Build the Docker image:**
   ```bash
   cd openclaw
   docker build -t openclaw:local .
   ```

4. **Start the containers:**
   ```bash
   docker-compose up -d
   ```

5. **Access the Control UI:**
   
   Open your browser and navigate to:
   ```
   http://localhost:45934?token=your-secure-token-here
   ```

### Managing the Container

- **View logs:**
  ```bash
  docker-compose logs -f openclaw-gateway
  ```

- **Restart the gateway:**
  ```bash
  docker-compose restart openclaw-gateway
  ```

- **Stop the containers:**
  ```bash
  docker-compose down
  ```

- **Rebuild after code changes:**
  ```bash
  docker-compose down
  docker build -t openclaw:local .
  docker-compose up -d
  ```

---

## ✨ New Features & Enhancements

### 🔒 Security Improvements

| Feature | Description | Status |
|---------|-------------|--------|
| **Environment Variable Substitution** | All sensitive values (tokens, API keys) now use `${VAR_NAME}` syntax in config files, pulling from `.env` | ✅ Implemented |
| **Secure Token Management** | Gateway token and Telegram bot token stored in environment variables instead of hardcoded values | ✅ Implemented |
| **Config File Security** | `openclaw.json` uses environment variable references to prevent secrets in version control | ✅ Implemented |

### 📊 Wizard Dashboard

| Feature | Description | Status |
|---------|-------------|--------|
| **Project Management** | Create, track, and manage multiple projects with GitHub repo links and dev server URLs | ✅ Implemented |
| **Trello-like Task Board** | Kanban board with columns: To Do, In Progress, Testing, Done, Archived | ✅ Implemented |
| **Task Details Modal** | Rich task editor with descriptions, labels, checklists, attachments, and screenshots | ✅ Implemented |
| **Testing Workflow** | Mandatory testing step with visual QA, screenshot attachments, and failsafe mechanism | ✅ Implemented |
| **Drag & Drop** | Move tasks between columns with intuitive drag-and-drop interface | ✅ Implemented |
| **Notes for Agents** | Add notes that agents can read and reference during development | ✅ Implemented |
| **Action Log** | Track all agent actions and project changes in chronological order | ✅ Implemented |
| **File-based Persistence** | Tasks stored as markdown files in project-specific folders | ✅ Implemented |

### 🏗️ Software Architect Skill

| Feature | Description | Status |
|---------|-------------|--------|
| **Project Breakdown** | Automatically breaks down projects into granular tasks for every feature and section | ✅ Implemented |
| **Specialized Agent Spawning** | Creates specialized agents for Frontend, Backend, Database, DevOps, Security, QA, etc. | ✅ Implemented |
| **Competitor Research** | Spawns research agents to analyze competitor websites and gather feature ideas | ✅ Implemented |
| **Live Dev Servers** | Automatically spins up development servers for visual inspection | ✅ Implemented |
| **Visual QA Integration** | Uses browser tools to take screenshots and verify UI/UX | ✅ Implemented |
| **Self-Healing Debug Agent** | Continuous monitoring and automatic bug fixing during development | ✅ Implemented |
| **GitHub Integration** | Automatically creates private GitHub repositories for all projects | ✅ Implemented |
| **AI Integration** | Always includes AI capabilities (predictive analytics, NLP, image recognition) | ✅ Implemented |
| **Feature Flags** | Modular features toggleable via admin panels for different SaaS tiers | ✅ Implemented |
| **Testing Workflow** | Mandatory testing phase with unit, integration, and visual tests | ✅ Implemented |

### 🔍 SearXNG Integration

| Feature | Description | Status |
|---------|-------------|--------|
| **Privacy-Respecting Search** | Integrated SearXNG as a web search provider for enhanced privacy | ✅ Implemented |
| **JSON Export Ready** | SearXNG instance configured for JSON API responses | ✅ Implemented |
| **Configurable Base URL** | SearXNG endpoint configurable via environment variables | ✅ Implemented |

### 💬 Telegram Integration

| Feature | Description | Status |
|---------|-------------|--------|
| **Bot Configuration** | Telegram bot token stored securely in environment variables | ✅ Implemented |
| **Pairing System** | Secure DM pairing with approval codes for access control | ✅ Implemented |
| **Group Support** | Support for group chats with mention gating | ✅ Implemented |
| **Wizard Dashboard Hooks** | Telegram integration for Wizard dashboard notifications (planned) | 🚧 In Progress |

### 🧪 Testing & Quality Assurance

| Feature | Description | Status |
|---------|-------------|--------|
| **Testing Status Column** | New "Testing" column in Wizard dashboard between "In Progress" and "Done" | ✅ Implemented |
| **Visual Testing** | Browser-based visual QA with screenshot capture and analysis | ✅ Implemented |
| **Screenshot Attachments** | Attach test screenshots to tasks as proof of completion | ✅ Implemented |
| **Failsafe Mechanism** | Tasks automatically revert to "In Progress" if tests fail | ✅ Implemented |
| **Test Results Tracking** | Store test results (passed/failed, errors, warnings) in task metadata | ✅ Implemented |

### 🎨 UI/UX Enhancements

| Feature | Description | Status |
|---------|-------------|--------|
| **Modern Dark Theme** | Futuristic dark mode UI with vibrant accent colors | ✅ Implemented |
| **Trello-like Interface** | Familiar Kanban board layout with card actions and list customization | ✅ Implemented |
| **Rich Text Editor** | Markdown-supported task descriptions with formatting toolbar | ✅ Implemented |
| **Color-coded Lists** | Customizable column colors for better visual organization | ✅ Implemented |
| **Responsive Design** | Fully responsive layout for desktop, tablet, and mobile | ✅ Implemented |
| **Footer Attribution** | "Created by David Patton with ❤️ for the AI community" footer | ✅ Implemented |

### 🔧 Configuration & Environment

| Feature | Description | Status |
|---------|-------------|--------|
| **Environment Variable Support** | Full support for `${VAR_NAME}` syntax in config files | ✅ Implemented |
| **Docker Compose Setup** | Complete Docker Compose configuration for easy deployment | ✅ Implemented |
| **Windows Path Support** | Proper handling of Windows file paths in Docker containers | ✅ Implemented |
| **Port Customization** | Customizable gateway port (default: 45934) via environment variables | ✅ Implemented |

---

## 📋 Feature Details

### Wizard Dashboard

The Wizard dashboard is a comprehensive project management tool integrated into the OpenClaw Control UI. It provides:

- **Project Tracking**: Manage multiple projects with descriptions, GitHub repo links, and dev server URLs
- **Task Management**: Create, edit, and organize tasks with priorities, due dates, labels, and checklists
- **Visual Workflow**: Drag-and-drop tasks through status columns (To Do → In Progress → Testing → Done)
- **Testing Integration**: Mandatory testing phase with visual QA and screenshot proof
- **File-based Storage**: Tasks stored as markdown files in `wizard-projects/{project-name}/tasks/` for easy version control

### Software Architect Skill

The Software Architect skill enables OpenClaw to build complete applications from scratch:

- **Intelligent Breakdown**: Automatically breaks down projects into granular, actionable tasks
- **Multi-Agent Coordination**: Spawns specialized agents (Frontend, Backend, Database, DevOps, etc.) to work in parallel
- **Competitive Analysis**: Research agents analyze competitor websites to gather feature ideas
- **Live Development**: Spins up dev servers for real-time visual feedback
- **Self-Healing**: Debug agents continuously monitor and fix issues automatically
- **Production Ready**: Mandatory testing workflow ensures all code is production-ready before marking tasks as done

### Security Enhancements

All sensitive configuration values now use environment variable substitution:

```json
{
  "gateway": {
    "auth": {
      "token": "${OPENCLAW_GATEWAY_TOKEN}"
    }
  },
  "channels": {
    "telegram": {
      "botToken": "${TELEGRAM_BOT_TOKEN}"
    }
  }
}
```

This prevents secrets from being committed to version control and allows for easy configuration management across different environments.

---

## 🛠️ Configuration

### Minimal Configuration

Create `~/.openclaw/openclaw.json` (or `C:/Users/YourUsername/.clawdbot/openclaw.json` on Windows):

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/nemotron-3-nano:30b-a3b-q4_K_M"
      }
    }
  },
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "${OPENCLAW_GATEWAY_TOKEN}"
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "${TELEGRAM_BOT_TOKEN}",
      "dmPolicy": "pairing"
    }
  }
}
```

### Environment Variables

All sensitive values should be set in your `.env` file:

- `OPENCLAW_GATEWAY_TOKEN` - Gateway authentication token
- `TELEGRAM_BOT_TOKEN` - Telegram bot token (if using Telegram)
- `GEMINI_API_KEY` - Google Gemini API key (if using Gemini)
- `SEARXNG_BASE_URL` - SearXNG instance URL (if using SearXNG)

---

## 📚 Documentation

- [OpenClaw Official Docs](https://docs.openclaw.ai)
- [Getting Started Guide](https://docs.openclaw.ai/start/getting-started)
- [Docker Installation](https://docs.openclaw.ai/install/docker)
- [Windows (WSL2) Setup](https://docs.openclaw.ai/platforms/windows)

---

## 🤝 Contributing

This is a fork of [openclaw/openclaw](https://github.com/openclaw/openclaw) with additional enhancements.

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenClaw Team** - Original OpenClaw project
- **Peter Steinberger** - Creator of OpenClaw
- **Community Contributors** - All the amazing contributors to the OpenClaw ecosystem

---

<p align="center">
  <strong>Created by <a href="https://github.com/David2024patton">David Patton</a> with ❤️ for the AI community</strong>
</p>

<p align="center">
  <a href="https://github.com/David2024patton/openclaw">🔗 View on GitHub</a>
</p>
