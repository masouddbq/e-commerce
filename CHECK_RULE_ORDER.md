# 🔍 بررسی ترتیب Rule‌ها

## 📋 Rule‌های موجود در IIS Manager

از تصویر مشخص است که rule‌های زیر موجود هستند (از بالا به پایین):

1. **Torob Products and Site...**
2. **Static Files**
3. **API and Payment Callba...**
4. **SSR Product Pages** ⭐
5. **Block SPA for Product** ⭐
6. **React Router**

---

## ✅ بررسی Rule‌های قدیمی

### Rule 1: Torob Products and Sitemap
- **Pattern:** `^(torob-products|sitemap\.xml)$`
- **تأثیر روی product routes:** ❌ ندارد (pattern متفاوت است)

### Rule 2: Static Files
- **Pattern:** `^(assets|_next|static|favicon|images|fonts|.*\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|txt|pdf))`
- **تأثیر روی product routes:** ❌ ندارد (pattern متفاوت است)

### Rule 3: API and Payment Callback
- **Pattern:** `^(api/|payment/)`
- **تأثیر روی product routes:** ❌ ندارد (pattern متفاوت است)

---

## ✅ نتیجه

**Rule‌های قدیمی مشکلی ایجاد نمی‌کنند** چون:
- Pattern‌هایشان با `product/` match نمی‌شوند
- فقط rule‌های مربوط به product هستند که باید اول باشند

**ترتیب فعلی درست است:**
1. Rule‌های قدیمی (که با product match نمی‌شوند)
2. SSR Product Pages (اولین rule برای product)
3. Block SPA for Product (دومین rule برای product)
4. React Router (آخرین rule)

---

## 🔍 اما اگر هنوز کار نمی‌کند

### بررسی 1: Pattern Test

1. Rule "SSR Product Pages" را انتخاب کنید
2. **Edit Rule** → **Test pattern**
3. **Input:** `product/toyota/996`
4. باید Match شود

**اگر Match نشد:**
- Pattern را بررسی کنید: `^product/([^/]+)/([^/]+)$`

---

### بررسی 2: Action Type

Rule "SSR Product Pages" را بررسی کنید:
- **Action type:** باید `Rewrite` باشد
- **Action URL:** باید `http://localhost:4000/api/product/{R:1}/{R:2}` باشد

Rule "Block SPA for Product" را بررسی کنید:
- **Action type:** باید `AbortRequest` باشد
- **نه:** `None` (این کار نمی‌کند)

---

### بررسی 3: Conditions

Rule "SSR Product Pages" را بررسی کنید:
- **Condition:** `{HTTPS}` → Pattern: `on`

**اگر سایت HTTPS است، این condition باید باشد.**

---

### بررسی 4: Server Variables

Rule "SSR Product Pages" را بررسی کنید:
- **Server Variables:** `HTTP_ACCEPT_ENCODING` → Value: (خالی یا space)

**یا اصلاً Server Variables را اضافه نکنید** (اختیاری است)

---

### بررسی 5: Server Level Rules (خیلی مهم!)

**این مرحله خیلی مهم است!**

1. IIS Manager → **Server Name** (نه Site) → **URL Rewrite**
2. **Inbound Rules** را بررسی کنید
3. **اگر rule‌های قدیمی یا SPA fallback را می‌بینید:**
   - آنها را **Delete** کنید
   - یا **Disable** کنید
4. **Apply** کنید

**چرا مهم است؟**
- Rule‌های Server-level قبل از Site-level اجرا می‌شوند
- اگر rule‌های Server-level SPA fallback داشته باشند، rule‌های Site-level هرگز اجرا نمی‌شوند

---

## 🧪 تست نهایی

```powershell
curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
```

**اگر `product_id` را دیدید → موفق است ✅**

**اگر چیزی ندید:**
- Server-level rules را بررسی کنید
- Pattern Test را انجام دهید
- Action Type را بررسی کنید

---

## ✅ چک‌لیست

- [ ] Rule‌های قدیمی موجود هستند (مشکلی نیست)
- [ ] ترتیب Rule‌ها درست است (SSR Product Pages قبل از React Router)
- [ ] Rule "Block SPA for Product" با `AbortRequest` است
- [ ] Pattern Test موفق است
- [ ] Server-level rules بررسی شدند
- [ ] ARR Proxy فعال است
- [ ] IIS restart شد
- [ ] تست نهایی موفق است

