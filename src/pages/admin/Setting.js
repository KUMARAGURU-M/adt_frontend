// src/pages/admin/Setting.js

import React, { useState } from 'react';
import './Setting.css';

/* ─── Default state ─────────────────────── */
const DEFAULT = {
  /* Login Page */
  portalName:      'ADT - Production Login Portal',
  welcomeMessage:  '👋 Welcome Back! Please Login to Continue 🚀 😊',
  loginQuotes: [
    'Success is not final, failure is not fatal: It is the courage to continue that counts.',
    'The only way to do great work is to love what you do.',
    'Believe you can and you\'re halfway there.',
  ],

  /* Company Information */
  companyName:     'Arrow Data-Tech',
  streetAddress:   '07 M.G Road Near Rouridana',
  city:            'Kottakuppam , Villupuram District',
  stateProvince:   'Tamil Nadu',
  zipCode:         '605104',
  country:         'India',
  companyLocation: 'Puducherry',
  phone:           '+91 08849SE (12)',
  email:           'eachinnusen@outlook.com',

  /* Theme */
  primaryColor:   '#cd1996',
  secondaryColor: '#13979c',

  /* Feature Toggles */
  topPerformerBanner: true,

  /* System */
  sessionTimeout: 479,
  maxFileSize:    10,
  allowedTypes:   'jpg,jpeg,png,pdf,doc,docx',
};

