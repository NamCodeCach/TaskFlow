@echo off
cd /d "%~dp0frontend"
echo ============================================
echo   TaskFlow Frontend - Next.js
echo   Dia chi: http://localhost:3000
echo ============================================
call npm run dev
pause
