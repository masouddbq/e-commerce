# 🔍 تشخیص سریع مشکل

## مرحله 1: بررسی Express Server

در PowerShell (در سرور):

```powershell
curl.exe http://localhost:4000/api/product/toyota/996
```

**اگر `product_id` را دیدید:**
- ✅ Express کار می‌کند
- ❌ مشکل از IIS Rewrite است

**اگر خطا داد یا چیزی برنگشت:**
- ❌ Express در حال اجرا نیست
- باید Express را شروع کنید

---

## مرحله 2: بررسی IIS Rewrite

```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

**اگر `product_id` را دیدید:**
- ✅ همه چیز کار می‌کند!

**اگر چیزی ندید:**
- ❌ IIS Rewrite کار نمی‌کند
- باید rule‌ها را دستی اضافه کنید

---

## مرحله 3: اگر Express کار می‌کند اما IIS کار نمی‌کند

Rule‌ها را دستی در IIS Manager اضافه کنید (راهنمای زیر).

---

## مرحله 4: اگر Express کار نمی‌کند

```powershell
# پیدا کردن مسیر server
cd C:\e-commerce
# یا مسیر دیگری که server folder در آن است

# شروع Express با PM2
pm2 start index.js --name lent-shop-api
pm2 save

# بررسی
pm2 list
```

