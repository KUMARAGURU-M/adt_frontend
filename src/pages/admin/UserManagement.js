// src/pages/admin/UserManagement.js

import React, { useState } from 'react';
import './UserManagement.css';

/* ─── Static seed data ─────────────────────────────────────────── */
const initialUsers = [
  { id: 1, initial: 'S', name: 'Sureka',         email: 'sureka@arrowdatatech.com',   phone: '-',          role: 'employee', shift: 'General Shift', top: false, status: 'Active' },
  { id: 2, initial: 'A', name: 'Ayeesha M',       email: 'vimala@arrowdatatech.com',   phone: '9791778036', role: 'manager',  shift: '-',             top: false, status: 'Active' },
  { id: 3, initial: 'S', name: 'Shakina A',       email: 'shakina@arrowdatatech.com',  phone: '9944732344', role: 'manager',  shift: '-',             top: false, status: 'Active' },
  { id: 4, initial: 'T', name: 'T. Mohamed Usen', email: 'usen@arrowdatatech.com',     phone: '9894562152', role: 'admin',    shift: '-',             top: false, status: 'Active' },
  { id: 5, initial: 'K', name: 'Karthika',        email: 'karthika@arrowdatatech.com', phone: '-',          role: 'employee', shift: '-',             top: true,  status: 'Active' },
];

const ALL_PROJECTS = [
  'LDM - Hanser', 'ING - Usen', 'ING - OUP', 'LDM - T&F',
  'LDM - WILEY', 'CNT', 'IMP - EPUB', 'CMT - JATS', 'ING - ACDC',
];
const ALL_PROCESSES = [
  'EPUB - QC Process', 'EPUB - Tagging', 'FIG - Croping',
  'INDEX - Process', 'MATH - Keying', 'OCR - Process',
  'Proof Reading - Process', 'REF - Process', 'TABLE - Process',
];
const ALL_ROLES  = ['Employee', 'Manager', 'Admin'];
const ALL_SHIFTS = ['General Shift', 'Morning Shift', 'Night Shift'];

/* ─── Overlay wrapper ───────────────────────────────────────────── */
const Modal = ({ onClose, children }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-box" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   0. ADD NEW USER
══════════════════════════════════════════════════════════════════ */
const AddUserModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name:     '',
    email:    '',
    phone:    '',
    role:     'employee',
    shift:    '',
    timezone: 'Asia/Kolkata',
    top:      false,
    calendar: false,
    active:   true,
  });
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    return e;
  };

  const handleCreate = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({
      id:      Date.now(),
      initial: form.name.charAt(0).toUpperCase(),
      name:    form.name.trim(),
      email:   form.email.trim(),
      phone:   form.phone.trim() || '-',
      role:    form.role,
      shift:   form.shift || '-',
      top:     form.top,
      status:  form.active ? 'Active' : 'Inactive',
    });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="modal-title">Add New User</h2>

      {/* Name */}
      <div className="form-group">
        <label className="form-label">Name <span className="req">*</span></label>
        <input
          className="form-input"
          placeholder=""
          value={form.name}
          onChange={e => set('name', e.target.value)}
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      {/* Email */}
      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          className="form-input"
          placeholder=""
          value={form.email}
          onChange={e => set('email', e.target.value)}
        />
        {errors.email && <p className="form-error">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div className="form-group">
        <label className="form-label">Phone Number</label>
        <input
          className="form-input"
          placeholder="+91 1234567890"
          value={form.phone}
          onChange={e => set('phone', e.target.value)}
        />
      </div>

      {/* Profile Photo */}
      <div className="form-group">
        <label className="form-label">Profile Photo</label>
        <input type="file" className="form-input file-input" accept="image/*" />
      </div>

      {/* Role */}
      <div className="form-group">
        <label className="form-label">Role</label>
        <select
          className="form-select"
          value={form.role}
          onChange={e => set('role', e.target.value)}
        >
          {ALL_ROLES.map(r => (
            <option key={r} value={r.toLowerCase()}>{r}</option>
          ))}
        </select>
      </div>

      {/* Shift */}
      <div className="form-group">
        <label className="form-label">Shift</label>
        <select
          className="form-select"
          value={form.shift}
          onChange={e => set('shift', e.target.value)}
        >
          <option value="">Select Shift</option>
          {ALL_SHIFTS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <p className="form-hint">
          Set the employee's default shift. This will be used automatically when they start tracking time.
        </p>
      </div>

      {/* Timezone */}
      <div className="form-group">
        <label className="form-label">Timezone</label>
        <input
          className="form-input"
          value={form.timezone}
          onChange={e => set('timezone', e.target.value)}
        />
      </div>

      {/* Top Performer */}
      <div className="form-check-group">
        <label className="check-label">
          <input
            type="checkbox"
            checked={form.top}
            onChange={e => set('top', e.target.checked)}
          />
          ⭐ Mark as Top Performer
        </label>
        <p className="form-hint">Top performers will be displayed on the login page.</p>
      </div>

      {/* Calendar Stats */}
      <div className="form-check-group">
        <label className="check-label">
          <input
            type="checkbox"
            checked={form.calendar}
            onChange={e => set('calendar', e.target.checked)}
          />
          Show Calendar Statistics (Weekly/Monthly)
        </label>
        <p className="form-hint">
          Allow this employee to view weekly and monthly calendar statistics in the employee portal.
        </p>
      </div>

      {/* KYC Documents */}
      <div className="form-group">
        <label className="form-label">Onboarding/KYC Documents</label>
        <input type="file" className="form-input file-input" multiple />
      </div>

      {/* Active */}
      <div className="form-check-group">
        <label className="check-label">
          <input
            type="checkbox"
            checked={form.active}
            onChange={e => set('active', e.target.checked)}
          />
          Active
        </label>
        <p className="form-hint">New users are active by default. Uncheck to create an inactive user.</p>
      </div>

      {/* Footer */}
      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-primary-modal" onClick={handleCreate}>Create</button>
      </div>
    </Modal>
  );
};

