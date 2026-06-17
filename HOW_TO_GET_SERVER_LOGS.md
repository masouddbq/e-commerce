# 📋 دستورات مشاهده لاگ‌های سرور

## روش 1: استفاده از PM2 (توصیه می‌شود)

اگر سرور با PM2 اجرا می‌شود:

```powershell
# مشاهده آخرین 200 خط لاگ (برای بررسی callback)
pm2 logs lent-shop-api --lines 200

# مشاهده لاگ‌های real-time (زنده)
pm2 logs lent-shop-api

# مشاهده فقط لاگ‌های خروجی (بدون خطا)
pm2 logs lent-shop-api --out --lines 200

# مشاهده فقط خطاها
pm2 logs lent-shop-api --err --lines 200
```

---

## روش 2: استفاده از فایل لاگ (اگر PM2 لاگ را در فایل ذخیره می‌کند)

```powershell
# مشاهده آخرین خطوط فایل لاگ
Get-Content C:\Users\Administrator\.pm2\logs\lent-shop-api-out.log -Tail 200

# یا اگر مسیر دیگری است:
Get-Content C:\path\to\logs\lent-shop-api-out.log -Tail 200
```

---

## روش 3: اگر سرور به صورت مستقیم اجرا می‌شود (بدون PM2)

اگر سرور را مستقیماً با `node server/index.js` اجرا کرده‌اید، لاگ‌ها در کنسول نمایش داده می‌شوند.

---

## 🎯 دستور توصیه شده برای بررسی Callback

```powershell
pm2 logs lent-shop-api --lines 300 | Select-String -Pattern "CALLBACK|Payment Callback|SMS|phone|Faraz"
```

این دستور:
- آخرین 300 خط لاگ را نشان می‌دهد
- فقط خطوط مربوط به Callback، Payment، SMS و Phone را فیلتر می‌کند

---

## 📝 نکته مهم

**قبل از خرید تستی:**
1. لاگ‌ها را پاک کنید: `pm2 flush`
2. یا یک ترمینال جدید باز کنید تا لاگ‌های جدید را ببینید

**بعد از خرید تستی:**
1. دستور بالا را اجرا کنید
2. لاگ‌ها را کپی کنید
3. برای من بفرستید

