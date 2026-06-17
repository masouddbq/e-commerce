# راهنمای انتقال web.config به سرور

## 🔴 مشکل

فایل `web.config` در سرور (`C:\inetpub\wwwroot\lent-shop\web.config`) rule "Product Pages for All" ندارد!

**فایل فعلی در سرور فقط این rules را دارد:**
- Static Files
- React Router

**اما باید این rules را داشته باشد:**
1. Torob Products and Sitemap
2. Static Files
3. API and Payment Callback
4. **Product Pages for All** ← این rule وجود ندارد!
5. React Router

---

## ✅ راه‌حل: انتقال فایل web.config

### مرحله 1: کپی فایل web.config از لوکال

فایل `web.config` از پروژه لوکال را کپی کنید:
- مسیر لوکال: `E:\FrontProjects\Lent-shop-new\lent-shop\web.config`
- مسیر سرور: `C:\inetpub\wwwroot\lent-shop\web.config`

---

### مرحله 2: جایگزین کردن فایل در سرور

1. به سرور متصل شوید (Remote Desktop)
2. فایل `C:\inetpub\wwwroot\lent-shop\web.config` را باز کنید
3. محتوای فایل `web.config` از لوکال را کپی کنید
4. محتوای فایل در سرور را با محتوای جدید جایگزین کنید
5. فایل را ذخیره کنید

**یا:**

1. فایل `web.config` از لوکال را کپی کنید
2. به سرور متصل شوید
3. فایل را در `C:\inetpub\wwwroot\lent-shop\web.config` جایگزین کنید

---

### مرحله 3: بررسی فایل web.config در سرور

بعد از جایگزین کردن، فایل `C:\inetpub\wwwroot\lent-shop\web.config` را باز کنید و بررسی کنید که rule "Product Pages for All" وجود دارد:

```xml
<rule name="Product Pages for All" stopProcessing="true">
  <match url="^product/([^/]+)/([^/]+)$" />
  <action type="Rewrite" url="http://localhost:4000/api/product/{R:1}/{R:2}" />
  <serverVariables>
    <set name="HTTP_ACCEPT_ENCODING" value="" />
  </serverVariables>
</rule>
```

---

### مرحله 4: Restart IIS

```powershell
iisreset
```

**⚠️ بعد از جایگزین کردن فایل، حتماً IIS را restart کنید!**

---

### مرحله 5: بررسی در IIS Manager

بعد از restart:

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

---

### مرحله 6: تست نهایی

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

---

## 📋 چک‌لیست

- [ ] فایل `web.config` از لوکال به سرور منتقل شده است
- [ ] فایل `C:\inetpub\wwwroot\lent-shop\web.config` rule "Product Pages for All" دارد
- [ ] ترتیب rules در فایل درست است (Product Pages قبل از React Router)
- [ ] IIS restart شده است (`iisreset`)
- [ ] در IIS Manager rule "Product Pages for All" وجود دارد
- [ ] ترتیب rules در IIS Manager درست است
- [ ] Cache مرورگر پاک شده است
- [ ] لاگ‌های Express درخواست را نشان می‌دهند (`path: '/api/product/toyota/996'`)

اگر همه این موارد درست هستند، مشکل حل شده است! ✅

