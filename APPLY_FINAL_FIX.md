# 📋 راهنمای اعمال راه‌حل نهایی

## ⚡ تغییرات کلیدی

### تغییر اصلی:

اضافه کردن `<handlers>` به `web.config` برای جلوگیری از Static File Handler قبل از Rewrite.

**چرا؟**
- IIS قبل از Rewrite، Static Content Handler را اجرا می‌کرد
- این باعث می‌شد Response فقط 41 کاراکتر باشد
- Rewrite Rule اجرا نمی‌شد

---

## 📝 مراحل اعمال

### مرحله 1: کپی web.config

1. فایل `web.config` از پروژه local را باز کنید
2. همه محتوا را کپی کنید (`Ctrl + A`, `Ctrl + C`)
3. در سرور، فایل `C:\e-commerce\dist\web.config` را باز کنید
4. همه محتوا را جایگزین کنید (`Ctrl + A`, `Ctrl + V`)
5. ذخیره کنید (`Ctrl + S`)

---

### مرحله 2: بررسی فولدر product

**اگر فولدر `product` در `C:\e-commerce\dist\` وجود دارد:**

1. آن را **Delete** کنید
2. یا **Rename** کنید به `product_disabled`

**اگر فولدر `product` وجود ندارد:**
- مشکلی نیست، به مرحله بعد بروید

---

### مرحله 3: Restart IIS

```powershell
iisreset
```

---

### مرحله 4: Restart Express

```powershell
cd C:\e-commerce
pm2 restart lent-shop-api
```

---

### مرحله 5: تست

```powershell
# تست 1: هدر X-SSR
curl.exe -I https://lent-shop.ir/product/toyota/996 | findstr "X-SSR"

# تست 2: متاتگ
curl.exe -s https://lent-shop.ir/product/toyota/996 | findstr "product_id"

# تست 3: Response length
$result = curl.exe -s https://lent-shop.ir/product/toyota/996
Write-Host "Response length: $($result.Length)"
```

**باید ببینید:**
- `X-SSR: EXPRESS-HIT`
- `product_id`
- Response length: 3000+

---

## ✅ چک‌لیست

- [ ] `web.config` به سرور کپی شد (با handlers)
- [ ] فولدر `product` از `dist` حذف شد (اگر وجود داشت)
- [ ] IIS restart شد
- [ ] Express restart شد
- [ ] تست‌ها موفق هستند

---

## 🎯 نتیجه

بعد از اعمال این تغییرات، باید:
- ✅ درخواست‌ها به Express برسند
- ✅ متاتگ‌ها در View Source موجود باشند
- ✅ ربات‌ها بتوانند متاتگ‌ها را بخوانند

