import React from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "چگونه لنت مناسب خودروی خود را انتخاب کنیم؟",
      excerpt: "انتخاب لنت مناسب برای خودرو یکی از مهم‌ترین تصمیمات در نگهداری خودرو است. در این مقاله راهنمای کامل انتخاب لنت را بررسی می‌کنیم...",
      image: "/hero1.jpg",
      author: "تیم فنی لنت شاپ",
      date: "15 مهر 1403",
      category: "نگهداری خودرو",
      readTime: "5 دقیقه"
    },
    {
      id: 2,
      title: "نشانه‌های نیاز به تعویض لنت ترمز",
      excerpt: "شناخت علائم فرسودگی لنت ترمز می‌تواند از بروز حوادث ناگوار جلوگیری کند. در این مطلب مهم‌ترین نشانه‌ها را معرفی می‌کنیم...",
      image: "/hero2.jpg",
      author: "مهندس احمدی",
      date: "12 مهر 1403",
      category: "تعمیر و نگهداری",
      readTime: "4 دقیقه"
    },
    {
      id: 3,
      title: "مقایسه انواع مختلف لنت ترمز",
      excerpt: "لنت‌های ترمز در انواع مختلفی تولید می‌شوند. هر کدام مزایا و معایب خاص خود را دارند. در این مقاله به مقایسه آنها می‌پردازیم...",
      image: "/hero3.jpg",
      author: "کارشناس فنی",
      date: "10 مهر 1403",
      category: "مقایسه محصولات",
      readTime: "6 دقیقه"
    }
  ];

  return (
    <div className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">آخرین مقالات ما</h2>
          <p className="text-gray-600">مفیدترین اطلاعات درباره نگهداری خودرو و لنت ترمز</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <div className="flex items-center mr-4">
                    <PersonIcon className="text-sm mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarTodayIcon className="text-sm mr-1" />
                    <span>{post.date}</span>
                  </div>
                </div>
                
                <h3 className="font-bold text-gray-800 text-lg mb-3 leading-tight">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {post.readTime} مطالعه
                  </span>
                  
                  <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors text-sm font-semibold">
                    ادامه مطلب
                    <ArrowForwardIcon className="text-sm mr-1" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            مشاهده همه مقالات
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
