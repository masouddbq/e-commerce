@echo off
chcp 65001 >nul
echo 🚀 شروع راه‌اندازی پروژه لنت شاپ...
echo.

echo 📦 بررسی Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js نصب نشده! لطفاً ابتدا Node.js را نصب کنید.
    pause
    exit /b 1
)
node --version
echo ✅ Node.js نصب شده
echo.

echo 📦 بررسی npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm نصب نشده!
    pause
    exit /b 1
)
npm --version
echo ✅ npm نصب شده
echo.

echo 📥 نصب dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ خطا در نصب dependencies!
    pause
    exit /b 1
)
echo ✅ Dependencies نصب شدند
echo.

echo 🔐 بررسی فایل‌های .env...
if not exist ".env" (
    echo ⚠️  فایل .env در ریشه پروژه وجود ندارد!
    echo    لطفاً فایل .env را با استفاده از env.example ایجاد کنید.
) else (
    echo ✅ فایل .env در ریشه پروژه وجود دارد
)

if not exist "server\.env" (
    echo ⚠️  فایل server\.env وجود ندارد!
    echo    لطفاً فایل server\.env را ایجاد کنید.
) else (
    echo ✅ فایل server\.env وجود دارد
)
echo.

echo 🏗️  Build کردن فرانت...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ خطا در build کردن فرانت!
    pause
    exit /b 1
)
echo ✅ فرانت build شد
echo.

echo 📋 کپی web.config به dist...
if exist "web.config" (
    copy /Y "web.config" "dist\web.config" >nul
    echo ✅ web.config کپی شد
) else (
    echo ⚠️  فایل web.config وجود ندارد
)
echo.

echo 📁 ایجاد پوشه logs...
if not exist "logs" mkdir logs
echo ✅ پوشه logs ایجاد شد
echo.

echo 🔍 بررسی PM2...
pm2 --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  PM2 نصب نشده. در حال نصب...
    call npm install -g pm2
    call npm install -g pm2-windows-startup
    call pm2-startup install
    echo ✅ PM2 نصب شد
) else (
    echo ✅ PM2 نصب شده
)
echo.

echo 🚀 راه‌اندازی بک‌اند...
pm2 delete lent-shop-api >nul 2>&1
call pm2 start ecosystem.config.js
call pm2 save
echo ✅ بک‌اند راه‌اندازی شد
echo.

echo 📊 وضعیت PM2:
pm2 status
echo.

echo ✅ راه‌اندازی کامل شد!
echo.
echo 📝 مراحل بعدی:
echo    1. فایل‌های .env را بررسی و تنظیم کنید
echo    2. IIS را برای سرو کردن فرانت تنظیم کنید
echo    3. Firewall را برای باز کردن پورت 4000 تنظیم کنید
echo    4. دامنه خود را به VPS متصل کنید
echo.
echo 📖 برای اطلاعات بیشتر، فایل VPS_WINDOWS_SETUP.md را مطالعه کنید.
echo.
pause


