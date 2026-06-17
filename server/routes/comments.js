/* eslint-env node */
import express from 'express';
import supabaseAdmin from '../supabaseAdminClient.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

/**
 * دریافت نظرات یک محصول
 * GET /api/comments/product/:productId
 */
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    // تبدیل productId به عدد
    const numericProductId = parseInt(productId, 10);
    
    if (isNaN(numericProductId)) {
      return res.status(400).json({
        success: false,
        error: 'شناسه محصول نامعتبر است',
      });
    }

    // بررسی وجود جدول comments (اگر وجود نداشت، خالی برگردان)
    // فقط کامنت‌های تایید شده را نمایش بده
    const { data: comments, error } = await supabaseAdmin
      .from('comments')
      .select('*')
      .eq('product_id', numericProductId)
      .eq('status', 'approved') // فقط کامنت‌های تایید شده
      .order('created_at', { ascending: false });

    // اگر جدول وجود نداشت (خطای PGRST116)، خالی برگردان
    if (error) {
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        console.log('[Comments API] Comments table does not exist yet, returning empty array');
        return res.json({
          success: true,
          data: {
            comments: [],
            count: 0,
          },
        });
      }
      console.error('[Comments API] Error fetching comments:', error);
      throw error;
    }

    res.json({
      success: true,
      data: {
        comments: comments || [],
        count: comments?.length || 0,
      },
    });
  } catch (error) {
    console.error('[Comments API] Get comments error:', error);
    // در صورت خطا، خالی برگردان تا صفحه crash نکند
    res.json({
      success: true,
      data: {
        comments: [],
        count: 0,
      },
    });
  }
});

/**
 * ثبت نظر جدید برای یک محصول
 * POST /api/comments
 * Body: { productId, rating, comment }
 */
router.post('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, rating, comment } = req.body;

    // اعتبارسنجی ورودی‌ها
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'شناسه محصول الزامی است',
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'امتیاز باید بین 1 تا 5 باشد',
      });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'متن نظر الزامی است',
      });
    }

    // بررسی وجود محصول
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return res.status(404).json({
        success: false,
        error: 'محصول یافت نشد',
      });
    }

    // دریافت نام کاربر از پروفایل
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .single();

    const userName = profile?.name || 'کاربر ناشناس';

    // بررسی اینکه آیا کاربر قبلاً برای این محصول نظر داده است
    const { data: existingComment } = await supabaseAdmin
      .from('comments')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', userId)
      .single();

    if (existingComment) {
      return res.status(400).json({
        success: false,
        error: 'شما قبلاً برای این محصول نظر ثبت کرده‌اید',
      });
    }

    // ثبت نظر جدید با وضعیت pending
    const { data: newComment, error: insertError } = await supabaseAdmin
      .from('comments')
      .insert({
        product_id: productId,
        user_id: userId,
        user_name: userName,
        rating: parseInt(rating),
        comment: comment.trim(),
        status: 'pending', // وضعیت پیش‌فرض: در انتظار تایید
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Comments API] Error inserting comment:', insertError);
      throw insertError;
    }

    res.json({
      success: true,
      data: {
        comment: newComment,
      },
      message: 'نظر شما با موفقیت ثبت شد',
    });
  } catch (error) {
    console.error('[Comments API] Create comment error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در ثبت نظر',
    });
  }
});

/**
 * دریافت تمام نظرات (فقط برای ادمین)
 * GET /api/comments/admin/all
 */
router.get('/admin/all', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;

    // بررسی اینکه آیا کاربر ادمین است
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (!profile?.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'شما اجازه دسترسی به این بخش را ندارید',
      });
    }

    // دریافت تمام نظرات با اطلاعات محصول
    // اگر جدول comments وجود نداشت، خالی برگردان
    const { data: comments, error } = await supabaseAdmin
      .from('comments')
      .select(`
        *,
        products:product_id (
          id,
          name,
          image
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      // اگر جدول وجود نداشت (خطای PGRST116)، خالی برگردان
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        console.log('[Comments API] Comments table does not exist yet, returning empty array');
        return res.json({
          success: true,
          data: {
            comments: [],
            count: 0,
          },
        });
      }
      console.error('[Comments API] Error fetching all comments:', error);
      throw error;
    }

    res.json({
      success: true,
      data: {
        comments: comments || [],
        count: comments?.length || 0,
      },
    });
  } catch (error) {
    console.error('[Comments API] Get all comments error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در دریافت نظرات',
    });
  }
});

/**
 * تایید یا رد نظر (فقط برای ادمین)
 * PUT /api/comments/admin/:commentId/status
 * Body: { status: 'approved' | 'rejected' }
 */
router.put('/admin/:commentId/status', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;
    const { commentId } = req.params;
    const { status } = req.body;

    // بررسی اینکه آیا کاربر ادمین است
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (!profile?.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'شما اجازه دسترسی به این بخش را ندارید',
      });
    }

    // اعتبارسنجی status
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'وضعیت نامعتبر است. باید approved یا rejected باشد',
      });
    }

    // بررسی وجود نظر
    const { data: existingComment, error: fetchError } = await supabaseAdmin
      .from('comments')
      .select('*')
      .eq('id', commentId)
      .single();

    if (fetchError || !existingComment) {
      return res.status(404).json({
        success: false,
        error: 'نظر یافت نشد',
      });
    }

    // بروزرسانی وضعیت نظر
    const { data: updatedComment, error: updateError } = await supabaseAdmin
      .from('comments')
      .update({ status })
      .eq('id', commentId)
      .select()
      .single();

    if (updateError) {
      console.error('[Comments API] Error updating comment status:', updateError);
      throw updateError;
    }

    res.json({
      success: true,
      data: {
        comment: updatedComment,
      },
      message: `نظر با موفقیت ${status === 'approved' ? 'تایید' : 'رد'} شد`,
    });
  } catch (error) {
    console.error('[Comments API] Update comment status error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در بروزرسانی وضعیت نظر',
    });
  }
});

/**
 * حذف نظر (فقط برای ادمین)
 * DELETE /api/comments/admin/:commentId
 */
router.delete('/admin/:commentId', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;
    const { commentId } = req.params;

    // بررسی اینکه آیا کاربر ادمین است
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (!profile?.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'شما اجازه دسترسی به این بخش را ندارید',
      });
    }

    // بررسی وجود نظر
    const { data: existingComment, error: fetchError } = await supabaseAdmin
      .from('comments')
      .select('id')
      .eq('id', commentId)
      .single();

    if (fetchError || !existingComment) {
      return res.status(404).json({
        success: false,
        error: 'نظر یافت نشد',
      });
    }

    // حذف نظر
    const { error: deleteError } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (deleteError) {
      console.error('[Comments API] Error deleting comment:', deleteError);
      throw deleteError;
    }

    res.json({
      success: true,
      message: 'نظر با موفقیت حذف شد',
    });
  } catch (error) {
    console.error('[Comments API] Delete comment error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'خطا در حذف نظر',
    });
  }
});

export { router as commentsRouter };
