# OpenClaw Rebuild & Cache-Buster Script
# This script ensures a 100% clean rebuild of the Gateway and UI.

Write-Host "🚀 Starting Deep Rebuild of OpenClaw..." -ForegroundColor Cyan

# 1. Stop all containers
Write-Host "🛑 Stopping containers..." -ForegroundColor Yellow
docker compose down

# 2. Clear build artifacts and Vite cache
Write-Host "🧹 Clearing stale artifacts (dist, .vite)..." -ForegroundColor Yellow
Remove-Item -Path "ui/dist", "dist", "ui/node_modules/.vite" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Perform a clean build
Write-Host "🏗️ Rebuilding images with --no-cache (this may take a few minutes)..." -ForegroundColor Yellow
docker compose build --no-cache

# 4. Start everything backup
Write-Host "🏁 Starting services..." -ForegroundColor Green
docker compose up -d

Write-Host "`n✅ SUCCESS! All services are fresh and running." -ForegroundColor Green
Write-Host "Primary Gateway Dashboard: http://localhost:49321/tools" -ForegroundColor Gray
Write-Host "UI Development Server:   http://localhost:58765/tools" -ForegroundColor Gray
Write-Host "`nNote: Check the sidebar for the 'Built:' timestamp to verify the fresh build." -ForegroundColor Cyan
