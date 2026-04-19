@echo off
title EduData Analytics - Opening Browsers
color 0B

echo ========================================
echo   Opening EduData Analytics
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://127.0.0.1:8000
echo API Docs: http://127.0.0.1:8000/docs
echo.
echo Opening browsers...
echo.

start http://localhost:3000
timeout /t 2 /nobreak >nul
start http://127.0.0.1:8000/docs

echo.
echo ========================================
echo   Browsers Opened Successfully!
echo ========================================
echo.
pause
