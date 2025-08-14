import React from 'react';

const ProductSpecifications = ({ specifications }) => {
  const getSpecificationLabel = (key) => {
    const labels = {
      material: 'جنس',
      thickness: 'ضخامت',
      weight: 'وزن',
      temperature: 'مقاومت حرارتی',
      warranty: 'گارانتی',
      dimensions: 'ابعاد',
      hardness: 'سختی',
      friction: 'ضریب اصطکاک',
      maxSpeed: 'حداکثر سرعت',
      brakeType: 'نوع ترمز'
    };
    
    return labels[key] || key;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">مشخصات فنی</h3>
      <div className="space-y-4">
        {Object.entries(specifications).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
            <span className="text-gray-600 font-medium">
              {getSpecificationLabel(key)}
            </span>
            <span className="text-gray-800 font-semibold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecifications;
