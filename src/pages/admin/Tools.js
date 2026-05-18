import React, { useState } from "react";
import "./Tools.css";

// ── Initial Data ────────────────────────────────────────────────────────────
const INITIAL_COMMON_TOOLS = [
  { id: 1, name: "ARtitle", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
  { id: 2, name: "Ack Title", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
  { id: 3, name: "Add", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
  { id: 4, name: "Affl", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
  { id: 5, name: "App Title", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
  { id: 6, name: "Appendix", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
  { id: 7, name: "Attrib", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
  { id: 8, name: "Author Name", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
  { id: 9, name: "Blockquote", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
  { id: 10, name: "Blockquote 1", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
  { id: 11, name: "Book Aff", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
  { id: 12, name: "Book Author", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
  { id: 13, name: "Book Subtitle", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
  { id: 14, name: "Book Title", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
];

const INITIAL_EMPLOYEES = [
  { id: 1, name: "Sureka", email: "sureka@arrowdatatech.com", phone: "-", role: "Employee", initial: "S", tools: [] },
  { id: 2, name: "Ayeesha M", email: "vimala@arrowdatatech.com", phone: "9791778036", role: "Manager", initial: "A", tools: [] },
  { id: 3, name: "Shakina A", email: "shakina@arrowdatatech.com", phone: "9944732344", role: "Manager", initial: "S", tools: [] },
  { id: 4, name: "T. Mohamed Usen", email: "usen@arrowdatatech.com", phone: "9894562152", role: "Admin", initial: "T", tools: [] },
  { id: 5, name: "Karthika", email: "karthika@arrowdatatech.com", phone: "-", role: "Employee", initial: "K", tools: [] },
];

const INITIAL_OCR_TOOLS = [
  { id: 1, name: "ARtitle", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
  { id: 2, name: "Ack Title", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
  { id: 3, name: "Add", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
  { id: 4, name: "Affl", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
  { id: 5, name: "App Title", category: "-", shortcutKey: "Not set", description: "-", status: "Active" },
];

const ROLES = ["Admin", "Manager", "Employee", "Viewer"];

const emptyEmployeeForm = { name: "", email: "", phone: "", role: "Employee" };

// ── Utility ──────────────────────────────────────────────────────────────────
const roleClass = (role) => {
  const map = { Admin: "role--admin", Manager: "role--manager", Employee: "role--employee", Viewer: "role--viewer" };
  return map[role] || "role--employee";
};

const avatarColor = (initial) => {
  const colors = ["#6c63ff", "#00b894", "#e17055", "#0984e3", "#a29bfe", "#fd79a8"];
  return colors[initial.charCodeAt(0) % colors.length];
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function Tools() {
  const [activeTab, setActiveTab] = useState("common");

  // Digital Convertor state
  const [commonTools] = useState(INITIAL_COMMON_TOOLS);

  // OCR state
  const [ocrTools] = useState(INITIAL_OCR_TOOLS);

  // Employee state
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [showAddEmp, setShowAddEmp] = useState(false);
  const [showEditAccess, setShowEditAccess] = useState(false);
  const [showDelEmp, setShowDelEmp] = useState(false);
  const [selEmp, setSelEmp] = useState(null);
  const [empForm, setEmpForm] = useState(emptyEmployeeForm);
  const [empErrors, setEmpErrors] = useState({});
  const [empAccessTools, setEmpAccessTools] = useState([]);

  // ── Employee CRUD ────────────────────────────────────────────────────────
  const validateEmp = (f) => {
    const e = {};
    if (!f.name.trim()) e.name = "Name is required.";
    if (!f.email.trim()) e.email = "Email is required.";
    if (!f.role) e.role = "Role is required.";
    return e;
  };

  const openAddEmp = () => { setEmpForm(emptyEmployeeForm); setEmpErrors({}); setShowAddEmp(true); };

  const handleCreateEmp = () => {
    const e = validateEmp(empForm);
    if (Object.keys(e).length) { setEmpErrors(e); return; }
    setEmployees([...employees, {
      id: Date.now(),
      name: empForm.name,
      email: empForm.email,
      phone: empForm.phone || "-",
      role: empForm.role,
      initial: empForm.name.trim()[0].toUpperCase(),
      tools: [],
    }]);
    setShowAddEmp(false);
  };

  const openEditAccess = (emp) => {
    setSelEmp(emp);
    setEmpAccessTools(emp.tools || []);
    setShowEditAccess(true);
  };

  const toggleToolAccess = (toolName) => {
    setEmpAccessTools(prev =>
      prev.includes(toolName) ? prev.filter(t => t !== toolName) : [...prev, toolName]
    );
  };

  const handleSaveAccess = () => {
    setEmployees(employees.map(e => e.id === selEmp.id ? { ...e, tools: empAccessTools } : e));
    setShowEditAccess(false);
  };

  const handleDeleteEmp = () => {
    setEmployees(employees.filter(e => e.id !== selEmp.id));
    setShowDelEmp(false);
  };

  // Tools for the access modal depend on active tab
  const currentToolNames = activeTab === "common"
    ? commonTools.map(t => t.name)
    : ocrTools.map(t => t.name);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="tm-wrapper">
      {/* Page Header */}
      <div className="tm-page-header">
        <div className="tm-page-title">
          <span className="tm-icon">🔧</span>
          <h1>Tools Management</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="tm-tabs">
        <button
          className={`tm-tab ${activeTab === "common" ? "tm-tab--active" : ""}`}
          onClick={() => setActiveTab("common")}
        >
          <span className="tm-tab-icon">💻</span> Digital Convertor
        </button>
        <button
          className={`tm-tab ${activeTab === "ocr" ? "tm-tab--active" : ""}`}
          onClick={() => setActiveTab("ocr")}
        >
          <span className="tm-tab-icon">🔍</span> OCR
        </button>
      </div>

      {/* ── DIGITAL CONVERTOR TAB ─────────────────────────────────── */}
      {activeTab === "common" && (
        <EmployeeTable
          employees={employees}
          onAdd={openAddEmp}
          onEditAccess={openEditAccess}
          onDelete={(emp) => { setSelEmp(emp); setShowDelEmp(true); }}
        />
      )}

      {/* ── OCR TAB ──────────────────────────────────────────────── */}
      {activeTab === "ocr" && (
        <EmployeeTable
          employees={employees}
          onAdd={openAddEmp}
          onEditAccess={openEditAccess}
          onDelete={(emp) => { setSelEmp(emp); setShowDelEmp(true); }}
        />
      )}



      {/* ════ MODALS — Employee ════ */}
      {showAddEmp && (
        <Modal title="Add Employee" onClose={() => setShowAddEmp(false)}>
          <EmployeeForm form={empForm} errors={empErrors} onChange={(f, v) => { setEmpForm(p => ({ ...p, [f]: v })); setEmpErrors(p => ({ ...p, [f]: undefined })); }} />
          <ModalActions onCancel={() => setShowAddEmp(false)} onConfirm={handleCreateEmp} confirmLabel="Add Employee" />
        </Modal>
      )}
      {showEditAccess && (
        <Modal title={`Edit Tool Access — ${selEmp?.name}`} onClose={() => setShowEditAccess(false)} wide>
          <p className="modal-hint">Select the tools this employee can access:</p>
          <div className="access-grid">
            {currentToolNames.map(toolName => (
              <label key={toolName} className={`access-item ${empAccessTools.includes(toolName) ? "access-item--checked" : ""}`}>
                <input type="checkbox" checked={empAccessTools.includes(toolName)} onChange={() => toggleToolAccess(toolName)} />
                <span>{toolName}</span>
              </label>
            ))}
          </div>
          <ModalActions onCancel={() => setShowEditAccess(false)} onConfirm={handleSaveAccess} confirmLabel="Save Access" />
        </Modal>
      )}
      {showDelEmp && (
        <Modal title="Remove Employee" onClose={() => setShowDelEmp(false)} confirm>
          <p className="modal-confirm-text">Are you sure you want to remove <strong>{selEmp?.name}</strong>?</p>
          <ModalActions onCancel={() => setShowDelEmp(false)} onConfirm={handleDeleteEmp} confirmLabel="OK, Remove" danger />
        </Modal>
      )}
    </div>
  );
}

// ── Shared Icons ──────────────────────────────────────────────────────────────
function AccessIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>;
}
function DeleteIcon() {
  return <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function EmployeeTable({ employees, onAdd, onEditAccess, onDelete }) {
  return (
    <div className="tm-section tm-section--emp">
      <div className="tm-section-header">
        <span className="tm-section-title">Employee Access</span>
        <button className="tm-btn-add" onClick={onAdd}>+ Add Employee</button>
      </div>
      <div className="tm-table-container">
        <table className="tm-table tm-table--emp">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr><td colSpan={6} className="tm-empty">No employees found.</td></tr>
            ) : employees.map(emp => (
              <tr key={emp.id} className="tm-row">
                <td>
                  <div className="emp-avatar" style={{ background: avatarColor(emp.initial) }}>{emp.initial}</div>
                </td>
                <td className="tm-cell-name">{emp.name}</td>
                <td className="tm-cell-muted">{emp.email}</td>
                <td className="tm-cell-muted">{emp.phone}</td>
                <td><span className={`emp-role ${roleClass(emp.role)}`}>{emp.role}</span></td>
                <td>
                  <div className="tm-actions">
                    <button className="tm-action-btn tm-action-btn--edit" title="Give Access" onClick={() => onEditAccess(emp)}>
                      <AccessIcon />
                    </button>
                    <button className="tm-action-btn tm-action-btn--delete" title="Remove Employee" onClick={() => onDelete(emp)}>
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmployeeForm({ form, errors, onChange }) {
  return (
    <div className="modal-form">
      <div className="form-group">
        <label className="form-label">Name <span className="req">*</span></label>
        <input className={`form-input ${errors.name ? "form-input--err" : ""}`} value={form.name} onChange={e => onChange("name", e.target.value)} placeholder="Full name" />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>
      <div className="form-group">
        <label className="form-label">Email <span className="req">*</span></label>
        <input className={`form-input ${errors.email ? "form-input--err" : ""}`} type="email" value={form.email} onChange={e => onChange("email", e.target.value)} placeholder="email@example.com" />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label className="form-label">Phone</label>
        <input className="form-input" value={form.phone} onChange={e => onChange("phone", e.target.value)} placeholder="Optional" />
      </div>
      <div className="form-group">
        <label className="form-label">Role <span className="req">*</span></label>
        <select className={`form-select ${errors.role ? "form-input--err" : ""}`} value={form.role} onChange={e => onChange("role", e.target.value)}>
          {ROLES.map(r => <option key={r}>{r}</option>)}
        </select>
        {errors.role && <span className="form-error">{errors.role}</span>}
      </div>
    </div>
  );
}

function Modal({ title, onClose, children, confirm, wide }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-box ${confirm ? "modal-box--confirm" : ""} ${wide ? "modal-box--wide" : ""}`} onClick={e => e.stopPropagation()}>
        {confirm && <div className="modal-warn-icon">⚠️</div>}
        <h2 className="modal-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function ModalActions({ onCancel, onConfirm, confirmLabel, danger }) {
  return (
    <div className="modal-actions">
      <button className="modal-btn-cancel" onClick={onCancel}>Cancel</button>
      <button className={`modal-btn-confirm ${danger ? "modal-btn-confirm--danger" : ""}`} onClick={onConfirm}>{confirmLabel}</button>
    </div>
  );
}