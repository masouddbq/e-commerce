-- ایجاد جدول brands (فقط اگر وجود نداشته باشد)
CREATE TABLE IF NOT EXISTS brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT
);

-- ایجاد جدول categories (فقط اگر وجود نداشته باشد)
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT
);

-- ایجاد جدول products (فقط اگر وجود نداشته باشد)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price VARCHAR(50) NOT NULL,
  originalPrice VARCHAR(50),
  brand VARCHAR(100) NOT NULL,
  padBrand VARCHAR(100),
  vehicleType VARCHAR(50),
  category VARCHAR(100) NOT NULL,
  suitableFor TEXT,
  stockStatus VARCHAR(50) DEFAULT 'موجود',
  stockCount INTEGER DEFAULT 0,
  description TEXT,
  image TEXT,
  specifications JSONB,
  features TEXT[],
  reviews JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- فعال کردن RLS (فقط اگر فعال نباشد)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'brands'
    AND rowsecurity = true
  ) THEN
    ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'categories'
    AND rowsecurity = true
  ) THEN
    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'products'
    AND rowsecurity = true
  ) THEN
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- ایجاد policy برای خواندن (همه کاربران) - فقط اگر وجود نداشته باشد
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'brands'
    AND policyname = 'Allow public read access to brands'
  ) THEN
    CREATE POLICY "Allow public read access to brands" ON brands
      FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'categories'
    AND policyname = 'Allow public read access to categories'
  ) THEN
    CREATE POLICY "Allow public read access to categories" ON categories
      FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'products'
    AND policyname = 'Allow public read access to products'
  ) THEN
    CREATE POLICY "Allow public read access to products" ON products
      FOR SELECT USING (true);
  END IF;
END $$;

-- ایجاد policy برای نوشتن (فقط ادمین) - فقط اگر وجود نداشته باشد
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'brands'
    AND policyname = 'Allow admin insert/update/delete on brands'
  ) THEN
    CREATE POLICY "Allow admin insert/update/delete on brands" ON brands
      FOR ALL USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'categories'
    AND policyname = 'Allow admin insert/update/delete on categories'
  ) THEN
    CREATE POLICY "Allow admin insert/update/delete on categories" ON categories
      FOR ALL USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'products'
    AND policyname = 'Allow admin insert/update/delete on products'
  ) THEN
    CREATE POLICY "Allow admin insert/update/delete on products" ON products
      FOR ALL USING (true);
  END IF;
END $$;

-- اضافه کردن برندهای پیش‌فرض (فقط اگر وجود نداشته باشند)
INSERT INTO brands (name, description) VALUES
  ('تویوتا', 'برند تویوتا'),
  ('هیوندای', 'برند هیوندای'),
  ('نیسان', 'برند نیسان'),
  ('کیا', 'برند کیا'),
  ('لکسوس', 'برند لکسوس'),
  ('جیلی', 'برند جیلی'),
  ('مزدا', 'برند مزدا'),
  ('ام‌جی', 'برند ام‌جی'),
  ('میتسوبیشی', 'برند میتسوبیشی'),
  ('فولکس‌واگن', 'برند فولکس‌واگن'),
  ('سایپا', 'برند سایپا'),
  ('سوزوکی', 'برند سوزوکی'),
  ('رنو', 'برند رنو'),
  ('پژو', 'برند پژو'),
  ('ایران‌خودرو', 'برند ایران‌خودرو'),
  ('فاو', 'برند فاو'),
  ('جی‌ای‌سی', 'برند جی‌ای‌سی')
ON CONFLICT (name) DO NOTHING;

-- اضافه کردن دسته‌بندی‌های پیش‌فرض (فقط اگر وجود نداشته باشند)
INSERT INTO categories (name, description) VALUES
  ('دیسکی', 'دسته‌بندی دیسکی'),
  ('کمپوزیتی', 'دسته‌بندی کمپوزیتی'),
  ('سرامیکی', 'دسته‌بندی سرامیکی'),
  ('فلزی', 'دسته‌بندی فلزی'),
  ('پلاستیکی', 'دسته‌بندی پلاستیکی')
ON CONFLICT (name) DO NOTHING;

-- اطمینان از وجود ستون padBrand در جدول products
ALTER TABLE IF EXISTS products
  ADD COLUMN IF NOT EXISTS padBrand VARCHAR(100);

-- اطمینان از وجود ستون vehicleType در جدول products
ALTER TABLE IF EXISTS products
  ADD COLUMN IF NOT EXISTS vehicleType VARCHAR(50);

-- ایجاد Storage Bucket برای عکس‌های محصولات
-- این دستورات باید در SQL Editor اجرا شوند

-- ایجاد bucket (اگر وجود نداشته باشد)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;

-- ایجاد policy برای خواندن عکس‌ها (همه کاربران)
-- CREATE POLICY "Allow public read access to product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- ایجاد policy برای آپلود عکس‌ها (فقط ادمین)
-- CREATE POLICY "Allow admin upload to product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- ایجاد policy برای حذف عکس‌ها (فقط ادمین)
-- CREATE POLICY "Allow admin delete from product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');
