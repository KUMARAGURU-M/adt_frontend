// src/pages/user/EmpWorkwise.js
import React, { useState } from 'react';
import './EmpWorkwise.css';

const MY_TASKS     = ['UI Design Review','Backend Integration','QA Testing','Documentation'];
const MY_PROJECTS  = ['LDM - Hanser','ING - Usen','ING - OUP','CMT - JATS', 'ING - ACDC', 'LDM - T&f'];
const MY_PROCESSES = ['EPUB - Tagging','XML - QC Process','XML - Tagging','VALID - Process', 'WORD - Styling', 'FIG - Croping', 'INDEX - Process'];

const MOCK_LOGS = [
  { id: 1, project: 'LDM - Hanser', process: 'EPUB - Tagging', shift: '1st Shift', start: '11 May 2026 9:42 PM', end: '11 May 2026 9:44 PM', duration: '00:01:25', pages: '45', status: 'Stopped' },
  { id: 2, project: 'ING - OUP', process: 'XML - Tagging', shift: '1st Shift', start: '11 May 2026 9:33 PM', end: '11 May 2026 9:33 PM', duration: '00:00:27', pages: '-', status: 'Stopped' },
  { id: 3, project: 'ING - OUP', process: 'XML - Tagging', shift: '1st Shift', start: '18 Feb 2026 11:10 PM', end: '18 Feb 2026 11:10 PM', duration: '00:00:18', pages: '8', status: 'Completed' },
  { id: 4, project: 'ING - OUP', process: 'XML - Tagging', shift: '1st Shift', start: '03 Feb 2026 11:44 AM', end: '03 Feb 2026 11:49 AM', duration: '00:05:27', pages: '15', status: 'Completed' },
  { id: 5, project: 'ING - Usen', process: 'VALID - Process', shift: '-', start: '02 Feb 2026 11:59 PM', end: '03 Feb 2026 12:00 AM', duration: '00:01:36', pages: '-', status: 'Completed' },
  { id: 6, project: 'ING - OUP', process: 'XML - Tagging', shift: '1st Shift', start: '02 Feb 2026 11:52 PM', end: '02 Feb 2026 11:52 PM', duration: '00:01:00', pages: '-', status: 'Completed' },
  { id: 7, project: 'LDM - Hanser', process: 'XML - QC Process', shift: '1st Shift', start: '02 Feb 2026 10:57 PM', end: '02 Feb 2026 10:59 PM', duration: '00:02:02', pages: '-', status: 'Stopped' },
  { id: 8, project: 'LDM - Hanser', process: 'XML - QC Process', shift: '1st Shift', start: '02 Feb 2026 10:48 PM', end: '02 Feb 2026 10:57 PM', duration: '00:08:44', pages: '10', status: 'Completed' },
  { id: 9, project: 'ING - OUP', process: 'XML - Tagging', shift: '1st Shift', start: '02 Feb 2026 8:35 PM', end: '02 Feb 2026 8:50 PM', duration: '00:15:02', pages: '100', status: 'Completed' },
  { id: 10, project: 'LDM - Hanser', process: 'XML - Tagging', shift: '1st Shift', start: '02 Feb 2026 12:59 AM', end: '02 Feb 2026 8:31 PM', duration: '19:31:53', pages: '50', status: 'Completed' },
  { id: 11, project: 'ING - Usen', process: 'WORD - Styling', shift: '1st Shift', start: '02 Feb 2026 12:38 AM', end: '02 Feb 2026 12:38 AM', duration: '00:00:16', pages: '20', status: 'Completed' },
  { id: 12, project: 'LDM - Hanser', process: 'FIG - Croping', shift: '1st Shift', start: '02 Feb 2026 12:37 AM', end: '02 Feb 2026 12:37 AM', duration: '00:00:08', pages: '10', status: 'Completed' },
];

