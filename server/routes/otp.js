import { Router } from 'express';
import { sendOtpToPhone, verifyOtpForPhone } from '../services/otpService.js';

export const otpRouter = Router();

otpRouter.post('/send', async (req, res, next) => {
  try {
    const { phone } = req.body ?? {};

    if (!phone) {
      return res.status(400).json({ error: 'شماره موبایل ارسال نشده است' });
    }

    const result = await sendOtpToPhone(phone);
    return res.json({ success: true, ...result });
  } catch (err) {
    console.error('[OTP Route] Error in /send:', err);
    console.error('[OTP Route] Error message:', err.message);
    console.error('[OTP Route] Error stack:', err.stack);
    
    // اگر خطا از Supabase باشه، status code رو حفظ می‌کنیم
    const statusCode = err.status || err.statusCode || (err.message?.includes('Supabase') ? 422 : 500);
    
    return res.status(statusCode).json({
      success: false,
      error: err.message || 'خطا در ارسال کد تایید',
      details: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    });
  }
});

otpRouter.post('/verify', async (req, res, next) => {
  try {
    const { phone, code } = req.body ?? {};

    if (!phone || !code) {
      return res.status(400).json({ error: 'شماره موبایل و کد الزامی است' });
    }

    const result = await verifyOtpForPhone(phone, code);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});


