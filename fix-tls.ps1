# اسکریپت فعال‌سازی TLS 1.2 برای Windows Server 2012 R2
# باید با دسترسی Administrator اجرا شود

Write-Host "`n=== فعال‌سازی TLS 1.2 ===" -ForegroundColor Cyan
Write-Host "این اسکریپت TLS 1.2 را برای .NET و Windows فعال می‌کند`n" -ForegroundColor Yellow

# بررسی دسترسی Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[ERROR] این اسکریپت باید با دسترسی Administrator اجرا شود!" -ForegroundColor Red
    Write-Host "لطفاً PowerShell را به عنوان Administrator باز کنید." -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] دسترسی Administrator تایید شد`n" -ForegroundColor Green

# 1. فعال‌سازی TLS 1.2 برای .NET Framework
Write-Host "1. فعال‌سازی TLS 1.2 برای .NET Framework..." -ForegroundColor Cyan

# برای 64-bit
$netPath = 'HKLM:\SOFTWARE\Microsoft\.NETFramework\v4.0.30319'
if (-not (Test-Path $netPath)) {
    New-Item -Path $netPath -Force | Out-Null
}
Set-ItemProperty -Path $netPath -Name 'SchUseStrongCrypto' -Value 1 -Type DWord -Force
Write-Host "   [OK] .NET Framework 64-bit" -ForegroundColor Green

# برای 32-bit (Wow6432Node)
$netPath32 = 'HKLM:\SOFTWARE\Wow6432Node\Microsoft\.NETFramework\v4.0.30319'
if (-not (Test-Path $netPath32)) {
    New-Item -Path $netPath32 -Force | Out-Null
}
Set-ItemProperty -Path $netPath32 -Name 'SchUseStrongCrypto' -Value 1 -Type DWord -Force
Write-Host "   [OK] .NET Framework 32-bit" -ForegroundColor Green

# 2. فعال‌سازی TLS 1.2 در Windows SCHANNEL
Write-Host "`n2. فعال‌سازی TLS 1.2 در Windows SCHANNEL..." -ForegroundColor Cyan

$tls12Path = 'HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2'
$tls12ClientPath = "$tls12Path\Client"
$tls12ServerPath = "$tls12Path\Server"

# ایجاد مسیرها
if (-not (Test-Path $tls12Path)) {
    New-Item -Path $tls12Path -Force | Out-Null
}
if (-not (Test-Path $tls12ClientPath)) {
    New-Item -Path $tls12ClientPath -Force | Out-Null
}
if (-not (Test-Path $tls12ServerPath)) {
    New-Item -Path $tls12ServerPath -Force | Out-Null
}

# فعال‌سازی Client
Set-ItemProperty -Path $tls12ClientPath -Name 'Enabled' -Value 1 -Type DWord -Force
Set-ItemProperty -Path $tls12ClientPath -Name 'DisabledByDefault' -Value 0 -Type DWord -Force
Write-Host "   [OK] TLS 1.2 Client" -ForegroundColor Green

# فعال‌سازی Server
Set-ItemProperty -Path $tls12ServerPath -Name 'Enabled' -Value 1 -Type DWord -Force
Set-ItemProperty -Path $tls12ServerPath -Name 'DisabledByDefault' -Value 0 -Type DWord -Force
Write-Host "   [OK] TLS 1.2 Server" -ForegroundColor Green

# 3. غیرفعال‌سازی TLS 1.0 و 1.1 (اختیاری - برای امنیت بیشتر)
Write-Host "`n3. غیرفعال‌سازی TLS 1.0 و 1.1 (اختیاری)..." -ForegroundColor Cyan
Write-Host "   [SKIP] این مرحله را رد می‌کنیم (برای سازگاری)" -ForegroundColor Yellow

# 4. تنظیم SecurityProtocol برای PowerShell جلسه فعلی
Write-Host "`n4. تنظیم SecurityProtocol برای PowerShell..." -ForegroundColor Cyan
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Write-Host "   [OK] TLS 1.2 برای جلسه فعلی فعال شد" -ForegroundColor Green

Write-Host "`n✅ تنظیمات TLS 1.2 اعمال شد!" -ForegroundColor Green
Write-Host "`n⚠️ برای اعمال کامل تغییرات:" -ForegroundColor Yellow
Write-Host "   1. IIS را restart کنید: iisreset" -ForegroundColor Cyan
Write-Host "   2. یا سرور را restart کنید (بهتر است)" -ForegroundColor Cyan
Write-Host "`n3. بعد از restart، تست کنید:" -ForegroundColor Yellow
Write-Host "   Invoke-WebRequest -Uri 'https://lent-shop.ir/api/test' -UseBasicParsing" -ForegroundColor Gray

