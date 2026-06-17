# 🔧 Fix IIS Rules - بررسی و رفع مشکل Rule‌ها در IIS

Write-Host "`n=== بررسی و رفع مشکل IIS Rules ===" -ForegroundColor Cyan
Write-Host ""

# 1. بررسی مسیر web.config
$webConfigPath = "C:\inetpub\wwwroot\lent-shop\web.config"
Write-Host "[1] بررسی مسیر web.config..." -ForegroundColor Yellow

if (Test-Path $webConfigPath) {
    Write-Host "✅ web.config پیدا شد: $webConfigPath" -ForegroundColor Green
    
    # بررسی rule‌های مهم
    $content = Get-Content $webConfigPath -Raw
    
    if ($content -match 'SSR Product Pages') {
        Write-Host "✅ Rule 'SSR Product Pages' در web.config موجود است" -ForegroundColor Green
    } else {
        Write-Host "❌ Rule 'SSR Product Pages' در web.config موجود نیست!" -ForegroundColor Red
    }
    
    if ($content -match 'Ignore Product for SPA') {
        Write-Host "✅ Rule 'Ignore Product for SPA' در web.config موجود است" -ForegroundColor Green
    } else {
        Write-Host "❌ Rule 'Ignore Product for SPA' در web.config موجود نیست!" -ForegroundColor Red
    }
    
} else {
    Write-Host "❌ web.config پیدا نشد: $webConfigPath" -ForegroundColor Red
    Write-Host "لطفاً مسیر را بررسی کنید." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# 2. بررسی Application Pool
Write-Host "[2] بررسی Application Pool..." -ForegroundColor Yellow

try {
    Import-Module WebAdministration -ErrorAction Stop
    $appPools = Get-WebApplicationPool | Where-Object { $_.Name -like "*lent*" -or $_.Name -like "*shop*" }
    
    if ($appPools) {
        Write-Host "✅ Application Pool پیدا شد:" -ForegroundColor Green
        foreach ($pool in $appPools) {
            Write-Host "   - $($pool.Name) (Status: $($pool.State))" -ForegroundColor Cyan
        }
    } else {
        Write-Host "⚠️  Application Pool با نام 'lent' یا 'shop' پیدا نشد" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  WebAdministration Module در دسترس نیست" -ForegroundColor Yellow
}

Write-Host ""

# 3. Restart IIS
Write-Host "[3] Restart IIS..." -ForegroundColor Yellow
Write-Host "در حال restart کردن IIS..." -ForegroundColor Cyan

try {
    iisreset
    Write-Host "✅ IIS با موفقیت restart شد" -ForegroundColor Green
} catch {
    Write-Host "❌ خطا در restart کردن IIS" -ForegroundColor Red
    Write-Host "لطفاً به صورت دستی اجرا کنید: iisreset" -ForegroundColor Yellow
}

Write-Host ""

# 4. دستورالعمل‌های بعدی
Write-Host "=== دستورالعمل‌های بعدی ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  IIS Manager را باز کنید" -ForegroundColor Yellow
Write-Host "2️⃣  Sites → lent-shop → URL Rewrite را باز کنید" -ForegroundColor Yellow
Write-Host "3️⃣  بررسی کنید که rule‌های زیر موجود باشند (به ترتیب):" -ForegroundColor Yellow
Write-Host "   ✅ SSR Product Pages (اولین rule)" -ForegroundColor Green
Write-Host "   ✅ Ignore Product for SPA" -ForegroundColor Green
Write-Host "   ✅ React Router (آخرین rule)" -ForegroundColor Green
Write-Host ""
Write-Host "4️⃣  اگر rule‌های قدیمی را می‌بینید:" -ForegroundColor Yellow
Write-Host "   - آنها را Delete کنید" -ForegroundColor Cyan
Write-Host "   - Apply کنید" -ForegroundColor Cyan
Write-Host ""
Write-Host "5️⃣  بررسی Server Level Rules:" -ForegroundColor Yellow
Write-Host "   - Server Name (نه Site) → URL Rewrite" -ForegroundColor Cyan
Write-Host "   - اگر rule‌های قدیمی را می‌بینید، آنها را Delete یا Disable کنید" -ForegroundColor Cyan
Write-Host ""
Write-Host "6️⃣  IIS Manager را ببندید و دوباره باز کنید" -ForegroundColor Yellow
Write-Host ""

# 5. تست Pattern
Write-Host "=== تست Pattern ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "در IIS Manager:" -ForegroundColor Yellow
Write-Host "1. Rule 'SSR Product Pages' را انتخاب کنید" -ForegroundColor Cyan
Write-Host "2. Edit → Test Pattern" -ForegroundColor Cyan
Write-Host "3. URL: product/toyota/996" -ForegroundColor Cyan
Write-Host "4. باید Match شود ✅" -ForegroundColor Green
Write-Host ""

Write-Host "=== تمام ===" -ForegroundColor Cyan
Write-Host ""

