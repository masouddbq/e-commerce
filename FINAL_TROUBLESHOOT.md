# راهنمای نهایی عیب‌یابی

## ✅ وضعیت فعلی

- ✅ فایل `web.config` در سرور درست است
- ✅ Rule "Product Pages for All" در فایل وجود دارد
- ❌ اما rule هنوز کار نمی‌کند

---

## 🔍 مراحل بررسی (به ترتیب)

### مرحله 1: Restart IIS

`iisreset` یک دستور سیستم است و می‌تواند از هر مسیری اجرا شود:

```powershell
# از هر مسیری می‌توانید اجرا کنید
iisreset
```

**یا:**

```powershell
# از PowerShell به عنوان Administrator
cd C:\
iisreset
```

**⚠️ مهم:** بعد از جایگزین کردن `web.config`، حتماً IIS را restart کنید!

---

### مرحله 2: بررسی فایل web.config در مسیر درست

فایل `web.config` باید در این مسیر باشد:
```
C:\inetpub\wwwroot\lent-shop\web.config
```

**بررسی کنید:**
1. فایل `C:\inetpub\wwwroot\lent-shop\web.config` را باز کنید
2. بررسی کنید که rule "Product Pages for All" وجود دارد
3. بررسی کنید که ترتیب rules درست است

---

### مرحله 3: بررسی در IIS Manager

بعد از restart IIS:

1. IIS Manager را باز کنید
2. روی **سایت `lent-shop.ir`** کلیک کنید
3. **URL Rewrite** را باز کنید
4. بررسی کنید که rule "Product Pages for All" وجود دارد
5. بررسی کنید که ترتیب rules درست است:
   - Torob Products and Sitemap
   - Static Files
   - API and Payment Callback
   - **Product Pages for All** ← باید اینجا باشد
   - React Router ← باید بعد از Product Pages باشد

**اگر rule وجود ندارد:**
- در IIS Manager → URL Rewrite → Import Rules...
- فایل `C:\inetpub\wwwroot\lent-shop\web.config` را import کنید

---

### مرحله 4: بررسی ARR Proxy

1. در IIS Manager، روی **نام سرور** کلیک کنید (نه سایت)
2. **Application Request Routing Cache** → **Server Proxy Settings**
3. بررسی کنید که **Enable proxy** فعال است ✓
4. اگر فعال نیست، فعال کنید و **Apply** کنید

---

### مرحله 5: بررسی Application Pool

1. در IIS Manager → Application Pools
2. Application Pool مربوط به `lent-shop.ir` را پیدا کنید
3. روی آن راست کلیک کنید → **Recycle**

---

### مرحله 6: تست و بررسی لاگ‌ها

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

**اگر این لاگ‌ها را نمی‌بینید:** به مرحله بعد بروید.

---

## 🔧 اگر هنوز کار نمی‌کند

### راه‌حل 1: Import Rules از web.config

1. IIS Manager → URL Rewrite
2. در پنل راست، روی **Import Rules...** کلیک کنید
3. فایل `C:\inetpub\wwwroot\lent-shop\web.config` را انتخاب کنید
4. **OK** را کلیک کنید
5. IIS را restart کنید: `iisreset`

---

### راه‌حل 2: بررسی مسیر فایل web.config

ممکن است IIS از فایل `web.config` در مسیر دیگری استفاده کند:

1. در IIS Manager → سایت `lent-shop.ir`
2. در پنل راست، روی **Explore** کلیک کنید
3. بررسی کنید که فایل `web.config` در این مسیر وجود دارد

---

### راه‌حل 3: بررسی IIS Logs

IIS Logs را بررسی کنید تا ببینید که درخواست‌ها به IIS می‌رسند:

```powershell
# مسیر لاگ‌های IIS
Get-Content "C:\inetpub\logs\LogFiles\W3SVC*\*.log" -Tail 50 | Select-String "product/toyota/996"
```

---

### راه‌حل 4: تست مستقیم Pattern

1. IIS Manager → URL Rewrite
2. روی rule "Product Pages for All" دوبار کلیک کنید
3. Pattern را تست کنید: Test pattern... → Input: `product/toyota/996`
4. باید match کند

---

## 📋 چک‌لیست نهایی

- [ ] فایل `web.config` در مسیر درست است (`C:\inetpub\wwwroot\lent-shop\web.config`)
- [ ] Rule "Product Pages for All" در فایل وجود دارد
- [ ] IIS restart شده است (`iisreset`)
- [ ] Rule "Product Pages for All" در IIS Manager وجود دارد
- [ ] ترتیب rules در IIS Manager درست است
- [ ] ARR Proxy فعال است
- [ ] Application Pool recycle شده است
- [ ] Cache مرورگر پاک شده است
- [ ] لاگ‌های Express درخواست را نشان می‌دهند (`path: '/api/product/toyota/996'`)

اگر همه این موارد درست هستند اما هنوز کار نمی‌کند، IIS Logs را بررسی کنید.

