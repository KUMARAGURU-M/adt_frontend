import React, { useState } from "react";
import "./Project.css";

const initialProjects = [
  { id: 1, name: "LDM - Hanser", description: "", billingType: "Per Page", complexity: "Medium", rate: "", status: "Active" },
  { id: 2, name: "ING - Usen", description: "", billingType: "Per Page", complexity: "Intermediate", rate: "", status: "Active" },
  { id: 3, name: "ING - OUP", description: "", billingType: "Per Page", complexity: "Intermediate", rate: "", status: "Active" },
  { id: 4, name: "LDM - T&F", description: "", billingType: "Per Page", complexity: "Intermediate", rate: "", status: "Active" },
  { id: 5, name: "LDM - WILEY", description: "", billingType: "Per Page", complexity: "Intermediate", rate: "", status: "Active" },
  { id: 6, name: "CNT", description: "", billingType: "Per Page", complexity: "Intermediate", rate: "", status: "Active" },
  { id: 7, name: "IMP - EPUB", description: "", billingType: "Per Page", complexity: "Intermediate", rate: "", status: "Active" },
  { id: 8, name: "CMT - JATS", description: "", billingType: "Per Page", complexity: "Intermediate", rate: "", status: "Active" },
  { id: 9, name: "ING - ACDC", description: "", billingType: "Per Page", complexity: "Intermediate", rate: "", status: "Active" },
  { id: 10, name: "LDM - ASS_EPUB3", description: "", billingType: "Per Page", complexity: "Intermediate", rate: "", status: "Active" },
];

const BILLING_TYPES = ["Per Page", "Per Article", "Per KB"];
const COMPLEXITY_LEVELS = ["Simple", "Medium", "Intermediate", "Complex", "Expert"];

const emptyForm = {
  name: "",
  description: "",
  billingType: "Per Page",
  complexity: "Medium",
  ratePerPage: "0.00",
  hourlyRate: "0.00",
  active: true,
};

const complexityClass = (level) => {
  const map = {
    Simple: "badge--simple",
    Medium: "badge--medium",
    Intermediate: "badge--intermediate",
    Complex: "badge--complex",
    Expert: "badge--expert",
  };
  return map[level] || "badge--intermediate";
};

