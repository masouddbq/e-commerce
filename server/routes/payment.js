/* eslint-env node */
import express from 'express';
import { createPaymentRequest, verifyPayment } from '../services/zarinpalService.js';
import supabaseAdmin from '../supabaseAdminClient.js';
import { sendOrderConfirmationSms } from '../sms/farazSmsClient.js';

const router = express.Router();

// Set برای جلوگیری از ارسال SMS تکراری
const smsSentOrders = new Set();

/**
 * ایجاد درخواست پرداخت
 * POST /api/payment/request
 */
router.post('/request', async (req, res) => {
  try {
    const { amount, description, callbackUrl, orderId, metadata } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'مبلغ پرداخت نامعتبر است',
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'شماره سفارش الزامی است',
      });
    }

    const result = await createPaymentRequest({
      amount,
      description: description || `پرداخت سفارش #${orderId}`,
      callbackUrl: callbackUrl || `${req.protocol}://${req.get('host')}/payment/callback`,
      metadata: {
        mobile: metadata?.mobile || metadata?.phone || '',
        email: metadata?.email || '',
      },
    });

    if (result.success) {
      // ذخیره authority در دیتابیس
      try {
        await supabaseAdmin
          .from('orders')
          .update({
            payment_authority: result.authority,
            payment_status: 'processing',
          })
          .eq('id', orderId);
      } catch (dbError) {
        console.error('خطا در ذخیره authority:', dbError);
        // ادامه می‌دهیم حتی اگر ذخیره نشد
      }
    }

    res.json(result);
  } catch (error) {
    console.error('خطا در ایجاد درخواست پرداخت:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در ایجاد درخواست پرداخت',
    });
  }
});

/**
 * تایید پرداخت
 * POST /api/payment/verify
 */
router.post('/verify', async (req, res) => {
  try {
    const { authority, amount, orderId } = req.body;

    if (!authority) {
      return res.status(400).json({
        success: false,
        error: 'Authority الزامی است',
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'مبلغ پرداخت نامعتبر است',
      });
    }

    const result = await verifyPayment({ authority, amount });

    if (result.success && orderId) {
      // به‌روزرسانی وضعیت سفارش در دیتابیس
      try {
        await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'confirmed',
            payment_ref_id: result.refId,
            payment_verified_at: new Date().toISOString(),
          })
          .eq('id', orderId);
      } catch (dbError) {
        console.error('خطا در به‌روزرسانی سفارش:', dbError);
        // ادامه می‌دهیم حتی اگر به‌روزرسانی نشد
      }
    }

    res.json(result);
  } catch (error) {
    console.error('خطا در تایید پرداخت:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در تایید پرداخت',
    });
  }
});

/**
 * Callback از درگاه پرداخت
 * GET /payment/callback?Authority=...&Status=...
 * این route برای redirect از درگاه پرداخت استفاده می‌شود
 */
router.get('/callback', async (req, res) => {
  try {
    const { Authority, Status } = req.query;
    
    // دریافت اطلاعات سفارش بر اساس authority
    if (Authority && Status) {
      try {
        const { data: order, error: orderError } = await supabaseAdmin
          .from('orders')
          .select('id, total_amount, payment_status')
          .eq('payment_authority', Authority)
          .limit(1)
          .maybeSingle();

        if (!orderError && order && order.total_amount) {
          // اگر Status=OK است، پرداخت را تایید می‌کنیم
          if (Status === 'OK') {
            try {
              // تبدیل از تومان به ریال (ضرب در 10)
              const amountInRials = Math.round((order.total_amount || 0) * 10);
              
              const verifyResult = await verifyPayment({ 
                authority: Authority, 
                amount: amountInRials 
              });

              if (verifyResult.success) {
                // به‌روزرسانی وضعیت سفارش
                await supabaseAdmin
                  .from('orders')
                  .update({
                    payment_status: 'confirmed',
                    payment_ref_id: verifyResult.refId,
                    payment_verified_at: new Date().toISOString(),
                  })
                  .eq('id', order.id);
              }
            } catch (verifyError) {
              console.error('[Payment Callback] خطا در تایید پرداخت:', verifyError);
              // ادامه می‌دهیم حتی اگر تایید نشد
            }
          }
        }
      } catch (dbError) {
        console.error('[Payment Callback] خطا در دریافت سفارش:', dbError);
      }
    }

    // Redirect به frontend با query parameters
    const frontendUrl = process.env.CLIENT_ORIGIN || 'https://lent-shop.ir';
    const queryString = new URLSearchParams(req.query).toString();
    res.redirect(`${frontendUrl}/payment/callback?${queryString}`);
  } catch (error) {
    console.error('[Payment Callback] خطا:', error);
    // در صورت خطا، باز هم به frontend redirect می‌کنیم
    const frontendUrl = process.env.CLIENT_ORIGIN || 'https://lent-shop.ir';
    const queryString = new URLSearchParams(req.query).toString();
    res.redirect(`${frontendUrl}/payment/callback?${queryString}`);
  }
});

