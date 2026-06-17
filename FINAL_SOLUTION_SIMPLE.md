# ✅ راه‌حل نهایی: ساده و مستقیم

## 🔍 تغییرات اعمال شده

### 1. ساده‌سازی web.config

**قبل (پیچیده و کار نمی‌کرد):**
- Rule با شرط HTTPS
- Rule با AbortRequest/CustomResponse
- چندین Rule برای product

**بعد (ساده و مستقیم):**
```xml
<rule name="Product SSR Proxy" stopProcessing="true">
  <match url="^product/.*" />
  <action type="Rewrite" url="http://localhost:4000/api/{R:0}" />
</rule>
```

**چرا بهتر است؟**
- بدون شرط پیچیده
- بدون تداخل با SPA
- مستقیماً به Express می‌فرستد
- ساده و قابل اعتماد

---

### 2. اضافه کردن هدر X-SSR به Express

در Express route `/api/product/:brand/:productId`:
```javascript
res.setHeader('X-SSR', 'EXPRESS-HIT');
res.setHeader('Cache-Control', 'public, max-age=300');
```

**چرا مهم است؟**
- برای تشخیص اینکه Express Hit شده است
- برای تست و دیباگ
- برای Cache کردن پاسخ‌ها

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

### مرحله 2: به‌روزرسانی Express

1. فایل `server/index.js` را به سرور کپی کنید
2. Express را restart کنید:
   ```powershell
   cd C:\e-commerce
   pm2 restart lent-shop-api
   # یا
   pm2 restart all
   ```

---

### مرحله 3: بررسی Server Level Rules (خیلی مهم!)

**این مرحله خیلی مهم است!**

1. IIS Manager → **Server Name** (نه Site) → **URL Rewrite**
2. **Inbound Rules** را بررسی کنید
3. **اگر rule‌های قدیمی یا SPA fallback را می‌بینید:**
   - آنها را **Delete** کنید
   - یا **Disable** کنید
4. **Apply** کنید

---

### مرحله 4: بررسی تنظیمات ARR

1. **Server Name** → **Application Request Routing**
2. **Server Proxy Settings**
3. بررسی کنید:
   - ✅ **Enable Proxy** فعال باشد
   - ✅ **Preserve client IP** فعال باشد
   - ✅ **Reverse rewrite host** فعال باشد
4. **Apply** کنید

---

### مرحله 5: Restart IIS

```powershell
iisreset
```

---

## 🧪 تست‌های Verify

### تست 1: هدر X-SSR

```powershell
curl.exe -I https://lent-shop.ir/product/toyota/996
```

**باید ببینید:**
```
X-SSR: EXPRESS-HIT
```

**اگر این هدر را دیدید → موفق است ✅**

---

### تست 2: بررسی متاتگ‌ها

```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

**باید `product_id` را ببینید ✅**

---

### تست 3: View Source

1. مرورگر را باز کنید
2. به `https://lent-shop.ir/product/toyota/996` بروید
3. `Ctrl + U` (View Source)
4. جستجو کنید: `product_id`

**باید ببینید:**
```html
<meta name="product_id" content="996">
```

**نه:**
```html
<div id="root"></div>
```

---

### تست 4: تست کامل

```powershell
# تست 1: هدر
curl.exe -I https://lent-shop.ir/product/toyota/996 | Select-String "X-SSR"

# تست 2: متاتگ
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"

# تست 3: Express مستقیم
curl.exe -I http://localhost:4000/api/product/toyota/996 | Select-String "X-SSR"
```

**همه باید موفق باشند ✅**

---

## ⚠️ نکات مهم

1. **ترتیب Rule‌ها مهم است:**
   - Product SSR Proxy (اول)
   - React Router (آخر)

2. **Server Level Rules:**
   - حتماً بررسی کنید
   - اگر rule‌های SPA fallback در Server-level هستند، آنها را حذف کنید

3. **ARR Proxy:**
   - باید فعال باشد
   - بدون ARR، Rewrite به URL خارجی کار نمی‌کند

4. **Express:**
   - باید در حال اجرا باشد
   - باید هدر X-SSR را برمی‌گرداند

---

## ✅ چک‌لیست نهایی

- [ ] `web.config` به سرور کپی شد
- [ ] `server/index.js` به‌روزرسانی شد
- [ ] Express restart شد
- [ ] Server Level Rules بررسی و حذف شدند
- [ ] ARR Proxy فعال است
- [ ] IIS restart شد
- [ ] تست هدر `X-SSR: EXPRESS-HIT` موفق است
- [ ] متاتگ‌ها در View Source موجود هستند
- [ ] تست با curl موفق است

---

## 🎯 نتیجه

بعد از اعمال این تغییرات:
- ✅ درخواست‌های `/product/*` مستقیماً به Express می‌رسند
- ✅ Express HTML با متاتگ‌ها را برمی‌گرداند
- ✅ متاتگ‌ها در View Source قابل مشاهده هستند
- ✅ ربات‌ها (مثل ترب) می‌توانند متاتگ‌ها را بخوانند
- ✅ راه‌حل ساده و قابل اعتماد است

---

## 🔧 اگر هنوز مشکل دارید

1. **بررسی Express:**
   ```powershell
   curl.exe http://localhost:4000/api/product/toyota/996
   ```

2. **بررسی Server Level Rules:**
   - Server Name → URL Rewrite → Inbound Rules

3. **بررسی Failed Request Tracing:**
   - Log را بررسی کنید

4. **بررسی ARR:**
   - Server → Application Request Routing → Server Proxy Settings

