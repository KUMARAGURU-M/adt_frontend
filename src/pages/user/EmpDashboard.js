// src/pages/employee/EmpDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import EmpHeader from './EmpHeader';
import EmpWorkwise from './EmpWorkwise';
import EmpCalendar from './EmpCalendar';
import EmpTask from './EmpTask';
import EmpLeave from './EmpLeave';
import './EmpDashboard.css';

const TABS = [
  { id: 'workwise', label: 'WorkWise', icon: '➤' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'leaves', label: 'Leaves', icon: '🍃' },
];

const STATS = [
  { key: 'totalHours', label: 'Total Hours' },
  { key: 'pages', label: 'Pages' },
  { key: 'sessions', label: 'Sessions' },
  { key: 'projects', label: 'Projects' },
  { key: 'status', label: 'Status', isStatus: true },
];

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function EmpDashboard() {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('workwise');
  const [now, setNow] = useState(new Date());

  const [summary] = useState({
    totalHours: '0.00',
    pages: 0,
    sessions: 0,
    projects: 0,
    status: 'No Data',
  });

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fmtDate = (d) =>
    `${DAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}, ${d.getFullYear()}`;

  const fmtTime = (d) => {
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    const ap = h >= 12 ? 'pm' : 'am';

    h = h % 12 || 12;

    return `${String(h).padStart(2, '0')}:${m}:${s} ${ap} IST`;
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'workwise': return <EmpWorkwise />;
      case 'calendar': return <EmpCalendar />;
      case 'tasks': return <EmpTask />;
      case 'leaves': return <EmpLeave />;
      default: return <EmpWorkwise />;
    }
  };

  return (
    <div className="emp-dashboard-page">

      {/* Glassmorphism Header */}
      <EmpHeader userName="Employee" />

      <div className="emp-dashboard-body">

        {/* Top bar */}
        <div className="emp-topbar">

          {/* Timestamp */}
          <div className="emp-ts-box">
            <span className="emp-ts-date">{fmtDate(now)}</span>
            <span className="emp-ts-time">{fmtTime(now)}</span>
          </div>

          {/* Tagging Work Portal button */}
          {/* <button
            className="emp-portal-btn"
            onClick={() => navigate('/workportal')}
          >
            🏷️ Tagging Work Portal
          </button> */}

        </div>

        {/* Today's Work Summary */}
        <div className="emp-summary-panel">

          <div className="emp-summary-header">
            <span style={{ fontSize: '1.1rem' }}>📊</span>
            <h2 className="emp-summary-title">Today's Work Summary</h2>
          </div>

          <div className="emp-summary-cards">
            {STATS.map(s => (
              <div className="emp-stat-card" key={s.key}>

                <div className="emp-stat-label">
                  {s.label}
                </div>

                {s.isStatus ? (
                  <div className="emp-stat-status">
                    <span
                      className={`emp-status-dot ${summary.status === 'Running'
                          ? 'active'
                          : summary.status === 'Stopped'
                            ? 'stopped'
                            : ''
                        }`}
                    />
                    {summary.status}
                  </div>
                ) : (
                  <div className="emp-stat-value">
                    {summary[s.key]}
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>

        {/* Tab Nav */}
        <nav className="emp-tab-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`emp-tab-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <div className="emp-tab-panel">
          {renderTab()}
        </div>

      </div>
    </div>
  );
}