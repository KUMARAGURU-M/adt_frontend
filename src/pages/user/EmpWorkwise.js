// src/pages/user/EmpWorkwise.js
import React, { useState, useEffect } from 'react';
import './EmpWorkwise.css';

const MY_TASKS     = ['UI Design Review','Backend Integration','QA Testing','Documentation'];
const MY_PROJECTS  = ['LDM - Hanser','ING - Usen','ING - OUP','CMT - JATS', 'ING - ACDC', 'LDM - T&f'];
const MY_PROCESSES = ['EPUB - Tagging','XML - QC Process','XML - Tagging','VALID - Process', 'WORD - Styling', 'FIG - Croping', 'INDEX - Process'];

const MOCK_LOGS = [
  {
    id: 1,
    taskReceived: '11 May 2026',
    project: 'LDM - Hanser',
    process: 'EPUB - Tagging',
    isbn: '978812345001',
    pages: '45',
    dueDate: '15 May 2026',
    status: 'Stopped'
  },
  {
    id: 2,
    taskReceived: '12 May 2026',
    project: 'ING - OUP',
    process: 'XML - Tagging',
    isbn: '978812345002',
    pages: '80',
    dueDate: '18 May 2026',
    status: 'Completed'
  },
  {
    id: 3,
    taskReceived: '13 May 2026',
    project: 'ING - Usen',
    process: 'WORD - Styling',
    isbn: '978812345003',
    pages: '20',
    dueDate: '20 May 2026',
    status: 'Running'
  },
  {
    id: 4,
    taskReceived: '14 May 2026',
    project: 'CMT - JATS',
    process: 'VALID - Process',
    isbn: '978812345004',
    pages: '55',
    dueDate: '22 May 2026',
    status: 'Completed'
  },
];

const BREAK_REASONS = ['Tea Break', 'Lunch Break', 'Restroom', 'Other'];
const ON_HOLD_REASONS = ['Client query', 'Rework', 'Need update', 'Others'];

