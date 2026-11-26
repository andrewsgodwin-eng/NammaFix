import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import { BarChart3, TrendingUp, Clock, CheckCircle2, Flame, MapPin } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { issueService } from '../../services/issueService';

const CHART_COLORS = ['#1D4ED8', '#DC2626', '#16A34A', '#D97706', '#9333EA', '#0284C7', '#4F46E5', '#64748B'];

export const Analytics = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [aData, sData] = await Promise.all([
          issueService.getAdminAnalytics(),
          issueService.getAdminStats()
        ]);
        setAnalytics(aData);
        setStats(sData);
      } catch (err) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <Loader fullScreen message="Crunching Municipal Analytics..." />;
  }

  if (error) {
    return <ErrorState description={error} />;
  }

  const formattedCategoryData = (analytics?.categoryData || []).map((item) => ({
    name: t(`categories.${item.category}`, item.category),
    count: item.count
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-150 pb-8">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#1D4ED8]" />
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {t('admin.analyticsTitle')}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Performance intelligence across wards, department turnaround times, and recurring defect clusters
        </p>
      </div>

      {/* KPI Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-emerald-200 bg-emerald-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 uppercase">
              {t('admin.resolutionRate')}
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-900">
            {stats?.resolutionRate || 68}%
          </p>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">
            Target SLA: &gt; 65% on-time resolution
          </span>
        </Card>

        <Card className="p-5 border-blue-200 bg-blue-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-800 uppercase">
              {t('admin.avgResolutionTime')}
            </span>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-blue-900">
            {stats?.avgFixDays || 3.2} Days
          </p>
          <span className="text-xs text-blue-700 font-semibold mt-1 block">
            -0.8 days reduction compared to last month
          </span>
        </Card>

        <Card className="p-5 border-amber-200 bg-amber-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 uppercase">
              Active Wards Tracked
            </span>
            <MapPin className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-amber-900">
            15 Zones
          </p>
          <span className="text-xs text-amber-700 font-semibold mt-1 block">
            200 wards in Greater Chennai Corporation
          </span>
        </Card>
      </div>

      {/* Category Bar Chart */}
      <Card className="p-5 sm:p-6 border-slate-200 bg-white space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>{t('admin.categoryDistribution')}</span>
        </h3>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Bar dataKey="count" fill="#1D4ED8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Area Hotspots Table */}
      <Card className="p-5 sm:p-6 border-slate-200 bg-white space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#DC2626]" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            {t('admin.topHotspots')}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
              <tr>
                <th className="py-3 px-3">Ward / Area</th>
                <th className="py-3 px-3">Reported Count</th>
                <th className="py-3 px-3">Resolution Rate</th>
                <th className="py-3 px-3">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {(analytics?.hotspots || []).map((h, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{h.area}</td>
                  <td className="py-3 px-3">{h.count} issues</td>
                  <td className="py-3 px-3 font-semibold text-emerald-700">{h.resolution}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      High Priority
                    </span>
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
