import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { LANGUAGES } from '../../utils/languages';
import { useAuth } from '../../hooks/useAuth';

export const LanguageSelector = ({ variant = 'header' }) => {
  const { i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('nammafix_lang', code);
    if (user) {
      updateUser({ language: code });
    }
    setIsOpen(false);
  };

  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {LANGUAGES.map((lang) => {
          const isSelected = i18n.language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all min-h-[52px] ${
                isSelected
                  ? 'border-[#1D4ED8] bg-blue-50/50 text-[#1D4ED8] font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-base font-semibold">{lang.native}</span>
                <span className="text-xs text-slate-500">{lang.code.toUpperCase()}</span>
              </div>
              {isSelected && <Check className="w-5 h-5 text-[#1D4ED8]" />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-sm font-semibold min-h-[44px]"
        aria-label="Change Language"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-slate-600" />
        <span>{currentLang.native}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Select Language
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm text-left hover:bg-slate-50 transition-colors ${
                  isSelected ? 'text-[#1D4ED8] font-bold bg-blue-50/50' : 'text-slate-700'
                }`}
              >
                <span>{lang.native}</span>
                {isSelected && <Check className="w-4 h-4 text-[#1D4ED8]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
