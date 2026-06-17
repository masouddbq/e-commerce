/* eslint-env node */
import express from 'express';
import supabaseAdmin from '../supabaseAdminClient.js';

const router = express.Router();

/**
 * دریافت گزارش فروش روزانه
 * GET /api/sales/daily?date=2024-01-01
 */
router.get('/daily', async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    // شروع و پایان روز
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    console.log('[Sales API] Daily report request:', {
      date,
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString(),
    });

    // دریافت سفارشات روز
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString())
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('[Sales API] Supabase error:', ordersError);
      console.error('[Sales API] Error details:', {
        message: ordersError.message,
        code: ordersError.code,
        details: ordersError.details,
        hint: ordersError.hint,
      });
      throw ordersError;
    }

    console.log('[Sales API] Orders fetched:', orders?.length || 0);

    // اطمینان از اینکه orders یک آرایه است
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
        console.error('[Sales API] Error fetching order_items:', itemsError);
        // ادامه می‌دهیم حتی اگر order_items رو نتونستیم بگیریم
      } else {
        // ساخت map برای دسترسی سریع
        orderItemsMap = (orderItems || []).reduce((acc, item) => {
          if (!acc[item.order_id]) {
            acc[item.order_id] = [];
          }
          acc[item.order_id].push(item);
          return acc;
        }, {});
      }
    }

    // محاسبه آمار
    const totalOrders = ordersList.length;
    const totalAmount = ordersList.reduce((sum, order) => {
      const amount = order?.total_amount || 0;
      return sum + (typeof amount === 'number' ? amount : 0);
    }, 0);
    const confirmedOrders = ordersList.filter(o => o?.payment_status === 'confirmed' || o?.payment_status === 'delivered').length;
    const confirmedAmount = ordersList
      .filter(o => o?.payment_status === 'confirmed' || o?.payment_status === 'delivered')
      .reduce((sum, order) => {
        const amount = order?.total_amount || 0;
        return sum + (typeof amount === 'number' ? amount : 0);
      }, 0);

    res.json({
      success: true,
      data: {
        period: 'daily',
        date: targetDate.toISOString().split('T')[0],
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
            payment_ref_id: order.payment_ref_id,
            created_at: order.created_at,
            items_count: items.length,
            items: items.map(item => ({
              name: item.name_snapshot,
              quantity: item.quantity,
              unit_price: item.unit_price,
              total_price: item.unit_price * item.quantity,
            })),
          };
        }),
        stats: {
          total_orders: totalOrders,
          total_amount: totalAmount,
          confirmed_orders: confirmedOrders,
          confirmed_amount: confirmedAmount,
          pending_orders: totalOrders - confirmedOrders,
        },
      },
    });
  } catch (error) {
    console.error('[Sales API] Daily report error:', error);
    console.error('[Sales API] Error stack:', error.stack);
    console.error('[Sales API] Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در دریافت گزارش فروش روزانه',
      details: process.env.NODE_ENV !== 'production' ? {
        code: error.code,
        details: error.details,
        hint: error.hint,
      } : undefined,
    });
  }
});

/**
 * دریافت گزارش فروش هفتگی
 * GET /api/sales/weekly?week=2024-W01
 */
