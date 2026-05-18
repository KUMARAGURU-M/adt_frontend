// src/pages/admin/BooksJobs.js

import React, { useState, useMemo, useEffect } from 'react';
import './BooksJobs.css';

/* ─── Constants ─────────────────────────────────────────────────── */
const ALL_PROJECTS = [
  'LDM - Hanser', 'ING - Usen', 'ING - OUP', 'LDM - T&F',
  'LDM - WILEY', 'CNT', 'IMP - EPUB', 'CMT - JATS',
  'ING - ACDC', 'LDM - ASS_EPUB3',
];

const PDF_TYPES = [
  'PRINT-PDF', 'SCANNED-PDF', 'WORD', 'XML', 'HTML', 'EPUB', 'INDISGN',
];

const COMPLEXITY_OPTIONS = [
  { label: 'Simple',        color: '#22c55e' },
  { label: 'Medium',        color: '#f59e0b' },
  { label: 'Complex',       color: '#ef4444' },
  { label: 'Heavy complex', color: '#7c3aed' },
];

const STATUS_OPTIONS = [
  'FINISH', 'WIP', 'YTS',
  'RTU', 'UPLOADED', 'PENDING', 'HOLD', 'QUERY',
];

const FILE_STATUS_OPTIONS = ['Hold', 'Client Query', 'NOT_UPLOADED', 'UPLOADED'];

const BILLING_STATUS_OPTIONS = ['Credited', 'Pending', 'Invoiced'];

const REF_TYPES = [
  '-', 'BE-REF', 'CH-REF',
  'PE-REF', 'CH_BE-REF',
];

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

const ALL_BULK_FIELDS = [
  { key: "receiveDate", label: "Receive Date", mandatory: true },
  { key: "jobId", label: "Job ID", mandatory: true },
  { key: "title", label: "Title Name", mandatory: true },
  { key: "pageCount", label: "Page Count", mandatory: true },
  { key: "month", label: "Month" },
  { key: "isbn", label: "XML ISBN" },
  { key: "chapters", label: "Number of Chapters" },
  { key: "pdfType", label: "PDF Input Type" },
  { key: "complexity", label: "Complexity" },
  { key: "refType", label: "Reference Type" },
  { key: "status", label: "Status" },
  { key: "fileStatus", label: "File Status" },
  { key: "uploadDate", label: "Uploaded Date" },
  { key: "billing", label: "Billing Status" },
];

/* ─── Seed data ─────────────────────────────────────────────────── */
const seedJobs = [
  { id: 1, project: 'ING - ACDC',  month: 'FEB', receiveDate: '2026-02-01', jobId: 'ACDC-001',   isbn: '',                    title: 'The Author',                              pageCount: '',  pdfType: '',          complexity: '',        refType: '',                          status: '',          fileStatus: '',        uploadDate: '', billing: '' },
  { id: 2, project: 'CMT - JATS',  month: 'AUG', receiveDate: '2026-01-31', jobId: 'JATX0001',   isbn: 'is_v30_i2_d1767629676', title: 'is_v30_i2_d1767629676',               pageCount: '251', pdfType: 'PRINT-PDF',  complexity: 'Simple',  refType: 'Non reference',             status: 'PENDING',   fileStatus: 'NOT_UPLOADED', uploadDate: '2026-02-01', billing: '' },
  { id: 3, project: 'LDM - Hanser',month: 'JAN', receiveDate: '2026-01-29', jobId: 'HANS-0001',  isbn: '9783446480438',         title: 'TP25-0386_chv9783446477629_Joebstl',  pageCount: '161', pdfType: 'PRINT-PDF',  complexity: 'Simple',  refType: '',                          status: '',          fileStatus: '',        uploadDate: '', billing: '' },
  { id: 4, project: '',             month: 'OCT', receiveDate: '2001-10-21', jobId: 'CUP1793',    isbn: '9780521878739',         title: 'Strategic Legal Writing',             pageCount: '242', pdfType: 'PRINT-PDF',  complexity: 'Medium',  refType: '',                          status: '',          fileStatus: '',        uploadDate: '', billing: '' },
  { id: 5, project: '',             month: 'OCT', receiveDate: '2001-10-21', jobId: 'CUP1788',    isbn: '9780521875981',         title: 'The War for Palestine',               pageCount: '310', pdfType: 'PRINT-PDF',  complexity: 'Medium',  refType: '',                          status: '',          fileStatus: '',        uploadDate: '', billing: '' },
];

