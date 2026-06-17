# ✅ راه‌حل نهایی: رفع مشکل IIS Rewrite با AbortRequest

## 🔍 مشکل اصلی

IIS قبل از اینکه Rewrite به URL خارجی (ARR) انجام شود، تصمیم می‌گیرد که آیا باید Static Content/SPA fallback را serve کند یا نه. در نتیجه:
- Pattern Test در IIS Manager سبز است ✅
- اما در Runtime، SPA Rule زودتر اجرا می‌شود ❌
- Express هرگز Hit نمی‌شود ❌

---

## ✅ راه‌حل: استفاده از AbortRequest

### تغییرات در web.config:

1. **Rule "SSR Product Pages"** - با شرط HTTPS (بدون تغییر)
2. **Rule "Block SPA for Product"** - با `action="AbortRequest"` (تغییر از `None`)
3. **React Router** - بدون تغییر

**چرا AbortRequest؟**
- `action="None"` کافی نیست - IIS هنوز می‌تواند به Rule بعدی برسد
- `AbortRequest` به IIS می‌گوید: «اگر اینجا رسیدی، دیگر هیچ Rule دیگری حق اجرا ندارد»

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

1. در IIS Manager، **Server Name** را انتخاب کنید (نه Site)
2. **URL Rewrite** را باز کنید
3. **Inbound Rules** را بررسی کنید
4. **اگر rule‌های قدیمی یا SPA fallback را می‌بینید:**
   - آنها را **Delete** کنید
   - یا **Disable** کنید (موقتاً برای تست)
5. **Apply** کنید

**چرا مهم است؟**
- Rule‌های Server-level قبل از Site-level اجرا می‌شوند
- اگر rule‌های Server-level SPA fallback داشته باشند، rule‌های Site-level هرگز اجرا نمی‌شوند

---

### مرحله 3: بررسی تنظیمات ARR

در IIS Manager:

1. **Server Name** → **Application Request Routing**
2. **Server Proxy Settings** را باز کنید
3. بررسی کنید:
   - ✅ **Enable Proxy** فعال باشد
   - ✅ **Preserve client IP in X-Forwarded-For** فعال باشد
   - ✅ **Reverse rewrite host in response headers** فعال باشد
   - ❌ **Disk cache** غیرفعال باشد
   - ❌ **Response buffer** غیرفعال باشد (در صورت وجود)
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

**اگر چیزی ندید → مشکل هنوز وجود دارد ❌**

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

1. در IIS Manager، **Sites** → **lent-shop.ir**
2. **Failed Request Tracing Rules** → **Add...**
3. **Status code(s):** `200-999`
4. **Trace areas:** همه را انتخاب کنید
5. **Finish**

**بعد یک درخواست بزنید:**
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

## 📝 تغییرات در web.config

### قبل (کار نمی‌کرد):

```xml
<rule name="Ignore Product for SPA" stopProcessing="true">
  <match url="^product/.*" />
  <action type="None" />
</rule>
```

### بعد (کار می‌کند):

```xml
<rule name="Block SPA for Product" stopProcessing="true">
  <match url="^product/.*" />
  <action type="AbortRequest" />
</rule>
```

**تفاوت:**
- `action="None"` → IIS هنوز می‌تواند به Rule بعدی برسد
- `action="AbortRequest"` → IIS دیگر هیچ Rule دیگری را اجرا نمی‌کند

---

## ⚠️ نکات مهم

1. **ترتیب Rule‌ها مهم است:**
   - SSR Product Pages (اول)
   - Block SPA for Product (دوم)
   - React Router (آخر)

2. **Server Level Rules:**
   - حتماً بررسی کنید
   - اگر rule‌های SPA fallback در Server-level هستند، آنها را حذف کنید

3. **ARR Proxy:**
   - باید فعال باشد
   - بدون ARR، Rewrite به URL خارجی کار نمی‌کند

4. **HTTPS Condition:**
   - Rule "SSR Product Pages" شرط `{HTTPS} = on` دارد
   - اگر سایت HTTP است، این شرط را حذف کنید

---

## ✅ چک‌لیست نهایی

- [ ] `web.config` به سرور کپی شد
- [ ] Rule "Block SPA for Product" با `AbortRequest` است
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
