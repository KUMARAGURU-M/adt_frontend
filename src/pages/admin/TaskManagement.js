// src/pages/admin/TaskManagement.js
import React, { useState, useMemo } from "react";
import "./TaskManagement.css";

/* ─── Constants ─────────────────────────────── */
const ALL_PROJECTS = [
  "LDM - Hanser","ING - Usen","ING - OUP","LDM - T&F",
  "LDM - WILEY","CNT","IMP - EPUB","CMT - JATS","ING - ACDC","LDM - ASS_EPUB3",
];

const ALL_PROCESSES = [
  "EPUB - QC Process","EPUB - Tagging","FIG - Croping","INDEX - Process",
  "MATH - Keying","OCR - Process","Proof Reading - Process","REF - Process",
  "TABLE - Process","VALID - Process","WORD - QC Process","WORD - Styling",
  "XML - QC Process","XML - Tagging",
];

const ALL_EMPLOYEES = ["Ayeesha M","Shakina A","T. Mohamed Usen","Karthika","Sureka","Gowri","Employee"];

const ALL_STATUSES = ["FINISH", "WIP", "YTS", "RTU", "UPLOADED", "PENDING", "HOLD", "QUERY"];

/* jobs keyed by project */
const JOBS_BY_PROJECT = {
  "LDM - Hanser":    ["TP25-0386_chv9783446477629_Joebsti\n(ISBN: 9783446480438)","TP25-0387_LDM_Sample\n(ISBN: 9783446480001)"],
  "ING - Usen":      ["ING-Usen-Job-001\n(ISBN: 9798881870973)","ING-Usen-Job-002\n(ISBN: 9798881870001)"],
  "ING - OUP":       ["French\n(ISBN: 9780521821445)","OUP-Job-002\n(ISBN: 9780521821001)"],
  "LDM - T&F":       ["TF-Job-001\n(ISBN: 9780001234567)"],
  "LDM - WILEY":     ["WILEY-Job-001\n(ISBN: 9780002345678)"],
  "CNT":             ["CNT-Job-001\n(ISBN: 9780003456789)"],
  "IMP - EPUB":      ["IMP-EPUB-Job-001\n(ISBN: 9780004567890)"],
  "CMT - JATS":      ["is_v30_i2_d1767629676\n(ISBN: is_v30_i2_d1767629676)"],
  "ING - ACDC":      ["ACDC-Job-001\n(ISBN: 9780005678901)"],
  "LDM - ASS_EPUB3": ["ASS-EPUB3-Job-001\n(ISBN: 9780006789012)"],
};

