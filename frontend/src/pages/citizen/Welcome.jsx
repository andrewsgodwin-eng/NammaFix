import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Shield,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Lock,
  Building2,
  TrendingUp,
  Activity,
  AlertCircle,
  Clock,
  ThumbsUp,
  Radio,
  Search,
  Check
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Logo } from '../../components/common/Logo';
import { LanguageSelector } from '../../components/layout/LanguageSelector';
import { issueService } from '../../services/issueService';
import { useAuth } from '../../hooks/useAuth';

export const Welcome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Dynamic live civic feed & metrics state
  const [liveIssues, setLiveIssues] = useState([]);
  const [liveStats, setLiveStats] = useState({
    total: 142,
    resolved: 118,
    activeConfirmed: 340,
    avgResolutionHours: 28
  });
  const [recentTickerIndex, setRecentTickerIndex] = useState(0);

  useEffect(() => {
    // Load real issues from backend/mock
    issueService.getIssues().then((issues) => {
      if (issues && issues.length > 0) {
        setLiveIssues(issues);
        const resolved = issues.filter((i) => i.status === 'resolved').length;
        const totalConfirmed = issues.reduce((acc, curr) => acc + (curr.affectedCount || 1), 0);
        setLiveStats({
          total: issues.length,
          resolved: resolved,
          activeConfirmed: totalConfirmed,
          avgResolutionHours: 24
        });
      }
    }).catch(() => {});
  }, []);

  // Live rotating ticker for recent civic activity
  useEffect(() => {
    if (liveIssues.length === 0) return;
    const timer = setInterval(() => {
      setRecentTickerIndex((prev) => (prev + 1) % liveIssues.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [liveIssues]);

  const activeTickerIssue = liveIssues[recentTickerIndex] || liveIssues[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-100">
      {/* Crisp White Clean Navigation Bar */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/welcome" className="flex items-center group cursor-pointer" title="NammaFix Home">
            <Logo size="md" />
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSelector variant="header" />
          </div>
        </div>
      </header>

      {/* Main Dynamic Preface Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-12">
        {/* Dynamic Live Incident Ticker */}
        {activeTickerIssue && (
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white border border-slate-200/90 rounded-2xl shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {t('welcome.liveCivicFeed', 'LIVE CIVIC FEED')}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 truncate">
                <span className="font-semibold text-slate-900">{activeTickerIssue.complaintId}:</span>{' '}
                {activeTickerIssue.description}
              </p>
            </div>
            <span className="text-[11px] font-medium text-slate-500 hidden sm:inline flex-shrink-0 pl-2">
              {activeTickerIssue.address?.split(',')[0]}
            </span>
          </div>
        )}

        {/* Minimalist Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            {t('welcome.officialPlatformBadge', 'Official Grievance & Municipal Resolution Platform')}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 leading-tight">
            {t('welcome.welcomeHeroTitle', 'Spot a problem in your street? Get it fixed with NammaFix.')}
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t('welcome.welcomeHeroSubtitle', 'Report potholes, broken streetlights, garbage, water leaks, or road water stagnation directly to municipal corporation field engineers.')}
          </p>
        </div>

        {/* TWO SEPARATE PORTAL CARDS: Fully Translated & Minimalistic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* 1. CITIZEN PORTAL */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  {t('welcome.publicAccess', 'Public Citizen Access')}
                </span>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {t('welcome.citizenPortalTitle', 'Citizen Portal')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('welcome.citizenPortalDesc', 'For residents to report neighborhood issues, track live status, and upvote fixes without creating duplicates.')}
                </p>
              </div>

              {/* Minimalist Feature Bullet Points */}
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 pt-3 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{t('welcome.featureReport30s', 'Quick 30s photo report with smart category detect')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{t('welcome.featureGpsMap', 'Interactive GPS & address search pin mapper')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{t('welcome.featureConfirmFacing', '"I\'m facing this too" one-tap duplicate confirmation')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 space-y-2.5">
              <Button
                onClick={() => navigate('/auth?portal=citizen&mode=login')}
                variant="primary"
                size="lg"
                fullWidth
                icon={ArrowRight}
                iconPosition="right"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm min-h-[48px]"
              >
                {t('welcome.enterCitizenPortal', 'Enter Citizen Portal')}
              </Button>
              <button
                type="button"
                onClick={() => navigate('/auth?portal=citizen&mode=register')}
                className="w-full text-center text-xs text-slate-500 hover:text-blue-600 py-1 font-semibold transition-colors"
              >
                {t('welcome.newUserRegister', 'New user? Create a free citizen account →')}
              </button>
            </div>
          </div>

          {/* 2. OFFICER PORTAL */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3" /> {t('welcome.restrictedAccess', 'Restricted')}
                </span>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {t('welcome.officerPortalTitle', 'Officer Desk')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('welcome.officerPortalDesc', 'Dedicated operations dashboard for Municipal Corporation Engineers, Ward Councillors, and field crews.')}
                </p>
              </div>

              {/* Minimalist Feature Bullet Points */}
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 pt-3 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{t('welcome.featureOfficerTriage', 'Zonal Triage queue with verified inspection workflow')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{t('welcome.featureOfficerAssign', 'Assign work orders directly to ward departments')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{t('welcome.featureOfficerMerge', 'Merge duplicates into single master complaint tickets')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 space-y-2.5">
              <Button
                onClick={() => navigate('/auth?portal=admin')}
                variant="primary"
                size="lg"
                fullWidth
                icon={Shield}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-sm min-h-[48px]"
              >
                {t('welcome.officerLoginBtn', 'Officer Login / Desk Access')}
              </Button>
              <div className="text-center text-[11px] text-slate-400 py-1 flex items-center justify-center gap-1 font-medium">
                <Lock className="w-3 h-3 text-slate-400" /> {t('welcome.officerRestrictedNotice', 'Government & Municipal Badge ID Required')}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Live Civic Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-4xl mx-auto pt-2">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-2xs">
            <span className="text-2xl font-black text-slate-900 block">{liveStats.total}</span>
            <span className="text-xs text-slate-500 font-medium">{t('welcome.statRegistered', 'Complaints Registered')}</span>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-2xs">
            <span className="text-2xl font-black text-emerald-600 block">{liveStats.resolved}</span>
            <span className="text-xs text-slate-500 font-medium">{t('welcome.statFixed', 'Fixed & Verified')}</span>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-2xs">
            <span className="text-2xl font-black text-blue-600 block">{liveStats.activeConfirmed}</span>
            <span className="text-xs text-slate-500 font-medium">{t('welcome.statConfirmations', 'Citizen Confirmations')}</span>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-2xs">
            <span className="text-2xl font-black text-indigo-600 block">{liveStats.avgResolutionHours}h</span>
            <span className="text-xs text-slate-500 font-medium">{t('welcome.statFixVelocity', 'Avg Fix Velocity')}</span>
          </div>
        </div>
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Logo size="sm" />
          <span className="text-slate-400">
            Greater Chennai Corporation • Municipal Grievance Redressal
          </span>
        </div>
      </footer>
    </div>
  );
};
