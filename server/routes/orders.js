/* eslint-env node */
import express from 'express';
import supabaseAdmin from '../supabaseAdminClient.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

/**
 * دریافت لیست سفارشات کاربر لاگین شده
 * GET /api/orders/my-orders
 */
router.get('/my-orders', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;

    // دریافت سفارشات کاربر
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('[Orders API] Error fetching orders:', ordersError);
      throw ordersError;
    }

    const ordersList = Array.isArray(orders) ? orders : [];

    // دریافت order_items برای همه سفارشات
    const orderIds = ordersList.map(o => o.id);
    let orderItemsMap = {};

    if (orderIds.length > 0) {
      const { data: orderItems, error: itemsError } = await supabaseAdmin
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      if (itemsError) {
        console.error('[Orders API] Error fetching order_items:', itemsError);
      } else {
        orderItemsMap = (orderItems || []).reduce((acc, item) => {
          if (!acc[item.order_id]) {
            acc[item.order_id] = [];
          }
          acc[item.order_id].push(item);
          return acc;
        }, {});
      }
    }

    // تعیین وضعیت سفارش به فارسی
    const getStatusLabel = (status) => {
      const statusMap = {
        'confirmed': 'تایید شده',
        'preparing': 'آماده سازی',
        'shipped': 'ارسال',
        'delivered': 'تحویل',
      };
      return statusMap[status] || status;
    };

    res.json({
      success: true,
      data: {
        orders: ordersList.map(order => {
          const items = orderItemsMap[order.id] || [];
          return {
            id: order.id,
            full_name: order.full_name,
            phone: order.phone,
            address: order.address,
            postal_code: order.postal_code,
            shipping_company: order.shipping_company || 'post',
            total_amount: order.total_amount,
            payment_status: order.payment_status,
            payment_status_label: getStatusLabel(order.payment_status),
            payment_ref_id: order.payment_ref_id,
            created_at: order.created_at,
            items_count: items.length,
            items: items.map(item => ({
              id: item.id,
              name: item.name_snapshot,
              unit_price: item.unit_price,
              quantity: item.quantity,
              total_price: item.unit_price * item.quantity,
            })),
          };
        }),
      },
    });
  } catch (error) {
    console.error('[Orders API] My orders error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در دریافت سفارشات',
    });
  }
});

/**
 * پیگیری سفارش بر اساس شماره سفارش یا کد پیگیری (فقط برای کاربر لاگین شده)
 * GET /api/orders/track?orderId=123 یا GET /api/orders/track?trackingId=ABC123
 */
router.get('/track', authenticateUser, async (req, res) => {
  try {
    const { orderId, trackingId } = req.query;
    const userId = req.userId;

    if (!orderId && !trackingId) {
      return res.status(400).json({
        success: false,
        error: 'شماره سفارش یا کد پیگیری الزامی است',
      });
    }

    let orderQuery = supabaseAdmin
      .from('orders')
      .select('*')
      .eq('user_id', userId); // فقط سفارشات کاربر لاگین شده

    // جستجو بر اساس orderId یا trackingId (payment_ref_id)
    if (orderId) {
      orderQuery = orderQuery.eq('id', orderId);
    } else if (trackingId) {
      orderQuery = orderQuery.eq('payment_ref_id', trackingId);
    }

    const { data: order, error: orderError } = await orderQuery.single();

    if (orderError || !order) {
      return res.status(404).json({
        success: false,
        error: 'سفارش یافت نشد. لطفاً شماره سفارش یا کد پیگیری را بررسی کنید.',
      });
    }

    // دریافت اقلام سفارش
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)
      .order('id', { ascending: true });

    if (itemsError) {
      console.error('[Orders API] Error fetching order_items:', itemsError);
      // ادامه می‌دهیم حتی اگر order_items رو نتونستیم بگیریم
    }

    // محاسبه تعداد کل اقلام
    const totalItems = (orderItems || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

    // تعیین وضعیت سفارش به فارسی
    const getStatusLabel = (status) => {
      const statusMap = {
        'confirmed': 'تایید شده',
        'preparing': 'آماده سازی',
        'shipped': 'ارسال',
        'delivered': 'تحویل',
      };
      return statusMap[status] || status;
    };

    res.json({
      success: true,
      data: {
        order: {
          id: order.id,
          full_name: order.full_name,
          phone: order.phone,
          address: order.address,
          postal_code: order.postal_code,
          shipping_company: order.shipping_company || 'post',
          total_amount: order.total_amount,
          payment_status: order.payment_status,
          payment_status_label: getStatusLabel(order.payment_status),
          payment_ref_id: order.payment_ref_id,
          created_at: order.created_at,
        },
        items: (orderItems || []).map(item => ({
          id: item.id,
          name: item.name_snapshot,
          unit_price: item.unit_price,
          quantity: item.quantity,
          total_price: item.unit_price * item.quantity,
        })),
        total_items: totalItems,
      },
    });
  } catch (error) {
    console.error('[Orders API] Track order error:', error);
    console.error('[Orders API] Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در دریافت اطلاعات سفارش',
      details: process.env.NODE_ENV !== 'production' ? {
        code: error.code,
        details: error.details,
        hint: error.hint,
      } : undefined,
    });
  }
});

export { router as ordersRouter };

