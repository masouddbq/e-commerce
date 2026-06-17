-- Migration: اضافه کردن فیلد order_number به جدول orders
-- تاریخ: 2025-12-08

-- اضافه کردن فیلد order_number (یونیک)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS order_number VARCHAR(50) UNIQUE;

-- ایجاد ایندکس برای جستجوی سریع‌تر
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);

-- تابع برای تولید شماره سفارش یونیک
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR(50) AS $$
DECLARE
  new_order_number VARCHAR(50);
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- تولید شماره سفارش: ORD-YYYYMMDD-HHMMSS-RANDOM
    new_order_number := 'ORD-' || 
      TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
      TO_CHAR(NOW(), 'HH24MISS') || '-' ||
      LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- بررسی اینکه آیا این شماره قبلاً استفاده شده است
    SELECT EXISTS(SELECT 1 FROM public.orders WHERE order_number = new_order_number) INTO exists_check;
    
    -- اگر شماره یونیک است، برگردان
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- به‌روزرسانی سفارش‌های موجود که order_number ندارند
UPDATE public.orders 
SET order_number = generate_order_number()
WHERE order_number IS NULL;
