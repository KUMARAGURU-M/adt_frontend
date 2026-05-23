// ============================================================
// Invoice.js — Arrow Data Tech Invoice Generation (Updated)
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Invoice.css";
import sign from "../../assets/images/sign.png";
import letterpad from "../../assets/images/letterpad.png";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const YEARS = Array.from({ length: 10 }, (_, i) => 2024 + i);

const PROJECT_OPTIONS = [
  "All Projects","LDM - Hanser","ING - Usen","ING - OUP",
  "LDM - T&F","LDM - WILEY","CNT","IMP - EPUB",
  "CMT - JATS","ING - ACDC","LDM - ASS EPUB3",
];

const PROCESS_OPTIONS = [
  "All Processes","EPUB - QC Process","EPUB - Tagging","FIG - Croping",
  "INDEX - Process","MATH - Keying","OCR - Process","Proof Reading - Process",
  "REF - Process","TABLE - Process","VALID - Process","WORD - QC Process",
  "WORD - Styling","XML - QC Process","XML - Tagging",
];

const COMPLEXITY_OPTIONS = ["All","Simple","Medium","Complex","Heavy Complex"];
const FILE_STATUS_OPTIONS = ["All","Uploaded","RTU","Hold","Query"];

// Dummy process rates per process (₹ per page)
const PROCESS_RATES = {
  "EPUB - QC Process": 4, "EPUB - Tagging": 6, "FIG - Croping": 3,
  "INDEX - Process": 5, "MATH - Keying": 8, "OCR - Process": 4,
  "Proof Reading - Process": 5, "REF - Process": 4, "TABLE - Process": 7,
  "VALID - Process": 3, "WORD - QC Process": 4, "WORD - Styling": 5,
  "XML - QC Process": 5, "XML - Tagging": 7,
};

// Dummy project data pool (Dates updated to YYYY-MM for calendar inputs)
const DUMMY_PROJECTS = [
  { id:"DP001", project:"LDM - T&F", process:"XML - Tagging", bookBatchName:"168111500001760", jobId:"JOB-1001", titleName:"TandF XML Conversion Vol 1", pageCount:200, startMonth:"2026-01", endMonth:"2026-03", xmlIsbn:"978-0-12-345678-9", chapters:12, complexity:"Simple", fileStatus:"RTU", uploadedDate:"2026-01-15", billingStatus:"Pending" },
  { id:"DP002", project:"LDM - WILEY", process:"EPUB - Tagging", bookBatchName:"168111500001761", jobId:"JOB-1002", titleName:"Wiley Chapter Conversion", pageCount:350, startMonth:"2026-02", endMonth:"2026-04", xmlIsbn:"978-1-23-456789-0", chapters:18, complexity:"Complex", fileStatus:"Uploaded", uploadedDate:"2026-02-10", billingStatus:"Pending" },
  { id:"DP003", project:"ING - OUP", process:"MATH - Keying", bookBatchName:"168111500001762", jobId:"JOB-1003", titleName:"Elsevier Journal Markup", pageCount:500, startMonth:"2026-03", endMonth:"2026-05", xmlIsbn:"978-2-34-567890-1", chapters:25, complexity:"Heavy Complex", fileStatus:"RTU", uploadedDate:"2026-03-05", billingStatus:"Invoiced" },
  { id:"DP004", project:"CMT - JATS", process:"XML - QC Process", bookBatchName:"168111500001763", jobId:"JOB-1004", titleName:"Springer Book Processing", pageCount:280, startMonth:"2026-04", endMonth:"2026-05", xmlIsbn:"978-3-45-678901-2", chapters:15, complexity:"Medium", fileStatus:"Hold", uploadedDate:"2026-04-20", billingStatus:"Pending" },
  { id:"DP005", project:"IMP - EPUB", process:"EPUB - QC Process", bookBatchName:"168111500001764", jobId:"JOB-1005", titleName:"EPUB Academic Series", pageCount:180, startMonth:"2026-01", endMonth:"2026-02", xmlIsbn:"978-4-56-789012-3", chapters:10, complexity:"Simple", fileStatus:"Uploaded", uploadedDate:"2026-01-20", billingStatus:"Pending" },
  { id:"DP006", project:"LDM - Hanser", process:"TABLE - Process", bookBatchName:"168111500001765", jobId:"JOB-1006", titleName:"Hanser Technical Manual", pageCount:320, startMonth:"2026-02", endMonth:"2026-03", xmlIsbn:"978-5-67-890123-4", chapters:20, complexity:"Complex", fileStatus:"Query", uploadedDate:"2026-02-25", billingStatus:"Pending" },
  { id:"DP007", project:"ING - Usen", process:"REF - Process", bookBatchName:"168111500001766", jobId:"JOB-1007", titleName:"Reference Processing Vol2", pageCount:410, startMonth:"2026-03", endMonth:"2026-04", xmlIsbn:"978-6-78-901234-5", chapters:22, complexity:"Medium", fileStatus:"RTU", uploadedDate:"2026-03-10", billingStatus:"Pending" },
  { id:"DP008", project:"CNT", process:"WORD - Styling", bookBatchName:"168111500001767", jobId:"JOB-1008", titleName:"Content Styling Project", pageCount:260, startMonth:"2026-04", endMonth:"2026-05", xmlIsbn:"978-7-89-012345-6", chapters:16, complexity:"Simple", fileStatus:"Uploaded", uploadedDate:"2026-04-05", billingStatus:"Pending" },
  { id:"DP009", project:"ING - ACDC", process:"OCR - Process", bookBatchName:"168111500001768", jobId:"JOB-1009", titleName:"ACDC Digital Conversion", pageCount:150, startMonth:"2026-01", endMonth:"2026-01", xmlIsbn:"978-8-90-123456-7", chapters:8, complexity:"Simple", fileStatus:"RTU", uploadedDate:"2026-01-30", billingStatus:"Pending" },
  { id:"DP010", project:"LDM - ASS EPUB3", process:"EPUB - Tagging", bookBatchName:"168111500001769", jobId:"JOB-1010", titleName:"ASS EPUB3 Migration", pageCount:440, startMonth:"2026-05", endMonth:"2026-06", xmlIsbn:"978-9-01-234567-8", chapters:28, complexity:"Heavy Complex", fileStatus:"Hold", uploadedDate:"2026-05-01", billingStatus:"Pending" },
  { id:"DP011", project:"LDM - T&F", process:"VALID - Process", bookBatchName:"168111500001770", jobId:"JOB-1011", titleName:"TandF Validation Run", pageCount:190, startMonth:"2026-02", endMonth:"2026-03", xmlIsbn:"978-0-23-456789-1", chapters:11, complexity:"Medium", fileStatus:"RTU", uploadedDate:"2026-02-14", billingStatus:"Pending" },
  { id:"DP012", project:"CMT - JATS", process:"FIG - Croping", bookBatchName:"168111500001771", jobId:"JOB-1012", titleName:"JATS Figure Crop Batch", pageCount:300, startMonth:"2026-03", endMonth:"2026-04", xmlIsbn:"978-1-34-567890-2", chapters:19, complexity:"Complex", fileStatus:"Uploaded", uploadedDate:"2026-03-18", billingStatus:"Pending" },
];

