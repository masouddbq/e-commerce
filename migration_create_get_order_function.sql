-- Migration: ایجاد RPC Function برای دریافت سفارش بر اساس authority
-- این function مستقیماً از دیتابیس استفاده می‌کند و cache ندارد

CREATE OR REPLACE FUNCTION get_order_by_authority(auth_value TEXT)
RETURNS TABLE (
  id BIGINT,
  total_amount BIGINT,
  payment_status TEXT,
  payment_authority VARCHAR,
  order_number VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.total_amount,
    o.payment_status,
    o.payment_authority,
    o.order_number
  FROM public.orders o
  WHERE o.payment_authority = auth_value
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission
GRANT EXECUTE ON FUNCTION get_order_by_authority(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_order_by_authority(TEXT) TO service_role;
