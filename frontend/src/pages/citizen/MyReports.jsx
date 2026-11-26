import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileEdit, Users, PlusCircle } from 'lucide-react';
import { IssueCard } from '../../components/issues/IssueCard';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { issueService } from '../../services/issueService';
import { useAuth } from '../../hooks/useAuth';

export const MyReports = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('created'); // 'created' | 'confirmed'
  const [createdIssues, setCreatedIssues] = useState([]);
  const [confirmedIssues, setConfirmedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const uid = user?.id || 'usr_001';
      const [mine, joined] = await Promise.all([
        issueService.getMyReports(uid),
        issueService.getConfirmedIssues(uid)
      ]);
      setCreatedIssues(mine);
      setConfirmedIssues(joined);
    } catch (err) {
      setError(err.message || 'Failed to load your reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyData();
  }, [user]);

  const currentList = activeTab === 'created' ? createdIssues : confirmedIssues;

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
          {t('myReports.title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {t('myReports.subtitle')}
        </p>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('created')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all min-h-[44px] ${
              activeTab === 'created'
                ? 'bg-white text-[#1D4ED8] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileEdit className="w-4 h-4" />
            <span>{t('myReports.tabCreated')} ({createdIssues.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('confirmed')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all min-h-[44px] ${
              activeTab === 'confirmed'
                ? 'bg-white text-[#1D4ED8] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t('myReports.tabConfirmed')} ({confirmedIssues.length})</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loader fullScreen message={t('common.loading')} />
      ) : error ? (
        <ErrorState onRetry={fetchMyData} description={error} />
      ) : currentList.length === 0 ? (
        activeTab === 'created' ? (
          <EmptyState
            title={t('myReports.emptyCreatedTitle')}
            description={t('myReports.emptyCreatedDesc')}
            actionLabel={t('home.reportNowBtn')}
            onAction={() => navigate('/report')}
          />
        ) : (
          <EmptyState
            title={t('myReports.emptyConfirmedTitle')}
            description={t('myReports.emptyConfirmedDesc')}
            actionLabel={t('nearby.title')}
            onAction={() => navigate('/nearby')}
          />
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentList.map((issue) => (
            <IssueCard key={issue.id || issue.complaintId} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};
