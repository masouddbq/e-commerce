-- ایجاد جدول محصولات در Supabase
-- این فایل را در SQL Editor در Supabase اجرا کنید

-- ایجاد جدول products
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    originalPrice TEXT,
    image TEXT,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    suitableFor TEXT,
    stockStatus TEXT DEFAULT 'موجود',
    stockCount INTEGER DEFAULT 0,
    description TEXT,
    specifications JSONB,
    features TEXT[],
    reviews JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ایجاد ایندکس برای جستجوی بهتر
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- فعال‌سازی Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ایجاد policy برای خواندن محصولات (همه کاربران)
CREATE POLICY "Allow public read access" ON products
    FOR SELECT USING (true);

-- ایجاد policy برای نوشتن محصولات (فقط کاربران احراز هویت شده)
CREATE POLICY "Allow authenticated insert" ON products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ایجاد policy برای ویرایش محصولات (فقط کاربران احراز هویت شده)
CREATE POLICY "Allow authenticated update" ON products
    FOR UPDATE USING (auth.role() = 'authenticated');

-- ایجاد policy برای حذف محصولات (فقط کاربران احراز هویت شده)
CREATE POLICY "Allow authenticated delete" ON products
    FOR DELETE USING (auth.role() = 'authenticated');

-- ایجاد تابع برای بروزرسانی updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ایجاد trigger برای بروزرسانی خودکار updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- اضافه کردن چند محصول نمونه برای تست
INSERT INTO products (name, price, originalPrice, brand, category, suitableFor, stockStatus, stockCount, description, specifications, features, reviews) VALUES
(
    'لنت ترمز جلو تویوتا کمری آفورتیس',
    '1,580,000',
    '1,800,000',
    'تویوتا',
    'دیسکی',
    'مناسب برای خودروهای: تویوتا کمری 2015-2023',
    'موجود',
    25,
    'لنت ترمز جلو با کیفیت بالا و دوام عالی، مناسب برای خودروهای تویوتا کمری. این لنت با استفاده از مواد مرغوب و تکنولوژی پیشرفته تولید شده و عملکرد ترمزگیری فوق‌العاده‌ای دارد.',
    '{"material": "کامپوزیت آلی پیشرفته", "thickness": "12.5 میلی‌متر", "weight": "450 گرم", "temperature": "تا 380 درجه سانتیگراد", "warranty": "18 ماه"}',
    ARRAY['مقاوم در برابر حرارت بالا', 'عملکرد ترمزگیری عالی', 'دوام طولانی مدت', 'سازگار با سیستم ترمز ABS', 'کاهش نویز و لرزش'],
    '[{"id": 1, "user": "علی احمدی", "rating": 5, "comment": "کیفیت عالی برای کمری", "date": "1402/12/15"}]'
),
(
    'لنت ترمز عقب تویوتا کمری آفورتیس',
    '1,280,000',
    '1,500,000',
    'تویوتا',
    'دیسکی',
    'مناسب برای خودروهای: تویوتا کمری 2015-2023',
    'موجود',
    20,
    'لنت ترمز عقب با کیفیت بالا، مناسب برای خودروهای تویوتا کمری. این لنت با طراحی بهینه و مواد مرغوب، عملکرد ترمزگیری مطمئن و پایدار ارائه می‌دهد.',
    '{"material": "کامپوزیت آلی", "thickness": "10.8 میلی‌متر", "weight": "380 گرم", "temperature": "تا 350 درجه سانتیگراد", "warranty": "15 ماه"}',
    ARRAY['عملکرد ترمزگیری مطمئن', 'دوام طولانی مدت', 'سازگار با سیستم ترمز ABS', 'کاهش نویز', 'قیمت اقتصادی'],
    '[{"id": 2, "user": "محمد رضایی", "rating": 4, "comment": "قیمت خوب، کیفیت مناسب", "date": "1402/12/12"}]'
);

-- نمایش محصولات اضافه شده
SELECT * FROM products;
