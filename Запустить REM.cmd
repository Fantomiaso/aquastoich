@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Требуется Node.js. Установите его и повторите запуск.
  pause
  exit /b 1
)
start "REM server" /min cmd /c "node server.mjs"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4173"
