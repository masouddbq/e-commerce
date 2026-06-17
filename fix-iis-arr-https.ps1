# PowerShell Script برای رفع مشکل IIS + ARR + HTTPS
# این اسکریپت مراحل 1 و 2 را به صورت خودکار انجام می‌دهد

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "رفع مشکل IIS + ARR + HTTPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# بررسی Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "❌ این اسکریپت باید به عنوان Administrator اجرا شود!" -ForegroundColor Red
    Write-Host "لطفاً PowerShell را به عنوان Administrator باز کنید و دوباره اجرا کنید." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ اجرا به عنوان Administrator" -ForegroundColor Green
Write-Host ""

# مرحله 1: فعال‌سازی Allow Double Escaping
Write-Host "🟢 مرحله 1: فعال‌سازی Allow Double Escaping..." -ForegroundColor Yellow
try {
    Set-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/security/requestFiltering" -Name "allowDoubleEscaping" -Value $true
    Write-Host "✅ Allow Double Escaping فعال شد" -ForegroundColor Green
} catch {
    Write-Host "❌ خطا در فعال‌سازی Allow Double Escaping: $_" -ForegroundColor Red
    exit 1
}

# فعال‌سازی Allow unescaped percent sign
Write-Host "🟢 فعال‌سازی Allow unescaped percent sign..." -ForegroundColor Yellow
try {
    Set-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/security/requestFiltering" -Name "allowUnescapedPercentInQueryString" -Value $true
    Write-Host "✅ Allow unescaped percent sign فعال شد" -ForegroundColor Green
} catch {
    Write-Host "⚠️  خطا در فعال‌سازی Allow unescaped percent sign (ممکن است در IIS شما موجود نباشد): $_" -ForegroundColor Yellow
}

Write-Host ""

# مرحله 2: تنظیم allowUnescapedCharacters برای Rewrite
Write-Host "🟢 مرحله 2: تنظیم allowUnescapedCharacters برای Rewrite..." -ForegroundColor Yellow
try {
    # ابتدا بررسی می‌کنیم که آیا این property وجود دارد
    $currentValue = Get-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/rewrite" -Name "allowUnescapedCharacters" -ErrorAction SilentlyContinue
    
    if ($null -eq $currentValue) {
        Write-Host "⚠️  Property allowUnescapedCharacters در IIS شما موجود نیست" -ForegroundColor Yellow
        Write-Host "   این تنظیم باید به صورت دستی در IIS Manager انجام شود:" -ForegroundColor Yellow
        Write-Host "   Site → Configuration Editor → system.webServer/rewrite → allowUnescapedCharacters = true" -ForegroundColor Yellow
    } else {
        Set-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/rewrite" -Name "allowUnescapedCharacters" -Value $true
        Write-Host "✅ allowUnescapedCharacters = true تنظیم شد" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  خطا در تنظیم allowUnescapedCharacters: $_" -ForegroundColor Yellow
    Write-Host "   این تنظیم باید به صورت دستی در IIS Manager انجام شود" -ForegroundColor Yellow
}

Write-Host ""

# بررسی تنظیمات
Write-Host "🔍 بررسی تنظیمات اعمال شده..." -ForegroundColor Cyan
Write-Host ""

try {
    $doubleEscaping = Get-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/security/requestFiltering" -Name "allowDoubleEscaping"
    Write-Host "Allow Double Escaping: $($doubleEscaping.Value)" -ForegroundColor $(if ($doubleEscaping.Value) { "Green" } else { "Red" })
} catch {
    Write-Host "❌ خطا در بررسی Allow Double Escaping" -ForegroundColor Red
}

try {
    $unescapedChars = Get-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/rewrite" -Name "allowUnescapedCharacters" -ErrorAction SilentlyContinue
    if ($unescapedChars) {
        Write-Host "Allow Unescaped Characters: $($unescapedChars.Value)" -ForegroundColor $(if ($unescapedChars.Value) { "Green" } else { "Red" })
    } else {
        Write-Host "Allow Unescaped Characters: نیاز به تنظیم دستی در IIS Manager" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Allow Unescaped Characters: نیاز به تنظیم دستی در IIS Manager" -ForegroundColor Yellow
}

Write-Host ""

# Restart IIS
Write-Host "🔄 Restart IIS..." -ForegroundColor Yellow
try {
    iisreset
    Write-Host "✅ IIS restart شد" -ForegroundColor Green
} catch {
    Write-Host "❌ خطا در restart IIS: $_" -ForegroundColor Red
    Write-Host "لطفاً به صورت دستی اجرا کنید: iisreset" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ مراحل 1 و 2 تکمیل شد!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 مراحل بعدی:" -ForegroundColor Yellow
Write-Host "1. Rule TEST PROXY را به web.config اضافه کنید (مرحله 3)" -ForegroundColor White
Write-Host "2. Failed Request Tracing را فعال کنید (مرحله 4)" -ForegroundColor White
Write-Host "3. تست‌ها را انجام دهید" -ForegroundColor White
Write-Host ""
Write-Host "برای جزئیات بیشتر، فایل FIX_IIS_ARR_HTTPS.md را بخوانید." -ForegroundColor Cyan

