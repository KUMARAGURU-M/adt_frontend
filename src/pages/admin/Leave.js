// src/pages/admin/Leave.js

import React, { useState } from "react";
import "./Leave.css";

/* ─── Seed Data ──────────────────────────────────────────────────── */
const EMPLOYEES = ["All Employees", "Sureka", "Ayeesha M", "Shakina A", "T. Mohamed Usen", "Karthika"];
const STATUS_OPTIONS = ["All Status", "Pending", "Approved", "Rejected", "Cancelled"];
const LEAVE_TYPE_OPTIONS = ["All Types", "Annual Leave", "Sick Leave", "Casual Leave", "Maternity Leave"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const initialLeaveRequests = [];
const initialLeaveTypes = [];
const initialPolicies = [];
const initialBalances = [];

/* ─── Modal Wrapper ──────────────────────────────────────────────── */
const Modal = ({ onClose, children }) => (
  <div className="lv-modal-overlay" onClick={onClose}>
    <div className="lv-modal" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   TAB 1 — LEAVE REQUESTS
══════════════════════════════════════════════════════════════════ */
const LeaveRequests = () => {
  const [requests, setRequests] = useState(initialLeaveRequests);
  const [filterEmployee, setFilterEmployee] = useState("All Employees");
  const [filterStatus,   setFilterStatus]   = useState("All Status");
  const [filterType,     setFilterType]     = useState("All Types");
  const [showAdd,  setShowAdd]  = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDel,  setShowDel]  = useState(false);
  const [selected, setSelected] = useState(null);

  const emptyReq = { employee: "", leaveType: "", startDate: "", endDate: "", days: "", reason: "", status: "Pending" };
  const [form,   setForm]   = useState(emptyReq);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  const calcDays = (start, end) => {
    if (!start || !end) return "";
    const diff = (new Date(end) - new Date(start)) / 86400000;
    return diff >= 0 ? diff + 1 : "";
  };

  const validate = (f) => {
    const e = {};
    if (!f.employee)  e.employee  = "Employee is required.";
    if (!f.leaveType) e.leaveType = "Leave type is required.";
    if (!f.startDate) e.startDate = "Start date is required.";
    if (!f.endDate)   e.endDate   = "End date is required.";
    return e;
  };

  const handleCreate = () => {
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setRequests(prev => [...prev, { ...form, id: Date.now(), days: calcDays(form.startDate, form.endDate) }]);
    setShowAdd(false);
  };

  const handleUpdate = () => {
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setRequests(prev => prev.map(r => r.id === selected.id ? { ...form, id: r.id, days: calcDays(form.startDate, form.endDate) } : r));
    setShowEdit(false);
  };

  const openEdit = (r) => { setSelected(r); setForm({ ...r }); setErrors({}); setShowEdit(true); };
  const openDel  = (r) => { setSelected(r); setShowDel(true); };

  const filtered = requests.filter(r =>
    (filterEmployee === "All Employees" || r.employee === filterEmployee) &&
    (filterStatus   === "All Status"    || r.status   === filterStatus) &&
    (filterType     === "All Types"     || r.leaveType === filterType)
  );

  const statusClass = (s) => ({ Pending: "lv-badge--pending", Approved: "lv-badge--approved", Rejected: "lv-badge--rejected", Cancelled: "lv-badge--cancelled" }[s] || "");

  return (
    <div>
      {/* Filters */}
      <div className="lv-filter-card">
        <div className="lv-filter-group">
          <label className="lv-filter-label">Employee</label>
          <select className="lv-filter-select" value={filterEmployee} onChange={e => setFilterEmployee(e.target.value)}>
            {EMPLOYEES.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div className="lv-filter-group">
          <label className="lv-filter-label">Status</label>
          <select className="lv-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="lv-filter-group">
          <label className="lv-filter-label">Leave Type</label>
          <select className="lv-filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
            {LEAVE_TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <button className="lv-btn-primary" style={{ marginTop: 22 }} onClick={() => { setForm(emptyReq); setErrors({}); setShowAdd(true); }}>
          + Add Request
        </button>
      </div>

      {/* Table */}
      <div className="lv-table-card">
        <table className="lv-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="lv-empty">No leave requests found.</td></tr>
            ) : filtered.map(r => (
              <tr key={r.id} className="lv-row">
                <td>{r.employee}</td>
                <td>{r.leaveType}</td>
                <td>{r.startDate}</td>
                <td>{r.endDate}</td>
                <td>{r.days}</td>
                <td className="lv-reason">{r.reason || "-"}</td>
                <td><span className={`lv-badge ${statusClass(r.status)}`}>{r.status}</span></td>
                <td>
                  <div className="lv-actions">
                    <button className="lv-action-btn" onClick={() => openEdit(r)} title="Edit">✏️</button>
                    <button className="lv-action-btn" onClick={() => openDel(r)} title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <Modal onClose={() => setShowAdd(false)}>
          <h2 className="lv-modal-title">Add Leave Request</h2>
          <LeaveRequestForm form={form} set={set} errors={errors} calcDays={calcDays} />
          <div className="lv-modal-actions">
            <button className="lv-btn-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="lv-btn-primary" onClick={handleCreate}>Create</button>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <Modal onClose={() => setShowEdit(false)}>
          <h2 className="lv-modal-title">Edit Leave Request</h2>
          <LeaveRequestForm form={form} set={set} errors={errors} calcDays={calcDays} showStatus />
          <div className="lv-modal-actions">
            <button className="lv-btn-cancel" onClick={() => setShowEdit(false)}>Cancel</button>
            <button className="lv-btn-primary" onClick={handleUpdate}>Update</button>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {showDel && (
        <Modal onClose={() => setShowDel(false)}>
          <div className="lv-confirm">
            <div className="lv-confirm-icon">🗑️</div>
            <h2 className="lv-modal-title">Delete Request</h2>
            <p className="lv-confirm-text">Delete leave request for <strong>{selected?.employee}</strong>? This cannot be undone.</p>
            <div className="lv-modal-actions lv-modal-actions--center">
              <button className="lv-btn-cancel" onClick={() => setShowDel(false)}>Cancel</button>
              <button className="lv-btn-danger" onClick={() => { setRequests(p => p.filter(r => r.id !== selected.id)); setShowDel(false); }}>Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

function LeaveRequestForm({ form, set, errors, calcDays, showStatus }) {
  return (
    <div className="lv-form-body">
      <div className="lv-form-row">
        <div className="lv-form-group">
          <label className="lv-form-label">Employee <span className="lv-req">*</span></label>
          <select className={`lv-form-select${errors.employee ? " lv-input--error" : ""}`} value={form.employee} onChange={e => set("employee", e.target.value)}>
            <option value="">-- Select Employee --</option>
            {EMPLOYEES.filter(e => e !== "All Employees").map(e => <option key={e}>{e}</option>)}
          </select>
          {errors.employee && <span className="lv-form-error">{errors.employee}</span>}
        </div>
        <div className="lv-form-group">
          <label className="lv-form-label">Leave Type <span className="lv-req">*</span></label>
          <select className={`lv-form-select${errors.leaveType ? " lv-input--error" : ""}`} value={form.leaveType} onChange={e => set("leaveType", e.target.value)}>
            <option value="">-- Select Type --</option>
            {LEAVE_TYPE_OPTIONS.filter(t => t !== "All Types").map(t => <option key={t}>{t}</option>)}
          </select>
          {errors.leaveType && <span className="lv-form-error">{errors.leaveType}</span>}
        </div>
      </div>
      <div className="lv-form-row">
        <div className="lv-form-group">
          <label className="lv-form-label">Start Date <span className="lv-req">*</span></label>
          <input type="date" className={`lv-form-input${errors.startDate ? " lv-input--error" : ""}`} value={form.startDate} onChange={e => { set("startDate", e.target.value); set("days", calcDays(e.target.value, form.endDate)); }} />
          {errors.startDate && <span className="lv-form-error">{errors.startDate}</span>}
        </div>
        <div className="lv-form-group">
          <label className="lv-form-label">End Date <span className="lv-req">*</span></label>
          <input type="date" className={`lv-form-input${errors.endDate ? " lv-input--error" : ""}`} value={form.endDate} onChange={e => { set("endDate", e.target.value); set("days", calcDays(form.startDate, e.target.value)); }} />
          {errors.endDate && <span className="lv-form-error">{errors.endDate}</span>}
        </div>
      </div>
      <div className="lv-form-group">
        <label className="lv-form-label">Reason</label>
        <textarea className="lv-form-textarea" rows={3} value={form.reason} onChange={e => set("reason", e.target.value)} placeholder="Optional reason..." />
      </div>
      {showStatus && (
        <div className="lv-form-group">
          <label className="lv-form-label">Status</label>
          <select className="lv-form-select" value={form.status} onChange={e => set("status", e.target.value)}>
            {["Pending","Approved","Rejected","Cancelled"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TAB 2 — LEAVE TYPES
══════════════════════════════════════════════════════════════════ */
const LeaveTypes = () => {
  const [types,   setTypes]   = useState(initialLeaveTypes);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit,setShowEdit]= useState(false);
  const [showDel, setShowDel] = useState(false);
  const [selected,setSelected]= useState(null);

  const emptyType = { code: "", name: "", description: "", maxDays: "", carryForward: false, requiresApproval: true, status: "Active" };
  const [form,   setForm]   = useState(emptyType);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  const validate = (f) => {
    const e = {};
    if (!f.code.trim()) e.code = "Code is required.";
    if (!f.name.trim()) e.name = "Name is required.";
    return e;
  };

  const handleCreate = () => {
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setTypes(prev => [...prev, { ...form, id: Date.now() }]);
    setShowAdd(false);
  };

  const handleUpdate = () => {
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setTypes(prev => prev.map(t => t.id === selected.id ? { ...form, id: t.id } : t));
    setShowEdit(false);
  };

  const openEdit = (t) => { setSelected(t); setForm({ ...t }); setErrors({}); setShowEdit(true); };
  const openDel  = (t) => { setSelected(t); setShowDel(true); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="lv-btn-primary" onClick={() => { setForm(emptyType); setErrors({}); setShowAdd(true); }}>
          + Add Leave Type
        </button>
      </div>

      <div className="lv-table-card">
        <table className="lv-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Max Days/Year</th>
              <th>Carry Forward</th>
              <th>Requires Approval</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {types.length === 0 ? (
              <tr><td colSpan={7} className="lv-empty">No leave types found. Click "Add Leave Type" to create one.</td></tr>
            ) : types.map(t => (
              <tr key={t.id} className="lv-row">
                <td><span className="lv-code-badge">{t.code}</span></td>
                <td className="lv-name-cell">{t.name}</td>
                <td>{t.maxDays || "-"}</td>
                <td><span className={`lv-bool ${t.carryForward ? "lv-bool--yes" : "lv-bool--no"}`}>{t.carryForward ? "Yes" : "No"}</span></td>
                <td><span className={`lv-bool ${t.requiresApproval ? "lv-bool--yes" : "lv-bool--no"}`}>{t.requiresApproval ? "Yes" : "No"}</span></td>
                <td><span className={`lv-badge ${t.status === "Active" ? "lv-badge--approved" : "lv-badge--rejected"}`}>{t.status}</span></td>
                <td>
                  <div className="lv-actions">
                    <button className="lv-action-btn" onClick={() => openEdit(t)} title="Edit">✏️</button>
                    <button className="lv-action-btn" onClick={() => openDel(t)} title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal onClose={() => setShowAdd(false)}>
          <h2 className="lv-modal-title">Add Leave Type</h2>
          <LeaveTypeForm form={form} set={set} errors={errors} />
          <div className="lv-modal-actions">
            <button className="lv-btn-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="lv-btn-primary" onClick={handleCreate}>Create</button>
          </div>
        </Modal>
      )}

      {showEdit && (
        <Modal onClose={() => setShowEdit(false)}>
          <h2 className="lv-modal-title">Edit Leave Type</h2>
          <LeaveTypeForm form={form} set={set} errors={errors} showStatus />
          <div className="lv-modal-actions">
            <button className="lv-btn-cancel" onClick={() => setShowEdit(false)}>Cancel</button>
            <button className="lv-btn-primary" onClick={handleUpdate}>Update</button>
          </div>
        </Modal>
      )}

      {showDel && (
        <Modal onClose={() => setShowDel(false)}>
          <div className="lv-confirm">
            <div className="lv-confirm-icon">🗑️</div>
            <h2 className="lv-modal-title">Delete Leave Type</h2>
            <p className="lv-confirm-text">Delete <strong>{selected?.name}</strong>? This cannot be undone.</p>
            <div className="lv-modal-actions lv-modal-actions--center">
              <button className="lv-btn-cancel" onClick={() => setShowDel(false)}>Cancel</button>
              <button className="lv-btn-danger" onClick={() => { setTypes(p => p.filter(t => t.id !== selected.id)); setShowDel(false); }}>Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

function LeaveTypeForm({ form, set, errors, showStatus }) {
  return (
    <div className="lv-form-body">
      <div className="lv-form-group">
        <label className="lv-form-label">Code <span className="lv-req">*</span></label>
        <p className="lv-form-hint">e.g., AL, SL, CL</p>
        <input className={`lv-form-input${errors.code ? " lv-input--error" : ""}`} placeholder="AL" value={form.code} onChange={e => set("code", e.target.value.toUpperCase())} />
        {errors.code && <span className="lv-form-error">{errors.code}</span>}
      </div>
      <div className="lv-form-group">
        <label className="lv-form-label">Name <span className="lv-req">*</span></label>
        <input className={`lv-form-input${errors.name ? " lv-input--error" : ""}`} placeholder="Annual Leave" value={form.name} onChange={e => set("name", e.target.value)} />
        {errors.name && <span className="lv-form-error">{errors.name}</span>}
      </div>
      <div className="lv-form-group">
        <label className="lv-form-label">Description</label>
        <textarea className="lv-form-textarea" placeholder="Optional description" rows={3} value={form.description} onChange={e => set("description", e.target.value)} />
      </div>
      <div className="lv-form-group">
        <label className="lv-form-label">Max Days Per Year</label>
        <input type="number" min="0" className="lv-form-input" placeholder="e.g., 12" value={form.maxDays} onChange={e => set("maxDays", e.target.value)} />
      </div>
      <div className="lv-form-check">
        <label className="lv-check-label">
          <input type="checkbox" checked={form.carryForward} onChange={e => set("carryForward", e.target.checked)} />
          Allow Carry Forward
        </label>
      </div>
      <div className="lv-form-check">
        <label className="lv-check-label">
          <input type="checkbox" checked={form.requiresApproval} onChange={e => set("requiresApproval", e.target.checked)} />
          Requires Approval
        </label>
      </div>
      {showStatus && (
        <div className="lv-form-group">
          <label className="lv-form-label">Status</label>
          <select className="lv-form-select" value={form.status} onChange={e => set("status", e.target.value)}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TAB 3 — POLICIES
══════════════════════════════════════════════════════════════════ */
const Policies = () => {
  const [policies, setPolicies] = useState(initialPolicies);
  const [showAdd,  setShowAdd]  = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDel,  setShowDel]  = useState(false);
  const [selected, setSelected] = useState(null);

  const emptyPolicy = { name: "", description: "", defaultAnnualDays: 12, probationDays: 0, yearStartMonth: "January", yearStartDay: 1, status: "Active" };
  const [form,   setForm]   = useState(emptyPolicy);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  const validate = (f) => {
    const e = {};
    if (!f.name.trim()) e.name = "Policy name is required.";
    if (!f.defaultAnnualDays) e.defaultAnnualDays = "Annual leave days is required.";
    return e;
  };

  const handleCreate = () => {
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setPolicies(prev => [...prev, { ...form, id: Date.now() }]);
    setShowAdd(false);
  };

  const handleUpdate = () => {
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setPolicies(prev => prev.map(p => p.id === selected.id ? { ...form, id: p.id } : p));
    setShowEdit(false);
  };

  const openEdit = (p) => { setSelected(p); setForm({ ...p }); setErrors({}); setShowEdit(true); };
  const openDel  = (p) => { setSelected(p); setShowDel(true); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="lv-btn-primary" onClick={() => { setForm(emptyPolicy); setErrors({}); setShowAdd(true); }}>
          + Add Policy
        </button>
      </div>

      <div className="lv-table-card">
        <table className="lv-table">
          <thead>
            <tr>
              <th>Policy Name</th>
              <th>Default Annual Leave</th>
              <th>Probation Period Days</th>
              <th>Leave Year Start</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.length === 0 ? (
              <tr><td colSpan={6} className="lv-empty">No leave policies found. Click "Add Policy" to create one.</td></tr>
            ) : policies.map(p => (
              <tr key={p.id} className="lv-row">
                <td className="lv-name-cell">{p.name}</td>
                <td>{p.defaultAnnualDays} days</td>
                <td>{p.probationDays} days</td>
                <td>{p.yearStartMonth} {p.yearStartDay}</td>
                <td><span className={`lv-badge ${p.status === "Active" ? "lv-badge--approved" : "lv-badge--rejected"}`}>{p.status}</span></td>
                <td>
                  <div className="lv-actions">
                    <button className="lv-action-btn" onClick={() => openEdit(p)} title="Edit">✏️</button>
                    <button className="lv-action-btn" onClick={() => openDel(p)} title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal onClose={() => setShowAdd(false)}>
          <h2 className="lv-modal-title">Add Leave Policy</h2>
          <PolicyForm form={form} set={set} errors={errors} />
          <div className="lv-modal-actions">
            <button className="lv-btn-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="lv-btn-primary" onClick={handleCreate}>Create</button>
          </div>
        </Modal>
      )}

      {showEdit && (
        <Modal onClose={() => setShowEdit(false)}>
          <h2 className="lv-modal-title">Edit Leave Policy</h2>
          <PolicyForm form={form} set={set} errors={errors} showStatus />
          <div className="lv-modal-actions">
            <button className="lv-btn-cancel" onClick={() => setShowEdit(false)}>Cancel</button>
            <button className="lv-btn-primary" onClick={handleUpdate}>Update</button>
          </div>
        </Modal>
      )}

      {showDel && (
        <Modal onClose={() => setShowDel(false)}>
          <div className="lv-confirm">
            <div className="lv-confirm-icon">🗑️</div>
            <h2 className="lv-modal-title">Delete Policy</h2>
            <p className="lv-confirm-text">Delete policy <strong>{selected?.name}</strong>? This cannot be undone.</p>
            <div className="lv-modal-actions lv-modal-actions--center">
              <button className="lv-btn-cancel" onClick={() => setShowDel(false)}>Cancel</button>
              <button className="lv-btn-danger" onClick={() => { setPolicies(p => p.filter(x => x.id !== selected.id)); setShowDel(false); }}>Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

function PolicyForm({ form, set, errors, showStatus }) {
  return (
    <div className="lv-form-body">
      <div className="lv-form-group">
        <label className="lv-form-label">Policy Name <span className="lv-req">*</span></label>
        <input className={`lv-form-input${errors.name ? " lv-input--error" : ""}`} placeholder="e.g., Annual Leave Policy 2024" value={form.name} onChange={e => set("name", e.target.value)} />
        {errors.name && <span className="lv-form-error">{errors.name}</span>}
      </div>
      <div className="lv-form-group">
        <label className="lv-form-label">Description</label>
        <textarea className="lv-form-textarea" placeholder="Optional description" rows={3} value={form.description} onChange={e => set("description", e.target.value)} />
      </div>
      <div className="lv-form-group">
        <label className="lv-form-label">Default Annual Leave Days <span className="lv-req">*</span></label>
        <input type="number" min="0" className={`lv-form-input${errors.defaultAnnualDays ? " lv-input--error" : ""}`} value={form.defaultAnnualDays} onChange={e => set("defaultAnnualDays", e.target.value)} />
        {errors.defaultAnnualDays && <span className="lv-form-error">{errors.defaultAnnualDays}</span>}
      </div>
      <div className="lv-form-group">
        <label className="lv-form-label">Probation Period Days</label>
        <input type="number" min="0" className="lv-form-input" value={form.probationDays} onChange={e => set("probationDays", e.target.value)} />
      </div>
      <div className="lv-form-row">
        <div className="lv-form-group">
          <label className="lv-form-label">Leave Year Start Month <span className="lv-req">*</span></label>
          <select className="lv-form-select" value={form.yearStartMonth} onChange={e => set("yearStartMonth", e.target.value)}>
            {MONTHS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="lv-form-group">
          <label className="lv-form-label">Leave Year Start Day <span className="lv-req">*</span></label>
          <input type="number" min="1" max="31" className="lv-form-input" value={form.yearStartDay} onChange={e => set("yearStartDay", e.target.value)} />
        </div>
      </div>
      {showStatus && (
        <div className="lv-form-group">
          <label className="lv-form-label">Status</label>
          <select className="lv-form-select" value={form.status} onChange={e => set("status", e.target.value)}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TAB 4 — BALANCES
══════════════════════════════════════════════════════════════════ */
const Balances = () => {
  const [balances] = useState(initialBalances);
  const [filterEmployee, setFilterEmployee] = useState("All Employees");

  const filtered = balances.filter(b =>
    filterEmployee === "All Employees" || b.employee === filterEmployee
  );

  return (
    <div>
      <div className="lv-filter-card">
        <div className="lv-filter-group">
          <label className="lv-filter-label">Employee</label>
          <select className="lv-filter-select" value={filterEmployee} onChange={e => setFilterEmployee(e.target.value)}>
            {EMPLOYEES.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
      </div>

      <div className="lv-table-card">
        <table className="lv-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Year</th>
              <th>Total Allocated</th>
              <th>Used</th>
              <th>Pending</th>
              <th>Carried Forward</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="lv-empty">No leave balances found.</td></tr>
            ) : filtered.map((b, i) => (
              <tr key={i} className="lv-row">
                <td>{b.employee}</td>
                <td>{b.leaveType}</td>
                <td>{b.year}</td>
                <td>{b.totalAllocated}</td>
                <td>{b.used}</td>
                <td>{b.pending}</td>
                <td>{b.carriedForward}</td>
                <td><strong>{b.available}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
const TABS = [
  { key: "requests", label: "Leave Requests", icon: "📋" },
  { key: "types",    label: "Leave Types",    icon: "🏷️" },
  { key: "policies", label: "Policies",       icon: "📄" },
  { key: "balances", label: "Balances",       icon: "💰" },
];

const Leave = () => {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <div className="lv-wrapper">
      {/* Header */}
      <div className="lv-header">
        <span className="lv-header-icon">🏖️</span>
        <h2 className="lv-header-title">Leave Management</h2>
      </div>

      {/* Tabs */}
      <div className="lv-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`lv-tab${activeTab === tab.key ? " lv-tab--active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="lv-tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="lv-content">
        {activeTab === "requests" && <LeaveRequests />}
        {activeTab === "types"    && <LeaveTypes />}
        {activeTab === "policies" && <Policies />}
        {activeTab === "balances" && <Balances />}
      </div>
    </div>
  );
};

export default Leave;