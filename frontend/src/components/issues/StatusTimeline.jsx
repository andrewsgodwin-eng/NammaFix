import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Clock, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import { STATUS_CONFIG } from '../../utils/constants';

export const StatusTimeline = ({ timeline = [] }) => {
  const { t } = useTranslation();

  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="flow-root py-2">
      <ul className="-mb-8">
        {timeline.map((step, idx) => {
          const isLast = idx === timeline.length - 1;
          const statusConfig = STATUS_CONFIG[step.status] || STATUS_CONFIG.reported;
          const statusLabel = t(`status.${step.status}`, step.status);

          return (
            <li key={idx} className="relative pb-8">
              {!isLast ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                  aria-hidden="true"
                />
              ) : null}

              <div className="relative flex items-start space-x-3">
                {/* Step Marker Dot */}
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white ${statusConfig.bg} ${statusConfig.text}`}
                >
                  {step.status === 'resolved' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : step.status === 'rejected' ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : step.status === 'in_progress' ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>

                {/* Step Details */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-sm font-bold text-slate-900">
                      {statusLabel}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {formatDateTime(step.at)}
                    </span>
                  </div>

                  {step.by && (
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {step.by}
                    </p>
                  )}

                  {step.note && (
                    <div className="mt-1.5 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 leading-relaxed">
                      {step.note}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
