// src/components/layouts/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import toolIcon from '../../img/tools.png';
import timelogIcon from '../../img/timelog.png';
import invoiceIcon from '../../img/invoice.png';
const menuItems = [
  { name: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
  { name: 'Users', icon: '👥', path: '/admin/users' },
  { name: 'Workwise', icon: '🗂️', path: '/admin/workwise' },
  { name: 'Attendance', icon: '📅', path: '/admin/attendance' },
  { name: 'Projects', icon: '📁', path: '/admin/projects' },
  { name: 'Books/Job', icon: '📖', path: '/admin/books' },
  { name: 'Tasks', icon: '✅', path: '/admin/tasks' },
  { name: 'Processes', icon: '⚙️', path: '/admin/processes' },
  { name: 'Shifts', icon: '🕒', path: '/admin/shifts' },
  { name: 'Tools', icon: <img src={toolIcon} alt="Tools" className="sidebar-img-icon" />, path: '/admin/tool' },
  { name: 'Leaves', icon: '🏖️', path: '/admin/leaves' },
  { name: 'Roles & Permissions', icon: '🔐', path: '/admin/roles' },
  { name: 'Reports', icon: '📈', path: '/admin/reports' },
  { name: 'Activity Logs', icon: '📝', path: '/admin/activity-logs' },
  { name: 'Time Log', icon: <img src={timelogIcon} alt="Time Log" className="sidebar-img-icon" />, path: '/admin/timelog' },
  { name: 'Invoices', icon: <img src={invoiceIcon} alt="Invoices" className="sidebar-img-icon" />, path: '/admin/invoices' },
  { name: 'Settings', icon: '🛠️', path: '/admin/settings' },
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