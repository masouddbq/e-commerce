# 🚨 رفع فوری مشکل - محصولات و sitemap

## 🔍 مشکل شناسایی شده:

1. ❌ `web.config` در `dist/` یا در سرور به‌روز نشده است
2. ❌ فایل استاتیک `sitemap.xml` در `dist/` یا `public/` با route داینامیک تداخل دارد
3. ✅ سرور Express کار می‌کند (`localhost:4000` کار می‌کند)

---

## ✅ راه‌حل فوری:

### مرحله 1: حذف فایل استاتیک sitemap.xml

در سرور، این فایل‌ها را حذف یا rename کنید:

```powershell
# در سرور
cd C:\inetpub\wwwroot\lent-shop

# حذف یا rename فایل استاتیک sitemap.xml
# اگر وجود دارد:
Remove-Item "sitemap.xml" -ErrorAction SilentlyContinue
# یا rename کنید:
# Rename-Item "sitemap.xml" "sitemap-static.xml.backup"
```

**همچنین در `public/` (اگر در build کپی می‌شود):**
```powershell
cd C:\e-commerce\public
Remove-Item "sitemap.xml" -ErrorAction SilentlyContinue
```

---

### مرحله 2: Build گرفتن و کپی web.config

```powershell
# در سیستم محلی
cd E:\FrontProjects\Lent-shop-new\lent-shop

# Build گرفتن (web.config را به dist کپی می‌کند)
npm run build
```

**بررسی کنید:**
```powershell
# بررسی کنید که web.config در dist/ وجود دارد و rule های جدید را دارد
Get-Content "dist\web.config" | Select-String "Torob Products and Sitemap"
```

اگر خروجی داشت، یعنی rule وجود دارد ✅

---

### مرحله 3: انتقال فایل‌ها به سرور

#### الف) کپی web.config به سرور:

```powershell
# در سرور
# کپی web.config از dist به هاست
Copy-Item "C:\e-commerce\dist\web.config" -Destination "C:\inetpub\wwwroot\lent-shop\web.config" -Force
```

**یا به صورت دستی:**
1. فایل `dist/web.config` را از سیستم محلی کپی کنید
2. در سرور، فایل `C:\inetpub\wwwroot\lent-shop\web.config` را باز کنید
3. همه محتوا را جایگزین کنید

#### ب) بررسی محتوای web.config در سرور:

```powershell
# در سرور
Get-Content "C:\inetpub\wwwroot\lent-shop\web.config" | Select-String "Torob Products and Sitemap"
```

**باید خروجی داشته باشد!** اگر نداشت، فایل به‌روز نشده است.

---

### مرحله 4: Restart IIS

```powershell
# در سرور
iisreset
```

---

### مرحله 5: تست

```powershell
# تست از localhost (باید کار کند)
Invoke-WebRequest -Uri "http://localhost:4000/torob-products" | Select-Object StatusCode

# تست از دامنه (باید کار کند)
# از مرورگر تست کنید:
# https://lent-shop.ir/torob-products
# https://lent-shop.ir/sitemap.xml
```

---

## 📋 چک‌لیست کامل:

### در سیستم محلی:
- [ ] `web.config` در ریشه پروژه rule های جدید را دارد
- [ ] `npm run build` اجرا شده است
- [ ] `dist/web.config` rule های جدید را دارد

### در سرور:
- [ ] فایل استاتیک `sitemap.xml` از `C:\inetpub\wwwroot\lent-shop\` حذف شده است
- [ ] فایل `C:\inetpub\wwwroot\lent-shop\web.config` rule های جدید را دارد
- [ ] IIS restart شده است (`iisreset`)
- [ ] سرور Express در حال اجرا است (`pm2 status`)

---

## 🔍 بررسی دقیق web.config در سرور:

```powershell
# در سرور - بررسی rule ها
$config = Get-Content "C:\inetpub\wwwroot\lent-shop\web.config" -Raw

# بررسی rule "Torob Products and Sitemap"
if ($config -match "Torob Products and Sitemap") {
    Write-Host "✅ Rule 'Torob Products and Sitemap' وجود دارد" -ForegroundColor Green
} else {
    Write-Host "❌ Rule 'Torob Products and Sitemap' وجود ندارد!" -ForegroundColor Red
}

# بررسی ترتیب rule ها (باید قبل از Static Files باشد)
$torobIndex = $config.IndexOf("Torob Products and Sitemap")
$staticIndex = $config.IndexOf("Static Files")
if ($torobIndex -lt $staticIndex) {
    Write-Host "✅ ترتیب rule ها درست است" -ForegroundColor Green
} else {
    Write-Host "❌ ترتیب rule ها اشتباه است!" -ForegroundColor Red
}
```

---

## 🆘 اگر هنوز مشکل دارید:

### بررسی فایل استاتیک:
```powershell
# بررسی وجود فایل استاتیک sitemap.xml
Test-Path "C:\inetpub\wwwroot\lent-shop\sitemap.xml"
```

اگر `True` برگرداند، فایل وجود دارد و باید حذف شود!

### بررسی route در Express:
```powershell
# تست مستقیم route
Invoke-WebRequest -Uri "http://localhost:4000/torob-products" | Select-Object StatusCode, Content
Invoke-WebRequest -Uri "http://localhost:4000/sitemap.xml" | Select-Object StatusCode, Content
```

---

## ✅ تمام!

بعد از انجام این مراحل:
1. `https://lent-shop.ir/torob-products` باید لیست محصولات را نشان دهد
2. `https://lent-shop.ir/sitemap.xml` باید sitemap داینامیک با محصولات را نشان دهد

🎉

