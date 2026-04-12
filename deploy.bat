echo ===============================
echo Fetching latest...
echo ===============================
git fetch
if %errorlevel% neq 0 exit /b %errorlevel%

for /f %%i in ('git rev-parse HEAD') do set LOCAL=%%i
for /f %%i in ('git rev-parse origin/main') do set REMOTE=%%i

echo LOCAL  = %LOCAL%
echo REMOTE = %REMOTE%

if "%LOCAL%"=="%REMOTE%" (
    pm2 describe server-yugi >nul 2>&1

    if errorlevel 1 (
        echo ===============================
        echo PM2 app not found. Starting...
        echo ===============================
        pm2 start ecosystem.config.js
    ) else (
        echo ===============================
        echo PM2 app exists. Restarting...
        echo ===============================
        pm2 restart server-yugi --update-env
    )

    pm2 logs server-yugi
    exit /b 0
)

echo ===============================
echo New code detected. Pulling...
echo ===============================
git pull origin main
if %errorlevel% neq 0 exit /b %errorlevel%

echo ===============================
echo Installing dependencies...
echo ===============================
npm i
if %errorlevel% neq 0 exit /b %errorlevel%

echo ===============================
echo Building project...
echo ===============================
npm run build
if %errorlevel% neq 0 exit /b %errorlevel%

echo ===============================
echo Restart PM2 clean...
echo ===============================
pm2 delete all

echo ===============================
echo Start PM2 with ecosystem...
echo ===============================
pm2 start ecosystem.config.js

echo ===============================
echo Save PM2 processes...
echo ===============================
pm2 save

echo ===============================
echo Show logs...
echo ===============================
pm2 logs server-yugi