/**
 * دریافت اطلاعات سفارش بر اساس Authority
 * GET /api/payment/order-by-authority?authority=...
 */
router.get('/order-by-authority', async (req, res) => {
  try {
    const { authority } = req.query;

    if (!authority) {
      return res.status(400).json({
        success: false,
        error: 'Authority الزامی است',
      });
    }

    // دریافت اطلاعات سفارش بر اساس authority
    // ⭐ استفاده از query ساده‌تر برای جلوگیری از خطای schema
    let order = null;
    let orderError = null;
    
    // مرحله 1: پیدا کردن order بر اساس authority (فقط id)
    const { data: orderFound, error: findError } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('payment_authority', authority)
      .limit(1)
      .maybeSingle();
    
    if (findError) {
      // اگر خطای schema است
      if (findError.code === '42703' || findError.message?.includes('does not exist')) {
        console.error('[Payment API] ⚠️ خطای Schema - ستون payment_authority وجود ندارد:', findError);
        orderError = findError;
      } else {
        orderError = findError;
      }
    } else if (orderFound && orderFound.id) {
      // مرحله 2: اگر order پیدا شد، اطلاعات کامل را بگیر
      const { data: orderFull, error: fullError } = await supabaseAdmin
        .from('orders')
        .select('id, total_amount, payment_status, payment_ref_id, order_number')
        .eq('id', orderFound.id)
        .single();
      
      if (fullError) {
        orderError = fullError;
      } else if (orderFull) {
        order = {
          ...orderFull,
          payment_authority: authority, // اضافه کردن authority به صورت دستی
        };
      }
    }

    if (orderError || !order) {
      return res.status(404).json({
        success: false,
        error: 'سفارش یافت نشد',
      });
    }

    // دریافت اقلام سفارش
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)
      .order('id', { ascending: true });

    if (itemsError) {
      console.error('خطا در دریافت اقلام سفارش:', itemsError);
    }

    // محاسبه تعداد کل اقلام
    const totalItems = (orderItems || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

    // ⭐ اضافه کردن Cache-Control headers برای جلوگیری از cache
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');

    res.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.order_number,
        totalAmount: order.total_amount,
        paymentStatus: order.payment_status,
        paymentRefId: order.payment_ref_id || null, // اطمینان از اینکه null برگردانده می‌شود
        items: (orderItems || []).map(item => ({
          id: item.id,
          product_id: item.product_id,
          name: item.name_snapshot,
          unit_price: item.unit_price,
          quantity: item.quantity,
          total_price: item.unit_price * item.quantity,
        })),
        totalItems: totalItems,
      },
    });
  } catch (error) {
    console.error('خطا در دریافت اطلاعات سفارش:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در دریافت اطلاعات سفارش',
    });
  }
});

/**
 * دریافت اطلاعات کامل سفارش
 * GET /api/payment/order/:orderId
 */
