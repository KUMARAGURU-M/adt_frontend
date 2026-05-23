// src/pages/admin/ActivityLogs.js

import React, { useState, useMemo } from 'react';
import './ActivityLogs.css';

/* ─── Constants ─────────────────────────────────────────────────── */
const ENTITY_TYPES  = ['Employee', 'Project', 'Task', 'TimeLog'];
const ACTION_TYPES  = ['Create', 'Update', 'Delete', 'Login', 'Logout'];
const ITEMS_OPTIONS = [10, 25, 50, 100];

/* ─── Seed Data ─────────────────────────────────────────────────── */
const seedLogs = [
  { id:  1, timestamp: '2026-05-15T10:08:49', user: 'T. Mohamed Usen', action: 'Login',  entityType: 'Employee', entity: 'T. Mohamed Usen', changes: '-', ip: '10.92.0.19' },
  { id:  2, timestamp: '2026-05-14T15:19:16', user: 'T. Mohamed Usen', action: 'Login',  entityType: 'Employee', entity: 'T. Mohamed Usen', changes: '-', ip: '10.92.0.28' },
  { id:  3, timestamp: '2026-05-14T14:27:52', user: 'Employee',        action: 'Login',  entityType: 'Employee', entity: 'Employee',        changes: '-', ip: '10.92.0.19' },
  { id:  4, timestamp: '2026-05-14T14:27:29', user: 'T. Mohamed Usen', action: 'Login',  entityType: 'Employee', entity: 'T. Mohamed Usen', changes: '-', ip: '10.92.0.19' },
  { id:  5, timestamp: '2026-05-14T14:26:34', user: 'Employee',        action: 'Login',  entityType: 'Employee', entity: 'Employee',        changes: '-', ip: '10.92.0.28' },
  { id:  6, timestamp: '2026-05-14T13:30:50', user: 'T. Mohamed Usen', action: 'Login',  entityType: 'Employee', entity: 'T. Mohamed Usen', changes: '-', ip: '10.92.0.28' },
  { id:  7, timestamp: '2026-05-14T13:29:39', user: 'Employee',        action: 'Login',  entityType: 'Employee', entity: 'Employee',        changes: '-', ip: '10.92.0.28' },
  { id:  8, timestamp: '2026-05-14T10:13:21', user: 'T. Mohamed Usen', action: 'Login',  entityType: 'Employee', entity: 'T. Mohamed Usen', changes: '-', ip: '10.92.0.19' },
  { id:  9, timestamp: '2026-05-14T10:04:09', user: 'T. Mohamed Usen', action: 'Login',  entityType: 'Employee', entity: 'T. Mohamed Usen', changes: '-', ip: '10.92.0.28' },
  { id: 10, timestamp: '2026-05-13T21:38:04', user: 'T. Mohamed Usen', action: 'Login',  entityType: 'Employee', entity: 'T. Mohamed Usen', changes: '-', ip: '10.92.0.28' },
  { id: 11, timestamp: '2026-05-13T09:15:00', user: 'T. Mohamed Usen', action: 'Create', entityType: 'Project',  entity: 'ING - ACDC',      changes: 'Created new project', ip: '10.92.0.19' },
  { id: 12, timestamp: '2026-05-12T14:30:22', user: 'T. Mohamed Usen', action: 'Update', entityType: 'Task',     entity: 'EPUB - Tagging',  changes: 'Status: pending → completed', ip: '10.92.0.28' },
  { id: 13, timestamp: '2026-05-12T11:05:44', user: 'Employee',        action: 'Login',  entityType: 'Employee', entity: 'Employee',        changes: '-', ip: '10.92.0.19' },
  { id: 14, timestamp: '2026-05-11T16:42:10', user: 'Shakina A',       action: 'Login',  entityType: 'Employee', entity: 'Shakina A',       changes: '-', ip: '10.92.0.28' },
  { id: 15, timestamp: '2026-05-11T09:00:33', user: 'T. Mohamed Usen', action: 'Delete', entityType: 'Task',     entity: 'Old Task',        changes: 'Deleted task record',  ip: '10.92.0.19' },
  { id: 16, timestamp: '2026-05-10T18:55:01', user: 'Ayeesha M',       action: 'Logout', entityType: 'Employee', entity: 'Ayeesha M',       changes: '-', ip: '10.92.0.28' },
  { id: 17, timestamp: '2026-05-10T10:20:15', user: 'T. Mohamed Usen', action: 'Update', entityType: 'Employee', entity: 'Sureka',          changes: 'Shift: General Shift → Night Shift', ip: '10.92.0.19' },
  { id: 18, timestamp: '2026-05-09T08:30:45', user: 'T. Mohamed Usen', action: 'Create', entityType: 'TimeLog',  entity: 'TimeLog #4521',   changes: 'Logged 2.5 hrs on ING-OUP', ip: '10.92.0.28' },
];

/* ─── Format timestamp: DD/MM/YYYY, HH:MM:SS ────────────────────── */
const fmtTimestamp = (iso) => {
  const d   = new Date(iso);
  const dd  = String(d.getDate()).padStart(2,'0');
  const mm  = String(d.getMonth()+1).padStart(2,'0');
  const yr  = d.getFullYear();
  const hh  = String(d.getHours()).padStart(2,'0');
  const min = String(d.getMinutes()).padStart(2,'0');
  const ss  = String(d.getSeconds()).padStart(2,'0');
  return `${dd}/${mm}/${yr}, ${hh}:${min}:${ss}`;
};

