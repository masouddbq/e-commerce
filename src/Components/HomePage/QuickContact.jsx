import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';

const QuickContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // در اینجا می‌تونید API call برای ارسال فرم انجام بدید
    console.log('Form submitted:', formData);
    alert('پیام شما با موفقیت ارسال شد!');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <PhoneIcon className="text-2xl" />,
      title: "تلفن تماس",
      value: "0935-866-7294",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <WhatsAppIcon className="text-2xl" />,
      title: "واتساپ",
      value: "0935-866-7294",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <TelegramIcon className="text-2xl" />,
      title: "تلگرام",
      value: "@lentshop",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <EmailIcon className="text-2xl" />,
      title: "ایمیل",
      value: "info@lentshop.ir",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <LocationOnIcon className="text-2xl" />,
      title: "آدرس",
      value: "مشهد - بلوار کوشش - کوشش 26",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <AccessTimeIcon className="text-2xl" />,
      title: "ساعات کاری",
      value: "شنبه تا چهارشنبه: 8 صبح تا 8 شب",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">تماس با ما</h2>
          <p className="text-gray-600">ما همیشه آماده پاسخگویی به سوالات شما هستیم</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* فرم تماس */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">ارسال پیام</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نام و نام خانوادگی</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">شماره تماس</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">پیام</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="پیام خود را اینجا بنویسید..."
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold"
              >
                ارسال پیام
              </button>
            </form>
          </div>
          
          {/* اطلاعات تماس */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">اطلاعات تماس</h3>
            
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-full flex items-center justify-center text-white mr-4`}>
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{info.title}</h4>
                    <p className="text-gray-600 text-sm">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* نقشه یا تصویر */}
            <div className="mt-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center">
              <h4 className="text-lg font-semibold mb-2">ساعات کاری</h4>
              <p className="text-blue-100 mb-4">
                شنبه تا چهارشنبه: 8 صبح تا 8 شب<br />
                پنجشنبه: 8 صبح تا 5 عصر<br />
                جمعه: تعطیل
              </p>
              <Link to="/contact" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
                دریافت آدرس دقیق
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickContact;
