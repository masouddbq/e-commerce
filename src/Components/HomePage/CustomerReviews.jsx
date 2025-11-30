import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { useAuth } from '../Common/AuthContext';

const CustomerReviews = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleReviewClick = () => {
    if (!isAuthenticated) {
      navigate('/register');
    } else {
      // Here you can add logic for authenticated users to submit reviews
      // For now, we'll just show an alert
      alert('برای ثبت نظر، لطفاً با پشتیبانی تماس بگیرید.');
    }
  };

  const reviews = [
    {
      id: 1,
      name: "احمد محمدی",
      role: "راننده تاکسی",
      rating: 5,
      comment: "کیفیت لنت‌های لنت شاپ عالیه! بعد از 6 ماه استفاده هنوز مثل روز اول کار می‌کنه. قیمت‌هاشم منصفانه‌ست.",
      avatar: "👨‍💼"
    },
    {
      id: 2,
      name: "فاطمه احمدی",
      role: "صاحب خودرو شخصی",
      rating: 5,
      comment: "خدمات مشتری‌داری فوق‌العاده و ارسال سریع. لنت‌های خریداری شده کیفیت بالایی دارن و کاملاً راضی‌ام.",
      avatar: "👩‍💼"
    },
    {
      id: 3,
      name: "علی رضایی",
      role: "مکانیک خودرو",
      rating: 4,
      comment: "به عنوان یک مکانیک، کیفیت لنت‌های این فروشگاه رو تأیید می‌کنم. مشتری‌هام همیشه راضی‌ن.",
      avatar: "👨‍🔧"
    },
    {
      id: 4,
      name: "مریم کریمی",
      role: "راننده خانواده",
      rating: 5,
      comment: "برای خودروی خانوادگیم لنت خریدم و واقعاً کیفیتش عالیه. امنیت خانواده برام مهمه و این لنت‌ها اطمینان‌بخش‌ن.",
      avatar: "👩‍👧‍👦"
    }
  ];

  return (
    <div className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">نظرات مشتریان ما</h2>
          <p className="text-gray-600">ببینید مشتریان ما درباره کیفیت محصولات ما چه می‌گویند</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="text-center mb-4">
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`} 
                    />
                  ))}
                </div>
              </div>
              
              <blockquote className="text-gray-700 text-sm leading-relaxed mb-4 text-center">
                "{review.comment}"
              </blockquote>
              
              <div className="text-center">
                <h4 className="font-semibold text-gray-800 text-sm">{review.name}</h4>
                <p className="text-gray-500 text-xs">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <button 
            onClick={handleReviewClick}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            ثبت نظر جدید
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;
