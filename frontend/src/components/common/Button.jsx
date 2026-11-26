import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'action' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'dark'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#A88462]/40 disabled:opacity-50 disabled:pointer-events-none min-h-[44px] touch-manipulation select-none cursor-pointer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 min-h-[36px]',
    md: 'px-4 py-2.5 text-sm gap-2 min-h-[44px]',
    lg: 'px-6 py-3.5 text-base font-semibold gap-2.5 min-h-[50px]'
  };

  const variantStyles = {
    primary: 'bg-[#A88462] hover:bg-[#8F6D4C] text-white shadow-sm',
    dark: 'bg-[#1A120E] hover:bg-[#3A2418] text-white shadow-sm',
    action: 'bg-[#EA580C] hover:bg-[#C2410C] text-white shadow-sm shadow-[#EA580C]/25',
    secondary: 'bg-[#FBF9F6] hover:bg-[#F2ECE4] text-[#1A120E] border border-[#E8E2D9]',
    outline: 'border border-[#E8E2D9] hover:bg-[#FBF9F6] text-[#1A120E] bg-white',
    ghost: 'hover:bg-[#FBF9F6] text-[#1A120E]',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 mr-2 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 flex-shrink-0" />
      )}
    </button>
  );
};
