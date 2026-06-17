import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { supabase } from '../../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const ReviewSection = ({ productId }) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  // حذف state های ویرایش و حذف - کاربر دیگر نمی‌تواند نظرات را ویرایش یا حذف کند

  // بررسی احراز هویت کاربر
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // دریافت نظرات از API
  useEffect(() => {
    if (productId) {
      fetchComments();
    }
  }, [productId]);

  const fetchComments = async () => {
    if (!productId) {
      setLoading(false);
      setComments([]);
      return;
    }

    try {
      setLoading(true);
      // تبدیل productId به عدد برای اطمینان
      const numericProductId = typeof productId === 'string' ? parseInt(productId, 10) : productId;
      
      if (isNaN(numericProductId)) {
        console.error('Invalid productId:', productId);
        setComments([]);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/comments/product/${numericProductId}`);
      
      if (!response.ok) {
        // اگر خطای 404 بود، فقط خالی برگردان (جدول comments ممکن است وجود نداشته باشد)
        if (response.status === 404) {
          setComments([]);
          setLoading(false);
          return;
        }
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // بررسی content-type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON Response:', text);
        setComments([]);
        setLoading(false);
        return;
      }
      
      const result = await response.json();

      if (result.success) {
        setComments(result.data.comments || []);
      } else {
        console.error('خطا در دریافت نظرات:', result.error);
        setComments([]);
      }
    } catch (error) {
      console.error('خطا در دریافت نظرات:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmitReview = async () => {
    // بررسی احراز هویت
    if (!user) {
      if (confirm('برای ثبت نظر باید وارد حساب کاربری شوید. آیا می‌خواهید وارد شوید؟')) {
        navigate('/checkout');
      }
      return;
    }

    if (rating > 0 && comment.trim()) {
      setIsSubmitting(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('لطفاً ابتدا وارد حساب کاربری شوید');
        }

        // تبدیل productId به عدد
        const numericProductId = typeof productId === 'string' ? parseInt(productId, 10) : productId;
        
        if (isNaN(numericProductId)) {
          throw new Error('شناسه محصول نامعتبر است');
        }

        const response = await fetch(`${API_BASE_URL}/api/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            productId: numericProductId,
            rating: rating,
            comment: comment.trim(),
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`خطا در ارتباط با سرور: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Non-JSON Response:', text);
          throw new Error('پاسخ سرور در فرمت صحیح نیست');
        }

        const result = await response.json();

        if (result.success) {
          setComment('');
          setRating(0);
          // دریافت مجدد نظرات (اما چون pending است، نمایش داده نمی‌شود)
          await fetchComments();
          alert('نظر شما با موفقیت ثبت شد و در انتظار تایید ادمین است. بعد از تایید، نظر شما در صفحه محصول نمایش داده خواهد شد.');
        } else {
          throw new Error(result.error || 'خطا در ثبت نظر');
        }
      } catch (error) {
        console.error('خطا در ارسال نظر:', error);
        alert(error.message || 'خطا در ثبت نظر. لطفاً دوباره تلاش کنید.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('لطفاً امتیاز و نظر خود را وارد کنید');
    }
  };

  // توابع ویرایش و حذف حذف شدند - کاربر دیگر نمی‌تواند نظرات را ویرایش یا حذف کند

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const averageRating = comments && comments.length > 0 
    ? comments.reduce((sum, review) => sum + (review.rating || 0), 0) / comments.length 
    : 0;

  // اگر productId وجود نداشته باشد، چیزی نمایش نده
  if (!productId) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-blue-800 mb-8">نظرات و امتیازدهی</h3>
      
      {/* میانگین امتیاز */}
      <div className="flex items-center justify-between mb-8 p-6 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">{averageRating.toFixed(1)}</div>
            <div className="text-gray-600">از 5</div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-2xl text-yellow-400">
                {star <= averageRating ? <StarIcon /> : <StarBorderIcon />}
              </span>
            ))}
          </div>
        </div>
        <div className="text-gray-600 text-right">
          بر اساس {comments?.length || 0} نظر
        </div>
      </div>
      
      {/* فرم ارسال نظر */}
      {user ? (
        <div className="border-b border-gray-200 pb-8 mb-8">
          <h4 className="text-xl font-bold text-blue-800 mb-6">نظر خود را ثبت کنید</h4>
          
          {/* امتیازدهی */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-600 text-lg">امتیاز: ({rating}/5)</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl text-yellow-400 hover:text-yellow-500 transition-colors"
                >
                  {star <= (hoverRating || rating) ? <StarIcon /> : <StarBorderIcon />}
                </button>
              ))}
            </div>
          </div>

          {/* متن نظر */}
          <div className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="نظر خود را بنویسید..."
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
            />
          </div>

          <button
            onClick={handleSubmitReview}
            disabled={!rating || !comment.trim() || isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {isSubmitting ? 'در حال ارسال...' : 'ارسال نظر'}
          </button>
        </div>
      ) : (
        <div className="border-b border-gray-200 pb-8 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-4">برای ثبت نظر باید وارد حساب کاربری شوید</p>
            <button
              onClick={() => navigate('/checkout')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-semibold"
            >
              ورود / ثبت نام
            </button>
          </div>
        </div>
      )}

      {/* نمایش نظرات */}
      <div>
        <h4 className="text-xl font-bold text-blue-800 mb-6">نظرات کاربران</h4>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">در حال بارگذاری نظرات...</p>
          </div>
        ) : !comments || comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهید!</p>
        ) : (
          <div className="space-y-6">
            {comments.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-800 text-lg">{review.user_name}</span>
                  <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">
                      {star <= review.rating ? <StarIcon /> : <StarBorderIcon />}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
