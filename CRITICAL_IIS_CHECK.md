# بررسی بحرانی IIS Rewrite Rule

## مشکل
در view source متاتگ‌های Torob دیده نمی‌شوند. این یعنی درخواست `/product/toyota/996` از مرورگر به Express نمی‌رسد.

## فرضیه‌ها

- **Hypothesis J:** Rule "Product Pages for All" در IIS Manager وجود ندارد یا درست کار نمی‌کند
- **Hypothesis K:** ترتیب rules درست نیست - "React Router" قبل از "Product Pages for All" اجرا می‌شود
- **Hypothesis L:** IIS restart نشده بعد از اضافه کردن rule
- **Hypothesis M:** فایل `web.config` در مسیر درست نیست (باید در `C:\inetpub\wwwroot\lent-shop\web.config` باشد)
- **Hypothesis N:** ARR Proxy فعال نیست

---

## مراحل بررسی (به ترتیب)

### 1. بررسی Rule در IIS Manager

1. IIS Manager را باز کنید
2. روی **سایت `lent-shop.ir`** کلیک کنید
3. **URL Rewrite** را باز کنید
4. **لیست Inbound Rules را بررسی کنید:**
   - آیا rule **"Product Pages for All"** وجود دارد؟
   - اگر وجود ندارد: باید اضافه کنید (طبق راهنمای `IIS_IMPORT_RULE.md`)

---

### 2. بررسی تنظیمات Rule

اگر rule وجود دارد:

1. روی rule **"Product Pages for All"** دوبار کلیک کنید
2. بررسی کنید:
   - **Name:** `Product Pages for All`
   - **Pattern:** `^product/([^/]+)/([^/]+)$` (دقیقاً این!)
   - **Action type:** `Rewrite` (نه Redirect!)
   - **Action URL:** `http://localhost:4000/api/product/{R:1}/{R:2}` (دقیقاً این!)
   - **Stop processing:** ✓ (باید تیک خورده باشد!)

**⚠️ اگر هر کدام از این موارد اشتباه است، درست کنید و Apply کنید!**

---

### 3. بررسی ترتیب Rules (خیلی مهم!)

**Rule "Product Pages for All" باید قبل از "React Router" باشد!**

ترتیب صحیح در IIS Manager:
1. Torob Products and Sitemap
2. Static Files
3. API and Payment Callback
4. **Product Pages for All** ← باید اینجا باشد
5. React Router ← باید بعد از Product Pages باشد

**اگر ترتیب درست نیست:**
- Rule "Product Pages for All" را drag & drop کنید تا قبل از "React Router" قرار بگیرد
- **Apply** کنید

---

### 4. بررسی فایل web.config در سرور

فایل `web.config` باید در این مسیر باشد:
```
C:\inetpub\wwwroot\lent-shop\web.config
```

**نه در:**
```
C:\inetpub\wwwroot\lent-shop\dist\web.config
```

**بررسی کنید:**
1. فایل `C:\inetpub\wwwroot\lent-shop\web.config` را با Notepad باز کنید
2. بررسی کنید که rule "Product Pages for All" وجود دارد:
   ```xml
   <rule name="Product Pages for All" stopProcessing="true">
     <match url="^product/([^/]+)/([^/]+)$" />
     <action type="Rewrite" url="http://localhost:4000/api/product/{R:1}/{R:2}" />
     <serverVariables>
       <set name="HTTP_ACCEPT_ENCODING" value="" />
     </serverVariables>
   </rule>
   ```
3. بررسی کنید که این rule **قبل از** React Router rule باشد

---

### 5. Restart IIS

```powershell
iisreset
```

**⚠️ بعد از هر تغییر در IIS Manager یا web.config، حتماً IIS را restart کنید!**

---

### 6. بررسی ARR Proxy

1. در IIS Manager، روی **نام سرور** کلیک کنید (نه سایت)
2. **Application Request Routing Cache** → **Server Proxy Settings**
3. بررسی کنید که **Enable proxy** فعال است ✓
4. اگر فعال نیست، فعال کنید و **Apply** کنید

---

### 7. تست و بررسی لاگ‌ها

بعد از انجام مراحل بالا:

1. **Cache مرورگر را پاک کنید** (Ctrl+Shift+Delete)
2. به این آدرس بروید: `https://lent-shop.ir/product/toyota/996`
3. View Source کنید (Ctrl+U)
4. جستجو کنید: `product_id`

**همزمان، لاگ‌های Express را بررسی کنید:**

```powershell
pm2 logs lent-shop-api --lines 30
```

**باید ببینید:**
- `[DEBUG] ⚡ Request received:` با `path: '/api/product/toyota/996'`
- `[DEBUG] ⭐ /api/product/:brand/:productId route HIT!`

**اگر این لاگ‌ها را نمی‌بینید:** یعنی درخواست به Express نمی‌رسد و مشکل از IIS rewrite rule است.

---

## اگر هنوز کار نمی‌کند

### راه‌حل 1: حذف و اضافه مجدد Rule

1. در IIS Manager → URL Rewrite
2. Rule "Product Pages for All" را **حذف** کنید
3. Rule را **دوباره اضافه** کنید (طبق راهنمای `IIS_IMPORT_RULE.md`)
4. IIS را restart کنید: `iisreset`
5. تست کنید

---

### راه‌حل 2: بررسی Pattern

Pattern باید دقیقاً این باشد (بدون فاصله اضافی):
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

## خلاصه چک‌لیست

- [ ] Rule "Product Pages for All" در IIS Manager وجود دارد
- [ ] Pattern درست است: `^product/([^/]+)/([^/]+)$`
- [ ] Action URL درست است: `http://localhost:4000/api/product/{R:1}/{R:2}`
- [ ] Action type: **Rewrite** (نه Redirect)
- [ ] Stop processing: ✓ (تیک خورده)
- [ ] ترتیب rules درست است (Product Pages قبل از React Router)
- [ ] فایل `web.config` در مسیر درست است (`C:\inetpub\wwwroot\lent-shop\web.config`)
- [ ] IIS restart شده است (`iisreset`)
- [ ] ARR Proxy فعال است
- [ ] Cache مرورگر پاک شده است
- [ ] لاگ‌های Express درخواست را نشان می‌دهند

اگر همه این موارد درست هستند اما هنوز کار نمی‌کند، لاگ‌های جدید را بفرستید.

