import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export const ComingSoonModal = ({ isOpen, onClose, featureName }) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('common.comingSoon')}>
      <div className="text-center py-4 space-y-4">
        <div className="w-16 h-16 bg-blue-50 text-[#1D4ED8] rounded-2xl mx-auto flex items-center justify-center">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">
            {featureName || t('common.comingSoon')}
          </h4>
          <p className="text-sm text-slate-600 mt-2">
            {t('common.comingSoonMsg')}
          </p>
        </div>
        <div className="pt-2">
          <Button onClick={onClose} variant="primary" fullWidth>
            {t('common.done')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
