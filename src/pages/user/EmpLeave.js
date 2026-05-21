import React, { useState } from 'react';
import './EmpLeave.css';

const EmpLeave = () => {
  const [activeTab, setActiveTab] = useState('apply'); // 'apply', 'balance', 'history'
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="el-page">
      
      {/* HEADER */}
      <div className="el-header">
        <h1 className="el-title">Leave Management</h1>
        <p className="el-subtitle">Apply for leave, view your leave balance, and check leave history</p>
      </div>

      {/* TABS AND ACTIONS */}
      <div className="el-tabs-container">
        <div className="el-tabs">
          <button 
            className={`el-tab-btn ${activeTab === 'apply' ? 'active' : ''}`}
            onClick={() => setActiveTab('apply')}
          >
            📝 Apply for Leave
          </button>
          <button 
            className={`el-tab-btn ${activeTab === 'balance' ? 'active' : ''}`}
            onClick={() => setActiveTab('balance')}
          >
            💰 Leave Balance
          </button>
          <button 
            className={`el-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📋 Leave History
          </button>
        </div>
        
        {/* The Action button is floating on the right side below the tabs */}
        <div className="el-actions">
          <button className="el-apply-btn" onClick={() => setIsModalOpen(true)}>
            + Apply for Leave
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="el-content">
        
        {/* APPLY TAB */}
        {activeTab === 'apply' && (
          <div className="el-card el-empty-card">
            <p className="el-empty-text">Click "Apply for Leave" to submit a new leave request</p>
          </div>
        )}

        {/* BALANCE TAB */}
        {activeTab === 'balance' && (
          <div className="el-card">
            <div className="el-table-container">
              <table className="el-table">
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Year</th>
                    <th>Total Allocated</th>
                    <th>Used</th>
                    <th>Pending</th>
                    <th>Carried Forward</th>
                    <th>Available</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="7" className="el-empty-row">No leave balance information available.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="el-card">
            <div className="el-table-container">
              <table className="el-table">
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="7" className="el-empty-row">No leave requests found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODAL OVERLAY */}
      {isModalOpen && (
        <div className="el-modal-overlay">
          <div className="el-modal">
            <h2 className="el-modal-title">Apply for Leave</h2>
            
            {/* Leave Type */}
<div className="el-form-group">
  <label>Leave Type *</label>
  <div className="el-select-wrapper">
    <select className="el-select">
      <option>Select Leave Type</option>
      <option>Annual Leave</option>
      <option>Sick Leave</option>
      <option>Casual Leave</option>
      <option>Maternity Leave</option>
      <option>Emergency Leave</option>
    </select>
    <span className="el-select-arrow">▾</span>
  </div>
</div>

{/* Request To */}
<div className="el-form-group">
  <label>Request To *</label>
  <div className="el-select-wrapper">
    <select className="el-select">
      <option>Select Approver</option>
      <option>Admin</option>
      <option>HR</option>
    </select>
    <span className="el-select-arrow">▾</span>
  </div>
</div>
            
            <div className="el-form-group">
              <label>Start Date *</label>
              <input type="date" className="el-input" />
            </div>
            
            <div className="el-form-group">
              <label>End Date *</label>
              <input type="date" className="el-input" />
            </div>
            
            <div className="el-form-group">
              <label>Reason</label>
              <textarea 
                className="el-textarea" 
                placeholder="Optional: Enter reason for leave"
                rows="3"
              ></textarea>
            </div>
            
            <div className="el-modal-actions">
              <button className="el-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="el-btn-submit">Submit Request</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmpLeave;
