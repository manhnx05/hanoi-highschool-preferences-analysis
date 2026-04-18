@echo off
echo ========================================
echo   EduData Analytics - Khoi chay ung dung
echo ========================================
echo.

echo [1/2] Khoi dong Backend Server...
cd backend
start cmd /k "python -m uvicorn main:app --reload"
timeout /t 3 /nobreak >nul

echo [2/2] Mo Frontend trong trinh duyet...
cd ..
start frontend\index.html

echo.
echo ========================================
echo   Ung dung da khoi chay thanh cong!
echo ========================================
echo.
echo Backend: http://127.0.0.1:8000
echo API Docs: http://127.0.0.1:8000/docs
echo Frontend: Da mo trong trinh duyet
echo.
echo Nhan phim bat ky de dong cua so nay...
pause >nul
