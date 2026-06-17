# 🔧 رفع مشکل: handlers کار نمی‌کند

## 🔍 مشکل

- ✅ `handlers` در web.config موجود است
- ✅ Express مستقیم کار می‌کند
- ❌ Response length از IIS: 41 کاراکتر (باید 3000+ باشد)

**نتیجه:** handlers اضافه شده اما هنوز کار نمی‌کند.

---

## 🔧 راه‌حل‌های ممکن

### راه‌حل 1: بررسی ترتیب Rule‌ها

**مشکل احتمالی:**
- Rule "Product SSR Proxy" باید قبل از "React Router" باشد
- یا rule دیگری زودتر match می‌شود

**بررسی:**

1. IIS Manager → Sites → lent-shop.ir → URL Rewrite
2. **Inbound Rules** را بررسی کنید
3. ترتیب باید این باشد:
   ```
   1. Product SSR Proxy (اول)
   2. React Router (آخر)
   ```

**اگر ترتیب اشتباه است:**
- Rule "Product SSR Proxy" را انتخاب کنید
- **↑ Move Up** را کلیک کنید تا به اول برسد
- **Apply** کنید

---

### راه‌حل 2: بررسی Application Pool

**مشکل احتمالی:**
- Application Pool ممکن است cache شده باشد

**راه‌حل:**

1. IIS Manager → Application Pools
2. Application Pool مربوط به سایت را پیدا کنید
3. **Recycle** را کلیک کنید
4. یا **Restart** کنید

---

### راه‌حل 3: بررسی Failed Request Tracing

**اگر هنوز مشکل دارید:**

1. IIS Manager → Sites → lent-shop.ir
2. **Failed Request Tracing Rules** → **Add...**
3. **Status code(s):** `200-999`
4. **Trace areas:** همه را انتخاب کنید
5. **Finish**

**بعد:**
```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996
```

**بررسی Log:**
```
C:\inetpub\logs\FailedReqLogFiles\W3SVC1\
```

**در Log دنبال `REWRITE` بگردید:**
- باید ببینید: `Rewrite to: http://localhost:4000/api/product/toyota/996`

**اگر `REWRITE` را نمی‌بینید:**
- Rule اجرا نشده است
- handlers کار نمی‌کند

---

### راه‌حل 4: بررسی web.config Syntax

**مشکل احتمالی:**
- Syntax web.config اشتباه است
- IIS نمی‌تواند آن را parse کند

**بررسی:**

```powershell
# بررسی Syntax
Get-Content "C:\e-commerce\dist\web.config" | Out-String | [xml]::new().LoadXml
```

**اگر خطا داد:**
- Syntax اشتباه است
- باید بررسی کنید

---

### راه‌حل 5: بررسی Response دقیق

**بررسی Response دقیق:**

```powershell
$result = curl.exe -s https://lent-shop.ir/product/toyota/996
Write-Host "Response:"
$result
Write-Host "Length: $($result.Length)"
```

**اگر Response خالی است یا HTML خالی است:**
- IIS دارد یک Response minimal می‌دهد
- handlers کار نمی‌کند

---

## ✅ مراحل رفع مشکل

### مرحله 1: بررسی Rule Order

1. IIS Manager → Sites → lent-shop.ir → URL Rewrite
2. ترتیب Rule‌ها را بررسی کنید
3. Rule "Product SSR Proxy" باید اول باشد

---

### مرحله 2: Recycle Application Pool

1. IIS Manager → Application Pools
2. Application Pool مربوط به سایت را پیدا کنید
3. **Recycle** را کلیک کنید

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

### مرحله 4: تست مجدد

```powershell
# تست 1: بررسی Response دقیق
$result = curl.exe -s https://lent-shop.ir/product/toyota/996
Write-Host "Response:"
$result
Write-Host "Length: $($result.Length)"

# تست 2: بررسی متاتگ
curl.exe -s https://lent-shop.ir/product/toyota/996 | findstr "product_id"

# تست 3: بررسی هدر
curl.exe -I https://lent-shop.ir/product/toyota/996 | findstr "X-SSR"
```

---

## 🔍 اگر هنوز مشکل دارید

نتیجه این دستورات را بفرستید:

```powershell
# 1. بررسی Response دقیق
$result = curl.exe -s https://lent-shop.ir/product/toyota/996
Write-Host "Response:"
$result
Write-Host "Length: $($result.Length)"

# 2. بررسی Rule Order
# در IIS Manager: Sites → lent-shop.ir → URL Rewrite → Inbound Rules
# ترتیب Rule‌ها را بفرستید

# 3. بررسی Application Pool
# در IIS Manager: Application Pools → نام Application Pool → Status
```

با این اطلاعات می‌توانم مشکل را دقیق‌تر تشخیص دهم.

