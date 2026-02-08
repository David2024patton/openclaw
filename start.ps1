# OpenClaw Start Script
# Launches the gateway + admin dashboard together
# Usage: .\start.ps1 [-DashboardPort 5180] [-NoAdmin]

param(
    [int]$DashboardPort = 5180,
    [switch]$NoAdmin
)

$ErrorActionPreference = "Continue"
$OPENCLAW_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$ADMIN_DIR = Join-Path $OPENCLAW_DIR "admin"

Write-Host ""
Write-Host "  OpenClaw Launcher" -ForegroundColor Cyan
Write-Host "  =================" -ForegroundColor DarkCyan
Write-Host ""

# --- Start Gateway ---
Write-Host "  [1/3] Starting OpenClaw Gateway..." -ForegroundColor Yellow
$gateway = Start-Process powershell -ArgumentList "-Command", "openclaw gateway run" -PassThru -WindowStyle Minimized
Write-Host "        Gateway PID: $($gateway.Id)" -ForegroundColor Green

Start-Sleep -Seconds 4

if (-not $NoAdmin) {
    # --- Start Backend ---
    Write-Host "  [2/3] Starting Admin Backend (port 5181)..." -ForegroundColor Yellow
    $backend = Start-Process powershell -ArgumentList "-Command", "cd '$ADMIN_DIR'; npx tsx server/index.ts" -PassThru -WindowStyle Minimized
    Write-Host "        Backend PID: $($backend.Id)" -ForegroundColor Green

    Start-Sleep -Seconds 3

    # --- Start Frontend ---
    Write-Host "  [3/3] Starting Admin Frontend (port $DashboardPort)..." -ForegroundColor Yellow
    $frontend = Start-Process powershell -ArgumentList "-Command", "cd '$ADMIN_DIR'; npx vite --port $DashboardPort" -PassThru -WindowStyle Minimized
    Write-Host "        Frontend PID: $($frontend.Id)" -ForegroundColor Green

    Start-Sleep -Seconds 2

    Write-Host ""
    Write-Host "  =================================" -ForegroundColor Green
    Write-Host "  All services running!" -ForegroundColor Green
    Write-Host "  Dashboard: http://localhost:$DashboardPort" -ForegroundColor Cyan
    Write-Host "  Gateway:   ws://localhost:18798" -ForegroundColor Cyan
    Write-Host "  =================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Press Enter to stop all services..." -ForegroundColor DarkGray
    Read-Host

    Write-Host "  Shutting down..." -ForegroundColor Yellow
    Stop-Process -Id $gateway.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $frontend.Id -Force -ErrorAction SilentlyContinue
    Write-Host "  All services stopped." -ForegroundColor Green
}
else {
    Write-Host ""
    Write-Host "  Gateway running! (Dashboard disabled)" -ForegroundColor Green
    Write-Host "  Press Enter to stop..." -ForegroundColor DarkGray
    Read-Host
    Stop-Process -Id $gateway.Id -Force -ErrorAction SilentlyContinue
    Write-Host "  Gateway stopped." -ForegroundColor Green
}
