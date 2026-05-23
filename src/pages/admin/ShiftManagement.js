// src/pages/admin/ShiftManagement.js
// Fully correlated: Shifts → Allotment Board → Assignments → Table

import React, { useState, useMemo, useCallback } from 'react';
import './ShiftManagement.css';

/* ─── Constants ─────────────────────────────────────────────────── */
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const EMPLOYEES = [
  { id: 1,  name: 'M. Ayeesha' },
  { id: 2,  name: 'A. Shakina' },
  { id: 3,  name: 'G. Nilai' },
  { id: 4,  name: 'P. Magesh' },
  { id: 5,  name: 'S. Narkis' },
  { id: 6,  name: 'A. Elavarasi' },
  { id: 7,  name: 'Mohana' },
  { id: 8,  name: 'Suleka' },
  { id: 9,  name: 'Jayanthi' },
  { id: 10, name: 'Vasanthi' },
  { id: 11, name: 'Gowri' },
  { id: 12, name: 'Safrin' },
  { id: 13, name: 'Rasheetha' },
  { id: 14, name: 'Thaslima' },
  { id: 15, name: 'Jenifer' },
  { id: 16, name: 'Buela' },
  { id: 17, name: 'Reeta' },
];

const SHIFT_NAME_OPTIONS = ['1st Shift', '2nd Shift', 'Night Shift', 'General Shift'];

