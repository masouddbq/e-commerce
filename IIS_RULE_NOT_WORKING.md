# مشکل: IIS Rewrite Rule کار نمی‌کند

## 🔴 مشکل فعلی

از لاگ‌ها مشخص است:
- ❌ درخواست‌های `/product/toyota/996` از مرورگر به Express نمی‌رسند
- ❌ فقط درخواست‌های `/api/comments/product/996` به Express می‌رسند
- ❌ در view source متاتگ‌ها نیستند

**این یعنی:** IIS rewrite rule برای `/product/` کار نمی‌کند.

---

## 🔍 مراحل بررسی و رفع (به ترتیب)

### مرحله 1: بررسی Rule در IIS Manager

1. IIS Manager را باز کنید
2. روی **سایت `lent-shop.ir`** کلیک کنید
3. **URL Rewrite** را باز کنید
4. **لیست Inbound Rules را بررسی کنید:**
   - آیا rule **"Product Pages for All"** وجود دارد؟
   - اگر وجود ندارد: باید اضافه کنید (طبق راهنمای `IIS_IMPORT_RULE.md`)

---

### مرحله 2: بررسی تنظیمات Rule (خیلی مهم!)

اگر rule وجود دارد:

1. روی rule **"Product Pages for All"** دوبار کلیک کنید
2. **تب General:**
   - **Name:** باید `Product Pages for All` باشد
   - **Pattern:** باید دقیقاً این باشد: `^product/([^/]+)/([^/]+)$`
     - ⚠️ **بدون فاصله اضافی!**
     - ⚠️ **با `^` در ابتدا و `$` در انتها!**
   - **Ignore case:** می‌تواند تیک خورده باشد یا نباشد

3. **تب Action:**
   - **Action type:** باید **Rewrite** باشد (نه Redirect!)
   - **Action URL:** باید دقیقاً این باشد: `http://localhost:4000/api/product/{R:1}/{R:2}`
     - ⚠️ **بدون فاصله اضافی!**
     - ⚠️ **با `{R:1}` و `{R:2}` (نه `R:1` و `R:2`)!**

4. **تب Conditions:**
   - ⚠️ **نباید هیچ condition داشته باشد!** (برای rule "Product Pages for All")
   - اگر condition دارد، حذف کنید

5. **تب Server Variables:**
   - باید `HTTP_ACCEPT_ENCODING` با value خالی وجود داشته باشد
   - اگر نیست، اضافه کنید

6. **Apply** کنید

---

### مرحله 3: بررسی ترتیب Rules (خیلی مهم!)

**Rule "Product Pages for All" باید قبل از "React Router" باشد!**

ترتیب صحیح در IIS Manager (از بالا به پایین):
1. Torob Products and Sitemap
2. Static Files
3. API and Payment Callback
4. **Product Pages for All** ← باید اینجا باشد
5. React Router ← باید بعد از Product Pages باشد

**اگر ترتیب درست نیست:**
- Rule "Product Pages for All" را drag & drop کنید تا قبل از "React Router" قرار بگیرد
- **Apply** کنید

---

### مرحله 4: بررسی فایل web.config در سرور

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

**⚠️ اگر rule در فایل نیست:**
- باید rule را در IIS Manager اضافه کنید
- یا فایل `web.config` را از لوکال به سرور منتقل کنید

---

### مرحله 5: بررسی ARR Proxy

1. در IIS Manager، روی **نام سرور** کلیک کنید (نه سایت)
2. **Application Request Routing Cache** → **Server Proxy Settings**
3. بررسی کنید که **Enable proxy** فعال است ✓
4. اگر فعال نیست، فعال کنید و **Apply** کنید

---

### مرحله 6: Restart IIS

```powershell
iisreset
```

**⚠️ بعد از هر تغییر در IIS Manager یا web.config، حتماً IIS را restart کنید!**

---

### مرحله 7: تست و بررسی لاگ‌ها

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
- `[DEBUG] After replace: { metaTagInHtml: true }`

**اگر این لاگ‌ها را نمی‌بینید:** یعنی درخواست به Express نمی‌رسد و مشکل از IIS rewrite rule است.

---

## 🔧 اگر هنوز کار نمی‌کند

### راه‌حل 1: حذف و اضافه مجدد Rule

1. در IIS Manager → URL Rewrite
2. Rule "Product Pages for All" را **حذف** کنید
3. Rule را **دوباره اضافه** کنید (طبق راهنمای `IIS_IMPORT_RULE.md`)
4. IIS را restart کنید: `iisreset`
5. تست کنید

---

### راه‌حل 2: تست Pattern

برای تست اینکه Pattern درست کار می‌کند:

1. در IIS Manager → URL Rewrite
2. روی rule "Product Pages for All" دوبار کلیک کنید
3. به تب **General** بروید
4. در قسمت **Pattern**، روی **Test pattern...** کلیک کنید
5. در قسمت **Input data to test:** این را وارد کنید: `product/toyota/996`
6. روی **Test** کلیک کنید
7. باید ببینید که Pattern match می‌کند و `{R:1}` = `toyota` و `{R:2}` = `996`

**اگر Pattern match نمی‌کند:** Pattern را درست کنید.

---

### راه‌حل 3: بررسی Action URL

Action URL باید دقیقاً این باشد:
```
http://localhost:4000/api/product/{R:1}/{R:2}
```

**نکته:**
- `{R:1}` = مقدار capture group 1 (brand = toyota)
- `{R:2}` = مقدار capture group 2 (productId = 996)

**⚠️ مهم:** Action type باید **Rewrite** باشد (نه Redirect)!

---

## 📋 چک‌لیست نهایی

- [ ] Rule "Product Pages for All" در IIS Manager وجود دارد
- [ ] Pattern درست است: `^product/([^/]+)/([^/]+)$` (با `^` و `$`)
- [ ] Action URL درست است: `http://localhost:4000/api/product/{R:1}/{R:2}` (با `{R:1}` و `{R:2}`)
- [ ] Action type: **Rewrite** (نه Redirect)
- [ ] Stop processing: ✓ (تیک خورده)
- [ ] Conditions: هیچ condition ندارد (برای rule "Product Pages for All")
- [ ] Server Variables: `HTTP_ACCEPT_ENCODING` با value خالی وجود دارد
- [ ] ترتیب rules درست است (Product Pages قبل از React Router)
- [ ] فایل `web.config` در مسیر درست است (`C:\inetpub\wwwroot\lent-shop\web.config`)
- [ ] ARR Proxy فعال است
- [ ] IIS restart شده است (`iisreset`)
- [ ] Cache مرورگر پاک شده است
- [ ] لاگ‌های Express درخواست را نشان می‌دهند (`path: '/api/product/toyota/996'`)

اگر همه این موارد درست هستند اما هنوز کار نمی‌کند، لاگ‌های جدید را بفرستید.