export default function EmpWorkwise() {
  const [status,     setStatus]     = useState('stopped'); // 'stopped' | 'running' | 'break'
  const [selTask,    setSelTask]    = useState('');
  const [selProject, setSelProject] = useState('');
  const [selProcess, setSelProcess] = useState('');
  const [selJob,     setSelJob]     = useState('');
  const [taskDesc,   setTaskDesc]   = useState('');
  const [elapsed,    setElapsed]    = useState(0);
  const [logs,       setLogs]       = useState(MOCK_LOGS);
  
  // Stop/Break popup states
  const [showStopPopup, setShowStopPopup] = useState(false);
  const [showBreakPopup, setShowBreakPopup] = useState(false);
  
  // Stop popup form states
  const [pagesCompleted, setPagesCompleted] = useState('');
  const [markAsCompleted, setMarkAsCompleted] = useState(false);
  const [stopStatus, setStopStatus] = useState('completed'); // 'completed' | 'on-hold' | 'stopped'
  const [onHoldReason, setOnHoldReason] = useState('');
  const [otherOnHoldReason, setOtherOnHoldReason] = useState('');
  
  // Confirmation state
  const [showConfirmStop, setShowConfirmStop] = useState(false);
  const [confirmYesText, setConfirmYesText] = useState('');
  
  // Break popup form states
  const [breakReason, setBreakReason] = useState('');
  const [otherBreakReason, setOtherBreakReason] = useState('');
  const [breakDescription, setBreakDescription] = useState('');

  useEffect(() => {
    let interval = null;
    if (status === 'running' || status === 'break') {
      interval = setInterval(() => {
        setElapsed(e => e + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!selProject || !selProcess) { 
      alert('Please select Project and Process first.'); 
      return; 
    }
    setElapsed(0);
    setTaskDesc(`Working on ${selProcess} for project ${selProject}${selJob ? `, Book/Job: ${selJob}` : ''}${selTask ? `. Assigned Task: ${selTask}` : ''}.`);
    setStatus('running');
  };

  const handleStopClick = () => {
    setShowStopPopup(true);
  };

  const handleTakeBreak = () => {
    setShowBreakPopup(true);
  };

  const handleBreakSubmit = () => {
    if (!breakReason) {
      alert('Please select a break reason');
      return;
    }
    if (breakReason === 'Other' && !otherBreakReason.trim()) {
      alert('Please specify the reason for break');
      return;
    }
    // Pause timer and set status to break
    setStatus('break');
    setShowBreakPopup(false);
    // Reset break form
    setBreakReason('');
    setOtherBreakReason('');
    setBreakDescription('');
  };

  const handleResumeFromBreak = () => {
    setStatus('running');
  };

  const handleStopSubmit = () => {
    if (stopStatus === 'on-hold' && !onHoldReason) {
      alert('Please select an on-hold reason.');
      return;
    }
    if (stopStatus === 'on-hold' && onHoldReason === 'Others' && !otherOnHoldReason.trim()) {
      alert('Please provide a description for the on-hold reason.');
      return;
    }

    if (!pagesCompleted && !showConfirmStop) {
      setShowConfirmStop(true);
      return;
    }

    if (showConfirmStop && confirmYesText.toLowerCase() !== 'yes') {
      return; // Validation prevented by button disable, but just in case
    }
    
    // Add log to table
    const newLog = {
      id: Date.now(),
      taskReceived: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      project: selProject,
      process: selProcess,
      isbn: selJob || 'N/A',
      pages: pagesCompleted || '0',
      dueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: stopStatus === 'completed' ? 'Completed' : stopStatus === 'on-hold' ? 'On-Hold' : 'Stopped'
    };
    
    setLogs(prev => [newLog, ...prev]);

    // Reset everything
    setStatus('stopped');
    setShowStopPopup(false);
    setShowConfirmStop(false);
    setConfirmYesText('');
    setTaskDesc('');
    setPagesCompleted('');
    setMarkAsCompleted(false);
    setStopStatus('completed');
    setOnHoldReason('');
    setOtherOnHoldReason('');
  };

  const handleCancelStop = () => {
    setShowStopPopup(false);
    setShowConfirmStop(false);
    setConfirmYesText('');
    setPagesCompleted('');
    setMarkAsCompleted(false);
    setStopStatus('completed');
    setOnHoldReason('');
    setOtherOnHoldReason('');
  };

  const handleCancelBreak = () => {
    setShowBreakPopup(false);
    setBreakReason('');
    setOtherBreakReason('');
    setBreakDescription('');
  };

  const isFormValid = selProject && selProcess;

  return (
    <div className="workwise-page">
      
      {/* STOP TIMER POPUP */}
      {showStopPopup && (
        <div className="ww-popup-overlay">
          <div className="ww-popup-box">
            <h3 className="ww-popup-title">Stop Timer</h3>
            <p className="ww-popup-subtitle">Please select the status for this timer:</p>
            
            {/* Number of Pages Completed */}
            <div className="ww-popup-field">
              <label className="ww-popup-label">
                📄 Number of Pages Completed
              </label>
              <input 
                type="text" 
                className="ww-popup-input"
                placeholder="Enter number of pages (optional)"
                value={pagesCompleted}
                onChange={(e) => setPagesCompleted(e.target.value)}
              />
              <span className="ww-popup-hint">Enter the number of pages you completed during this work session</span>
            </div>

            {/* Mark Task as Completed Checkbox */}
            <div className="ww-popup-checkbox-field">
              <label className="ww-popup-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={markAsCompleted}
                  onChange={(e) => setMarkAsCompleted(e.target.checked)}
                />
                <span className="ww-checkbox-icon">✅</span>
                <span className="ww-checkbox-text">
                  Mark Task as Completed
                  <span className="ww-checkbox-subtext">Check this if the task is fully completed</span>
                </span>
              </label>
            </div>

            {/* Status Radio Options */}
            <div className="ww-popup-radio-group">
              <label className={`ww-popup-radio-option ${stopStatus === 'completed' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="stopStatus"
                  value="completed"
                  checked={stopStatus === 'completed'}
                  onChange={(e) => setStopStatus(e.target.value)}
                />
                <span className="ww-radio-content">
                  <span className="ww-radio-icon">✅</span>
                  <span className="ww-radio-text">
                    <strong>Completed</strong>
                    <span className="ww-radio-subtext">Work is finished</span>
                  </span>
                </span>
              </label>

              <label className={`ww-popup-radio-option ${stopStatus === 'on-hold' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="stopStatus"
                  value="on-hold"
                  checked={stopStatus === 'on-hold'}
                  onChange={(e) => setStopStatus(e.target.value)}
                />
                <span className="ww-radio-content">
                  <span className="ww-radio-icon">⏸️</span>
                  <span className="ww-radio-text">
                    <strong>On-Hold</strong>
                    <span className="ww-radio-subtext">Work is paused temporarily</span>
                  </span>
                </span>
              </label>
              {stopStatus === 'on-hold' && (
                <div className="ww-onhold-details">
                  <div className="ww-select-wrap">
                    <select 
                      className="ww-popup-select"
                      value={onHoldReason}
                      onChange={e => setOnHoldReason(e.target.value)}
                    >
                      <option value="">Select Reason</option>
                      {ON_HOLD_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <span className="ww-arrow">▾</span>
                  </div>
                  {onHoldReason === 'Others' && (
                    <input 
                      type="text" 
                      className="ww-popup-input ww-onhold-other-input" 
                      placeholder="Description of reason"
                      value={otherOnHoldReason}
                      onChange={e => setOtherOnHoldReason(e.target.value)}
                    />
                  )}
                </div>
              )}

              <label className={`ww-popup-radio-option ${stopStatus === 'stopped' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="stopStatus"
                  value="stopped"
                  checked={stopStatus === 'stopped'}
                  onChange={(e) => setStopStatus(e.target.value)}
                />
                <span className="ww-radio-content">
                  <span className="ww-radio-icon">⏹️</span>
                  <span className="ww-radio-text">
                    <strong>Stopped</strong>
                    <span className="ww-radio-subtext">Work was stopped/cancelled</span>
                  </span>
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="ww-popup-actions">
              <button className="ww-popup-btn ww-popup-btn-cancel" onClick={handleCancelStop}>
                Cancel
              </button>
              <button className="ww-popup-btn ww-popup-btn-submit" onClick={handleStopSubmit}>
                Stop Timer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM STOP WITHOUT PAGES POPUP */}
      {showConfirmStop && (
        <div className="ww-popup-overlay" style={{ zIndex: 10000 }}>
          <div className="ww-popup-box" style={{ maxWidth: '400px' }}>
            <h3 className="ww-popup-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff9800' }}>
              ⚠️ Confirm Stop Timer
            </h3>
            <p className="ww-popup-subtitle" style={{ fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '16px' }}>
              You haven't entered the number of completed pages. Are you sure you want to stop the timer without entering the completed pages count?
            </p>
            
            <div className="ww-popup-field">
              <label className="ww-popup-label" style={{ fontSize: '0.85rem' }}>
                Type "yes" to confirm:
              </label>
              <input 
                type="text" 
                className="ww-popup-input" 
                placeholder="Type 'yes' to confirm" 
                value={confirmYesText} 
                onChange={(e) => setConfirmYesText(e.target.value)}
              />
            </div>
            
            <div className="ww-popup-actions" style={{ justifyContent: 'space-between', marginTop: '24px' }}>
              <button 
                className="ww-popup-btn ww-popup-btn-cancel" 
                style={{ flex: 1, marginRight: '10px', fontSize: '0.85rem', padding: '10px' }} 
                onClick={() => setShowConfirmStop(false)}
              >
                Cancel (Enter Pages)
              </button>
              <button 
                className="ww-popup-btn" 
                style={{ flex: 1, fontSize: '0.85rem', padding: '10px', background: confirmYesText.toLowerCase() === 'yes' ? '#ff4d4f' : '#e0e0e0', color: confirmYesText.toLowerCase() === 'yes' ? '#fff' : '#888', cursor: confirmYesText.toLowerCase() === 'yes' ? 'pointer' : 'not-allowed', borderRadius: '8px', border: 'none' }} 
                onClick={handleStopSubmit} 
                disabled={confirmYesText.toLowerCase() !== 'yes'}
              >
                Stop Without Pages
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAKE BREAK POPUP */}
      {showBreakPopup && (
        <div className="ww-popup-overlay">
          <div className="ww-popup-box">
            <h3 className="ww-popup-title">Take a Break</h3>
            <p className="ww-popup-subtitle">Please select the reason for your break:</p>
            
            {/* Break Reason Dropdown */}
            <div className="ww-popup-field">
              <label className="ww-popup-label">
                ☕ Break Reason <span className="ww-req">*</span>
              </label>
              <div className="ww-select-wrap">
                <select 
                  className="ww-popup-select"
                  value={breakReason}
                  onChange={(e) => setBreakReason(e.target.value)}
                >
                  <option value="">Select a reason</option>
                  {BREAK_REASONS.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
                <span className="ww-arrow">▾</span>
              </div>
            </div>

            {/* Other Reason Text Input (shown when "Other" is selected) */}
            {breakReason === 'Other' && (
              <div className="ww-popup-field">
                <label className="ww-popup-label">
                  📝 Specify Reason <span className="ww-req">*</span>
                </label>
                <input 
                  type="text" 
                  className="ww-popup-input"
                  placeholder="Enter the reason for break"
                  value={otherBreakReason}
                  onChange={(e) => setOtherBreakReason(e.target.value)}
                />
              </div>
            )}

            {/* Break Description */}
            <div className="ww-popup-field">
              <label className="ww-popup-label">
                💬 Break Description
              </label>
              <textarea 
                className="ww-popup-textarea"
                placeholder="Add any additional notes about your break (optional)"
                value={breakDescription}
                onChange={(e) => setBreakDescription(e.target.value)}
                rows="3"
              />
            </div>

            {/* Action Buttons */}
            <div className="ww-popup-actions">
              <button className="ww-popup-btn ww-popup-btn-cancel" onClick={handleCancelBreak}>
                Cancel
              </button>
              <button className="ww-popup-btn ww-popup-btn-submit" onClick={handleBreakSubmit}>
                Start Break
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP CARD: Work Stopped / Running Form */}
      <div className="ww-card ww-top-card">
        <h2 className="ww-section-title">WorkWise</h2>
        
        {/* Status display */}
        <div className="ww-status-block">
          <div className={`ww-status-icon-box ${status}`}>
            {status === 'running' ? '▶' : status === 'break' ? '☕' : '⏸'}
          </div>
          <div className={`ww-status-label ${status}`}>
            Work {status === 'running' ? 'Running' : status === 'break' ? 'On Break' : 'Stopped'}
          </div>
        </div>

        {/* Form */}
        <div className="ww-form">
          {status === 'stopped' ? (
            <div className="ww-fields-group">
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
            </div>
          ) : status === 'break' ? (
            <div className="ww-dynamic-running-section">
              <h2 className="ww-working-title"><span className="ww-working-icon">☕</span> On Break</h2>
              
              <div className="ww-timer-banner ww-timer-break">
                <div className="ww-timer-display">{formatTime(elapsed)}</div>
                <div className="ww-timer-label">PAUSED TIME</div>
              </div>

              <div className="ww-break-info">
                <p className="ww-break-text">Timer is paused. Click "Resume Work" to continue.</p>
              </div>

              <button className="ww-btn-resume" onClick={handleResumeFromBreak}>
                ▶ Resume Work
              </button>
            </div>
          ) : (
            <div className="ww-dynamic-running-section">
              <h2 className="ww-working-title"><span className="ww-working-icon">➡️</span> Working...</h2>
              
              <div className="ww-timer-banner ww-timer-running">
                <div className="ww-timer-display">{formatTime(elapsed)}</div>
                <div className="ww-timer-label">ELAPSED TIME</div>
              </div>

              <div className="ww-running-grid">
                {/* STARTED AT */}
                <div className="ww-run-card border-blue">
                  <div className="ww-run-card-header">
                    <span className="ww-run-icon bg-purple">⏱️</span>
                    <span className="ww-run-label">STARTED AT</span>
                  </div>
                  <div className="ww-run-value">09:42:33 pm <span className="ww-run-sub">IST</span></div>
                </div>

                {/* PROJECT */}
                <div className="ww-run-card border-green">
                  <div className="ww-run-card-header">
                    <span className="ww-run-icon bg-green">📁</span>
                    <span className="ww-run-label">PROJECT</span>
                  </div>
                  <div className="ww-run-value">{selProject}</div>
                </div>

                {/* PROCESS */}
                <div className="ww-run-card border-orange">
                  <div className="ww-run-card-header">
                    <span className="ww-run-icon bg-orange">⚙️</span>
                    <span className="ww-run-label">PROCESS</span>
                  </div>
                  <div className="ww-run-value">{selProcess}</div>
                </div>

                {/* ISBN/BOOK TITLE */}
                <div className="ww-run-card border-blue">
                  <div className="ww-run-card-header">
                    <span className="ww-run-icon bg-blue">📚</span>
                    <span className="ww-run-label">ISBN/BOOK TITLE</span>
                  </div>
                  <div className="ww-run-value">{selJob || 'TP25-0386_chv978...'}</div>
                </div>

                {/* DUE DATE */}
                <div className="ww-run-card border-pink">
                  <div className="ww-run-card-header">
                    <span className="ww-run-icon bg-pink">📅</span>
                    <span className="ww-run-label">DUE DATE</span>
                  </div>
                  <div className="ww-run-value">12 May 2026</div>
                </div>

                {/* PAGES & CHAPTER */}
                <div className="ww-run-card border-teal">
                  <div className="ww-run-card-header">
                    <span className="ww-run-icon bg-teal">📄</span>
                    <span className="ww-run-label">PAGES & CHAPTER</span>
                  </div>
                  <div className="ww-run-value">50 pages • Chapter 1</div>
                </div>

                {/* SHIFT */}
                <div className="ww-run-card border-lightpurple">
                  <div className="ww-run-card-header">
                    <span className="ww-run-icon bg-purple">🕘</span>
                    <span className="ww-run-label">SHIFT</span>
                  </div>
                  <div className="ww-run-value">1st Shift</div>
                </div>
              </div>
              
              <div className="ww-field" style={{marginTop: '8px', width: '100%'}}>
                <label className="ww-label">
                  <span className="ww-icon-desc">📝</span> Task Description
                </label>
                <div className="ww-task-desc-display">
                  {taskDesc || 'No description available'}
                </div>
              </div>
            </div>
          )}

          {/* Start / Stop / Break Buttons */}
          <div className="ww-btn-container">
            {status === 'stopped' ? (
              <button
                className={`ww-toggle-btn ${isFormValid ? 'ww-btn-start' : 'ww-btn-disabled'}`}
                onClick={handleStart}
                disabled={!isFormValid}
              >
                ▶ Start Task
              </button>
            ) : status === 'break' ? null : (
              <div className="ww-running-buttons">
                <button className="ww-btn-break" onClick={handleTakeBreak}>
                  ☕ Take Break
                </button>
                <button className="ww-btn-stop-large" onClick={handleStopClick}>
                  ⏹ Stop Task
                </button>
              </div>
            )}
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
                <th>Task Received Date</th>
                <th>Project</th>
                <th>Process</th>
                <th>ISBN</th>
                <th>Pages</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{log.taskReceived}</td>
                  <td>{log.project}</td>
                  <td>{log.process}</td>
                  <td>{log.isbn}</td>
                  <td>{log.pages}</td>
                  <td>{log.dueDate}</td>
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