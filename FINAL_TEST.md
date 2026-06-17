# ✅ تست نهایی: بررسی متاتگ‌ها

## 🎉 وضعیت فعلی

- ✅ Express راه‌اندازی شد
- ✅ PM2 process در حال اجرا است
- ✅ متاتگ‌ها در localhost موجود هستند
- ✅ Route API کار می‌کند

---

## 🧪 تست نهایی

### تست 1: بررسی همه متاتگ‌های ترب

```powershell
# دریافت HTML کامل
$html = curl.exe -s https://lent-shop.ir/api/product/toyota/996

# بررسی همه متاتگ‌ها
Write-Host "`n=== بررسی متاتگ‌های ترب ===" -ForegroundColor Cyan

$checks = @{
    "product_id" = $html -match 'name="product_id"'
    "product_name" = $html -match 'name="product_name"'
    "product_price" = $html -match 'name="product_price"'
    "product_old_price" = $html -match 'name="product_old_price"'
    "availability" = $html -match 'name="availability"'
    "og:title" = $html -match 'property="og:title"'
    "og:image" = $html -match 'property="og:image"'
    "canonical" = $html -match 'rel="canonical"'
}

foreach ($check in $checks.GetEnumerator()) {
    if ($check.Value) {
        Write-Host "[OK] $($check.Key)" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] $($check.Key)" -ForegroundColor Red
    }
}
```

---

### تست 2: تست Route اصلی

```powershell
# تست Route اصلی (بدون /api/)
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

---

### تست 3: تست با User-Agent ترب

```powershell
# شبیه‌سازی درخواست ترب
curl.exe -s -H "User-Agent: Mozilla/5.0 (compatible; TorobBot/1.0)" https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

---

## ✅ چک‌لیست نهایی

- [ ] Express در حال اجرا است (`pm2 status`)
- [ ] Route API کار می‌کند (`curl.exe http://localhost:4000/api/test`)
- [ ] متاتگ `product_id` در localhost موجود است
- [ ] متاتگ `product_id` در HTTPS موجود است
- [ ] همه متاتگ‌های ترب موجود هستند
- [ ] Route اصلی کار می‌کند

---

## 🎯 نتیجه

اگر همه تست‌ها موفق بودند:
- ✅ متاتگ‌ها برای ترب آماده هستند
- ✅ می‌توانید به ترب اطلاع دهید که متاتگ‌ها آماده هستند

---

## 📝 نکات مهم

1. **PM2 را save کنید** تا بعد از restart سرور، process دوباره راه‌اندازی شود:
   ```powershell
   pm2 save
   pm2 startup
   ```

2. **بررسی کنید که PM2 process همیشه در حال اجرا است**

3. **لاگ‌ها را بررسی کنید**:
   ```powershell
   pm2 logs lent-shop-api --lines 50
   ```