// Fixed optional columns list
const OPTIONAL_COLUMNS = [
  { key:"receivedDate",  label:"Received Date" },
  { key:"jobId",         label:"Job ID" },
  { key:"titleName",     label:"Title Name" },
  { key:"startMonth",    label:"Start Month" },
  { key:"endMonth",      label:"End Month" },
  { key:"xmlIsbn",       label:"XML ISBN" },
  { key:"chapters",      label:"No. of Chapters" },
  { key:"pdfInputType",  label:"PDF Input Type" },
  { key:"complexity",    label:"Complexity" },
  { key:"referenceType", label:"Reference Type" },
  { key:"fileStatus",    label:"File Status" },
  { key:"uploadedDate",  label:"Uploaded Date" },
  { key:"billingStatus", label:"Billing Status" },
];

const BANK_ACCOUNTS = {
  kvb:  { label:"KVB Current Account",  acNo:"1681115000001760", bankName:"KARUR VYSYA BANK",  branch:"LAWSPET",      ifsc:"KVBL0001681",  type:"Current" },
  sbi:  { label:"SBI Personal Account", acNo:"9876543210001",    bankName:"STATE BANK OF INDIA",branch:"PONDICHERRY",  ifsc:"SBIN0001234",  type:"Savings" },
  hdfc: { label:"HDFC Personal Account", acNo:"1122334455667",   bankName:"HDFC BANK",          branch:"VANUR",        ifsc:"HDFC0002345",  type:"Savings" },
};

// ─────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────
function numberToWords(num) {
  if (!num || num === 0) return "Zero Rupees Only";
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
    "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  function convert(n) {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? " "+ones[n%10] : "");
    return ones[Math.floor(n/100)] + " Hundred" + (n%100 ? " "+convert(n%100) : "");
  }
  let result = "";
  const crore = Math.floor(num / 10000000); num %= 10000000;
  const lakh  = Math.floor(num / 100000);   num %= 100000;
  const thou  = Math.floor(num / 1000);     num %= 1000;
  const rest  = num;
  if (crore) result += convert(crore) + " Crore ";
  if (lakh)  result += convert(lakh)  + " Lakh ";
  if (thou)  result += convert(thou)  + " Thousand ";
  if (rest)  result += convert(rest);
  return result.trim() + " Rupees Only";
}

const fmt  = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const today = () => new Date().toISOString().split("T")[0];
const genInvNo = () => {
  const d = new Date();
  return `ADT-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
};

// Formats YYYY-MM to standard month display (e.g. "2026-01" -> "Jan 2026")
const formatDisplayMonth = (ym) => {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[parseInt(m, 10) - 1]} ${y}`;
};

