/* eslint-env node */
import supabaseAdmin from '../supabaseAdminClient.js';

/**
 * Middleware برای احراز هویت کاربر با Supabase
 * دریافت access token از header و verify کردن آن
 */
export const authenticateUser = async (req, res, next) => {
  try {
    // دریافت access token از header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'لطفاً ابتدا وارد شوید',
      });
    }

    const accessToken = authHeader.replace('Bearer ', '');

    // Verify token با Supabase Admin
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'احراز هویت نامعتبر است. لطفاً دوباره وارد شوید',
      });
    }

    // اضافه کردن user به request
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    console.error('[Auth Middleware] Error:', error);
    return res.status(401).json({
      success: false,
      error: 'خطا در احراز هویت',
    });
  }
};








