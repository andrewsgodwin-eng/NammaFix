import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  rightElement,
  ...props
}, ref) => {
  const inputId = id || name || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-[#1A120E]"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-2xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B4A2E]">
            <Icon className="h-4 w-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`block w-full rounded-xl border bg-white text-[#1A120E] placeholder:text-[#8A7B6E] transition-colors text-sm py-2.5 px-3 min-h-[44px] ${
            Icon ? 'pl-10' : ''
          } ${rightElement ? 'pr-12' : ''} ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
              : 'border-[#E8E2D9] hover:border-[#D5C4AE] focus:border-[#A88462] focus:ring-1 focus:ring-[#A88462]/30'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''} ${className}`}
          {...props}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-[#8A7B6E]">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
