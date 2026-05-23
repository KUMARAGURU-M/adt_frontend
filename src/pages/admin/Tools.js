import React, { useState } from "react";
import "./Tools.css";

const SAMPLE_EMPLOYEES = [
  {
    name: "John Peter",
    email: "john@arrowdatatech.com",
    phone: "9876543210",
    role: "Employee",
  },
  {
    name: "Priya Sharma",
    email: "priya@arrowdatatech.com",
    phone: "9123456780",
    role: "Manager",
  },
  {
    name: "Rahul Kumar",
    email: "rahul@arrowdatatech.com",
    phone: "9001234567",
    role: "Employee",
  },
  {
    name: "Sneha Devi",
    email: "sneha@arrowdatatech.com",
    phone: "9988776655",
    role: "Viewer",
  },
];

// ── Initial Data ────────────────────────────────────────────────────────────

const INITIAL_EMPLOYEES = [
  { id: 1, name: "Sureka", email: "sureka@arrowdatatech.com", phone: "-", role: "Employee", initial: "S", hasCommonAccess: false, hasOcrAccess: false },
  { id: 2, name: "Ayeesha M", email: "vimala@arrowdatatech.com", phone: "9791778036", role: "Manager", initial: "A", hasCommonAccess: false, hasOcrAccess: false },
  { id: 3, name: "Shakina A", email: "shakina@arrowdatatech.com", phone: "9944732344", role: "Manager", initial: "S", hasCommonAccess: false, hasOcrAccess: false },
  { id: 4, name: "T. Mohamed Usen", email: "usen@arrowdatatech.com", phone: "9894562152", role: "Admin", initial: "T", hasCommonAccess: false, hasOcrAccess: false },
  { id: 5, name: "Karthika", email: "karthika@arrowdatatech.com", phone: "-", role: "Employee", initial: "K", hasCommonAccess: false, hasOcrAccess: false },
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

  // Employee state
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [showAddEmp, setShowAddEmp] = useState(false);
  const [showEditAccess, setShowEditAccess] = useState(false);
  const [showDelEmp, setShowDelEmp] = useState(false);
  const [selEmp, setSelEmp] = useState(null);
  const [empForm, setEmpForm] = useState(emptyEmployeeForm);
  const [empErrors, setEmpErrors] = useState({});
  const [showEmpDropdown, setShowEmpDropdown] = useState(false);
  // ── Toggle state for the modal (local, before saving) ──
  const [modalToggle, setModalToggle] = useState(false);

  // ── Employee CRUD ────────────────────────────────────────────────────────
  const validateEmp = (f) => {
    const e = {};
    if (!f.name.trim()) e.name = "Name is required.";
    if (!f.email.trim()) e.email = "Email is required.";
    if (!f.role) e.role = "Role is required.";
    return e;
  };

  const openAddEmp = () => {
    setEmpForm(emptyEmployeeForm);
    setEmpErrors({});
    setShowAddEmp(true);
  };

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
      hasCommonAccess: false,
      hasOcrAccess: false,
    }]);
    setShowAddEmp(false);
  };

  const handleAddSampleEmployee = (emp) => {
  setEmployees(prev => [
    ...prev,
    {
      id: Date.now(),
      ...emp,
      initial: emp.name[0].toUpperCase(),
      hasCommonAccess: false,
      hasOcrAccess: false,
    },
  ]);

  setShowEmpDropdown(false);
};

  // Open modal — seed toggle from the employee's current access for that tab
  const openEditAccess = (emp) => {
    setSelEmp(emp);
    if (activeTab === "common") {
      setModalToggle(emp.hasCommonAccess);
    } else {
      setModalToggle(emp.hasOcrAccess);
    }
    setShowEditAccess(true);
  };

  // Save the single toggle back to the employee record
  const handleSaveAccess = () => {
    setEmployees(employees.map(e => {
      if (e.id !== selEmp.id) return e;
      if (activeTab === "common") return { ...e, hasCommonAccess: modalToggle };
      return { ...e, hasOcrAccess: modalToggle };
    }));
    setShowEditAccess(false);
  };

  const handleDeleteEmp = () => {
    setEmployees(employees.filter(e => e.id !== selEmp.id));
    setShowDelEmp(false);
  };

  // Label shown inside the modal
  const accessModalLabel = activeTab === "common"
    ? "Give Digital Convertor Tool access to"
    : "Give OCR Tool access to";

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

      {/* ── DIGITAL CONVERTOR TAB ── */}
      {activeTab === "common" && (
        <EmployeeTable
  employees={employees}
  activeTab="common"
  onAdd={openAddEmp}
  onEditAccess={openEditAccess}
  onDelete={(emp) => {
    setSelEmp(emp);
    setShowDelEmp(true);
  }}
  showEmpDropdown={showEmpDropdown}
  setShowEmpDropdown={setShowEmpDropdown}
  sampleEmployees={SAMPLE_EMPLOYEES}
  onAddSample={handleAddSampleEmployee}
/>
      )}

      {/* ── OCR TAB ── */}
      {activeTab === "ocr" && (
        <EmployeeTable
  employees={employees}
  activeTab="ocr"
  onAdd={openAddEmp}
  onEditAccess={openEditAccess}
  onDelete={(emp) => {
    setSelEmp(emp);
    setShowDelEmp(true);
  }}
  showEmpDropdown={showEmpDropdown}
  setShowEmpDropdown={setShowEmpDropdown}
  sampleEmployees={SAMPLE_EMPLOYEES}
  onAddSample={handleAddSampleEmployee}
/>
      )}

      {/* ════ MODALS ════ */}

      {/* Add Employee */}
      {showAddEmp && (
        <Modal title="Add Employee" onClose={() => setShowAddEmp(false)}>
          <EmployeeForm
            form={empForm}
            errors={empErrors}
            onChange={(f, v) => {
              setEmpForm(p => ({ ...p, [f]: v }));
              setEmpErrors(p => ({ ...p, [f]: undefined }));
            }}
          />
          <ModalActions
            onCancel={() => setShowAddEmp(false)}
            onConfirm={handleCreateEmp}
            confirmLabel="Add Employee"
          />
        </Modal>
      )}

      {/* Edit Access — single toggle */}
      {showEditAccess && (
        <Modal title="Tool Access" onClose={() => setShowEditAccess(false)}>
          <div className="access-toggle-container">
            <span className="access-toggle-label">
              {accessModalLabel} <strong>{selEmp?.name}</strong>
            </span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={modalToggle}
                onChange={() => setModalToggle(prev => !prev)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <p className="access-toggle-status">
            {modalToggle
              ? <span className="access-status--granted">✓ Access will be granted</span>
              : <span className="access-status--revoked">✗ Access will be revoked</span>
            }
          </p>
          <ModalActions
            onCancel={() => setShowEditAccess(false)}
            onConfirm={handleSaveAccess}
            confirmLabel="Save"
          />
        </Modal>
      )}

      {/* Delete Employee */}
      {showDelEmp && (
        <Modal title="Remove Employee" onClose={() => setShowDelEmp(false)} confirm>
          <p className="modal-confirm-text">
            Are you sure you want to remove <strong>{selEmp?.name}</strong>?
          </p>
          <ModalActions
            onCancel={() => setShowDelEmp(false)}
            onConfirm={handleDeleteEmp}
            confirmLabel="OK, Remove"
            danger
          />
        </Modal>
      )}
    </div>
  );
}