/* ══════════════════════════════════════════════════════════════════
   1. ASSIGN PROJECT & PROCESS
══════════════════════════════════════════════════════════════════ */
const AssignProjectModal = ({ user, onClose }) => {
  const [selProjects,  setSelProjects]  = useState([]);
  const [selProcesses, setSelProcesses] = useState([]);

  const toggle = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const selectAll = (list, set) =>
    set(prev => prev.length === list.length ? [] : [...list]);

  const handleSave = () => {
    alert(`Saved assignments for ${user.name}.\nProjects: ${selProjects.join(', ') || 'None'}\nProcesses: ${selProcesses.join(', ') || 'None'}`);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="modal-title">Assign Projects &amp; Processes to {user.name}</h2>

      <div className="assign-columns">
        <div className="assign-col">
          <div className="assign-col-header">
            <span className="assign-col-icon">📁</span>
            <strong>Projects</strong>
          </div>
          <div className="assign-list">
            <label className="assign-check select-all">
              <input
                type="checkbox"
                checked={selProjects.length === ALL_PROJECTS.length}
                onChange={() => selectAll(ALL_PROJECTS, setSelProjects)}
              />
              Select All ({selProjects.length}/{ALL_PROJECTS.length})
            </label>
            {ALL_PROJECTS.map(p => (
              <label key={p} className="assign-check">
                <input
                  type="checkbox"
                  checked={selProjects.includes(p)}
                  onChange={() => toggle(selProjects, setSelProjects, p)}
                />
                {p}
              </label>
            ))}
          </div>
        </div>

        <div className="assign-col">
          <div className="assign-col-header">
            <span className="assign-col-icon">⚙️</span>
            <strong>Processes</strong>
          </div>
          <div className="assign-list">
            <label className="assign-check select-all">
              <input
                type="checkbox"
                checked={selProcesses.length === ALL_PROCESSES.length}
                onChange={() => selectAll(ALL_PROCESSES, setSelProcesses)}
              />
              Select All ({selProcesses.length}/{ALL_PROCESSES.length})
            </label>
            {ALL_PROCESSES.map(p => (
              <label key={p} className="assign-check">
                <input
                  type="checkbox"
                  checked={selProcesses.includes(p)}
                  onChange={() => toggle(selProcesses, setSelProcesses, p)}
                />
                {p}
              </label>
            ))}
          </div>
        </div>
      </div>

      <p className="assign-note">
        📝 Note: Only assigned projects and processes will appear in the employee's dropdown when they log in.
      </p>

      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-primary-modal" onClick={handleSave}>Save Assignments</button>
      </div>
    </Modal>
  );
};

