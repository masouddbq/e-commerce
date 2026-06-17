# راهنمای نهایی بررسی و تست

## ✅ وضعیت فعلی

از لاگ‌ها مشخص است که:
- ✅ Express route کار می‌کند (`/api/product/toyota/996`)
- ✅ متاتگ‌ها inject می‌شوند (`metaTagInHtml: true`)
- ✅ IIS rewrite rule تنظیم شده است
- ⚠️ خطای SSL/TLS در PowerShell (مشکل PowerShell است، نه سرور)

---

## 🔍 بررسی نهایی

### 1. تست از مرورگر (بهترین روش)

**⚠️ مهم:** به جای PowerShell، از مرورگر استفاده کنید:

1. مرورگر را باز کنید (Chrome یا Edge)
2. به این آدرس بروید: `https://lent-shop.ir/product/toyota/996`
3. View Source کنید (Ctrl+U یا راست کلیک → View Page Source)
4. در view source، جستجو کنید: `product_id`
5. باید این متاتگ‌ها را ببینید:
   ```html
   <meta name="product_id" content="996">
   <meta name="product_name" content="...">
   <meta property="og:image" content="...">
   <meta name="product_price" content="...">
   <meta name="product_old_price" content="...">
   <meta name="availability" content="instock">
   ```

**اگر این متاتگ‌ها را دیدید:** ✅ همه چیز درست کار می‌کند!

---

### 2. رفع خطای SSL/TLS در PowerShell (اختیاری)

اگر می‌خواهید از PowerShell تست کنید، این خطا را رفع کنید:

```powershell
# فعال کردن TLS 1.2 در PowerShell
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# تست دوباره
Invoke-WebRequest -Uri "https://lent-shop.ir/product/toyota/996" | Select-Object -ExpandProperty Content | Select-String "product_id"
```

---

### 3. بررسی لاگ‌های Express

بعد از باز کردن صفحه در مرورگر، لاگ‌های Express را بررسی کنید:

```powershell
pm2 logs lent-shop-api --lines 20
```

**باید ببینید:**
- `[DEBUG] ⭐ /api/product/:brand/:productId route HIT!`
- `[DEBUG] Request received:` با `isProductRoute: true`
- `[DEBUG] After replace: { metaTagInHtml: true }`

---

### 4. تست با curl (اگر curl نصب است)

```powershell
curl -k "https://lent-shop.ir/product/toyota/996" | Select-String "product_id"
```

---

## ✅ چک‌لیست نهایی

- [ ] Express route کار می‌کند (از لاگ‌ها مشخص است ✅)
- [ ] متاتگ‌ها inject می‌شوند (از لاگ‌ها مشخص است ✅)
- [ ] IIS rewrite rule تنظیم شده است (کاربر تأیید کرد ✅)
- [ ] Stop processing تیک خورده است (کاربر تأیید کرد ✅)
- [ ] ترتیب rules درست است (کاربر تأیید کرد ✅)
- [ ] ARR Proxy فعال است (کاربر تأیید کرد ✅)
- [ ] **تست از مرورگر:** متاتگ‌ها در view source دیده می‌شوند؟ (باید تست شود)

---

## 🎯 نتیجه‌گیری

از لاگ‌های Express مشخص است که:
1. ✅ درخواست‌ها به Express می‌رسند
2. ✅ Route اجرا می‌شود
3. ✅ متاتگ‌ها inject می‌شوند

**مشکل احتمالی:**
- خطای SSL/TLS در PowerShell (مشکل PowerShell است، نه سرور)
- یا ممکن است مرورگر cache کرده باشد

**راه‌حل:**
1. از مرورگر تست کنید (نه PowerShell)
2. Cache مرورگر را پاک کنید (Ctrl+Shift+Delete)
3. یا از حالت Incognito استفاده کنید

---

## 📝 اگر هنوز متاتگ‌ها را نمی‌بینید

اگر بعد از تست از مرورگر هنوز متاتگ‌ها را نمی‌بینید:

1. Cache مرورگر را پاک کنید
2. از حالت Incognito استفاده کنید
3. لاگ‌های Express را بررسی کنید (باید `[DEBUG] ⭐` را ببینید)
4. فایل `debug.log` را بررسی کنید

اگر لاگ‌ها نشان می‌دهند که route اجرا شده اما در view source متاتگ‌ها نیستند، ممکن است مشکل از cache مرورگر یا CDN باشد.

