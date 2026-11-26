import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCheck, Circle, Clock, ArrowRight } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { issueService } from '../../services/issueService';
import { useAuth } from '../../hooks/useAuth';
import { formatDateTime } from '../../utils/formatters';

export const Notifications = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await issueService.getNotifications(user?.id);
      setNotifications(data);
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, [user]);

  const handleMarkAllRead = async () => {
    await issueService.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      await issueService.markNotificationRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
    }
    if (notif.issueId) {
      navigate(`/issue/${notif.issueId}`);
    }
  };

  const renderNotificationText = (notif) => {
    const key = `notifications.${notif.type}`;
    return t(key, notif.params || {});
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {t('notifications.title')}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {notifications.filter((n) => !n.read).length} unread updates
          </span>
        </div>

        {notifications.some((n) => !n.read) && (
          <Button
            onClick={handleMarkAllRead}
            variant="ghost"
            size="sm"
            icon={CheckCheck}
          >
            {t('notifications.markAllRead')}
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <Loader fullScreen message={t('common.loading')} />
      ) : error ? (
        <ErrorState onRetry={fetchNotifs} description={error} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={t('notifications.emptyTitle')}
          description={t('notifications.emptyDesc')}
          actionLabel={t('nav.home')}
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="space-y-2.5">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              hoverable
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 transition-all border ${
                notif.read
                  ? 'bg-white border-slate-200'
                  : 'bg-blue-50/40 border-blue-200 ring-1 ring-blue-500/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    notif.read ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-[#1D4ED8]'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {notif.issueId}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(notif.createdAt)}
                    </span>
                  </div>

                  <p
                    className={`text-xs sm:text-sm mt-1 leading-snug ${
                      notif.read ? 'text-slate-700 font-normal' : 'text-slate-900 font-bold'
                    }`}
                  >
                    {renderNotificationText(notif)}
                  </p>
                </div>

                <div className="self-center pl-2">
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