/* ─── Helpers ───────────────────────────────────────────────────── */
const fmt12 = (t) => {
  if (!t) return '-';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : '-';

const generateId = () => Date.now() + Math.random();

/* ─── Modal Overlay ─────────────────────────────────────────────── */
const Modal = ({ onClose, children }) => (
  <div className="sm-modal-overlay" onClick={onClose}>
    <div className="sm-modal-box" onClick={(e) => e.stopPropagation()}>
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
      <h2 className="sm-modal-title">✏️ Edit Shift</h2>

      <div className="sm-form-group">
        <label className="sm-form-label">
          Shift Name <span className="sm-req">*</span>
        </label>
        <select
          className={`sm-form-input${err ? ' input-error' : ''}`}
          value={name}
          onChange={(e) => { setName(e.target.value); setErr(''); }}
        >
          <option value="">Select Shift</option>
          {SHIFT_NAME_OPTIONS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        {err && <p className="sm-form-error">{err}</p>}
      </div>

      <div className="sm-form-row">
        <div className="sm-form-group">
          <label className="sm-form-label">Start Time</label>
          <input type="time" className="sm-form-input" value={startTime}
            onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div className="sm-form-group">
          <label className="sm-form-label">End Time</label>
          <input type="time" className="sm-form-input" value={endTime}
            onChange={(e) => setEndTime(e.target.value)} />
        </div>
      </div>

      <div className="sm-form-group">
        <label className="sm-form-label">Description</label>
        <textarea className="sm-form-textarea" placeholder="Optional description"
          value={desc} rows={3} onChange={(e) => setDesc(e.target.value)} />
      </div>

      <div className="sm-check-group">
        <label className="sm-check-label">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Active
        </label>
      </div>

      <div className="sm-modal-actions">
        <button className="sm-btn-cancel" onClick={onClose}>Cancel</button>
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
        This will also remove all allotted employees from this shift.<br />
        <em>This action cannot be undone.</em>
      </p>
      <div className="sm-modal-actions centered">
        <button className="sm-btn-cancel" onClick={onClose}>Cancel</button>
        <button className="sm-btn-danger" onClick={() => { onDelete(shift.id); onClose(); }}>
          Delete
        </button>
      </div>
    </div>
  </Modal>
);

/* ─── Allotment Column ───────────────────────────────────────────── */
/**
 * Each column represents ONE shift (from the shifts list).
 * - Shows shift time range in the header.
 * - Employee dropdown only shows employees not already allotted to ANY shift.
 * - "Assign Shift" finalises the allotment for that shift.
 * - Assigned state is saved back into the shift record (assignedEmployees[]).
 */
const AllotmentColumn = ({
  shift,
  allottedList,
  isAssigned,
  globalAllottedIds,
  onAddEmployee,
  onRemoveEmployee,
  onAssign,
}) => {
  const availableEmployees = EMPLOYEES.filter((e) => !globalAllottedIds.has(e.id));

  return (
    <div className={`sm-allot-column${isAssigned ? ' is-assigned' : ''}`}>
      {/* Header */}
      <div className="sm-allot-header">
        <div className="sm-allot-title-wrapper">
          <h4>{shift.name}</h4>
          <span className="sm-allot-time-range">
            {fmt12(shift.startTime)} – {fmt12(shift.endTime)}
          </span>
          <span className="sm-allot-count">{allottedList.length} Allotted</span>
        </div>
        <div className="sm-allot-header-right">
          <span className={`sm-status-badge${shift.active ? ' active' : ' inactive'}`}>
            {shift.active ? 'Active' : 'Inactive'}
          </span>
          {isAssigned && (
            <span className="sm-allot-badge-success">✓ Assigned</span>
          )}
        </div>
      </div>

      {/* Employee Dropdown */}
      <div className="sm-allot-select-wrapper">
        <select
          className="sm-allot-select"
          value=""
          onChange={(e) => { if (e.target.value) onAddEmployee(shift.id, Number(e.target.value)); }}
          disabled={!shift.active}
        >
          <option value="" disabled>
            {shift.active ? '+ Add Employee' : 'Shift is inactive'}
          </option>
          {availableEmployees.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
          {availableEmployees.length === 0 && (
            <option disabled>All employees allotted</option>
          )}
        </select>
      </div>

      {/* Employee List */}
      <div className="sm-shift-box">
        {allottedList.length === 0 ? (
          <div className="sm-shift-empty">
            <span>No employees allotted</span>
          </div>
        ) : (
          <div className="sm-shift-list">
            {allottedList.map((emp) => (
              <div key={emp.id} className="sm-shift-item">
                <span className="sm-shift-item-avatar">👤</span>
                <span className="sm-shift-item-name">{emp.name}</span>
                <button
                  type="button"
                  className="sm-shift-item-remove"
                  onClick={() => onRemoveEmployee(shift.id, emp.id)}
                  title={`Remove ${emp.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Button */}
      <div className="sm-allot-actions">
        <button
          type="button"
          className={`sm-assign-btn${isAssigned ? ' btn-success' : ''}`}
          onClick={() => onAssign(shift.id)}
          disabled={allottedList.length === 0 || !shift.active}
          title={
            !shift.active
              ? 'Shift is inactive'
              : allottedList.length === 0
              ? 'Add at least one employee'
              : ''
          }
        >
          {isAssigned ? '✓ Saved & Assigned' : '💾 Assign Shift'}
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
const ShiftManagement = () => {
  /* ── Shifts State
   *  Each shift: { id, name, startTime, endTime, description, active, created, assignedEmployees[] }
   *  assignedEmployees is set when user clicks "Assign Shift" in the allotment board.
   */
  const [shifts, setShifts] = useState([]);

  /* ── Modal State ── */
  const [modal, setModal] = useState(null); // { type: 'edit'|'delete', shift }

  /* ── Add-form State ── */
  const [showAddForm, setShowAddForm] = useState(true);
  const [newName,      setNewName]      = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime,   setNewEndTime]   = useState('');
  const [newDesc,      setNewDesc]      = useState('');
  const [newActive,    setNewActive]    = useState(true);
  const [addErr,       setAddErr]       = useState('');

  /* ── Pagination State ── */
  const [perPage, setPerPage] = useState(25);
  const [page,    setPage]    = useState(1);

  /**
   * allotments: { [shiftId]: Employee[] }
   * Tracks the working (unsaved) employee list per shift in the allotment board.
   * When "Assign Shift" is clicked, this is committed into shift.assignedEmployees.
   */
  const [allotments, setAllotments] = useState({});

  /**
   * assignedFlags: { [shiftId]: boolean }
   * True once the user has clicked "Assign Shift" without subsequent edits.
   */
  const [assignedFlags, setAssignedFlags] = useState({});

  /* ─── Derived: all employee IDs currently in any allotment column ─── */
  const globalAllottedIds = useMemo(() => {
    const ids = new Set();
    Object.values(allotments).forEach((list) =>
      list.forEach((emp) => ids.add(emp.id))
    );
    return ids;
  }, [allotments]);

  /* ─── Shift CRUD ─────────────────────────────────────────────── */
  const handleCreate = () => {
    if (!newName.trim()) { setAddErr('Please select a shift name.'); return; }
    const id = generateId();
    const now = new Date().toISOString().split('T')[0];
    const newShift = {
      id,
      name:        newName.trim(),
      startTime:   newStartTime,
      endTime:     newEndTime,
      description: newDesc,
      active:      newActive,
      created:     now,
      assignedEmployees: [],
    };
    setShifts((prev) => [...prev, newShift]);
    /* Initialise an empty allotment slot for this shift */
    setAllotments((prev) => ({ ...prev, [id]: [] }));
    setAssignedFlags((prev) => ({ ...prev, [id]: false }));
    /* Reset form */
    setNewName(''); setNewStartTime(''); setNewEndTime('');
    setNewDesc(''); setNewActive(true); setAddErr('');
  };

  const handleUpdate = useCallback((updated) => {
    setShifts((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    /* If the name changed, keep allotments intact — keyed by id, not name */
    /* Mark as needing re-assignment since shift details changed */
    setAssignedFlags((prev) => ({ ...prev, [updated.id]: false }));
  }, []);

  const handleDelete = useCallback((id) => {
    setShifts((prev) => prev.filter((s) => s.id !== id));
    /* Clean up allotments and flags for deleted shift */
    setAllotments((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setAssignedFlags((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  /* ─── Allotment Board Actions ────────────────────────────────── */
  const handleAddEmployee = useCallback((shiftId, empId) => {
    const emp = EMPLOYEES.find((e) => e.id === empId);
    if (!emp) return;
    setAllotments((prev) => ({
      ...prev,
      [shiftId]: [...(prev[shiftId] || []), emp],
    }));
    /* Editing allotments un-saves the assignment */
    setAssignedFlags((prev) => ({ ...prev, [shiftId]: false }));
  }, []);

  const handleRemoveEmployee = useCallback((shiftId, empId) => {
    setAllotments((prev) => ({
      ...prev,
      [shiftId]: (prev[shiftId] || []).filter((e) => e.id !== empId),
    }));
    setAssignedFlags((prev) => ({ ...prev, [shiftId]: false }));
  }, []);

  /**
   * handleAssign: commits the current allotment list into the shift record
   * so the table (and any downstream view) can read shift.assignedEmployees.
   */
  const handleAssign = useCallback((shiftId) => {
    const employees = allotments[shiftId] || [];
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId ? { ...s, assignedEmployees: employees } : s
      )
    );
    setAssignedFlags((prev) => ({ ...prev, [shiftId]: true }));
  }, [allotments]);

  /* ─── Pagination ─────────────────────────────────────────────── */
  const totalItems = shifts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const safePage   = Math.min(page, totalPages);
  const startIdx   = (safePage - 1) * perPage;
  const pageRows   = useMemo(
    () => shifts.slice(startIdx, startIdx + perPage),
    [shifts, startIdx, perPage]
  );

  const handlePerPage = (val) => { setPerPage(val); setPage(1); };

  const open  = (type, shift) => setModal({ type, shift });
  const close = ()             => setModal(null);

  /* ─── Active shifts for the allotment board ──────────────────── */
  /* We show ALL shifts in the board, active or not — inactive ones
     disable the dropdown and assign button to prevent changes.     */

  return (
    <div className="sm-container">

      {/* ══ Page Header ══════════════════════════════════════════ */}
      <div className="sm-page-header">
        <div className="sm-page-title">
          <span className="sm-page-icon">🕒</span>
          <h2>Shift Management</h2>
        </div>
        <button
          className="sm-add-header-btn"
          onClick={() => setShowAddForm((v) => !v)}
        >
          {showAddForm ? '✕ Close Form' : '+ Add Shift'}
        </button>
      </div>

      {/* ══ Add New Shift ════════════════════════════════════════ */}
      {showAddForm && (
        <div className="sm-add-card">
          <h3 className="sm-add-card-title">Add New Shift</h3>

          <div className="sm-form-group">
            <label className="sm-form-label">
              Shift Name <span className="sm-req">*</span>
            </label>
            <select
              className={`sm-form-input${addErr ? ' input-error' : ''}`}
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setAddErr(''); }}
            >
              <option value="">Select Shift</option>
              {SHIFT_NAME_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            {addErr && <p className="sm-form-error">{addErr}</p>}
          </div>

          <div className="sm-form-row">
            <div className="sm-form-group">
              <label className="sm-form-label">Start Time</label>
              <input type="time" className="sm-form-input" value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)} />
            </div>
            <div className="sm-form-group">
              <label className="sm-form-label">End Time</label>
              <input type="time" className="sm-form-input" value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)} />
            </div>
          </div>

          <div className="sm-form-group">
            <label className="sm-form-label">Description</label>
            <textarea
              className="sm-form-textarea"
              placeholder="Optional description"
              value={newDesc}
              rows={3}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>

          <div className="sm-check-group">
            <label className="sm-check-label">
              <input type="checkbox" checked={newActive}
                onChange={(e) => setNewActive(e.target.checked)} />
              Active
            </label>
          </div>

          <button className="sm-create-btn" onClick={handleCreate}>
            ＋ Create Shift
          </button>
        </div>
      )}

      {/* ══ Allotment Board ══════════════════════════════════════
       *  Only rendered when at least one shift exists.
       *  Columns are generated FROM the shifts list — no hardcoding.
       ═══════════════════════════════════════════════════════════ */}
      {shifts.length > 0 && (
        <div className="sm-allot-card">
          <div className="sm-allot-card-header">
            <h3 className="sm-allot-card-title">
              <span className="sm-allot-card-icon">👥</span>
              Shift Allotment &amp; Assignment Board
            </h3>
            <p className="sm-allot-card-subtitle">
              Select employees for each shift, then click <strong>Assign Shift</strong> to save.
              Editing allotments un-saves the assignment until you re-assign.
            </p>
          </div>

          <div
            className="sm-allot-grid"
            style={{
              gridTemplateColumns: `repeat(${Math.min(shifts.length, 4)}, 1fr)`,
            }}
          >
            {shifts.map((shift) => (
              <AllotmentColumn
                key={shift.id}
                shift={shift}
                allottedList={allotments[shift.id] || []}
                isAssigned={!!assignedFlags[shift.id]}
                globalAllottedIds={globalAllottedIds}
                onAddEmployee={handleAddEmployee}
                onRemoveEmployee={handleRemoveEmployee}
                onAssign={handleAssign}
              />
            ))}
          </div>
        </div>
      )}

      {/* ══ All Shifts Table ═════════════════════════════════════ */}
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
                  <th className="col-assigned">Assigned Employees</th>
                  <th className="col-created">Created</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((shift) => (
                  <tr key={shift.id}>
                    <td className="td-name col-left">{shift.name}</td>
                    <td className="td-time">{fmt12(shift.startTime)}</td>
                    <td className="td-time">{fmt12(shift.endTime)}</td>
                    <td className="td-desc">
                      {shift.description || <span className="sm-dash">—</span>}
                    </td>
                    <td>
                      <span className={`sm-status-badge${shift.active ? ' active' : ' inactive'}`}>
                        {shift.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="td-assigned">
                      {shift.assignedEmployees && shift.assignedEmployees.length > 0 ? (
                        <div className="sm-assigned-chips">
                          {shift.assignedEmployees.slice(0, 3).map((emp) => (
                            <span key={emp.id} className="sm-chip">{emp.name}</span>
                          ))}
                          {shift.assignedEmployees.length > 3 && (
                            <span className="sm-chip sm-chip-more">
                              +{shift.assignedEmployees.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="sm-dash sm-not-assigned">Not assigned</span>
                      )}
                    </td>
                    <td className="td-created">{fmtDate(shift.created)}</td>
                    <td>
                      <div className="sm-action-btns">
                        <button className="sm-act-edit" title="Edit Shift"
                          onClick={() => open('edit', shift)}>✏️</button>
                        <button className="sm-act-del" title="Delete Shift"
                          onClick={() => open('delete', shift)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="sm-pagination">
            <div className="sm-per-page">
              <span>Items per page:</span>
              <select value={perPage} onChange={(e) => handlePerPage(Number(e.target.value))}>
                {ITEMS_PER_PAGE_OPTIONS.map((n) => (
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
                <button className="sm-nav-btn" disabled={safePage === 1}
                  onClick={() => setPage((p) => p - 1)}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    className={`sm-nav-btn${safePage === n ? ' active-page' : ''}`}
                    onClick={() => setPage(n)}
                  >{n}</button>
                ))}
                <button className="sm-nav-btn" disabled={safePage === totalPages}
                  onClick={() => setPage((p) => p + 1)}>›</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ Modals ════════════════════════════════════════════════ */}
      {modal?.type === 'edit' && (
        <EditModal shift={modal.shift} onClose={close} onUpdate={handleUpdate} />
      )}
      {modal?.type === 'delete' && (
        <DeleteModal shift={modal.shift} onClose={close} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default ShiftManagement;