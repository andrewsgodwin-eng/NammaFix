import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  ChevronRight,
  Radio,
  MapPin,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { IssueMap } from '../../components/map/IssueMap';
import { ErrorState } from '../../components/common/ErrorState';
import { issueService } from '../../services/issueService';
import { formatDate, formatNumber } from '../../utils/formatters';

export const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [issues, setIssues] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, issuesData] = await Promise.all([
        issueService.getAdminStats(),
        issueService.getIssues()
      ]);
      setStats(statsData);
      setIssues(issuesData || []);
    } catch (err) {
      setError(err.message || 'Failed to load admin stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (error) {
    return <ErrorState onRetry={fetchDashboardData} description={error} />;
  }

  const filteredIssues = issues.filter((i) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return i.status === 'reported';
    if (filterStatus === 'in_progress') return i.status === 'in_progress' || i.status === 'assigned';
    if (filterStatus === 'resolved') return i.status === 'resolved';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150 bg-white">
      {/* Municipal Control Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FBF9F6] p-5 rounded-2xl border border-[#E8E2D9] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-mono font-bold text-[#6B4A2E] uppercase tracking-widest">
              CENTRAL CIVIC DISPATCH GRID
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#1A120E] leading-tight mt-1">
            Municipal Operations Desk
          </h2>
          <p className="text-xs text-[#6B4A2E] font-mono mt-0.5">
            Real-time urban response & SLA enforcement across Chennai metropolitan zones
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/admin/issues')}
            variant="primary"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
          >
            Open Triage Ledger
          </Button>
        </div>
      </div>

      {/* 4 Metric Telemetry Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-5 bg-white border-[#E8E2D9]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-bold text-[#6B4A2E] uppercase">
              Total Recorded
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FBF9F6] border border-[#E8E2D9] text-[#A88462] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#1A120E]">
            {formatNumber(stats?.total || issues.length)}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +14% weekly civic volume
          </span>
        </Card>

        <Card className="p-4 sm:p-5 bg-white border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-bold text-amber-700 uppercase">
              Pending Inspection
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-900">
            {formatNumber(stats?.pending || issues.filter(i => i.status === 'reported').length)}
          </p>
          <span className="text-[11px] text-amber-700 font-medium mt-1 block">
            Requires field verification
          </span>
        </Card>

        <Card className="p-4 sm:p-5 bg-white border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-bold text-orange-700 uppercase">
              Active In-Field
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-orange-900">
            {formatNumber(stats?.inProgress || issues.filter(i => i.status === 'in_progress').length)}
          </p>
          <span className="text-[11px] text-orange-700 font-medium mt-1 block">
            Crews dispatched on-site
          </span>
        </Card>

        <Card className="p-4 sm:p-5 bg-white border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase">
              Resolved & Closed
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-900">
            {formatNumber(stats?.resolved || issues.filter(i => i.status === 'resolved').length)}
          </p>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 block">
            {stats?.resolutionRate || '84'}% Municipal SLA Compliance
          </span>
        </Card>
      </div>

      {/* MapLibre Tactical Dispatch Grid Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#A88462] animate-pulse" />
            <h3 className="text-xs font-mono font-bold text-[#1A120E] uppercase tracking-wider">
              Metropolitan Incident MapLibre GIS
            </h3>
          </div>
          <span className="text-xs font-mono text-[#6B4A2E]">
            {issues.length} geocoded vectors live
          </span>
        </div>

        <IssueMap
          issues={issues}
          center={[13.0418, 80.2337]}
          zoom={12}
          height="380px"
        />
      </div>

      {/* Incident Triage Queue Table */}
      <Card className="p-5 space-y-4 bg-white border-[#E8E2D9]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E2D9]">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#A88462]" />
            <h3 className="text-base font-bold text-[#1A120E]">Priority Incident Queue</h3>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Incidents' },
              { id: 'pending', label: 'Needs Verification' },
              { id: 'in_progress', label: 'Dispatched' },
              { id: 'resolved', label: 'Resolved' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterStatus === f.id
                    ? 'bg-[#A88462] text-white font-bold shadow-2xs'
                    : 'bg-[#FBF9F6] text-[#1A120E] border border-[#E8E2D9] hover:bg-[#F2ECE4]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FBF9F6] text-[#6B4A2E] font-mono text-xs border-y border-[#E8E2D9]">
              <tr>
                <th className="py-3 px-3">Complaint ID</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Location & Landmark</th>
                <th className="py-3 px-3">Civic Impact</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Reported Time</th>
                <th className="py-3 px-3 text-right">Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9] text-[#1A120E]">
              {filteredIssues.slice(0, 8).map((issue) => (
                <tr key={issue._id || issue.id} className="hover:bg-[#FBF9F6] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#A88462]">
                    {issue.complaintId || issue.displayId || issue._id?.slice(-6) || 'INC'}
                  </td>
                  <td className="py-3 px-3 capitalize font-semibold">
                    {t(`categories.${issue.category}`) || issue.category}
                  </td>
                  <td className="py-3 px-3 max-w-xs truncate text-[#6B4A2E]">
                    {issue.address}
                  </td>
                  <td className="py-3 px-3 font-mono text-xs">
                    <span className="font-bold text-[#1A120E]">{issue.affectedCount || 1}</span> citizens
                  </td>
                  <td className="py-3 px-3">
                    <Badge status={issue.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-xs text-[#8A7B6E] font-mono">
                    {formatDate(issue.createdAt || Date.now())}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      onClick={() => navigate('/admin/issues')}
                      variant="secondary"
                      size="sm"
                    >
                      Inspect →
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
