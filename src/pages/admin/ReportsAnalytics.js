// src/pages/admin/ReportsAnalytics.js

import React, { useState, useMemo } from 'react';
import './ReportsAnalytics.css';

/* ─── Constants ─────────────────────────────────────────────────── */
const ALL_EMPLOYEES = [
  'Employee', 'T. Mohamed Usen', 'Narkis', 'Shakina A',
  'Ayeesha M', 'Gowri', 'Sureka', 'Karthika',
];

const ALL_PROJECTS = [
  'ING - Usen', 'LDM - Hanser', 'ING - OUP', 'LDM - WILEY',
  'LDM - T&F', 'CMT - JATS', 'ING - ACDC', 'CNT', 'IMP - EPUB',
];

/* ─── Seed Time Logs ─────────────────────────────────────────────── */
const seedLogs = [
  { id: 1,  employee: 'Employee',       project: 'ING - OUP',   task: 'CUP1645',                                     startTime: '2026-02-18T23:10:38', endTime: '2026-02-18T23:10:56', durationHrs: 0.01,  pages: 8,   status: 'Completed' },
  { id: 2,  employee: 'Employee',       project: 'ING - OUP',   task: 'CUP1645',                                     startTime: '2026-02-03T11:44:18', endTime: '2026-02-03T11:49:46', durationHrs: 0.09,  pages: 15,  status: 'Completed' },
  { id: 3,  employee: 'Employee',       project: 'ING - Usen',  task: '-',                                           startTime: '2026-02-02T23:59:17', endTime: '2026-02-03T00:00:27', durationHrs: 0.03,  pages: null,status: 'Stopped'   },
  { id: 4,  employee: 'Employee',       project: 'ING - OUP',   task: 'CUP1645',                                     startTime: '2026-02-02T23:52:29', endTime: '2026-02-02T23:52:56', durationHrs: 0.02,  pages: null,status: 'On-Hold'   },
  { id: 5,  employee: 'Employee',       project: 'LDM - Hanser',task: '-',                                           startTime: '2026-02-02T22:48:30', endTime: '2026-02-02T22:57:15', durationHrs: 0.15,  pages: 10,  status: 'Completed' },
  { id: 6,  employee: 'Employee',       project: 'ING - OUP',   task: 'CUP1645',                                     startTime: '2026-02-02T20:35:38', endTime: '2026-02-02T20:50:41', durationHrs: 0.25,  pages: 100, status: 'Completed' },
  { id: 7,  employee: 'Employee',       project: 'LDM - Hanser',task: 'FIG - Croping - 9783446480438 - LDM - Hanser',startTime: '2026-02-02T00:59:26', endTime: '2026-02-02T20:31:19', durationHrs: 19.53, pages: 50,  status: 'Completed' },
  { id: 8,  employee: 'Employee',       project: 'ING - Usen',  task: '-',                                           startTime: '2026-02-02T00:38:19', endTime: '2026-02-02T00:38:36', durationHrs: 0,     pages: 20,  status: 'Stopped'   },
  { id: 9,  employee: 'Employee',       project: 'LDM - Hanser',task: 'FIG - Croping - 9783446480438 - LDM - Hanser',startTime: '2026-02-02T00:37:20', endTime: '2026-02-02T00:37:29', durationHrs: 0,     pages: 10,  status: 'Completed' },
  { id: 10, employee: 'T. Mohamed Usen',project: 'ING - Usen',  task: 'EPUB - QC - 9798881870973 - ING - Usen',      startTime: '2026-01-31T10:00:00', endTime: '2026-01-31T10:00:00', durationHrs: 0,     pages: 10,  status: 'Completed' },
  { id: 11, employee: 'Narkis',         project: 'ING - Usen',  task: 'EPUB - Tagging',                              startTime: '2026-01-30T09:00:00', endTime: '2026-01-30T09:00:00', durationHrs: 0,     pages: 14,  status: 'Completed' },
  /* Extra to hit 411.1 hrs / 795 pages totals */
  { id: 12, employee: 'Employee',       project: 'ING - Usen',  task: 'XML - Tagging',                               startTime: '2026-01-29T08:00:00', endTime: '2026-01-29T08:00:00', durationHrs: 389.5, pages: 363, status: 'Completed' },
  { id: 13, employee: 'Employee',       project: 'LDM - T&F',   task: '-',                                           startTime: '2026-01-20T10:00:00', endTime: '2026-01-20T10:12:00', durationHrs: 0.2,   pages: 37,  status: 'Completed' },
  { id: 14, employee: 'Employee',       project: 'CMT - JATS',  task: 'XML - Tagging',                               startTime: '2026-01-18T14:00:00', endTime: '2026-01-18T14:00:00', durationHrs: 0,     pages: 106, status: 'Completed' },
  { id: 15, employee: 'Employee',       project: 'ING - ACDC',  task: '-',                                           startTime: '2026-01-15T09:00:00', endTime: '2026-01-15T09:00:00', durationHrs: 0,     pages: 18,  status: 'Completed' },
  { id: 16, employee: 'Employee',       project: 'LDM - WILEY', task: '-',                                           startTime: '2026-01-10T11:00:00', endTime: '2026-01-10T11:24:00', durationHrs: 0.4,   pages: null,status: 'Stopped'   },
  { id: 17, employee: 'Employee',       project: 'ING - OUP',   task: 'CUP1645',                                     startTime: '2026-01-08T13:00:00', endTime: '2026-01-08T14:18:00', durationHrs: 1.3,   pages: 123, status: 'Completed' },
  { id: 18, employee: 'Employee',       project: 'LDM - Hanser',task: 'TP25 - 0386',                                 startTime: '2026-01-05T09:00:00', endTime: '2026-01-05T09:00:00', durationHrs: 0,     pages: 10,  status: 'Completed' },
];

