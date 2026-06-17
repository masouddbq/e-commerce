# اسکریپت دانلود و نصب curl با PowerShell

Write-Host "`n=== دانلود و نصب curl ===" -ForegroundColor Cyan

# تنظیم TLS برای دانلود
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# URL دانلود curl از GitHub
$curlUrl = "https://github.com/curl/curl/releases/download/curl-8_5_0/curl-8.5.0-win64-mingw.zip"
$downloadPath = "$env:TEMP\curl.zip"
$extractPath = "$env:TEMP\curl-extract"

Write-Host "`n1. دانلود curl از GitHub..." -ForegroundColor Yellow
try {
    # دانلود فایل
    Invoke-WebRequest -Uri $curlUrl -OutFile $downloadPath -UseBasicParsing
    Write-Host "   [OK] دانلود کامل شد" -ForegroundColor Green
} catch {
    Write-Host "   [FAIL] خطا در دانلود: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n   لینک جایگزین: https://github.com/curl/curl/releases/latest" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n2. استخراج فایل..." -ForegroundColor Yellow
try {
    # ایجاد پوشه استخراج
    if (Test-Path $extractPath) {
        Remove-Item $extractPath -Recurse -Force
    }
    New-Item -ItemType Directory -Path $extractPath -Force | Out-Null
    
    # استخراج ZIP
    Expand-Archive -Path $downloadPath -DestinationPath $extractPath -Force
    Write-Host "   [OK] استخراج کامل شد" -ForegroundColor Green
} catch {
    Write-Host "   [FAIL] خطا در استخراج: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n3. پیدا کردن curl.exe..." -ForegroundColor Yellow
$curlExe = Get-ChildItem -Path $extractPath -Filter "curl.exe" -Recurse | Select-Object -First 1

if (-not $curlExe) {
    Write-Host "   [FAIL] curl.exe پیدا نشد!" -ForegroundColor Red
    Write-Host "   مسیر استخراج: $extractPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "   [OK] curl.exe پیدا شد: $($curlExe.FullName)" -ForegroundColor Green

Write-Host "`n4. کپی به System32..." -ForegroundColor Yellow
try {
    # کپی به System32
    Copy-Item -Path $curlExe.FullName -Destination "C:\Windows\System32\curl.exe" -Force
    Write-Host "   [OK] curl.exe به System32 کپی شد" -ForegroundColor Green
} catch {
    Write-Host "   [FAIL] خطا در کپی: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   لطفاً PowerShell را به عنوان Administrator اجرا کنید" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n5. تست نصب..." -ForegroundColor Yellow
try {
    $version = & "C:\Windows\System32\curl.exe" --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] curl با موفقیت نصب شد!" -ForegroundColor Green
        Write-Host "   نسخه: $($version[0])" -ForegroundColor Gray
    } else {
        Write-Host "   [FAIL] curl نصب شد اما تست ناموفق بود" -ForegroundColor Red
    }
} catch {
    Write-Host "   [FAIL] خطا در تست: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ نصب کامل شد!" -ForegroundColor Green
Write-Host "`n⚠️ مهم: PowerShell را ببندید و دوباره باز کنید" -ForegroundColor Yellow
Write-Host "   سپس تست کنید: curl.exe --version" -ForegroundColor Cyan

# پاک کردن فایل‌های موقت
Write-Host "`n6. پاک کردن فایل‌های موقت..." -ForegroundColor Yellow
try {
    Remove-Item $downloadPath -Force -ErrorAction SilentlyContinue
    Remove-Item $extractPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   [OK] فایل‌های موقت پاک شدند" -ForegroundColor Green
} catch {
    Write-Host "   [SKIP] خطا در پاک کردن فایل‌های موقت (مهم نیست)" -ForegroundColor Yellow
}

