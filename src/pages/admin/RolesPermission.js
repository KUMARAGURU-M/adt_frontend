import React, { useState } from 'react';
import './RolesPermission.css';

const initialRoles = [
  { id: 1, name: 'Admin', description: 'Full system access', active: true },
  { id: 2, name: 'Manager', description: 'Management access - can view all data and manage employees', active: true },
  { id: 3, name: 'Employee', description: 'Standard employee access', active: true },
  { id: 4, name: 'Viewer', description: 'Read-only access', active: true },
  { id: 5, name: 'Team Leader', description: 'Team Leader', active: true }
];

const initialPermissions = [
  { id: 1, name: 'employees.view', description: 'View employees' },
  { id: 2, name: 'employees.view_all', description: 'View all employees (including inactive)' },
  { id: 3, name: 'employees.create', description: 'Create new employees' },
  { id: 4, name: 'employees.update', description: 'Update employee details' },
  { id: 5, name: 'employees.delete', description: 'Delete employees' },
  { id: 6, name: 'employees.manage_roles', description: 'Assign roles to employees' },
  { id: 7, name: 'projects.view', description: 'View projects' },
  { id: 8, name: 'projects.create', description: 'Create new projects' },
  { id: 9, name: 'projects.update', description: 'Update projects' },
  { id: 10, name: 'projects.delete', description: 'Delete projects' },
  { id: 11, name: 'jobs.view', description: 'View jobs' },
  { id: 12, name: 'jobs.create', description: 'Create new jobs' },
  { id: 13, name: 'jobs.update', description: 'Update jobs' },
  { id: 14, name: 'jobs.delete', description: 'Delete jobs' },
  { id: 15, name: 'jobs.bulk_import', description: 'Bulk import jobs' },
  { id: 16, name: 'timelogs.view', description: 'View own time logs' },
  { id: 17, name: 'timelogs.view_all', description: 'View all employees\' time logs' },
  { id: 18, name: 'timelogs.create', description: 'Create time logs' },
  { id: 19, name: 'timelogs.update', description: 'Update time logs' },
  { id: 20, name: 'timelogs.delete', description: 'Delete time logs' },
  { id: 21, name: 'leaves.view', description: 'View own leave requests' },
  { id: 22, name: 'leaves.view_all', description: 'View all leave requests' },
  { id: 23, name: 'leaves.create', description: 'Create leave requests' },
  { id: 24, name: 'leaves.approve', description: 'Approve/reject leave requests' },
  { id: 25, name: 'leaves.manage_types', description: 'Manage leave types and policies' }
];

const resourcesList = [
  { id: 'employees', label: 'Users/Employees', icon: '👥' },
  { id: 'projects', label: 'Projects', icon: '📁' },
  { id: 'jobs', label: 'Jobs', icon: '🗂️' },
  { id: 'leaves', label: 'Leaves', icon: '🏖️' },
  { id: 'tags', label: 'Tags', icon: '🏷️' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'processes', label: 'Processes', icon: '⚙️' },
  { id: 'shifts', label: 'Shifts', icon: '⏱️' },
  { id: 'timelogs', label: 'Time Logs', icon: '➡️' },
  { id: 'reports', label: 'Reports', icon: '📈' },
  { id: 'activitylogs', label: 'Activity Logs', icon: '📋' },
  { id: 'roles', label: 'Roles & Permissions', icon: '🔐' },
];

const actionsList = [
  { id: 'create', label: 'Create', desc: 'Create new records' },
  { id: 'update', label: 'Update', desc: 'Edit existing records' },
  { id: 'delete', label: 'Delete', desc: 'Delete records' },
  { id: 'approve', label: 'Approve', desc: 'Approve requests' },
  { id: 'export', label: 'Export', desc: 'Export data' },
  { id: 'manage_roles', label: 'Manage Roles', desc: 'Assign roles to users' },
  { id: 'manage_types', label: 'Manage Types', desc: 'Manage types/policies' },
  { id: 'bulk_import', label: 'Bulk Import', desc: 'Bulk import data' },
];

