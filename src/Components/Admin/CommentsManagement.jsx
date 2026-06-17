import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const CommentsManagement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [filterStatus]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('لطفاً ابتدا وارد حساب کاربری شوید');
      }

      const response = await fetch(`${API_BASE_URL}/api/comments/admin/all`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      // بررسی status code
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`خطا در ارتباط با سرور: ${response.status}`);
      }

      // بررسی content-type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON Response:', text);
        throw new Error('پاسخ سرور در فرمت صحیح نیست');
      }

      const result = await response.json();

      if (result.success) {
        let allComments = result.data.comments || [];
        
        // فیلتر بر اساس وضعیت
        let filteredComments = allComments;
        if (filterStatus !== 'all') {
          filteredComments = allComments.filter(comment => comment.status === filterStatus);
        }

        setComments(filteredComments);
      } else {
        throw new Error(result.error || 'خطا در دریافت نظرات');
      }
    } catch (error) {
      console.error('خطا در دریافت نظرات:', error);
      alert(error.message || 'خطا در دریافت نظرات');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (commentId, newStatus) => {
    try {
      setProcessingId(commentId);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('لطفاً ابتدا وارد حساب کاربری شوید');
      }

      const response = await fetch(`${API_BASE_URL}/api/comments/admin/${commentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchComments();
        alert(`نظر با موفقیت ${newStatus === 'approved' ? 'تایید' : 'رد'} شد`);
      } else {
        throw new Error(result.error || 'خطا در بروزرسانی وضعیت نظر');
      }
    } catch (error) {
      console.error('خطا در بروزرسانی وضعیت نظر:', error);
      alert(error.message || 'خطا در بروزرسانی وضعیت نظر');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این نظر را حذف کنید؟')) {
      return;
    }

    try {
      setProcessingId(commentId);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('لطفاً ابتدا وارد حساب کاربری شوید');
      }

      const response = await fetch(`${API_BASE_URL}/api/comments/admin/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
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
        await fetchComments();
        alert('نظر با موفقیت حذف شد');
      } else {
        throw new Error(result.error || 'خطا در حذف نظر');
      }
    } catch (error) {
      console.error('خطا در حذف نظر:', error);
      alert(error.message || 'خطا در حذف نظر');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">تایید شده</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">رد شده</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">در انتظار تایید</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getProductName = (comment) => {
    if (comment.products && typeof comment.products === 'object' && comment.products.name) {
      return comment.products.name;
    }
    return 'محصول حذف شده';
  };

  const getProductImage = (comment) => {
    if (comment.products && typeof comment.products === 'object' && comment.products.image) {
      return comment.products.image;
    }
    return null;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">مدیریت نظرات</h2>

      {/* فیلتر وضعیت */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterStatus === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          همه ({comments.length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterStatus === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          در انتظار تایید
        </button>
        <button
          onClick={() => setFilterStatus('approved')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterStatus === 'approved'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          تایید شده
        </button>
        <button
          onClick={() => setFilterStatus('rejected')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterStatus === 'rejected'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          رد شده
        </button>
      </div>

      {/* لیست نظرات */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">در حال بارگذاری نظرات...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">نظری یافت نشد</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-6">
                {/* تصویر محصول */}
                <div className="flex-shrink-0">
                  {getProductImage(comment) ? (
                    <img
                      src={getProductImage(comment)}
                      alt={getProductName(comment)}
                      className="w-24 h-24 object-contain border rounded-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 border rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">بدون تصویر</span>
                    </div>
                  )}
                </div>

                {/* اطلاعات نظر */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {getProductName(comment)}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        توسط: <span className="font-medium">{comment.user_name}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(comment.status)}
                      <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                    </div>
                  </div>

                  {/* امتیاز */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-600">امتیاز:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-400">
                          {star <= comment.rating ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({comment.rating}/5)</span>
                  </div>

                  {/* متن نظر */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{comment.comment}</p>
                  </div>

                  {/* دکمه‌های عملیات */}
                  <div className="flex gap-2">
                    {comment.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(comment.id, 'approved')}
                        disabled={processingId === comment.id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <CheckCircleIcon fontSize="small" />
                        تایید
                      </button>
                    )}
                    {comment.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(comment.id, 'rejected')}
                        disabled={processingId === comment.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <CancelIcon fontSize="small" />
                        رد
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={processingId === comment.id}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <DeleteIcon fontSize="small" />
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsManagement;
