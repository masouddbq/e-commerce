# 🔧 راهنمای نصب .NET Framework 4.8 و curl

## 📋 مشکل

Chocolatey نیاز به .NET Framework 4.8 دارد برای نصب curl.

---

## ✅ مرحله 1: دانلود .NET Framework 4.8

### روش 1: دانلود مستقیم (پیشنهادی)

در مرورگر سرور VPS:

1. به این آدرس بروید:
   ```
   https://dotnet.microsoft.com/download/dotnet-framework/net48
   ```
2. یا مستقیم از لینک Chocolatey:
   ```
   https://download.visualstudio.microsoft.com/download/pr/2d6bb6b2-226a-4baa-bdec-798822606ff1/8494001c276a4b96804cde7829c04d7f/ndp48-x86-x64-allos-enu.exe
   ```
3. فایل `ndp48-x86-x64-allos-enu.exe` را دانلود کنید

---

## ✅ مرحله 2: نصب .NET Framework 4.8

1. فایل دانلود شده را اجرا کنید
2. مراحل نصب را دنبال کنید
3. **بعد از نصب، حتماً سرور را restart کنید**

---

## ✅ مرحله 3: بررسی نصب .NET 4.8

بعد از restart سرور:

```powershell
Get-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full' -Name Release
```

باید عددی **بالاتر از 528040** ببینید (برای .NET 4.8)

---

## ✅ مرحله 4: نصب curl با Chocolatey

بعد از نصب .NET 4.8 و restart:

```powershell
# نصب curl
choco install curl -y
```

---

## ✅ مرحله 5: تست curl

بعد از نصب:

```powershell
# بستن و باز کردن PowerShell
# سپس:
curl.exe --version
```

---

## ✅ مرحله 6: تست Route

```powershell
# تست Route API
curl.exe https://lent-shop.ir/api/test

# تست Route محصول
curl.exe https://lent-shop.ir/api/product/toyota/996

# تست و جستجوی product_id
curl.exe https://lent-shop.ir/api/product/toyota/996 | Select-String "product_id"
```

---

## 🐛 اگر مشکل داشتید

### مشکل: دانلود .NET 4.8 کار نمی‌کند

**راه‌حل:** از PowerShell دانلود کنید:

```powershell
# تنظیم TLS
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# دانلود .NET 4.8
$url = "https://download.visualstudio.microsoft.com/download/pr/2d6bb6b2-226a-4baa-bdec-798822606ff1/8494001c276a4b96804cde7829c04d7f/ndp48-x86-x64-allos-enu.exe"
$output = "$env:TEMP\ndp48-x86-x64-allos-enu.exe"
Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing

# اجرای نصب
Start-Process -FilePath $output -Wait
```

---

## 📋 خلاصه مراحل

1. ✅ دانلود .NET Framework 4.8
2. ✅ نصب .NET Framework 4.8
3. ✅ **Restart سرور** (خیلی مهم!)
4. ✅ بررسی نصب: `Get-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full' -Name Release`
5. ✅ نصب curl: `choco install curl -y`
6. ✅ تست: `curl.exe --version`
7. ✅ تست Route: `curl.exe https://lent-shop.ir/api/test`

---

## ⚠️ نکته مهم

**بعد از نصب .NET 4.8، حتماً سرور را restart کنید!**

بدون restart، Chocolatey نمی‌تواند curl را نصب کند.