/* ─── Seed data ─────────────────────────────── */
const initialTasks = [
  { id:1, title:"EPUB - Tagging - 9783446480438 - LDM - Hanser",              project:"LDM - Hanser", jobs:["TP25-0386_chv9783446477629_Joebsti\n(ISBN: 9783446480438)"], processes:["EPUB - Tagging"],       employees:["Employee"],   status:"pending",   dueDate:"2026-05-12", pages:"50",  chapter:"1",   estimateHours:"0.0", description:"" },
  { id:2, title:"Proof Reading - Process - 9783446480438 - LDM - Hanser",     project:"LDM - Hanser", jobs:["TP25-0386_chv9783446477629_Joebsti\n(ISBN: 9783446480438)"], processes:["Proof Reading - Process"], employees:["Employee"], status:"pending",   dueDate:"",         pages:"",    chapter:"",    estimateHours:"0.0", description:"" },
  { id:3, title:"CUP1645",                                                     project:"ING - OUP",    jobs:["French\n(ISBN: 9780521821445)"],                              processes:["XML - Tagging"],          employees:["Employee"], status:"pending",   dueDate:"2026-02-03", pages:"",    chapter:"",    estimateHours:"0.0", description:"" },
  { id:4, title:"FIG - Croping - 9783446480438 - LDM - Hanser",               project:"LDM - Hanser", jobs:["TP25-0386_chv9783446477629_Joebsti\n(ISBN: 9783446480438)"], processes:["XML - Tagging"],          employees:["Employee"], status:"completed", dueDate:"2026-02-01", pages:"10",  chapter:"Plaintiffs-Original-Petition_202447383...", estimateHours:"0.0", description:"" },
  { id:5, title:"XML - Tagging - is_v30_i2_d1767629676 - CMT - JATS",         project:"CMT - JATS",   jobs:["is_v30_i2_d1767629676\n(ISBN: is_v30_i2_d1767629676)"],      processes:["XML - Tagging"],          employees:["Employee"], status:"completed", dueDate:"2026-01-29", pages:"251", chapter:"1-15", estimateHours:"0.0", description:"" },
  { id:6, title:"EPUB - QC - 9798881870973 - ING - Usen",                     project:"ING - Usen",   jobs:[],                                                             processes:["EPUB - QC Process"],      employees:["Shakina A"],status:"archived",  dueDate:"",         pages:"",    chapter:"",    estimateHours:"0.0", description:"" },
  { id:7, title:"EPUB - QC - 9798881870973 - ING - Usen",                     project:"ING - Usen",   jobs:[],                                                             processes:["EPUB - QC Process"],      employees:["Ayeesha M"],status:"archived",  dueDate:"",         pages:"",    chapter:"",    estimateHours:"0.0", description:"" },
  { id:8, title:"EPUB - Tagging - 9798881870973 - ING - Usen",                project:"ING - Usen",   jobs:[],                                                             processes:["EPUB - Tagging"],         employees:["Gowri"],    status:"archived",  dueDate:"",         pages:"",    chapter:"",    estimateHours:"0.0", description:"" },
];

const emptyForm = {
  title:"", project:"", jobs:[], processes:[], employees:[],
  status:"pending", date:"", dueDate:"", estimateHours:"0.0", description:"",
  pagesType:"", pagesStart:"", pagesEnd:"",
  chapterType:"", chapterStart:"", chapterEnd:"",
  pages:"", chapter:"", assignedBy:""
};

/* ─── Helpers ───────────────────────────────── */
const fmtDue = (d) => {
  if (!d) return "-";
  const [y,m,day] = d.split("-");
  return `${day}.${m}.${y}`;
};

const badgeClass = (s) => ({
  pending:"pending", completed:"completed", archived:"archived",
  inprogress:"inprogress", cancelled:"cancelled",
}[s] || "pending");

const autoTitle = (f) => {
  const parts = [f.processes[0], f.jobs[0]?.split("\n")[0], f.project].filter(Boolean);
  return parts.join(" - ");
};

/* ─── Overlay ───────────────────────────────── */
const Overlay = ({ onClose, children }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div onClick={e => e.stopPropagation()}>{children}</div>
  </div>
);

