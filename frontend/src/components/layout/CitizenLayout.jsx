import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export const CitizenLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A120E]">
      <Header />
      <main className="flex-1 pb-24 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 md:py-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
