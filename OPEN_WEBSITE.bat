@echo off
echo ========================================
echo   Opening EduData Analytics
echo ========================================
echo.
echo Frontend (Next.js): http://localhost:3000
echo Backend API: http://127.0.0.1:8000
echo API Docs: http://127.0.0.1:8000/docs
echo.
echo Opening browser...
echo.

REM Open frontend
start http://localhost:3000

REM Wait 2 seconds
timeout /t 2 /nobreak >nul

REM Open API docs
start http://127.0.0.1:8000/docs

echo.
echo ========================================
echo   Browsers opened successfully!
echo ========================================
echo.
pause
