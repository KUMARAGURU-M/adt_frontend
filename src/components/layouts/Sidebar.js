// src/components/layouts/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import toolIcon from '../../img/tools.png';
import timelogIcon from '../../img/timelog.png';
import invoiceIcon from '../../img/invoice.png';
const menuItems = [
  { name: 'DASHBOARD', icon: '📊', path: '/admin/dashboard' },
  { name: 'USERS', icon: '👥', path: '/admin/users' },
  { name: 'WORKWISE', icon: '➤', path: '/admin/workwise' },
  { name: 'ATTENDANCE', icon: '📅', path: '/admin/attendance' },
  { name: 'PROJECTS', icon: '📁', path: '/admin/projects' },
  { name: 'BOOKS/JOB', icon: '📖', path: '/admin/books' },
  { name: 'TASKS', icon: '✅', path: '/admin/tasks' },
  { name: 'PROCESSES', icon: '⚙️', path: '/admin/processes' },
  { name: 'SHIFTS', icon: '🕒', path: '/admin/shifts' },
  { name: 'TOOLS', icon: <img src={toolIcon} alt="Tools" className="sidebar-img-icon" />, path: '/admin/tool' },
  { name: 'LEAVES', icon: '🏖️', path: '/admin/leaves' },
  { name: 'ROLES & PERMISSIONS', icon: '🔐', path: '/admin/roles' },
  { name: 'REPORTS', icon: '📈', path: '/admin/reports' },
  { name: 'ACTIVITY LOGS', icon: '📝', path: '/admin/activity-logs' },
  { name: 'TIME LOG', icon: <img src={timelogIcon} alt="Time Log" className="sidebar-img-icon" />, path: '/admin/timelog' },
  { name: 'INVOICES', icon: <img src={invoiceIcon} alt="Invoices" className="sidebar-img-icon" />, path: '/admin/invoices' },
  { name: 'SETTINGS', icon: '🛠️', path: '/admin/settings' },
];
const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {/* ← Left-aligned, two lines via <br /> */}
        <h2 className="brand-name">
          Production<br />Report
        </h2>
        <span className="admin-status">Admin</span>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;