/* ─── Format helpers ─────────────────────────────────────────────── */
const fmtDateTime = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  const dd   = String(d.getDate()).padStart(2,'0');
  const mm   = String(d.getMonth()+1).padStart(2,'0');
  const yyyy = d.getFullYear();
  const hh   = String(d.getHours()).padStart(2,'0');
  const min  = String(d.getMinutes()).padStart(2,'0');
  const ss   = String(d.getSeconds()).padStart(2,'0');
  return `${dd}/${mm}/${yyyy}, ${hh}:${min}:${ss}`;
};

const fmtHrs = (h) => {
  if (h === 0) return '0 hrs';
  return `${h % 1 === 0 ? h : h.toFixed(2)} hrs`;
};

const roundHrs = (h) => parseFloat(h.toFixed(1));

/* ─── Stat Card ─────────────────────────────────────────────────── */
const StatCard = ({ label, value, sub, color }) => (
  <div className="ra-stat-card">
    <p className="ra-stat-label">{label}</p>
    <h2 className="ra-stat-value" style={{ color }}>{value}</h2>
    <p className="ra-stat-sub">{sub}</p>
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
const ReportsAnalytics = () => {
  const [startDate,  setStartDate]  = useState('');
  const [endDate,    setEndDate]    = useState('');
  const [fEmployee,  setFEmployee]  = useState('');
  const [fProject,   setFProject]   = useState('');

  /* Applied filters (only set on "Apply Filters" click) */
  const [applied, setApplied] = useState({ startDate:'', endDate:'', employee:'', project:'' });

  const applyFilters = () => setApplied({ startDate, endDate, employee: fEmployee, project: fProject });

  /* ── Filtered logs ── */
  const filteredLogs = useMemo(() => seedLogs.filter(log => {
    if (applied.employee && log.employee !== applied.employee) return false;
    if (applied.project  && log.project  !== applied.project)  return false;
    if (applied.startDate) {
      const logDate = new Date(log.startTime);
      if (logDate < new Date(applied.startDate)) return false;
    }
    if (applied.endDate) {
      const logDate = new Date(log.startTime);
      if (logDate > new Date(applied.endDate + 'T23:59:59')) return false;
    }
    return true;
  }), [applied]);

  const topScrollRef = React.useRef(null);
  const bottomScrollRef = React.useRef(null);

  React.useEffect(() => {
    const topEl = topScrollRef.current;
    const bottomEl = bottomScrollRef.current;
    if (!topEl || !bottomEl) return;

    const resizeObserver = new ResizeObserver(() => {
      const firstChild = bottomEl.firstElementChild;
      if (firstChild) {
        const tableWidth = firstChild.offsetWidth;
        const innerDummy = topEl.firstElementChild;
        if (innerDummy) {
          innerDummy.style.width = `${tableWidth}px`;
        }
      }
    });

    resizeObserver.observe(bottomEl);

    let isSyncingTop = false;
    let isSyncingBottom = false;

    const handleTopScroll = () => {
      if (!isSyncingBottom) {
        isSyncingTop = true;
        bottomEl.scrollLeft = topEl.scrollLeft;
        isSyncingTop = false;
      }
    };

    const handleBottomScroll = () => {
      if (!isSyncingTop) {
        isSyncingBottom = true;
        topEl.scrollLeft = bottomEl.scrollLeft;
        isSyncingBottom = false;
      }
    };

    topEl.addEventListener('scroll', handleTopScroll);
    bottomEl.addEventListener('scroll', handleBottomScroll);

    return () => {
      resizeObserver.disconnect();
      topEl.removeEventListener('scroll', handleTopScroll);
      bottomEl.removeEventListener('scroll', handleBottomScroll);
    };
  }, [filteredLogs]);

  /* ── Summary stats ── */
  const totalHours = useMemo(() =>
    roundHrs(filteredLogs.reduce((s, l) => s + l.durationHrs, 0)),
  [filteredLogs]);

  const totalPages = useMemo(() =>
    filteredLogs.reduce((s, l) => s + (l.pages || 0), 0),
  [filteredLogs]);

  const totalLogs = filteredLogs.length;

  /* ── Hours & Pages by Employee ── */
  const byEmployee = useMemo(() => {
    const map = {};
    filteredLogs.forEach(l => {
      if (!map[l.employee]) map[l.employee] = { hrs: 0, pages: 0 };
      map[l.employee].hrs   += l.durationHrs;
      map[l.employee].pages += (l.pages || 0);
    });
    return Object.entries(map)
      .map(([name, d]) => ({ name, hrs: roundHrs(d.hrs), pages: d.pages }))
      .sort((a, b) => b.hrs - a.hrs);
  }, [filteredLogs]);

  /* ── Hours & Pages by Project ── */
  const byProject = useMemo(() => {
    const map = {};
    filteredLogs.forEach(l => {
      if (!map[l.project]) map[l.project] = { hrs: 0, pages: 0 };
      map[l.project].hrs   += l.durationHrs;
      map[l.project].pages += (l.pages || 0);
    });
    return Object.entries(map)
      .map(([name, d]) => ({ name, hrs: roundHrs(d.hrs), pages: d.pages }))
      .sort((a, b) => b.hrs - a.hrs);
  }, [filteredLogs]);

  /* ── Export CSV ── */
  const exportCSV = () => {
    const headers = ['ID', 'Employee', 'Project', 'Task', 'Start Time', 'End Time', 'Duration (hrs)', 'Pages', 'Status'];
    const rows = filteredLogs.map(l => [
      l.id, `"${l.employee}"`, `"${l.project}"`, `"${l.task}"`,
      fmtDateTime(l.startTime), fmtDateTime(l.endTime),
      l.durationHrs, l.pages ?? '', `"${l.status || '-'}"`
    ].join(','));
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob), download: 'reports.csv',
    });
    a.click(); URL.revokeObjectURL(a.href);
  };

  return (
    <div className="ra-container">

      {/* ── Page Header ── */}
      <div className="ra-page-header">
        <div className="ra-page-title">
          <span className="ra-page-icon">📋</span>
          <h2>Reports &amp; Analytics</h2>
        </div>
        <button className="ra-export-btn" onClick={exportCSV}>
          📤 Export CSV
        </button>
      </div>

      {/* ── Filter Card ── */}
      <div className="ra-filter-card">
        <p className="ra-filter-title">Filters</p>

        <div className="ra-filter-grid">
          {/* Start Date */}
          <div className="ra-filter-group">
            <label>Start Date</label>
            <input
              type="date"
              className="ra-filter-input"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="ra-filter-group">
            <label>End Date</label>
            <input
              type="date"
              className="ra-filter-input"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>

          {/* Employee */}
          <div className="ra-filter-group">
            <label>Employee</label>
            <select
              className="ra-filter-select"
              value={fEmployee}
              onChange={e => setFEmployee(e.target.value)}
            >
              <option value="">All Employees</option>
              {ALL_EMPLOYEES.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          {/* Project */}
          <div className="ra-filter-group">
            <label>Project</label>
            <select
              className="ra-filter-select"
              value={fProject}
              onChange={e => setFProject(e.target.value)}
            >
              <option value="">All Projects</option>
              {ALL_PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <button className="ra-apply-btn" onClick={applyFilters}>
          Apply Filters
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="ra-stats-grid">
        <StatCard
          label="Total Hours"
          value={totalHours}
          sub="Logged time"
          color="#13c6df"
        />
        <StatCard
          label="Total Pages"
          value={totalPages}
          sub="Completed pages"
          color="#f59e0b"
        />
        <StatCard
          label="Total Logs"
          value={totalLogs}
          sub="Time entries"
          color="#10b981"
        />
      </div>

      {/* ── Hours & Pages by Employee ── */}
      <div className="ra-section-card">
        <h3 className="ra-section-title">Hours &amp; Pages by Employee</h3>
        <div className="ra-breakdown-list">
          {byEmployee.length === 0 ? (
            <p className="ra-empty">No data for selected filters.</p>
          ) : byEmployee.map(row => (
            <div key={row.name} className="ra-breakdown-row">
              <span className="ra-breakdown-name">{row.name}</span>
              <div className="ra-breakdown-right">
                <span className="ra-hrs-val">{fmtHrs(row.hrs)}</span>
                <span className="ra-sep">·</span>
                <span className="ra-pages-icon">📄</span>
                <span className="ra-pages-val">{row.pages} pages</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Hours & Pages by Project ── */}
      <div className="ra-section-card">
        <h3 className="ra-section-title">Hours &amp; Pages by Project</h3>
        <div className="ra-breakdown-list">
          {byProject.length === 0 ? (
            <p className="ra-empty">No data for selected filters.</p>
          ) : byProject.map(row => (
            <div key={row.name} className="ra-breakdown-row">
              <span className="ra-breakdown-name">{row.name}</span>
              <div className="ra-breakdown-right">
                {row.hrs > 0 && (
                  <>
                    <span className="ra-hrs-val">{fmtHrs(row.hrs)}</span>
                    <span className="ra-sep">·</span>
                  </>
                )}
                {row.pages > 0 && (
                  <>
                    <span className="ra-pages-icon">📄</span>
                    <span className="ra-pages-val">{row.pages} pages</span>
                  </>
                )}
                {row.hrs === 0 && row.pages === 0 && (
                  <span className="ra-hrs-val">0.0 hrs</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Detailed Time Logs Table ── */}
      <div className="ra-section-card">
        <h3 className="ra-section-title">Detailed Time Logs</h3>

      {/* ── Table Top Scrollbar ── */}
      <div className="double-scroll-top" ref={topScrollRef}>
        <div className="double-scroll-top-inner"></div>
      </div>

      {/* ── Detailed Time Logs Table ── */}
      <div className="ra-table-wrapper" ref={bottomScrollRef}>
          <table className="ra-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Project</th>
                <th>Task</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Pages</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="9" className="ra-table-empty">
                    No time logs found for selected filters.
                  </td>
                </tr>
              ) : filteredLogs.map(log => (
                <tr key={log.id}>
                  <td className="td-id">{log.id}</td>
                  <td className="td-employee col-left">{log.employee}</td>
                  <td className="td-project">
                    <span className="ra-project-tag">{log.project}</span>
                  </td>
                  <td className="td-task">
                    {log.task === '-'
                      ? <span className="ra-dash">-</span>
                      : log.task}
                  </td>
                  <td className="td-time">{fmtDateTime(log.startTime)}</td>
                  <td className="td-time">{fmtDateTime(log.endTime)}</td>
                  <td className="td-duration">
                    <span className={`ra-dur ${log.durationHrs >= 1 ? 'high' : ''}`}>
                      {fmtHrs(log.durationHrs)}
                    </span>
                  </td>
                  <td className="td-pages">
                    {log.pages != null
                      ? <span className="ra-pages-cell" style={{ justifyContent: 'center' }}>
                          <span className="ra-pages-icon-sm">📄</span>
                          {log.pages}
                        </span>
                      : <span className="ra-dash">-</span>}
                  </td>
                  <td className="td-status">
                    <span className={`ra-status-badge ${log.status ? log.status.toLowerCase() : ''}`}>
                      {log.status || '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="ra-table-footer">
          Showing <strong>{filteredLogs.length}</strong> of <strong>{seedLogs.length}</strong> entries
        </div>
      </div>

    </div>
  );
};

export default ReportsAnalytics;