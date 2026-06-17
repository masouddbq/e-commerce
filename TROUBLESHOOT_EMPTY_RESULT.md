# 🔍 رفع مشکل: نتیجه خالی است

## 🔍 تشخیص مشکل

اگر `curl` نتیجه خالی برمی‌گرداند، این مراحل را بررسی کنید:

---

## مرحله 1: بررسی Express Server

در PowerShell:

```powershell
curl.exe http://localhost:4000/api/product/toyota/996
```

**اگر `product_id` را دیدید:**
- ✅ Express کار می‌کند
- مشکل از IIS Rewrite است

**اگر خطا داد یا خالی بود:**
- ❌ Express در حال اجرا نیست
- باید Express را شروع کنید

---

## مرحله 2: اگر Express کار نمی‌کند

### شروع Express:

```powershell
# پیدا کردن مسیر server
cd C:\e-commerce
# یا مسیر دیگری که server folder در آن است

# بررسی PM2
pm2 list

# اگر Express نیست، شروع کنید
pm2 start index.js --name lent-shop-api
pm2 save

# بررسی دوباره
curl.exe http://localhost:4000/api/product/toyota/996
```

---

## مرحله 3: اگر Express کار می‌کند اما IIS کار نمی‌کند

### بررسی 1: ترتیب Rule‌ها

در IIS Manager:
1. **Sites** → **lent-shop.ir** → **URL Rewrite**
2. **Inbound Rules** را بررسی کنید

ترتیب باید این باشد (از بالا به پایین):
```
1. SSR Product Pages
2. Ignore Product for SPA
3. React Router
```

**اگر ترتیب اشتباه است:**
- Rule "SSR Product Pages" را انتخاب کنید
- **↑ Move Up** را کلیک کنید تا به اول برسد
- **Apply**

---

### بررسی 2: Pattern Rule

1. Rule "SSR Product Pages" را انتخاب کنید
2. **Edit Rule** را کلیک کنید
3. **Test pattern** را کلیک کنید
4. **Input data to test:** `product/toyota/996`
5. **Test** را کلیک کنید

**باید Match شود:**
- `{R:1}` = `toyota`
- `{R:2}` = `996`

**اگر Match نشد:**
- Pattern را بررسی کنید: `^product/([^/]+)/([^/]+)$`

---

### بررسی 3: ARR Proxy

1. در IIS Manager، **Server Name** (نه Site) → **Application Request Routing**
2. **Server Proxy Settings** را باز کنید
3. بررسی کنید:
   - ✅ **Enable Proxy** فعال باشد
   - ✅ **Preserve client IP in X-Forwarded-For** فعال باشد
   - ✅ **Reverse rewrite host in response headers** فعال باشد
4. **Apply**

---

### بررسی 4: Conditions

Rule "SSR Product Pages" را بررسی کنید:
- Condition: `{HTTPS}` → Pattern: `on`

**اگر سایت HTTPS است، این condition باید باشد.**

**اگر سایت HTTP است:**
- این condition را حذف کنید

---

### بررسی 5: Action URL

Rule "SSR Product Pages" را بررسی کنید:
- Action URL باید: `http://localhost:4000/api/product/{R:1}/{R:2}`

**نه:** `https://localhost:4000/...` (نباید HTTPS باشد)

---

## مرحله 4: تست با Failed Request Tracing

### فعال کردن Tracing:

1. در IIS Manager، **Sites** → **lent-shop.ir**
2. **Failed Request Tracing Rules** را دوبار کلیک کنید
3. **Add...** را کلیک کنید
4. **Status code(s):** `200-999`
5. **Next**
6. **Trace areas:** همه را انتخاب کنید
7. **Next**
8. **Finish**

### تست:

```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996
```

### بررسی Log:

```
C:\inetpub\logs\FailedReqLogFiles\W3SVC1\
```

در Log دنبال **REWRITE** بگردید و ببینید آیا rule اجرا شده است یا نه.

---

## مرحله 5: تست مستقیم با IP

اگر مشکل از DNS یا SSL است:

```powershell
# تست مستقیم با IP (اگر می‌دانید)
curl.exe -s http://[IP_SERVER]/product/toyota/996 | Select-String "product_id"
```

---

## مرحله 6: بررسی Response Headers

```powershell
curl.exe -I https://lent-shop.ir/product/toyota/996
```

**اگر Status Code 200 است اما `product_id` نیست:**
- Rewrite rule اجرا نشده است
- React Router در حال اجرا است

---

## مرحله 7: بررسی web.config

```powershell
Get-Content "C:\e-commerce\dist\web.config" | Select-String "SSR Product Pages"
```

**اگر چیزی نبود:**
- Rule در web.config ذخیره نشده است
- باید دوباره اضافه کنید

---

## راه‌حل سریع: حذف و اضافه مجدد Rule

1. Rule "SSR Product Pages" را **Delete** کنید
2. Rule "Ignore Product for SPA" را **Delete** کنید
3. دوباره اضافه کنید (طبق راهنمای قبلی)
4. **IIS restart:**
   ```powershell
   iisreset
   ```
5. **تست:**
   ```powershell
   curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
   ```

---

## ✅ چک‌لیست

- [ ] Express server در حال اجرا است
- [ ] `curl http://localhost:4000/api/product/toyota/996` کار می‌کند
- [ ] ترتیب Rule‌ها درست است
- [ ] Pattern Test موفق است
- [ ] ARR Proxy فعال است
- [ ] Condition HTTPS درست است
- [ ] Action URL درست است
- [ ] IIS restart شد
- [ ] تست نهایی انجام شد

---

## 🎯 نتیجه

بعد از انجام این مراحل، باید `product_id` را ببینید.

اگر هنوز مشکل دارید، نتیجه هر مرحله را بفرستید.

