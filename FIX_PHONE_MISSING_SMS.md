# رفع مشکل phone missing در پیامک تایید خرید

## 🔍 مشکل شناسایی شده

از لاگ‌های سرور مشخص است که:
- ✅ Callback به بخش SMS رسیده
- ❌ اما `phone: MISSING` است
- ❌ خطا: `Error: phone is not valid`

## 🔧 راه‌حل

کد اصلاح شد تا:
1. لاگ‌های بیشتر برای دیباگ اضافه شود
2. بررسی دقیق‌تر phone انجام شود
3. phone به درستی validate شود

## 📋 فایل‌های تغییر یافته

✅ `server/index.js` - اضافه شدن لاگ‌های بیشتر و بررسی دقیق‌تر phone

## 🚀 مراحل Deploy

### 1. انتقال فایل به سرور

```powershell
# فایل server/index.js را به سرور منتقل کنید
# مسیر در سرور: C:\...\server\index.js
```

### 2. Restart سرور

```powershell
pm2 restart lent-shop-api
# یا
iisreset
```

### 3. تست و بررسی لاگ‌ها

بعد از یک خرید تستی، این لاگ‌ها را بررسی کنید:

```
[Payment Callback] 📦 اطلاعات سفارش: {
  phoneRaw: "...",  // مقدار واقعی phone
  phoneType: "...", // نوع داده
  phoneLength: ..., // طول رشته
  orderFullKeys: [...] // کلیدهای موجود در orderFull
}

[Payment Callback] 🔍 بررسی phone: {
  phoneValue: "...",
  hasValidPhone: true/false
}
```

## ⚠️ نکات مهم

1. **اگر phone واقعاً null است:**
   - بررسی کنید که در checkout شماره تلفن به درستی ثبت می‌شود
   - بررسی کنید که در دیتابیس phone ذخیره می‌شود

2. **اگر phone موجود است اما validate نمی‌شود:**
   - بررسی کنید که phone به صورت string است
   - بررسی کنید که phone خالی نیست

3. **اگر مشکل ادامه دارد:**
   - لاگ‌های جدید را بررسی کنید
   - مقدار `phoneRaw` و `orderFullKeys` را بررسی کنید

