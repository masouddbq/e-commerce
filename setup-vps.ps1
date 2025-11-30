# اسکریپت PowerShell برای راه‌اندازی خودکار روی VPS ویندوز

Write-Host "🚀 شروع راه‌اندازی پروژه لنت شاپ..." -ForegroundColor Green

# بررسی Node.js
Write-Host "`n📦 بررسی Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js نصب شده: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js نصب نشده! لطفاً ابتدا Node.js را نصب کنید." -ForegroundColor Red
    exit 1
}

# بررسی npm
Write-Host "`n📦 بررسی npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm نصب شده: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm نصب نشده!" -ForegroundColor Red
    exit 1
}

# نصب dependencies
Write-Host "`n📥 نصب dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ خطا در نصب dependencies!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies نصب شدند" -ForegroundColor Green

# بررسی فایل‌های .env
Write-Host "`n🔐 بررسی فایل‌های .env..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  فایل .env در ریشه پروژه وجود ندارد!" -ForegroundColor Yellow
    Write-Host "   لطفاً فایل .env را با استفاده از env.example ایجاد کنید." -ForegroundColor Yellow
} else {
    Write-Host "✅ فایل .env در ریشه پروژه وجود دارد" -ForegroundColor Green
}

if (-not (Test-Path "server\.env")) {
    Write-Host "⚠️  فایل server\.env وجود ندارد!" -ForegroundColor Yellow
    Write-Host "   لطفاً فایل server\.env را ایجاد کنید." -ForegroundColor Yellow
} else {
    Write-Host "✅ فایل server\.env وجود دارد" -ForegroundColor Green
}

# Build فرانت
Write-Host "`n🏗️  Build کردن فرانت..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ خطا در build کردن فرانت!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ فرانت build شد" -ForegroundColor Green

# کپی web.config به dist
Write-Host "`n📋 کپی web.config به dist..." -ForegroundColor Yellow
if (Test-Path "web.config") {
    Copy-Item "web.config" -Destination "dist\web.config" -Force
    Write-Host "✅ web.config کپی شد" -ForegroundColor Green
} else {
    Write-Host "⚠️  فایل web.config وجود ندارد" -ForegroundColor Yellow
}

# ایجاد پوشه logs
Write-Host "`n📁 ایجاد پوشه logs..." -ForegroundColor Yellow
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
    Write-Host "✅ پوشه logs ایجاد شد" -ForegroundColor Green
}

# بررسی PM2
Write-Host "`n🔍 بررسی PM2..." -ForegroundColor Yellow
try {
    $pm2Version = pm2 --version
    Write-Host "✅ PM2 نصب شده: $pm2Version" -ForegroundColor Green
} catch {
    Write-Host "⚠️  PM2 نصب نشده. در حال نصب..." -ForegroundColor Yellow
    npm install -g pm2
    npm install -g pm2-windows-startup
    pm2-startup install
    Write-Host "✅ PM2 نصب شد" -ForegroundColor Green
}

# راه‌اندازی بک‌اند
Write-Host "`n🚀 راه‌اندازی بک‌اند..." -ForegroundColor Yellow
pm2 delete lent-shop-api 2>$null
pm2 start ecosystem.config.js
pm2 save
Write-Host "✅ بک‌اند راه‌اندازی شد" -ForegroundColor Green

# نمایش وضعیت
Write-Host "`n📊 وضعیت PM2:" -ForegroundColor Cyan
pm2 status

Write-Host "`n✅ راه‌اندازی کامل شد!" -ForegroundColor Green
Write-Host "`n📝 مراحل بعدی:" -ForegroundColor Yellow
Write-Host "   1. فایل‌های .env را بررسی و تنظیم کنید" -ForegroundColor White
Write-Host "   2. IIS را برای سرو کردن فرانت تنظیم کنید" -ForegroundColor White
Write-Host "   3. Firewall را برای باز کردن پورت 4000 تنظیم کنید" -ForegroundColor White
Write-Host "   4. دامنه خود را به VPS متصل کنید" -ForegroundColor White
Write-Host "`n📖 برای اطلاعات بیشتر، فایل VPS_WINDOWS_SETUP.md را مطالعه کنید." -ForegroundColor Cyan


