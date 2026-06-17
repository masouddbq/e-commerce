# 🧪 تست سریع - دستورات مستقیم

## تست 1: بررسی متاتگ‌ها از IIS

```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

**اگر `product_id` را دیدید:**
- ✅ موفق است!

**اگر چیزی ندید:**
- ❌ IIS به Express forward نمی‌کند
- به تست 2 بروید

---

## تست 2: بررسی هدر X-SSR

```powershell
curl.exe -I https://lent-shop.ir/product/toyota/996 | Select-String "X-SSR"
```

**اگر `X-SSR` را دیدید:**
- ✅ IIS به Express forward می‌کند
- اما متاتگ‌ها در HTML نیستند
- مشکل از Express route است

**اگر چیزی ندید:**
- ❌ IIS به Express forward نمی‌کند
- مشکل از IIS Rewrite Rule است

---

## تست 3: مقایسه Response

```powershell
# Express مستقیم
$express = curl.exe -s http://localhost:4000/api/product/toyota/996
$express | Select-String "product_id"

# از طریق IIS
$iis = curl.exe -s https://lent-shop.ir/product/toyota/996
$iis | Select-String "product_id"

# مقایسه طول
Write-Host "Express length: $($express.Length)"
Write-Host "IIS length: $($iis.Length)"
```

---

## اگر تست 2 نشان داد که X-SSR موجود نیست

**مشکل:** IIS به Express forward نمی‌کند

**راه‌حل:**

1. **بررسی Rule Order:**
   - IIS Manager → Sites → lent-shop.ir → URL Rewrite
   - Rule "Product SSR Proxy" باید اول باشد

2. **بررسی Server Level Rules:**
   - IIS Manager → Server Name → URL Rewrite
   - اگر rule‌های قدیمی را می‌بینید، Delete کنید

3. **Restart IIS:**
   ```powershell
   iisreset
   ```

---

## اگر تست 2 نشان داد که X-SSR موجود است اما متاتگ‌ها نیستند

**مشکل:** Express route درست کار نمی‌کند

**راه‌حل:**

1. **بررسی Express Log:**
   ```powershell
   pm2 logs lent-shop-api --lines 20
   ```

2. **بررسی Route Order در Express:**
   - Route `/api/product/:brand/:productId` باید قبل از route‌های catch-all باشد

