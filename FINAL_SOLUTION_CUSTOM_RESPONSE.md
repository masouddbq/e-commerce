# ✅ راه‌حل نهایی: استفاده از CustomResponse 404

## 🔍 تغییرات اعمال شده

### تغییر اصلی:

**قبل (کار نمی‌کرد):**
```xml
<rule name="Block SPA for Product" stopProcessing="true">
  <match url="^product/.*" />
  <action type="AbortRequest" />
</rule>
```

**بعد (کار می‌کند):**
```xml
<rule name="Block Product from SPA" stopProcessing="true">
  <match url="^product/.*" />
  <action type="CustomResponse" statusCode="404" />
</rule>
```

**چرا CustomResponse 404 بهتر است؟**
- `AbortRequest` گاهی قبل از Rewrite خارجی کوتاه می‌کند
- `CustomResponse 404` باعث می‌شود IIS دیگر SPA را انتخاب نکند
- Rule اول (SSR Product Pages) فرصت اجرا پیدا می‌کند

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

### مرحله 2: بررسی Server Level Rules (خیلی مهم!)

**این مرحله خیلی مهم است!**

1. IIS Manager → **Server Name** (نه Site) → **URL Rewrite**
2. **Inbound Rules** را بررسی کنید
3. **اگر rule‌های قدیمی یا SPA fallback را می‌بینید:**
   - آنها را **Delete** کنید
   - یا **Disable** کنید
4. **Apply** کنید

---

### مرحله 3: بررسی تنظیمات ARR

1. **Server Name** → **Application Request Routing**
2. **Server Proxy Settings**
3. بررسی کنید:
   - ✅ **Enable Proxy** فعال باشد
   - ✅ **Preserve client IP** فعال باشد
   - ✅ **Reverse rewrite host** فعال باشد
4. **Apply** کنید

---

### مرحله 4: Restart IIS

```powershell
iisreset
```

---

## 🧪 تست‌های Verify

### تست 1: هدر تشخیصی از Express

**در Express Route (`server/index.js`):**

```javascript
// در route /api/product/:brand/:productId
res.set('X-SSR', 'EXPRESS-HIT');
```

**بعد در PowerShell:**

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

### تست 4: Failed Request Tracing (اختیاری)

اگر هنوز مشکل دارید:

1. **Sites** → **lent-shop.ir** → **Failed Request Tracing Rules** → **Add...**
2. **Status code(s):** `200-999`
3. **Trace areas:** همه را انتخاب کنید
4. **Finish**

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

## ⚠️ نکات مهم

1. **ترتیب Rule‌ها مهم است:**
   - SSR Product Pages (اول)
   - Block Product from SPA (دوم)
   - React Router (آخر)

2. **Server Level Rules:**
   - حتماً بررسی کنید
   - اگر rule‌های SPA fallback در Server-level هستند، آنها را حذف کنید

3. **ARR Proxy:**
   - باید فعال باشد
   - بدون ARR، Rewrite به URL خارجی کار نمی‌کند

4. **CustomResponse 404:**
   - این باعث می‌شود IIS دیگر SPA را انتخاب نکند
   - Rule اول فرصت اجرا پیدا می‌کند

---

## ✅ چک‌لیست نهایی

- [ ] `web.config` به سرور کپی شد
- [ ] Rule "Block Product from SPA" با `CustomResponse 404` است
- [ ] Server Level Rules بررسی و حذف شدند
- [ ] ARR Proxy فعال است
- [ ] IIS restart شد
- [ ] تست هدر `X-SSR: EXPRESS-HIT` موفق است
- [ ] متاتگ‌ها در View Source موجود هستند
- [ ] تست با curl موفق است

---

## 🎯 نتیجه

بعد از اعمال این تغییرات:
- ✅ درخواست‌های `/product/*` به Express می‌رسند
- ✅ Express HTML با متاتگ‌ها را برمی‌گرداند
- ✅ متاتگ‌ها در View Source قابل مشاهده هستند
- ✅ ربات‌ها (مثل ترب) می‌توانند متاتگ‌ها را بخوانند

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

