# ⚠️ مشکل بحرانی: Callback URL باید به Backend برود

## 🔴 وضعیت فعلی

از لاگ‌های سرور مشخص است که callbackUrl هنوز به **frontend** می‌رود:
```
callbackUrl: 'https://lent-shop.ir/payment/callback'
```

**این اشتباه است!** باید به **backend** برود.

## ✅ راه‌حل

### 1. بررسی تنظیمات `.env`

مطمئن شوید که `VITE_API_BASE_URL` در `.env` (root) تنظیم شده:

```env
VITE_API_BASE_URL=https://api.lent-shop.ir
# یا اگر backend روی همان سرور است:
VITE_API_BASE_URL=http://87.107.152.3:4000
```

### 2. Build کردن Frontend

**باید حتماً build کنید!** تغییرات در `src/` فقط با build اعمال می‌شوند.

```powershell
npm run build
```

### 3. انتقال فایل‌های Build شده

محتوای پوشه `dist/` را به سرور منتقل کنید و جایگزین کنید.

### 4. بررسی لاگ‌ها

بعد از build و deploy، در لاگ‌ها باید این را ببینید:

```
Creating payment request: {
  callbackUrl: 'https://api.lent-shop.ir/payment/callback'  // ✅ باید backend باشد
  # یا
  callbackUrl: 'http://87.107.152.3:4000/payment/callback'  // ✅ باید backend باشد
}
```

**نه:**
```
callbackUrl: 'https://lent-shop.ir/payment/callback'  // ❌ این frontend است
```

## 🔍 چک‌لیست

- [ ] `VITE_API_BASE_URL` در `.env` تنظیم شده
- [ ] `npm run build` اجرا شده
- [ ] فایل‌های `dist/` به سرور منتقل شده
- [ ] لاگ‌ها نشان می‌دهند که callbackUrl به backend است
- [ ] لاگ `🚨🚨🚨 CALLBACK HIT` در سرور دیده می‌شود

## ⚠️ نکته مهم

**تا زمانی که callbackUrl به frontend است، پیامک تایید خرید هرگز ارسال نمی‌شود!**

چون:
1. زرین‌پال به frontend redirect می‌کند
2. Frontend فقط صفحه را نمایش می‌دهد
3. کد SMS در backend است و اجرا نمی‌شود

**باید callbackUrl به backend برود تا کد SMS اجرا شود.**

