# تأیید آماده بودن متاتگ‌ها برای ترب

## ✅ وضعیت فعلی

از عکس سوم مشخص است که:
- ✅ متاتگ‌های Torob در سرور تولید می‌شوند (وقتی مستقیماً به Express درخواست می‌دهیم)
- ❌ اما در مرورگر (Ctrl+U) متاتگ‌ها نیستند (IIS rewrite rule کار نمی‌کند)

---

## 🔍 بررسی: آیا متاتگ‌ها برای ترب آماده هستند؟

### تست مستقیم Express (بدون IIS)

برای اطمینان از اینکه متاتگ‌ها برای ترب آماده هستند:

```powershell
# تست مستقیم Express
Invoke-WebRequest -Uri "http://localhost:4000/api/product/toyota/996" | Select-Object -ExpandProperty Content | Select-String "product_id"
```

**اگر این کار کرد:** ✅ متاتگ‌ها برای ترب آماده هستند!

---

## 🤖 چگونه ترب صفحات را می‌خواند؟

Torob crawler:
1. **بدون JavaScript** صفحات را می‌خواند (مثل view source)
2. **مستقیماً به URL** درخواست می‌دهد: `https://lent-shop.ir/product/toyota/996`
3. **HTML خام** را می‌خواند (بدون اجرای JavaScript)

**مشکل:** اگر IIS rewrite rule کار نمی‌کند، ترب هم `index.html` خالی را می‌بیند (بدون متاتگ‌ها).

---

## ✅ راه‌حل: تست با User-Agent ترب

برای تست اینکه آیا IIS rewrite rule برای ترب کار می‌کند:

```powershell
# تست با User-Agent ترب
Invoke-WebRequest -Uri "https://lent-shop.ir/product/toyota/996" -Headers @{"User-Agent"="Mozilla/5.0 (compatible; TorobBot/1.0)"} | Select-Object -ExpandProperty Content | Select-String "product_id"
```

**اگر این کار کرد:** ✅ IIS rewrite rule برای ترب کار می‌کند!

---

## 🎯 راه‌حل نهایی: بررسی IIS Rewrite Rule

اگر IIS rewrite rule برای ترب کار نمی‌کند، باید بررسی کنیم که چرا.

### فرضیه جدید: Rule برای User-Agent های خاص کار نمی‌کند

ممکن است rule فقط برای User-Agent های خاص کار کند. باید بررسی کنیم که آیا rule condition دارد یا نه.

---

## 📋 خلاصه

**سوال:** آیا متاتگ‌ها برای ترب آماده هستند؟

**پاسخ:** 
- ✅ **بله، در Express آماده هستند** (از عکس سوم مشخص است)
- ❌ **اما IIS rewrite rule کار نمی‌کند** (از مرورگر متاتگ‌ها نیستند)

**نتیجه:** 
- اگر IIS rewrite rule کار نمی‌کند، ترب هم متاتگ‌ها را نمی‌بیند
- باید IIS rewrite rule را درست کنیم

---

## 🔧 راه‌حل: تست با User-Agent ترب

برای اطمینان از اینکه ترب متاتگ‌ها را می‌بیند:

```powershell
# تست با User-Agent ترب
Invoke-WebRequest -Uri "https://lent-shop.ir/product/toyota/996" -Headers @{"User-Agent"="Mozilla/5.0 (compatible; TorobBot/1.0)"} | Select-Object -ExpandProperty Content | Select-String "product_id"
```

**اگر این کار کرد:** ✅ ترب متاتگ‌ها را می‌بیند!
**اگر کار نکرد:** باید IIS rewrite rule را درست کنیم.




