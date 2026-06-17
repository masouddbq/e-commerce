-- Migration: اضافه کردن فیلد shipping_company به جدول orders
-- تاریخ: 2025-01-XX
-- توضیحات: این فایل را در SQL Editor در Supabase اجرا کنید

-- اضافه کردن فیلد shipping_company
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_company VARCHAR(50) DEFAULT 'post';

-- ایجاد ایندکس برای جستجوی سریع‌تر (اختیاری)
CREATE INDEX IF NOT EXISTS idx_orders_shipping_company ON public.orders(shipping_company);

-- به‌روزرسانی سفارش‌های موجود که shipping_company ندارند
UPDATE public.orders 
SET shipping_company = 'post'
WHERE shipping_company IS NULL;
