/* eslint-env node */
import express from 'express';
import { createPaymentRequest, verifyPayment } from '../services/zarinpalService.js';
import supabaseAdmin from '../supabaseAdminClient.js';

const router = express.Router();

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
            payment_status: 'paid',
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

export { router as paymentRouter };

