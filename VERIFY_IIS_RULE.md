# راهنمای بررسی و تست IIS Rewrite Rule

## مشکل
درخواست‌های `/product/toyota/996` به Express نمی‌رسند و متاتگ‌ها در view source دیده نمی‌شوند.

## مراحل بررسی

### مرحله 1: تست مستقیم Express (بدون IIS)

ابتدا باید مطمئن شویم که Express route کار می‌کند:

```powershell
# تست مستقیم Express
Invoke-WebRequest -Uri "http://localhost:4000/api/product/toyota/996" | Select-Object -ExpandProperty Content | Select-String "product_id"
```

**اگر این کار کرد:** یعنی Express route درست است و مشکل از IIS است.
**اگر کار نکرد:** باید Express route را بررسی کنیم.

---

### مرحله 2: بررسی Rule در IIS Manager

1. IIS Manager را باز کنید
2. روی **سایت `lent-shop.ir`** کلیک کنید
3. **URL Rewrite** را باز کنید
4. بررسی کنید که rule **"Product Pages for All"** وجود دارد

**اگر rule وجود ندارد:**
- باید rule را اضافه کنید (طبق راهنمای `IIS_IMPORT_RULE.md`)

**اگر rule وجود دارد:**
- روی rule **دوبار کلیک** کنید
- بررسی کنید:
  - **Name:** `Product Pages for All`
  - **Pattern:** `^product/([^/]+)/([^/]+)$`
  - **Action type:** `Rewrite` (نه Redirect!)
  - **Action URL:** `http://localhost:4000/api/product/{R:1}/{R:2}`
  - **Stop processing:** ✓ (تیک خورده باشد)

---

### مرحله 3: بررسی ترتیب Rules (خیلی مهم!)

**Rule "Product Pages for All" باید قبل از "React Router" باشد!**

ترتیب صحیح:
1. Torob Products and Sitemap
2. Static Files
3. API and Payment Callback
4. **Product Pages for All** ← باید اینجا باشد
5. React Router ← باید بعد از Product Pages باشد

**اگر ترتیب درست نیست:**
- Rule "Product Pages for All" را drag & drop کنید تا قبل از "React Router" قرار بگیرد
- **Apply** کنید

---

### مرحله 4: بررسی ARR Proxy

1. در IIS Manager، روی **نام سرور** کلیک کنید (نه سایت)
2. **Application Request Routing Cache** → **Server Proxy Settings**
3. بررسی کنید که **Enable proxy** فعال است ✓
4. اگر فعال نیست، فعال کنید و **Apply** کنید

---

### مرحله 5: بررسی فایل web.config در سرور

فایل `web.config` باید در این مسیر باشد:
```
C:\inetpub\wwwroot\lent-shop\web.config
```

**نه در:**
```
C:\inetpub\wwwroot\lent-shop\dist\web.config
```

باز کنید و بررسی کنید که rule وجود دارد:

```xml
<rule name="Product Pages for All" stopProcessing="true">
  <match url="^product/([^/]+)/([^/]+)$" />
  <action type="Rewrite" url="http://localhost:4000/api/product/{R:1}/{R:2}" />
  <serverVariables>
    <set name="HTTP_ACCEPT_ENCODING" value="" />
  </serverVariables>
</rule>
```

**⚠️ مهم:** این rule باید قبل از React Router rule باشد!

---

### مرحله 6: Restart IIS

```powershell
iisreset
```

---

### مرحله 7: تست از طریق IIS

بعد از restart، تست کنید:

```powershell
# تست از طریق IIS (باید متاتگ‌ها را ببینید)
Invoke-WebRequest -Uri "https://lent-shop.ir/product/toyota/996" | Select-Object -ExpandProperty Content | Select-String "product_id"
```

**اگر این کار کرد:** یعنی rule درست کار می‌کند!
**اگر کار نکرد:** به مرحله بعد بروید.

---

### مرحله 8: بررسی لاگ‌های Express

بعد از تست، لاگ‌های Express را بررسی کنید:

```powershell
pm2 logs lent-shop-api --lines 50
```

**باید ببینید:**
- `[DEBUG] ⭐ /api/product/:brand/:productId route HIT!`
- `[DEBUG] Request received:` با `isProductRoute: true`

**اگر این لاگ‌ها را نمی‌بینید:** یعنی درخواست به Express نمی‌رسد و مشکل از IIS rewrite rule است.

---

## اگر هنوز کار نمی‌کند

### راه‌حل 1: حذف موقت Condition (اگر rule "Product Pages for Bots" دارید)

اگر rule "Product Pages for Bots" دارید که condition دارد:

1. در IIS Manager، روی rule کلیک کنید
2. به تب **Conditions** بروید
3. condition را **موقتاً** حذف کنید
4. **Apply** کنید
5. IIS را restart کنید: `iisreset`
6. تست کنید

**⚠️ بعد از تست، condition را دوباره اضافه کنید!**

---

### راه‌حل 2: بررسی Pattern

Pattern باید دقیقاً این باشد:
```
^product/([^/]+)/([^/]+)$
```

**نکته:** 
- `^` = شروع رشته
- `product/` = متن ثابت
- `([^/]+)` = یک یا چند کاراکتر غیر از `/` (capture group 1)
- `/` = اسلش
- `([^/]+)` = یک یا چند کاراکتر غیر از `/` (capture group 2)
- `$` = پایان رشته

---

### راه‌حل 3: بررسی Action URL

Action URL باید دقیقاً این باشد:
```
http://localhost:4000/api/product/{R:1}/{R:2}
```

**نکته:**
- `{R:1}` = مقدار capture group 1 (brand)
- `{R:2}` = مقدار capture group 2 (productId)

**⚠️ مهم:** Action type باید **Rewrite** باشد (نه Redirect)!

---

### راه‌حل 4: تست با Route جایگزین

از route تستی استفاده کنید که مستقیماً از طریق `/api/` قابل دسترسی است:

```
https://lent-shop.ir/api/test-product/toyota/996
```

اگر این کار کرد، یعنی Express route درست است و مشکل از IIS rewrite rule است.

---

## خلاصه چک‌لیست

- [ ] Express route کار می‌کند (تست مستقیم)
- [ ] Rule "Product Pages for All" در IIS Manager وجود دارد
- [ ] Pattern درست است: `^product/([^/]+)/([^/]+)$`
- [ ] Action URL درست است: `http://localhost:4000/api/product/{R:1}/{R:2}`
- [ ] Action type: **Rewrite** (نه Redirect)
- [ ] Stop processing: ✓ (تیک خورده)
- [ ] ترتیب rules درست است (Product Pages قبل از React Router)
- [ ] ARR Proxy فعال است
- [ ] فایل `web.config` در مسیر درست است
- [ ] IIS restart شده است
- [ ] تست از طریق IIS کار می‌کند
- [ ] لاگ‌های Express درخواست را نشان می‌دهند

اگر همه این موارد درست هستند اما هنوز کار نمی‌کند، لاگ‌های جدید را بفرستید.

