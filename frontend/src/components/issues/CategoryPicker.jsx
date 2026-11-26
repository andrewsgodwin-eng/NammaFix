import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Lightbulb,
  Trash2,
  Construction,
  Droplet,
  Waves,
  CloudRain,
  Zap,
  TrafficCone,
  HelpCircle,
  Check
} from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';

const ICON_MAP = {
  Lightbulb,
  Trash2,
  Construction,
  Droplet,
  Waves,
  CloudRain,
  Zap,
  TrafficCone,
  HelpCircle
};

export const CategoryPicker = ({ selectedCategory, onSelect, error }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || HelpCircle;
          const isSelected = selectedCategory === cat.id;
          const label = t(`categories.${cat.id}`, cat.id);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-center transition-all min-h-[110px] active:scale-95 touch-manipulation ${
                isSelected
                  ? 'border-[#1D4ED8] bg-blue-50/70 text-[#1D4ED8] shadow-sm ring-2 ring-blue-500/30 font-bold'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#1D4ED8] text-white rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-transform ${
                  isSelected
                    ? 'bg-[#1D4ED8] text-white shadow-xs scale-105'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <span className="text-xs sm:text-sm font-semibold line-clamp-2 leading-tight">
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-sm font-medium text-rose-600 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
};
