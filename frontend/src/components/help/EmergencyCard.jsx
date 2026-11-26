import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, ShieldAlert, Siren, Flame, HeartPulse, Users, HeartHandshake } from 'lucide-react';
import { Card } from '../common/Card';

const ICON_MAP = {
  ShieldAlert,
  Siren,
  Flame,
  HeartPulse,
  Users,
  HeartHandshake
};

export const EmergencyCard = ({ contact }) => {
  const { t } = useTranslation();
  const Icon = ICON_MAP[contact.icon] || ShieldAlert;

  const colorStyles = {
    red: 'bg-rose-50 text-rose-700 border-rose-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  return (
    <Card className={`border transition-all flex flex-col justify-between ${colorStyles[contact.color] || colorStyles.blue}`}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white/80 shadow-xs flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-extrabold text-slate-900 text-base leading-tight">
            {contact.title}
          </h4>
          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
            {contact.subtitle}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-black/5">
        <a
          href={`tel:${contact.phone}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-sm transition-all min-h-[48px] shadow-sm"
        >
          <Phone className="w-4 h-4 text-emerald-400" />
          <span>{t('common.callNow')} ({contact.phone})</span>
        </a>
      </div>
    </Card>
  );
};
