# 🔧 رفع مشکل: متاتگ‌ها موجود نیستند

## 🔍 مشکل

- ✅ هدر `X-SSR: EXPRESS-HIT` موجود است → Express Hit شده است
- ❌ متاتگ‌ها در HTML موجود نیستند → مشکل در Express route

---

## 🧪 تشخیص مشکل

### تست 1: Express مستقیم

```powershell
curl.exe -s http://localhost:4000/api/product/toyota/996 | Select-String "product_id"
```

**اگر `product_id` را دیدید:**
- ✅ Express route درست کار می‌کند
- مشکل از IIS/ARR است

**اگر چیزی ندید:**
- ❌ Express route مشکل دارد
- باید Express route را بررسی کنید

---

### تست 2: بررسی Route

در Express، route `/api/product/:brand/:productId` باید:
1. HTML با متاتگ‌ها را برگرداند
2. هدر `X-SSR: EXPRESS-HIT` را تنظیم کند
3. Content-Type را `text/html` تنظیم کند

---

## 🔧 راه‌حل‌های ممکن

### راه‌حل 1: بررسی Express Route

**مشکل احتمالی:**
- Route دیگری زودتر match می‌شود
- Route درست اجرا نمی‌شود
- متاتگ‌ها inject نمی‌شوند

**بررسی:**

1. در Express، log را بررسی کنید:
   ```powershell
   pm2 logs lent-shop-api
   ```

2. باید این log را ببینید:
   ```
   [DEBUG] ⭐ /api/product/:brand/:productId route HIT!
   ```

3. اگر این log را نمی‌بینید:
   - Route دیگری در حال اجرا است
   - باید route order را بررسی کنید

---

### راه‌حل 2: بررسی Route Order در Express

در `server/index.js`، ترتیب route‌ها مهم است:

**Route `/api/product/:brand/:productId` باید:**
- قبل از route‌های catch-all باشد
- قبل از route `/product/:brand/:productId` باشد (اگر وجود دارد)

**بررسی:**

```javascript
// باید این route اول باشد:
app.get('/api/product/:brand/:productId', async (req, res) => {
  // ...
});

// نه این:
app.get('/product/:brand/:productId', async (req, res) => {
  // ...
});
```

---

### راه‌حل 3: بررسی ARR Cache

**مشکل احتمالی:**
- ARR در حال cache کردن پاسخ است
- پاسخ قدیمی (بدون متاتگ) cache شده است

**راه‌حل:**

1. در IIS Manager:
   - **Server Name** → **Application Request Routing**
   - **Server Proxy Settings**
   - **Disk Cache** را غیرفعال کنید
   - **Apply** کنید

2. IIS را restart کنید:
   ```powershell
   iisreset
   ```

---

### راه‌حل 4: بررسی Response Headers

**بررسی:**

```powershell
curl.exe -I https://lent-shop.ir/product/toyota/996
```

**باید ببینید:**
```
X-SSR: EXPRESS-HIT
Content-Type: text/html; charset=utf-8
```

**اگر Content-Type اشتباه است:**
- Express route درست تنظیم نشده است
- باید `res.setHeader('Content-Type', 'text/html; charset=utf-8')` را بررسی کنید

---

## ✅ مراحل رفع مشکل

### مرحله 1: تست Express مستقیم

```powershell
curl.exe -s http://localhost:4000/api/product/toyota/996 | Select-String "product_id"
```

**اگر چیزی ندید:**
- Express route مشکل دارد
- به مرحله 2 بروید

**اگر `product_id` را دیدید:**
- Express درست کار می‌کند
- مشکل از IIS/ARR است
- به مرحله 3 بروید

---

### مرحله 2: بررسی Express Route

1. Log Express را بررسی کنید:
   ```powershell
   pm2 logs lent-shop-api --lines 50
   ```

2. بررسی کنید که route `/api/product/:brand/:productId` اجرا می‌شود یا نه

3. اگر route اجرا نمی‌شود:
   - Route order را بررسی کنید
   - Route دیگری ممکن است زودتر match شود

---

### مرحله 3: غیرفعال کردن ARR Cache

1. IIS Manager → **Server Name** → **Application Request Routing**
2. **Server Proxy Settings**
3. **Disk Cache** را غیرفعال کنید
4. **Apply** کنید

5. IIS را restart کنید:
   ```powershell
   iisreset
   ```

---

### مرحله 4: تست مجدد

```powershell
# تست 1: Express مستقیم
curl.exe -s http://localhost:4000/api/product/toyota/996 | Select-String "product_id"

# تست 2: از طریق IIS
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

---

## 🔍 اگر هنوز مشکل دارید

نتیجه این دستورات را بفرستید:

```powershell
# 1. Express مستقیم
curl.exe -s http://localhost:4000/api/product/toyota/996 | Select-String "product_id"

# 2. از طریق IIS
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"

# 3. Headers
curl.exe -I https://lent-shop.ir/product/toyota/996

# 4. Express Log
pm2 logs lent-shop-api --lines 20
```

با این اطلاعات می‌توانم مشکل را دقیق‌تر تشخیص دهم.

