import React from 'react';

// دکمه‌های بهبود یافته با استایل‌های بهتر برای افزایش CTR
const Button = ({ 
  children, 
  variant = 'primary', // primary, secondary, danger, success, outline
  size = 'md', // sm, md, lg
  onClick, 
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
  icon: Icon,
  ...props 
}) => {
  // استایل‌های variant
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg shadow-gray-500/50 hover:shadow-xl',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/50 hover:shadow-xl',
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-500/50 hover:shadow-xl',
    outline: 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 shadow-md hover:shadow-lg',
  };

  // استایل‌های size
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // استایل hover و transform برای جذابیت بیشتر
  const hoverTransform = 'transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200';

  const baseStyles = `
    ${variantStyles[variant]} 
    ${sizeStyles[size]} 
    ${hoverTransform}
    ${fullWidth ? 'w-full' : ''}
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    font-semibold rounded-lg
    flex items-center justify-center gap-2
    relative overflow-hidden
    ${className}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
      {...props}
    >
      {/* Ripple effect overlay */}
      <span className="absolute inset-0 bg-white/20 transform scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left" />
      
      {/* Content */}
      <span className="relative flex items-center justify-center gap-1.5 whitespace-nowrap">
        {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
        <span>{children}</span>
      </span>
    </button>
  );
};

export default Button;

