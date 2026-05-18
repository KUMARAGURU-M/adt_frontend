// src/components/layouts/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
const menuItems = [
  { name: 'Dashboard',           icon: '📊', path: '/admin/dashboard' },
  { name: 'Users',               icon: '👥', path: '/admin/users' },
  { name: 'Projects',            icon: '📁', path: '/admin/projects' },
  { name: 'Books/Job',           icon: '📖', path: '/admin/books' },
  { name: 'Tasks',               icon: '✅', path: '/admin/tasks' },
  { name: 'Processes',           icon: '⚙️', path: '/admin/processes' },
  { name: 'Shifts',              icon: '🕒', path: '/admin/shifts' },
  { name: 'Tools',              icon: '🕒', path: '/admin/tool' },
  { name: 'Leaves',              icon: '🏖️', path: '/admin/leaves' },
  { name: 'Roles & Permissions', icon: '🔐', path: '/admin/roles' },
  { name: 'Reports',             icon: '📈', path: '/admin/reports' },
  { name: 'Activity Logs',       icon: '📝', path: '/admin/activity-logs' },
  { name: 'Settings',            icon: '🛠️', path: '/admin/settings' },
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