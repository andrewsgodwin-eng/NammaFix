import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, MapPin, PlusCircle, FileText, HelpCircle } from 'lucide-react';

export const BottomNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: t('nav.home') || 'Home', icon: Home, exact: true },
    { to: '/nearby', label: t('nav.nearby') || 'Map', icon: MapPin },
    { to: '/report', label: t('nav.report') || 'Report', icon: PlusCircle, isReport: true },
    { to: '/my-reports', label: t('nav.myReports') || 'Reports', icon: FileText },
    { to: '/help', label: t('nav.help') || 'Help', icon: HelpCircle },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E2D9] pb-[env(safe-area-inset-bottom)] shadow-lg"
      aria-label="Citizen bottom navigation"
    >
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {navItems.map((item) => {
          if (item.isReport) {
            return (
              <div key={item.to} className="relative -top-3.5 flex flex-col items-center">
                <button
                  onClick={() => navigate('/report')}
                  className="w-13 h-13 rounded-full bg-[#A88462] hover:bg-[#8F6D4C] active:scale-95 text-white flex flex-col items-center justify-center shadow-lg shadow-[#A88462]/35 transition-all border-2 border-white cursor-pointer"
                  aria-label={item.label}
                >
                  <PlusCircle className="w-6 h-6 stroke-[2.5]" />
                </button>
                <span className="text-[10px] font-bold text-[#6B4A2E] mt-0.5 tracking-wider uppercase">
                  {item.label}
                </span>
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                  isActive ? 'text-[#1A120E] font-bold' : 'text-[#8A7B6E] hover:text-[#1A120E]'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="truncate max-w-[64px] text-center">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
