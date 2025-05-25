@echo off
echo Rebuilding and restarting frontend container...
echo.

echo Step 1: Stopping frontend container...
docker-compose stop frontend

echo Step 2: Removing frontend container...
docker-compose rm -f frontend

echo Step 3: Rebuilding frontend image...
docker-compose build --no-cache frontend

echo Step 4: Starting frontend container...
docker-compose up -d frontend

echo.
echo Frontend container has been rebuilt and restarted!
echo You can now access the application at http://localhost:3000
echo.
pause 