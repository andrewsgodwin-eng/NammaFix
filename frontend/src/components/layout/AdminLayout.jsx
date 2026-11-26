import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, Compass } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { LanguageSelector } from './LanguageSelector';

export const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#1A120E] flex flex-col lg:flex-row">
      {/* Sidebar navigation */}
      <AdminSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top bar for mobile header & desk controls */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8E2D9] px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#1A120E] hover:bg-[#FBF9F6] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold text-[#A88462] uppercase tracking-wider">
                MUNICIPAL DISPATCH & CONTROL
              </span>
              <h1 className="text-base sm:text-lg font-bold text-[#1A120E] leading-tight">
                Chennai Central Civic Grid
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/preface"
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#FBF9F6] hover:bg-[#F2ECE4] text-[#6B4A2E] border border-[#E8E2D9] hidden sm:inline-flex items-center gap-1.5 transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-[#A88462]" />
              <span>Preface</span>
            </Link>
            <LanguageSelector variant="header" />
            <Link
              to="/"
              className="text-xs font-semibold px-3.5 py-1.5 bg-[#A88462] hover:bg-[#8F6D4C] text-white rounded-xl transition-all shadow-sm hidden sm:inline-flex"
            >
              Citizen View ↗
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
