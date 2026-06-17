-- Migration: ایجاد جدول comments برای نظرات محصولات
-- تاریخ: 2025-01-XX
-- توضیحات: این فایل را در SQL Editor در Supabase اجرا کنید

-- ایجاد جدول comments
CREATE TABLE IF NOT EXISTS public.comments (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ایجاد ایندکس‌ها برای جستجوی سریع‌تر
CREATE INDEX IF NOT EXISTS idx_comments_product_id ON public.comments(product_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);

-- فعال‌سازی Row Level Security
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Policy: همه کاربران می‌توانند نظرات را ببینند
CREATE POLICY "Allow public read access" ON public.comments
  FOR SELECT USING (true);

-- Policy: فقط کاربران لاگین شده می‌توانند نظر ثبت کنند
CREATE POLICY "Allow authenticated insert" ON public.comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Policy: کاربران فقط می‌توانند نظرات خود را ویرایش کنند
CREATE POLICY "Allow users update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: کاربران فقط می‌توانند نظرات خود را حذف کنند
CREATE POLICY "Allow users delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- تابع برای بروزرسانی خودکار updated_at
CREATE OR REPLACE FUNCTION update_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ایجاد trigger برای بروزرسانی خودکار updated_at
CREATE TRIGGER update_comments_updated_at_trigger
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comments_updated_at();
