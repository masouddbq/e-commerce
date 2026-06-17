# ✅ راه‌حل نهایی: رفع مشکل Static Content Handler

## 🔍 مشکل اصلی (Root Cause)

**IIS قبل از Rewrite، Static Content Handler را اجرا می‌کند.**

این باعث می‌شود:
- Response فقط 41 کاراکتر باشد (HTML خالی یا DefaultDocument)
- Rewrite Rule اجرا نشود
- درخواست به Express نرسد

---

## ✅ راه‌حل اعمال شده

### 1. اضافه کردن Handlers به web.config

```xml
<handlers>
  <remove name="StaticFile" />
  <add name="StaticFile" path="*" verb="*" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
</handlers>
```

**چرا؟**
- این باعث می‌شود Rewrite قبل از Static File Handler اجرا شود
- IIS دیگر تلاش نمی‌کند مسیر `/product/*` را به عنوان Static File serve کند

---

### 2. بررسی Express Binding

Express قبلاً روی `0.0.0.0` bind شده است:
```javascript
app.listen(PORT, '0.0.0.0', () => {
```

**این درست است ✅**

---

## 📋 مراحل اعمال در سرور

### مرحله 1: کپی web.config به سرور

فایل `web.config` از پروژه local را به سرور کپی کنید:

**مسیر در سرور:**
```
C:\e-commerce\dist\web.config
```

**مهم:** فایل را جایگزین کنید (نه merge).

---

### مرحله 2: بررسی فولدر product در dist

**اگر فولدر `product` در `C:\e-commerce\dist\` وجود دارد:**

1. آن را **Delete** کنید
2. یا **Rename** کنید به `product_disabled`

**اگر فولدر `product` وجود ندارد:**
- مشکلی نیست، به مرحله بعد بروید

---

### مرحله 3: Restart IIS

```powershell
iisreset
```

---

### مرحله 4: Restart Express

```powershell
cd C:\e-commerce
pm2 restart lent-shop-api
# یا
pm2 restart all
```

---

## 🧪 تست‌های Verify

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

### تست 2: بررسی Content-Length

```powershell
curl.exe -I https://lent-shop.ir/product/toyota/996 | findstr "Content-Length"
```

**باید ببینید:**
```
Content-Length: 3000+
```

**نه:**
```
Content-Length: 41
```

---

### تست 3: بررسی متاتگ‌ها

```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996 | findstr "product_id"
```

**باید ببینید:**
```
<meta name="product_id" content="996">
```

**اگر `product_id` را دیدید → موفق است ✅**

---

### تست 4: بررسی Response Length

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

## ⚠️ اگر هنوز مشکل دارید

### بررسی 1: Express Binding

```powershell
# تست Express مستقیم
curl.exe http://localhost:4000/api/product/toyota/996 | findstr "product_id"
```

**اگر کار نمی‌کند:**
- Express را restart کنید
- بررسی کنید که Express روی پورت 4000 در حال اجرا است

---

### بررسی 2: Failed Request Tracing

1. IIS Manager → **Sites** → **lent-shop.ir**
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

---

## ✅ چک‌لیست نهایی

- [ ] `web.config` به سرور کپی شد (با handlers)
- [ ] فولدر `product` از `dist` حذف شد (اگر وجود داشت)
- [ ] IIS restart شد
- [ ] Express restart شد
- [ ] تست هدر `X-SSR: EXPRESS-HIT` موفق است
- [ ] تست `Content-Length: 3000+` موفق است
- [ ] تست `product_id` موفق است
- [ ] Response length بیشتر از 3000 کاراکتر است

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
# 1. Express مستقیم
curl.exe -s http://localhost:4000/api/product/toyota/996 | findstr "product_id"

# 2. از طریق IIS
curl.exe -s https://lent-shop.ir/product/toyota/996 | findstr "product_id"

# 3. Headers
curl.exe -I https://lent-shop.ir/product/toyota/996

# 4. Response length
$result = curl.exe -s https://lent-shop.ir/product/toyota/996
Write-Host "Response length: $($result.Length)"
```

با این اطلاعات می‌توانم مشکل را دقیق‌تر تشخیص دهم.