router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'شماره سفارش الزامی است',
      });
    }

    // دریافت اطلاعات سفارش
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({
        success: false,
        error: 'سفارش یافت نشد',
      });
    }

    // دریافت اقلام سفارش
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
      .order('id', { ascending: true });

    if (itemsError) {
      console.error('خطا در دریافت اقلام سفارش:', itemsError);
      return res.status(500).json({
        success: false,
        error: 'خطا در دریافت اقلام سفارش',
      });
    }

    // محاسبه تعداد کل اقلام
    const totalItems = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    // ⭐ ارسال پیامک تایید خرید (اگر پرداخت confirm شده و SMS قبلاً ارسال نشده)
    if (order.payment_status === 'confirmed' && order.payment_ref_id && !smsSentOrders.has(orderId)) {
      const ENABLE_ORDER_SMS = process.env.ENABLE_ORDER_CONFIRMATION_SMS !== 'false';
      
      if (ENABLE_ORDER_SMS && order.phone) {
        // علامت‌گذاری که SMS در حال ارسال است
        smsSentOrders.add(orderId);
        
        // ارسال SMS در پس‌زمینه (بدون await تا response سریع‌تر برگردد)
        (async () => {
          try {
            const orderData = {
              orderNumber: order.order_number || order.id,
              trackingCode: order.payment_ref_id || 'نامشخص',
              amount: order.total_amount || 0
            };
            
            console.log('[Payment API] 📨 ارسال پیامک تایید خرید برای سفارش:', orderId);
            const smsResult = await sendOrderConfirmationSms(order.phone.trim(), orderData);
            
            if (smsResult.success) {
              console.log('[Payment API] ✅ پیامک تایید خرید با موفقیت ارسال شد برای سفارش:', orderId);
            } else {
              console.error('[Payment API] ⚠️ خطا در ارسال پیامک تایید خرید:', smsResult.error);
              // حذف از Set تا دوباره تلاش شود
              smsSentOrders.delete(orderId);
            }
          } catch (smsError) {
            console.error('[Payment API] ⚠️ خطا در ارسال پیامک تایید خرید (Exception):', smsError);
            // حذف از Set تا دوباره تلاش شود
            smsSentOrders.delete(orderId);
          }
        })();
      }
    }

    // ⭐ اضافه کردن Cache-Control headers برای جلوگیری از cache
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');

    res.json({
      success: true,
      data: {
        order: {
          id: order.id,
          order_number: order.order_number,
          full_name: order.full_name,
          total_amount: order.total_amount,
          payment_status: order.payment_status,
          payment_ref_id: order.payment_ref_id || null, // اطمینان از اینکه null برگردانده می‌شود نه undefined
          created_at: order.created_at,
        },
        items: orderItems.map(item => ({
          id: item.id,
          product_id: item.product_id,
          name: item.name_snapshot,
          unit_price: item.unit_price,
          quantity: item.quantity,
          total_price: item.unit_price * item.quantity,
        })),
        total_items: totalItems,
      },
    });
  } catch (error) {
    console.error('خطا در دریافت اطلاعات سفارش:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در دریافت اطلاعات سفارش',
    });
  }
});

/**
 * ارسال پیامک تایید خرید
 * POST /api/payment/send-order-sms/:orderId
 */
router.post('/send-order-sms/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'شماره سفارش الزامی است',
      });
    }

    // دریافت اطلاعات سفارش
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, phone, total_amount, payment_ref_id, order_number, payment_status')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({
        success: false,
        error: 'سفارش یافت نشد',
      });
    }

    // بررسی شرایط
    if (order.payment_status !== 'confirmed') {
      return res.json({
        success: false,
        error: 'پرداخت تایید نشده است',
      });
    }

    if (!order.phone) {
      return res.json({
        success: false,
        error: 'شماره تلفن موجود نیست',
      });
    }

    // ارسال SMS
    const ENABLE_ORDER_SMS = process.env.ENABLE_ORDER_CONFIRMATION_SMS !== 'false';
    
    if (!ENABLE_ORDER_SMS) {
      return res.json({
        success: false,
        error: 'ارسال پیامک تایید خرید غیرفعال است',
      });
    }

    const orderData = {
      orderNumber: order.order_number || order.id,
      trackingCode: order.payment_ref_id || 'نامشخص',
      amount: order.total_amount || 0
    };

    console.log('[Payment API] 📨 ارسال پیامک تایید خرید برای سفارش:', orderId);
    const smsResult = await sendOrderConfirmationSms(order.phone.trim(), orderData);

    if (smsResult.success) {
      console.log('[Payment API] ✅ پیامک تایید خرید با موفقیت ارسال شد');
      return res.json({
        success: true,
        message: 'پیامک با موفقیت ارسال شد',
      });
    } else {
      console.error('[Payment API] ⚠️ خطا در ارسال پیامک:', smsResult.error);
      return res.status(500).json({
        success: false,
        error: smsResult.error || 'خطا در ارسال پیامک',
      });
    }
  } catch (error) {
    console.error('[Payment API] خطا در ارسال پیامک:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در ارسال پیامک',
    });
  }
});

export { router as paymentRouter };

