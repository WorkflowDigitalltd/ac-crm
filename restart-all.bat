@echo off
echo Restarting all AC-CRM services...
echo.

echo Step 1: Stopping all containers...
docker-compose down

echo Step 2: Starting all containers...
docker-compose up -d

echo.
echo All services have been restarted!
echo - Database: http://localhost:5432
echo - Backend API: http://localhost:5000
echo - Frontend: http://localhost:3000
echo.
pause 