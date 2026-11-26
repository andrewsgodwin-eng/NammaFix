import React from 'react';
import { useTranslation } from 'react-i18next';
import { STATUS_CONFIG } from '../../utils/constants';

export const Badge = ({
  status,
  label,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const { t } = useTranslation();

  if (status) {
    const config = STATUS_CONFIG[status] || {
      badge: 'bg-[#FBF9F6] text-[#6B4A2E] border-[#E8E2D9]',
      dot: 'bg-[#A88462]'
    };
    const translatedStatus = t(`status.${status}`, status);

    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold border rounded-full ${
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        } ${config.badge} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span className="capitalize">{translatedStatus}</span>
      </span>
    );
  }

  const variantStyles = {
    default: 'bg-[#FBF9F6] text-[#1A120E] border-[#E8E2D9]',
    primary: 'bg-[#A88462]/10 text-[#6B4A2E] border-[#A88462]/30',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200'
  };

  return (
    <span
      className={`inline-flex items-center font-semibold border rounded-full ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {label}
    </span>
  );
};
