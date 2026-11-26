import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { issueService } from '../../services/issueService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../common/Toast';

export const ConfirmButton = ({ issue, onConfirmed }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const isConfirmed =
    issue.confirmedByUserIds?.includes(user?.id || 'usr_001') || false;

  const handleConfirm = async () => {
    if (isConfirmed) return;
    setLoading(true);
    try {
      const updated = await issueService.confirmIssue(issue.id || issue.complaintId, user);
      showToast(t('issue.alreadyConfirmed'), 'success');
      if (onConfirmed) onConfirmed(updated);
    } catch (err) {
      showToast(err.message || 'Failed to confirm', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (isConfirmed) {
    return (
      <div className="flex items-center justify-center gap-2 p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-sm sm:text-base">
        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <span>{t('issue.alreadyConfirmed')}</span>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConfirm}
      variant="primary"
      size="lg"
      fullWidth
      loading={loading}
      icon={Users}
      className="shadow-md shadow-blue-600/20"
    >
      {t('issue.confirmFacingIssue')}
    </Button>
  );
};
