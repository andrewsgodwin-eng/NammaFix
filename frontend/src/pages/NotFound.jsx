import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ErrorState } from '../components/common/ErrorState';

export const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <ErrorState
        title={t('errors.notFoundTitle')}
        description={t('errors.notFoundDesc')}
      />
      <div className="mt-4">
        <Button
          onClick={() => navigate('/')}
          variant="primary"
          size="md"
          icon={Home}
        >
          {t('nav.home')}
        </Button>
      </div>
    </div>
  );
};
