import React, { useState } from 'react';
import './EmpCalendar.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EmpCalendar = () => {
  const [activeTab, setActiveTab] = useState('daily'); // 'daily', 'weekly', 'monthly'

  // Standard mock data arrays to generate the May 2026 calendar view
  // May 1st 2026 is a Friday. So Mon=0, Tue=1, Wed=2, Thu=3 are empty.
  const emptyCells = [null, null, null, null];
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="ec-page">
      <div className="ec-card">
        
        {/* TOP TAB NAVIGATION */}
        <div className="ec-tab-nav">
          <button 
            className={`ec-tab-btn ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            📅 Daily
          </button>
          <button 
            className={`ec-tab-btn ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            📊 Weekly
          </button>
          <button 
            className={`ec-tab-btn ${activeTab === 'monthly' ? 'active' : ''}`}
            onClick={() => setActiveTab('monthly')}
          >
            📈 Monthly
          </button>
        </div>

        {/* HEADER SECTION */}
        <div className="ec-header-row">
          <div className="ec-header-left">
            {activeTab === 'daily' && (
              <>
                <h2 className="ec-title">May 2026</h2>
                <p className="ec-subtitle">Total: 0h 1m | Pages: 45</p>
              </>
            )}
            {activeTab === 'weekly' && (
              <>
                <h2 className="ec-title">Week 21, 2026</h2>
                <p className="ec-subtitle">5/18/2026 - 5/24/2026</p>
              </>
            )}
            {activeTab === 'monthly' && (
              <>
                <h2 className="ec-title">May 2026</h2>
                <p className="ec-subtitle">5/1/2026 - 5/31/2026</p>
              </>
            )}
          </div>
          
          <div className="ec-header-right">
            <button className="ec-nav-btn ec-nav-prev">← Prev</button>
            <button className="ec-nav-btn ec-nav-current">
              {activeTab === 'daily' && 'Today'}
              {activeTab === 'weekly' && 'This Week'}
              {activeTab === 'monthly' && 'This Month'}
            </button>
            <button className="ec-nav-btn ec-nav-next">Next →</button>
          </div>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="ec-content">
          
          {/* ----- DAILY VIEW ----- */}
          {activeTab === 'daily' && (
            <div className="ec-daily-view">
              <div className="ec-grid-header">
                {DAYS.map(d => <div key={d} className="ec-grid-hd">{d}</div>)}
              </div>
              <div className="ec-grid-body">
                {emptyCells.map((_, i) => (
                  <div key={`empty-${i}`} className="ec-cell ec-cell-empty"></div>
                ))}
                {daysInMonth.map(day => {
                  let cellClass = "ec-cell";
                  if (day === 18) cellClass += " ec-cell-today";
                  if (day === 11) cellClass += " ec-cell-data";

                  return (
                    <div key={day} className={cellClass}>
                      <span className="ec-day-number">{day}</span>
                      {day === 11 && (
                        <div className="ec-day-details">
                          <span className="ec-day-hours">0h 1m</span>
                          <span className="ec-day-pages">📄 45</span>
                          <span className="ec-day-projects">2 projects</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ----- WEEKLY VIEW ----- */}
          {activeTab === 'weekly' && (
            <div className="ec-summary-view">
              <div className="ec-summary-cards">
                <div className="ec-summary-card">
                  <span className="ec-card-label">Total Hours</span>
                  <span className="ec-card-value">0h 0m</span>
                </div>
                <div className="ec-summary-card">
                  <span className="ec-card-label">📄 Pages</span>
                  <span className="ec-card-value">0</span>
                </div>
                <div className="ec-summary-card">
                  <span className="ec-card-label">Projects</span>
                  <span className="ec-card-value">0</span>
                </div>
              </div>
            </div>
          )}

          {/* ----- MONTHLY VIEW ----- */}
          {activeTab === 'monthly' && (
            <div className="ec-summary-view">
              <div className="ec-summary-cards">
                <div className="ec-summary-card">
                  <span className="ec-card-label">Total Hours</span>
                  <span className="ec-card-value">0h 1m</span>
                </div>
                <div className="ec-summary-card">
                  <span className="ec-card-label">📄 Pages</span>
                  <span className="ec-card-value">45</span>
                </div>
                <div className="ec-summary-card">
                  <span className="ec-card-label">Projects</span>
                  <span className="ec-card-value">2</span>
                </div>
              </div>

              <div className="ec-breakdown-section">
                <h3 className="ec-section-title">Weekly Breakdown</h3>
                <div className="ec-breakdown-card">
                  <div className="ec-bd-top">Week 20</div>
                  <div className="ec-bd-bottom">
                    <span className="ec-bd-hours">0h 1m</span>
                    <span className="ec-bd-pages">📄 45</span>
                  </div>
                </div>
              </div>

              <div className="ec-breakdown-section">
                <h3 className="ec-section-title">Project Breakdown</h3>
                <div className="ec-breakdown-card">
                  <div className="ec-bd-top">ING - OUP</div>
                  <div className="ec-bd-bottom">
                    <span className="ec-bd-hours">0h 0m • 📄 0 pages</span>
                  </div>
                </div>
                <div className="ec-breakdown-card">
                  <div className="ec-bd-top">LDM - Hanser</div>
                  <div className="ec-bd-bottom">
                    <span className="ec-bd-hours">0h 1m • 📄 45 pages</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EmpCalendar;