/* ─── Modal ──────────────────────────────── */
const Modal = ({ onClose, children }) => (
  <div className="st-modal-overlay" onClick={onClose}>
    <div className="st-modal-box" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

/* ─── Quote Manager Modal ────────────────── */
const QuoteModal = ({ quotes, onClose, onSave }) => {
  const [list, setList] = useState([...quotes]);
  const [newQ, setNewQ] = useState('');

  const addQuote   = () => { if(newQ.trim()){ setList(p=>[...p,newQ.trim()]); setNewQ(''); } };
  const removeQuote= (i) => setList(p=>p.filter((_,idx)=>idx!==i));
  const editQuote  = (i,val) => setList(p=>p.map((q,idx)=>idx===i?val:q));

  return (
    <Modal onClose={onClose}>
      <h2 className="st-modal-title">Manage Login Quotes</h2>
      <p className="st-modal-sub">These quotes rotate on the login page to inspire users.</p>

      <div className="st-quote-list">
        {list.map((q,i) => (
          <div key={i} className="st-quote-item">
            <textarea
              className="st-quote-textarea"
              value={q}
              rows={2}
              onChange={e => editQuote(i, e.target.value)}
            />
            <button className="st-quote-del" title="Remove" onClick={() => removeQuote(i)}>✕</button>
          </div>
        ))}
      </div>

      <div className="st-quote-add-row">
        <textarea
          className="st-quote-new"
          placeholder="Add a new motivational quote..."
          value={newQ}
          rows={2}
          onChange={e => setNewQ(e.target.value)}
        />
        <button className="st-quote-add-btn" onClick={addQuote}>＋ Add</button>
      </div>

      <div className="st-modal-actions">
        <button className="st-btn-cancel" onClick={onClose}>Cancel</button>
        <button className="st-btn-primary" onClick={() => { onSave(list); onClose(); }}>Save Quotes</button>
      </div>
    </Modal>
  );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const Setting = () => {
  const [form,      setForm]      = useState({ ...DEFAULT });
  const [saved,     setSaved]     = useState(false);
  const [showQuotes,setShowQuotes]= useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  /* Active quote (rotate for preview) */
  const previewQuote = form.loginQuotes[0] || 'No quotes set yet.';

  return (
    <div className="st-container">

      {/* ── Page Header ── */}
      <div className="st-page-header">
        <div className="st-page-title">
          <span className="st-page-icon">⚙️</span>
          <h2>Settings</h2>
        </div>
        <button className="st-save-btn" onClick={handleSave}>
          {saved ? '✓ Saved!' : '💾 Save Settings'}
        </button>
      </div>

      <div className="st-grid">

        {/* ══════════════════════════════════
            LEFT COLUMN
        ══════════════════════════════════ */}
        <div className="st-col">

          {/* ── Login Page Settings ── */}
          <div className="st-card">
            <h3 className="st-card-title">🔐 Login Page Settings</h3>

            {/* Motivational Quotes Section — replaces wallpaper */}
            <div className="st-section-label">Motivational Quotes</div>
            <p className="st-hint">
              These quotes display on the login page to inspire and motivate users. They rotate on each page load.
            </p>

            {/* Preview */}
            <div className="st-quote-preview">
              <div className="st-quote-preview-label">Preview (first quote)</div>
              <blockquote className="st-quote-preview-text">
                "{previewQuote}"
              </blockquote>
              <div className="st-quote-count">
                {form.loginQuotes.length} quote{form.loginQuotes.length !== 1 ? 's' : ''} configured
              </div>
            </div>

            <button className="st-manage-quotes-btn" onClick={() => setShowQuotes(true)}>
              ✏️ Manage Quotes ({form.loginQuotes.length})
            </button>

            <div className="st-divider" />

            {/* Portal Name */}
            <div className="st-form-group">
              <label className="st-label">Portal Name</label>
              <input
                className="st-input"
                value={form.portalName}
                onChange={e => set('portalName', e.target.value)}
              />
            </div>

            {/* Welcome Message */}
            <div className="st-form-group">
              <label className="st-label">Welcome Message</label>
              <input
                className="st-input"
                value={form.welcomeMessage}
                onChange={e => set('welcomeMessage', e.target.value)}
              />
            </div>
          </div>

          {/* ── Theme Colors ── */}
          <div className="st-card">
            <h3 className="st-card-title">🎨 Theme Colors</h3>

            <div className="st-form-group">
              <label className="st-label">Primary Color</label>
              <div className="st-color-row">
                <input
                  type="color"
                  className="st-color-picker"
                  value={form.primaryColor}
                  onChange={e => set('primaryColor', e.target.value)}
                />
                <input
                  className="st-input"
                  value={form.primaryColor}
                  onChange={e => set('primaryColor', e.target.value)}
                />
              </div>
            </div>

            <div className="st-form-group">
              <label className="st-label">Secondary Color</label>
              <div className="st-color-row">
                <input
                  type="color"
                  className="st-color-picker"
                  value={form.secondaryColor}
                  onChange={e => set('secondaryColor', e.target.value)}
                />
                <input
                  className="st-input"
                  value={form.secondaryColor}
                  onChange={e => set('secondaryColor', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ── System Settings ── */}
          <div className="st-card">
            <h3 className="st-card-title">🖥️ System Settings</h3>

            <div className="st-form-group">
              <label className="st-label">Session Timeout (minutes)</label>
              <input
                className="st-input"
                type="number"
                min="1"
                value={form.sessionTimeout}
                onChange={e => set('sessionTimeout', e.target.value)}
              />
              <p className="st-hint">Default 480 minutes (8 hours)</p>
            </div>

            <div className="st-form-group">
              <label className="st-label">Max File Upload Size (MB)</label>
              <input
                className="st-input"
                type="number"
                min="1"
                value={form.maxFileSize}
                onChange={e => set('maxFileSize', e.target.value)}
              />
            </div>

            <div className="st-form-group">
              <label className="st-label">Allowed File Types</label>
              <input
                className="st-input"
                value={form.allowedTypes}
                onChange={e => set('allowedTypes', e.target.value)}
              />
              <p className="st-hint">Comma-separated list of file extensions</p>
            </div>
          </div>

        </div>{/* end left col */}

        {/* ══════════════════════════════════
            RIGHT COLUMN
        ══════════════════════════════════ */}
        <div className="st-col">

          {/* ── Company Information ── */}
          <div className="st-card">
            <h3 className="st-card-title">🏢 Company Information</h3>

            <div className="st-form-group">
              <label className="st-label">Company Name <span className="st-req">*</span></label>
              <input className="st-input" value={form.companyName}
                onChange={e => set('companyName', e.target.value)} />
            </div>

            <div className="st-form-group">
              <label className="st-label">Street Address</label>
              <input className="st-input" value={form.streetAddress}
                onChange={e => set('streetAddress', e.target.value)} />
            </div>

            <div className="st-form-row">
              <div className="st-form-group">
                <label className="st-label">City</label>
                <input className="st-input" value={form.city}
                  onChange={e => set('city', e.target.value)} />
              </div>
              <div className="st-form-group">
                <label className="st-label">State / Province</label>
                <input className="st-input" value={form.stateProvince}
                  onChange={e => set('stateProvince', e.target.value)} />
              </div>
            </div>

            <div className="st-form-row">
              <div className="st-form-group">
                <label className="st-label">Zip / Postal Code</label>
                <input className="st-input" value={form.zipCode}
                  onChange={e => set('zipCode', e.target.value)} />
              </div>
              <div className="st-form-group">
                <label className="st-label">Country</label>
                <input className="st-input" value={form.country}
                  onChange={e => set('country', e.target.value)} />
              </div>
            </div>

            <div className="st-form-group">
              <label className="st-label">Company Location (Legacy)</label>
              <input className="st-input" value={form.companyLocation}
                onChange={e => set('companyLocation', e.target.value)} />
              <p className="st-hint">
                This field is kept for backward compatibility. Use the address fields above for detailed information.
              </p>
            </div>

            <div className="st-form-row">
              <div className="st-form-group">
                <label className="st-label">Phone Number</label>
                <input className="st-input" value={form.phone}
                  onChange={e => set('phone', e.target.value)} />
              </div>
              <div className="st-form-group">
                <label className="st-label">Email Address</label>
                <input className="st-input" value={form.email}
                  onChange={e => set('email', e.target.value)} />
              </div>
            </div>
          </div>

          {/* ── Feature Toggles ── */}
          <div className="st-card">
            <h3 className="st-card-title">🔧 Feature Toggles</h3>

            <div className="st-toggle-item">
              <div className="st-toggle-info">
                <label className="st-toggle-label">
                  <input
                    type="checkbox"
                    className="st-checkbox"
                    checked={form.topPerformerBanner}
                    onChange={e => set('topPerformerBanner', e.target.checked)}
                  />
                  Enable Top Performer Banner
                </label>
                <p className="st-hint">Show top performers carousel on the login page.</p>
              </div>
            </div>
          </div>

        </div>{/* end right col */}

      </div>{/* end grid */}

      {/* ── Bottom Save Button ── */}
      {/* <div className="st-footer">
        <button className="st-save-btn large" onClick={handleSave}>
          {saved ? '✓ Settings Saved!' : '💾 Save Settings'}
        </button>
      </div> */}

      {/* ── Quotes Modal ── */}
      {showQuotes && (
        <QuoteModal
          quotes={form.loginQuotes}
          onClose={() => setShowQuotes(false)}
          onSave={(updated) => set('loginQuotes', updated)}
        />
      )}

    </div>
  );
};

export default Setting;