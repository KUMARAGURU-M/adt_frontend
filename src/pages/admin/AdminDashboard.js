// src/pages/admin/AdminDashboard.js

import React from 'react';
import './AdminDashboard.css';

const stats = [
  { title: 'Total Users',    value: '18',    sub: '13 active',    color: '#3182ce' },
  { title: 'Total Projects', value: '10',    sub: '10 active',    color: '#38a169' },
  { title: 'Total Tasks',    value: '100',   sub: 'All tasks',    color: '#d69e2e' },
  { title: 'Total Hours',    value: '411.1', sub: 'Logged time',  color: '#805ad5' },
];

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">

      <div className="dashboard-title-section">
        <span className="dashboard-icon">📊</span>
        <h2 className="dashboard-text">Dashboard</h2>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="stat-card"
            style={{ borderTop: `4px solid ${stat.color}` }}
          >
            <p className="stat-title">{stat.title}</p>
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-sub">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="action-card">
        <h4 className="card-label">Quick Actions</h4>
        <div className="action-buttons">
          <button className="btn btn-primary">+ Add User</button>
          <button className="btn btn-primary">+ Add Project</button>
          <button className="btn btn-primary">+ Add Task</button>
          <button className="btn btn-outline">View Reports</button>
        </div>
      </div>

      <div className="welcome-card">
        <h4 className="card-label">Welcome to the Admin Panel</h4>
        <p className="welcome-desc">
          Use the navigation menu to manage users, projects, tasks, view reports,
          and monitor activity logs.
        </p>
        <p className="footer-credit">Powered by Arrow Data-Tech, Puducherry</p>
      </div>

    </div>
  );
};

export default AdminDashboard;