# ✅ راهنمای اعمال راه‌حل نهایی (کامل)

## 🔍 تغییرات اعمال شده

### 1. web.config ساده و درست

**تغییرات:**
- ✅ `<clear />` در handlers اضافه شد (خیلی مهم!)
- ✅ فقط Rule "Product SSR Proxy" باقی ماند
- ✅ Rule‌های اضافی حذف شدند

**چرا `<clear />` مهم است؟**
- بدون آن، IIS رفتار غیرقابل پیش‌بینی دارد
- با `<clear />`، همه handlers قبلی پاک می‌شوند و فقط StaticFile اضافه می‌شود

---

### 2. Express Binding

Express قبلاً روی `0.0.0.0` bind شده است ✅

---

### 3. فولدر product

فولدر `product` در `dist` وجود ندارد ✅

---

## 📋 مراحل اعمال در سرور

### مرحله 1: کپی web.config به سرور

**فایل `web.config` از پروژه local را به سرور کپی کنید:**

**مسیر در سرور:**
```
C:\e-commerce\dist\web.config
```

**مهم:** فایل را جایگزین کنید (نه merge).

**محتویات web.config:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <proxy enabled="true" preserveHostHeader="true" />
    <handlers>
      <clear />
      <add name="StaticFile" path="*" verb="*" 
           modules="StaticFileModule" resourceType="Either" requireAccess="Read" />
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
</configuration>
```

---

### مرحله 2: بررسی فولدر product

**اگر فولدر `product` در `C:\e-commerce\dist\` وجود دارد:**

```powershell
dir C:\e-commerce\dist
```

**اگر فولدر `product` را دیدید:**
```powershell
Remove-Item "C:\e-commerce\dist\product" -Recurse -Force
```

**یا Rename کنید:**
```powershell
Rename-Item "C:\e-commerce\dist\product" "product_disabled"
```

---

### مرحله 3: Restart کامل

```powershell
# Restart IIS
iisreset

# Restart Express
cd C:\e-commerce
pm2 restart lent-shop-api
```

---

## 🧪 تست‌های نهایی (خط قرمز)

### تست 1: بررسی هدر X-SSR

```powershell
curl.exe -I https://lent-shop.ir/product/toyota/996 | findstr "X-SSR"
```

**باید ببینید:**
```
X-SSR: EXPRESS-HIT
```

**اگر این هدر را دیدید → موفق است ✅**

---

### تست 2: بررسی متاتگ product_id

```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996 | findstr "product_id"
```

**باید ببینید:**
```
<meta name="product_id" content="996">
```

**اگر `product_id` را دیدید → موفق است ✅**

---

### تست 3: بررسی Response Length

```powershell
$result = curl.exe -s https://lent-shop.ir/product/toyota/996
Write-Host "Response length: $($result.Length)"
```

**باید ببینید:**
```
Response length: 3000+
```

**نه:**
```
Response length: 41
```

---

## ✅ چک‌لیست نهایی

- [ ] `web.config` به سرور کپی شد (با `<clear />` در handlers)
- [ ] فولدر `product` از `dist` حذف شد (اگر وجود داشت)
- [ ] IIS restart شد (`iisreset`)
- [ ] Express restart شد (`pm2 restart lent-shop-api`)
- [ ] تست 1 موفق است (X-SSR header)
- [ ] تست 2 موفق است (product_id)
- [ ] تست 3 موفق است (Response length: 3000+)

---

## 🎯 نتیجه

بعد از اعمال این تغییرات:
- ✅ IIS دیگر Static Content Handler را قبل از Rewrite اجرا نمی‌کند
- ✅ Rewrite Rule اجرا می‌شود
- ✅ درخواست‌های `/product/*` به Express می‌رسند
- ✅ Express HTML با متاتگ‌ها را برمی‌گرداند
- ✅ متاتگ‌ها در View Source قابل مشاهده هستند
- ✅ ربات‌ها (مثل ترب) می‌توانند متاتگ‌ها را بخوانند

---

## 🔧 اگر هنوز مشکل دارید

نتیجه این دستورات را بفرستید:

```powershell
# 1. بررسی web.config
Get-Content "C:\e-commerce\dist\web.config" | Select-String "clear"

# 2. بررسی فولدر product
dir C:\e-commerce\dist | Select-String "product"

# 3. تست Express مستقیم
curl.exe -s http://localhost:4000/api/product/toyota/996 | findstr "product_id"

# 4. تست از طریق IIS
curl.exe -s https://lent-shop.ir/product/toyota/996 | findstr "product_id"

# 5. Response length
$result = curl.exe -s https://lent-shop.ir/product/toyota/996
Write-Host "Response length: $($result.Length)"
```

با این اطلاعات می‌توانم مشکل را دقیق‌تر تشخیص دهم.

