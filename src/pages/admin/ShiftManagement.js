// src/pages/admin/ShiftManagement.js

import React, { useState, useMemo } from 'react';
import './ShiftManagement.css';

/* ─── Seed Data ─────────────────────────────────────────────────── */
const seedShifts = [
  // starts empty as shown in screenshot — uncomment to pre-populate
  // { id: 1, name: 'General Shift',  startTime: '09:00', endTime: '18:00', description: 'Standard office hours', active: true,  created: '2025-12-06' },
  // { id: 2, name: 'Morning Shift',  startTime: '06:00', endTime: '14:00', description: '',                      active: true,  created: '2025-12-06' },
  // { id: 3, name: 'Night Shift',    startTime: '22:00', endTime: '06:00', description: '',                      active: true,  created: '2025-12-06' },
];

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

/* ─── Format time helper (24h → 12h AM/PM) ──────────────────────── */
const fmt12 = (t) => {
  if (!t) return '-';
  const [h, m] = t.split(':').map(Number);
  const ampm  = h >= 12 ? 'PM' : 'AM';
  const hour  = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : '-';

/* ─── Modal Overlay ─────────────────────────────────────────────── */
const Modal = ({ onClose, children }) => (
  <div className="sm-modal-overlay" onClick={onClose}>
    <div className="sm-modal-box" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

/* ─── Edit Shift Modal ───────────────────────────────────────────── */
const EditModal = ({ shift, onClose, onUpdate }) => {
  const [name,      setName]      = useState(shift.name);
  const [startTime, setStartTime] = useState(shift.startTime);
  const [endTime,   setEndTime]   = useState(shift.endTime);
  const [desc,      setDesc]      = useState(shift.description);
  const [active,    setActive]    = useState(shift.active);
  const [err,       setErr]       = useState('');

  const handleUpdate = () => {
    if (!name.trim()) { setErr('Shift name is required.'); return; }
    onUpdate({ ...shift, name: name.trim(), startTime, endTime, description: desc, active });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="sm-modal-title">Edit Shift</h2>

      {/* Shift Name */}
      <div className="sm-form-group">
        <label className="sm-form-label">
          Shift Name <span className="sm-req">*</span>
        </label>
        <select
          className={`sm-form-input${err ? ' input-error' : ''}`}
          value={name}
          onChange={e => { setName(e.target.value); setErr(''); }}
        >
          <option value="">Select Shift</option>
          <option value="1st Shift">1st Shift</option>
          <option value="2nd Shift">2nd Shift</option>
          <option value="Night Shift">Night Shift</option>
          <option value="General Shift">General Shift</option>
        </select>
        {err && <p className="sm-form-error">{err}</p>}
      </div>

      {/* Start & End Time */}
      <div className="sm-form-row">
        <div className="sm-form-group">
          <label className="sm-form-label">Start Time</label>
          <input
            type="time"
            className="sm-form-input"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
          />
        </div>
        <div className="sm-form-group">
          <label className="sm-form-label">End Time</label>
          <input
            type="time"
            className="sm-form-input"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
          />
        </div>
      </div>

      {/* Description */}
      <div className="sm-form-group">
        <label className="sm-form-label">Description</label>
        <textarea
          className="sm-form-textarea"
          placeholder="Optional description"
          value={desc}
          rows={4}
          onChange={e => setDesc(e.target.value)}
        />
      </div>

      {/* Active */}
      <div className="sm-check-group">
        <label className="sm-check-label">
          <input
            type="checkbox"
            checked={active}
            onChange={e => setActive(e.target.checked)}
          />
          Active
        </label>
      </div>

      <div className="sm-modal-actions">
        <button className="sm-btn-cancel"  onClick={onClose}>Cancel</button>
        <button className="sm-btn-primary" onClick={handleUpdate}>Update Shift</button>
      </div>
    </Modal>
  );
};

/* ─── Delete Confirm Modal ───────────────────────────────────────── */
const DeleteModal = ({ shift, onClose, onDelete }) => (
  <Modal onClose={onClose}>
    <div className="sm-delete-modal">
      <div className="sm-delete-icon">🗑️</div>
      <h2 className="sm-modal-title">Delete Shift</h2>
      <p className="sm-delete-msg">
        Are you sure you want to delete <strong>"{shift.name}"</strong>?<br />
        This action cannot be undone.
      </p>
      <div className="sm-modal-actions centered">
        <button className="sm-btn-cancel" onClick={onClose}>Cancel</button>
        <button
          className="sm-btn-danger"
          onClick={() => { onDelete(shift.id); onClose(); }}
        >
          Delete
        </button>
      </div>
    </div>
  </Modal>
);

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
const ShiftManagement = () => {
  const [shifts,      setShifts]      = useState(seedShifts);
  const [modal,       setModal]       = useState(null);
  const [showAddForm, setShowAddForm] = useState(true);

  /* Add-form state */
  const [newName,      setNewName]      = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime,   setNewEndTime]   = useState('');
  const [newDesc,      setNewDesc]      = useState('');
  const [newActive,    setNewActive]    = useState(true);
  const [addErr,       setAddErr]       = useState('');

  /* Pagination */
  const [perPage, setPerPage] = useState(25);
  const [page,    setPage]    = useState(1);

  const open  = (type, shift) => setModal({ type, shift });
  const close = ()             => setModal(null);

  /* ── Add ── */
  const handleCreate = () => {
    if (!newName.trim()) { setAddErr('Shift name is required.'); return; }
    const now = new Date().toISOString().split('T')[0];
    setShifts(prev => [
      ...prev,
      {
        id:          Date.now(),
        name:        newName.trim(),
        startTime:   newStartTime,
        endTime:     newEndTime,
        description: newDesc,
        active:      newActive,
        created:     now,
      },
    ]);
    setNewName(''); setNewStartTime(''); setNewEndTime('');
    setNewDesc(''); setNewActive(true); setAddErr('');
  };

  /* ── Update ── */
  const handleUpdate = (updated) =>
    setShifts(prev => prev.map(s => s.id === updated.id ? updated : s));

  /* ── Delete ── */
  const handleDelete = (id) =>
    setShifts(prev => prev.filter(s => s.id !== id));

  /* ── Pagination ── */
  const totalItems = shifts.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIdx   = (page - 1) * perPage;
  const pageRows   = useMemo(
    () => shifts.slice(startIdx, startIdx + perPage),
    [shifts, startIdx, perPage]
  );

  const handlePerPage = (val) => { setPerPage(val); setPage(1); };

  return (
    <div className="sm-container">

      {/* ── Page Header ── */}
      <div className="sm-page-header">
        <div className="sm-page-title">
          <span className="sm-page-icon">🕒</span>
          <h2>Shift Management</h2>
        </div>
        <button
          className="sm-add-header-btn"
          onClick={() => setShowAddForm(v => !v)}
        >
          {showAddForm ? '✕ Close Form' : '+ Add Shift'}
        </button>
      </div>

      {/* ── Add New Shift Card ── */}
      {showAddForm && (
        <div className="sm-add-card">
          <h3 className="sm-add-card-title">Add New Shift</h3>

          {/* Shift Name */}
          <div className="sm-form-group">
            <label className="sm-form-label">
              Shift Name <span className="sm-req">*</span>
            </label>
            <select
              className={`sm-form-input${addErr ? ' input-error' : ''}`}
              value={newName}
              onChange={e => { setNewName(e.target.value); setAddErr(''); }}
            >
              <option value="">Select Shift</option>
              <option value="1st Shift">1st Shift</option>
              <option value="2nd Shift">2nd Shift</option>
              <option value="Night Shift">Night Shift</option>
              <option value="General Shift">General Shift</option>
            </select>
            {addErr && <p className="sm-form-error">{addErr}</p>}
          </div>

          {/* Start Time + End Time side by side */}
          <div className="sm-form-row">
            <div className="sm-form-group">
              <label className="sm-form-label">Start Time</label>
              <input
                type="time"
                className="sm-form-input"
                value={newStartTime}
                onChange={e => setNewStartTime(e.target.value)}
              />
            </div>
            <div className="sm-form-group">
              <label className="sm-form-label">End Time</label>
              <input
                type="time"
                className="sm-form-input"
                value={newEndTime}
                onChange={e => setNewEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="sm-form-group">
            <label className="sm-form-label">Description</label>
            <textarea
              className="sm-form-textarea"
              placeholder="Optional description"
              value={newDesc}
              rows={4}
              onChange={e => setNewDesc(e.target.value)}
            />
          </div>

          {/* Active */}
          <div className="sm-check-group">
            <label className="sm-check-label">
              <input
                type="checkbox"
                checked={newActive}
                onChange={e => setNewActive(e.target.checked)}
              />
              Active
            </label>
          </div>

          <button className="sm-create-btn" onClick={handleCreate}>
            Create Shift
          </button>
        </div>
      )}

      {/* ── All Shifts Table Card ── */}
      <div className="sm-table-card">
        <div className="sm-table-header">
          <h3 className="sm-table-title">All Shifts ({totalItems})</h3>
        </div>

        <div className="sm-table-wrapper">
          {totalItems === 0 ? (
            <div className="sm-empty-state">
              <p>No shifts found. Create your first shift above.</p>
            </div>
          ) : (
            <table className="sm-table">
              <thead>
                <tr>
                  <th className="col-name">Name</th>
                  <th className="col-time">Start Time</th>
                  <th className="col-time">End Time</th>
                  <th className="col-desc">Description</th>
                  <th className="col-status">Status</th>
                  <th className="col-created">Created</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map(shift => (
                  <tr key={shift.id}>
                    <td className="td-name">{shift.name}</td>
                    <td className="td-time">{fmt12(shift.startTime)}</td>
                    <td className="td-time">{fmt12(shift.endTime)}</td>
                    <td className="td-desc">
                      {shift.description || <span className="sm-dash">-</span>}
                    </td>
                    <td>
                      <span className={`sm-status-badge${shift.active ? ' active' : ' inactive'}`}>
                        {shift.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="td-created">{fmtDate(shift.created)}</td>
                    <td>
                      <div className="sm-action-btns">
                        <button
                          className="sm-act-edit"
                          title="Edit Shift"
                          onClick={() => open('edit', shift)}
                        >
                          ✏️
                        </button>
                        <button
                          className="sm-act-del"
                          title="Delete Shift"
                          onClick={() => open('delete', shift)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Pagination Footer (only when rows exist) ── */}
        {totalItems > 0 && (
          <div className="sm-pagination">
            <div className="sm-per-page">
              <span>Items per page:</span>
              <select
                value={perPage}
                onChange={e => handlePerPage(Number(e.target.value))}
              >
                {ITEMS_PER_PAGE_OPTIONS.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="sm-page-info">
              Showing {startIdx + 1} to{' '}
              {Math.min(startIdx + perPage, totalItems)} of {totalItems} items
            </div>

            {totalPages > 1 && (
              <div className="sm-page-nav">
                <button
                  className="sm-nav-btn"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    className={`sm-nav-btn${page === n ? ' active-page' : ''}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  className="sm-nav-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {modal?.type === 'edit'   && (
        <EditModal
          shift={modal.shift}
          onClose={close}
          onUpdate={handleUpdate}
        />
      )}
      {modal?.type === 'delete' && (
        <DeleteModal
          shift={modal.shift}
          onClose={close}
          onDelete={handleDelete}
        />
      )}

    </div>
  );
};

export default ShiftManagement;