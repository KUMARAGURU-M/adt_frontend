// src/pages/admin/Attendance.js

import React, { useState, useMemo } from 'react';
import './Attendance.css';

/* ─── Constants ─────────────────────────────────────────── */
const STATUS = {
  P: { code: 'P', label: 'Present', short: 'P', color: '#16a34a' },
  A: { code: 'A', label: 'Absent', short: 'A', color: '#dc2626' },
  H: { code: 'H', label: 'Half Day', short: 'H', color: '#d97706' },
  PH: { code: 'PH', label: 'Paid Holiday', short: 'PH', color: '#7c3aed' },
  WO: { code: 'WO', label: 'Week Off (Sun)', short: 'WO', color: '#64748b' },
  '-': { code: '-', label: 'Not Applicable', short: '-', color: '#cbd5e0' },
};

const CATEGORIES = [
  'Management', 'Admin', 'Vendor Management',
  'Senior Operator', 'Operator', 'Coordinator',
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth(); // 0-indexed

/* ─── Seed employees (from your Excel) ──────────────────── */
const SEED_EMPLOYEES = [
  { id: 1, name: 'M. Ayeesha', category: 'Management' },
  { id: 2, name: 'A. Shakina', category: 'Management' },
  { id: 3, name: 'G. Nilai', category: 'Admin' },
  { id: 4, name: 'P. Magesh', category: 'Vendor Management' },
  { id: 5, name: 'S. Narkis', category: 'Vendor Management' },
  { id: 6, name: 'A. Elavarasi', category: 'Senior Operator' },
  { id: 7, name: 'Mohana', category: 'Senior Operator' },
  { id: 8, name: 'Suleka', category: 'Senior Operator' },
  { id: 9, name: 'Jayanthi', category: 'Senior Operator' },
  { id: 10, name: 'Vasanthi', category: 'Senior Operator' },
  { id: 11, name: 'Gowri', category: 'Senior Operator' },
  { id: 12, name: 'Safrin', category: 'Operator' },
  { id: 13, name: 'Rasheetha', category: 'Operator' },
  { id: 14, name: 'Thaslima', category: 'Operator' },
  { id: 15, name: 'Jenifer', category: 'Operator' },
  { id: 16, name: 'Buela', category: 'Operator' },
  { id: 17, name: 'Reeta', category: 'Operator' },
];

/* ─── Helpers ────────────────────────────────────────────── */
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getDayOfWeek = (year, month, day) => new Date(year, month, day).getDay(); // 0=Sun

/* Build day list for a month: each day has date, dayOfWeek, isSunday */
function buildDays(year, month) {
  const total = getDaysInMonth(year, month);
  return Array.from({ length: total }, (_, i) => {
    const d = i + 1;
    const dow = getDayOfWeek(year, month, d);
    return { day: d, dow, isSunday: dow === 0 };
  });
}

/* Auto-set Sundays to WO */
function initMonthRecord(year, month, employees) {
  const days = buildDays(year, month);
  const record = {};
  employees.forEach(emp => {
    record[emp.id] = {};
    days.forEach(({ day, isSunday }) => {
      record[emp.id][day] = isSunday ? 'WO' : '';
    });
  });
  return record;
}

/* Count working days in a month (non-Sunday days) */
function countWorkingDays(year, month) {
  const days = buildDays(year, month);
  return days.filter(d => !d.isSunday).length;
}

/* Compute summary for one employee for a month */
function computeSummary(empRecord, year, month) {
  const days = buildDays(year, month);
  let present = 0, absent = 0, half = 0, ph = 0, wo = 0;
  days.forEach(({ day, isSunday }) => {
    const s = empRecord[day] || (isSunday ? 'WO' : '');
    if (s === 'P') present++;
    else if (s === 'A') absent++;
    else if (s === 'H') { present += 0.5; half++; }
    else if (s === 'PH') ph++;
    else if (s === 'WO') wo++;
  });
  const workingDays = countWorkingDays(year, month);
  const totalForWages = present + ph + wo;
  return { present, absent, half, ph, wo, workingDays, totalForWages };
}

/* Day-of-week short names */
const DOW_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* ─── Modal ─────────────────────────────────────────────── */
const Modal = ({ onClose, children, wide }) => (
  <div className="att-modal-overlay" onClick={onClose}>
    <div className={`att-modal-box${wide ? ' att-modal-wide' : ''}`} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

/* ─── Status Cell ────────────────────────────────────────── */
const StatusCell = ({ value, onChange, disabled }) => {
  const cycle = { '': 'P', 'P': 'A', 'A': 'H', 'H': 'PH', 'PH': '' };
  const s = STATUS[value] || STATUS['-'];
  return (
    <button
      className={`att-cell att-cell-${(value || 'empty').toLowerCase()}`}
      style={{ color: s.color, borderColor: s.color + '40' }}
      onClick={() => !disabled && onChange(cycle[value] ?? '')}
      disabled={disabled}
      title={s.label}
    >
      {value === 'WO' ? 'WO' : value || '·'}
    </button>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
const Attendance = () => {
  const [employees, setEmployees] = useState(SEED_EMPLOYEES);
  const [selYear, setSelYear] = useState(CURRENT_YEAR);
  const [selMonth, setSelMonth] = useState(CURRENT_MONTH);
  const [attendance, setAttendance] = useState(() => initMonthRecord(CURRENT_YEAR, CURRENT_MONTH, SEED_EMPLOYEES));
  const [filterCat, setFilterCat] = useState('');
  const [filterName, setFilterName] = useState('');
  const [activeView, setActiveView] = useState('monthly'); // 'monthly' | 'summary' | 'yearly'
  const [modal, setModal] = useState(null);
  const [salaryDetails, setSalaryDetails] = useState({});

  const getSalaryDetail = (empId, field, fallback = '') => {
    const key = `${selYear}-${selMonth}-${empId}`;
    return salaryDetails[key]?.[field] ?? fallback;
  };

  const updateSalaryDetail = (empId, field, val) => {
    const key = `${selYear}-${selMonth}-${empId}`;
    setSalaryDetails(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { overtime: '', travel: '', status: 'pending' }),
        [field]: val
      }
    }));
  };
  /* ── Days for selected month ── */
  const days = useMemo(() => buildDays(selYear, selMonth), [selYear, selMonth]);

  /* ── When month/year changes, reinit attendance (keep existing if same) ── */
  const handleMonthChange = (newYear, newMonth) => {
    setSelYear(newYear);
    setSelMonth(newMonth);
    setAttendance(prev => {
      const key = `${newYear}-${newMonth}`;
      if (prev[key]) return prev;
      return { ...prev, ...initMonthRecord(newYear, newMonth, employees) };
    });
  };

  /* ── Filtered employees ── */
  const filtered = useMemo(() =>
    employees.filter(e =>
      (!filterCat || e.category === filterCat) &&
      (!filterName || e.name.toLowerCase().includes(filterName.toLowerCase()))
    ), [employees, filterCat, filterName]);

  /* ── Mark all employees for a day ── */
  const markAllDay = (day, status) => {
    setAttendance(prev => {
      const next = { ...prev };
      employees.forEach(emp => {
        if (!days.find(d => d.day === day)?.isSunday) {
          next[emp.id] = { ...next[emp.id], [day]: status };
        }
      });
      return next;
    });
  };

  /* ── Update single cell ── */
  const updateCell = (empId, day, val) => {
    setAttendance(prev => ({
      ...prev,
      [empId]: { ...prev[empId], [day]: val },
    }));
  };

  /* ── Mark all present for full month ── */
  const markMonthAllPresent = () => {
    setAttendance(prev => {
      const next = { ...prev };
      employees.forEach(emp => {
        days.forEach(({ day, isSunday }) => {
          if (!isSunday) next[emp.id] = { ...next[emp.id], [day]: next[emp.id][day] || 'P' };
        });
      });
      return next;
    });
  };

  /* ── Summary for current month ── */
  const summaries = useMemo(() =>
    employees.map(emp => ({
      emp,
      ...computeSummary(attendance[emp.id] || {}, selYear, selMonth),
    })), [employees, attendance, selYear, selMonth]);

  /* ── Yearly summary ── */
  const yearlySummary = useMemo(() =>
    employees.map(emp => {
      let totalPresent = 0, totalAbsent = 0, totalWorkingDays = 0;
      for (let m = 0; m < 12; m++) {
        const rec = initMonthRecord(selYear, m, [emp])[emp.id]; // empty fallback
        const actual = attendance[emp.id] || rec;
        const s = computeSummary(actual, selYear, m);
        totalPresent += s.present;
        totalAbsent += s.absent;
        totalWorkingDays += s.workingDays;
      }
      return { emp, totalPresent, totalAbsent, totalWorkingDays };
    }), [employees, attendance, selYear]);

  /* ── Add Employee Modal ── */
  const AddEmpModal = () => {
    const [form, setForm] = useState({ name: '', category: CATEGORIES[0], salary: '' });
    const submit = () => {
      if (!form.name.trim()) { alert('Name is required'); return; }
      if (!form.salary.trim()) { alert('Salary is required'); return; }
      const newEmp = { id: Date.now(), name: form.name.trim(), category: form.category, salary: Number(form.salary) };
      setEmployees(p => [...p, newEmp]);
      setAttendance(prev => {
        const rec = initMonthRecord(selYear, selMonth, [newEmp]);
        return { ...prev, [newEmp.id]: rec[newEmp.id] };
      });
      setModal(null);
    };
    return (
      <Modal onClose={() => setModal(null)}>
        <h2 className="att-modal-title">Add Employee</h2>
        <div className="att-form-group">
          <label>Name <span className="att-req">*</span></label>
          <input className="att-input" placeholder="Full name" value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div className="att-form-group">
          <label>Category</label>
          <select className="att-select" value={form.category}
            onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="att-form-group">
          <label>Salary <span className="att-req">*</span></label>
          <div className="att-input-with-icon">
            <span className="att-input-icon">₹</span>
            <input type="number" className="att-input att-input-icon-padded" placeholder="Monthly Salary" value={form.salary}
              onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} />
          </div>
        </div>
        <div className="att-modal-actions">
          <button className="att-btn-cancel" onClick={() => setModal(null)}>Cancel</button>
          <button className="att-btn-primary" onClick={submit}>Add Employee</button>
        </div>
      </Modal>
    );
  };

  /* ── Employee Detail Modal ── */
  const EmpDetailModal = ({ emp }) => {
    const s = computeSummary(attendance[emp.id] || {}, selYear, selMonth);
    const pct = s.workingDays > 0 ? Math.round((s.present / s.workingDays) * 100) : 0;
    return (
      <Modal onClose={() => setModal(null)}>
        <h2 className="att-modal-title">📋 {emp.name}</h2>
        <p className="att-modal-sub">{emp.category} · {MONTHS[selMonth]} {selYear}</p>
        <div className="att-detail-grid">
          <div className="att-detail-card green">
            <span className="att-detail-val">{s.present}</span>
            <span className="att-detail-lbl">Present</span>
          </div>
          <div className="att-detail-card red">
            <span className="att-detail-val">{s.absent}</span>
            <span className="att-detail-lbl">Absent</span>
          </div>
          <div className="att-detail-card amber">
            <span className="att-detail-val">{s.half}</span>
            <span className="att-detail-lbl">Half Days</span>
          </div>
          <div className="att-detail-card purple">
            <span className="att-detail-val">{s.ph}</span>
            <span className="att-detail-lbl">Paid Holidays</span>
          </div>
          <div className="att-detail-card blue">
            <span className="att-detail-val">{s.workingDays}</span>
            <span className="att-detail-lbl">Working Days</span>
          </div>
          <div className="att-detail-card teal">
            <span className="att-detail-val">{s.totalForWages}</span>
            <span className="att-detail-lbl">Days for Wages</span>
          </div>
        </div>
        <div className="att-pct-bar-wrap">
          <div className="att-pct-label">Attendance: {pct}%</div>
          <div className="att-pct-track">
            <div className="att-pct-fill" style={{ width: `${pct}%`, background: pct >= 75 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626' }} />
          </div>
        </div>
        <div className="att-modal-actions">
          <button className="att-btn-cancel" onClick={() => setModal(null)}>Close</button>
        </div>
      </Modal>
    );
  };

  const workingDaysCount = useMemo(() => countWorkingDays(selYear, selMonth), [selYear, selMonth]);

  return (
    <div className="att-container">

      {/* ── Page Header ── */}
      <div className="att-page-header">
        <div className="att-page-title">
          <span className="att-page-icon">🗓️</span>
          <h2>Attendance Management</h2>
        </div>
        <div className="att-header-actions">
          <button className="att-btn-add" onClick={() => setModal('add')}>+ Add Employee</button>
          <button className="att-btn-mark" onClick={markMonthAllPresent}>✓ Mark All Present</button>
        </div>
      </div>

      {/* ── Controls Row ── */}
      <div className="att-controls">
        {/* Month / Year selectors */}
        <div className="att-date-selectors">
          <select className="att-select-ctrl" value={selMonth}
            onChange={e => handleMonthChange(selYear, Number(e.target.value))}>
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select className="att-select-ctrl" value={selYear}
            onChange={e => handleMonthChange(Number(e.target.value), selMonth)}>
            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Filters */}
        <div className="att-filters">
          <input className="att-filter-input" placeholder="Search employee..."
            value={filterName} onChange={e => setFilterName(e.target.value)} />
          <select className="att-select-ctrl" value={filterCat}
            onChange={e => setFilterCat(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* View tabs */}
        <div className="att-view-tabs">
          {[['monthly', '📅 Monthly'], ['summary', '📊 Summary'], ['yearly', '📈 Yearly']].map(([v, l]) => (
            <button key={v} className={`att-view-tab${activeView === v ? ' active' : ''}`}
              onClick={() => setActiveView(v)}>{l}</button>
          ))}
        </div>
      </div>

      {/* ── Month Info Bar ── */}
      <div className="att-info-bar">
        <span>📅 <strong>{MONTHS[selMonth]} {selYear}</strong></span>
        <span>⚙️ Working Days: <strong>{workingDaysCount}</strong></span>
        <span>👥 Employees: <strong>{filtered.length}</strong></span>
        <div className="att-legend">
          {Object.values(STATUS).filter(s => s.code !== '-').map(s => (
            <span key={s.code} className="att-legend-item" style={{ color: s.color }}>
              <span className="att-legend-dot" style={{ background: s.color }} />
              {s.short} = {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          VIEW: MONTHLY ATTENDANCE GRID
      ══════════════════════════════════════ */}
      {activeView === 'monthly' && (
        <div className="att-table-card">
          <div className="att-table-scroll">
            <table className="att-table">
              <thead>
                <tr>
                  <th className="att-th-sticky att-th-sno">#</th>
                  <th className="att-th-sticky att-th-name">Employee</th>
                  <th className="att-th-sticky att-th-cat">Category</th>
                  {days.map(({ day, dow, isSunday }) => (
                    <th key={day}
                      className={`att-th-day${isSunday ? ' att-th-sunday' : ''}`}
                      title={DOW_NAMES[dow]}>
                      <div className="att-th-day-inner">
                        <span className="att-th-day-num">{day}</span>
                        <span className="att-th-day-name">{DOW_NAMES[dow].slice(0, 2)}</span>
                      </div>
                    </th>
                  ))}
                  <th className="att-th-total">P</th>
                  <th className="att-th-total">A</th>
                  <th className="att-th-total">H</th>
                  <th className="att-th-total">PH</th>
                  <th className="att-th-total att-th-wages">Wages Days</th>
                </tr>
                {/* Quick mark row */}
                <tr className="att-mark-row">
                  <td colSpan={3} className="att-mark-label">Quick Mark Day →</td>
                  {days.map(({ day, isSunday }) => (
                    <td key={day} className={isSunday ? 'att-sunday-col' : ''}>
                      {!isSunday && (
                        <div className="att-quick-btns">
                          <select
                            className="att-quick-select"
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val) {
                                markAllDay(day, val === 'CLEAR' ? '' : val);
                                e.target.value = ''; // reset after selection
                              }
                            }}
                            title="Quick Mark Day"
                          >
                            <option value="">▼</option>
                            <option value="P">Present (P)</option>
                            <option value="A">Absent (A)</option>
                            <option value="PH">Paid Holiday (PH)</option>
                            <option value="H">Half Day (H)</option>
                            <option value="CLEAR">Clear</option>
                          </select>
                        </div>
                      )}
                    </td>
                  ))}
                  <td colSpan={5} />
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp, idx) => {
                  const s = computeSummary(attendance[emp.id] || {}, selYear, selMonth);
                  return (
                    <tr key={emp.id} className="att-row">
                      <td className="att-td-sno">{idx + 1}</td>
                      <td className="att-td-name">
                        <button className="att-emp-name-btn"
                          onClick={() => setModal({ type: 'detail', emp })}>
                          <span className="att-avatar">{emp.name.charAt(0)}</span>
                          {emp.name}
                        </button>
                      </td>
                      <td className="att-td-cat">
                        <span className={`att-cat-badge att-cat-${emp.category.toLowerCase().replace(/\s+/g, '-')}`}>
                          {emp.category}
                        </span>
                      </td>
                      {days.map(({ day, isSunday }) => (
                        <td key={day} className={isSunday ? 'att-sunday-col' : ''}>
                          <StatusCell
                            value={attendance[emp.id]?.[day] || (isSunday ? 'WO' : '')}
                            onChange={val => updateCell(emp.id, day, val)}
                            disabled={isSunday}
                          />
                        </td>
                      ))}
                      <td className="att-td-total att-td-p">{s.present}</td>
                      <td className="att-td-total att-td-a">{s.absent}</td>
                      <td className="att-td-total att-td-h">{s.half}</td>
                      <td className="att-td-total att-td-ph">{s.ph}</td>
                      <td className="att-td-total att-td-wages">{s.totalForWages}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="att-table-hint">
            💡 Click on any cell to cycle: Present → Absent → Half Day → Paid Holiday → Empty. Click employee name for details.
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          VIEW: SUMMARY TABLE
      ══════════════════════════════════════ */}
      {activeView === 'summary' && (
        <div className="att-table-card">
          <h3 className="att-section-title">📊 Monthly Summary — {MONTHS[selMonth]} {selYear}</h3>
          <div className="att-table-scroll">
            <table className="att-summary-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee</th>
                  <th>Category</th>
                  <th>Working Days</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Half Days</th>
                  <th>Paid Holidays</th>
                  <th>Days for Wages</th>
                  <th>Basic Salary (₹)</th>
                  <th>Per Day Salary (₹)</th>
                  <th>Loss of Pay (₹)</th>
                  <th>Net Salary (₹)</th>
                  <th>Overtime (₹)</th>
                  <th>Travel Allowance (₹)</th>
                  <th>Total Salary (₹)</th>
                  <th>Salary Status</th>
                </tr>
              </thead>
              <tbody>
                {summaries
                  .filter(s => !filterCat || s.emp.category === filterCat)
                  .filter(s => !filterName || s.emp.name.toLowerCase().includes(filterName.toLowerCase()))
                  .map((s, idx) => {
                    const basicSalary = s.emp.salary || 5000;
                    const perDaySalary = basicSalary / 31;
                    const lossOfPay = perDaySalary * s.absent;
                    const netSalary = perDaySalary * s.totalForWages;

                    const overtimeVal = getSalaryDetail(s.emp.id, 'overtime', '');
                    const travelVal = getSalaryDetail(s.emp.id, 'travel', '');
                    const statusVal = getSalaryDetail(s.emp.id, 'status', 'pending');

                    const totalSalary = netSalary + Number(overtimeVal || 0) + Number(travelVal || 0);

                    return (
                      <tr key={s.emp.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <div className="att-emp-cell">
                            <span className="att-avatar sm">{s.emp.name.charAt(0)}</span>
                            {s.emp.name}
                          </div>
                        </td>
                        <td><span className={`att-cat-badge att-cat-${s.emp.category.toLowerCase().replace(/\s+/g, '-')}`}>{s.emp.category}</span></td>
                        <td className="td-center">{s.workingDays}</td>
                        <td className="td-center att-text-green">{s.present}</td>
                        <td className="td-center att-text-red">{s.absent}</td>
                        <td className="td-center att-text-amber">{s.half}</td>
                        <td className="td-center att-text-purple">{s.ph}</td>
                        <td className="td-center att-text-blue"><strong>{s.totalForWages}</strong></td>
                        <td className="td-center">₹{basicSalary.toFixed(2)}</td>
                        <td className="td-center">₹{perDaySalary.toFixed(2)}</td>
                        <td className="td-center att-text-red">₹{lossOfPay.toFixed(2)}</td>
                        <td className="td-center att-text-green">₹{netSalary.toFixed(2)}</td>
                        <td className="td-center">
                          <input
                            type="number"
                            className="att-summary-input"
                            value={overtimeVal}
                            placeholder="0"
                            onChange={e => updateSalaryDetail(s.emp.id, 'overtime', e.target.value)}
                          />
                        </td>
                        <td className="td-center">
                          <input
                            type="number"
                            className="att-summary-input"
                            value={travelVal}
                            placeholder="0"
                            onChange={e => updateSalaryDetail(s.emp.id, 'travel', e.target.value)}
                          />
                        </td>
                        <td className="td-center" style={{ fontWeight: 700, color: '#111827' }}>
                          ₹{totalSalary.toFixed(2)}
                        </td>
                        <td className="td-center">
                          <select
                            className={`att-summary-select status-${statusVal}`}
                            value={statusVal}
                            onChange={e => updateSalaryDetail(s.emp.id, 'status', e.target.value)}
                          >
                            <option value="credited">Credited</option>
                            <option value="pending">Pending</option>
                            <option value="wip">WIP</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          VIEW: YEARLY OVERVIEW
      ══════════════════════════════════════ */}
      {activeView === 'yearly' && (
        <div className="att-table-card">
          <h3 className="att-section-title">📈 Yearly Overview — {selYear}</h3>

          {/* Month-wise summary cards */}
          <div className="att-yearly-months">
            {MONTHS.map((m, mi) => {
              const wd = countWorkingDays(selYear, mi);
              const totalP = employees.reduce((sum, emp) => {
                const s = computeSummary(attendance[emp.id] || {}, selYear, mi);
                return sum + s.present;
              }, 0);
              const avgPct = employees.length > 0 ? Math.round((totalP / (wd * employees.length)) * 100) : 0;
              return (
                <div key={m}
                  className={`att-month-card${mi === selMonth ? ' current' : ''}`}
                  onClick={() => { setSelMonth(mi); setActiveView('monthly'); }}>
                  <div className="att-month-name">{m.slice(0, 3)}</div>
                  <div className="att-month-wd">{wd} days</div>
                  <div className="att-month-pct" style={{ color: avgPct >= 75 ? '#16a34a' : avgPct >= 50 ? '#d97706' : '#dc2626' }}>
                    {avgPct}%
                  </div>
                </div>
              );
            })}
          </div>

          {/* Per-employee yearly table */}
          <div className="att-table-scroll" style={{ marginTop: 20 }}>
            <table className="att-summary-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee</th>
                  <th>Category</th>
                  <th>Total Working Days ({selYear})</th>
                  <th>Total Present</th>
                  <th>Total Absent</th>
                  <th>Annual Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {yearlySummary
                  .filter(s => !filterCat || s.emp.category === filterCat)
                  .filter(s => !filterName || s.emp.name.toLowerCase().includes(filterName.toLowerCase()))
                  .map((s, idx) => {
                    const pct = s.totalWorkingDays > 0 ? Math.round((s.totalPresent / s.totalWorkingDays) * 100) : 0;
                    return (
                      <tr key={s.emp.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <div className="att-emp-cell">
                            <span className="att-avatar sm">{s.emp.name.charAt(0)}</span>
                            {s.emp.name}
                          </div>
                        </td>
                        <td><span className={`att-cat-badge att-cat-${s.emp.category.toLowerCase().replace(/\s+/g, '-')}`}>{s.emp.category}</span></td>
                        <td className="td-center">{s.totalWorkingDays}</td>
                        <td className="td-center att-text-green"><strong>{s.totalPresent}</strong></td>
                        <td className="td-center att-text-red">{s.totalAbsent}</td>
                        <td>
                          <div className="att-pct-inline">
                            <div className="att-pct-track sm">
                              <div className="att-pct-fill" style={{
                                width: `${pct}%`,
                                background: pct >= 75 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626'
                              }} />
                            </div>
                            <span style={{ color: pct >= 75 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626', fontWeight: 700 }}>
                              {pct}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {modal === 'add' && <AddEmpModal />}
      {modal?.type === 'detail' && <EmpDetailModal emp={modal.emp} />}

    </div>
  );
};

export default Attendance;