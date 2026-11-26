import React from 'react';
import { Card } from '../common/Card';
import { CheckCircle } from 'lucide-react';

export const GuideCard = ({ title, steps = [], icon: Icon }) => {
  const stepsList = typeof steps === 'string' ? steps.split('|') : steps;

  return (
    <Card className="border-slate-200 hover:border-blue-200 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <h4 className="font-bold text-slate-900 text-base leading-snug">
            {title}
          </h4>
        </div>

        <ol className="space-y-2.5 my-2">
          {stepsList.map((step, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">
                {step.replace(/^\d+\.\s*/, '')}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
};
