import React from 'react';

export const Card = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  padding = 'p-4 sm:p-5',
  variant = 'white', // 'white' | 'subtle' | 'outline'
  ...props
}) => {
  const hoverStyles = hoverable || onClick
    ? 'cursor-pointer hover:border-[#D5C4AE] hover:shadow-md transition-all duration-200 active:scale-[0.99]'
    : '';

  const variantStyles = {
    white: 'bg-white border-[#E8E2D9]',
    subtle: 'bg-[#FBF9F6] border-[#E8E2D9]',
    outline: 'bg-transparent border-[#E8E2D9]'
  }[variant] || 'bg-white border-[#E8E2D9]';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border text-[#1A120E] shadow-2xs ${variantStyles} ${padding} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
