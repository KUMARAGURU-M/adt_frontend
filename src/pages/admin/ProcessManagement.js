// src/pages/admin/ProcessManagement.js

import React, { useState, useMemo } from 'react';
import './ProcessManagement.css';

/* ─── Seed Data ─────────────────────────────────────────────────── */
const seedProcesses = [
  { id: 1,  name: 'EPUB - QC Process',       description: '', active: true,  created: '2025-12-06' },
  { id: 2,  name: 'EPUB - Tagging',           description: '', active: true,  created: '2025-12-06' },
  { id: 3,  name: 'FIG - Croping',            description: '', active: true,  created: '2025-12-06' },
  { id: 4,  name: 'INDEX - Process',          description: '', active: true,  created: '2025-12-06' },
  { id: 5,  name: 'MATH - Keying',            description: '', active: true,  created: '2025-12-06' },
  { id: 6,  name: 'OCR - Process',            description: '', active: true,  created: '2026-02-01' },
  { id: 7,  name: 'Proof Reading - Process',  description: '', active: true,  created: '2026-02-01' },
  { id: 8,  name: 'REF - Process',            description: '', active: true,  created: '2025-12-06' },
  { id: 9,  name: 'TABLE - Process',          description: '', active: true,  created: '2025-12-06' },
  { id: 10, name: 'VALID - Process',          description: '', active: true,  created: '2025-12-06' },
  { id: 11, name: 'WORD - QC Process',        description: '', active: true,  created: '2025-12-06' },
  { id: 12, name: 'WORD - Styling',           description: '', active: true,  created: '2025-12-06' },
  { id: 13, name: 'XML - QC Process',         description: '', active: true,  created: '2025-12-06' },
  { id: 14, name: 'XML - Tagging',            description: '', active: true,  created: '2025-12-06' },
];

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

