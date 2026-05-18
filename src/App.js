// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

/* ── Layouts ── */
import Sidebar from './components/layouts/Sidebar';
import Header  from './components/layouts/Header';

/* ── Auth ── */
import Login from './pages/auth/Login/Login';

/* ── Employee Portal ── */
import EmpDashboard from './pages/user/EmpDashboard';

/* ── Admin Pages ── */
import AdminDashboard    from './pages/admin/AdminDashboard';
import UserManagement    from './pages/admin/UserManagement';
import Project          from './pages/admin/Project';
import BooksJobs         from './pages/admin/BooksJobs';
import ProcessManagement from './pages/admin/ProcessManagement';
import ShiftManagement   from './pages/admin/ShiftManagement';
import Leaves           from './pages/admin/Leave';
import TaskManagement    from './pages/admin/TaskManagement';
import ReportsAnalytics  from './pages/admin/ReportsAnalytics';
import ActivityLogs      from './pages/admin/ActivityLogs';
import RolesPermission   from './pages/admin/RolesPermission';
import Setting          from './pages/admin/Setting';
import Tools             from './pages/admin/Tools';
import WorkPortal        from './pages/user/WorkPortal';
/* ════════════════════════════════════════════════════════
   Admin Layout Wrapper
   — extracted so each Route doesn't use nested <Routes>
   — fixes the "You cannot render a <Routes> inside another
     <Routes>" warning from React Router v6
════════════════════════════════════════════════════════ */
const AdminLayout = ({ children }) => (
  <div className="app-container">
    <Sidebar />
    <div className="main-wrapper">
      <Header />
      <div className="content-area">
        {children}
      </div>
    </div>
  </div>
);

/* ── Placeholder for sections not yet built ── */
const Placeholder = ({ title }) => (
  <div style={{
    padding: '40px 28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    color: '#718096',
    fontSize: '1rem',
    gap: 12,
  }}>
    <span style={{ fontSize: '2.5rem' }}>🚧</span>
    <strong style={{ color: '#2d3748' }}>{title}</strong>
    <span>This section is coming soon.</span>
  </div>
);

/* ══════════════════════════════════════════
   APP
══════════════════════════════════════════ */
function App() {
  return (
    <Router>
      <Routes>

        {/* ── Default: redirect to login ── */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Public: Login page ── */}
        <Route path="/login" element={<Login />} />

        {/* ── Employee Portal (no sidebar/header) ── */}
        {/* /* ── Employee Portal (no sidebar/header) ── */ }
        <Route path="/employee/dashboard" element={<EmpDashboard />} />

        <Route path="/workportal" element={<WorkPortal />} />
        {/* ════════════════════════════════════
            ADMIN ROUTES
            Each route wraps AdminLayout independently
            — avoids nested <Routes> entirely
        ════════════════════════════════════ */}

        <Route path="/admin/dashboard" element={
          <AdminLayout><AdminDashboard /></AdminLayout>
        } />

        <Route path="/admin/users" element={
          <AdminLayout><UserManagement /></AdminLayout>
        } />

        <Route path="/admin/projects" element={
          <AdminLayout><Project /></AdminLayout>
        } />

        <Route path="/admin/books" element={
          <AdminLayout><BooksJobs /></AdminLayout>
        } />

        <Route path="/admin/tasks" element={
          <AdminLayout><TaskManagement /></AdminLayout>
        } />

        <Route path="/admin/processes" element={
          <AdminLayout><ProcessManagement /></AdminLayout>
        } />

        <Route path="/admin/shifts" element={
          <AdminLayout><ShiftManagement /></AdminLayout>
        } />

        <Route path="/admin/tool" element={
          <AdminLayout><Tools /></AdminLayout>
        } />

        <Route path="/admin/leaves" element={
          <AdminLayout><Leaves /></AdminLayout>
        } />

        <Route path="/admin/roles" element={
          <AdminLayout><RolesPermission /></AdminLayout>
        } />

        <Route path="/admin/reports" element={
          <AdminLayout><ReportsAnalytics /></AdminLayout>
        } />

        <Route path="/admin/activity-logs" element={
          <AdminLayout><ActivityLogs /></AdminLayout>
        } />

        <Route path="/admin/settings" element={
          <AdminLayout><Setting/></AdminLayout>
        } />

        {/* ── Catch-all: back to login ── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;