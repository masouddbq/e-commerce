import React, { useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && agreed) {
      setIsSubscribed(true);
      setEmail('');
      setAgreed(false);
      // در اینجا می‌تونید API call برای ثبت ایمیل انجام بدید
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="w-full py-16 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {!isSubscribed ? (
          <>
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                <EmailIcon className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">عضویت در خبرنامه ما</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                از آخرین تخفیف‌ها، محصولات جدید و مقالات مفید باخبر شوید
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ایمیل خود را وارد کنید"
                    className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  عضویت
                  <SendIcon className="text-sm" />
                </button>
              </div>
              
              <div className="flex items-center justify-center mb-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-blue-100 text-sm">
                    با <a href="#" className="underline hover:text-white">قوانین و مقررات</a> و <a href="#" className="underline hover:text-white">حریم خصوصی</a> موافقم
                  </span>
                </label>
              </div>
              
              <p className="text-blue-200 text-sm">
                می‌توانید در هر زمان عضویت خود را لغو کنید. برای این کار کافیست روی لینک لغو عضویت در ایمیل‌های ما کلیک کنید.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
              <CheckCircleIcon className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">عضویت موفقیت‌آمیز بود!</h2>
            <p className="text-blue-100">
              از عضویت شما در خبرنامه متشکریم. به زودی آخرین اخبار را دریافت خواهید کرد.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterSection;
