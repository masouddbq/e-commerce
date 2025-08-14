import React from 'react';

const ProductFeatures = ({ features, description }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">توضیحات محصول</h3>
      <p className="text-gray-700 leading-relaxed mb-6">{description}</p>
      
      <h4 className="text-xl font-semibold text-gray-800 mb-4">ویژگی‌های کلیدی:</h4>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductFeatures;