const EMPTY_FORM = {
  project: '', month: '', receiveDate: '', jobId: '', isbn: '',
  title: '', pageCount: '', chapters: '', pdfType: '', complexity: '',
  refType: '', status: '', fileStatus: '', uploadDate: '', billing: '',
};

/* ─── Complexity badge ───────────────────────────────────────────── */
const ComplexityBadge = ({ value }) => {
  const opt = COMPLEXITY_OPTIONS.find(o => o.label === value);
  if (!value || !opt) return <span className="cell-dash">-</span>;
  return (
    <span className="complexity-badge" style={{ background: opt.color + '22', color: opt.color, border: `1px solid ${opt.color}55` }}>
      {value}
    </span>
  );
};

/* ─── Status pill ────────────────────────────────────────────────── */
const StatusPill = ({ value, type }) => {
  if (!value) return <span className="cell-pink">-</span>;
  const cls = type === 'status'
    ? `status-pill sp-${value.toLowerCase().replace(/\s+/g, '-')}`
    : `filestatus-pill`;
  return <span className={cls}>{value}</span>;
};

/* ─── Modal wrapper ──────────────────────────────────────────────── */
const Modal = ({ onClose, children, wide, xl }) => (
  <div className="bj-modal-overlay" onClick={onClose}>
    <div className={`bj-modal-box${wide ? ' bj-modal-wide' : ''}${xl ? ' bj-modal-xl' : ''}`} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

/* ─── Shared form fields ─────────────────────────────────────────── */
const JobForm = ({ form, onChange, isEdit }) => (
  <div className="bj-form">
    {/* Project */}
    <div className="bj-form-group full">
      <label>Project (Publisher) <span className="req">*</span></label>
      <select value={form.project} onChange={e => onChange('project', e.target.value)}>
        <option value="">-- Select Publisher --</option>
        {ALL_PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
    </div>

    {/* Month + Receive Date */}
    <div className="bj-form-row">
      <div className="bj-form-group">
        <label>Month</label>
        <select value={form.month} onChange={e => onChange('month', e.target.value)}>
          <option value="">-- Select Month --</option>
          {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="bj-form-group">
        <label>Receive Date <span className="req">*</span></label>
        <input type="date" value={form.receiveDate} onChange={e => onChange('receiveDate', e.target.value)} />
      </div>
    </div>

    {/* Job ID + XML ISBN */}
    <div className="bj-form-row">
      <div className="bj-form-group">
        <label>Job ID <span className="req">*</span></label>
        <input placeholder="e.g., BM0748" value={form.jobId} onChange={e => onChange('jobId', e.target.value)} />
      </div>
      <div className="bj-form-group">
        <label>XML ISBN</label>
        <input placeholder="e.g., 9798216386377" value={form.isbn} onChange={e => onChange('isbn', e.target.value)} />
      </div>
    </div>

    {/* Title */}
    <div className="bj-form-group full">
      <label>Title Name <span className="req">*</span></label>
      <input placeholder="Book/Project Title" value={form.title} onChange={e => onChange('title', e.target.value)} />
    </div>

    {/* Page count + Chapters */}
    <div className="bj-form-row">
      <div className="bj-form-group">
        <label>Page Count <span className="req">*</span></label>
        <input placeholder="e.g., 540" value={form.pageCount} onChange={e => onChange('pageCount', e.target.value)} />
      </div>
      <div className="bj-form-group">
        <label>Number of Chapters (Optional)</label>
        <input placeholder="e.g., 12" value={form.chapters} onChange={e => onChange('chapters', e.target.value)} />
      </div>
    </div>

    {/* PDF/Input Type + Complexity */}
    <div className="bj-form-row">
      <div className="bj-form-group">
        <label>PDF / Input Type</label>
        <select value={form.pdfType} onChange={e => onChange('pdfType', e.target.value)}>
          <option value="">Select...</option>
          {PDF_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="bj-form-group">
        <label>Complexity</label>
        <select value={form.complexity} onChange={e => onChange('complexity', e.target.value)}>
          <option value="">Select...</option>
          {COMPLEXITY_OPTIONS.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
        </select>
      </div>
    </div>

    {/* Reference Type + Status */}
    <div className="bj-form-row">
      <div className="bj-form-group">
        <label>Reference Type</label>
        <select value={form.refType} onChange={e => onChange('refType', e.target.value)}>
          <option value="">Select...</option>
          {REF_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div className="bj-form-group">
        <label>Status</label>
        <select value={form.status} onChange={e => onChange('status', e.target.value)}>
          <option value="">Select...</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>

    {/* File Status + Upload Date */}
    <div className="bj-form-row">
      <div className="bj-form-group">
        <label>File Status</label>
        <select value={form.fileStatus} onChange={e => onChange('fileStatus', e.target.value)}>
          <option value="">Select...</option>
          {FILE_STATUS_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div className="bj-form-group">
        <label>Upload Date</label>
        <input type="date" value={form.uploadDate} onChange={e => onChange('uploadDate', e.target.value)} />
      </div>
    </div>

    {/* Billing Status */}
    <div className="bj-form-group" style={{ maxWidth: '50%' }}>
      <label>Billing Status</label>
      <select value={form.billing} onChange={e => onChange('billing', e.target.value)}>
        <option value="">Select...</option>
        {BILLING_STATUS_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
      </select>
    </div>
  </div>
);

/* ─── Add Job Modal ──────────────────────────────────────────────── */
const AddJobModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const change = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleCreate = () => {
    if (!form.project || !form.receiveDate || !form.jobId || !form.title || !form.pageCount) {
      alert('Please fill in required fields: Project, Receive Date, Job ID, Title Name, Page Count.'); return;
    }
    onAdd({ ...form, id: Date.now() });
    onClose();
  };

  return (
    <Modal onClose={onClose} wide>
      <h2 className="bj-modal-title">Add New Job</h2>
      <JobForm form={form} onChange={change} />
      <div className="bj-modal-actions">
        <button className="bj-btn-cancel" onClick={onClose}>Cancel</button>
        <button className="bj-btn-primary" onClick={handleCreate}>Create</button>
      </div>
    </Modal>
  );
};

/* ─── Edit Job Modal ─────────────────────────────────────────────── */
const EditJobModal = ({ job, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    project: job.project, month: job.month, receiveDate: job.receiveDate,
    jobId: job.jobId, isbn: job.isbn, title: job.title,
    pageCount: job.pageCount, chapters: job.chapters || '',
    pdfType: job.pdfType, complexity: job.complexity,
    refType: job.refType, status: job.status,
    fileStatus: job.fileStatus, uploadDate: job.uploadDate, billing: job.billing,
  });
  const change = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleUpdate = () => {
    if (!form.project || !form.receiveDate || !form.jobId || !form.title || !form.pageCount) {
      alert('Please fill in required fields: Project, Receive Date, Job ID, Title Name, Page Count.'); return;
    }
    onUpdate({ ...job, ...form });
    onClose();
  };

  return (
    <Modal onClose={onClose} wide>
      <h2 className="bj-modal-title">Edit Job</h2>
      <JobForm form={form} onChange={change} isEdit />
      <div className="bj-modal-actions">
        <button className="bj-btn-cancel" onClick={onClose}>Cancel</button>
        <button className="bj-btn-primary" onClick={handleUpdate}>Update</button>
      </div>
    </Modal>
  );
};

/* ─── Delete Confirm Modal ───────────────────────────────────────── */
const DeleteJobModal = ({ job, onClose, onDelete }) => (
  <Modal onClose={onClose}>
    <div className="bj-delete-modal">
      <div className="bj-delete-icon">🗑️</div>
      <h2 className="bj-modal-title">Delete Job</h2>
      <p className="bj-delete-msg">
        Are you sure you want to delete job <strong>{job.jobId}</strong>?<br />
        This action cannot be undone.
      </p>
      <div className="bj-modal-actions centered">
        <button className="bj-btn-cancel" onClick={onClose}>Cancel</button>
        <button className="bj-btn-danger" onClick={() => { onDelete(job.id); onClose(); }}>Delete</button>
      </div>
    </div>
  </Modal>
);

const BulkImportModal = ({ onClose, onAdd }) => {
  const [view, setView] = useState('main');
  const [selectedProject, setSelectedProject] = useState('');
  const [orderedFields, setOrderedFields] = useState([]);
  
  const [pasteText, setPasteText] = useState("");
  const [parsedJobs, setParsedJobs] = useState([]);

  useEffect(() => {
    if (selectedProject) {
      const allSettings = JSON.parse(localStorage.getItem('bj_bulk_settings') || '{}');
      if (allSettings[selectedProject]) {
        setOrderedFields(allSettings[selectedProject]);
      } else {
        setOrderedFields(ALL_BULK_FIELDS.filter(f => f.mandatory).map(f => f.key));
      }
      setPasteText('');
      setParsedJobs([]);
    }
  }, [selectedProject]);

  const toggleField = (key) => {
    setOrderedFields(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleSaveSettings = () => {
    const allSettings = JSON.parse(localStorage.getItem('bj_bulk_settings') || '{}');
    allSettings[selectedProject] = orderedFields;
    localStorage.setItem('bj_bulk_settings', JSON.stringify(allSettings));
    setView('main');
  };

  const getEffectiveFields = () => {
    const fields = orderedFields.map(key => ALL_BULK_FIELDS.find(f => f.key === key));
    const missing = ALL_BULK_FIELDS.filter(f => f.mandatory && !orderedFields.includes(f.key));
    return [...fields, ...missing];
  };

  const handleTextPaste = (text) => {
    setPasteText(text);
    if (!text.trim()) {
      setParsedJobs([]);
      return;
    }
    const rows = text.split(/\r?\n/).filter(r => r.trim());
    const effectiveFields = getEffectiveFields();
    
    const newJobs = rows.map((row, idx) => {
      const cols = row.split('\t');
      const job = { ...EMPTY_FORM, id: Date.now() + idx, project: selectedProject };
      effectiveFields.forEach((f, colIdx) => {
        if (cols[colIdx] !== undefined) {
          job[f.key] = cols[colIdx].trim();
        }
      });
      return job;
    });
    setParsedJobs(newJobs);
  };

  const handleJobChange = (index, key, value) => {
    setParsedJobs(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const handleImport = () => {
    if (parsedJobs.length === 0) {
      alert("Please paste some data first.");
      return;
    }
    
    let hasError = false;
    for (let i = 0; i < parsedJobs.length; i++) {
      const job = parsedJobs[i];
      if (!job.receiveDate || !job.jobId || !job.title || !job.pageCount) {
        hasError = true;
        break;
      }
    }
    
    if (hasError) {
      alert("Some rows are missing mandatory fields (Receive Date, Job ID, Title, Page Count). Please correct them in the grid.");
      return;
    }
    
    onAdd(parsedJobs);
    onClose();
  };

  return (
    <Modal onClose={onClose} xl={view === 'main' && selectedProject !== ''} wide={view === 'settings' || (view === 'main' && !selectedProject)}>
      {view === 'main' && (
        <>
          <div className="bj-bulk-header-bar">
            <h2 className="bj-modal-title" style={{ margin: 0 }}>Bulk Import</h2>
            {parsedJobs.length > 0 && (
               <button className="bj-btn-cancel" onClick={() => { setParsedJobs([]); setPasteText(''); }} style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                 🔄 Clear & Repaste
               </button>
            )}
          </div>

          <div className="bj-bulk-project-selector">
            <div className="bj-form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Project (Publisher) <span className="req">*</span></label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                  <option value="">-- Select Publisher --</option>
                  {ALL_PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <button 
                  className="bj-settings-btn" 
                  disabled={!selectedProject}
                  onClick={() => setView('settings')}
                  title="Configure Fields for this Project"
                >
                  ⚙️ Settings
                </button>
              </div>
            </div>
          </div>

          {selectedProject ? (
            <div className="bj-bulk-content">
              <div className="bj-paste-instruction">
                💡 <strong>Tip:</strong> Ensure your copied Excel columns match the headers below exactly!
              </div>

              <div className="bj-table-wrapper" style={{ maxHeight: '50vh', overflowY: 'auto', border: '1px solid #e2e8f0' }}>
                <table className="bj-table bj-bulk-table">
                  <thead>
                    <tr>
                      {getEffectiveFields().map((f, idx) => (
                        <th key={f.key}>
                          <span className="bj-field-order-badge">{idx + 1}</span>
                          {f.label} {f.mandatory && <span className="req">*</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedJobs.length === 0 ? (
                      <tr>
                        <td colSpan={getEffectiveFields().length} className="bj-paste-td">
                          <textarea 
                            className="bj-paste-textarea" 
                            placeholder={`Paste your data for ${selectedProject} here...`}
                            value={pasteText}
                            onChange={e => handleTextPaste(e.target.value)}
                            autoFocus
                          />
                        </td>
                      </tr>
                    ) : (
                      parsedJobs.map((job, i) => (
                        <tr key={i}>
                          {getEffectiveFields().map(f => {
                             const isError = f.mandatory && !job[f.key];
                             return (
                               <td key={f.key} className="bj-grid-td">
                                 <input 
                                   className={`bj-grid-input ${isError ? 'error-input' : ''}`}
                                   value={job[f.key] || ''} 
                                   onChange={e => handleJobChange(i, f.key, e.target.value)} 
                                   placeholder={f.mandatory ? 'Required' : ''}
                                 />
                               </td>
                             );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bj-empty-state">
              <span style={{ fontSize: '2.5rem' }}>📂</span>
              <p>Please select a Project to begin bulk importing.</p>
            </div>
          )}

          <div className="bj-modal-actions">
            <button className="bj-btn-cancel" onClick={onClose}>Cancel</button>
            <button className="bj-bulk-btn" onClick={handleImport} disabled={!selectedProject || parsedJobs.length === 0}>
              ⬆ Import {parsedJobs.length > 0 ? `(${parsedJobs.length})` : ''}
            </button>
          </div>
        </>
      )}

      {view === 'settings' && (
        <>
          <h2 className="bj-modal-title">Field Settings: {selectedProject}</h2>
          
          <div className="bj-paste-instruction">
            💡 <strong>Tip:</strong> Toggle fields ON in the exact sequence they appear in your spreadsheet. The number badge shows their column order. Mandatory fields will be auto-appended if left unselected.
          </div>

          <div className="bj-settings-list">
            {ALL_BULK_FIELDS.map(f => {
              const orderIndex = orderedFields.indexOf(f.key);
              const isSelected = orderIndex !== -1;
              return (
                <div key={f.key} className={`bj-setting-item ${isSelected ? 'active' : ''}`}>
                  <div className="bj-setting-info">
                    <div className="bj-checkbox-order">
                      {isSelected ? orderIndex + 1 : ''}
                    </div>
                    <span className="bj-setting-label">
                      {f.label} {f.mandatory && <span className="req">*</span>}
                    </span>
                  </div>
                  
                  <label className="bj-toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => toggleField(f.key)}
                    />
                    <span className="bj-slider"></span>
                  </label>
                </div>
              );
            })}
          </div>

          <div className="bj-modal-actions">
            <button className="bj-btn-cancel" onClick={() => {
              // Discard changes
              const allSettings = JSON.parse(localStorage.getItem('bj_bulk_settings') || '{}');
              setOrderedFields(allSettings[selectedProject] || ALL_BULK_FIELDS.filter(f => f.mandatory).map(f => f.key));
              setView('main');
            }}>Back</button>
            <button className="bj-btn-primary" onClick={handleSaveSettings}>Update Settings</button>
          </div>
        </>
      )}
    </Modal>
  );
};


/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
const BooksJobs = () => {
  const [jobs,   setJobs]   = useState(seedJobs);
  const [modal,  setModal]  = useState(null);

  /* Filter state */
  const [filters, setFilters] = useState({
    project: '', isbn: '', month: '', status: '', billing: '',
    jobId: '', complexity: '', fileStatus: '',
  });
  const [applied, setApplied] = useState({ ...filters });

  const setF = (k, v) => setFilters(p => ({ ...p, [k]: v }));

  const handleSearch = () => setApplied({ ...filters });
  const handleClear  = () => {
    const blank = { project:'', isbn:'', month:'', status:'', billing:'', jobId:'', complexity:'', fileStatus:'' };
    setFilters(blank);
    setApplied(blank);
  };

  /* Filtered rows */
  const rows = useMemo(() => jobs.filter(j => {
    if (applied.project    && j.project    !== applied.project)                              return false;
    if (applied.isbn       && !j.isbn.toLowerCase().includes(applied.isbn.toLowerCase()))    return false;
    if (applied.month      && j.month.toUpperCase() !== applied.month.toUpperCase())         return false;
    if (applied.status     && j.status     !== applied.status)                               return false;
    if (applied.billing    && j.billing    !== applied.billing)                              return false;
    if (applied.jobId      && !j.jobId.toLowerCase().includes(applied.jobId.toLowerCase()))  return false;
    if (applied.complexity && j.complexity !== applied.complexity)                           return false;
    if (applied.fileStatus && j.fileStatus !== applied.fileStatus)                           return false;
    return true;
  }), [jobs, applied]);

  const open  = (type, job = null) => setModal({ type, job });
  const close = () => setModal(null);

  const handleAdd    = (jobOrJobs) => {
    if (Array.isArray(jobOrJobs)) {
      setJobs(p => [...jobOrJobs, ...p]);
    } else {
      setJobs(p => [jobOrJobs, ...p]);
    }
  };
  const handleUpdate = (updated) => setJobs(p => p.map(j => j.id === updated.id ? updated : j));
  const handleDelete = (id)      => setJobs(p => p.filter(j => j.id !== id));

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : '-';

  return (
    <div className="bj-container">

      {/* ── Page Header ── */}
      <div className="bj-page-header">
        <div className="bj-page-title">
          <span className="bj-page-icon">📚</span>
          <h2>Job Management</h2>
        </div>
        <div className="bj-header-btns">
          <button className="bj-bulk-btn" onClick={() => open('bulk')}>📥 Bulk Import</button>
          <button className="bj-add-btn" onClick={() => open('add')}>＋ Add Job</button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bj-filter-box">
        <div className="bj-filter-title">
          <span>🔍</span>
          <strong>Filters &amp; Search</strong>
        </div>

        <div className="bj-filter-grid">
          {/* Row 1 */}
          <div className="bj-filter-group">
            <label><span className="flt-icon">📦</span> Project (Publisher)</label>
            <select value={filters.project} onChange={e => setF('project', e.target.value)}>
              <option value="">All Projects</option>
              {ALL_PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="bj-filter-group">
            <label><span className="flt-icon">📖</span> ISBN</label>
            <input placeholder="e.g., 9798216386377" value={filters.isbn} onChange={e => setF('isbn', e.target.value)} />
          </div>

          <div className="bj-filter-group">
            <label><span className="flt-icon">📅</span> Month</label>
            <select value={filters.month} onChange={e => setF('month', e.target.value)}>
              <option value="">All Months</option>
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="bj-filter-group">
            <label><span className="flt-icon">🏷️</span> Status</label>
            <select value={filters.status} onChange={e => setF('status', e.target.value)}>
              <option value="">All Status</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="bj-filter-group">
            <label><span className="flt-icon">💳</span> Billing Status</label>
            <select value={filters.billing} onChange={e => setF('billing', e.target.value)}>
              <option value="">All Billing Status</option>
              {BILLING_STATUS_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Row 2 */}
          <div className="bj-filter-group">
            <label><span className="flt-icon">🆔</span> Job ID</label>
            <input placeholder="e.g., BM0748" value={filters.jobId} onChange={e => setF('jobId', e.target.value)} />
          </div>

          <div className="bj-filter-group">
            <label><span className="flt-icon">⚡</span> Complexity</label>
            <select value={filters.complexity} onChange={e => setF('complexity', e.target.value)}>
              <option value="">All Complexity</option>
              {COMPLEXITY_OPTIONS.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
            </select>
          </div>

          <div className="bj-filter-group">
            <label><span className="flt-icon">📂</span> File Status</label>
            <select value={filters.fileStatus} onChange={e => setF('fileStatus', e.target.value)}>
              <option value="">All File Status</option>
              {FILE_STATUS_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* Search / Clear */}
        <div className="bj-filter-actions">
          <button className="bj-search-btn" onClick={handleSearch}>🔍 Search</button>
          <button className="bj-clear-btn"  onClick={handleClear}>✕ Clear</button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bj-table-wrapper">
        <table className="bj-table">
          <thead>
            <tr>
              <th>Project<br/>(Publisher) ↕</th>
              <th>Month</th>
              <th>Receive<br/>Date ↕</th>
              <th>Job ID ↕</th>
              <th>XML ISBN ↕</th>
              <th>Title Name ↕</th>
              <th>Page<br/>Count ↕</th>
              <th>PDF Type</th>
              <th>Complexity</th>
              <th>Ref<br/>Type</th>
              <th>Status ↕</th>
              <th>File Status</th>
              <th>Upload<br/>Date</th>
              <th>Billing<br/>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="15" className="bj-empty">No records found.</td>
              </tr>
            ) : rows.map(job => (
              <tr key={job.id}>
                <td>
                  {job.project
                    ? <span className="bj-project-link">{job.project}</span>
                    : <span className="cell-dash">-</span>}
                </td>
                <td>{job.month || <span className="cell-dash">-</span>}</td>
                <td className="td-date">{fmt(job.receiveDate)}</td>
                <td><strong>{job.jobId}</strong></td>
                <td>
                  {job.isbn
                    ? <span className="bj-isbn-link">{job.isbn}</span>
                    : <span className="cell-dash">-</span>}
                </td>
                <td className="td-title">{job.title || <span className="cell-dash">-</span>}</td>
                <td className="td-center">{job.pageCount || <span className="cell-dash">-</span>}</td>
                <td>{job.pdfType || <span className="cell-dash">-</span>}</td>
                <td><ComplexityBadge value={job.complexity} /></td>
                <td className="td-ref">
                  {job.refType
                    ? <span className="ref-tag">{job.refType}</span>
                    : <span className="cell-dash">-</span>}
                </td>
                <td><StatusPill value={job.status} type="status" /></td>
                <td><StatusPill value={job.fileStatus} type="file" /></td>
                <td className="td-date">{fmt(job.uploadDate)}</td>
                <td>
                  {job.billing
                    ? <span className={`billing-badge bb-${job.billing.toLowerCase()}`}>{job.billing}</span>
                    : <span className="cell-pink">-</span>}
                </td>
                <td>
                  <div className="bj-action-btns">
                    <button className="bj-act-edit" title="Edit Job"    onClick={() => open('edit',   job)}>✏️</button>
                    <button className="bj-act-del"  title="Delete Job"  onClick={() => open('delete', job)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Modals ── */}
      {modal?.type === 'add'    && <AddJobModal    onClose={close} onAdd={handleAdd} />}
      {modal?.type === 'edit'   && <EditJobModal    job={modal.job} onClose={close} onUpdate={handleUpdate} />}
      {modal?.type === 'delete' && <DeleteJobModal  job={modal.job} onClose={close} onDelete={handleDelete} />}
      {modal?.type === 'bulk'   && <BulkImportModal onClose={close} onAdd={handleAdd} />}

    </div>
  );
};

export default BooksJobs;