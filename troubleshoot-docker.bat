@echo off

:menu
echo.
echo ========================================
echo    AC-CRM Docker Troubleshooting
echo ========================================
echo.
echo What issue are you experiencing?
echo.
echo 1. Code changes not showing (try restart first)
echo 2. Frontend changes still not showing (rebuild frontend)
echo 3. Backend changes still not showing (rebuild backend)
echo 4. Nothing works (nuclear option - rebuild all)
echo 5. Check container status
echo 6. View container logs
echo 0. Exit
echo.
set /p choice="Enter your choice (0-6): "

if "%choice%"=="1" goto restart
if "%choice%"=="2" goto rebuild_frontend
if "%choice%"=="3" goto rebuild_backend
if "%choice%"=="4" goto rebuild_all
if "%choice%"=="5" goto status
if "%choice%"=="6" goto logs
if "%choice%"=="0" goto exit
goto invalid

:restart
echo.
echo Restarting all services...
docker-compose restart
echo.
echo Done! Check if your changes are now visible.
echo If not, try option 2 or 3 for rebuilding.
goto end

:rebuild_frontend
echo.
echo Rebuilding frontend (this may take a few minutes)...
echo Step 1: Stopping frontend...
docker-compose stop frontend
echo Step 2: Removing frontend container...
docker-compose rm -f frontend
echo Step 3: Building frontend with no cache...
docker-compose build --no-cache frontend
echo Step 4: Starting frontend...
docker-compose up -d frontend
echo.
echo Frontend rebuilt! Try refreshing your browser with Ctrl+F5
goto end

:rebuild_backend
echo.
echo Rebuilding backend (this may take a few minutes)...
echo Step 1: Stopping backend...
docker-compose stop backend
echo Step 2: Removing backend container...
docker-compose rm -f backend
echo Step 3: Building backend with no cache...
docker-compose build --no-cache backend
echo Step 4: Starting backend...
docker-compose up -d backend
echo.
echo Backend rebuilt!
goto end

:rebuild_all
echo.
echo WARNING: This will rebuild ALL containers (takes longest time)
set /p confirm="Are you sure? (y/N): "
if /i not "%confirm%"=="y" goto menu
echo.
echo Rebuilding all services...
docker-compose down
docker-compose build --no-cache
docker-compose up -d
echo.
echo All services rebuilt!
goto end

:status
echo.
echo Container Status:
docker-compose ps
goto end

:logs
echo.
echo Which service logs do you want to see?
echo 1. Frontend
echo 2. Backend
echo 3. Database
set /p log_choice="Enter choice (1-3): "
if "%log_choice%"=="1" docker-compose logs frontend --tail 20
if "%log_choice%"=="2" docker-compose logs backend --tail 20
if "%log_choice%"=="3" docker-compose logs db --tail 20
goto end

:invalid
echo Invalid choice. Please try again.
goto menu

:end
echo.
echo ========================================
echo Troubleshooting complete!
echo.
echo Remember:
echo - Always try restart first (option 1)
echo - Use Ctrl+F5 to hard refresh browser
echo - Check browser developer console for errors
echo ========================================
pause
goto exit

:exit 