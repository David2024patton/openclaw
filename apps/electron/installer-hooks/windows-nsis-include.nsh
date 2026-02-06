; Windows NSIS installer include script for OpenClaw Electron app
; This script creates a CLI shim and adds it to the system PATH

; TODO: Implement Windows CLI shim installation
;
; This NSIS script should:
; 1. Create a batch file (openclaw.cmd) or small executable (openclaw.exe) shim
; 2. Install the shim to ${INSTDIR}\cli\ or similar
; 3. Add the shim directory to the system PATH using:
;    - WriteRegStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" "$PATH;${INSTDIR}\cli"
;    - Or use EnVar plugin for safer PATH manipulation
; 4. Broadcast WM_SETTINGCHANGE to notify applications of PATH change
;
; Example openclaw.cmd shim content:
; @echo off
; "%PROGRAMFILES%\OpenClaw\OpenClaw.exe" --cli %*
;
; Example NSIS code:
; Section "Install CLI Shim"
;   SetOutPath "$INSTDIR\cli"
;   
;   ; Create the shim batch file
;   FileOpen $0 "$INSTDIR\cli\openclaw.cmd" w
;   FileWrite $0 '@echo off$\r$\n'
;   FileWrite $0 '"%PROGRAMFILES%\OpenClaw\OpenClaw.exe" --cli %*$\r$\n'
;   FileClose $0
;   
;   ; Add to system PATH (requires admin)
;   EnVar::SetHKLM
;   EnVar::AddValue "PATH" "$INSTDIR\cli"
;   
;   ; Broadcast environment change
;   SendMessage ${HWND_BROADCAST} ${WM_SETTINGCHANGE} 0 "STR:Environment" /TIMEOUT=5000
; SectionEnd
;
; Notes:
; - Requires admin elevation (RequestExecutionLevel admin in main .nsi)
; - Test PATH modification doesn't break existing entries
; - Verify shim works in both cmd.exe and PowerShell
; - Consider using EnVar plugin for robust PATH manipulation

!echo "[openclaw-installer] Windows NSIS include (placeholder)"
!echo "[openclaw-installer] TODO: Implement CLI shim installation and PATH modification"
!echo "[openclaw-installer] Requires: Admin elevation for system PATH modification"

; Placeholder - no-op for now
Section "CLI Shim Placeholder"
  DetailPrint "TODO: Install CLI shim to system PATH"
SectionEnd
