import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CitizenLayout } from './components/layout/CitizenLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Preface & Public Pages
import { Preface } from './pages/Preface';
import { Welcome } from './pages/citizen/Welcome';
import { Auth } from './pages/citizen/Auth';
import { Home } from './pages/citizen/Home';
import { ReportIssue } from './pages/citizen/ReportIssue';
import { IssueDetails } from './pages/citizen/IssueDetails';
import { Nearby } from './pages/citizen/Nearby';
import { MyReports } from './pages/citizen/MyReports';
import { Notifications } from './pages/citizen/Notifications';
import { Help } from './pages/citizen/Help';
import { Profile } from './pages/citizen/Profile';

// Admin Pages
import { Dashboard } from './pages/admin/Dashboard';
import { IssueManagement } from './pages/admin/IssueManagement';
import { Analytics } from './pages/admin/Analytics';
import { Departments } from './pages/admin/Departments';
import { NotFound } from './pages/NotFound';

import { useAuth } from './hooks/useAuth';

export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Onboarding, Preface & Auth */}
      <Route path="/preface" element={<Preface />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/auth" element={<Auth />} />

      {/* Citizen Flow (Inside CitizenLayout with Header & BottomNav) */}
      <Route path="/" element={<CitizenLayout />}>
        <Route index element={<Home />} />
        <Route path="report" element={<ReportIssue />} />
        <Route path="issue/:id" element={<IssueDetails />} />
        <Route path="nearby" element={<Nearby />} />
        <Route path="my-reports" element={<MyReports />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="help" element={<Help />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Admin Flow (Inside AdminLayout with Sidebar & Desk Header) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="issues" element={<IssueManagement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="departments" element={<Departments />} />
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<CitizenLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
