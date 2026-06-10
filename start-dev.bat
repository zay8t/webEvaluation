@echo off
REM ============================================================================
REM MY EYES - Full Stack Development Server Launcher
REM ============================================================================
REM This script starts both the frontend (Vite) and backend (Express) servers
REM ============================================================================

echo.
echo ============================================================
echo MY EYES - Starting Full Stack Development Environment
echo ============================================================
echo.
echo Frontend (Vite):  http://localhost:5173
echo Backend (Express): http://localhost:5000
echo.
echo Stopping servers: Press Ctrl+C in the terminal
echo ============================================================
echo.

npm run dev:all

pause