const RolesPermission = () => {
  const [roles, setRoles] = useState(initialRoles);
  const [permissions, setPermissions] = useState(initialPermissions);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleFormData, setRoleFormData] = useState({ name: '', description: '', active: true });

  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRole, setDeletingRole] = useState(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningRole, setAssigningRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [permResource, setPermResource] = useState('shifts');
  const [permActions, setPermActions] = useState([]);
  const [permDescription, setPermDescription] = useState('');
  const [permActive, setPermActive] = useState(true);

  // Role Handlers
  const handleOpenAddRole = () => {
    setEditingRole(null);
    setRoleFormData({ name: '', description: '', active: true });
    setIsRoleModalOpen(true);
  };

  const handleOpenEditRole = (role) => {
    setEditingRole(role);
    setRoleFormData({ name: role.name, description: role.description, active: role.active });
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = () => {
    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...r, ...roleFormData } : r));
    } else {
      setRoles([...roles, { ...roleFormData, id: Date.now() }]);
    }
    setIsRoleModalOpen(false);
  };

  // Delete Role Handlers
  const handleOpenDeleteRole = (role) => {
    setDeletingRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setRoles(roles.filter(r => r.id !== deletingRole.id));
    setIsDeleteModalOpen(false);
    setDeletingRole(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingRole(null);
  };

  // Assign Permission Handlers
  const handleOpenAssignPermission = (role) => {
    setAssigningRole(role);
    if (role.name === 'Admin') {
      setSelectedPermissions(permissions.map(p => p.id));
    } else {
      setSelectedPermissions([]);
    }
    setIsAssignModalOpen(true);
  };

  const handleToggleAssignPermission = (permId) => {
    if (selectedPermissions.includes(permId)) {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permId));
    } else {
      setSelectedPermissions([...selectedPermissions, permId]);
    }
  };

  const handleSaveAssignPermission = () => {
    setIsAssignModalOpen(false);
  };

  // Create Permission Handlers
  const handleOpenAddPermission = () => {
    setPermResource('shifts');
    setPermActions([]);
    setPermDescription('');
    setPermActive(true);
    setIsPermissionModalOpen(true);
  };

  const handleTogglePermAction = (actionId) => {
    if (permActions.includes(actionId)) {
      setPermActions(permActions.filter(id => id !== actionId));
    } else {
      setPermActions([...permActions, actionId]);
    }
  };

  // Select All / Deselect All for Resources (Step 1)
  const allResourceIds = resourcesList.map(r => r.id);
  const allResourcesSelected = allResourceIds.every(id => permResource === id) === false
    ? false
    : true;
  // Since resource is a single-select (radio), "Select All" here means we select all via a
  // special multi-select state. We'll treat Step 1 as multi-select for Select All support.
  // Actually, based on original code permResource is a single string. We'll keep it single
  // but add a visual "select all" that cycles — better UX: let's make resources multi-select
  // to support select all properly.
  // We'll introduce permResources (array) alongside permResource for backward compat.
  // For simplicity, we'll just implement Select All for the actions (Step 2) which is already
  // multi-select, and for Step 1 we'll make it also multi-select with Select All.

  const handleSelectAllActions = () => {
    if (permActions.length === actionsList.length) {
      setPermActions([]);
    } else {
      setPermActions(actionsList.map(a => a.id));
    }
  };

  const allActionsSelected = permActions.length === actionsList.length;

  // For Step 1 resources - convert to multi-select with select all
  // We'll store selected resources as array
  const [permResources, setPermResources] = useState([]);

  const handleToggleResource = (resId) => {
    if (permResources.includes(resId)) {
      setPermResources(permResources.filter(id => id !== resId));
    } else {
      setPermResources([...permResources, resId]);
    }
  };

  const handleSelectAllResources = () => {
    if (permResources.length === resourcesList.length) {
      setPermResources([]);
    } else {
      setPermResources(resourcesList.map(r => r.id));
    }
  };

  const allResourcesChecked = permResources.length === resourcesList.length;

  const handleOpenAddPermissionReset = () => {
    setPermResources([]);
    setPermActions([]);
    setPermDescription('');
    setPermActive(true);
    setIsPermissionModalOpen(true);
  };

  const handleSavePermission = () => {
    const newPerms = [];
    permResources.forEach(resource => {
      permActions.forEach(action => {
        const resourceData = resourcesList.find(r => r.id === resource);
        newPerms.push({
          id: Date.now() + Math.random(),
          name: `${resource}.${action}`,
          description: permDescription || `${actionsList.find(a => a.id === action).label} ${resourceData.label.toLowerCase()}`
        });
      });
    });
    setPermissions([...permissions, ...newPerms]);
    setIsPermissionModalOpen(false);
  };

  const totalNewPerms = permResources.length * permActions.length;

  return (
    <div className="rp-container">
      <div className="rp-header-bar">
        <h2><span role="img" aria-label="lock" style={{marginRight: '8px'}}>🔐</span> Role & Permission Management</h2>
        <div className="rp-header-actions">
          <button className="rp-btn rp-btn-primary" onClick={handleOpenAddRole}>+ Add Role</button>
          <button className="rp-btn rp-btn-success" onClick={handleOpenAddPermissionReset}>+ Add Permission</button>
        </div>
      </div>

      <div className="rp-section">
        <h3 className="rp-section-title">Roles</h3>
        <div className="rp-grid rp-roles-grid">
          {roles.map(role => (
            <div key={role.id} className="rp-card">
              <div className="rp-card-header">
                <h4 className="rp-card-title">{role.name}</h4>
                {role.active && <span className="rp-badge rp-badge-active">Active</span>}
              </div>
              <div className="rp-card-body">
                <p className="rp-card-desc">{role.description}</p>
              </div>
              <div className="rp-card-actions">
                <button className="rp-icon-btn rp-icon-btn-edit" onClick={() => handleOpenEditRole(role)} title="Edit Role">✏️</button>
                <button className="rp-icon-btn rp-icon-btn-assign" onClick={() => handleOpenAssignPermission(role)} title="Assign Permission">🔐</button>
                <button className="rp-icon-btn rp-icon-btn-delete" onClick={() => handleOpenDeleteRole(role)} title="Delete Role">🗑️</button>
              </div>
            </div>
          ))}
        </div>
        <div className="rp-pagination">
          <div className="rp-items-per-page">
            Items per page:
            <select defaultValue="25">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="rp-pagination-info">Showing 1 to {roles.length} of {roles.length} items</div>
        </div>
      </div>

      <div className="rp-section">
        <div className="rp-section-header">
          <h3 className="rp-section-title">Permissions</h3>
          <select className="rp-filter-select" defaultValue="all">
            <option value="all">All Resources</option>
            <option value="users">Users/Employees</option>
            <option value="projects">Projects</option>
            <option value="jobs">Jobs</option>
          </select>
        </div>
        <div className="rp-grid rp-permissions-grid">
          {permissions.map(perm => (
            <div key={perm.id} className="rp-perm-card">
              <h5 className="rp-perm-name">{perm.name}</h5>
              <div className="rp-perm-id">{perm.name.replace('.', '_')}</div>
              <p className="rp-perm-desc">{perm.description}</p>
            </div>
          ))}
        </div>
        <div className="rp-pagination">
          <div className="rp-items-per-page">
            Items per page:
            <select defaultValue="25">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="rp-pagination-info">Showing 1 to 25 of 55 items</div>
          <div className="rp-pagination-controls">
            <button disabled>&laquo;</button>
            <button disabled>&lsaquo;</button>
            <button className="rp-active-page">1</button>
            <button>2</button>
            <button>3</button>
            <button>&rsaquo;</button>
            <button>&raquo;</button>
          </div>
        </div>
      </div>

      {/* Modals */}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="rp-modal-overlay">
          <div className="rp-modal rp-modal-confirm">
            <div className="rp-modal-header rp-modal-header-danger">
              <div className="rp-confirm-icon">🗑️</div>
              <h2>Delete Role</h2>
            </div>
            <div className="rp-modal-body rp-confirm-body">
              <p className="rp-confirm-message">
                Are you sure you want to delete the role <strong>"{deletingRole?.name}"</strong>?
              </p>
              <p className="rp-confirm-warning">
                ⚠️ This action cannot be undone. All permissions assigned to this role will be removed.
              </p>
            </div>
            <div className="rp-modal-footer">
              <button className="rp-btn rp-btn-secondary" onClick={handleCancelDelete}>Cancel</button>
              <button className="rp-btn rp-btn-danger" onClick={handleConfirmDelete}>Yes, Delete Role</button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Role Modal */}
      {isRoleModalOpen && (
        <div className="rp-modal-overlay">
          <div className="rp-modal">
            <div className="rp-modal-header">
              <h2>{editingRole ? 'Edit Role' : 'Create Role'}</h2>
            </div>
            <div className="rp-modal-body">
              <div className="rp-form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={roleFormData.name}
                  onChange={e => setRoleFormData({...roleFormData, name: e.target.value})}
                  placeholder="e.g., manager, viewer"
                />
              </div>
              <div className="rp-form-group">
                <label>Description</label>
                <textarea
                  rows="4"
                  value={roleFormData.description}
                  onChange={e => setRoleFormData({...roleFormData, description: e.target.value})}
                  placeholder="Role description"
                ></textarea>
              </div>
              <div className="rp-form-checkbox">
                <input
                  type="checkbox"
                  id="roleActive"
                  checked={roleFormData.active}
                  onChange={e => setRoleFormData({...roleFormData, active: e.target.checked})}
                />
                <label htmlFor="roleActive">Active</label>
              </div>
            </div>
            <div className="rp-modal-footer">
              <button className="rp-btn rp-btn-secondary" onClick={() => setIsRoleModalOpen(false)}>Cancel</button>
              <button className="rp-btn rp-btn-primary" onClick={handleSaveRole}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Permissions Modal */}
      {isAssignModalOpen && (
        <div className="rp-modal-overlay">
          <div className="rp-modal rp-modal-lg">
            <div className="rp-modal-header">
              <h2>Assign Permissions to {assigningRole?.name}</h2>
            </div>
            <div className="rp-modal-body rp-modal-body-scrollable">
              <div className="rp-grid rp-assign-perm-grid">
                {permissions.map(perm => (
                  <div
                    key={perm.id}
                    className={`rp-assign-perm-item ${selectedPermissions.includes(perm.id) ? 'selected' : ''}`}
                    onClick={() => handleToggleAssignPermission(perm.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(perm.id)}
                      readOnly
                    />
                    <div className="rp-assign-perm-info">
                      <span className="rp-assign-perm-name">{perm.name}</span>
                      <span className="rp-assign-perm-id">{perm.name.replace('.', '_')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rp-modal-footer">
              <button className="rp-btn rp-btn-secondary" onClick={() => setIsAssignModalOpen(false)}>Cancel</button>
              <button className="rp-btn rp-btn-info" onClick={handleSaveAssignPermission}>Assign Permissions</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Permission Modal */}
      {isPermissionModalOpen && (
        <div className="rp-modal-overlay">
          <div className="rp-modal rp-modal-lg rp-create-perm-modal">
            <div className="rp-modal-header">
              <h2>Create Permission</h2>
            </div>
            <div className="rp-modal-body rp-modal-body-scrollable">

              {/* Step 1: Select Resource */}
              <div className="rp-step-section">
                <div className="rp-step-header">
                  <h4>Step 1: Select Resource</h4>
                  <button
                    className={`rp-btn rp-btn-select-all ${allResourcesChecked ? 'rp-btn-deselect' : ''}`}
                    onClick={handleSelectAllResources}
                  >
                    {allResourcesChecked ? '✕ Deselect All' : '✓ Select All'}
                  </button>
                </div>
                <div className="rp-resource-grid">
                  {resourcesList.map(res => (
                    <div
                      key={res.id}
                      className={`rp-resource-item ${permResources.includes(res.id) ? 'selected' : ''}`}
                      onClick={() => handleToggleResource(res.id)}
                    >
                      <input
                        type="checkbox"
                        checked={permResources.includes(res.id)}
                        readOnly
                      />
                      <span className="rp-resource-icon">{res.icon}</span>
                      <span className="rp-resource-label">{res.label}</span>
                    </div>
                  ))}
                </div>
                {permResources.length > 0 && (
                  <div className="rp-step-count-badge">
                    {permResources.length} resource{permResources.length !== 1 ? 's' : ''} selected
                  </div>
                )}
              </div>

              {/* Step 2: Select Actions */}
              <div className="rp-step-section mt-4">
                <div className="rp-step-header">
                  <h4>Step 2: Select Actions (can select multiple)</h4>
                  <button
                    className={`rp-btn rp-btn-select-all ${allActionsSelected ? 'rp-btn-deselect' : ''}`}
                    onClick={handleSelectAllActions}
                  >
                    {allActionsSelected ? '✕ Deselect All' : '✓ Select All'}
                  </button>
                </div>
                <div className="rp-action-grid">
                  {actionsList.map(action => (
                    <div
                      key={action.id}
                      className={`rp-action-item ${permActions.includes(action.id) ? 'selected' : ''}`}
                      onClick={() => handleTogglePermAction(action.id)}
                    >
                      <input
                        type="checkbox"
                        checked={permActions.includes(action.id)}
                        readOnly
                      />
                      <div className="rp-action-info">
                        <span className="rp-action-label">{action.label}</span>
                        <span className="rp-action-desc">{action.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {permActions.length > 0 && (
                  <div className="rp-step-count-badge rp-step-count-badge-green">
                    {permActions.length} action{permActions.length !== 1 ? 's' : ''} selected
                  </div>
                )}
              </div>

              {totalNewPerms > 0 && (
                <>
                  <div className="rp-summary-box mt-4">
                    <p><strong>Selected Resources:</strong> {permResources.map(r => resourcesList.find(res => res.id === r).label).join(', ')}</p>
                    <p><strong>Selected Actions:</strong> {permActions.map(a => actionsList.find(al => al.id === a).label).join(', ')}</p>
                    <p className="rp-text-muted">{totalNewPerms} permission{totalNewPerms !== 1 ? 's' : ''} will be created</p>
                  </div>

                  <div className="rp-generated-box mt-4">
                    <h5>📝 Auto-generated Permission Names:</h5>
                    <div className="rp-generated-list">
                      {permResources.map(resource =>
                        permActions.map(action => (
                          <div key={`${resource}.${action}`} className="rp-generated-name">
                            {resource}.{action}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="rp-form-group mt-4">
                <label>Description (Optional)</label>
                <textarea
                  rows="3"
                  value={permDescription}
                  onChange={e => setPermDescription(e.target.value)}
                  placeholder="Optional description for these permissions"
                ></textarea>
              </div>

              <div className="rp-form-checkbox mt-2">
                <input
                  type="checkbox"
                  id="permActive"
                  checked={permActive}
                  onChange={e => setPermActive(e.target.checked)}
                />
                <label htmlFor="permActive">Active</label>
              </div>

            </div>
            <div className="rp-modal-footer">
              <button className="rp-btn rp-btn-secondary" onClick={() => setIsPermissionModalOpen(false)}>Cancel</button>
              <button
                className="rp-btn rp-btn-success"
                onClick={handleSavePermission}
                disabled={totalNewPerms === 0}
              >
                Create {totalNewPerms > 0 ? totalNewPerms : ''} Permission{totalNewPerms !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RolesPermission;