# 🍫 راهنمای نصب Chocolatey و curl

## 📋 مرحله 1: نصب Chocolatey

### بررسی نصب بودن Chocolatey

ابتدا بررسی کنید که آیا Chocolatey نصب است:

```powershell
choco --version
```

اگر نسخه را دیدید → Chocolatey نصب است، به مرحله 2 بروید  
اگر خطا داد → Chocolatey نصب نیست، ادامه دهید

---

### نصب Chocolatey

در PowerShell (به عنوان Administrator):

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

یا دستور ساده‌تر:

```powershell
iwr https://community.chocolatey.org/install.ps1 -UseBasicParsing | iex
```

**نکته:** اگر خطای TLS گرفتید، این دستور را اول اجرا کنید:

```powershell
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
```

سپس دوباره دستور نصب را اجرا کنید.

---

### بررسی نصب موفق

بعد از نصب:

```powershell
# بستن و باز کردن PowerShell (مهم!)
# سپس:
choco --version
```

اگر نسخه را دیدید → نصب موفق بود ✅

---

## 📦 مرحله 2: نصب curl با Chocolatey

بعد از نصب Chocolatey:

```powershell
# نصب curl
choco install curl -y
```

یا:

```powershell
choco install curl -y --force
```

---

### بررسی نصب curl

بعد از نصب:

```powershell
# بستن و باز کردن PowerShell
# سپس:
curl --version
```

یا:

```powershell
curl.exe --version
```

---

## 🧪 مرحله 3: تست curl

بعد از نصب موفق:

```powershell
# تست 1: Route API
curl.exe https://lent-shop.ir/api/test

# تست 2: Route محصول
curl.exe https://lent-shop.ir/api/product/toyota/996

# تست 3: جستجوی product_id
curl.exe https://lent-shop.ir/api/product/toyota/996 | Select-String "product_id"
```

---

## 🐛 رفع مشکلات

### مشکل 1: "choco is not recognized"

**راه‌حل:**
1. PowerShell را ببندید و دوباره باز کنید
2. یا محیط را refresh کنید:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

### مشکل 2: خطای TLS در نصب Chocolatey

**راه‌حل:**
```powershell
# اول این را اجرا کنید
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# سپس نصب را دوباره انجام دهید
```

### مشکل 3: "Execution Policy"

**راه‌حل:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

---

## ✅ چک‌لیست

- [ ] Chocolatey نصب شد (`choco --version`)
- [ ] curl نصب شد (`curl --version`)
- [ ] PowerShell restart شد
- [ ] تست Route API موفق بود
- [ ] متاتگ product_id پیدا شد

