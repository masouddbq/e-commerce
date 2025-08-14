import React from 'react';
import { Link } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import EngineeringIcon from '@mui/icons-material/Engineering';
import HandshakeIcon from '@mui/icons-material/Handshake';

const AboutSection = () => {
  return (
    <div className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* متن درباره ما */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">درباره لنت شاپ</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                لنت شاپ با بیش از 10 سال تجربه در زمینه فروش لنت ترمز خودرو، یکی از معتبرترین و قابل اعتمادترین فروشگاه‌های تخصصی در این حوزه است.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                ما متعهد به ارائه بهترین محصولات با کیفیت بالا و قیمت منصفانه به مشتریان خود هستیم. تیم متخصص ما همیشه آماده ارائه مشاوره و راهنمایی در انتخاب بهترین لنت برای خودروی شما است.
              </p>
            </div>
            
            {/* ویژگی‌های کلیدی */}
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <BusinessIcon className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">فروشگاه تخصصی</h3>
                  <p className="text-gray-600 text-sm">تخصص ما فقط در لنت ترمز خودرو است</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <EngineeringIcon className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">کیفیت تضمینی</h3>
                  <p className="text-gray-600 text-sm">تمام محصولات دارای گارانتی اصالت</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <HandshakeIcon className="text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">خدمات پس از فروش</h3>
                  <p className="text-gray-600 text-sm">پشتیبانی کامل و خدمات تعمیر</p>
                </div>
              </div>
            </div>
            
            {/* دکمه‌ها */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/about" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center">
                درباره ما بیشتر بدانید
              </Link>
              <Link to="/contact" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-center">
                تماس با ما
              </Link>
            </div>
          </div>
          
          {/* تصویر یا آمار */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-6">آمار و دستاوردها</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold mb-2">10+</div>
                <div className="text-blue-100 text-sm">سال تجربه</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">50K+</div>
                <div className="text-blue-100 text-sm">مشتری راضی</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">100+</div>
                <div className="text-blue-100 text-sm">نوع محصول</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-blue-100 text-sm">پشتیبانی</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white bg-opacity-20 rounded-lg">
              <p className="text-sm">
                "ما افتخار می‌کنیم که بخشی از خانواده بزرگ مشتریان لنت شاپ هستیم"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
