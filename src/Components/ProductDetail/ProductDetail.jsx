import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReviewSection from '../Common/ReviewSection';
import ProductSpecifications from '../Common/ProductSpecifications';
import ProductFeatures from '../Common/ProductFeatures';
import ProductPurchaseInfo from '../Common/ProductPurchaseInfo';
import { allProducts } from '../../lib/productsData';

const ProductDetail = () => {
  const { productId, brand } = useParams();
  const navigate = useNavigate();

  // دریافت اطلاعات محصول بر اساس برند و ID
  const product = allProducts[brand]?.[productId];

  // اگر محصول پیدا نشد، به صفحه اصلی برگردان
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">محصول یافت نشد</h1>
            <p className="text-gray-600 mb-8">محصول مورد نظر شما در سیستم موجود نیست.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = (quantity) => {
    // منطق افزودن به سبد خرید
    console.log(`افزودن ${quantity} عدد ${product.name} به سبد خرید`);
  };

  const handleSubmitReview = async (reviewData) => {
    // منطق ارسال نظر
    console.log('نظر ارسال شد:', reviewData);
    // اینجا می‌تونید به API درخواست بزنید
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <ArrowBackIcon className="text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">جزئیات محصول</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* تصویر محصول */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="h-96 bg-gray-200 rounded-xl flex items-center justify-center mb-6">
              <span className="text-gray-500 text-xl">تصویر {product.name}</span>
            </div>
            
            {/* گالری تصاویر */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-20 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                  <span className="text-gray-500 text-sm">تصویر {item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* اطلاعات محصول */}
          <ProductPurchaseInfo 
            product={product}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* توضیحات و مشخصات */}
        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          {/* توضیحات */}
          <ProductFeatures 
            description={product.description}
            features={product.features}
          />

          {/* مشخصات فنی */}
          <ProductSpecifications specifications={product.specifications} />
        </div>

        {/* نظرات و امتیازدهی */}
        <ReviewSection 
          productId={product.id}
          reviews={product.reviews}
          onSubmitReview={handleSubmitReview}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
