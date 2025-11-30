-- Migration: اضافه کردن ستون‌های پرداخت به جدول orders
-- این فایل را در SQL Editor در Supabase اجرا کنید

-- اضافه کردن ستون‌های مربوط به پرداخت
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_authority TEXT,
  ADD COLUMN IF NOT EXISTS payment_ref_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMPTZ;

-- ایجاد ایندکس برای جستجوی سریع بر اساس authority
CREATE INDEX IF NOT EXISTS idx_orders_payment_authority ON orders(payment_authority) WHERE payment_authority IS NOT NULL;

-- ایجاد ایندکس برای جستجوی سریع بر اساس ref_id
CREATE INDEX IF NOT EXISTS idx_orders_payment_ref_id ON orders(payment_ref_id) WHERE payment_ref_id IS NOT NULL;

