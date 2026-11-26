import React from 'react';

/**
 * Modern, crisp, minimalistic geometric civic logo for NammaFix.
 * Art-directed with Warm Caramel (#A88462), Sandstone (#D5C4AE), and Espresso (#1A120E).
 */
export const Logo = ({ size = 'md', className = '', showText = true, textDark = false }) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', icon: 'w-4 h-4', text: 'text-base', sub: 'text-[9px]' },
    md: { box: 'w-9 h-9', icon: 'w-5 h-5', text: 'text-xl', sub: 'text-[10px]' },
    lg: { box: 'w-12 h-12', icon: 'w-7 h-7', text: 'text-2xl', sub: 'text-xs' },
    xl: { box: 'w-16 h-16', icon: 'w-9 h-9', text: 'text-3xl', sub: 'text-xs' },
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Minimalist Pin & Check Symbol */}
      <div
        className={`${s.box} rounded-xl bg-[#A88462] text-[#1A120E] flex items-center justify-center shadow-md flex-shrink-0 transition-transform group-hover:scale-105 border border-[#D5C4AE]/40`}
      >
        <svg
          className={s.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 21s-6-5.333-6-10a6 6 0 1 1 12 0c0 4.667-6 10-6 10z" />
          <path d="m9 10.5 2 2 4-4" strokeWidth="2.6" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span
              className={`font-black tracking-tight leading-none ${
                textDark ? 'text-[#1A120E]' : 'text-[#D5C4AE]'
              } ${s.text}`}
            >
              Namma<span className="text-[#A88462]">Fix</span>
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#A88462] mt-0.5">
            Civic Engine
          </span>
        </div>
      )}
    </div>
  );
};
