-- Migration: اجازه دادن به NULL برای user_id در جدول orders
-- این فایل را در SQL Editor در Supabase اجرا کنید

-- تغییر ستون user_id به nullable (برای تست درگاه پرداخت بدون OTP)
ALTER TABLE orders
  ALTER COLUMN user_id DROP NOT NULL;

-- به‌روزرسانی Policy برای اجازه دادن به سفارشات بدون user_id
-- (اگر RLS فعال باشه، باید policy رو هم به‌روزرسانی کنیم)
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (
    user_id IS NULL OR auth.uid() = user_id
  );

DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (
    user_id IS NULL OR auth.uid() = user_id
  );

-- به‌روزرسانی Policy برای order_items (برای اجازه دادن به اقلام سفارشات بدون user_id)
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id IS NULL OR orders.user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert own order items" ON order_items;
CREATE POLICY "Users can insert own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id IS NULL OR orders.user_id = auth.uid())
    )
  );

