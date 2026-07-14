@echo off
REM WiFi Analyzer Pro - Windows 11 Install & Run
REM Run this as Administrator

echo.
echo  WiFi Analyzer Pro - Windows Setup
echo  ===================================
echo.

REM Check Python
python --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo [!] Python not found. Install from https://python.org or run:
    echo     winget install Python.Python.3
    pause
    exit /b 1
)

REM Check Node
node --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo [!] Node.js not found. Install from https://nodejs.org or run:
    echo     winget install OpenJS.NodeJS
    pause
    exit /b 1
)

echo [*] Installing npm dependencies...
cd /d "%~dp0.."
call npm install

echo [*] Building frontend...
call npm run build

echo [*] Copying dist to backend folder...
xcopy /E /I /Y dist wifi_analyzer_backend\dist

echo [*] Installing Python dependencies...
pip install psutil --quiet

echo.
echo [OK] Setup complete!
echo [OK] Starting WiFi Analyzer Pro on http://localhost:199
echo [OK] Open your browser to: http://localhost:199
echo.

python wifi_analyzer_backend\server.py
pause
