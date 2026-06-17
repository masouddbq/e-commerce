# رفع مشکل IIS URL Rewrite Module

## 🔴 مشکلات شناسایی شده

از عکس‌ها مشخص است:
1. ❌ خطای DLL: `api-ms-win-crt-heap-l1-1-0.dll is missing`
2. ❌ Pattern match نمی‌کند: "The input data to test does not match the pattern"
3. ❌ خطای ماژول: "The specified module could not be found"

**این یعنی:** IIS URL Rewrite module مشکل دارد یا Visual C++ Redistributable نصب نیست.

---

## 🔧 راه‌حل: نصب Visual C++ Redistributable

### مرحله 1: دانلود Visual C++ Redistributable

1. به این آدرس بروید: https://aka.ms/vs/17/release/vc_redist.x64.exe
2. یا از این لینک مستقیم دانلود کنید: https://aka.ms/vs/17/release/vc_redist.x64.exe
3. فایل را دانلود کنید

---

### مرحله 2: نصب Visual C++ Redistributable

1. فایل دانلود شده را اجرا کنید
2. **Install** را کلیک کنید
3. منتظر بمانید تا نصب کامل شود
4. **Restart** کامپیوتر را انجام دهید (یا حداقل IIS را restart کنید)

---

### مرحله 3: بررسی نصب IIS URL Rewrite Module

1. IIS Manager را باز کنید
2. روی **نام سرور** کلیک کنید (نه سایت)
3. در پنل وسط، **Modules** را پیدا کنید
4. بررسی کنید که **RewriteModule** وجود دارد

**اگر RewriteModule وجود ندارد:**
- باید IIS URL Rewrite Module را نصب کنید

---

### مرحله 4: نصب IIS URL Rewrite Module (اگر نیاز است)

1. به این آدرس بروید: https://www.iis.net/downloads/microsoft/url-rewrite
2. **Download** را کلیک کنید
3. فایل `rewrite_amd64_en-US.msi` را دانلود کنید
4. فایل را اجرا کنید و نصب کنید
5. IIS را restart کنید: `iisreset`

---

### مرحله 5: تست Pattern دوباره

بعد از نصب Visual C++ Redistributable و restart:

1. IIS Manager را باز کنید
2. روی **سایت `lent-shop.ir`** کلیک کنید
3. **URL Rewrite** را باز کنید
4. روی rule "Product Pages for All" دوبار کلیک کنید
5. به تب **General** بروید
6. در قسمت **Pattern**، روی **Test pattern...** کلیک کنید
7. در **Input data to test:** این را وارد کنید: `product/toyota/996`
8. روی **Test** کلیک کنید
9. **باید ببینید که Pattern match می‌کند:**
   - `{R:0}` = `product/toyota/996`
   - `{R:1}` = `toyota`
   - `{R:2}` = `996`

**اگر Pattern match نمی‌کند:**
- Pattern را بررسی کنید: باید دقیقاً `^product/([^/]+)/([^/]+)$` باشد
- بدون فاصله اضافی!

---

### مرحله 6: Restart IIS

```powershell
iisreset
```

---

### مرحله 7: تست نهایی

بعد از انجام مراحل بالا:

1. Cache مرورگر را پاک کنید (Ctrl+Shift+Delete)
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

---

## 📋 چک‌لیست

- [ ] Visual C++ Redistributable نصب شده است
- [ ] IIS restart شده است (یا کامپیوتر restart شده است)
- [ ] IIS URL Rewrite Module نصب شده است
- [ ] Pattern test کار می‌کند (match می‌کند)
- [ ] Rule "Product Pages for All" در IIS Manager وجود دارد
- [ ] ترتیب rules درست است (Product Pages قبل از React Router)
- [ ] IIS restart شده است (`iisreset`)
- [ ] Cache مرورگر پاک شده است
- [ ] لاگ‌های Express درخواست را نشان می‌دهند

---

## 🔍 اگر هنوز Pattern match نمی‌کند

### بررسی Pattern

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

**اگر Pattern درست است اما match نمی‌کند:**
- Pattern را حذف کنید و دوباره وارد کنید
- یا rule را حذف کنید و دوباره اضافه کنید

---

## 🎯 خلاصه

مشکل اصلی: **Visual C++ Redistributable نصب نیست** یا **IIS URL Rewrite Module مشکل دارد**.

**راه‌حل:**
1. Visual C++ Redistributable را نصب کنید
2. IIS را restart کنید
3. Pattern را دوباره تست کنید
4. اگر Pattern match می‌کند، rule کار می‌کند!

