# 📍 محل‌های web.config در IIS

## 🔍 مهم: web.config فقط برای IIS است

**PM2 کاری با web.config ندارد!**
- PM2 فقط Node.js/Express را مدیریت می‌کند
- web.config فقط برای IIS است

---

## 📂 محل‌های ممکن برای web.config

### 1. Physical Path سایت (اصلی)

**مسیر:**
```
C:\e-commerce\dist\web.config
```

**چگونه پیدا کنیم:**
1. IIS Manager → Sites → lent-shop.ir
2. **Basic Settings** را کلیک کنید
3. **Physical Path** را ببینید
4. `web.config` باید در همان مسیر باشد

**این مهم‌ترین محل است!** ✅

---

### 2. Application Level (اگر Application وجود دارد)

**مسیر:**
```
C:\e-commerce\dist\[ApplicationName]\web.config
```

**بررسی:**
- اگر در IIS Manager، زیر Site یک Application وجود دارد
- ممکن است web.config جداگانه داشته باشد

---

### 3. Root سایت (اگر متفاوت است)

**مسیر:**
```
C:\inetpub\wwwroot\lent-shop\web.config
```

**بررسی:**
- اگر Physical Path متفاوت است
- باید در همان مسیر web.config باشد

---

## 🔍 چگونه پیدا کنیم کدام web.config در حال استفاده است؟

### روش 1: از IIS Manager

1. IIS Manager → Sites → lent-shop.ir
2. **Configuration Editor** را باز کنید
3. در بالای پنجره، مسیر web.config را می‌بینید

**مثال:**
```
Configuration: 'lent-shop.ir' web.config
```

این یعنی web.config در Physical Path سایت است.

---

### روش 2: از PowerShell

```powershell
# پیدا کردن Physical Path
Import-Module WebAdministration
$site = Get-Website | Where-Object { $_.Name -like "*lent*" }
$site.PhysicalPath

# بررسی web.config
$webConfigPath = Join-Path $site.PhysicalPath "web.config"
Test-Path $webConfigPath
Get-Content $webConfigPath | Select-String "Product SSR Proxy"
```

---

### روش 3: بررسی دستی

1. IIS Manager → Sites → lent-shop.ir → **Basic Settings**
2. **Physical Path** را یادداشت کنید
3. در File Explorer به آن مسیر بروید
4. بررسی کنید که `web.config` وجود دارد

---

## ⚠️ نکات مهم

### 1. فقط یک web.config در Physical Path

**مهم:** فقط یک `web.config` در Physical Path سایت باید وجود داشته باشد.

**اگر چند web.config وجود دارد:**
- IIS از نزدیک‌ترین به root استفاده می‌کند
- یا از Application level (اگر وجود دارد)

---

### 2. web.config در Application Level

**اگر Application وجود دارد:**
- web.config در Application level می‌تواند rule‌های Site level را override کند
- باید بررسی کنید که آیا Application level web.config وجود دارد یا نه

**بررسی:**
1. IIS Manager → Sites → lent-shop.ir
2. اگر زیر آن Application وجود دارد
3. Application را انتخاب کنید
4. **Configuration Editor** را باز کنید
5. مسیر web.config را ببینید

---

### 3. web.config در Server Level

**Server-level web.config:**
- در `C:\Windows\System32\inetsrv\config\applicationHost.config`
- این فایل را دستی تغییر ندهید!
- از IIS Manager استفاده کنید

---

## ✅ چک‌لیست

- [ ] Physical Path سایت را پیدا کردید
- [ ] web.config در Physical Path موجود است
- [ ] web.config در Application level بررسی شد (اگر وجود دارد)
- [ ] فقط یک web.config در Physical Path وجود دارد
- [ ] web.config درست کپی شده است

---

## 🔧 اگر چند web.config وجود دارد

### راه‌حل 1: حذف web.config اضافی

**اگر web.config در Application level وجود دارد:**
1. بررسی کنید که آیا لازم است یا نه
2. اگر لازم نیست، Delete کنید
3. یا rule‌های آن را به Site level منتقل کنید

---

### راه‌حل 2: Merge کردن rule‌ها

**اگر web.config در Application level لازم است:**
1. rule‌های Site level را به Application level منتقل کنید
2. یا rule‌های Application level را به Site level منتقل کنید

---

## 📋 خلاصه

**web.config باید در:**
- ✅ Physical Path سایت (اصلی)
- ❌ نه در Application level (مگر اینکه لازم باشد)
- ❌ نه در Server level (نباید دستی تغییر دهید)

**PM2:**
- ❌ کاری با web.config ندارد
- ✅ فقط Express را مدیریت می‌کند

