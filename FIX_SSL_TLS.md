# رفع خطای SSL/TLS در PowerShell

## 🔴 مشکل

خطای SSL/TLS در PowerShell هنگام تست HTTPS:
```
Invoke-WebRequest: The request was aborted: Could not create SSL/TLS secure channel.
```

**این مشکل از PowerShell است، نه سرور!**

---

## ✅ راه‌حل: فعال کردن TLS 1.2

قبل از تست HTTPS، TLS 1.2 را فعال کنید:

```powershell
# فعال کردن TLS 1.2
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# تست دوباره
Invoke-WebRequest -Uri "https://lent-shop.ir/product/toyota/996" -Headers @{"User-Agent"="Mozilla/5.0 (compatible; TorobBot/1.0)"} | Select-Object -ExpandProperty Content | Select-String "product_id"
```

---

## 🎯 نتیجه مهم

از اینکه دستور اول کار کرد مشخص است:
- ✅ Express route کار می‌کند
- ✅ متاتگ‌ها تولید می‌شوند
- ✅ متاتگ‌ها برای ترب آماده هستند!

**فقط باید IIS rewrite rule را درست کنیم تا درخواست‌های `/product/` به Express برسند.**

---

## 🔍 بررسی: چرا IIS rewrite rule کار نمی‌کند؟

از لاگ‌ها مشخص است که درخواست‌های `/product/` از مرورگر به Express نمی‌رسند.

**مشکلات احتمالی:**
1. IIS rewrite rule Apply نشده است
2. ترتیب rules درست نیست
3. ARR Proxy مشکل دارد
4. Cache IIS

---

## ✅ راه‌حل: تست از مرورگر با User-Agent تغییر یافته

برای تست اینکه آیا rule برای ترب کار می‌کند:

1. مرورگر را باز کنید (Chrome یا Edge)
2. Developer Tools را باز کنید (F12)
3. به تب **Network** بروید
4. روی **Settings** کلیک کنید
5. **User-Agent** را تغییر دهید: `Mozilla/5.0 (compatible; TorobBot/1.0)`
6. به این آدرس بروید: `https://lent-shop.ir/product/toyota/996`
7. View Source کنید (Ctrl+U)
8. جستجو کنید: `product_id`

**اگر متاتگ‌ها را دیدید:** ✅ rule برای ترب کار می‌کند!

---

## 📋 خلاصه

**وضعیت:**
- ✅ متاتگ‌ها در Express تولید می‌شوند
- ✅ متاتگ‌ها برای ترب آماده هستند
- ❌ اما IIS rewrite rule برای مرورگر کار نمی‌کند

**راه‌حل:**
1. TLS 1.2 را در PowerShell فعال کنید
2. یا از مرورگر با User-Agent تغییر یافته تست کنید
3. یا IIS rewrite rule را بررسی کنید




