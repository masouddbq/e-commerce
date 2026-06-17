# راه‌حل نهایی: Pattern Match می‌کند اما Rule کار نمی‌کند

## ✅ وضعیت فعلی

از عکس مشخص است:
- ✅ Pattern match می‌کند: `^product/([^/]+)/([^/]+)$` با `product/toyota/996` match می‌کند
- ✅ Capture groups درست هستند: `{R:1}` = `toyota`, `{R:2}` = `996`
- ❌ اما rule هنوز کار نمی‌کند: درخواست‌ها به Express نمی‌رسند

**این یعنی:** Pattern درست است اما rule Apply نشده یا rule دیگری قبل از آن اجرا می‌شود.

---

## 🔍 مراحل بررسی (به ترتیب)

### مرحله 1: بررسی Apply شدن Rule

1. IIS Manager را باز کنید
2. روی **سایت `lent-shop.ir`** کلیک کنید
3. **URL Rewrite** را باز کنید
4. روی rule **"Product Pages for All"** دوبار کلیک کنید
5. **Apply** را کلیک کنید (در سمت راست بالا)
6. باید پیام "The changes have been saved successfully" را ببینید

**⚠️ اگر Apply نکرده‌اید، حتماً Apply کنید!**

---

### مرحله 2: بررسی ترتیب Rules (خیلی مهم!)

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

### مرحله 3: بررسی فایل web.config در سرور

فایل `web.config` باید در این مسیر باشد:
```
C:\inetpub\wwwroot\lent-shop\web.config
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
- باید rule را در IIS Manager Apply کنید
- یا فایل `web.config` را از لوکال به سرور منتقل کنید

---

### مرحله 4: Restart IIS

```powershell
iisreset
```

**⚠️ بعد از Apply کردن rule و تغییر ترتیب، حتماً IIS را restart کنید!**

---

### مرحله 5: بررسی ARR Proxy

1. در IIS Manager، روی **نام سرور** کلیک کنید (نه سایت)
2. **Application Request Routing Cache** → **Server Proxy Settings**
3. بررسی کنید که **Enable proxy** فعال است ✓
4. اگر فعال نیست، فعال کنید و **Apply** کنید

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

## 🔧 راه‌حل جایگزین: استفاده از Route مستقیم

اگر rule هنوز کار نمی‌کند، می‌توانیم از route مستقیم `/api/product/` استفاده کنیم که قبلاً کار می‌کرد.

### تغییر web.config

به جای rule "Product Pages for All"، از rule زیر استفاده کنید:

```xml
<rule name="Product Pages Direct" stopProcessing="true">
  <match url="^product/([^/]+)/([^/]+)$" />
  <action type="Rewrite" url="http://localhost:4000/api/product/{R:1}/{R:2}" />
  <serverVariables>
    <set name="HTTP_ACCEPT_ENCODING" value="" />
  </serverVariables>
</rule>
```

**یا می‌توانیم rule را حذف کنیم و دوباره اضافه کنیم:**

1. در IIS Manager → URL Rewrite
2. Rule "Product Pages for All" را **حذف** کنید
3. Rule را **دوباره اضافه** کنید (طبق راهنمای `IIS_IMPORT_RULE.md`)
4. **Apply** کنید
5. IIS را restart کنید: `iisreset`

---

## 🎯 راه‌حل نهایی: بررسی دقیق ترتیب Rules

مشکل احتمالی: **React Router rule قبل از Product Pages rule اجرا می‌شود.**

### بررسی ترتیب Rules در IIS Manager

1. IIS Manager → URL Rewrite
2. **لیست Inbound Rules را بررسی کنید:**
   - آیا "Product Pages for All" قبل از "React Router" است؟
   - اگر نیست، drag & drop کنید

### بررسی ترتیب Rules در web.config

فایل `C:\inetpub\wwwroot\lent-shop\web.config` را باز کنید و بررسی کنید که ترتیب rules درست است:

```xml
<rules>
  <!-- 1. Torob Products and Sitemap -->
  <rule name="Torob Products and Sitemap" stopProcessing="true">
    ...
  </rule>
  
  <!-- 2. Static Files -->
  <rule name="Static Files" stopProcessing="true">
    ...
  </rule>
  
  <!-- 3. API and Payment Callback -->
  <rule name="API and Payment Callback" stopProcessing="true">
    ...
  </rule>
  
  <!-- 4. Product Pages for All ← باید اینجا باشد -->
  <rule name="Product Pages for All" stopProcessing="true">
    <match url="^product/([^/]+)/([^/]+)$" />
    <action type="Rewrite" url="http://localhost:4000/api/product/{R:1}/{R:2}" />
    <serverVariables>
      <set name="HTTP_ACCEPT_ENCODING" value="" />
    </serverVariables>
  </rule>
  
  <!-- 5. React Router ← باید بعد از Product Pages باشد -->
  <rule name="React Router" stopProcessing="true">
    ...
  </rule>
</rules>
```

**⚠️ اگر ترتیب درست نیست:**
- فایل `web.config` را درست کنید
- یا در IIS Manager ترتیب را تغییر دهید

---

## 📋 چک‌لیست نهایی

- [ ] Rule "Product Pages for All" در IIS Manager Apply شده است
- [ ] ترتیب rules درست است (Product Pages قبل از React Router)
- [ ] فایل `web.config` در مسیر درست است (`C:\inetpub\wwwroot\lent-shop\web.config`)
- [ ] ترتیب rules در `web.config` درست است
- [ ] ARR Proxy فعال است
- [ ] IIS restart شده است (`iisreset`)
- [ ] Cache مرورگر پاک شده است
- [ ] لاگ‌های Express درخواست را نشان می‌دهند (`path: '/api/product/toyota/996'`)

اگر همه این موارد درست هستند اما هنوز کار نمی‌کند، rule را حذف کنید و دوباره اضافه کنید.

