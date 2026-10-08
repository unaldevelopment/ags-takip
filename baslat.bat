@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo AGS Takip test sunucusu baslatiliyor...
echo Bilgisayarda:  http://localhost:8080/
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do echo Tablette:      http://%%a:8080/  (ayni Wi-Fi'da olmali, bosluklari silin)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0sunucu.ps1"
pause
