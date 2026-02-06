# Desktop GUI Scaffold for OpenClaw

This workspace scaffolds an Electron-based graphical interface that consumes the parent project's compiled output.

## ⚠️ Dependency Chain

Before touching this app, compile the parent workspace:

```bash
# Execute from repo root (../../)
pnpm install
pnpm build
```

Verify `../../dist/index.js` exists. The desktop app imports this artifact at runtime.

## Launch Development Environment

```bash
pnpm install           # Install Electron app dependencies
pnpm electron:dev      # Compile + launch with debugging
```

Vite hosts the React interface at port 5173. Main process modifications require full restart; renderer hot-reloads automatically.

## Create Distribution Packages

```bash
pnpm dist              # Generate all platform installers
pnpm dist:mac          # macOS disk image
pnpm dist:win          # Windows setup executable
pnpm dist:linux        # AppImage + Debian package
```

Find artifacts in `release/` subdirectory.

## Architectural Components

### Process Orchestration (`src/main.ts`)
Bootstraps window management, configures security policies, initializes communication channels. Detects packaging mode to serve either Vite dev server or bundled assets.

### Security Boundary (`src/preload.ts`)
Implements context bridge exposing controlled API surface. All messaging routes use `openclaw:` namespace prefix.

### CLI Wrapper Module (`src/electron-adapter.ts`)
Loads parent distribution dynamically. Intercepts termination signals during initialization—prevents imported CLI code from exiting the desktop process. Current dist exports utilities, not command runners; module contains stub implementations showing integration patterns for future programmatic interface.

### Message Router (`src/ipc-handlers.ts`)
Maps bridge methods to adapter functions. Maintains circular log buffer, broadcasts trace events to connected renderers.

### Control Interface (`src/renderer/Dashboard.tsx`)
React dashboard consuming bridge API. Displays runtime metrics, accepts command input, streams activity logs.

## Version Alignment Issues

Parent project mandates Node ≥22.12 (check root engines field). Electron 26 bundles Node 18—incompatible. Adapter detects version gaps and emits warnings. Consider Electron 30+ for Node 22 support; validate API compatibility before upgrading.

## PATH Integration Scripts

Three hook files exist under `installer-hooks/`—all placeholder templates:

**macOS**: `mac-postinstall.sh` should write shell wrapper to `/usr/local/bin/openclaw` invoking packaged app. Requires privilege escalation testing.

**Linux**: `linux-postinstall.sh` creates wrapper for deb installs. AppImage users configure PATH manually.

**Windows**: `windows-nsis-include.nsh` generates batch script, modifies registry PATH. Needs UAC elevation prompt in installer manifest.

Each file contains implementation blueprint in comments. Validate on target OS before shipping.

## Visual Assets

Directory `assets/` holds placeholder marker files:
- `icon-mac.icns.placeholder` → Replace with ICNS bundle
- `icon-win.ico.placeholder` → Replace with multi-resolution ICO
- `icon-linux.png.placeholder` → Replace with 512×512 PNG

Dashboard pulls logo from remote CDN. See `assets/README.md` for format specifications.

## Troubleshooting Guide

**Import failure during adapter init**: Parent dist missing—run build at repo root.

**Process termination intercepts**: Normal operation. Adapter catches exit attempts to preserve desktop session. Counter visible in status panel.

**Version mismatch warnings**: Electron ships independent Node runtime. Upgrade Electron dependency if newer Node features required.

**PATH hooks ineffective**: Hooks are documentation-only. Implementation pending per-platform testing.

## Automation Workflow

See `.github/workflows/electron-build.yml` for CI configuration. Builds on main branch pushes, uploads platform artifacts.

## Production Gaps

- **Programmatic CLI**: Parent dist needs exported runner function accepting argument vector
- **Signing certificates**: macOS Developer ID + Windows Authenticode required for distribution
- **Hook implementation**: Scripts document strategy but lack executable code
- **Update mechanism**: No delta update system configured
- **Crash reporting**: Telemetry pipeline not integrated

Scaffold demonstrates integration approach; additional work needed for release readiness.

## Workspace Scripts

From repository root:

```bash
pnpm --filter @openclaw/electron electron:dev   # Launch dev mode
pnpm --filter @openclaw/electron dist            # Package installers
```

Package filter syntax allows building without entering subdirectory.
