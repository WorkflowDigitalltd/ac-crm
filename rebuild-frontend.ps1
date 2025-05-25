Write-Host "Rebuilding and restarting frontend container..." -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Stopping frontend container..." -ForegroundColor Yellow
docker-compose stop frontend

Write-Host "Step 2: Removing frontend container..." -ForegroundColor Yellow
docker-compose rm -f frontend

Write-Host "Step 3: Rebuilding frontend image..." -ForegroundColor Yellow
docker-compose build --no-cache frontend

Write-Host "Step 4: Starting frontend container..." -ForegroundColor Yellow
docker-compose up -d frontend

Write-Host ""
Write-Host "Frontend container has been rebuilt and restarted!" -ForegroundColor Green
Write-Host "You can now access the application at http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to continue" 