/* ─── Action Badge ───────────────────────────────────────────────── */
const ActionBadge = ({ action }) => (
  <span className={`al-action-badge al-action-${action.toLowerCase()}`}>
    {action.toUpperCase()}
  </span>
);

/* ─── Entity Type Badge ─────────────────────────────────────────── */
const EntityBadge = ({ type }) => (
  <span className="al-entity-badge">{type.toLowerCase()}</span>
);

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
const ActivityLogs = () => {
  /* Filter state */
  const [fEntityType, setFEntityType] = useState('');
  const [fAction,     setFAction]     = useState('');
  const [applied,     setApplied]     = useState({ entityType: '', action: '' });

  /* Pagination */
  const [perPage, setPerPage] = useState(10);
  const [page,    setPage]    = useState(1);

  /* Apply */
  const handleApply = () => {
    setApplied({ entityType: fEntityType, action: fAction });
    setPage(1);
  };

  /* Filtered rows */
  const filtered = useMemo(() => seedLogs.filter(log => {
    if (applied.entityType && log.entityType !== applied.entityType) return false;
    if (applied.action     && log.action     !== applied.action)     return false;
    return true;
  }), [applied]);

  /* Pagination math */
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const safePage   = Math.min(page, totalPages);
  const startIdx   = (safePage - 1) * perPage;
  const pageRows   = useMemo(
    () => filtered.slice(startIdx, startIdx + perPage),
    [filtered, startIdx, perPage]
  );

  const goTo = (p) => setPage(Math.max(1, Math.min(p, totalPages)));
  const handlePerPage = (val) => { setPerPage(val); setPage(1); };

  /* Page number buttons — show max 5 */
  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }, [totalPages]);

  return (
    <div className="al-container">

      {/* ── Page Header ── */}
      <div className="al-page-header">
        <div className="al-page-title">
          <span className="al-page-icon">📋</span>
          <h2>Activity Logs</h2>
        </div>
      </div>

      {/* ── Filter Card ── */}
      <div className="al-filter-card">
        <p className="al-filter-title">Filters</p>

        {/* Two-column filter grid — Entity Type | Action */}
        <div className="al-filter-grid">
          <div className="al-filter-group">
            <label>Entity Type</label>
            <select
              className="al-filter-select"
              value={fEntityType}
              onChange={e => setFEntityType(e.target.value)}
            >
              <option value="">All Types</option>
              {ENTITY_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="al-filter-group">
            <label>Action</label>
            <select
              className="al-filter-select"
              value={fAction}
              onChange={e => setFAction(e.target.value)}
            >
              <option value="">All Actions</option>
              {ACTION_TYPES.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="al-apply-btn" onClick={handleApply}>
          Apply Filters
        </button>
      </div>

      {/* ── Table Card ── */}
      <div className="al-table-card">
        <div className="al-table-wrapper">
          <table className="al-table">
            <thead>
              <tr>
                <th className="col-ts">Timestamp</th>
                <th className="col-user">User</th>
                <th className="col-action">Action</th>
                <th className="col-entity-type">Entity Type</th>
                <th className="col-entity">Entity</th>
                <th className="col-changes">Changes</th>
                <th className="col-ip">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="al-empty">
                    No activity logs found for selected filters.
                  </td>
                </tr>
              ) : pageRows.map(log => (
                <tr key={log.id}>
                  <td className="td-ts">{fmtTimestamp(log.timestamp)}</td>
                  <td className="td-user col-left">{log.user}</td>
                  <td className="td-action"><ActionBadge action={log.action} /></td>
                  <td className="td-entity-type"><EntityBadge type={log.entityType} /></td>
                  <td className="td-entity col-left">{log.entity}</td>
                  <td className="td-changes">
                    {log.changes === '-'
                      ? <span className="al-dash">-</span>
                      : <span className="al-changes-text">{log.changes}</span>}
                  </td>
                  <td className="td-ip">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Footer ── */}
        <div className="al-pagination">
          {/* Items per page */}
          <div className="al-per-page">
            <span>Items per page:</span>
            <select
              value={perPage}
              onChange={e => handlePerPage(Number(e.target.value))}
            >
              {ITEMS_OPTIONS.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Showing X to Y of Z */}
          <div className="al-page-info">
            {totalItems === 0
              ? 'No items'
              : `Showing ${startIdx + 1} to ${Math.min(startIdx + perPage, totalItems)} of ${totalItems} items`}
          </div>

          {/* Page nav buttons — «  «  1  2  »  » */}
          <div className="al-page-nav">
            {/* First */}
            <button
              className="al-nav-btn al-nav-edge"
              title="First page"
              disabled={safePage === 1}
              onClick={() => goTo(1)}
            >
              «
            </button>
            {/* Prev */}
            <button
              className="al-nav-btn"
              title="Previous page"
              disabled={safePage === 1}
              onClick={() => goTo(safePage - 1)}
            >
              ‹
            </button>

            {/* Numbered pages */}
            {pageNumbers.map(n => (
              <button
                key={n}
                className={`al-nav-btn${safePage === n ? ' al-active-page' : ''}`}
                onClick={() => goTo(n)}
              >
                {n}
              </button>
            ))}

            {/* Next */}
            <button
              className="al-nav-btn"
              title="Next page"
              disabled={safePage === totalPages}
              onClick={() => goTo(safePage + 1)}
            >
              ›
            </button>
            {/* Last */}
            <button
              className="al-nav-btn al-nav-edge"
              title="Last page"
              disabled={safePage === totalPages}
              onClick={() => goTo(totalPages)}
            >
              »
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ActivityLogs;