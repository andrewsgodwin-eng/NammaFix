import React from 'react';
import { useTranslation } from 'react-i18next';

export const Loader = ({ message, fullScreen = false }) => {
  const { t } = useTranslation();
  const displayMsg = message || t('common.loading');

  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#1D4ED8] animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-[#DC2626] rounded-full"></div>
        </div>
      </div>
      <p className="text-sm font-medium text-slate-600 animate-pulse">{displayMsg}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