/* ══════════════════════════════════════════════════════════════════
   2. ASSIGN ROLE
══════════════════════════════════════════════════════════════════ */
const AssignRoleModal = ({ user, onClose }) => {
  const [role, setRole] = useState('');

  const handleAssign = () => {
    if (!role) { alert('Please select a role.'); return; }
    alert(`Role "${role}" assigned to ${user.name}.`);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="modal-title">Assign Role to {user.name}</h2>

      <div className="form-group">
        <label className="form-label">Select Role</label>
        <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
          <option value="">-- Select Role --</option>
          {ALL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-primary-modal" onClick={handleAssign}>Assign Role</button>
      </div>
    </Modal>
  );
};

/* ══════════════════════════════════════════════════════════════════
   3. IMPERSONATE USER
══════════════════════════════════════════════════════════════════ */
const ImpersonateModal = ({ user, onClose }) => {
  const handleContinue = () => {
    alert(`Impersonating ${user.name}. A new window would open in production.`);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="modal-title">👤 Impersonate User</h2>

      <div className="impersonate-info">
        <p className="impersonate-label">You are about to impersonate:</p>
        <div className="impersonate-user-card">
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>
        <div className="impersonate-warning">
          ⚠️ The employee portal will open in a new window. All actions will be logged with your admin account.
        </div>
      </div>

      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-primary-modal" onClick={handleContinue}>Continue</button>
      </div>
    </Modal>
  );
};

/* ══════════════════════════════════════════════════════════════════
   4. SET PASSWORD
══════════════════════════════════════════════════════════════════ */
const SetPasswordModal = ({ user, onClose }) => {
  const [pw,  setPw]  = useState('');
  const [cpw, setCpw] = useState('');
  const [err, setErr] = useState('');

  const handleSet = () => {
    if (pw.length < 6) { setErr('Password must be at least 6 characters.'); return; }
    if (pw !== cpw)    { setErr('Passwords do not match.'); return; }
    alert(`Password set for ${user.name}.`);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="modal-title">Set Password — {user.name}</h2>

      <div className="form-group">
        <label className="form-label">New Password <span className="req">*</span></label>
        <input
          type="password"
          className="form-input"
          placeholder="Enter new password (min 6 characters)"
          value={pw}
          onChange={e => { setPw(e.target.value); setErr(''); }}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Confirm Password <span className="req">*</span></label>
        <input
          type="password"
          className="form-input"
          placeholder="Confirm new password"
          value={cpw}
          onChange={e => { setCpw(e.target.value); setErr(''); }}
        />
      </div>

      {err && <p className="form-error">{err}</p>}

      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-primary-modal" onClick={handleSet}>Set Password</button>
      </div>
    </Modal>
  );
};

/* ══════════════════════════════════════════════════════════════════
   5. RESET PASSWORD
══════════════════════════════════════════════════════════════════ */
const ResetPasswordModal = ({ user, onClose }) => {
  const handleReset = () => {
    alert(`Password reset link sent to ${user.email}.`);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="modal-title">🔄 Reset Password</h2>

      <div className="impersonate-info">
        <p className="impersonate-label">A password reset link will be sent to:</p>
        <div className="impersonate-user-card">
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>
        <div
          className="impersonate-warning"
          style={{ background: '#e0f2fe', borderColor: '#0ea5e9', color: '#0c4a6e' }}
        >
          ℹ️ The user will receive an email with instructions to reset their password.
        </div>
      </div>

      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-primary-modal" onClick={handleReset}>Send Reset Link</button>
      </div>
    </Modal>
  );
};

/* ══════════════════════════════════════════════════════════════════
   6. EDIT USER
══════════════════════════════════════════════════════════════════ */
const EditUserModal = ({ user, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    name:     user.name,
    email:    user.email,
    phone:    user.phone === '-' ? '' : user.phone,
    role:     user.role,
    shift:    user.shift === '-' ? '' : user.shift,
    timezone: 'Asia/Kolkata',
    top:      user.top,
    calendar: true,
    active:   user.status === 'Active',
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleUpdate = () => {
    onUpdate({
      ...user,
      name:    form.name,
      email:   form.email,
      phone:   form.phone || '-',
      role:    form.role,
      shift:   form.shift || '-',
      top:     form.top,
      status:  form.active ? 'Active' : 'Inactive',
      initial: form.name.charAt(0).toUpperCase(),
    });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="modal-title">Edit User</h2>

      <div className="form-group">
        <label className="form-label">Name <span className="req">*</span></label>
        <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input className="form-input" value={form.email} onChange={e => set('email', e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">Phone Number</label>
        <input className="form-input" placeholder="+91 1234567890" value={form.phone} onChange={e => set('phone', e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">Profile Photo</label>
        <input type="file" className="form-input file-input" accept="image/*" />
      </div>

      <div className="form-group">
        <label className="form-label">Role</label>
        <select className="form-select" value={form.role} onChange={e => set('role', e.target.value)}>
          {ALL_ROLES.map(r => <option key={r} value={r.toLowerCase()}>{r}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Shift</label>
        <select className="form-select" value={form.shift} onChange={e => set('shift', e.target.value)}>
          <option value="">-- None --</option>
          {ALL_SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <p className="form-hint">Set the employee's default shift. This will be used automatically when they start tracking time.</p>
      </div>

      <div className="form-group">
        <label className="form-label">Timezone</label>
        <input className="form-input" value={form.timezone} onChange={e => set('timezone', e.target.value)} />
      </div>

      <div className="form-check-group">
        <label className="check-label">
          <input type="checkbox" checked={form.top} onChange={e => set('top', e.target.checked)} />
          ⭐ Mark as Top Performer
        </label>
        <p className="form-hint">Top performers will be displayed on the login page.</p>
      </div>

      <div className="form-check-group">
        <label className="check-label">
          <input type="checkbox" checked={form.calendar} onChange={e => set('calendar', e.target.checked)} />
          Show Calendar Statistics (Weekly/Monthly)
        </label>
        <p className="form-hint">Allow this employee to view weekly and monthly calendar statistics in the employee portal.</p>
      </div>

      <div className="form-group">
        <label className="form-label">Onboarding/KYC Documents</label>
        <input type="file" className="form-input file-input" multiple />
      </div>

      <div className="form-check-group">
        <label className="check-label">
          <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} />
          Active
        </label>
        <p className="form-hint">Deactivate to prevent this user from logging in.</p>
      </div>

      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-primary-modal" onClick={handleUpdate}>Update</button>
      </div>
    </Modal>
  );
};

/* ══════════════════════════════════════════════════════════════════
   7. DELETE USER
══════════════════════════════════════════════════════════════════ */
const DeleteModal = ({ user, onClose, onDelete }) => {
  const handleDelete = () => {
    onDelete(user.id);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="delete-modal">
        <div className="delete-icon">🗑️</div>
        <h2 className="modal-title">Delete User</h2>
        <p className="delete-msg">
          Are you sure you want to delete <strong>{user.name}</strong>?<br />
          This action cannot be undone.
        </p>
        <div className="modal-actions centered">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-danger-modal" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </Modal>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
const UserManagement = () => {
  const [users,       setUsers]       = useState(initialUsers);
  const [modal,       setModal]       = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  const open  = (type, user) => setModal({ type, user });
  const close = ()            => setModal(null);

  const handleUpdate = (updated) =>
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));

  const handleDelete = (id) =>
    setUsers(prev => prev.filter(u => u.id !== id));

  const handleAdd = (newUser) =>
    setUsers(prev => [...prev, newUser]);

  return (
    <div className="user-mgmt-container">

      {/* ── Header ── */}
      <div className="mgmt-header">
        <div className="header-left">
          <span className="mgmt-icon">👥</span>
          <h2>User Management</h2>
        </div>
        <button className="add-user-btn" onClick={() => setShowAddUser(true)}>
          + Add User
        </button>
      </div>

      {/* ── Table ── */}
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Shift</th>
              <th>Top Performer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td><div className="avatar-circle">{user.initial}</div></td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span>
                </td>
                <td>{user.shift}</td>
                <td>{user.top && <span className="top-performer">⭐ Top Performer</span>}</td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>{user.status}</span>
                </td>

                {/* ── ACTION DROPDOWN ── */}
                <td>
                  <select
                    className="action-dropdown"
                    defaultValue=""
                    onChange={e => {
                      const action = e.target.value;
                      if (action) open(action, user);
                      e.target.value = "";
                    }}
                  >
                    <option value="" disabled>⚙️ Actions</option>
                    <option value="assign">🗒️ Assign Project &amp; Process</option>
                    <option value="role">🔐 Assign Role</option>
                    <option value="impersonate">👤 Impersonate User</option>
                    <option value="setpw">🔑 Set Password</option>
                    <option value="resetpw">🔄 Reset Password</option>
                    <option value="edit">✏️ Edit User</option>
                    <option value="delete">🗑️ Delete User</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Add User Modal ── */}
      {showAddUser && (
        <AddUserModal
          onClose={() => setShowAddUser(false)}
          onAdd={handleAdd}
        />
      )}

      {/* ── Action Modals ── */}
      {modal?.type === 'assign'      && <AssignProjectModal  user={modal.user} onClose={close} />}
      {modal?.type === 'role'        && <AssignRoleModal     user={modal.user} onClose={close} />}
      {modal?.type === 'impersonate' && <ImpersonateModal    user={modal.user} onClose={close} />}
      {modal?.type === 'setpw'       && <SetPasswordModal    user={modal.user} onClose={close} />}
      {modal?.type === 'resetpw'     && <ResetPasswordModal  user={modal.user} onClose={close} />}
      {modal?.type === 'edit'        && <EditUserModal        user={modal.user} onClose={close} onUpdate={handleUpdate} />}
      {modal?.type === 'delete'      && <DeleteModal          user={modal.user} onClose={close} onDelete={handleDelete} />}

    </div>
  );
};

export default UserManagement;