router.get('/weekly', async (req, res) => {
  try {
    const { week } = req.query;
    let startOfWeek, endOfWeek;

    if (week) {
      // Parse week format: YYYY-Www
      const [year, weekNum] = week.split('-W').map(Number);
      const date = new Date(year, 0, 1 + (weekNum - 1) * 7);
      const dayOfWeek = date.getDay();
      const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday
      startOfWeek = new Date(date.setDate(diff));
      startOfWeek.setHours(0, 0, 0, 0);
      endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
    } else {
      // هفته جاری
      const today = new Date();
      const dayOfWeek = today.getDay();
      const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday
      startOfWeek = new Date(today.setDate(diff));
      startOfWeek.setHours(0, 0, 0, 0);
      endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
    }

    console.log('[Sales API] Weekly report request:', {
      startOfWeek: startOfWeek.toISOString(),
      endOfWeek: endOfWeek.toISOString(),
    });

    // دریافت سفارشات هفته
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .gte('created_at', startOfWeek.toISOString())
      .lte('created_at', endOfWeek.toISOString())
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('[Sales API] Supabase error (weekly):', ordersError);
      throw ordersError;
    }

    console.log('[Sales API] Orders fetched (weekly):', orders?.length || 0);

    // اطمینان از اینکه orders یک آرایه است
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
        console.error('[Sales API] Error fetching order_items (weekly):', itemsError);
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

    // محاسبه آمار
    const totalOrders = ordersList.length;
    const totalAmount = ordersList.reduce((sum, order) => {
      const amount = order?.total_amount || 0;
      return sum + (typeof amount === 'number' ? amount : 0);
    }, 0);
    const confirmedOrders = ordersList.filter(o => o?.payment_status === 'confirmed' || o?.payment_status === 'delivered').length;
    const confirmedAmount = ordersList
      .filter(o => o?.payment_status === 'confirmed' || o?.payment_status === 'delivered')
      .reduce((sum, order) => {
        const amount = order?.total_amount || 0;
        return sum + (typeof amount === 'number' ? amount : 0);
      }, 0);

    res.json({
      success: true,
      data: {
        period: 'weekly',
        start_date: startOfWeek.toISOString().split('T')[0],
        end_date: endOfWeek.toISOString().split('T')[0],
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
            payment_ref_id: order.payment_ref_id,
            created_at: order.created_at,
            items_count: items.length,
            items: items.map(item => ({
              name: item.name_snapshot,
              quantity: item.quantity,
              unit_price: item.unit_price,
              total_price: item.unit_price * item.quantity,
            })),
          };
        }),
        stats: {
          total_orders: totalOrders,
          total_amount: totalAmount,
          confirmed_orders: confirmedOrders,
          confirmed_amount: confirmedAmount,
          pending_orders: totalOrders - confirmedOrders,
        },
      },
    });
  } catch (error) {
    console.error('[Sales API] Weekly report error:', error);
    console.error('[Sales API] Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در دریافت گزارش فروش هفتگی',
      details: process.env.NODE_ENV !== 'production' ? {
        code: error.code,
        details: error.details,
        hint: error.hint,
      } : undefined,
    });
  }
});

/**
 * دریافت گزارش فروش ماهانه
 * GET /api/sales/monthly?year=2024&month=1
 */
router.get('/monthly', async (req, res) => {
  try {
    const { year, month } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const targetMonth = month ? parseInt(month) - 1 : new Date().getMonth();

    // شروع و پایان ماه
    const startOfMonth = new Date(targetYear, targetMonth, 1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    console.log('[Sales API] Monthly report request:', {
      year: targetYear,
      month: targetMonth + 1,
      startOfMonth: startOfMonth.toISOString(),
      endOfMonth: endOfMonth.toISOString(),
    });

    // دریافت سفارشات ماه
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .gte('created_at', startOfMonth.toISOString())
      .lte('created_at', endOfMonth.toISOString())
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('[Sales API] Supabase error (monthly):', ordersError);
      throw ordersError;
    }

    console.log('[Sales API] Orders fetched (monthly):', orders?.length || 0);

    // اطمینان از اینکه orders یک آرایه است
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
        console.error('[Sales API] Error fetching order_items (monthly):', itemsError);
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

    // محاسبه آمار
    const totalOrders = ordersList.length;
    const totalAmount = ordersList.reduce((sum, order) => {
      const amount = order?.total_amount || 0;
      return sum + (typeof amount === 'number' ? amount : 0);
    }, 0);
    const confirmedOrders = ordersList.filter(o => o?.payment_status === 'confirmed' || o?.payment_status === 'delivered').length;
    const confirmedAmount = ordersList
      .filter(o => o?.payment_status === 'confirmed' || o?.payment_status === 'delivered')
      .reduce((sum, order) => {
        const amount = order?.total_amount || 0;
        return sum + (typeof amount === 'number' ? amount : 0);
      }, 0);

    res.json({
      success: true,
      data: {
        period: 'monthly',
        year: targetYear,
        month: targetMonth + 1,
        start_date: startOfMonth.toISOString().split('T')[0],
        end_date: endOfMonth.toISOString().split('T')[0],
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
            payment_ref_id: order.payment_ref_id,
            created_at: order.created_at,
            items_count: items.length,
            items: items.map(item => ({
              name: item.name_snapshot,
              quantity: item.quantity,
              unit_price: item.unit_price,
              total_price: item.unit_price * item.quantity,
            })),
          };
        }),
        stats: {
          total_orders: totalOrders,
          total_amount: totalAmount,
          confirmed_orders: confirmedOrders,
          confirmed_amount: confirmedAmount,
          pending_orders: totalOrders - confirmedOrders,
        },
      },
    });
  } catch (error) {
    console.error('[Sales API] Monthly report error:', error);
    console.error('[Sales API] Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در دریافت گزارش فروش ماهانه',
      details: process.env.NODE_ENV !== 'production' ? {
        code: error.code,
        details: error.details,
        hint: error.hint,
      } : undefined,
    });
  }
});

