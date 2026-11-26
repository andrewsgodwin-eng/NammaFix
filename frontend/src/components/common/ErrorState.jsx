import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

export const ErrorState = ({
  title,
  description,
  onRetry,
  className = ''
}) => {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 bg-[#241A14] rounded-2xl border border-rose-900/50 shadow-xl ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-400 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-base md:text-lg font-bold text-[#D5C4AE] mb-1">
        {title || t('errors.genericTitle') || 'Connection Disrupted'}
      </h3>
      <p className="text-xs md:text-sm text-[#A88462] max-w-md mb-5 leading-relaxed">
        {description || t('errors.genericDesc') || 'Unable to communicate with municipal API. Please verify your connection.'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="md" icon={RefreshCw}>
          {t('common.retry') || 'Retry Request'}
        </Button>
      )}
    </div>
  );
};
