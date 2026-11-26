import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, CheckSquare, BarChart3, Building2, LogOut, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../common/Logo';

export const AdminSidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin', label: t('nav.dashboard') || 'Control Desk', icon: LayoutDashboard, exact: true },
    { to: '/admin/issues', label: t('nav.issues') || 'Issue Triage', icon: CheckSquare },
    { to: '/admin/analytics', label: t('nav.analytics') || 'Analytics', icon: BarChart3 },
    { to: '/admin/departments', label: t('nav.departments') || 'Departments', icon: Building2 },
  ];

  const content = (
    <div className="flex flex-col h-full bg-white text-[#1A120E] border-r border-[#E8E2D9]">
      {/* Admin header */}
      <div className="p-5 border-b border-[#E8E2D9] flex items-center justify-between">
        <NavLink to="/" className="flex items-center group cursor-pointer" title="NammaFix Core">
          <Logo size="md" textDark={true} />
        </NavLink>
      </div>

      {/* Admin Officer Info */}
      <div className="px-5 py-4 border-b border-[#E8E2D9] bg-[#FBF9F6]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#A88462]/15 border border-[#A88462]/30 text-[#6B4A2E] flex items-center justify-center font-bold text-sm flex-shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-[#1A120E] truncate">{user?.name || 'Chief Officer'}</p>
            <p className="text-[11px] text-[#A88462] font-mono">Municipal Command</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px] cursor-pointer ${
                  isActive
                    ? 'bg-[#F5EFEB] text-[#1A120E] border border-[#E8E2D9] shadow-xs font-bold'
                    : 'text-[#6B4A2E] hover:bg-[#FBF9F6] hover:text-[#1A120E]'
                }`
              }
            >
              <Icon className="w-5 h-5 text-[#A88462]" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Switch to Citizen Portal */}
      <div className="p-4 border-t border-[#E8E2D9] space-y-2">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FBF9F6] hover:bg-[#F2ECE4] text-xs font-semibold text-[#1A120E] border border-[#E8E2D9] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#A88462]" />
          <span>Exit to Citizen App</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop permanent sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-40">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex"
          onClick={onClose}
        >
          <div
            className="w-72 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
};
