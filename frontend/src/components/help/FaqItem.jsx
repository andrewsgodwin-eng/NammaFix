import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '../common/Card';

export const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card padding="p-0" className="overflow-hidden border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left transition-colors hover:bg-slate-50 min-h-[48px]"
        aria-expanded={isOpen}
      >
        <span className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-[#1D4ED8]' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
          {answer}
        </div>
      )}
    </Card>
  );
};
