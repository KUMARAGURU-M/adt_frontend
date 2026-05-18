import React from 'react';
import './EmpTask.css';

const MOCK_TASKS = [
  {
    id: 1,
    title: 'EPUB - Tagging - 9783446480438 - LDM - Hanser',
    project: 'LDM - Hanser',
    job: 'TP25-0386_chv9783446477629_Joebstl\n(ISBN: 9783446480438)',
    process: 'EPUB - Tagging',
    status: 'pending',
    dueDate: '5/12/2026',
    pages: '50',
    chapter: '1',
    description: '-'
  },
  {
    id: 2,
    title: 'Proof Reading - Process - 9783446480438 - LDM - Hanser',
    project: 'LDM - Hanser',
    job: 'TP25-0386_chv9783446477629_Joebstl\n(ISBN: 9783446480438)',
    process: 'Proof Reading - Process',
    status: 'pending',
    dueDate: '-',
    pages: '-',
    chapter: '-',
    description: '-'
  },
  {
    id: 3,
    title: 'CUP1645',
    project: 'ING - OUP',
    job: 'French (ISBN: 9780521821445)',
    process: 'XML - Tagging',
    status: 'pending',
    dueDate: '2/3/2026',
    pages: '-',
    chapter: '-',
    description: '-'
  },
  {
    id: 4,
    title: 'FIG - Croping - 9783446480438 - LDM - Hanser',
    project: 'LDM - Hanser',
    job: 'TP25-0386_chv9783446477629_Joebstl\n(ISBN: 9783446480438)',
    process: 'XML - Tagging',
    status: 'completed',
    dueDate: '2/1/2026',
    pages: '10',
    chapter: 'Plaintiffs-Original-Petition_202447383_20240726_tx-harris-district_115597273.pdf.00500000JFWVA2 to Plaintiffs-Original-Petition_202447383_20240726_tx-harris-district_115597273.pdf.00500000JFWVA3',
    description: '-'
  },
  {
    id: 5,
    title: 'XML - Tagging - is_v30_i2_d1767629676 - CMT - JATS',
    project: 'CMT - JATS',
    job: 'is_v30_i2_d1767629676 (ISBN: is_v30_i2_d1767629676)',
    process: 'XML - Tagging',
    status: 'completed',
    dueDate: '1/29/2026',
    pages: '251',
    chapter: '1-15',
    description: '1234'
  },
  {
    id: 6,
    title: 'VALID - Process - 9798881870973 - ING - WTC',
    project: 'ING - Usen',
    job: '-',
    process: 'VALID - Process',
    status: 'archived',
    dueDate: '-',
    pages: '-',
    chapter: '-',
    description: '-'
  },
  {
    id: 7,
    title: 'EPUB - QC - 9798881871017 - ING - WTC',
    project: 'ING - Usen',
    job: '-',
    process: 'EPUB - QC Process',
    status: 'in_progress',
    dueDate: '-',
    pages: '-',
    chapter: '-',
    description: '-'
  }
];

const EmpTask = () => {
  return (
    <div className="et-page">
      
      {/* HEADER SECTION */}
      <div className="et-header">
        <h1 className="et-title">My Tasks</h1>
        <p className="et-subtitle">View all tasks assigned to you with details</p>
      </div>

      {/* FILTER CARD */}
      <div className="et-card et-filters-card">
        <div className="et-filter-group">
          <label className="et-filter-label">Project</label>
          <div className="et-select-wrapper">
            <select className="et-select">
              <option>All Projects</option>
            </select>
            <span className="et-select-arrow">▾</span>
          </div>
        </div>

        <div className="et-filter-group">
          <label className="et-filter-label">Job/ISBN</label>
          <div className="et-select-wrapper">
            <select className="et-select">
              <option>All Jobs</option>
            </select>
            <span className="et-select-arrow">▾</span>
          </div>
        </div>

        <div className="et-filter-group">
          <label className="et-filter-label">Process</label>
          <div className="et-select-wrapper">
            <select className="et-select">
              <option>All Processes</option>
            </select>
            <span className="et-select-arrow">▾</span>
          </div>
        </div>

        <div className="et-filter-group">
          <label className="et-filter-label">Status</label>
          <div className="et-select-wrapper">
            <select className="et-select">
              <option>All Status</option>
            </select>
            <span className="et-select-arrow">▾</span>
          </div>
        </div>

        <div className="et-filter-group">
          <label className="et-filter-label">Due Date From</label>
          <input type="date" className="et-input-date" />
        </div>

        <div className="et-filter-group">
          <label className="et-filter-label">Due Date To</label>
          <input type="date" className="et-input-date" />
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="et-card et-table-card">
        <div className="et-table-container">
          <table className="et-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Project</th>
                <th>Job/ISBN</th>
                <th>Process</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Pages</th>
                <th>Chapter</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TASKS.map((task) => (
                <tr key={task.id}>
                  <td className="et-td-title">{task.title}</td>
                  <td>{task.project}</td>
                  <td className="et-td-job">{task.job}</td>
                  <td className="et-td-process">{task.process}</td>
                  <td>
                    <span className={`et-status-badge status-${task.status}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{task.dueDate}</td>
                  <td>{task.pages}</td>
                  <td className="et-td-chapter">{task.chapter}</td>
                  <td>{task.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default EmpTask;
