# 📥 راهنمای نصب curl در Windows Server 2012 R2

## 🎯 روش 1: دانلود مستقیم (پیشنهادی)

### مرحله 1: دانلود curl

1. در سرور VPS، Internet Explorer یا مرورگر دیگری را باز کنید
2. به این آدرس بروید:
   ```
   https://curl.se/windows/
   ```
3. یا مستقیم:
   ```
   https://curl.se/download.html
   ```
4. در بخش "Windows" پیدا کنید: **"Win64 - Generic"**
5. فایل `curl-8.x.x-win64-mingw.zip` را دانلود کنید

### مرحله 2: استخراج فایل

1. فایل ZIP را استخراج کنید
2. پوشه `curl-8.x.x-win64-mingw` را باز کنید
3. داخل آن پوشه `bin` را پیدا کنید
4. فایل `curl.exe` را کپی کنید

### مرحله 3: قرار دادن در System PATH

**گزینه A: قرار دادن در System32 (ساده‌تر)**

1. فایل `curl.exe` را کپی کنید
2. به این مسیر بروید: `C:\Windows\System32`
3. فایل را در آنجا paste کنید

**گزینه B: اضافه کردن به PATH (بهتر)**

1. فایل `curl.exe` را در یک پوشه ثابت قرار دهید (مثلاً `C:\Tools\curl\`)
2. PowerShell را به عنوان Administrator باز کنید
3. این دستور را اجرا کنید:

```powershell
# اضافه کردن به PATH
$env:Path += ";C:\Tools\curl"
[Environment]::SetEnvironmentVariable("Path", $env:Path, [EnvironmentVariableTarget]::Machine)
```

---

## 🎯 روش 2: استفاده از Chocolatey (اگر نصب است)

### بررسی Chocolatey

```powershell
choco --version
```

اگر نصب است → ادامه دهید  
اگر نصب نیست → از روش 1 استفاده کنید

### نصب curl با Chocolatey

```powershell
choco install curl -y
```

---

## 🎯 روش 3: استفاده از Git Bash (اگر Git نصب است)

اگر Git نصب دارید، curl هم همراه آن است:

```powershell
# بررسی Git
git --version

# استفاده از curl از Git
& "C:\Program Files\Git\usr\bin\curl.exe" --version
```

---

## ✅ تست نصب

بعد از نصب، PowerShell را **ببندید و دوباره باز کنید** (به عنوان Administrator)، سپس:

```powershell
# تست curl
curl --version

# یا
curl.exe --version
```

اگر نسخه curl را دیدید → نصب موفق بوده ✅

---

## 🧪 تست با curl

بعد از نصب موفق:

```powershell
# تست Route API
curl https://lent-shop.ir/api/test

# تست Route محصول
curl https://lent-shop.ir/api/product/toyota/996

# تست و جستجوی product_id
curl https://lent-shop.ir/api/product/toyota/996 | Select-String "product_id"
```

---

## ⚠️ نکات مهم

1. **بعد از نصب، PowerShell را restart کنید** (ببندید و دوباره باز کنید)
2. اگر `curl --version` کار نکرد، از `curl.exe --version` استفاده کنید
3. اگر هنوز کار نکرد، مسیر کامل را استفاده کنید: `C:\Windows\System32\curl.exe`

---

## 🐛 رفع مشکلات

### مشکل: "curl is not recognized"

**راه‌حل:**
```powershell
# بررسی وجود فایل
Test-Path "C:\Windows\System32\curl.exe"

# اگر false بود، فایل را به System32 کپی کنید
```

### مشکل: "The remote name could not be resolved"

این یعنی curl به عنوان alias برای Invoke-WebRequest استفاده می‌شود.

**راه‌حل:**
```powershell
# استفاده از curl.exe به جای curl
curl.exe --version

# یا disable کردن alias
Remove-Item alias:curl
curl --version
```

