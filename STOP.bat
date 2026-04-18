@echo off
echo ========================================
echo   Dung Backend Server
echo ========================================
echo.

echo Dang tim va dung cac tien trinh Python (uvicorn)...
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *uvicorn*" 2>nul

if %errorlevel% equ 0 (
    echo Server da duoc dung thanh cong!
) else (
    echo Khong tim thay server dang chay.
)

echo.
echo Nhan phim bat ky de dong...
pause >nul
