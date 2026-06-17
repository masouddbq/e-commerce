# راهنمای تغییر User-Agent در مرورگر

## 🔍 روش 1: Chrome/Edge (Developer Tools)

### مرحله 1: باز کردن Developer Tools

1. مرورگر را باز کنید (Chrome یا Edge)
2. **F12** را بزنید (یا راست کلیک → Inspect)
3. Developer Tools باز می‌شود

---

### مرحله 2: فعال کردن Device Toolbar

1. در Developer Tools، روی آیکون **Device Toolbar** کلیک کنید (یا `Ctrl+Shift+M`)
2. یا از منو: **More tools** → **Network conditions**

---

### مرحله 3: تغییر User-Agent

1. در Developer Tools، به تب **Network conditions** بروید
   - اگر تب Network conditions را نمی‌بینید:
     - روی **⋮** (سه نقطه) در Developer Tools کلیک کنید
     - **More tools** → **Network conditions**
2. در بخش **User agent**:
   - تیک **Use browser default** را بردارید
   - **Custom...** را انتخاب کنید
   - این User-Agent را وارد کنید: `Mozilla/5.0 (compatible; TorobBot/1.0)`
3. Developer Tools را باز نگه دارید

---

### مرحله 4: تست

1. به این آدرس بروید: `https://lent-shop.ir/product/toyota/996`
2. View Source کنید (Ctrl+U)
3. جستجو کنید: `product_id` (Ctrl+F)
4. باید متاتگ‌ها را ببینید

---

## 🔍 روش 2: استفاده از Extension

اگر نمی‌توانید User-Agent را در Developer Tools تغییر دهید:

1. Extension **User-Agent Switcher** را نصب کنید:
   - Chrome: https://chrome.google.com/webstore/detail/user-agent-switcher-for-c/djflhoibgkdhkhhcedjiklpkjnoahfmg
   - Edge: https://microsoftedge.microsoft.com/addons/detail/user-agent-switcher/klkfknicofcbelmhajclgfligepnlkdp
2. Extension را فعال کنید
3. User-Agent را به `Mozilla/5.0 (compatible; TorobBot/1.0)` تغییر دهید
4. صفحه را refresh کنید
5. View Source کنید (Ctrl+U)

---

## 🎯 راه‌حل ساده‌تر: استفاده از Route مستقیم

اگر نمی‌خواهید User-Agent را تغییر دهید، می‌توانید به ترب بگویید که از route مستقیم استفاده کند:

```
https://lent-shop.ir/api/product/toyota/996
```

این route مستقیماً از Express می‌آید و متاتگ‌ها را دارد.

---

## ✅ نتیجه مهم

از اینکه دستور اول کار کرد مشخص است:
- ✅ Express route کار می‌کند
- ✅ متاتگ‌ها تولید می‌شوند
- ✅ متاتگ‌ها برای ترب آماده هستند

**می‌توانید به ترب بگویید که متاتگ‌ها آماده هستند!**

---

## 📋 خلاصه

**اگر نمی‌توانید User-Agent را تغییر دهید:**
- می‌توانید به ترب بگویید که از route مستقیم استفاده کند: `/api/product/:brand/:productId`
- یا می‌توانید از Extension استفاده کنید

**مهم:** متاتگ‌ها برای ترب آماده هستند! ✅