/* ─── Shared Modal Overlay ──────────────────────────────────────── */
const Modal = ({ onClose, children }) => (
  <div className="pm-modal-overlay" onClick={onClose}>
    <div className="pm-modal-box" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

/* ─── Edit Process Modal ─────────────────────────────────────────── */
const EditModal = ({ process, onClose, onUpdate }) => {
  const [name,   setName]   = useState(process.name);
  const [desc,   setDesc]   = useState(process.description);
  const [active, setActive] = useState(process.active);
  const [err,    setErr]    = useState('');

  const handleUpdate = () => {
    if (!name.trim()) { setErr('Process name is required.'); return; }
    onUpdate({ ...process, name: name.trim(), description: desc, active });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="pm-modal-title">Edit Process</h2>

      <div className="pm-form-group">
        <label className="pm-form-label">
          Process Name <span className="pm-req">*</span>
        </label>
        <input
          className={`pm-form-input${err ? ' input-error' : ''}`}
          placeholder="e.g., XML - Tagging"
          value={name}
          onChange={e => { setName(e.target.value); setErr(''); }}
        />
        {err && <p className="pm-form-error">{err}</p>}
      </div>

      <div className="pm-form-group">
        <label className="pm-form-label">Description</label>
        <textarea
          className="pm-form-textarea"
          placeholder="Optional description"
          value={desc}
          rows={4}
          onChange={e => setDesc(e.target.value)}
        />
      </div>

      <div className="pm-check-group">
        <label className="pm-check-label">
          <input
            type="checkbox"
            checked={active}
            onChange={e => setActive(e.target.checked)}
          />
          Active
        </label>
      </div>

      <div className="pm-modal-actions">
        <button className="pm-btn-cancel"  onClick={onClose}>Cancel</button>
        <button className="pm-btn-primary" onClick={handleUpdate}>Update Process</button>
      </div>
    </Modal>
  );
};

/* ─── Delete Confirm Modal ───────────────────────────────────────── */
const DeleteModal = ({ process, onClose, onDelete }) => (
  <Modal onClose={onClose}>
    <div className="pm-delete-modal">
      <div className="pm-delete-icon">🗑️</div>
      <h2 className="pm-modal-title">Delete Process</h2>
      <p className="pm-delete-msg">
        Are you sure you want to delete <strong>"{process.name}"</strong>?<br />
        This action cannot be undone.
      </p>
      <div className="pm-modal-actions centered">
        <button className="pm-btn-cancel" onClick={onClose}>Cancel</button>
        <button
          className="pm-btn-danger"
          onClick={() => { onDelete(process.id); onClose(); }}
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
const ProcessManagement = () => {
  const [processes,   setProcesses]   = useState(seedProcesses);
  const [modal,       setModal]       = useState(null); // { type, process }

  /* Add-form state */
  const [showAddForm, setShowAddForm] = useState(true);
  const [newName,     setNewName]     = useState('');
  const [newDesc,     setNewDesc]     = useState('');
  const [newActive,   setNewActive]   = useState(true);
  const [addErr,      setAddErr]      = useState('');

  /* Pagination */
  const [perPage,  setPerPage]  = useState(25);
  const [page,     setPage]     = useState(1);

  /* ── Helpers ── */
  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : '-';

  const open  = (type, process) => setModal({ type, process });
  const close = ()               => setModal(null);

  /* ── Add ── */
  const handleCreate = () => {
    if (!newName.trim()) { setAddErr('Process name is required.'); return; }
    const now = new Date().toISOString().split('T')[0];
    setProcesses(prev => [
      ...prev,
      { id: Date.now(), name: newName.trim(), description: newDesc, active: newActive, created: now },
    ]);
    setNewName(''); setNewDesc(''); setNewActive(true); setAddErr('');
  };

  /* ── Update ── */
  const handleUpdate = (updated) =>
    setProcesses(prev => prev.map(p => p.id === updated.id ? updated : p));

  /* ── Delete ── */
  const handleDelete = (id) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
  };

  /* ── Pagination ── */
  const totalItems  = processes.length;
  const totalPages  = Math.ceil(totalItems / perPage);
  const startIdx    = (page - 1) * perPage;
  const pageRows    = useMemo(
    () => processes.slice(startIdx, startIdx + perPage),
    [processes, startIdx, perPage]
  );

  const handlePerPage = (val) => { setPerPage(val); setPage(1); };

  return (
    <div className="pm-container">

      {/* ── Page Header ── */}
      <div className="pm-page-header">
        <div className="pm-page-title">
          <span className="pm-page-icon">⚙️</span>
          <h2>Process Management</h2>
        </div>
        <button
          className="pm-add-header-btn"
          onClick={() => setShowAddForm(v => !v)}
        >
          {showAddForm ? '✕ Close Form' : '+ Add Process'}
        </button>
      </div>

      {/* ── Add New Process Form Card ── */}
      {showAddForm && (
        <div className="pm-add-card">
          <h3 className="pm-add-card-title">Add New Process</h3>

          <div className="pm-form-group">
            <label className="pm-form-label">
              Process Name <span className="pm-req">*</span>
            </label>
            <input
              className={`pm-form-input${addErr ? ' input-error' : ''}`}
              placeholder="e.g., XML - Tagging"
              value={newName}
              onChange={e => { setNewName(e.target.value); setAddErr(''); }}
            />
            {addErr && <p className="pm-form-error">{addErr}</p>}
          </div>

          <div className="pm-form-group">
            <label className="pm-form-label">Description</label>
            <textarea
              className="pm-form-textarea"
              placeholder="Optional description"
              value={newDesc}
              rows={4}
              onChange={e => setNewDesc(e.target.value)}
            />
          </div>

          <div className="pm-check-group">
            <label className="pm-check-label">
              <input
                type="checkbox"
                checked={newActive}
                onChange={e => setNewActive(e.target.checked)}
              />
              Active
            </label>
          </div>

          <button className="pm-create-btn" onClick={handleCreate}>
            Create Process
          </button>
        </div>
      )}

      {/* ── All Processes Table Card ── */}
      <div className="pm-table-card">
        <div className="pm-table-header">
          <h3 className="pm-table-title">
            All Processes ({totalItems})
          </h3>
        </div>

        <div className="pm-table-wrapper">
          <table className="pm-table">
            <thead>
              <tr>
                <th className="col-name">Name</th>
                <th className="col-desc">Description</th>
                <th className="col-status">Status</th>
                <th className="col-created">Created</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="pm-empty">No processes found.</td>
                </tr>
              ) : pageRows.map(proc => (
                <tr key={proc.id}>
                  <td className="td-name">{proc.name}</td>
                  <td className="td-desc">
                    {proc.description || <span className="pm-dash">-</span>}
                  </td>
                  <td>
                    <span className={`pm-status-badge${proc.active ? ' active' : ' inactive'}`}>
                      {proc.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="td-created">{fmt(proc.created)}</td>
                  <td>
                    <div className="pm-action-btns">
                      <button
                        className="pm-act-edit"
                        title="Edit Process"
                        onClick={() => open('edit', proc)}
                      >
                        ✏️
                      </button>
                      <button
                        className="pm-act-del"
                        title="Delete Process"
                        onClick={() => open('delete', proc)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Footer ── */}
        <div className="pm-pagination">
          <div className="pm-per-page">
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

          <div className="pm-page-info">
            Showing {totalItems === 0 ? 0 : startIdx + 1} to{' '}
            {Math.min(startIdx + perPage, totalItems)} of {totalItems} items
          </div>

          {totalPages > 1 && (
            <div className="pm-page-nav">
              <button
                className="pm-nav-btn"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  className={`pm-nav-btn${page === n ? ' active-page' : ''}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                className="pm-nav-btn"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {modal?.type === 'edit'   && (
        <EditModal
          process={modal.process}
          onClose={close}
          onUpdate={handleUpdate}
        />
      )}
      {modal?.type === 'delete' && (
        <DeleteModal
          process={modal.process}
          onClose={close}
          onDelete={handleDelete}
        />
      )}

    </div>
  );
};

export default ProcessManagement;