const EMPTY_ROW = (overrides = {}) => ({
  id: Date.now() + Math.random(),
  projectName:"", process:"", bookBatchName:"",
  receivedDate:"", jobId:"", titleName:"", pageCount:"",
  startMonth:"", endMonth:"", xmlIsbn:"", chapters:"",
  pdfInputType:"", complexity:"", referenceType:"",
  fileStatus:"", uploadedDate:"", billingStatus:"",
  orderPages:"", ratePage:"", amount:"", deductionAmount:"", totalAmount:"",
  ...overrides,
});

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }) {
  return (
    <label className="inv-toggle-wrap">
      <div className={`inv-toggle ${checked ? "inv-toggle--on":""}`} onClick={() => onChange(!checked)}>
        <div className="inv-toggle-knob" />
      </div>
      {label && <span className="inv-toggle-label">{label}</span>}
    </label>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Invoice() {

  // ── Invoice Details ──────────────────────────────────────
  const [vendorName,    setVendorName]    = useState("Arrow Data Tech");
  const [vendorAddress, setVendorAddress] = useState("#07, M.G Road, Kottakuppam, (Near Roundana), (Near Puducherry),\nVanur Taluk, Villupuram District, Tamilnadu-605104");
  const [clientName,    setClientName]    = useState("ACRUX IT SERVICES (P) LTD.");
  const [clientAddress, setClientAddress] = useState("Block 1st Floor, T-HuB 1/C, 83/1 Raidurg Panmaktha, Near Hitech City,\nHyderabad, Rangareddy, Telangana - 500081");
  const [invoiceNo,     setInvoiceNo]     = useState(genInvNo());
  const [invoiceDate,   setInvoiceDate]   = useState(today());
  const [panNo,         setPanNo]         = useState("AWXPM3024B");
  const [gstinNo,       setGstinNo]       = useState("");

  // ── Invoice Title ─────────────────────────────────────────
  const [titleMonth, setTitleMonth] = useState(MONTHS[new Date().getMonth()]);
  const [titleYear,  setTitleYear]  = useState(new Date().getFullYear());

  // ── Column Config — Priority depends on order of selection ──
  const [activeCols, setActiveCols] = useState([]);
  const [colHeaders, setColHeaders] = useState(() =>
    OPTIONAL_COLUMNS.reduce((acc, c) => { acc[c.key] = c.label; return acc; }, {})
  );

  // ── Invoice Table Rows ────────────────────────────────────
  const [rows, setRows] = useState([EMPTY_ROW(), EMPTY_ROW()]);

  // ── Project Filter / Search ───────────────────────────────
  const [filterProject,    setFilterProject]    = useState("All Projects");
  const [filterProcess,    setFilterProcess]    = useState("All Processes");
  const [filterStartMonth, setFilterStartMonth] = useState("");
  const [filterEndMonth,   setFilterEndMonth]   = useState("");
  const [filterComplexity, setFilterComplexity] = useState("All");
  const [filterFileStatus, setFilterFileStatus] = useState("All");
  const [selectedDPIds,    setSelectedDPIds]    = useState(new Set());

  // ── Tax ──────────────────────────────────────────────────
  const [igstPct, setIgstPct] = useState(18);

  // ── Bank ─────────────────────────────────────────────────
  const [bankKey,         setBankKey]         = useState("kvb");
  const [editingBank,     setEditingBank]     = useState(false);
  const [bankDraft,       setBankDraft]       = useState({...BANK_ACCOUNTS.kvb});
  const [bankData,        setBankData]        = useState({...BANK_ACCOUNTS});
  const [gpay,            setGpay]            = useState("+91-9894562152");
  const [nameOnAccount,   setNameOnAccount]   = useState("ARROW DATA-TECH");

  // ── Signature ─────────────────────────────────────────────
  const [sigName,  setSigName]  = useState("T. Mohamed Usen");
  const [sigDesig, setSigDesig] = useState("Managing Director");
  // Default Signature Placeholder Image applied
  const [sigImage, setSigImage] = useState(sign);
  const sigInputRef = useRef(null);

  // ── Letter Pad ────────────────────────────────────────────
  const [useLetterPad,   setUseLetterPad]   = useState(false);
  const letterPadInputRef = useRef(null);
  // Default Letterpad Placeholder Image applied
  const [letterPadImage, setLetterPadImage] = useState(letterpad);

  // ── UI State ──────────────────────────────────────────────
  const [showPreview,     setShowPreview]     = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showColPanel,    setShowColPanel]    = useState(true);
  const [showProjPanel,   setShowProjPanel]   = useState(true);

  // ── Derived: enabled optional columns mapped from selection order ─
  const enabledOptCols = activeCols.map(key => OPTIONAL_COLUMNS.find(c => c.key === key));

  // ── Filtered dummy project list ───────────────────────────
  const filteredDPs = DUMMY_PROJECTS.filter(dp => {
    if (filterProject !== "All Projects" && dp.project !== filterProject) return false;
    if (filterProcess !== "All Processes" && dp.process !== filterProcess) return false;
    if (filterComplexity !== "All" && dp.complexity !== filterComplexity) return false;
    if (filterFileStatus !== "All" && dp.fileStatus !== filterFileStatus) return false;
    if (filterStartMonth && dp.startMonth !== filterStartMonth) return false;
    if (filterEndMonth   && dp.endMonth   !== filterEndMonth)   return false;
    return true;
  });

  // ── Calculations ──────────────────────────────────────────
  const subTotal   = rows.reduce((sum, r) => sum + Number(r.totalAmount || 0), 0);
  const igstAmt    = Math.round(subTotal * igstPct / 100);
  const grandTotal = subTotal + igstAmt;

  // ── Row helpers ───────────────────────────────────────────
  const addEmptyRow = () => setRows(r => [...r, EMPTY_ROW()]);

  const removeRow = (id) => setRows(r => r.filter(row => row.id !== id));

  const updateRow = (id, field, val) => {
    setRows(prev => prev.map(row => {
      if (row.id !== id) return row;
      const updated = { ...row, [field]: val };
      if (field === "orderPages" || field === "ratePage") {
        const pages = Number(field === "orderPages" ? val : row.orderPages) || 0;
        const rate  = Number(field === "ratePage"   ? val : row.ratePage)   || 0;
        updated.amount     = pages * rate;
        updated.totalAmount = updated.amount - Number(updated.deductionAmount || 0);
      }
      if (field === "deductionAmount") {
        updated.totalAmount = Number(updated.amount || 0) - Number(val || 0);
      }
      return updated;
    }));
  };

  // ── Add selected projects to invoice table ────────────────
  const addSelectedToInvoice = () => {
    if (selectedDPIds.size === 0) return;
    const toAdd = DUMMY_PROJECTS.filter(dp => selectedDPIds.has(dp.id));
    const newRows = toAdd.map(dp => {
      const rate  = PROCESS_RATES[dp.process] || 5;
      const amt   = dp.pageCount * rate;
      return EMPTY_ROW({
        projectName:   dp.project,
        process:       dp.process,
        bookBatchName: dp.bookBatchName,
        jobId:         dp.jobId,
        titleName:     dp.titleName,
        pageCount:     dp.pageCount,
        startMonth:    formatDisplayMonth(dp.startMonth),
        endMonth:      formatDisplayMonth(dp.endMonth),
        xmlIsbn:       dp.xmlIsbn,
        chapters:      dp.chapters,
        complexity:    dp.complexity,
        fileStatus:    dp.fileStatus,
        uploadedDate:  dp.uploadedDate,
        billingStatus: dp.billingStatus,
        orderPages:    dp.pageCount,
        ratePage:      rate,
        amount:        amt,
        deductionAmount: 0,
        totalAmount:   amt,
      });
    });
    setRows(prev => {
      const nonEmpty = prev.filter(r => r.projectName || r.process || r.orderPages || r.totalAmount);
      return [...nonEmpty, ...newRows];
    });
    setSelectedDPIds(new Set());
  };

  const toggleSelectDP = (id) => {
    setSelectedDPIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAllDPs = () => {
    if (selectedDPIds.size === filteredDPs.length) {
      setSelectedDPIds(new Set());
    } else {
      setSelectedDPIds(new Set(filteredDPs.map(dp => dp.id)));
    }
  };

  // ── Bank helpers ──────────────────────────────────────────
  const currentBank = bankData[bankKey];
  const handleBankSwitch = (key) => { setBankKey(key); setEditingBank(false); };
  const startEditBank = () => { setBankDraft({ ...currentBank }); setEditingBank(true); };
  const saveBank = () => { setBankData(prev => ({ ...prev, [bankKey]: { ...bankDraft } })); setEditingBank(false); };

  // ── Signature upload ──────────────────────────────────────
  const handleSigUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setSigImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  // ── Letter pad upload ─────────────────────────────────────
  const handleLetterPadUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setLetterPadImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  // ── Col config helpers ────────────────────────────────────
  const toggleCol = (key) => {
    setActiveCols(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // ── Export Formats ─────────────────────────────────
  const exportPDF = () => {
    setShowPreview(true);
    setTimeout(() => window.print(), 500);
  };

  const exportWord = () => {
    const doc = document.getElementById("inv-printable-doc");
    if (!doc) { alert("Open preview first, then export."); return; }
    const html = `<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Invoice</title></head><body>${doc.outerHTML}</body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${invoiceNo}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="inv-wrapper">

      {/* ── Page Header ── */}
      <div className="inv-page-header">
        <div className="inv-page-title-group">
          <span className="inv-page-icon">🧾</span>
          <div>
            <h1 className="inv-page-title">Invoice Generation</h1>
            <p className="inv-page-sub">Create, configure and export professional invoices</p>
          </div>
        </div>
        <div className="inv-header-actions">
          <button className="inv-btn inv-btn--outline" onClick={() => setShowPreview(true)}>👁 Preview</button>
          <button className="inv-btn inv-btn--primary" onClick={exportPDF}>📄 Export PDF</button>
          <button className="inv-btn inv-btn--secondary" onClick={exportWord}>📝 Export Word</button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 1 — INVOICE DETAILS
      ══════════════════════════════════════════════════ */}
      <div className="inv-card">
        <div className="inv-card-header">
          <span className="inv-card-icon">📋</span>
          <h2 className="inv-card-title">Invoice Details</h2>
        </div>
        <div className="inv-card-body">
          <div className="inv-details-grid">
            <div className="inv-details-left">
              <div className="inv-field-block">
                <label className="inv-label">Vendor Name</label>
                <input className="inv-input" value={vendorName} onChange={e => setVendorName(e.target.value)} />
              </div>
              <div className="inv-field-block">
                <label className="inv-label">Vendor Address</label>
                <textarea className="inv-textarea" rows={3} value={vendorAddress} onChange={e => setVendorAddress(e.target.value)} />
              </div>
              <div className="inv-field-block">
                <label className="inv-label">Invoice To</label>
                <div className="inv-client-card" onClick={() => setShowClientModal(true)}>
                  <div className="inv-client-name">{clientName || <span className="inv-placeholder">Click to set client</span>}</div>
                  <div className="inv-client-addr">{clientAddress}</div>
                  <span className="inv-client-edit">✏ Edit</span>
                </div>
              </div>
            </div>

            <div className="inv-details-right">
              <div className="inv-meta-grid">
                <div className="inv-field-block">
                  <label className="inv-label">Invoice No.</label>
                  <input className="inv-input" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} />
                </div>
                <div className="inv-field-block">
                  <label className="inv-label">Invoice Date</label>
                  <input type="date" className="inv-input" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
                </div>
                <div className="inv-field-block">
                  <label className="inv-label">PAN No.</label>
                  <input className="inv-input" value={panNo} onChange={e => setPanNo(e.target.value)} />
                </div>
                <div className="inv-field-block">
                  <label className="inv-label">GSTIN No.</label>
                  <input className="inv-input" value={gstinNo} onChange={e => setGstinNo(e.target.value)} placeholder="GSTIN (if applicable)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 2 — INVOICE TITLE
      ══════════════════════════════════════════════════ */}
      <div className="inv-card">
        <div className="inv-card-header">
          <span className="inv-card-icon">📝</span>
          <h2 className="inv-card-title">Invoice Title</h2>
        </div>
        <div className="inv-card-body">
          <div className="inv-title-builder">
            <div className="inv-title-preview">
              INVOICE OF {vendorName.toUpperCase()} FOR THE MONTH OF {titleMonth.toUpperCase()} - {titleYear}
            </div>
            <div className="inv-title-selectors">
              <div className="inv-field-block">
                <label className="inv-label">Month</label>
                <select className="inv-select" value={titleMonth} onChange={e => setTitleMonth(e.target.value)}>
                  {MONTHS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="inv-field-block">
                <label className="inv-label">Year</label>
                <select className="inv-select" value={titleYear} onChange={e => setTitleYear(Number(e.target.value))}>
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 3 — PROJECT SELECTION & FILTER
      ══════════════════════════════════════════════════ */}
      <div className="inv-card">
        <div className="inv-card-header" style={{cursor:"pointer"}} onClick={() => setShowProjPanel(p => !p)}>
          <span className="inv-card-icon">📁</span>
          <h2 className="inv-card-title">Project Selection</h2>
          <span className="inv-card-badge">{selectedDPIds.size} selected</span>
          <span className="inv-chevron">{showProjPanel ? "▲" : "▼"}</span>
        </div>

        {showProjPanel && (
          <div className="inv-card-body">
            {/* Filters Row */}
            <div className="inv-proj-filters">
              <div className="inv-field-block">
                <label className="inv-label">Project</label>
                <select className="inv-select" value={filterProject} onChange={e => setFilterProject(e.target.value)}>
                  {PROJECT_OPTIONS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="inv-field-block">
                <label className="inv-label">Process</label>
                <select className="inv-select" value={filterProcess} onChange={e => setFilterProcess(e.target.value)}>
                  {PROCESS_OPTIONS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              {/* Changed Month/Year dropdown to input type="month" (calendar format) */}
              <div className="inv-field-block">
                <label className="inv-label">Start Month</label>
                <input type="month" className="inv-input" value={filterStartMonth} onChange={e => setFilterStartMonth(e.target.value)} />
              </div>
              <div className="inv-field-block">
                <label className="inv-label">End Month</label>
                <input type="month" className="inv-input" value={filterEndMonth} onChange={e => setFilterEndMonth(e.target.value)} />
              </div>
              <div className="inv-field-block">
                <label className="inv-label">Complexity</label>
                <select className="inv-select" value={filterComplexity} onChange={e => setFilterComplexity(e.target.value)}>
                  {COMPLEXITY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="inv-field-block">
                <label className="inv-label">File Status</label>
                <select className="inv-select" value={filterFileStatus} onChange={e => setFilterFileStatus(e.target.value)}>
                  {FILE_STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="inv-field-block inv-field-block--btn">
                <label className="inv-label">&nbsp;</label>
                <button className="inv-btn inv-btn--outline inv-btn--sm" onClick={() => {
                  setFilterProject("All Projects"); setFilterProcess("All Processes");
                  setFilterStartMonth(""); setFilterEndMonth("");
                  setFilterComplexity("All"); setFilterFileStatus("All");
                }}>✕ Clear</button>
              </div>
            </div>

            {/* Project Results Table */}
            <div className="inv-proj-table-wrap">
              {filteredDPs.length === 0 ? (
                <div className="inv-proj-empty">📭 No projects match the current filters.</div>
              ) : (
                <table className="inv-proj-table">
                  <thead>
                    <tr>
                      <th>
                        <input type="checkbox"
                          checked={selectedDPIds.size === filteredDPs.length && filteredDPs.length > 0}
                          onChange={selectAllDPs}
                        />
                      </th>
                      <th>Project</th>
                      <th>Process</th>
                      <th>Job ID</th>
                      <th>Title</th>
                      <th>Pages</th>
                      <th>Rate/Pg</th>
                      <th>Amount</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Complexity</th>
                      <th>File Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDPs.map(dp => {
                      const rate = PROCESS_RATES[dp.process] || 5;
                      const amt  = dp.pageCount * rate;
                      const sel  = selectedDPIds.has(dp.id);
                      return (
                        <tr key={dp.id} className={sel ? "inv-proj-row inv-proj-row--sel" : "inv-proj-row"}
                          onClick={() => toggleSelectDP(dp.id)}>
                          <td><input type="checkbox" checked={sel} onChange={() => toggleSelectDP(dp.id)} onClick={e => e.stopPropagation()} /></td>
                          <td><span className="inv-proj-tag">{dp.project}</span></td>
                          <td><span className="inv-proc-tag">{dp.process}</span></td>
                          <td className="inv-td-mono">{dp.jobId}</td>
                          <td className="inv-td-title" title={dp.titleName}>{dp.titleName}</td>
                          <td className="inv-td-num">{dp.pageCount}</td>
                          <td className="inv-td-num">₹{rate}</td>
                          <td className="inv-td-amt">₹{amt.toLocaleString("en-IN")}</td>
                          <td className="inv-td-mono">{formatDisplayMonth(dp.startMonth)}</td>
                          <td className="inv-td-mono">{formatDisplayMonth(dp.endMonth)}</td>
                          <td><span className={`inv-complexity inv-complexity--${dp.complexity.toLowerCase().replace(" ","")}`}>{dp.complexity}</span></td>
                          <td><span className={`inv-fstatus inv-fstatus--${dp.fileStatus.toLowerCase()}`}>{dp.fileStatus}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Add to Invoice Button */}
            <div className="inv-proj-add-row">
              <span className="inv-proj-sel-info">
                {selectedDPIds.size > 0
                  ? `${selectedDPIds.size} project${selectedDPIds.size > 1 ? "s" : ""} selected`
                  : "Select projects above to add to invoice"}
              </span>
              <button
                className={`inv-btn inv-btn--primary ${selectedDPIds.size === 0 ? "inv-btn--disabled" : ""}`}
                disabled={selectedDPIds.size === 0}
                onClick={addSelectedToInvoice}
              >
                ➕ Add {selectedDPIds.size > 0 ? selectedDPIds.size : ""} to Invoice Table
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 4 — COLUMN CONFIGURATION
      ══════════════════════════════════════════════════ */}
      <div className="inv-card">
        <div className="inv-card-header" onClick={() => setShowColPanel(p => !p)} style={{cursor:"pointer"}}>
          <span className="inv-card-icon">⚙</span>
          <h2 className="inv-card-title">Table Column Configuration</h2>
          <span className="inv-col-count">{enabledOptCols.length} optional columns enabled</span>
          <span className="inv-chevron">{showColPanel ? "▲" : "▼"}</span>
        </div>

        {showColPanel && (
          <div className="inv-card-body">
            <p className="inv-col-hint">
              Toggle columns to show in the invoice table. Priority order is automatically determined by the order in which you click/enable them!
            </p>
            <div className="inv-col-grid">
              {OPTIONAL_COLUMNS.map(col => {
                const isActive = activeCols.includes(col.key);
                return (
                  <div key={col.key} className={`inv-col-item ${isActive ? "inv-col-item--on" : ""}`}>
                    <Toggle checked={isActive} onChange={() => toggleCol(col.key)} />
                    <span className="inv-col-name">{col.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="inv-fixed-cols">
              <span className="inv-fixed-cols-label">Fixed Columns (always shown):</span>
              {["S.No","Project Name","Process","Book/Batch Name","Order Pages","Rate/Page","Amount","Deduction","Total Amount"].map(c => (
                <span key={c} className="inv-fixed-col-chip">{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 5 — INVOICE TABLE + TAX TOTALS
      ══════════════════════════════════════════════════ */}
      <div className="inv-card">
        <div className="inv-card-header">
          <span className="inv-card-icon">📊</span>
          <h2 className="inv-card-title">Invoice Table</h2>
          <button className="inv-btn inv-btn--sm inv-btn--primary inv-btn--ml" onClick={addEmptyRow}>+ Add Row</button>
        </div>

        <div className="inv-card-body inv-card-body--noPad">
          <div className="inv-table-scroll">
            <table className="inv-table">
              <thead>
                <tr className="inv-thead-top">
                  <th className="inv-th inv-th--sno" rowSpan={2}>S.No</th>
                  <th className="inv-th inv-th--proj" rowSpan={2}>Project Name</th>
                  <th className="inv-th inv-th--proc" rowSpan={2}>Process</th>
                  <th className="inv-th inv-th--batch" rowSpan={2}>Book/Batch Name</th>
                  {enabledOptCols.map(c => (
                    <th key={c.key} className="inv-th inv-th--opt" rowSpan={2}>
                      <input className="inv-th-edit" value={colHeaders[c.key] || c.label}
                        onChange={e => setColHeaders(h => ({...h, [c.key]: e.target.value}))} />
                    </th>
                  ))}
                  <th className="inv-th inv-th--fixed" rowSpan={2}>Order Pages</th>
                  <th className="inv-th inv-th--fixed" rowSpan={2}>Rate/Page (₹)</th>
                  <th className="inv-th inv-th--fixed" rowSpan={2}>Amount (₹)</th>
                  <th className="inv-th inv-th--fixed" rowSpan={2}>Deduction (₹)</th>
                  <th className="inv-th inv-th--total" rowSpan={2}>Total (₹)</th>
                  <th className="inv-th inv-th--action" rowSpan={2}>Del</th>
                </tr>
                <tr></tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.id} className="inv-tr">
                    <td className="inv-td inv-td--center">{idx + 1}</td>
                    <td className="inv-td">
                      <input className="inv-cell-input" value={row.projectName}
                        onChange={e => updateRow(row.id, "projectName", e.target.value)} placeholder="Project" />
                    </td>
                    <td className="inv-td">
                      <input className="inv-cell-input" value={row.process}
                        onChange={e => updateRow(row.id, "process", e.target.value)} placeholder="Process" />
                    </td>
                    <td className="inv-td">
                      <input className="inv-cell-input" value={row.bookBatchName}
                        onChange={e => updateRow(row.id, "bookBatchName", e.target.value)} placeholder="Batch Name" />
                    </td>
                    {enabledOptCols.map(c => (
                      <td key={c.key} className="inv-td">
                        <input className="inv-cell-input" value={row[c.key] || ""}
                          onChange={e => updateRow(row.id, c.key, e.target.value)} />
                      </td>
                    ))}
                    <td className="inv-td">
                      <input type="number" className="inv-cell-input inv-cell-input--num"
                        value={row.orderPages}
                        onChange={e => updateRow(row.id, "orderPages", e.target.value)} />
                    </td>
                    <td className="inv-td">
                      <input type="number" className="inv-cell-input inv-cell-input--num"
                        value={row.ratePage}
                        onChange={e => updateRow(row.id, "ratePage", e.target.value)} />
                    </td>
                    <td className="inv-td inv-td--calc">{row.amount ? fmt(row.amount) : ""}</td>
                    <td className="inv-td">
                      <input type="number" className="inv-cell-input inv-cell-input--num"
                        value={row.deductionAmount}
                        onChange={e => updateRow(row.id, "deductionAmount", e.target.value)} />
                    </td>
                    <td className="inv-td inv-td--total">{row.totalAmount ? fmt(row.totalAmount) : ""}</td>
                    <td className="inv-td inv-td--center">
                      <button className="inv-row-del" onClick={() => removeRow(row.id)} title="Remove">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tax & Totals */}
        <div className="inv-totals-panel">
          <div className="inv-totals-left">
            <div className="inv-amount-words-label">Amount in Words: </div>
            <div className="inv-amount-words-value">
              {grandTotal > 0 ? numberToWords(grandTotal) : "—"}
            </div>
          </div>
          <div className="inv-totals-right">
            <div className="inv-total-row">
              <span className="inv-total-label">Sub Total</span>
              <span className="inv-total-value">{fmt(subTotal)}</span>
            </div>
            <div className="inv-total-row">
              <span className="inv-total-label inv-total-igst">
                IGST
                <input type="number" min={0} max={100} className="inv-igst-input"
                  value={igstPct} onChange={e => setIgstPct(Number(e.target.value))} />
                %
              </span>
              <span className="inv-total-value">{fmt(igstAmt)}</span>
            </div>
            <div className="inv-total-row inv-total-row--grand">
              <span className="inv-total-label">Grand Total</span>
              <span className="inv-total-value inv-total-value--grand">{fmt(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 6 — BANK DETAILS
      ══════════════════════════════════════════════════ */}
      <div className="inv-card">
        <div className="inv-card-header">
          <span className="inv-card-icon">🏦</span>
          <h2 className="inv-card-title">Bank Details</h2>
        </div>
        <div className="inv-card-body">
          <div className="inv-bank-selector-row">
            <div className="inv-field-block inv-field-block--grow">
              <label className="inv-label">Select Bank Account</label>
              <select className="inv-select" value={bankKey} onChange={e => handleBankSwitch(e.target.value)}>
                {Object.entries(bankData).map(([k, b]) => (
                  <option key={k} value={k}>{b.label} — {b.acNo}</option>
                ))}
              </select>
            </div>
            {!editingBank && (
              <button className="inv-btn inv-btn--outline inv-btn--sm inv-btn--self-end" onClick={startEditBank}>
                ✏ Edit Bank
              </button>
            )}
          </div>

          {editingBank ? (
            <div className="inv-bank-edit-grid">
              {[
                ["label",    "Account Label",     "text"],
                ["bankName", "Bank Name",         "text"],
                ["acNo",     "Account Number",    "text"],
                ["branch",   "Branch",            "text"],
                ["ifsc",     "IFSC Code",         "text"],
                ["type",     "Account Type",      "text"],
              ].map(([key, lbl, type]) => (
                <div key={key} className="inv-field-block">
                  <label className="inv-label">{lbl}</label>
                  <input className="inv-input" type={type} value={bankDraft[key] || ""}
                    onChange={e => setBankDraft(d => ({...d, [key]: e.target.value}))} />
                </div>
              ))}
              <div className="inv-field-block">
                <label className="inv-label">Name on Account</label>
                <input className="inv-input" value={nameOnAccount} onChange={e => setNameOnAccount(e.target.value)} />
              </div>
              <div className="inv-field-block">
                <label className="inv-label">GPay Number</label>
                <input className="inv-input" value={gpay} onChange={e => setGpay(e.target.value)} />
              </div>
              <div className="inv-bank-edit-actions">
                <button className="inv-btn inv-btn--outline inv-btn--sm" onClick={() => setEditingBank(false)}>Cancel</button>
                <button className="inv-btn inv-btn--primary inv-btn--sm" onClick={saveBank}>💾 Save Bank</button>
              </div>
            </div>
          ) : (
            <div className="inv-bank-display">
              <div className="inv-bank-display-grid">
                <div className="inv-bank-field"><span className="inv-bank-lbl">Name in Bank A/c</span><span className="inv-bank-val">{nameOnAccount}</span></div>
                <div className="inv-bank-field"><span className="inv-bank-lbl">Bank Name</span><span className="inv-bank-val">{currentBank.bankName}</span></div>
                <div className="inv-bank-field"><span className="inv-bank-lbl">Account No.</span><span className="inv-bank-val inv-bank-val--mono">{currentBank.acNo}</span></div>
                <div className="inv-bank-field"><span className="inv-bank-lbl">Branch</span><span className="inv-bank-val">{currentBank.branch}</span></div>
                <div className="inv-bank-field"><span className="inv-bank-lbl">IFSC Code</span><span className="inv-bank-val inv-bank-val--mono">{currentBank.ifsc}</span></div>
                <div className="inv-bank-field"><span className="inv-bank-lbl">Account Type</span><span className="inv-bank-val">{currentBank.type}</span></div>
                <div className="inv-bank-field"><span className="inv-bank-lbl">GPay</span><span className="inv-bank-val">{gpay}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 7 — AUTHORIZED SIGNATURE
      ══════════════════════════════════════════════════ */}
      <div className="inv-card">
        <div className="inv-card-header">
          <span className="inv-card-icon">✍</span>
          <h2 className="inv-card-title">Authorized Signature</h2>
        </div>
        <div className="inv-card-body">
          <div className="inv-sig-layout">
            <div className="inv-sig-fields">
              <div className="inv-field-block">
                <label className="inv-label">Authorized Person Name</label>
                <input className="inv-input" value={sigName} onChange={e => setSigName(e.target.value)} placeholder="Name" />
              </div>
              <div className="inv-field-block">
                <label className="inv-label">Designation</label>
                <input className="inv-input" value={sigDesig} onChange={e => setSigDesig(e.target.value)} placeholder="Designation" />
              </div>
            </div>
            <div className="inv-sig-upload">
              <label className="inv-label">Signature Image</label>
              <div className="inv-sig-preview-box" onClick={() => sigInputRef.current?.click()}>
                {sigImage
                  ? <img src={sigImage} alt="Signature" className="inv-sig-img" />
                  : <div className="inv-sig-placeholder"><span>📤</span><span>Click to upload signature</span></div>
                }
                <div className="inv-sig-edit-overlay"><span>✏ Change</span></div>
              </div>
              <input ref={sigInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleSigUpload} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 8 — LETTER PAD SETTINGS
      ══════════════════════════════════════════════════ */}
      <div className="inv-card">
        <div className="inv-card-header">
          <span className="inv-card-icon">🗒</span>
          <h2 className="inv-card-title">Letter Pad Settings</h2>
        </div>
        <div className="inv-card-body">
          <div className="inv-letterpad-row">
            <Toggle
              checked={useLetterPad}
              onChange={setUseLetterPad}
              label="Use Letter Pad Background for Invoice"
            />
          </div>
          {useLetterPad && (
            <div className="inv-letterpad-upload-row">
              <div className="inv-letterpad-upload-box" onClick={() => letterPadInputRef.current?.click()}>
                {letterPadImage
                  ? <><img src={letterPadImage} alt="Letterpad preview" className="inv-letterpad-thumb" /><span className="inv-letterpad-change">✏ Change</span></>
                  : <><span className="inv-letterpad-icon">🖼</span><span>Click to upload your letter pad image</span><span className="inv-letterpad-hint">(PNG or JPG recommended)</span></>
                }
              </div>
              <input ref={letterPadInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleLetterPadUpload} />
              {letterPadImage && (
                <div className="inv-letterpad-info">
                  ✅ Letter pad loaded. Invoice will be overlaid on this background in the preview.
                </div>
              )}
              {!letterPadImage && (
                <div className="inv-letterpad-info inv-letterpad-info--warn">
                  ⚠ Please upload a letter pad image to use this feature.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          CLIENT MODAL
      ══════════════════════════════════════════════════ */}
      {showClientModal && (
        <div className="inv-modal-overlay" onClick={() => setShowClientModal(false)}>
          <div className="inv-modal" onClick={e => e.stopPropagation()}>
            <div className="inv-modal-header">
              <h3>Edit Client Details</h3>
              <button className="inv-modal-close" onClick={() => setShowClientModal(false)}>✕</button>
            </div>
            <div className="inv-modal-body">
              <div className="inv-field-block">
                <label className="inv-label">Company Name</label>
                <input className="inv-input" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Company name" />
              </div>
              <div className="inv-field-block">
                <label className="inv-label">Company Address</label>
                <textarea className="inv-textarea" rows={4} value={clientAddress} onChange={e => setClientAddress(e.target.value)} placeholder="Full address" />
              </div>
            </div>
            <div className="inv-modal-footer">
              <button className="inv-btn inv-btn--outline" onClick={() => setShowClientModal(false)}>Cancel</button>
              <button className="inv-btn inv-btn--primary" onClick={() => setShowClientModal(false)}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          INVOICE PREVIEW MODAL
      ══════════════════════════════════════════════════ */}
      {showPreview && (
        <div className="inv-modal-overlay inv-preview-overlay" onClick={() => setShowPreview(false)}>
          <div className="inv-preview-wrapper" onClick={e => e.stopPropagation()}>

            <div className="inv-preview-bar">
              <span className="inv-preview-bar-title">Invoice Preview</span>
              <div className="inv-preview-bar-actions">
                <button className="inv-btn inv-btn--primary inv-btn--sm" onClick={() => window.print()}>🖨 Print / Save PDF</button>
                <button className="inv-btn inv-btn--secondary inv-btn--sm" onClick={exportWord}>📝 Export Word</button>
                <button className="inv-btn inv-btn--outline inv-btn--sm" onClick={() => setShowPreview(false)}>✕ Close</button>
              </div>
            </div>

            <div className="inv-document-outer">
              {useLetterPad && letterPadImage && (
                <div className="inv-letterpad-bg" style={{backgroundImage:`url(${letterPadImage})`}} />
              )}
              <div className="inv-document" id="inv-printable-doc">

                {!useLetterPad && (
                  <>
                    <div className="inv-doc-header">
                      <div className="inv-doc-logo-area">
                        <div className="inv-doc-logo-placeholder">ADT</div>
                        <div className="inv-doc-brand">
                          <div className="inv-doc-brand-arrow">ARROW</div>
                          <div className="inv-doc-brand-data">DATA TECH</div>
                          <div className="inv-doc-brand-tag">▶ Focus the Target ▶▶</div>
                        </div>
                      </div>
                      <div className="inv-doc-contact">
                        <div>📞 7845186197 / 9843190938</div>
                        <div>🌐 www.arrowdatatech.com</div>
                        <div>📧 info@arrowdatatech.com</div>
                      </div>
                    </div>
                    <hr className="inv-doc-divider" />
                  </>
                )}

                {useLetterPad && <div className="inv-doc-letterpad-spacer" />}

                {/* Meta Table */}
                <table className="inv-doc-meta-table">
                  <tbody>
                    <tr>
                      <td className="inv-doc-meta-lbl" rowSpan={2}><strong>VENDOR NAME:</strong></td>
                      <td className="inv-doc-meta-val" rowSpan={2}>
                        <strong>{vendorName.toUpperCase()}</strong><br />
                        <span style={{whiteSpace:"pre-line",fontSize:"10px"}}>{vendorAddress}</span>
                      </td>
                      <td className="inv-doc-meta-lbl-r"><strong>INVOICE No:</strong></td>
                      <td className="inv-doc-meta-val-r" style={{textAlign:"center"}}>{invoiceNo}</td>
                    </tr>
                    <tr>
                      <td className="inv-doc-meta-lbl-r"><strong>INVOICE DATE:</strong></td>
                      <td className="inv-doc-meta-val-r" style={{textAlign:"center"}}>
                        {invoiceDate ? new Date(invoiceDate).toLocaleDateString("en-GB").replace(/\//g,"-") : ""}
                      </td>
                    </tr>
                    <tr>
                      <td className="inv-doc-meta-lbl"><strong>INVOICE TO:</strong></td>
                      <td className="inv-doc-meta-val">
                        <strong>{clientName}</strong><br />
                        <span style={{whiteSpace:"pre-line",fontSize:"10px"}}>{clientAddress}</span>
                      </td>
                      <td className="inv-doc-meta-lbl-r"><strong>PAN No:</strong></td>
                      <td className="inv-doc-meta-val-r" style={{textAlign:"center"}}>{panNo}</td>
                    </tr>
                    <tr>
                      <td></td><td></td>
                      <td className="inv-doc-meta-lbl-r"><strong>GSTIN No:</strong></td>
                      <td className="inv-doc-meta-val-r" style={{textAlign:"center"}}>{gstinNo || "—"}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Invoice Title */}
                <div className="inv-doc-title">
                  INVOICE OF {vendorName.toUpperCase()} FOR THE MONTH OF {titleMonth.toUpperCase()} - {titleYear}
                </div>

                {/* Invoice Table - Re-styled for strict center alignment inside cells */}
                <div className="inv-doc-table-wrap">
                  <table className="inv-doc-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Project Name</th>
                        <th>Process</th>
                        <th>Book/Batch Name</th>
                        {enabledOptCols.map(c => <th key={c.key}>{colHeaders[c.key] || c.label}</th>)}
                        <th>Pages</th>
                        <th>Rate/Pg (₹)</th>
                        <th>Amount (₹)</th>
                        <th>Deduction (₹)</th>
                        <th>Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, idx) => (
                        <tr key={row.id}>
                          <td style={{textAlign:"center"}}>{idx+1}</td>
                          <td style={{textAlign:"center"}}>{row.projectName}</td>
                          <td style={{textAlign:"center"}}>{row.process}</td>
                          <td style={{textAlign:"center"}}>{row.bookBatchName}</td>
                          {enabledOptCols.map(c => <td key={c.key} style={{textAlign:"center"}}>{row[c.key]}</td>)}
                          <td style={{textAlign:"center"}}>{row.orderPages}</td>
                          <td style={{textAlign:"center"}}>{row.ratePage}</td>
                          <td style={{textAlign:"center", fontWeight:600}}>{row.amount ? fmt(row.amount) : ""}</td>
                          <td style={{textAlign:"center"}}>{row.deductionAmount ? fmt(row.deductionAmount) : ""}</td>
                          <td style={{textAlign:"center", fontWeight:800, color:"#065f46"}}>{row.totalAmount ? fmt(row.totalAmount) : ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals + Amount in words */}
                <div className="inv-doc-totals-wrap">
                  <div className="inv-doc-words">
                    <strong>Amount in Words:</strong><br />
                    <span style={{fontSize:"10px"}}>{grandTotal > 0 ? numberToWords(grandTotal) : "—"}</span>
                  </div>
                  <div className="inv-doc-totals">
                    <div className="inv-doc-total-row"><span>TOTAL:</span><span style={{fontWeight:600}}>{fmt(subTotal)}</span></div>
                    <div className="inv-doc-total-row"><span>IGST ({igstPct}%):</span><span style={{fontWeight:600}}>{fmt(igstAmt)}</span></div>
                    <div className="inv-doc-total-row inv-doc-total-row--grand"><span>GRAND TOTAL:</span><span style={{fontWeight:800}}>{fmt(grandTotal)}</span></div>
                  </div>
                </div>

                {/* Bank + Signature */}
                <div className="inv-doc-bottom">
                  <div className="inv-doc-bank">
                    <div className="inv-doc-bank-title">BANK DETAILS:</div>
                    <div><strong>Name in Bank A/c :</strong> {nameOnAccount.toUpperCase()}</div>
                    <div><strong>Bank Name :</strong> {currentBank.bankName}</div>
                    <div><strong>Bank A/c No :</strong> {currentBank.acNo}</div>
                    <div><strong>BRANCH :</strong> {currentBank.branch}</div>
                    <div><strong>IFSC CODE :</strong> {currentBank.ifsc}</div>
                    <div><strong>GPAY :</strong> {gpay}</div>
                  </div>

                  <div className="inv-doc-sig">
                    {sigImage && (
                      <div className="inv-doc-sig-img-wrap">
                        <img src={sigImage} alt="Signature" className="inv-doc-sig-img" />
                      </div>
                    )}
                    <div className="inv-doc-sig-label"><strong>AUTHORISED SIGNATORY</strong></div>
                    <div className="inv-doc-sig-name"><strong>Name:</strong> {sigName}</div>
                    <div className="inv-doc-sig-desig"><strong>Designation:</strong> {sigDesig}</div>
                  </div>
                </div>

                {!useLetterPad && (
                  <div className="inv-doc-footer">
                    #07.MG ROAD, New Roundana, Near Puducherry, Kottakuppam, vanur T.K, Villupuram. Tamilnadu - 605104.
                  </div>
                )}
                {useLetterPad && <div className="inv-doc-letterpad-footer-spacer" />}

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}