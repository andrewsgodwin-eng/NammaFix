import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  PlusCircle, 
  FileText, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Radio, 
  Compass, 
  AlertTriangle,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { IssueCard } from '../../components/issues/IssueCard';
import { IssueMap } from '../../components/map/IssueMap';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { issueService } from '../../services/issueService';
import { useAuth } from '../../hooks/useAuth';
import { useGeolocation } from '../../hooks/useGeolocation';
import { formatNumber } from '../../utils/formatters';

export const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { location: userCoords, getDistanceTo, isTracking } = useGeolocation(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [stats, setStats] = useState({
    myReports: 0,
    openNearby: 0,
    resolved: 0
  });

  const loadHomeData = async () => {
    setLoading(true);
    setError(null);
    try {
      const allIssues = await issueService.getIssues();
      const myIssues = await issueService.getMyReports(user?.id || 'usr_001');

      const openCount = allIssues.filter(
        (i) => i.status !== 'resolved' && i.status !== 'rejected'
      ).length;
      const resolvedCount = allIssues.filter((i) => i.status === 'resolved').length;

      setStats({
        myReports: myIssues.length,
        openNearby: openCount,
        resolved: resolvedCount
      });

      // Show top 4 recent nearby issues
      setRecentIssues(allIssues.slice(0, 4));
    } catch (err) {
      setError(err.message || 'Failed to load civic data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, [user]);

  if (error) {
    return <ErrorState onRetry={loadHomeData} description={error} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200 bg-white">
      {/* Editorial Civic Dispatch Hero on Clean White/Warm Surface */}
      <div className="relative overflow-hidden rounded-3xl bg-[#FBF9F6] border border-[#E8E2D9] p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E2D9] text-xs font-mono text-[#6B4A2E] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>REAL-TIME CIVIC SENSOR ACTIVE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A120E] tracking-tight leading-tight">
            Spot a problem in your street? <br />
            <span className="text-[#A88462]">Dispatch resolution in seconds.</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#6B4A2E] leading-relaxed max-w-md">
            Directly notify Chennai Corporation engineers with GPS-verified location, photo evidence, and live status tracking.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              onClick={() => navigate('/report')}
              variant="primary"
              size="lg"
              icon={PlusCircle}
              className="font-bold shadow-sm"
            >
              {t('home.reportNowBtn') || 'Report an Incident'}
            </Button>
            <Button
              onClick={() => navigate('/nearby')}
              variant="secondary"
              size="lg"
              icon={MapPin}
            >
              Explore Map View
            </Button>
          </div>
        </div>

        {/* Ambient Subtle Warm Radial */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#A88462]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Real-Time Live Neighborhood MapLibre Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#A88462] animate-pulse" />
            <h3 className="text-xs font-mono font-bold text-[#1A120E] uppercase tracking-wider">
              Live MapLibre Radar View
            </h3>
          </div>
          <Link
            to="/nearby"
            className="text-xs text-[#6B4A2E] hover:text-[#1A120E] flex items-center gap-1 font-semibold transition-colors"
          >
            <span>Full Map Screen</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <IssueMap
          issues={recentIssues}
          center={[userCoords?.lat, userCoords?.lng]}
          zoom={14}
          height="340px"
          userLocation={userCoords}
        />
      </div>

      {/* Quick Stat Counters */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Card
          hoverable
          onClick={() => navigate('/my-reports')}
          className="p-4 sm:p-5 flex flex-col justify-between bg-white border-[#E8E2D9]"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FBF9F6] text-[#A88462] border border-[#E8E2D9] flex items-center justify-center mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#1A120E] block leading-tight">
              {formatNumber(stats.myReports)}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-[#6B4A2E]">
              {t('home.myReportsStat') || 'My Reports'}
            </span>
          </div>
        </Card>

        <Card
          hoverable
          onClick={() => navigate('/nearby')}
          className="p-4 sm:p-5 flex flex-col justify-between bg-white border-[#E8E2D9]"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-3">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#1A120E] block leading-tight">
              {formatNumber(stats.openNearby)}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-[#6B4A2E]">
              {t('home.openNearbyStat') || 'Active Incidents'}
            </span>
          </div>
        </Card>

        <Card
          hoverable
          onClick={() => navigate('/nearby?status=resolved')}
          className="p-4 sm:p-5 flex flex-col justify-between bg-white border-[#E8E2D9]"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#1A120E] block leading-tight">
              {formatNumber(stats.resolved)}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-[#6B4A2E]">
              {t('home.resolvedStat') || 'Resolved'}
            </span>
          </div>
        </Card>
      </div>

      {/* Recent Nearby Reports Feed with Live Distances */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-mono font-bold text-[#1A120E] uppercase tracking-wider">
            {t('home.recentIssues') || 'Recent Neighborhood Reports'}
          </h3>
          <Link
            to="/nearby"
            className="text-xs text-[#6B4A2E] hover:text-[#1A120E] flex items-center gap-1 font-semibold transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-[#FBF9F6] border border-[#E8E2D9] animate-pulse" />
            ))}
          </div>
        ) : recentIssues.length === 0 ? (
          <EmptyState
            title="All clear in your area"
            description="No active civic issues reported nearby. Everything is running smoothly."
            actionLabel="Report a New Problem"
            onAction={() => navigate('/report')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {recentIssues.map((issue) => {
              const lat = issue.latitude || issue.location?.coordinates?.[1];
              const lng = issue.longitude || issue.location?.coordinates?.[0];
              const dist = lat && lng ? getDistanceTo(lat, lng) : null;

              return (
                <IssueCard
                  key={issue._id || issue.id}
                  issue={issue}
                  showDistance={true}
                  distanceMeters={dist}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
