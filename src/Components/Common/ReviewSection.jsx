import React, { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const ReviewSection = ({ productId, reviews = [], onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmitReview = async () => {
    if (rating > 0 && comment.trim()) {
      setIsSubmitting(true);
      try {
        await onSubmitReview({ productId, rating, comment });
        setComment('');
        setRating(0);
      } catch (error) {
        console.error('خطا در ارسال نظر:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

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
          بر اساس {reviews.length} نظر
        </div>
      </div>
      
      {/* فرم ارسال نظر */}
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
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {isSubmitting ? 'در حال ارسال...' : 'ارسال نظر'}
        </button>
      </div>

      {/* نمایش نظرات */}
      <div>
        <h4 className="text-xl font-bold text-blue-800 mb-6">نظرات کاربران</h4>
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهید!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-800 text-lg">{review.user}</span>
                  <span className="text-sm text-gray-500">{review.date}</span>
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
