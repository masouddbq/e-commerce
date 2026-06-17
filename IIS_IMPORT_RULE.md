# راهنمای Import کردن Rule از web.config به IIS Manager

## مشکل
Rule "Product Pages for All" در `web.config` وجود دارد اما در IIS Manager نمایش داده نمی‌شود.

## راه‌حل: Import کردن Rule از web.config

### مرحله 1: باز کردن URL Rewrite در IIS Manager

1. IIS Manager را باز کنید
2. روی **سایت `lent-shop.ir`** کلیک کنید
3. در پنل وسط، **URL Rewrite** را پیدا کنید
4. **دوبار کلیک** کنید

---

### مرحله 2: Import کردن Rules از web.config

1. در پنل راست (Actions)، روی **Import Rules...** کلیک کنید
2. در پنجره **Import Rules**:
   - **Rule file:** مسیر فایل `web.config` را وارد کنید:
     ```
     C:\inetpub\wwwroot\lent-shop\web.config
     ```
   - یا روی **Browse...** کلیک کنید و فایل را انتخاب کنید
3. **OK** را کلیک کنید
4. IIS Manager باید rule "Product Pages for All" را از `web.config` بخواند و اضافه کند

---

### مرحله 3: بررسی ترتیب Rules

بعد از import، بررسی کنید که ترتیب rules درست است:

1. **Torob Products and Sitemap** (اول)
2. **Static Files** (دوم)
3. **API and Payment Callback** (سوم)
4. **Product Pages for All** (چهارم) ← باید اینجا باشد
5. **React Router** (آخر)

اگر ترتیب درست نیست:
- Rule "Product Pages for All" را drag & drop کنید تا قبل از "React Router" قرار بگیرد

---

### مرحله 4: Restart IIS

```powershell
iisreset
```

---

## اگر Import کار نکرد: اضافه کردن Rule به صورت دستی

### مرحله 1: ایجاد Rule جدید

1. در IIS Manager → URL Rewrite
2. در پنل راست، روی **Add Rule(s)...** کلیک کنید
3. **Blank Rule** را انتخاب کنید
4. **OK** را کلیک کنید

---

### مرحله 2: تنظیمات Rule

#### تب General:

**Name:**
```
Product Pages for All
```

**Pattern:**
```
^product/([^/]+)/([^/]+)$
```

**⚠️ مهم:** Pattern را دقیقاً این‌طور وارد کنید (با `^` و `$`)

---

#### تب Action:

**Action type:**
- **Rewrite** را انتخاب کنید (نه Redirect)

**Action URL:**
```
http://localhost:4000/api/product/{R:1}/{R:2}
```

**⚠️ مهم:** 
- `{R:1}` = brand (مثلاً toyota)
- `{R:2}` = productId (مثلاً 996)

---

#### تب Server Variables (اختیاری):

1. روی **Add...** کلیک کنید
2. **Server variable name:** `HTTP_ACCEPT_ENCODING`
3. **Value:** (خالی بگذارید)
4. **OK**

---

### مرحله 3: ذخیره Rule

1. **Apply** را کلیک کنید (در سمت راست بالا)
2. باید پیام "The changes have been saved successfully" را ببینید

---

### مرحله 4: بررسی ترتیب

Rule "Product Pages for All" باید قبل از "React Router" باشد.

---

### مرحله 5: Restart IIS

```powershell
iisreset
```

---

## بررسی نهایی

بعد از انجام مراحل بالا:

1. در IIS Manager → URL Rewrite
2. بررسی کنید که rule "Product Pages for All" وجود دارد
3. روی rule دوبار کلیک کنید و بررسی کنید:
   - Pattern: `^product/([^/]+)/([^/]+)$`
   - Action URL: `http://localhost:4000/api/product/{R:1}/{R:2}`
   - Stop processing: ✓ (تیک خورده باشد)

---

## تست

بعد از restart IIS:

```powershell
# تست مستقیم Express (باید کار کند)
Invoke-WebRequest -Uri "http://localhost:4000/api/product/toyota/996" | Select-Object -ExpandProperty Content | Select-String "product_id"

# تست از طریق IIS (باید کار کند)
Invoke-WebRequest -Uri "https://lent-shop.ir/product/toyota/996" | Select-Object -ExpandProperty Content | Select-String "product_id"
```

اگر هر دو کار کردند، یعنی rule درست کار می‌کند!

