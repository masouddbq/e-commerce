# 🔧 راهنمای ساده: رفع مشکل

## 🔍 مشکل چیست؟

**وضعیت فعلی:**
- ✅ Express کار می‌کند: `curl http://localhost:4000/api/product/toyota/996` → متاتگ دارد
- ✅ web.config درست است: Rule "Product SSR Proxy" موجود است
- ❌ IIS به Express forward نمی‌کند: `curl https://lent-shop.ir/product/toyota/996` → فقط 41 کاراکتر

**علت:**
IIS قبل از Rewrite، Static Content Handler را اجرا می‌کند و Response کوتاه می‌دهد.

---

## ✅ راه‌حل (3 مرحله ساده)

### مرحله 1: به‌روزرسانی web.config

**فایل `web.config` در سرور (`C:\e-commerce\dist\web.config`) باید این بخش را داشته باشد:**

```xml
<system.webServer>
  <proxy enabled="true" preserveHostHeader="true" />
  
  <!-- این بخش را اضافه کنید -->
  <handlers>
    <remove name="StaticFile" />
    <add name="StaticFile" path="*" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
  </handlers>
  
  <rewrite>
    <rules>
      <rule name="Product SSR Proxy" stopProcessing="true">
        <match url="^product/.*" />
        <action type="Rewrite" url="http://localhost:4000/api/{R:0}" />
      </rule>
    </rules>
  </rewrite>
</system.webServer>
```

**چکار کنیم:**
1. فایل `web.config` از پروژه local را باز کنید
2. همه محتوا را کپی کنید
3. در سرور، فایل `C:\e-commerce\dist\web.config` را باز کنید
4. همه محتوا را جایگزین کنید
5. ذخیره کنید

---

### مرحله 2: Restart

```powershell
# Restart IIS
iisreset

# Restart Express
cd C:\e-commerce
pm2 restart lent-shop-api
```

---

### مرحله 3: تست

```powershell
# تست 1: بررسی متاتگ
curl.exe -s https://lent-shop.ir/product/toyota/996 | findstr "product_id"

# تست 2: بررسی هدر
curl.exe -I https://lent-shop.ir/product/toyota/996 | findstr "X-SSR"

# تست 3: بررسی طول پاسخ
$result = curl.exe -s https://lent-shop.ir/product/toyota/996
Write-Host "Response length: $($result.Length)"
```

**باید ببینید:**
- `product_id` موجود است
- `X-SSR: EXPRESS-HIT` موجود است
- Response length بیشتر از 3000 کاراکتر است

---

## ❓ اگر هنوز کار نمی‌کند

### بررسی 1: Express در حال اجرا است؟

```powershell
pm2 list
```

**اگر Express نیست:**
```powershell
cd C:\e-commerce
pm2 start index.js --name lent-shop-api
pm2 save
```

---

### بررسی 2: web.config درست کپی شده است؟

```powershell
Get-Content "C:\e-commerce\dist\web.config" | Select-String "handlers"
```

**اگر چیزی نبود:**
- web.config درست کپی نشده است
- دوباره کپی کنید

---

### بررسی 3: Physical Path درست است؟

```powershell
Import-Module WebAdministration
$site = Get-Website | Where-Object { $_.Name -like "*lent*" }
$site.PhysicalPath
```

**باید ببینید:**
```
C:\e-commerce\dist
```

**اگر متفاوت است:**
- web.config را به مسیر صحیح کپی کنید

---

## 📋 چک‌لیست سریع

- [ ] web.config به `C:\e-commerce\dist\web.config` کپی شد
- [ ] بخش `<handlers>` در web.config موجود است
- [ ] Rule "Product SSR Proxy" در web.config موجود است
- [ ] IIS restart شد (`iisreset`)
- [ ] Express restart شد (`pm2 restart lent-shop-api`)
- [ ] تست‌ها موفق هستند

---

## 🎯 خلاصه

**مشکل:** IIS قبل از Rewrite، Static Content Handler را اجرا می‌کند.

**راه‌حل:** اضافه کردن `<handlers>` به web.config تا Rewrite قبل از Static اجرا شود.

**مراحل:**
1. web.config را به‌روزرسانی کنید (با handlers)
2. IIS و Express را restart کنید
3. تست کنید

اگر بعد از این مراحل هنوز کار نمی‌کند، نتیجه تست‌ها را بفرستید.

