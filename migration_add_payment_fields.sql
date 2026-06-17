-- Migration: اضافه کردن فیلدهای پرداخت به جدول orders
-- تاریخ: 2025-12-08

-- اضافه کردن فیلد payment_authority
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_authority VARCHAR(255);

-- اضافه کردن فیلد payment_ref_id (اگر وجود ندارد)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_ref_id VARCHAR(255);

-- اضافه کردن فیلد payment_verified_at (اگر وجود ندارد)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMP WITH TIME ZONE;

-- ایجاد ایندکس برای جستجوی سریع‌تر بر اساس authority
CREATE INDEX IF NOT EXISTS idx_orders_payment_authority ON public.orders(payment_authority);