export default function EmpWorkwise() {
  const [status,     setStatus]     = useState('stopped'); // 'stopped' | 'running'
  const [selTask,    setSelTask]    = useState('');
  const [selProject, setSelProject] = useState('');
  const [selProcess, setSelProcess] = useState('');
  const [selJob,     setSelJob]     = useState('');

  const toggle = () => {
    if (status === 'stopped') {
      if (!selProject || !selProcess) { alert('Please select Project and Process first.'); return; }
    }
    setStatus(s => s === 'stopped' ? 'running' : 'stopped');
  };

  const isFormValid = selProject && selProcess;

  return (
    <div className="workwise-page">
      
      {/* TOP CARD: Work Stopped / Running Form */}
      <div className="ww-card ww-top-card">
        <h2 className="ww-section-title">WorkWise</h2>
        
        {/* Status display */}
        <div className="ww-status-block">
          <div className={`ww-status-icon-box ${status}`}>
            {status === 'running' ? '▶' : '⏸'}
          </div>
          <div className={`ww-status-label ${status}`}>
            Work {status === 'running' ? 'Running' : 'Stopped'}
          </div>
        </div>

        {/* Form */}
        <div className="ww-form">
          {/* Task */}
          <div className="ww-field">
            <label className="ww-label">
              <span className="ww-icon-check">✅</span> Task <span className="ww-label-desc">(Optional - Auto-fills below)</span>
            </label>
            <div className="ww-select-wrap">
              <select className="ww-select" value={selTask} onChange={e => setSelTask(e.target.value)}>
                <option value="">Select a Task (Optional)</option>
                {MY_TASKS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <span className="ww-arrow">▾</span>
            </div>
          </div>

          {/* Project */}
          <div className="ww-field">
            <label className="ww-label">
              <span className="ww-icon-folder">📁</span> Project <span className="ww-req">*</span>
            </label>
            <div className="ww-select-wrap">
              <select className="ww-select" value={selProject} onChange={e => setSelProject(e.target.value)}>
                <option value="">Select a Project</option>
                {MY_PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <span className="ww-arrow">▾</span>
            </div>
          </div>

          {/* Book/Job */}
          <div className="ww-field">
            <label className="ww-label">
              <span className="ww-icon-book">📚</span> Book/Job <span className="ww-label-desc">(Optional)</span>
            </label>
            <div className="ww-select-wrap">
              <select 
                className={`ww-select ${!selProject ? 'disabled' : ''}`}
                value={selJob} 
                onChange={e => setSelJob(e.target.value)}
                disabled={!selProject}
              >
                {!selProject ? (
                  <option value="">Select a Project first</option>
                ) : (
                  <>
                    <option value="">Select a Book/Job</option>
                    <option value="Job A">Job A</option>
                    <option value="Job B">Job B</option>
                  </>
                )}
              </select>
              <span className="ww-arrow">▾</span>
            </div>
            {!selProject && <span className="ww-sub-hint">Please select a Project first</span>}
          </div>

          {/* Process */}
          <div className="ww-field">
            <label className="ww-label">
              <span className="ww-icon-gear">⚙️</span> Process <span className="ww-req">*</span>
            </label>
            <div className="ww-select-wrap">
              <select className="ww-select" value={selProcess} onChange={e => setSelProcess(e.target.value)}>
                <option value="">Select a Process</option>
                {MY_PROCESSES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <span className="ww-arrow">▾</span>
            </div>
          </div>

          {/* Start / Stop */}
          <div className="ww-btn-container">
            <button
              className={`ww-toggle-btn ${status === 'running' ? 'ww-btn-stop' : (isFormValid ? 'ww-btn-start' : 'ww-btn-disabled')}`}
              onClick={toggle}
              disabled={status === 'stopped' && !isFormValid}
            >
              {status === 'running' ? '⏹ Stop Work' : '▶ Start Work'}
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM CARD: My Time Logs */}
      <div className="ww-card ww-bottom-card">
        <h3 className="ww-logs-title">My Time Logs</h3>
        
        {/* Filters */}
        <div className="ww-filters">
          <div className="ww-filter-col">
            <label>Project</label>
            <select className="ww-filter-select"><option>All Projects</option></select>
          </div>
          <div className="ww-filter-col">
            <label>Process</label>
            <select className="ww-filter-select"><option>All Processes</option></select>
          </div>
          <div className="ww-filter-col">
            <label>Status</label>
            <select className="ww-filter-select"><option>All Status</option></select>
          </div>
          <div className="ww-filter-col">
            <label>Start Date</label>
            <input type="date" className="ww-filter-date" />
          </div>
          <div className="ww-filter-col">
            <label>End Date</label>
            <input type="date" className="ww-filter-date" />
          </div>
          <div className="ww-filter-col ww-clear-col">
            <button className="ww-clear-btn">Clear Filters</button>
          </div>
        </div>

        {/* Data Table */}
        <div className="ww-table-container">
          <table className="ww-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Process</th>
                <th>Shift</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Pages</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LOGS.map(log => (
                <tr key={log.id}>
                  <td>{log.project}</td>
                  <td>{log.process}</td>
                  <td>{log.shift}</td>
                  <td>{log.start}</td>
                  <td>{log.end}</td>
                  <td>{log.duration}</td>
                  <td>{log.pages}</td>
                  <td>
                    <span className={`ww-status-chip ${log.status.toLowerCase()}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="ww-pagination">
          <div className="ww-page-items">
            Items per page: 
            <select className="ww-page-select">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <div className="ww-page-info">
            Showing 1 to 25 of 56 items
          </div>
          <div className="ww-page-controls">
            <button className="ww-page-btn">&laquo;</button>
            <button className="ww-page-btn">&lsaquo;</button>
            <button className="ww-page-btn active">1</button>
            <button className="ww-page-btn">2</button>
            <button className="ww-page-btn">3</button>
            <button className="ww-page-btn">&rsaquo;</button>
            <button className="ww-page-btn">&raquo;</button>
          </div>
        </div>
      </div>
    </div>
  );
}