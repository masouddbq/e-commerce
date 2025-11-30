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
    return next(err);
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


