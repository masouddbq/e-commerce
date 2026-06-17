# 🔧 رفع مشکل: IIS به Express forward نمی‌کند

## 🔍 مشکل

- ✅ Express مستقیم کار می‌کند → `product_id` موجود است
- ✅ Log Express نشان می‌دهد متاتگ‌ها inject شده‌اند
- ❌ از طریق IIS متاتگ‌ها نمی‌آیند → IIS به Express forward نمی‌کند

---

## 🧪 تشخیص مشکل

### تست نهایی

```powershell
cd C:\e-commerce
.\test-iis-final.ps1
```

این اسکریپت:
1. Express مستقیم را تست می‌کند
2. IIS را تست می‌کند
3. Headers را بررسی می‌کند
4. Response lengths را مقایسه می‌کند

---

## 🔧 راه‌حل‌های ممکن

### راه‌حل 1: بررسی IIS Rewrite Rule

**مشکل احتمالی:**
- Rule "Product SSR Proxy" اجرا نمی‌شود
- Rule دیگری زودتر match می‌شود

**بررسی:**

1. IIS Manager → **Sites** → **lent-shop.ir** → **URL Rewrite**
2. **Inbound Rules** را بررسی کنید
3. ترتیب باید این باشد:
   ```
   1. Product SSR Proxy (اول)
   2. React Router (آخر)
   ```

4. Rule "Product SSR Proxy" را انتخاب کنید
5. **Edit Rule** → **Test pattern**
6. **Input:** `product/toyota/996`
7. باید Match شود

**اگر Match نشد:**
- Pattern را بررسی کنید: `^product/.*`

---

### راه‌حل 2: بررسی Server Level Rules

**مشکل احتمالی:**
- Rule‌های Server-level زودتر اجرا می‌شوند
- Rule‌های Server-level SPA fallback دارند

**بررسی:**

1. IIS Manager → **Server Name** (نه Site) → **URL Rewrite**
2. **Inbound Rules** را بررسی کنید
3. **اگر rule‌های قدیمی یا SPA fallback را می‌بینید:**
   - آنها را **Delete** کنید
   - یا **Disable** کنید
4. **Apply** کنید

---

### راه‌حل 3: بررسی ARR Proxy Settings

**مشکل احتمالی:**
- ARR Proxy فعال نیست
- یا تنظیمات اشتباه است

**بررسی:**

1. IIS Manager → **Server Name** → **Application Request Routing**
2. **Server Proxy Settings**
3. بررسی کنید:
   - ✅ **Enable Proxy** فعال باشد
   - ✅ **Preserve client IP** فعال باشد
   - ✅ **Reverse rewrite host** فعال باشد
4. **Apply** کنید

---

### راه‌حل 4: بررسی Failed Request Tracing

**اگر هنوز مشکل دارید:**

1. IIS Manager → **Sites** → **lent-shop.ir**
2. **Failed Request Tracing Rules** → **Add...**
3. **Status code(s):** `200-999`
4. **Trace areas:** همه را انتخاب کنید
5. **Finish**

**بعد:**
```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996
```

**بررسی Log:**
```
C:\inetpub\logs\FailedReqLogFiles\W3SVC1\
```

**در Log دنبال `REWRITE` بگردید:**
- باید ببینید: `Rewrite to: http://localhost:4000/api/product/toyota/996`

**اگر `REWRITE` را نمی‌بینید:**
- Rule اجرا نشده است
- Server-level rules را بررسی کنید

---

## ✅ مراحل رفع مشکل

### مرحله 1: تست نهایی

```powershell
cd C:\e-commerce
.\test-iis-final.ps1
```

**اگر IIS متاتگ‌ها را برنمی‌گرداند:**
- به مرحله 2 بروید

---

### مرحله 2: بررسی Rule Order

1. IIS Manager → **Sites** → **lent-shop.ir** → **URL Rewrite**
2. **Inbound Rules** را بررسی کنید
3. ترتیب باید این باشد:
   ```
   1. Product SSR Proxy (اول)
   2. React Router (آخر)
   ```

**اگر ترتیب اشتباه است:**
- Rule "Product SSR Proxy" را انتخاب کنید
- **↑ Move Up** را کلیک کنید تا به اول برسد
- **Apply** کنید

---

### مرحله 3: بررسی Server Level Rules

1. IIS Manager → **Server Name** → **URL Rewrite**
2. **Inbound Rules** را بررسی کنید
3. **اگر rule‌های قدیمی را می‌بینید:**
   - آنها را **Delete** کنید
4. **Apply** کنید

---

### مرحله 4: Restart IIS

```powershell
iisreset
```

---

### مرحله 5: تست مجدد

```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

**اگر `product_id` را دیدید → موفق است ✅**

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

# 4. Rule Test در IIS Manager
# Rule "Product SSR Proxy" → Edit Rule → Test pattern → Input: product/toyota/996
```

با این اطلاعات می‌توانم مشکل را دقیق‌تر تشخیص دهم.