/* ─── Checkbox list component ───────────────── */
function CheckboxList({ title, icon, items, selected, onChange, allowDeselect }) {
  const allSelected = items.length > 0 && items.every(i => selected.includes(i));

  const toggle = (item) => {
    onChange(selected.includes(item)
      ? selected.filter(s => s !== item)
      : [...selected, item]
    );
  };

  const selectAll   = () => onChange([...items]);
  const deselectAll = () => onChange([]);

  return (
    <div className="tm-checkbox-section">
      <div className="tm-checkbox-section-header">
        <div className="tm-checkbox-section-meta">
          <span style={{fontSize:"0.82rem"}}>{icon}</span>
          <span className="tm-checkbox-section-title">{title}</span>
          {selected.length > 0 && (
            <span className="tm-selected-count">({selected.length} selected)</span>
          )}
        </div>
        <div style={{display:"flex",gap:10}}>
          {allowDeselect && selected.length > 0 && (
            <button className="tm-deselect-btn" onClick={deselectAll}>Deselect All</button>
          )}
          {!allSelected && (
            <button className="tm-select-all-btn" onClick={selectAll}>Select All</button>
          )}
        </div>
      </div>
      <div className="tm-checkbox-list">
        {items.map(item => (
          <label
            key={item}
            className={`tm-checkbox-item ${selected.includes(item) ? "checked" : ""}`}
          >
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => toggle(item)}
            />
            <span style={{lineHeight:1.3}}>{item.replace("\n"," ")}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TASK FORM MODAL
══════════════════════════════════════════════ */
function TaskModal({ mode, task, onClose, onSave }) {
  const [form, setForm] = useState(() => {
    if (task) {
      let pagesType = task.pagesType || "";
      let pagesStart = task.pagesStart || "";
      let pagesEnd = task.pagesEnd || "";
      
      if (!pagesType && task.pages) {
        if (task.pages === "Full Book") pagesType = "Full Book";
        else if (task.pages.includes(" - ")) {
          pagesType = "Start Page - End Page";
          [pagesStart, pagesEnd] = task.pages.split(" - ");
        } else {
          pagesType = "Start Page - End Page";
          pagesStart = task.pages;
        }
      }

      let chapterType = task.chapterType || "";
      let chapterStart = task.chapterStart || "";
      let chapterEnd = task.chapterEnd || "";
      
      if (!chapterType && task.chapter) {
        if (["Full Book", "All Article", "All Batch", "All Chapter"].includes(task.chapter)) {
          chapterType = task.chapter;
        } else if (task.chapter.includes(" - ")) {
          chapterType = "Start Page - End Page";
          [chapterStart, chapterEnd] = task.chapter.split(" - ");
        } else {
          chapterType = "Start Page - End Page";
          chapterStart = task.chapter;
        }
      }

      return {
        ...emptyForm,
        ...task,
        pagesType, pagesStart, pagesEnd,
        chapterType, chapterStart, chapterEnd
      };
    }
    return { ...emptyForm };
  });
  const [errors, setErrors] = useState({});

  const setF = (k, v) => {
    setForm(p => {
      const next = { ...p, [k]: v };
      /* auto-generate title if it's blank or auto-generated */
      if (k !== "title") {
        const auto = autoTitle(next);
        if (!p.title || p.title === autoTitle(p)) next.title = auto;
      }
      return next;
    });
    setErrors(prev => ({ ...prev, [k]: "" }));
  };

  const availableJobs = JOBS_BY_PROJECT[form.project] || [];

  const validate = () => {
    const e = {};
    if (!form.project)           e.project   = "Project is required.";
    if (!form.processes.length)  e.processes  = "Select at least one process.";
    if (!form.employees.length)  e.employees  = "Select at least one employee.";
    if (!form.assignedBy)        e.assignedBy = "Assigned By is required.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    let finalPages = form.pagesType;
    if (form.pagesType === "Start Page - End Page") {
      finalPages = [form.pagesStart, form.pagesEnd].filter(Boolean).join(" - ");
    }
    
    let finalChapter = form.chapterType;
    if (form.chapterType === "Start Page - End Page") {
      finalChapter = [form.chapterStart, form.chapterEnd].filter(Boolean).join(" - ");
    }

    onSave({ 
      ...form, 
      id: task?.id || Date.now(),
      pages: finalPages,
      chapter: finalChapter
    });
    onClose();
  };

  return (
    <Overlay onClose={onClose}>
      <div className="tm-modal">

        {/* Header */}
        <div className="tm-modal-header">
          <div className="tm-modal-header-left">
            <span style={{fontSize:"1.1rem"}}>✅</span>
            <h2 className="tm-modal-title">
              {mode === "add" ? "Add New Task" : "Edit Task"}
            </h2>
          </div>
          <button className="tm-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="tm-modal-body">

          {/* Task Title */}
          <div>
            <div className="tm-field-label">
              <span>🏷️</span> Task Title
              <span className="tm-field-hint">(Optional · Auto-generated if empty)</span>
            </div>
            <input
              className="tm-form-input"
              placeholder="Enter task title or select Process, Job, and Project"
              value={form.title}
              onChange={e => setF("title", e.target.value)}
            />
          </div>

          {/* Project */}
          <div>
            <div className="tm-field-label">
              <span>📁</span> Project (Publisher) <span className="req">*</span>
            </div>
            <select
              className={`tm-form-select ${errors.project ? "tm-form-input--error" : ""}`}
              value={form.project}
              onChange={e => {
                setF("project", e.target.value);
                setForm(p => ({ ...p, jobs: [] })); // reset jobs when project changes
              }}
            >
              <option value="">Select Publisher</option>
              {ALL_PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.project && <span className="tm-form-error">{errors.project}</span>}
          </div>

          {/* Status & Date */}
          <div className="tm-two-col">
            <div>
              <div className="tm-field-label"><span>🏷️</span> Status <span className="req">*</span></div>
              <select
                className="tm-form-select"
                value={form.status}
                onChange={e => setF("status", e.target.value)}
              >
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="tm-field-label"><span>📅</span> Date</div>
              <input
                type="date"
                className="tm-form-input"
                value={form.date || ""}
                onChange={e => setF("date", e.target.value)}
              />
            </div>
          </div>

          {/* Book/Job */}
          <div>
            <div className="tm-field-label">
              <span>📖</span> Book/Job <span className="req">*</span>
            </div>
            {!form.project ? (
              <div className="tm-job-placeholder">📌 Please select a Project first</div>
            ) : (
              <CheckboxList
                title="Available Jobs"
                icon="📖"
                items={availableJobs}
                selected={form.jobs}
                onChange={v => setF("jobs", v)}
                allowDeselect={true}
              />
            )}
          </div>

          {/* Process (Stage) */}
          <div>
            <div className="tm-field-label">
              <span>⚙️</span> Process (Stage) <span className="req">*</span>
            </div>
            <CheckboxList
              title="Processes"
              icon="⚙️"
              items={ALL_PROCESSES}
              selected={form.processes}
              onChange={v => setF("processes", v)}
              allowDeselect={false}
            />
            {errors.processes && <span className="tm-form-error">{errors.processes}</span>}
          </div>

          {/* Assigned Employees */}
          <div>
            <div className="tm-field-label">
              <span>👥</span> Assigned Employee(s) <span className="req">*</span>
            </div>
            <CheckboxList
              title="Employees"
              icon="👤"
              items={ALL_EMPLOYEES}
              selected={form.employees}
              onChange={v => setF("employees", v)}
              allowDeselect={false}
            />
            {errors.employees && <span className="tm-form-error">{errors.employees}</span>}
          </div>

          {/* Assigned By */}
          <div>
            <div className="tm-field-label">
              <span>👤</span> Assigned By (Task Creator) <span className="req">*</span>
            </div>
            <select
              className={`tm-form-select ${errors.assignedBy ? "tm-form-input--error" : ""}`}
              value={form.assignedBy || ""}
              onChange={e => setF("assignedBy", e.target.value)}
            >
              <option value="">Select Employee</option>
              {ALL_EMPLOYEES.map(emp => <option key={emp} value={emp}>{emp}</option>)}
            </select>
            {errors.assignedBy && <span className="tm-form-error">{errors.assignedBy}</span>}
          </div>

          {/* Description */}
          <div>
            <div className="tm-field-label"><span>📝</span> Description</div>
            <textarea
              className="tm-form-textarea"
              placeholder="Enter task description (optional)"
              value={form.description}
              onChange={e => setF("description", e.target.value)}
              rows={3}
            />
          </div>

          {/* Estimate Hours + Due Date */}
          <div className="tm-two-col">
            <div>
              <div className="tm-field-label"><span>⏱️</span> Estimate Hours</div>
              <input
                className="tm-form-input"
                type="number" min="0" step="0.1"
                value={form.estimateHours}
                onChange={e => setF("estimateHours", e.target.value)}
              />
            </div>
            <div>
              <div className="tm-field-label"><span>📅</span> Due Date</div>
              <input
                type="date"
                className="tm-form-input"
                value={form.dueDate}
                onChange={e => setF("dueDate", e.target.value)}
              />
            </div>
          </div>

          {/* Assigned Pages & Chapter / Article / Batch */}
          <div className="tm-two-col">
            <div>
              <div className="tm-field-label"><span>📄</span> Assigned Pages</div>
              <select
                className="tm-form-select"
                value={form.pagesType}
                onChange={e => setF("pagesType", e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="Full Book">Full Book</option>
                <option value="Start Page - End Page">Start-End Page</option>
              </select>
              {form.pagesType === "Start Page - End Page" && (
                <div className="tm-two-col" style={{marginTop: "8px"}}>
                  <input className="tm-form-input" placeholder="Start" value={form.pagesStart} onChange={e => setF("pagesStart", e.target.value)} />
                  <input className="tm-form-input" placeholder="End" value={form.pagesEnd} onChange={e => setF("pagesEnd", e.target.value)} />
                </div>
              )}
            </div>

            <div>
              <div className="tm-field-label"><span>📑</span> Chapter / Article / Batch</div>
              <select
                className="tm-form-select"
                value={form.chapterType}
                onChange={e => setF("chapterType", e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="Full Book">Full Book</option>
                <option value="All Article">All Article</option>
                <option value="All Batch">All Batch</option>
                <option value="All Chapter">All Chapter</option>
                <option value="Start Page - End Page">Start A/B/C - End A/B/C</option>
              </select>
              {form.chapterType === "Start Page - End Page" && (
                <div className="tm-two-col" style={{marginTop: "8px"}}>
                  <input className="tm-form-input" placeholder="Start" value={form.chapterStart} onChange={e => setF("chapterStart", e.target.value)} />
                  <input className="tm-form-input" placeholder="End" value={form.chapterEnd} onChange={e => setF("chapterEnd", e.target.value)} />
                </div>
              )}
            </div>
          </div>

        </div>{/* end body */}

        {/* Footer */}
        <div className="tm-modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-create-task" onClick={handleSave}>
            ✦ {mode === "add" ? "Create Task" : "Update Task"}
          </button>
        </div>

      </div>
    </Overlay>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function TaskManagement() {
  const [tasks,        setTasks]        = useState(initialTasks);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage,  setCurrentPage]  = useState(1);

  /* filters */
  const [search,         setSearch]         = useState("");
  const [searchApplied,  setSearchApplied]  = useState("");
  const [filterProject,  setFilterProject]  = useState("");
  const [filterProcess,  setFilterProcess]  = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterStatus,   setFilterStatus]   = useState("");

  /* modal */
  const [modal, setModal] = useState(null); // {type:'add'|'edit'|'delete', task?}

  /* ── filtered list ── */
  const filtered = useMemo(() => tasks.filter(t => {
    const q = searchApplied.toLowerCase();
    if (q && !t.title.toLowerCase().includes(q) && !t.jobs.join(" ").toLowerCase().includes(q)) return false;
    if (filterProject  && t.project !== filterProject)                          return false;
    if (filterProcess  && !t.processes.includes(filterProcess))                 return false;
    if (filterEmployee && !t.employees.includes(filterEmployee))                return false;
    if (filterStatus   && t.status !== filterStatus)                            return false;
    return true;
  }), [tasks, searchApplied, filterProject, filterProcess, filterEmployee, filterStatus]);

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginated  = filtered.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);

  const applySearch = () => { setSearchApplied(search); setCurrentPage(1); };

  const clearFilters = () => {
    setSearch(""); setSearchApplied(""); setFilterProject("");
    setFilterProcess(""); setFilterEmployee(""); setFilterStatus(""); setCurrentPage(1);
  };

  /* ── CRUD ── */
  const handleSave = (updated) => {
    setTasks(prev => {
      const exists = prev.find(t => t.id === updated.id);
      return exists
        ? prev.map(t => t.id === updated.id ? updated : t)
        : [...prev, updated];
    });
    setModal(null);
  };

  const handleDelete = () => {
    setTasks(prev => prev.filter(t => t.id !== modal.task.id));
    setModal(null);
  };

  /* ── Export CSV ── */
  const handleExportCSV = () => {
    const header = ["Assigned Date","Project","Process","Jobs","Employee Name","Chapter/Article/Batch","Page","Due Date","Status","Task Creator"];
    const rows   = filtered.map(t => [
      fmtDue(t.date) || "-",
      `"${t.project}"`,
      `"${t.processes.join("; ")}"`,
      `"${t.jobs.join("; ").replace(/\n/g," ")}"`,
      `"${t.employees.join("; ")}"`,
      `"${t.chapter || "-"}"`,
      t.pages || "-",
      fmtDue(t.dueDate) || "-",
      t.status,
      `"${t.assignedBy || "-"}"`
    ]);
    const csv  = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type:"text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "tasks.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Remove duplicates ── */
  const handleRemoveDuplicates = () => {
    const seen = new Set();
    setTasks(prev => prev.filter(t => {
      const key = `${t.title}|${t.project}|${t.processes.join(",")}|${t.employees.join(",")}`;
      if (seen.has(key)) return false;
      seen.add(key); return true;
    }));
  };

  return (
    <div className="tm-wrapper">

      {/* ── Page Header ── */}
      <div className="tm-page-header">
        <div className="tm-page-title">
          <span style={{fontSize:22}}>✅</span>
          <h1>Task Management</h1>
        </div>
        <div className="tm-header-actions">
          <button className="btn-remove-dup" onClick={handleRemoveDuplicates}>🔁 Remove Duplicates</button>
          <button className="btn-export-csv" onClick={handleExportCSV}>📥 Export CSV</button>
          <button className="btn-add-task"   onClick={() => setModal({type:"add"})}>+ Add Task</button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="tm-filter-box">
        <div className="tm-filter-top">
          <span className="tm-filter-title">⚙️ Filters</span>
          <button className="btn-clear-all" onClick={clearFilters}>Clear All</button>
        </div>
        <div className="tm-filter-row">

          <div className="tm-filter-group">
            <span className="tm-filter-label">🔍 Search</span>
            <input
              className="tm-filter-input"
              placeholder="Search in title/description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && applySearch()}
            />
          </div>

          <div className="tm-filter-group">
            <span className="tm-filter-label">📁 Project</span>
            <select className="tm-filter-select" value={filterProject}
              onChange={e => { setFilterProject(e.target.value); setCurrentPage(1); }}>
              <option value="">All Projects</option>
              {ALL_PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="tm-filter-group">
            <span className="tm-filter-label">⚙️ Process</span>
            <select className="tm-filter-select" value={filterProcess}
              onChange={e => { setFilterProcess(e.target.value); setCurrentPage(1); }}>
              <option value="">All Processes</option>
              {ALL_PROCESSES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="tm-filter-group">
            <span className="tm-filter-label">👥 Employee</span>
            <select className="tm-filter-select" value={filterEmployee}
              onChange={e => { setFilterEmployee(e.target.value); setCurrentPage(1); }}>
              <option value="">All Employees</option>
              {ALL_EMPLOYEES.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          <div className="tm-filter-group">
            <span className="tm-filter-label">🏷️ Status</span>
            <select className="tm-filter-select" value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
              <option value="">All Status</option>
              {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="tm-filter-group" style={{visibility:"hidden"}}>
            {/* spacer */}
          </div>

          {/* Search button */}
          <div className="tm-filter-group" style={{justifyContent:"flex-end"}}>
            <span className="tm-filter-label">&nbsp;</span>
            <button className="btn-search" onClick={applySearch}>🔍 Search</button>
          </div>

        </div>
      </div>

      {/* ── Table ── */}
      <div className="tm-table-wrapper">
        <table className="tm-table">
          <thead>
            <tr>
              <th className="col-date">Assigned Date <span className="sort-icon">↕</span></th>
              <th className="col-project">Project (Publisher) <span className="sort-icon">↕</span></th>
              <th className="col-process">Process <span className="sort-icon">↕</span></th>
              <th className="col-job">Job (Book/ISBN) <span className="sort-icon">↕</span></th>
              <th className="col-employee">Employee Name <span className="sort-icon">↕</span></th>
              <th className="col-chapter">Chapter / Article / Batch</th>
              <th className="col-pages">Page</th>
              <th className="col-duedate">Due Date</th>
              <th className="col-status">Status <span className="sort-icon">↕</span></th>
              <th className="col-creator">Task Creator <span className="sort-icon">↕</span></th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={11} style={{textAlign:"center",padding:"48px",color:"#a0aec0"}}>No tasks found.</td></tr>
            ) : paginated.map(task => (
              <tr key={task.id}>
                <td className="col-date">{fmtDue(task.date) || "-"}</td>
                <td className="col-project"><span className="cell-project">{task.project}</span></td>
                <td className="col-process"><span className="cell-process">{task.processes.join(", ") || "-"}</span></td>
                <td className="col-job">
                  <span className="cell-job">
                    {task.jobs.length ? task.jobs.map(j=>j.replace("\n"," ")).join("; ") : "-"}
                  </span>
                </td>
                <td className="col-employee">{task.employees.join(", ") || "-"}</td>
                <td className="col-chapter"><span className="cell-chapter">{task.chapter || "-"}</span></td>
                <td className="col-pages">{task.pages || "-"}</td>
                <td className="col-duedate">{fmtDue(task.dueDate) || "-"}</td>
                <td className="col-status">
                  <span className={`status-badge ${badgeClass(task.status)}`}>{task.status}</span>
                </td>
                <td className="col-creator">{task.assignedBy || "-"}</td>
                <td className="col-actions">
                  <div className="tm-actions">
                    <button className="tm-action-btn" title="Edit"   onClick={() => setModal({type:"edit",task})}>✏️</button>
                    <button className="tm-action-btn" title="Delete" onClick={() => setModal({type:"delete",task})}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="tm-pagination">
        <div className="tm-pagination-left">
          <label>Items per page:</label>
          <select value={itemsPerPage}
            onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
            {[10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="tm-pagination-right">
          {totalPages > 1 && <>
            <button className="page-btn" disabled={currentPage===1}          onClick={() => setCurrentPage(p=>p-1)}>‹</button>
            <span className="page-info">Page {currentPage} of {totalPages}</span>
            <button className="page-btn" disabled={currentPage===totalPages}  onClick={() => setCurrentPage(p=>p+1)}>›</button>
          </>}
          <span className="page-count">
            Showing {totalItems===0?0:Math.min((currentPage-1)*itemsPerPage+1,totalItems)} to{" "}
            {Math.min(currentPage*itemsPerPage,totalItems)} of {totalItems} items
          </span>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {(modal?.type==="add"||modal?.type==="edit") && (
        <TaskModal
          mode={modal.type}
          task={modal.task || null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* ── Delete Confirm ── */}
      {modal?.type==="delete" && (
        <Overlay onClose={() => setModal(null)}>
          <div className="tm-modal tm-modal--confirm">
            <div className="tm-modal-header">
              <div className="tm-modal-header-left">
                <h2 className="tm-modal-title">Delete Task</h2>
              </div>
              <button className="tm-modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="tm-confirm-body">
              <div className="tm-confirm-icon">🗑️</div>
              <p className="tm-confirm-text">
                Are you sure you want to delete<br/>
                <strong>{modal.task.title}</strong>?<br/>
                This action cannot be undone.
              </p>
            </div>
            <div className="tm-modal-footer" style={{justifyContent:"center"}}>
              <button className="btn-cancel"       onClick={() => setModal(null)}>Cancel</button>
              <button className="btn-danger-modal" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </Overlay>
      )}

    </div>
  );
}