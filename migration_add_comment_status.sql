-- Migration: اضافه کردن ستون status به جدول comments
-- تاریخ: 2025-01-XX
-- توضیحات: این فایل را در SQL Editor در Supabase اجرا کنید

-- اضافه کردن ستون status به جدول comments
ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- ایجاد ایندکس برای جستجوی سریع‌تر
CREATE INDEX IF NOT EXISTS idx_comments_status ON public.comments(status);

-- به‌روزرسانی کامنت‌های موجود به وضعیت pending (برای بررسی دستی توسط ادمین)
-- اگر می‌خواهید کامنت‌های قبلی را تایید شده در نظر بگیرید، pending را به approved تغییر دهید
UPDATE public.comments SET status = 'pending' WHERE status IS NULL;
