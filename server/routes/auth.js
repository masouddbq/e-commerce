/* eslint-env node */
import express from 'express';
import supabaseAdmin from '../supabaseAdminClient.js';

const router = express.Router();

/**
 * بررسی وجود کاربر بر اساس شماره موبایل
 * POST /api/auth/check-user
 */
router.post('/check-user', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'شماره موبایل الزامی است',
      });
    }

    // نرمال‌سازی شماره موبایل
    const normalizedPhone = phone.replace(/[^0-9]/g, '');
    const pseudoEmail = `${normalizedPhone}@otp.lent-shop.ir`;

    // بررسی اینکه آیا کاربر با این email (شماره) وجود دارد
    // استفاده از listUsers برای جستجو (getUserByEmail در admin API موجود نیست)
    try {
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1,
      });

      if (error) {
        console.error('[Auth API] Error listing users:', error);
        // در صورت خطا، فرض می‌کنیم کاربر جدید است
          return res.json({
            success: true,
            exists: false,
            isNew: true,
          });
        }

      // جستجو در لیست کاربران
      const foundUser = users?.find(u => u.email === pseudoEmail);

      if (foundUser) {
        return res.json({
          success: true,
          exists: true,
          isNew: false,
          userId: foundUser.id,
        });
      }

      // اگر کاربر پیدا نشد
      return res.json({
        success: true,
        exists: false,
        isNew: true,
      });
    } catch (checkError) {
      // در صورت خطا، فرض می‌کنیم کاربر جدید است
      console.error('[Auth API] Error checking user:', checkError);
      return res.json({
        success: true,
        exists: false,
        isNew: true,
      });
    }
  } catch (error) {
    console.error('[Auth API] Check user error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در بررسی کاربر',
    });
  }
});

export { router as authRouter };

