@echo off
echo ========================================
echo   Mo Trang Web - EduData Analytics
echo ========================================
echo.

echo Dang mo cac trang web...
echo.

REM Mo trang chu
echo [1/5] Mo Trang chu...
start "" "frontend\index.html"
timeout /t 2 /nobreak >nul

REM Mo trang xep hang
echo [2/5] Mo Trang Xep hang...
start "" "frontend\rankings.html"
timeout /t 1 /nobreak >nul

REM Mo trang so sanh
echo [3/5] Mo Trang So sanh...
start "" "frontend\compare.html"
timeout /t 1 /nobreak >nul

REM Mo trang chi tiet (vi du: truong ID=1)
echo [4/5] Mo Trang Chi tiet...
start "" "frontend\school-detail.html?id=1"
timeout /t 1 /nobreak >nul

REM Mo trang phan tich
echo [5/5] Mo Trang Phan tich...
start "" "frontend\advanced-analytics.html"

echo.
echo ========================================
echo   Da mo tat ca 5 trang trong trinh duyet!
echo ========================================
echo.
echo Luu y: Backend server phai dang chay
echo       (Chay START.bat neu chua chay)
echo.
pause
