# راهنمای تغییر User-Agent در Microsoft Edge

## 🔍 روش 1: استفاده از Device Toolbar (ساده‌تر)

### مرحله 1: باز کردن Developer Tools

1. مرورگر Edge را باز کنید
2. **F12** را بزنید (یا راست کلیک → Inspect)
3. Developer Tools باز می‌شود

---

### مرحله 2: فعال کردن Device Toolbar

1. در Developer Tools، روی آیکون **Device Toolbar** کلیک کنید
   - آیکون شبیه موبایل/تبلت است (در بالای Developer Tools)
   - یا کلید میانبر: **Ctrl+Shift+M**
2. Device Toolbar در بالای صفحه نمایش داده می‌شود

---

### مرحله 3: تغییر User-Agent

1. در Device Toolbar، روی **Responsive** کلیک کنید (یا روی آیکون سه نقطه)
2. **Edit...** را انتخاب کنید
3. در پنجره **Edit device**:
   - **User agent string** را پیدا کنید
   - این User-Agent را وارد کنید: `Mozilla/5.0 (compatible; TorobBot/1.0)`
   - **Save** کنید
4. Device Toolbar را باز نگه دارید

---

## 🔍 روش 2: استفاده از Network Conditions (دقیق‌تر)

### مرحله 1: باز کردن Developer Tools

1. مرورگر Edge را باز کنید
2. **F12** را بزنید
3. Developer Tools باز می‌شود

---

### مرحله 2: باز کردن Network Conditions

1. در Developer Tools، روی **⋮** (سه نقطه) در بالا سمت راست کلیک کنید
2. **More tools** → **Network conditions** را انتخاب کنید
3. تب **Network conditions** باز می‌شود

---

### مرحله 3: تغییر User-Agent

1. در تب **Network conditions**:
   - بخش **User agent** را پیدا کنید
   - تیک **Use browser default** را بردارید
   - **Custom...** را انتخاب کنید
   - این User-Agent را وارد کنید: `Mozilla/5.0 (compatible; TorobBot/1.0)`
2. Developer Tools را باز نگه دارید

---

### مرحله 4: تست

1. به این آدرس بروید: `https://lent-shop.ir/product/toyota/996`
2. View Source کنید (Ctrl+U)
3. جستجو کنید: `product_id` (Ctrl+F)
4. باید متاتگ‌ها را ببینید

---

## 🔍 روش 3: استفاده از Extension (ساده‌ترین روش)

اگر نمی‌توانید User-Agent را در Developer Tools تغییر دهید:

1. Extension **User-Agent Switcher** را نصب کنید:
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