// ── Shared Icons ──────────────────────────────────────────────────────────────
function AccessIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}
function DeleteIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function EmployeeTable({
  employees,
  onAdd,
  onEditAccess,
  onDelete,
  activeTab,
  showEmpDropdown,
  setShowEmpDropdown,
  sampleEmployees,
  onAddSample
}) {
  return (
    <div className="tm-section tm-section--emp">
      <div className="tm-section-header">
        <span className="tm-section-title">
          {activeTab === "common"
            ? "Digital Convertor — Employee Access"
            : "OCR — Employee Access"}
        </span>

        <div className="tm-dropdown-wrapper">
  <button
    className="tm-btn-add"
    onClick={() => setShowEmpDropdown(prev => !prev)}
  >
    + Add Employee ▾
  </button>

  {showEmpDropdown && (
    <div className="tm-dropdown-menu">
      {/* <button
        className="tm-dropdown-item"
        onClick={onAdd}
      >
        + Create New Employee
      </button> */}

      {sampleEmployees.map((emp, index) => (
        <button
          key={index}
          className="tm-dropdown-item"
          onClick={() => onAddSample(emp)}
        >
          {emp.name}
        </button>
      ))}
    </div>
  )}
</div>
      </div>

      <div className="tm-table-container">
        <table className="tm-table tm-table--emp">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Access</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="tm-empty">
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => {
                const hasAccess =
                  activeTab === "common"
                    ? emp.hasCommonAccess
                    : emp.hasOcrAccess;

                return (
                  <tr key={emp.id} className="tm-row">
                    <td>
                      <div
                        className="emp-avatar"
                        style={{ background: avatarColor(emp.initial) }}
                      >
                        {emp.initial}
                      </div>
                    </td>

                    <td className="tm-cell-name col-left">{emp.name}</td>

                    <td className="tm-cell-muted">{emp.email}</td>

                    <td>
                      <span className={`emp-role ${roleClass(emp.role)}`}>
                        {emp.role}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`tm-access-badge ${
                          hasAccess
                            ? "tm-access-badge--granted"
                            : "tm-access-badge--denied"
                        }`}
                      >
                        {hasAccess ? "Granted" : "Denied"}
                      </span>
                    </td>

                    <td>
                      <div className="tm-actions">
                        <button
                          className="tm-action-btn tm-action-btn--edit"
                          title="Give Access"
                          onClick={() => onEditAccess(emp)}
                        >
                          <AccessIcon />
                        </button>

                        <button
                          className="tm-action-btn tm-action-btn--delete"
                          title="Remove Employee"
                          onClick={() => onDelete(emp)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
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
        <input
          className={`form-input ${errors.name ? "form-input--err" : ""}`}
          value={form.name}
          onChange={e => onChange("name", e.target.value)}
          placeholder="Full name"
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>
      <div className="form-group">
        <label className="form-label">Email <span className="req">*</span></label>
        <input
          className={`form-input ${errors.email ? "form-input--err" : ""}`}
          type="email"
          value={form.email}
          onChange={e => onChange("email", e.target.value)}
          placeholder="email@example.com"
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label className="form-label">Phone</label>
        <input
          className="form-input"
          value={form.phone}
          onChange={e => onChange("phone", e.target.value)}
          placeholder="Optional"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Role <span className="req">*</span></label>
        <select
          className={`form-select ${errors.role ? "form-input--err" : ""}`}
          value={form.role}
          onChange={e => onChange("role", e.target.value)}
        >
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
      <div
        className={`modal-box ${confirm ? "modal-box--confirm" : ""} ${wide ? "modal-box--wide" : ""}`}
        onClick={e => e.stopPropagation()}
      >
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
      <button
        className={`modal-btn-confirm ${danger ? "modal-btn-confirm--danger" : ""}`}
        onClick={onConfirm}
      >
        {confirmLabel}
      </button>
    </div>
  );
}