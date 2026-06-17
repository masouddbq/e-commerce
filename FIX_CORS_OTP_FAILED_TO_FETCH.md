# رفع مشکل "failed to fetch" در OTP - مشکل CORS

## 🐛 مشکل

وقتی کاربر می‌خواهد شماره را وارد کند تا OTP بگیرد، خطای "failed to fetch" می‌گیرد.

**علت:**
- در لاگ‌های سرور مشاهده شد که: `[CORS] Blocked origin: https://lent-shop.ir`
- دامنه `https://lent-shop.ir` در لیست مجاز CORS نبود
- چون `NODE_ENV` تنظیم نشده بود (undefined)، شرط `if (NODE_ENV === 'production')` کار نمی‌کرد
- بنابراین دامنه‌های production به لیست اضافه نمی‌شدند

## ✅ راه‌حل

کد اصلاح شد تا **همیشه** دامنه‌های production را به لیست CORS اضافه کند (حتی اگر `NODE_ENV` تنظیم نشده باشد).

### تغییرات:

**قبل:**
```javascript
if (NODE_ENV === 'production') {
  const productionOrigins = [...];
  // اضافه کردن دامنه‌ها
}
```

**بعد:**
```javascript
// همیشه دامنه‌های production را اضافه می‌کنیم
const productionOrigins = [...];
productionOrigins.forEach(origin => {
  if (!corsOrigins.includes(origin)) {
    corsOrigins.push(origin);
  }
});
```

## 📋 فایل‌های تغییر یافته

✅ `server/index.js` - اصلاح منطق اضافه کردن دامنه‌های production

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

### 3. تست

1. وارد صفحه ورود/ثبت‌نام شوید
2. شماره موبایل را وارد کنید
3. روی دکمه "ارسال کد تایید" کلیک کنید
4. باید OTP ارسال شود (بدون خطای "failed to fetch")

## 🔍 بررسی لاگ‌ها

بعد از restart، در لاگ‌ها باید این را ببینید:

```
[Server] CORS Origins: [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'https://lent-shop.ir',      // ✅ باید اضافه شده باشد
  'http://lent-shop.ir',
  'https://www.lent-shop.ir',
  'http://www.lent-shop.ir'
]
```

**اگر هنوز خطا دارید:**
- بررسی کنید که `https://lent-shop.ir` در لیست CORS Origins است
- بررسی کنید که سرور restart شده است
- بررسی کنید که درخواست از `https://lent-shop.ir` ارسال می‌شود (نه از دامنه دیگر)

## ⚠️ نکات مهم

1. **تنظیمات `.env` (اختیاری):**
   اگر می‌خواهید دامنه‌های بیشتری اضافه کنید، می‌توانید در `server/.env` این را تنظیم کنید:
   ```env
   CLIENT_ORIGIN=https://lent-shop.ir,https://www.lent-shop.ir
   ```

2. **NODE_ENV (اختیاری):**
   می‌توانید `NODE_ENV=production` را در `server/.env` تنظیم کنید، اما دیگر ضروری نیست چون کد همیشه production origins را اضافه می‌کند.

3. **اگر هنوز مشکل دارید:**
   - بررسی کنید که درخواست از `https://lent-shop.ir` ارسال می‌شود
   - بررسی کنید که لاگ `[CORS] Blocked origin` دیگر نمایش داده نمی‌شود
   - بررسی کنید که `Access-Control-Allow-Origin` در response headers وجود دارد

