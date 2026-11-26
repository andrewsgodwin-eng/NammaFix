import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Calendar,
  User,
  Building,
  Share2,
  AlertCircle,
  CheckCircle,
  RefreshCcw,
  ArrowLeft,
  Copy,
  Users,
  Languages,
  Sparkles
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StatusTimeline } from '../../components/issues/StatusTimeline';
import { ConfirmButton } from '../../components/issues/ConfirmButton';
import { Loader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { issueService } from '../../services/issueService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';
import { formatDate, formatDateTime } from '../../utils/formatters';

export const IssueDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);

  const fetchIssue = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await issueService.getIssueById(id);
      setIssue(data);
    } catch (err) {
      setError(err.message || 'Issue not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `NammaFix Complaint: ${issue?.complaintId}`,
          text: issue?.description,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(t('common.shared'), 'success');
    }
  };

  const handleFeedback = async (isFixed) => {
    try {
      const updated = await issueService.submitFeedback(issue.id, isFixed, '', user);
      setIssue(updated);
      setFeedbackSubmitted(true);
      showToast(
        isFixed ? 'Thank you for confirming resolution!' : 'Ticket reopened for re-inspection',
        isFixed ? 'success' : 'info'
      );
    } catch (err) {
      showToast(err.message || 'Failed to submit feedback', 'error');
    }
  };

  if (loading) {
    return <Loader fullScreen message={t('common.loading')} />;
  }

  if (error || !issue) {
    return (
      <div className="max-w-md mx-auto py-8">
        <ErrorState
          title={t('issue.notFoundTitle')}
          description={t('issue.notFoundDesc', { id })}
          onRetry={() => navigate('/nearby')}
        />
      </div>
    );
  }

  const categoryName = t(`categories.${issue.category}`, issue.category);

  // Phase 6 Description Translation Simulation for Indian scripts
  const displayDescription = isTranslated
    ? `${issue.description} [Translated to ${i18n.language.toUpperCase()}]`
    : issue.description;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150 pb-10">
      {/* Top Bar with Back & Share */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.back')}</span>
        </button>

        <Button
          onClick={handleShare}
          variant="outline"
          size="sm"
          icon={Share2}
        >
          {t('issue.shareComplaint')}
        </Button>
      </div>

      {/* Main Issue Card */}
      <Card className="p-5 sm:p-7 space-y-5 border-slate-200">
        {/* Header: Complaint ID & Status Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {t('issue.complaintId')}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {issue.complaintId || issue.id}
            </h2>
          </div>
          <Badge status={issue.status} size="md" />
        </div>

        {/* Duplicate Notice Banner */}
        {issue.duplicateOf && (
          <div className="p-3 bg-amber-50 text-amber-900 border border-amber-300 rounded-xl text-xs sm:text-sm font-medium">
            {t('issue.duplicateNotice', { id: issue.duplicateOf })}
          </div>
        )}

        {/* Rejection Reason Banner */}
        {issue.status === 'rejected' && issue.rejectionReason && (
          <div className="p-4 bg-rose-50 text-rose-900 border border-rose-200 rounded-xl text-xs sm:text-sm space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-rose-800">
              <AlertCircle className="w-4 h-4" />
              {t('issue.rejectionReason')}:
            </span>
            <p className="text-slate-700">{issue.rejectionReason}</p>
          </div>
        )}

        {/* Issue Photo */}
        {issue.imageUrl && (
          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-xs max-h-80">
            <img
              src={issue.imageUrl}
              alt={categoryName}
              className="w-full h-full object-cover max-h-80"
            />
          </div>
        )}

        {/* Category & Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="inline-block px-3 py-1 rounded-lg bg-blue-50 text-[#1D4ED8] text-xs font-bold">
              {categoryName}
            </div>

            <button
              onClick={() => setIsTranslated(!isTranslated)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#1D4ED8]"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{isTranslated ? 'Original' : 'Translate'}</span>
            </button>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {displayDescription}
          </h3>
        </div>

        {/* Location & Meta info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" />
            <div className="overflow-hidden">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Location</span>
              <p className="font-medium text-slate-800 leading-tight">{issue.address}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
            <Building className="w-4 h-4 text-[#1D4ED8] flex-shrink-0 mt-0.5" />
            <div className="overflow-hidden">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">
                {t('issue.assignedDept')}
              </span>
              <p className="font-semibold text-slate-800 truncate">
                {issue.department?.name || t('issue.unassigned')}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase block">
                {t('issue.reportedOn')}
              </span>
              <p className="font-medium text-slate-800">{formatDateTime(issue.createdAt)}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
            <Users className="w-4 h-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Community</span>
              <p className="font-bold text-slate-900">
                {t('issue.affectedCount', { count: issue.affectedCount || 1 })}
              </p>
            </div>
          </div>
        </div>

        {/* Community "I am facing this too" Action Button */}
        {issue.status !== 'resolved' && issue.status !== 'rejected' && (
          <div className="pt-2">
            <ConfirmButton
              issue={issue}
              onConfirmed={(updated) => setIssue(updated)}
            />
          </div>
        )}

        {/* Fixed / Not-Fixed Citizen Verification Prompt */}
        {issue.status === 'resolved' && !feedbackSubmitted && (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <h4 className="font-extrabold text-sm sm:text-base">
                {t('issue.resolvedFeedbackPrompt')}
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Button
                onClick={() => handleFeedback(true)}
                variant="success"
                size="md"
              >
                {t('issue.yesFixedBtn')}
              </Button>
              <Button
                onClick={() => handleFeedback(false)}
                variant="danger"
                size="md"
              >
                {t('issue.notFixedBtn')}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Resolution Timeline */}
      <Card className="p-5 sm:p-7 space-y-4 border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <span>{t('issue.timelineTitle')}</span>
        </h3>
        <StatusTimeline timeline={issue.timeline || []} />
      </Card>
    </div>
  );
};
