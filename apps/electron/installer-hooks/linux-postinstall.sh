#!/bin/bash
# Linux post-install script for OpenClaw Electron app (deb package)
# This script creates a system-wide CLI shim symlink

set -e

# TODO: Implement Linux CLI shim installation
#
# This script should:
# 1. Create a shell script or symlink at /usr/local/bin/openclaw
# 2. Make it executable (chmod +x)
# 3. The shim should invoke the installed Electron app in headless CLI mode
#
# Example implementation:
# APP_PATH="/opt/OpenClaw/openclaw"
# SHIM_PATH="/usr/local/bin/openclaw"
# 
# cat > "$SHIM_PATH" << 'SHIMEOF'
# #!/bin/bash
# exec "/opt/OpenClaw/openclaw" --cli "$@"
# SHIMEOF
#
# chmod +x "$SHIM_PATH"
#
# Notes:
# - For .deb packages, this runs as root during dpkg installation
# - For AppImage, users must manually run this or add to PATH
# - Verify /usr/local/bin exists and is in user PATH
# - Test with both sudo and non-sudo invocations

echo "[openclaw-installer] Linux post-install hook (placeholder)"
echo "[openclaw-installer] TODO: Implement CLI shim installation at /usr/local/bin/openclaw"
echo "[openclaw-installer] Note: Requires root permissions for system-wide installation"

exit 0
