import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 bg-[#241A14] rounded-2xl border border-dashed border-[#3A2418] ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-[#3A2418] text-[#A88462] border border-[#6B4A2E]/50 flex items-center justify-center mb-4 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base md:text-lg font-bold text-[#D5C4AE] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs md:text-sm text-[#A88462] max-w-md mb-5 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
