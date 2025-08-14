# راهنمای راه‌اندازی پنل ادمین لنت شاپ

## 🚀 **مراحل راه‌اندازی**

### **1️⃣ تنظیم دیتابیس Supabase**

#### **الف) ایجاد پروژه در Supabase:**
1. به [supabase.com](https://supabase.com) بروید
2. حساب کاربری ایجاد کنید یا وارد شوید
3. پروژه جدید ایجاد کنید
4. نام پروژه: `lent-shop-admin`
5. رمز عبور دیتابیس را یادداشت کنید

#### **ب) اجرای SQL Script:**
1. در پروژه Supabase، به بخش **SQL Editor** بروید
2. فایل `database_setup.sql` را کپی کنید
3. در SQL Editor پیست کنید و **Run** بزنید

#### **ج) تنظیم Storage:**
1. به بخش **Storage** بروید
2. Bucket جدید با نام `products` ایجاد کنید
3. **Public** را فعال کنید
4. Policy زیر را اضافه کنید:

```sql
-- برای خواندن عکس‌ها (همه کاربران)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'products');

-- برای آپلود عکس‌ها (کاربران احراز هویت شده)
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
```

### **2️⃣ تنظیم Environment Variables**

#### **الف) در فایل `.env.local`:**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### **ب) در Vercel (برای deploy):**
1. به پروژه Vercel بروید
2. **Settings** → **Environment Variables**
3. متغیرهای بالا را اضافه کنید

### **3️⃣ تست پنل ادمین**

#### **الف) اجرای پروژه:**
```bash
npm run dev
```

#### **ب) ورود به پنل:**
1. به `/login` بروید
2. با اطلاعات زیر وارد شوید:
   - **ایمیل:** admin@lentshop.com
   - **رمز عبور:** admin123

#### **ج) تست افزودن محصول:**
1. روی **"افزودن محصول"** کلیک کنید
2. فرم را پر کنید
3. **"افزودن محصول"** را بزنید

### **4️⃣ اتصال به صفحات برند**

#### **الف) بروزرسانی `ProductDetail.jsx`:**
```jsx
// به جای import از productsData.js
import { supabase } from '../../lib/supabase';

// در کامپوننت
const [product, setProduct] = useState(null);

useEffect(() => {
  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (data) setProduct(data);
  };
  
  fetchProduct();
}, [productId]);
```

#### **ب) بروزرسانی صفحات برند:**
```jsx
// به جای import از productsData.js
import { supabase } from '../../lib/supabase';

// در کامپوننت
const [products, setProducts] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('brand', 'تویوتا'); // یا هر برند دیگر
    
    if (data) setProducts(data);
  };
  
  fetchProducts();
}, []);
```

## 🔧 **مشکلات احتمالی و راه‌حل**

### **1️⃣ خطای "relation does not exist":**
- SQL Script را دوباره اجرا کنید
- مطمئن شوید که در پروژه درست Supabase هستید

### **2️⃣ خطای Storage:**
- Bucket `products` ایجاد شده باشد
- Policy های Storage درست تنظیم شده باشند

### **3️⃣ خطای Authentication:**
- Environment Variables درست تنظیم شده باشند
- RLS Policies درست باشند

## 📱 **ویژگی‌های پنل ادمین**

### **✅ انجام شده:**
- [x] فرم ورود و ثبت‌نام
- [x] پنل ادمین با UI زیبا
- [x] فرم افزودن محصول
- [x] لیست محصولات
- [x] جستجو و فیلتر
- [x] حذف محصول
- [x] اتصال به Supabase

### **🔄 در حال توسعه:**
- [ ] ویرایش محصول
- [ ] آپلود عکس
- [ ] مدیریت کاربران
- [ ] گزارش‌گیری

### **📋 برنامه آینده:**
- [ ] مدیریت سفارشات
- [ ] مدیریت موجودی
- [ ] آمار فروش
- [ ] اعلان‌ها

## 🎯 **نکات مهم**

1. **امنیت:** RLS فعال است و فقط کاربران احراز هویت شده می‌توانند محصول اضافه/حذف کنند
2. **عملکرد:** ایندکس‌ها برای جستجوی سریع ایجاد شده‌اند
3. **مقیاس‌پذیری:** ساختار دیتابیس برای محصولات زیاد بهینه شده است
4. **انعطاف‌پذیری:** JSONB برای مشخصات و ویژگی‌های مختلف

## 📞 **پشتیبانی**

اگر مشکلی داشتید:
1. Console مرورگر را چک کنید
2. Network tab را بررسی کنید
3. Supabase Logs را چک کنید
4. با تیم توسعه تماس بگیرید

---

**🎉 پنل ادمین شما آماده است!**