/**
 * تغییر وضعیت سفارش توسط ادمین
 * PATCH /api/sales/orders/:orderId/status
 */
router.patch('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { payment_status } = req.body;

    console.log('[Sales API] درخواست تغییر وضعیت دریافت شد:', {
      orderId,
      payment_status,
      body: req.body,
      params: req.params,
    });

    if (!orderId) {
      console.error('[Sales API] ⚠️ orderId موجود نیست');
      return res.status(400).json({
        success: false,
        error: 'شماره سفارش الزامی است',
      });
    }

    // بررسی وضعیت‌های معتبر
    const validStatuses = ['confirmed', 'preparing', 'shipped', 'delivered'];
    if (!payment_status || !validStatuses.includes(payment_status)) {
      console.error('[Sales API] ⚠️ وضعیت نامعتبر:', payment_status);
      return res.status(400).json({
        success: false,
        error: `وضعیت نامعتبر است. وضعیت‌های معتبر: تایید شده، آماده سازی، ارسال، تحویل`,
        received: payment_status,
        valid: validStatuses,
      });
    }

    console.log('[Sales API] ✅ تغییر وضعیت سفارش:', {
      orderId,
      newStatus: payment_status,
    });

    // تبدیل orderId به عدد اگر رشته است
    const orderIdNum = parseInt(orderId, 10);
    if (isNaN(orderIdNum)) {
      console.error('[Sales API] ⚠️ orderId نامعتبر (باید عدد باشد):', orderId);
      return res.status(400).json({
        success: false,
        error: 'شماره سفارش نامعتبر است',
      });
    }

    // به‌روزرسانی وضعیت سفارش
    console.log('[Sales API] در حال به‌روزرسانی سفارش:', {
      orderId: orderIdNum,
      payment_status,
    });

    // به‌روزرسانی وضعیت سفارش (بدون updated_at برای جلوگیری از خطای schema cache)
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        payment_status: payment_status,
      })
      .eq('id', orderIdNum)
      .select()
      .single();

    if (updateError) {
      console.error('[Sales API] ❌ خطا در به‌روزرسانی وضعیت:', updateError);
      return res.status(500).json({
        success: false,
        error: 'خطا در به‌روزرسانی وضعیت سفارش',
        details: updateError.message,
        code: updateError.code,
      });
    }

    if (!updatedOrder) {
      console.error('[Sales API] ❌ سفارش یافت نشد:', orderIdNum);
      return res.status(404).json({
        success: false,
        error: 'سفارش یافت نشد',
      });
    }

    console.log('[Sales API] ✅ وضعیت سفارش با موفقیت تغییر یافت:', {
      orderId: updatedOrder.id,
      newStatus: updatedOrder.payment_status,
    });

    res.json({
      success: true,
      message: 'وضعیت سفارش با موفقیت تغییر یافت',
      data: {
        orderId: updatedOrder.id,
        payment_status: updatedOrder.payment_status,
      },
    });
  } catch (error) {
    console.error('[Sales API] خطا در تغییر وضعیت سفارش:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در تغییر وضعیت سفارش',
    });
  }
});

export { router as salesRouter };