export default function Projects() {
  const [projects, setProjects] = useState(initialProjects);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const totalItems = projects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedProjects = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const validate = (f) => {
    const e = {};
    if (!f.name.trim()) e.name = "Name is required.";
    if (!f.billingType) e.billingType = "Billing Type is required.";
    if (!f.complexity) e.complexity = "Complexity Level is required.";
    if (!f.ratePerPage || isNaN(f.ratePerPage)) e.ratePerPage = "Valid rate required.";
    return e;
  };

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setShowAddModal(true);
  };

  const handleCreate = () => {
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    const newProject = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      billingType: form.billingType,
      complexity: form.complexity,
      rate: form.ratePerPage !== "0.00" ? `₹${form.ratePerPage}` : "",
      status: form.active ? "Active" : "Inactive",
    };
    setProjects([...projects, newProject]);
    setShowAddModal(false);
  };

  const handleOpenEdit = (project) => {
    setSelectedProject(project);
    setForm({
      name: project.name,
      description: project.description || "",
      billingType: project.billingType,
      complexity: project.complexity,
      ratePerPage: project.rate ? project.rate.replace("₹", "") : "0.00",
      hourlyRate: "0.00",
      active: project.status === "Active",
    });
    setErrors({});
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setProjects(projects.map((p) =>
      p.id === selectedProject.id
        ? {
            ...p,
            name: form.name,
            description: form.description,
            billingType: form.billingType,
            complexity: form.complexity,
            rate: form.ratePerPage !== "0.00" ? `₹${form.ratePerPage}` : "",
            status: form.active ? "Active" : "Inactive",
          }
        : p
    ));
    setShowEditModal(false);
  };

  const handleOpenDelete = (project) => {
    setSelectedProject(project);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    setProjects(projects.filter((p) => p.id !== selectedProject.id));
    setShowDeleteConfirm(false);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Inline billing type change directly in the table row
  const handleBillingTypeChange = (projectId, newType) => {
    setProjects(projects.map((p) =>
      p.id === projectId ? { ...p, billingType: newType } : p
    ));
  };

  return (
    <div className="pm-wrapper">
      {/* Header */}
      <div className="pm-header">
        <div className="pm-title">
          <svg className="pm-folder-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f6ad55" width="22" height="22">
            <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z"/>
          </svg>
          <h1>Project Management</h1>
        </div>
        <button className="btn-add-project" onClick={handleOpenAdd}>
          + Add Project
        </button>
      </div>

      {/* Table */}
      <div className="pm-table-container">
        <table className="pm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Type</th>
              <th>Complexity</th>
              <th>Rate</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.length === 0 ? (
              <tr>
                <td colSpan={7} className="pm-empty">No projects found.</td>
              </tr>
            ) : (
              paginatedProjects.map((project) => (
                <tr key={project.id} className="pm-row">
                  <td className="pm-name">{project.name}</td>
                  <td className="pm-desc">{project.description || "-"}</td>
                  <td>
                    <select
                      className="billing-type-select"
                      value={project.billingType}
                      onChange={(e) => handleBillingTypeChange(project.id, e.target.value)}
                    >
                      {BILLING_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={`badge ${complexityClass(project.complexity)}`}>
                      {project.complexity}
                    </span>
                  </td>
                  <td className="pm-rate">{project.rate || "-"}</td>
                  <td>
                    <span className={`badge badge--status ${project.status === "Active" ? "badge--active" : "badge--inactive"}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="pm-actions">
                    <button
                      className="action-btn action-btn--edit"
                      onClick={() => handleOpenEdit(project)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn action-btn--delete"
                      onClick={() => handleOpenDelete(project)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pm-pagination">
        <div className="pm-pagination-left">
          <label>Items per page:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="pm-pagination-right">
          {totalPages > 1 && (
            <>
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >‹</button>
              <span className="page-info">Page {currentPage} of {totalPages}</span>
              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >›</button>
            </>
          )}
          <span className="page-count">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
          </span>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add New Project</h2>
            <ProjectForm
              form={form}
              errors={errors}
              onChange={handleFormChange}
              showActive={false}
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-submit" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Edit Project</h2>
            <ProjectForm
              form={form}
              errors={errors}
              onChange={handleFormChange}
              showActive={true}
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn-submit" onClick={handleUpdate}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal modal--confirm" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h2 className="modal-title">Delete Project</h2>
            <p className="confirm-text">
              Are you sure you want to delete <strong>{selectedProject?.name}</strong>? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn-danger" onClick={handleDelete}>OK, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectForm({ form, errors, onChange, showActive }) {
  return (
    <div className="form-body">
      <div className="form-group">
        <label className="form-label">Name <span className="required">*</span></label>
        <input
          className={`form-input ${errors.name ? "form-input--error" : ""}`}
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Project name"
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={3}
          placeholder="Optional description..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Type <span className="required">*</span></label>
        <select
          className={`form-select ${errors.billingType ? "form-input--error" : ""}`}
          value={form.billingType}
          onChange={(e) => onChange("billingType", e.target.value)}
        >
          {BILLING_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        {errors.billingType && <span className="form-error">{errors.billingType}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Complexity Level <span className="required">*</span></label>
        <select
          className={`form-select ${errors.complexity ? "form-input--error" : ""}`}
          value={form.complexity}
          onChange={(e) => onChange("complexity", e.target.value)}
        >
          {COMPLEXITY_LEVELS.map((c) => <option key={c}>{c}</option>)}
        </select>
        {errors.complexity && <span className="form-error">{errors.complexity}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Rate Per Page (₹) <span className="required">*</span></label>
        <input
          className={`form-input ${errors.ratePerPage ? "form-input--error" : ""}`}
          type="number"
          min="0"
          step="0.01"
          value={form.ratePerPage}
          onChange={(e) => onChange("ratePerPage", e.target.value)}
        />
        <span className="form-hint">Amount per page for PDF/EPUB/XML/HTML conversion</span>
        {errors.ratePerPage && <span className="form-error">{errors.ratePerPage}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Hourly Rate (₹) <span className="optional">(Optional)</span></label>
        <input
          className="form-input"
          type="number"
          min="0"
          step="0.01"
          value={form.hourlyRate}
          onChange={(e) => onChange("hourlyRate", e.target.value)}
        />
        <span className="form-hint">For additional time-based calculations or reference</span>
      </div>

      {showActive && (
        <div className="form-group form-group--checkbox">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => onChange("active", e.target.checked)}
            />
            <span className="checkbox-text">Active</span>
          </label>
        </div>
      )}
    </div>
  );
}