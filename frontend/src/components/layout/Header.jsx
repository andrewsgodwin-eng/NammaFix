import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell, MapPin, Shield, User, Compass, Sparkles } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../common/Logo';

export const Header = () => {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E2D9] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center group cursor-pointer" title="NammaFix Home">
            <Logo size="md" textDark={true} />
          </Link>
          <Link
            to="/preface"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF9F6] border border-[#E8E2D9] text-[11px] font-semibold text-[#6B4A2E] hover:text-[#1A120E] hover:border-[#D5C4AE] transition-all"
            title="Launch Animated Intro"
          >
            <Compass className="w-3.5 h-3.5 text-[#A88462]" />
            <span>Preface</span>
          </Link>
        </div>

        {/* Location Indicator (Desktop / Tablet) */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#1A120E] bg-[#FBF9F6] px-3.5 py-1.5 rounded-full border border-[#E8E2D9] truncate max-w-xs shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <MapPin className="w-3.5 h-3.5 text-[#A88462] flex-shrink-0" />
          <span className="truncate">{user?.location || 'Chennai Municipal Zone'}</span>
        </div>

        {/* Right Actions: Language, Notifications, Admin Switcher, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/admin"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FBF9F6] hover:bg-[#F2ECE4] text-[#1A120E] border border-[#E8E2D9] text-xs font-bold transition-all shadow-xs"
          >
            <Shield className="w-3.5 h-3.5 text-[#A88462]" />
            <span>Admin</span>
          </Link>

          {/* Language Selector */}
          <LanguageSelector variant="header" />

          {/* Notification Bell */}
          <Link
            to="/notifications"
            className="relative p-2.5 rounded-xl text-[#1A120E] hover:bg-[#FBF9F6] hover:text-[#A88462] transition-colors min-w-[42px] min-h-[42px] flex items-center justify-center border border-transparent hover:border-[#E8E2D9]"
            aria-label={t('nav.notifications')}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#EA580C] rounded-full ring-2 ring-white"></span>
          </Link>

          {/* Profile link */}
          <Link
            to="/profile"
            className="w-9 h-9 rounded-xl bg-[#FBF9F6] border border-[#E8E2D9] flex items-center justify-center text-[#1A120E] font-bold text-xs hover:border-[#A88462] transition-all overflow-hidden shadow-2xs"
            aria-label={t('nav.profile')}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-[#A88462]" />}
          </Link>
        </div>
      </div>
    </header>
  );
};
