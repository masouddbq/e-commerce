# بررسی نهایی: همه چیز درست است اما کار نمی‌کند

## ✅ وضعیت فعلی (از عکس‌ها)

- ✅ Rule "Product Pages for All" در IIS Manager وجود دارد
- ✅ Pattern درست است: `^product/([^/]+)/([^/]+)$`
- ✅ Action Type: `Rewrite`
- ✅ Stop Process: `True`
- ✅ ترتیب rules درست است (Product Pages قبل از React Router)
- ✅ فایل `web.config` در سرور درست است

**اما هنوز کار نمی‌کند!**

---

## 🔍 مراحل بررسی (به ترتیب)

### مرحله 1: بررسی ARR Proxy (خیلی مهم!)

1. در IIS Manager، روی **نام سرور** کلیک کنید (نه سایت)
2. **Application Request Routing Cache** → **Server Proxy Settings**
3. بررسی کنید که **Enable proxy** فعال است ✓
4. اگر فعال نیست، فعال کنید و **Apply** کنید
5. IIS را restart کنید: `iisreset`

**⚠️ اگر ARR Proxy فعال نیست، rule کار نمی‌کند!**

---

### مرحله 2: بررسی Express Server

بررسی کنید که Express server روی port 4000 در حال اجرا است:

```powershell
# بررسی وضعیت PM2
pm2 status

# بررسی لاگ‌های Express
pm2 logs lent-shop-api --lines 10
```

**باید ببینید:**
- `OTP server listening on port 4000`
- `[DEBUG] Server started - routes registered`

---

### مرحله 3: تست مستقیم Express (بدون IIS)

برای اطمینان از اینکه Express route کار می‌کند:

```powershell
Invoke-WebRequest -Uri "http://localhost:4000/api/product/toyota/996" | Select-Object -ExpandProperty Content | Select-String "product_id"
```

**اگر این کار کرد:** یعنی Express route درست است و مشکل از IIS است.
**اگر کار نکرد:** باید Express route را بررسی کنیم.

---

### مرحله 4: بررسی IIS Logs

IIS Logs را بررسی کنید تا ببینید که درخواست‌ها به IIS می‌رسند:

```powershell
# پیدا کردن مسیر لاگ‌های IIS
Get-ChildItem "C:\inetpub\logs\LogFiles" -Recurse -Filter "*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 1 | ForEach-Object { Get-Content $_.FullName -Tail 50 | Select-String "product/toyota/996" }
```

**اگر لاگ‌ها را می‌بینید:** یعنی درخواست‌ها به IIS می‌رسند.
**اگر لاگ‌ها را نمی‌بینید:** یعنی درخواست‌ها به IIS نمی‌رسند (مشکل از DNS یا CDN).

---

### مرحله 5: بررسی DNS و CDN

اگر از CDN استفاده می‌کنید:

1. بررسی کنید که CDN درخواست‌های `/product/` را cache نمی‌کند
2. یا موقتاً CDN را غیرفعال کنید و مستقیماً به سرور تست کنید

---

### مرحله 6: Recycle Application Pool

Recycle Application Pool (نه Restart IIS):

1. IIS Manager → Application Pools
2. Application Pool مربوط به `lent-shop.ir` را پیدا کنید
3. روی آن راست کلیک کنید → **Recycle**

**نکته:** Recycle فقط Application Pool را restart می‌کند، اما Restart IIS همه چیز را restart می‌کند.

---

### مرحله 7: تست نهایی

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

## 🔧 اگر هنوز کار نمی‌کند

### راه‌حل 1: بررسی Action URL در IIS Manager

1. IIS Manager → URL Rewrite
2. روی rule "Product Pages for All" دوبار کلیک کنید
3. به تب **Action** بروید
4. بررسی کنید که **Action URL** دقیقاً این باشد: `http://localhost:4000/api/product/{R:1}/{R:2}`
5. **Apply** کنید
6. IIS را restart کنید: `iisreset`

---

### راه‌حل 2: بررسی Server Variables

1. IIS Manager → URL Rewrite
2. روی rule "Product Pages for All" دوبار کلیک کنید
3. به تب **Server Variables** بروید
4. بررسی کنید که `HTTP_ACCEPT_ENCODING` با value خالی وجود دارد
5. اگر نیست، اضافه کنید
6. **Apply** کنید
7. IIS را restart کنید: `iisreset`

---

### راه‌حل 3: تست با curl یا PowerShell

برای تست مستقیم از سرور:

```powershell
# تست از سرور به خودش
Invoke-WebRequest -Uri "http://localhost/product/toyota/996" | Select-Object -ExpandProperty Content | Select-String "product_id"
```

**اگر این کار کرد:** یعنی rule کار می‌کند و مشکل از DNS یا CDN است.
**اگر کار نکرد:** باید ARR Proxy را بررسی کنید.

---

## 📋 چک‌لیست نهایی

- [ ] Rule "Product Pages for All" در IIS Manager وجود دارد ✅
- [ ] Pattern درست است ✅
- [ ] Action Type: Rewrite ✅
- [ ] Stop Process: True ✅
- [ ] ترتیب rules درست است ✅
- [ ] فایل `web.config` در سرور درست است ✅
- [ ] **ARR Proxy فعال است** ← این را بررسی کنید!
- [ ] Express server روی port 4000 در حال اجرا است
- [ ] IIS restart شده است (`iisreset`)
- [ ] Application Pool recycle شده است
- [ ] Cache مرورگر پاک شده است
- [ ] لاگ‌های Express درخواست را نشان می‌دهند

**مهم‌ترین نکته:** ARR Proxy باید فعال باشد! اگر فعال نیست، rule کار نمی‌کند.




