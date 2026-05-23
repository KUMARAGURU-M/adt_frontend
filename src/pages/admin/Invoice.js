// ============================================================
// Invoice.js — Arrow Data Tech Invoice Generation v4
// Fixes:
//  1. QR code shown BELOW GPay in bank details section
//  2. Add New Bank Account button
//  3. No-letterpad = plain white A4 center (no css overlay)
//  4. Invoice meta table matches Image 1 exactly (4 rows, complete borders)
//  5. Single-page print (font + spacing scaled for A4)
//  6. Title row inside the bordered box (border-top:none)
// ============================================================
import React, { useState, useRef } from "react";
import "./Invoice.css";
import sign from "../../assets/images/sign.png";
import letterpad from "../../assets/images/letterpad.png";
import qrDefault from "../../assets/images/qr.png";   // place your QR at this path
import html2canvas from "html2canvas";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const YEARS = Array.from({ length: 10 }, (_, i) => 2024 + i);

const PROJECT_OPTIONS = ["All Projects", "LDM - Hanser", "ING - Usen", "ING - OUP", "LDM - T&F", "LDM - WILEY", "CNT", "IMP - EPUB", "CMT - JATS", "ING - ACDC", "LDM - ASS EPUB3"];
const PROCESS_OPTIONS = ["All Processes", "EPUB - QC Process", "EPUB - Tagging", "FIG - Croping", "INDEX - Process", "MATH - Keying", "OCR - Process", "Proof Reading - Process", "REF - Process", "TABLE - Process", "VALID - Process", "WORD - QC Process", "WORD - Styling", "XML - QC Process", "XML - Tagging"];
const COMPLEXITY_OPTIONS = ["All", "Simple", "Medium", "Complex", "Heavy Complex"];
const FILE_STATUS_OPTIONS = ["All", "Uploaded", "RTU", "Hold", "Query"];

const PROCESS_RATES = {
  "EPUB - QC Process": 4, "EPUB - Tagging": 6, "FIG - Croping": 3,
  "INDEX - Process": 5, "MATH - Keying": 8, "OCR - Process": 4,
  "Proof Reading - Process": 5, "REF - Process": 4, "TABLE - Process": 7,
  "VALID - Process": 3, "WORD - QC Process": 4, "WORD - Styling": 5,
  "XML - QC Process": 5, "XML - Tagging": 7,
};

const getComplexityClass = (v) => {
  if (!v || v === "All") return "";
  const s = v.toLowerCase().replace(/\s+/g, "");
  if (s.includes("heavycomplex")) return "complexity-heavycomplex";
  if (s.includes("complex")) return "complexity-complex";
  if (s.includes("medium")) return "complexity-medium";
  if (s.includes("simple")) return "complexity-simple";
  return "";
};

const DUMMY_CLIENTS = [
  { id: "C001", name: "ACRUX IT SERVICES (P) LTD.", address: "Block 1st Floor, T-HuB 1/C, 83/1 Raidurg Panmaktha, Near Hitech City,\nHyderabad, Rangareddy, Telangana - 500081" },
  { id: "C002", name: "WILEY INDIA PVT. LTD.", address: "4435/7 Ansari Road, Daryaganj,\nNew Delhi - 110002" },
  { id: "C003", name: "OXFORD UNIVERSITY PRESS INDIA", address: "YMCA Library Building, 1 Jai Singh Road,\nNew Delhi - 110001" },
  { id: "C004", name: "SPRINGER NATURE INDIA PVT. LTD.", address: "7th Floor, Vijaya Building, 17 Barakhamba Road,\nNew Delhi - 110001" },
  { id: "C005", name: "TAYLOR & FRANCIS GROUP", address: "2nd Floor, Vardhman Fortune Mall, Plot No. 4, NSP, Pitampura,\nNew Delhi - 110034" },
  { id: "C006", name: "ELSEVIER INDIA PVT. LTD.", address: "14th Floor, Building No. 10B, DLF Cyber City Phase-II,\nGurgaon, Haryana - 122002" },
  { id: "C007", name: "MACMILLAN PUBLISHERS INDIA LTD.", address: "21 Patullos Road, Chennai - 600002, Tamil Nadu" },
  { id: "C008", name: "CENGAGE LEARNING INDIA PVT. LTD.", address: "418, F.I.E., Patparganj Industrial Area,\nDelhi - 110092" },
];

const DUMMY_PROJECTS = [
  { id: "DP001", project: "LDM - T&F", process: "XML - Tagging", bookBatchName: "168111500001760", jobId: "JOB-1001", titleName: "TandF XML Conversion Vol 1", pageCount: 200, startDate: "2026-01-10", endDate: "2026-03-20", xmlIsbn: "978-0-12-345678-9", chapters: 12, complexity: "Simple", fileStatus: "RTU", uploadedDate: "2026-01-15", billingStatus: "Pending" },
  { id: "DP002", project: "LDM - WILEY", process: "EPUB - Tagging", bookBatchName: "168111500001761", jobId: "JOB-1002", titleName: "Wiley Chapter Conversion", pageCount: 350, startDate: "2026-02-05", endDate: "2026-04-15", xmlIsbn: "978-1-23-456789-0", chapters: 18, complexity: "Complex", fileStatus: "Uploaded", uploadedDate: "2026-02-10", billingStatus: "Pending" },
  { id: "DP003", project: "ING - OUP", process: "MATH - Keying", bookBatchName: "168111500001762", jobId: "JOB-1003", titleName: "Elsevier Journal Markup", pageCount: 500, startDate: "2026-03-01", endDate: "2026-05-30", xmlIsbn: "978-2-34-567890-1", chapters: 25, complexity: "Heavy Complex", fileStatus: "RTU", uploadedDate: "2026-03-05", billingStatus: "Invoiced" },
  { id: "DP004", project: "CMT - JATS", process: "XML - QC Process", bookBatchName: "168111500001763", jobId: "JOB-1004", titleName: "Springer Book Processing", pageCount: 280, startDate: "2026-04-10", endDate: "2026-05-25", xmlIsbn: "978-3-45-678901-2", chapters: 15, complexity: "Medium", fileStatus: "Hold", uploadedDate: "2026-04-20", billingStatus: "Pending" },
  { id: "DP005", project: "IMP - EPUB", process: "EPUB - QC Process", bookBatchName: "168111500001764", jobId: "JOB-1005", titleName: "EPUB Academic Series", pageCount: 180, startDate: "2026-01-08", endDate: "2026-02-28", xmlIsbn: "978-4-56-789012-3", chapters: 10, complexity: "Simple", fileStatus: "Uploaded", uploadedDate: "2026-01-20", billingStatus: "Pending" },
  { id: "DP006", project: "LDM - Hanser", process: "TABLE - Process", bookBatchName: "168111500001765", jobId: "JOB-1006", titleName: "Hanser Technical Manual", pageCount: 320, startDate: "2026-02-14", endDate: "2026-03-31", xmlIsbn: "978-5-67-890123-4", chapters: 20, complexity: "Complex", fileStatus: "Query", uploadedDate: "2026-02-25", billingStatus: "Pending" },
  { id: "DP007", project: "ING - Usen", process: "REF - Process", bookBatchName: "168111500001766", jobId: "JOB-1007", titleName: "Reference Processing Vol2", pageCount: 410, startDate: "2026-03-07", endDate: "2026-04-20", xmlIsbn: "978-6-78-901234-5", chapters: 22, complexity: "Medium", fileStatus: "RTU", uploadedDate: "2026-03-10", billingStatus: "Pending" },
  { id: "DP008", project: "CNT", process: "WORD - Styling", bookBatchName: "168111500001767", jobId: "JOB-1008", titleName: "Content Styling Project", pageCount: 260, startDate: "2026-04-03", endDate: "2026-05-15", xmlIsbn: "978-7-89-012345-6", chapters: 16, complexity: "Simple", fileStatus: "Uploaded", uploadedDate: "2026-04-05", billingStatus: "Pending" },
  { id: "DP009", project: "ING - ACDC", process: "OCR - Process", bookBatchName: "168111500001768", jobId: "JOB-1009", titleName: "ACDC Digital Conversion", pageCount: 150, startDate: "2026-01-20", endDate: "2026-01-31", xmlIsbn: "978-8-90-123456-7", chapters: 8, complexity: "Simple", fileStatus: "RTU", uploadedDate: "2026-01-30", billingStatus: "Pending" },
  { id: "DP010", project: "LDM - ASS EPUB3", process: "EPUB - Tagging", bookBatchName: "168111500001769", jobId: "JOB-1010", titleName: "ASS EPUB3 Migration", pageCount: 440, startDate: "2026-05-02", endDate: "2026-06-30", xmlIsbn: "978-9-01-234567-8", chapters: 28, complexity: "Heavy Complex", fileStatus: "Hold", uploadedDate: "2026-05-01", billingStatus: "Pending" },
  { id: "DP011", project: "LDM - T&F", process: "VALID - Process", bookBatchName: "168111500001770", jobId: "JOB-1011", titleName: "TandF Validation Run", pageCount: 190, startDate: "2026-02-10", endDate: "2026-03-25", xmlIsbn: "978-0-23-456789-1", chapters: 11, complexity: "Medium", fileStatus: "RTU", uploadedDate: "2026-02-14", billingStatus: "Pending" },
  { id: "DP012", project: "CMT - JATS", process: "FIG - Croping", bookBatchName: "168111500001771", jobId: "JOB-1012", titleName: "JATS Figure Crop Batch", pageCount: 300, startDate: "2026-03-12", endDate: "2026-04-22", xmlIsbn: "978-1-34-567890-2", chapters: 19, complexity: "Complex", fileStatus: "Uploaded", uploadedDate: "2026-03-18", billingStatus: "Pending" },
];

const OPTIONAL_COLUMNS = [
  { key: "receivedDate", label: "Received Date" },
  { key: "jobId", label: "Job ID" },
  { key: "titleName", label: "Title Name" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "xmlIsbn", label: "XML ISBN" },
  { key: "chapters", label: "No. of Chapters" },
  { key: "pdfInputType", label: "PDF Input Type" },
  { key: "complexity", label: "Complexity" },
  { key: "referenceType", label: "Reference Type" },
  { key: "fileStatus", label: "File Status" },
  { key: "uploadedDate", label: "Uploaded Date" },
  { key: "billingStatus", label: "Billing Status" },
];

// Default bank accounts
const DEFAULT_BANKS = {
  kvb: { key: "kvb", label: "KVB Current Account", acNo: "1681115000001760", bankName: "KARUR VYSYA BANK", branch: "LAWSPET", ifsc: "KVBL0001681", type: "Current", nameOnAccount: "ARROW DATA-TECH", gpay: "+91-9894562152", qrImage: qrDefault },
  sbi: { key: "sbi", label: "SBI Personal Account", acNo: "9876543210001", bankName: "STATE BANK OF INDIA", branch: "PONDICHERRY", ifsc: "SBIN0001234", type: "Savings", nameOnAccount: "ARROW DATA-TECH", gpay: "", qrImage: "" },
  hdfc: { key: "hdfc", label: "HDFC Personal Account", acNo: "1122334455667", bankName: "HDFC BANK", branch: "VANUR", ifsc: "HDFC0002345", type: "Savings", nameOnAccount: "ARROW DATA-TECH", gpay: "", qrImage: "" },
};

// ─────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────
function numberToWords(num) {
  if (!num || num === 0) return "Zero Rupees Only";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  function convert(n) {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
  }
  let r = "", x = Math.abs(Math.round(num));
  const cr = Math.floor(x / 10000000); x %= 10000000;
  const lk = Math.floor(x / 100000); x %= 100000;
  const th = Math.floor(x / 1000); x %= 1000;
  if (cr) r += convert(cr) + " Crore ";
  if (lk) r += convert(lk) + " Lakh ";
  if (th) r += convert(th) + " Thousand ";
  if (x) r += convert(x);
  return r.trim() + " Rupees Only";
}

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const today = () => new Date().toISOString().split("T")[0];
const genInvNo = () => { const d = new Date(); return `ADT-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`; };
const formatDate = (s) => { if (!s) return ""; try { return new Date(s).toLocaleDateString("en-GB").replace(/\//g, "-"); } catch { return s; } };

const EMPTY_ROW = (o = {}) => ({
  id: Date.now() + Math.random(),
  projectName: "", process: "", bookBatchName: "",
  receivedDate: "", jobId: "", titleName: "", pageCount: "",
  startDate: "", endDate: "", xmlIsbn: "", chapters: "",
  pdfInputType: "", complexity: "", referenceType: "",
  fileStatus: "", uploadedDate: "", billingStatus: "",
  orderPages: "", ratePage: "", amount: "", deductionAmount: "", totalAmount: "",
  ...o,
});

// ─────────────────────────────────────────────────────────────
// TOGGLE COMPONENT
// ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }) {
  return (
    <label className="inv-toggle-wrap">
      <div className={`inv-toggle ${checked ? "inv-toggle--on" : ""}`} onClick={() => onChange(!checked)}>
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

  // ── Invoice Details ─────────────────────────────────────
  const [vendorName, setVendorName] = useState("Arrow Data Tech");
  const [vendorAddress, setVendorAddress] = useState("#07, M.G Road, Kottakuppam, (Near Roundana), (Near Puducherry),\nVanur Taluk, Villupuram District, Tamilnadu-605104");
  const [invoiceNo, setInvoiceNo] = useState(genInvNo());
  const [invoiceDate, setInvoiceDate] = useState(today());
  const [panNo, setPanNo] = useState("AWXPM3024B");
  const [gstinNo, setGstinNo] = useState("");

  // ── Client ──────────────────────────────────────────────
  const [clients, setClients] = useState(DUMMY_CLIENTS);
  const [selectedClientId, setSelectedClientId] = useState("C001");
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientModalMode, setClientModalMode] = useState("edit");
  const [clientDraft, setClientDraft] = useState({ id: "", name: "", address: "" });
  const currentClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const openEditClient = () => { setClientDraft({ ...currentClient }); setClientModalMode("edit"); setShowClientModal(true); };
  const openAddClient = () => { setClientDraft({ id: `C${String(clients.length + 1).padStart(3, "0")}`, name: "", address: "" }); setClientModalMode("add"); setShowClientModal(true); };
  const saveClientModal = () => {
    if (!clientDraft.name.trim()) return;
    if (clientModalMode === "edit") {
      setClients(p => p.map(c => c.id === clientDraft.id ? { ...clientDraft } : c));
    } else {
      const newId = `C${String(clients.length + 1).padStart(3, "0")}`;
      setClients(p => [...p, { ...clientDraft, id: newId }]);
      setSelectedClientId(newId);
    }
    setShowClientModal(false);
  };

  // ── Invoice Title ────────────────────────────────────────
  const [titleMonth, setTitleMonth] = useState(MONTHS[new Date().getMonth()]);
  const [titleYear, setTitleYear] = useState(new Date().getFullYear());

  // ── Column Config ────────────────────────────────────────
  const [activeCols, setActiveCols] = useState([]);
  const [colHeaders, setColHeaders] = useState(() =>
    OPTIONAL_COLUMNS.reduce((acc, c) => { acc[c.key] = c.label; return acc; }, {})
  );

  // ── Rows ─────────────────────────────────────────────────
  const [rows, setRows] = useState([EMPTY_ROW(), EMPTY_ROW()]);

  // ── Project Filters ──────────────────────────────────────
  const [filterProject, setFilterProject] = useState("All Projects");
  const [filterProcess, setFilterProcess] = useState("All Processes");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterComplexity, setFilterComplexity] = useState("All");
  const [filterFileStatus, setFilterFileStatus] = useState("All");
  const [selectedDPIds, setSelectedDPIds] = useState(new Set());

  // ── Tax ──────────────────────────────────────────────────
  const [igstPct, setIgstPct] = useState(0);

  // ── Bank Details ─────────────────────────────────────────
  const [bankData, setBankData] = useState({ ...DEFAULT_BANKS });
  const [bankKey, setBankKey] = useState("kvb");
  const [editingBank, setEditingBank] = useState(false);
  const [bankDraft, setBankDraft] = useState({ ...DEFAULT_BANKS.kvb });
  const [showAddBank, setShowAddBank] = useState(false);
  const [newBankDraft, setNewBankDraft] = useState({ label: "", acNo: "", bankName: "", branch: "", ifsc: "", type: "Current", nameOnAccount: "ARROW DATA-TECH", gpay: "", qrImage: "" });

  // ── QR Code ──────────────────────────────────────────────
  const qrInputRef = useRef(null);
  const handleQrUpload = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      setBankData(p => ({
        ...p,
        [bankKey]: { ...p[bankKey], qrImage: ev.target.result }
      }));
    };
    r.readAsDataURL(f);
  };

  // ── Signature ────────────────────────────────────────────
  const [sigName, setSigName] = useState("T. Mohamed Usen");
  const [sigDesig, setSigDesig] = useState("Managing Director");
  const [sigImage, setSigImage] = useState(sign);
  const sigInputRef = useRef(null);
  const handleSigUpload = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = ev => setSigImage(ev.target.result); r.readAsDataURL(f);
  };

  // ── Letter Pad ───────────────────────────────────────────
  const [useLetterPad, setUseLetterPad] = useState(true);
  const [letterPadImage, setLetterPadImage] = useState(letterpad);
  const letterPadInputRef = useRef(null);
  const handleLetterPadUpload = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = ev => setLetterPadImage(ev.target.result); r.readAsDataURL(f);
  };

  // ── UI Panels ────────────────────────────────────────────
  const [showPreview, setShowPreview] = useState(false);
  const [showColPanel, setShowColPanel] = useState(true);
  const [showProjPanel, setShowProjPanel] = useState(true);

  // ── Derived ──────────────────────────────────────────────
  const enabledOptCols = activeCols.map(key => OPTIONAL_COLUMNS.find(c => c.key === key));
  const currentBank = bankData[bankKey];

  const filteredDPs = DUMMY_PROJECTS.filter(dp => {
    if (filterProject !== "All Projects" && dp.project !== filterProject) return false;
    if (filterProcess !== "All Processes" && dp.process !== filterProcess) return false;
    if (filterComplexity !== "All" && dp.complexity !== filterComplexity) return false;
    if (filterFileStatus !== "All" && dp.fileStatus !== filterFileStatus) return false;
    if (filterStartDate && dp.startDate < filterStartDate) return false;
    if (filterEndDate && dp.endDate > filterEndDate) return false;
    return true;
  });

  const subTotal = rows.reduce((s, r) => s + Number(r.totalAmount || 0), 0);
  const igstAmt = Math.round(subTotal * igstPct / 100);
  const grandTotal = subTotal + igstAmt;

  // ── Row helpers ───────────────────────────────────────────
  const addEmptyRow = () => setRows(r => [...r, EMPTY_ROW()]);
  const removeRow = (id) => setRows(r => r.filter(row => row.id !== id));
  const updateRow = (id, field, val) => {
    setRows(prev => prev.map(row => {
      if (row.id !== id) return row;
      const u = { ...row, [field]: val };
      if (field === "orderPages" || field === "ratePage") {
        const p = Number(field === "orderPages" ? val : row.orderPages) || 0;
        const rt = Number(field === "ratePage" ? val : row.ratePage) || 0;
        u.amount = p * rt;
        u.totalAmount = u.amount - Number(u.deductionAmount || 0);
      }
      if (field === "deductionAmount") {
        u.totalAmount = Number(u.amount || 0) - Number(val || 0);
      }
      return u;
    }));
  };

  const addSelectedToInvoice = () => {
    if (selectedDPIds.size === 0) return;
    const toAdd = DUMMY_PROJECTS.filter(dp => selectedDPIds.has(dp.id));
    const newRows = toAdd.map(dp => {
      const rate = PROCESS_RATES[dp.process] || 5;
      const amt = dp.pageCount * rate;
      return EMPTY_ROW({
        projectName: dp.project, process: dp.process, bookBatchName: dp.bookBatchName,
        jobId: dp.jobId, titleName: dp.titleName, pageCount: dp.pageCount,
        startDate: dp.startDate, endDate: dp.endDate, xmlIsbn: dp.xmlIsbn,
        chapters: dp.chapters, complexity: dp.complexity, fileStatus: dp.fileStatus,
        uploadedDate: dp.uploadedDate, billingStatus: dp.billingStatus,
        orderPages: dp.pageCount, ratePage: rate, amount: amt, deductionAmount: 0, totalAmount: amt,
      });
    });
    setRows(prev => {
      const nonEmpty = prev.filter(r => r.projectName || r.process || r.orderPages || r.totalAmount);
      return [...nonEmpty, ...newRows];
    });
    setSelectedDPIds(new Set());
  };

  const toggleSelectDP = (id) => setSelectedDPIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectAllDPs = () => { setSelectedDPIds(selectedDPIds.size === filteredDPs.length && filteredDPs.length > 0 ? new Set() : new Set(filteredDPs.map(dp => dp.id))); };

  // ── Bank helpers ──────────────────────────────────────────
  const handleBankSwitch = (key) => { setBankKey(key); setEditingBank(false); };
  const startEditBank = () => { setBankDraft({ ...currentBank }); setEditingBank(true); };
  const saveBank = () => { setBankData(p => ({ ...p, [bankKey]: { ...bankDraft } })); setEditingBank(false); };
  const saveNewBank = () => {
    if (!newBankDraft.label.trim() || !newBankDraft.acNo.trim()) return;
    const key = `bank_${Date.now()}`;
    setBankData(p => ({ ...p, [key]: { ...newBankDraft, key } }));
    setBankKey(key);
    setNewBankDraft({ label: "", acNo: "", bankName: "", branch: "", ifsc: "", type: "Current", nameOnAccount: "ARROW DATA-TECH", gpay: "", qrImage: "" });
    setShowAddBank(false);
  };

  // ── Col helpers ───────────────────────────────────────────
  const toggleCol = (key) => setActiveCols(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  // ── Exports ───────────────────────────────────────────────
  const exportPDF = () => { setShowPreview(true); setTimeout(() => window.print(), 600); };
  const exportExcel = () => {
    const headers = ["S.No", "Project Name", "Process", "Book/Batch Name", ...enabledOptCols.map(c => colHeaders[c.key] || c.label), "Order Pages", "Rate/Page (₹)", "Amount (₹)", "Deduction (₹)", "Total (₹)"];
    const dataRows = rows.map((r, i) => [i + 1, r.projectName, r.process, r.bookBatchName, ...enabledOptCols.map(c => r[c.key] || ""), r.orderPages, r.ratePage, r.amount || "", r.deductionAmount || "", r.totalAmount || ""]);
    const summary = [[], [, , , "Sub Total", "", fmt(subTotal)], [, , `IGST (${igstPct}%)`, "", fmt(igstAmt)], [, , , "Grand Total", "", fmt(grandTotal)]];
    const csv = [[headers, ...dataRows, ...summary]].flat().map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })), download: `${invoiceNo}.csv` });
    a.click(); URL.revokeObjectURL(a.href);
  };
  const exportWord = () => {
    const doc = document.getElementById("inv-printable-doc");
    if (!doc) { alert("Open preview first."); return; }
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([`<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body>${doc.outerHTML}</body></html>`], { type: "application/msword" })), download: `${invoiceNo}.doc` });
    a.click(); URL.revokeObjectURL(a.href);
  };
  const exportImage = async () => {
    setShowPreview(true);
    await new Promise(r => setTimeout(r, 400));
    const doc = document.getElementById("inv-printable-doc");
    if (!doc) return;
    if (html2canvas) {
      const canvas = await html2canvas(doc, { scale: 2, useCORS: true, backgroundColor: null });
      const a = Object.assign(document.createElement("a"), { href: canvas.toDataURL("image/png"), download: `${invoiceNo}.png` });
      a.click();
    } else { alert("html2canvas library is not loaded properly."); }
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
          {/* <button className="inv-btn inv-btn--secondary" onClick={exportWord}>📝 Export Word</button> */}
        </div>
      </div>

      {/* ── Section 1: Invoice Details ── */}
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
                <div className="inv-client-selector-row">
                  <select className="inv-select inv-select--client" value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <button className="inv-btn inv-btn--outline inv-btn--sm" onClick={openEditClient}>✏ Edit</button>
                  <button className="inv-btn inv-btn--primary inv-btn--sm" onClick={openAddClient}>+ New</button>
                </div>
                {currentClient && (
                  <div className="inv-client-preview">
                    <div className="inv-client-name">{currentClient.name}</div>
                    <div className="inv-client-addr">{currentClient.address}</div>
                  </div>
                )}
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

      {/* ── Section 2: Invoice Title ── */}
      <div className="inv-card">
        <div className="inv-card-header"><span className="inv-card-icon">📝</span><h2 className="inv-card-title">Invoice Title</h2></div>
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

      {/* ── Section 3: Project Selection ── */}
      <div className="inv-card">
        <div className="inv-card-header" style={{ cursor: "pointer" }} onClick={() => setShowProjPanel(p => !p)}>
          <span className="inv-card-icon">📁</span>
          <h2 className="inv-card-title">Project Selection</h2>
          <span className="inv-card-badge">{selectedDPIds.size} selected</span>
          <span className="inv-chevron">{showProjPanel ? "▲" : "▼"}</span>
        </div>
        {showProjPanel && (
          <div className="inv-card-body">
            <div className="inv-proj-filters">
              {[["Project", PROJECT_OPTIONS, filterProject, setFilterProject], ["Process", PROCESS_OPTIONS, filterProcess, setFilterProcess], ["Complexity", COMPLEXITY_OPTIONS, filterComplexity, setFilterComplexity], ["File Status", FILE_STATUS_OPTIONS, filterFileStatus, setFilterFileStatus]].map(([lbl, opts, val, set]) => (
                <div key={lbl} className="inv-field-block">
                  <label className="inv-label">{lbl}</label>
                  <select className="inv-select" value={val} onChange={e => set(e.target.value)}>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="inv-field-block"><label className="inv-label">Start From</label><input type="date" className="inv-input" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} /></div>
              <div className="inv-field-block"><label className="inv-label">End To</label><input type="date" className="inv-input" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} /></div>
              <div className="inv-field-block inv-field-block--btn">
                <label className="inv-label">&nbsp;</label>
                <button className="inv-btn inv-btn--outline inv-btn--sm" onClick={() => { setFilterProject("All Projects"); setFilterProcess("All Processes"); setFilterStartDate(""); setFilterEndDate(""); setFilterComplexity("All"); setFilterFileStatus("All"); }}>✕ Clear</button>
              </div>
            </div>
            <div className="inv-proj-table-wrap">
              {filteredDPs.length === 0 ? (
                <div className="inv-proj-empty">📭 No projects match the current filters.</div>
              ) : (
                <table className="inv-proj-table">
                  <thead><tr>
                    <th style={{ textAlign: "center" }}><input type="checkbox" checked={selectedDPIds.size === filteredDPs.length && filteredDPs.length > 0} onChange={selectAllDPs} /></th>
                    <th>PROJECT</th><th>PROCESS</th><th>JOB ID</th><th>TITLE</th>
                    <th>PAGES</th><th>RATE/PG</th><th>AMOUNT</th><th>START DATE</th><th>END DATE</th><th>COMPLEXITY</th><th>FILE STATUS</th>
                  </tr></thead>
                  <tbody>
                    {filteredDPs.map(dp => {
                      const rate = PROCESS_RATES[dp.process] || 5, amt = dp.pageCount * rate, sel = selectedDPIds.has(dp.id);
                      return (
                        <tr key={dp.id} className={`inv-proj-row ${sel ? "inv-proj-row--sel" : ""}`} onClick={() => toggleSelectDP(dp.id)}>
                          <td style={{ textAlign: "center" }}><input type="checkbox" checked={sel} onChange={() => toggleSelectDP(dp.id)} onClick={e => e.stopPropagation()} /></td>
                          <td><span className="inv-proj-tag">{dp.project}</span></td>
                          <td><span className="inv-proc-tag">{dp.process}</span></td>
                          <td className="inv-td-mono">{dp.jobId}</td>
                          <td className="inv-td-title" title={dp.titleName}>{dp.titleName}</td>
                          <td className="inv-td-num">{dp.pageCount}</td>
                          <td className="inv-td-num">₹{rate}</td>
                          <td className="inv-td-amt">₹{amt.toLocaleString("en-IN")}</td>
                          <td className="inv-td-mono">{formatDate(dp.startDate)}</td>
                          <td className="inv-td-mono">{formatDate(dp.endDate)}</td>
                          <td><span className={`inv-complexity inv-complexity--${dp.complexity.toLowerCase().replace(/\s+/g, "")}`}>{dp.complexity}</span></td>
                          <td><span className={`inv-fstatus inv-fstatus--${dp.fileStatus.toLowerCase()}`}>{dp.fileStatus}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            <div className="inv-proj-add-row">
              <span className="inv-proj-sel-info">{selectedDPIds.size > 0 ? `${selectedDPIds.size} project${selectedDPIds.size > 1 ? "s" : ""} selected` : "Select projects above"}</span>
              <button className={`inv-btn inv-btn--primary ${selectedDPIds.size === 0 ? "inv-btn--disabled" : ""}`} disabled={selectedDPIds.size === 0} onClick={addSelectedToInvoice}>
                ➕ Add {selectedDPIds.size > 0 ? selectedDPIds.size : ""} to Invoice Table
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 4: Column Config ── */}
      <div className="inv-card">
        <div className="inv-card-header" onClick={() => setShowColPanel(p => !p)} style={{ cursor: "pointer" }}>
          <span className="inv-card-icon">⚙</span>
          <h2 className="inv-card-title">Table Column Configuration</h2>
          <span className="inv-col-count">{enabledOptCols.length} optional columns enabled</span>
          <span className="inv-chevron">{showColPanel ? "▲" : "▼"}</span>
        </div>
        {showColPanel && (
          <div className="inv-card-body">
            <p className="inv-col-hint">Toggle columns on/off. Order of selection = column order in invoice.</p>
            <div className="inv-col-grid">
              {OPTIONAL_COLUMNS.map(col => {
                const isActive = activeCols.includes(col.key);
                const priority = isActive ? activeCols.indexOf(col.key) + 1 : null;
                return (
                  <div key={col.key} className={`inv-col-item ${isActive ? "inv-col-item--on" : ""}`}>
                    <Toggle checked={isActive} onChange={() => toggleCol(col.key)} />
                    <span className="inv-col-name">{col.label}</span>
                    {isActive && <span className="inv-col-priority">{priority}</span>}
                  </div>
                );
              })}
            </div>
            <div className="inv-fixed-cols">
              <span className="inv-fixed-cols-label">Always shown:</span>
              {["S.No", "Project Name", "Process", "Book/Batch Name", "Order Pages", "Rate/Page", "Amount", "Deduction", "Total"].map(c => <span key={c} className="inv-fixed-col-chip">{c}</span>)}
            </div>
          </div>
        )}
      </div>

      {/* ── Section 5: Invoice Table ── */}
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
                      <input className="inv-th-edit" value={colHeaders[c.key] || c.label} onChange={e => setColHeaders(h => ({ ...h, [c.key]: e.target.value }))} />
                    </th>
                  ))}
                  <th className="inv-th inv-th--fixed" rowSpan={2}>Pages</th>
                  <th className="inv-th inv-th--fixed" rowSpan={2}>Rate/Page (₹)</th>
                  <th className="inv-th inv-th--fixed" rowSpan={2}>Amount (₹)</th>
                  <th className="inv-th inv-th--fixed" rowSpan={2}>Deduction (₹)</th>
                  <th className="inv-th inv-th--total" rowSpan={2}>Total (₹)</th>
                  <th className="inv-th inv-th--action" rowSpan={2}>Del</th>
                </tr>
                <tr />
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.id} className="inv-tr">
                    <td className="inv-td inv-td--center">{idx + 1}</td>
                    <td className="inv-td col-left"><input className="inv-cell-input" value={row.projectName} onChange={e => updateRow(row.id, "projectName", e.target.value)} placeholder="Project" /></td>
                    <td className="inv-td"><input className="inv-cell-input" value={row.process} onChange={e => updateRow(row.id, "process", e.target.value)} placeholder="Process" /></td>
                    <td className="inv-td"><input className="inv-cell-input" value={row.bookBatchName} onChange={e => updateRow(row.id, "bookBatchName", e.target.value)} placeholder="Batch Name" /></td>
                    {enabledOptCols.map(c => {
                      const isDate = ["startDate", "endDate", "receivedDate", "uploadedDate"].includes(c.key);
                      const isComp = c.key === "complexity";
                      return (
                        <td key={c.key} className={`inv-td ${c.key === "titleName" ? "col-left" : ""}`}>
                          {isComp ? (
                            <select className={`inv-cell-input ${getComplexityClass(row[c.key])}`} value={row[c.key] || ""} onChange={e => updateRow(row.id, c.key, e.target.value)}>
                              <option value="">Select...</option>
                              {["Simple", "Medium", "Complex", "Heavy Complex"].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          ) : isDate ? (
                            <input type="date" className="inv-cell-input" value={row[c.key] || ""} onChange={e => updateRow(row.id, c.key, e.target.value)} />
                          ) : (
                            <input className="inv-cell-input" value={row[c.key] || ""} onChange={e => updateRow(row.id, c.key, e.target.value)} />
                          )}
                        </td>
                      );
                    })}
                    <td className="inv-td"><input type="number" className="inv-cell-input inv-cell-input--num" value={row.orderPages} onChange={e => updateRow(row.id, "orderPages", e.target.value)} /></td>
                    <td className="inv-td"><input type="number" className="inv-cell-input inv-cell-input--num" value={row.ratePage} onChange={e => updateRow(row.id, "ratePage", e.target.value)} /></td>
                    <td className="inv-td inv-td--calc">{row.amount ? fmt(row.amount) : ""}</td>
                    <td className="inv-td"><input type="number" className="inv-cell-input inv-cell-input--num" value={row.deductionAmount} onChange={e => updateRow(row.id, "deductionAmount", e.target.value)} /></td>
                    <td className="inv-td inv-td--total">{row.totalAmount ? fmt(row.totalAmount) : ""}</td>
                    <td className="inv-td inv-td--center"><button className="inv-row-del" onClick={() => removeRow(row.id)} title="Remove">✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="inv-totals-panel">
          <div className="inv-totals-left">
            <div className="inv-amount-words-inline">
              <span className="inv-amount-words-label">Amount in Words:</span>
              <span className="inv-amount-words-value">{grandTotal > 0 ? numberToWords(grandTotal) : "—"}</span>
            </div>
          </div>
          <div className="inv-totals-right">
            <div className="inv-total-row"><span className="inv-total-label">Sub Total</span><span className="inv-total-value">{fmt(subTotal)}</span></div>
            <div className="inv-total-row">
              <span className="inv-total-label">IGST <input type="number" min={0} max={100} className="inv-igst-input" value={igstPct} onChange={e => setIgstPct(Number(e.target.value))} />%</span>
              <span className="inv-total-value">{fmt(igstAmt)}</span>
            </div>
            <div className="inv-total-row inv-total-row--grand"><span className="inv-total-label">Grand Total</span><span className="inv-total-value inv-total-value--grand">{fmt(grandTotal)}</span></div>
          </div>
        </div>
      </div>

      {/* ── Section 6: Bank Details (QR below GPay) ── */}
      <div className="inv-card">
        <div className="inv-card-header">
          <span className="inv-card-icon">🏦</span>
          <h2 className="inv-card-title">Bank Details</h2>
        </div>
        <div className="inv-card-body">
          {/* Account selector dropdown */}
          <div className="inv-bank-selector-row">
            <div className="inv-field-block inv-field-block--grow">
              <label className="inv-label">Select Bank Account</label>
              <select className="inv-select" value={bankKey} onChange={(e) => handleBankSwitch(e.target.value)}>
                {Object.entries(bankData).map(([k, b]) => (
                  <option key={k} value={k}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: "8px", alignSelf: "flex-end", flexWrap: "wrap" }}>
              {!editingBank && <button className="inv-btn inv-btn--outline inv-btn--sm" onClick={startEditBank}>✏ Edit Bank</button>}
              <button className="inv-btn inv-btn--success inv-btn--sm" onClick={() => setShowAddBank(true)}>+ Add Bank</button>
            </div>
          </div>

          {editingBank ? (
            <div className="inv-bank-edit-grid">
              {[["label", "Account Label", "text"], ["bankName", "Bank Name", "text"], ["acNo", "Account Number", "text"], ["branch", "Branch", "text"], ["ifsc", "IFSC Code", "text"], ["type", "Account Type", "text"]].map(([key, lbl, type]) => (
                <div key={key} className="inv-field-block">
                  <label className="inv-label">{lbl}</label>
                  <input className="inv-input" type={type} value={bankDraft[key] || ""} onChange={e => setBankDraft(d => ({ ...d, [key]: e.target.value }))} />
                </div>
              ))}
              <div className="inv-field-block"><label className="inv-label">Name on Account</label><input className="inv-input" value={bankDraft.nameOnAccount || ""} onChange={e => setBankDraft(d => ({ ...d, nameOnAccount: e.target.value }))} /></div>
              <div className="inv-field-block"><label className="inv-label">GPay Number</label><input className="inv-input" value={bankDraft.gpay || ""} onChange={e => setBankDraft(d => ({ ...d, gpay: e.target.value }))} /></div>

              {/* Bank-specific QR Code inside Edit Mode */}
              <div className="inv-field-block inv-qr-edit-block">
                <label className="inv-label">Payment QR Code</label>
                <div className="inv-qr-upload-box" onClick={() => qrInputRef.current?.click()}>
                  {bankDraft.qrImage
                    ? <><img src={bankDraft.qrImage} alt="QR Code" className="inv-qr-img" /><span className="inv-qr-change">✏ Change QR</span></>
                    : <><span className="inv-qr-icon">📱</span><span className="inv-qr-placeholder-text">Click to upload QR Code</span></>
                  }
                </div>
                <input ref={qrInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                  const f = e.target.files[0]; if (!f) return;
                  const r = new FileReader(); r.onload = ev => setBankDraft(d => ({ ...d, qrImage: ev.target.result })); r.readAsDataURL(f);
                }} />
              </div>

              <div className="inv-bank-edit-actions">
                <button className="inv-btn inv-btn--outline inv-btn--sm" onClick={() => setEditingBank(false)}>Cancel</button>
                <button className="inv-btn inv-btn--primary inv-btn--sm" onClick={saveBank}>💾 Save</button>
              </div>
            </div>
          ) : (
            <div className="inv-bank-display-with-qr">
              {/* Bank fields */}
              <div className="inv-bank-display">
                <div className="inv-bank-display-grid">
                  <div className="inv-bank-field"><span className="inv-bank-lbl">Name in Bank A/c</span><span className="inv-bank-val">{currentBank.nameOnAccount || ""}</span></div>
                  <div className="inv-bank-field"><span className="inv-bank-lbl">Bank Name</span><span className="inv-bank-val">{currentBank.bankName}</span></div>
                  <div className="inv-bank-field"><span className="inv-bank-lbl">Account No.</span><span className="inv-bank-val inv-bank-val--mono">{currentBank.acNo}</span></div>
                  <div className="inv-bank-field"><span className="inv-bank-lbl">Branch</span><span className="inv-bank-val">{currentBank.branch}</span></div>
                  <div className="inv-bank-field"><span className="inv-bank-lbl">IFSC Code</span><span className="inv-bank-val inv-bank-val--mono">{currentBank.ifsc}</span></div>
                  <div className="inv-bank-field"><span className="inv-bank-lbl">Account Type</span><span className="inv-bank-val">{currentBank.type}</span></div>
                  <div className="inv-bank-field"><span className="inv-bank-lbl">GPay</span><span className="inv-bank-val">{currentBank.gpay || ""}</span></div>
                </div>
              </div>

              {/* QR Code — Inside each bank details section (in Display Mode) */}
              <div className="inv-qr-section">
                <label className="inv-label">Payment QR Code</label>
                <div className="inv-qr-upload-box" onClick={() => qrInputRef.current?.click()}>
                  {currentBank.qrImage
                    ? <><img src={currentBank.qrImage} alt="QR Code" className="inv-qr-img" /><span className="inv-qr-change">✏ Change QR</span></>
                    : <><span className="inv-qr-icon">📱</span><span className="inv-qr-placeholder-text">Click to upload QR Code</span><span className="inv-qr-hint">PNG / JPG (square preferred)</span></>
                  }
                </div>
                <input ref={qrInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleQrUpload} />
                <p className="inv-qr-note">QR appears on invoice between bank details and signature.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 7: Signature ── */}
      <div className="inv-card">
        <div className="inv-card-header"><span className="inv-card-icon">✍</span><h2 className="inv-card-title">Authorized Signature</h2></div>
        <div className="inv-card-body">
          <div className="inv-sig-layout">
            <div className="inv-sig-fields">
              <div className="inv-field-block"><label className="inv-label">Authorized Person Name</label><input className="inv-input" value={sigName} onChange={e => setSigName(e.target.value)} /></div>
              <div className="inv-field-block"><label className="inv-label">Designation</label><input className="inv-input" value={sigDesig} onChange={e => setSigDesig(e.target.value)} /></div>
            </div>
            <div className="inv-sig-upload">
              <label className="inv-label">Signature Image</label>
              <div className="inv-sig-preview-box" onClick={() => sigInputRef.current?.click()}>
                {sigImage ? <img src={sigImage} alt="Signature" className="inv-sig-img" /> : <div className="inv-sig-placeholder"><span>📤</span><span>Click to upload signature</span></div>}
                <div className="inv-sig-edit-overlay"><span>✏ Change</span></div>
              </div>
              <input ref={sigInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleSigUpload} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 8: Letter Pad ── */}
      <div className="inv-card">
        <div className="inv-card-header"><span className="inv-card-icon">🗒</span><h2 className="inv-card-title">Letter Pad Settings</h2></div>
        <div className="inv-card-body">
          <div className="inv-letterpad-row">
            <Toggle checked={useLetterPad} onChange={setUseLetterPad} label="Use Letter Pad Background for Invoice" />
          </div>
          {useLetterPad && (
            <div className="inv-letterpad-upload-row">
              <div className="inv-letterpad-upload-box" onClick={() => letterPadInputRef.current?.click()}>
                {letterPadImage
                  ? <><img src={letterPadImage} alt="Letterpad" className="inv-letterpad-thumb" /><span className="inv-letterpad-change">✏ Change</span></>
                  : <><span className="inv-letterpad-icon">🖼</span><span>Click to upload your letter pad image</span><span className="inv-letterpad-hint">(PNG or JPG)</span></>
                }
              </div>
              <input ref={letterPadInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLetterPadUpload} />
              {letterPadImage
                ? <div className="inv-letterpad-info">✅ Letter pad loaded. Invoice content will be overlaid on this background.</div>
                : <div className="inv-letterpad-info inv-letterpad-info--warn">⚠ Please upload a letter pad image.</div>
              }
            </div>
          )}
        </div>
      </div>

      {/* ── Section 9: Export ── */}
      <div className="inv-card inv-card--export">
        <div className="inv-card-header"><span className="inv-card-icon">🚀</span><h2 className="inv-card-title">Preview & Export Invoice</h2></div>
        <div className="inv-card-body">
          <div className="inv-export-grid">
            <button className="inv-export-btn inv-export-btn--preview" onClick={() => setShowPreview(true)}><span className="inv-export-icon">👁</span><span className="inv-export-label">Preview</span><span className="inv-export-sub">View before export</span></button>
            <button className="inv-export-btn inv-export-btn--pdf" onClick={exportPDF}>  <span className="inv-export-icon">📄</span><span className="inv-export-label">Export PDF</span><span className="inv-export-sub">Print / Save as PDF</span></button>
            <button className="inv-export-btn inv-export-btn--image" onClick={exportImage}><span className="inv-export-icon">🖼</span><span className="inv-export-label">Export Image</span><span className="inv-export-sub">Save as PNG file</span></button>
            <button className="inv-export-btn inv-export-btn--excel" onClick={exportExcel}><span className="inv-export-icon">📊</span><span className="inv-export-label">Export Excel</span><span className="inv-export-sub">Download as CSV</span></button>
            {/* <button className="inv-export-btn inv-export-btn--word" onClick={exportWord}> <span className="inv-export-icon">📝</span><span className="inv-export-label">Export Word</span><span className="inv-export-sub">Download as .doc</span></button> */}
          </div>
        </div>
      </div>

      {/* ── Client Modal ── */}
      {showClientModal && (
        <div className="inv-modal-overlay" onClick={() => setShowClientModal(false)}>
          <div className="inv-modal" onClick={e => e.stopPropagation()}>
            <div className="inv-modal-header"><h3>{clientModalMode === "add" ? "Add New Client" : "Edit Client"}</h3><button className="inv-modal-close" onClick={() => setShowClientModal(false)}>✕</button></div>
            <div className="inv-modal-body">
              <div className="inv-field-block"><label className="inv-label">Company Name</label><input className="inv-input" value={clientDraft.name} onChange={e => setClientDraft(d => ({ ...d, name: e.target.value }))} placeholder="Company name" /></div>
              <div className="inv-field-block"><label className="inv-label">Company Address</label><textarea className="inv-textarea" rows={4} value={clientDraft.address} onChange={e => setClientDraft(d => ({ ...d, address: e.target.value }))} placeholder="Full address" /></div>
            </div>
            <div className="inv-modal-footer">
              <button className="inv-btn inv-btn--outline" onClick={() => setShowClientModal(false)}>Cancel</button>
              <button className="inv-btn inv-btn--primary" onClick={saveClientModal}>{clientModalMode === "add" ? "Add Client" : "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Bank Modal ── */}
      {showAddBank && (
        <div className="inv-modal-overlay" onClick={() => setShowAddBank(false)}>
          <div className="inv-modal" onClick={e => e.stopPropagation()}>
            <div className="inv-modal-header"><h3>Add New Bank Account</h3><button className="inv-modal-close" onClick={() => setShowAddBank(false)}>✕</button></div>
            <div className="inv-modal-body">
              {[
                ["label", "Account Label (shown in selector)"],
                ["bankName", "Bank Name"],
                ["acNo", "Account Number"],
                ["branch", "Branch"],
                ["ifsc", "IFSC Code"],
                ["type", "Account Type (Current/Savings)"],
                ["nameOnAccount", "Name in Bank A/c"],
                ["gpay", "GPay Number"]
              ].map(([key, lbl]) => (
                <div key={key} className="inv-field-block">
                  <label className="inv-label">{lbl}</label>
                  <input className="inv-input" value={newBankDraft[key] || ""} onChange={e => setNewBankDraft(d => ({ ...d, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div className="inv-modal-footer">
              <button className="inv-btn inv-btn--outline" onClick={() => setShowAddBank(false)}>Cancel</button>
              <button className="inv-btn inv-btn--primary" onClick={saveNewBank}>Add Bank Account</button>
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
                <button className="inv-btn inv-btn--secondary inv-btn--sm" onClick={exportImage}>🖼 Export Image</button>
                <button className="inv-btn inv-btn--secondary inv-btn--sm" onClick={exportExcel}>📊 Export Excel</button>
                <button className="inv-btn inv-btn--secondary inv-btn--sm" onClick={exportWord}>📝 Export Word</button>
                <button className="inv-btn inv-btn--outline inv-btn--sm" onClick={() => setShowPreview(false)}>✕ Close</button>
              </div>
            </div>

            <div className="inv-document-outer">
              {/* The invoice document */}
              <div className={`inv-document ${useLetterPad ? "inv-document--letterpad" : "inv-document--plain"}`} id="inv-printable-doc">
                {/* Letterpad as background image inside the document to capture with html2canvas */}
                {useLetterPad && letterPadImage && (
                  <img src={letterPadImage} alt="Letterpad" className="inv-letterpad-bg-img" />
                )}

                {/* Plain header (only when no letterpad) */}
                {!useLetterPad && (
                  <>
                    {/* <div className="inv-doc-header">
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
                    <hr className="inv-doc-divider" /> */}
                  </>
                )}

                {/* Spacer to clear letterpad logo area */}
                {useLetterPad && <div className="inv-doc-letterpad-spacer" />}

                {/* ── META TABLE — exact Image 1 layout ──
                    Row 1: VENDOR NAME | vendor name+address | INVOICE No: | value
                    Row 2: INVOICE TO  | client name+address | INVOICE DATE: | value
                    Row 3: (empty)     | (empty)             | PAN No:  | value
                    Row 4: (empty)     | (empty)             | GSTIN No:| value
                    All cells have borders.
                ── */}
                <table className="inv-doc-meta-table">
                  <tbody>
                    <tr>
                      <td className="inv-doc-meta-lbl" rowSpan={2}><strong>VENDOR NAME:</strong></td>
                      <td className="inv-doc-meta-val" rowSpan={2}>
                        <strong>{vendorName.toUpperCase()}</strong>
                        <small>{vendorAddress}</small>
                      </td>
                      <td className="inv-doc-meta-lbl-r"><strong>INVOICE No:</strong></td>
                      <td className="inv-doc-meta-val-r">{invoiceNo}</td>
                    </tr>
                    <tr>
                      <td className="inv-doc-meta-lbl-r"><strong>INVOICE DATE:</strong></td>
                      <td className="inv-doc-meta-val-r">{invoiceDate ? new Date(invoiceDate).toLocaleDateString("en-GB").replace(/\//g, "-") : ""}</td>
                    </tr>
                    <tr>
                      <td className="inv-doc-meta-lbl" rowSpan={2}><strong>INVOICE TO:</strong></td>
                      <td className="inv-doc-meta-val" rowSpan={2}>
                        <strong>{currentClient?.name}</strong>
                        <small>{currentClient?.address}</small>
                      </td>
                      <td className="inv-doc-meta-lbl-r"><strong>PAN No:</strong></td>
                      <td className="inv-doc-meta-val-r">{panNo}</td>
                    </tr>
                    <tr>
                      <td className="inv-doc-meta-lbl-r"><strong>GSTIN No:</strong></td>
                      <td className="inv-doc-meta-val-r">{gstinNo || "—"}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Title row — INSIDE the bordered box (border-top:none) */}
                <div className="inv-doc-title">
                  INVOICE OF {vendorName.toUpperCase()} FOR THE MONTH OF {titleMonth.toUpperCase()} - {titleYear}
                </div>

                {/* Invoice data table — border-top:none shares with title bottom */}
                <div className="inv-doc-table-wrap">
                  <table className="inv-doc-table">
                    <thead>
                      <tr>
                        <th className="inv-doc-th--sno">S. No</th>
                        <th>Project Name</th>
                        <th>Task Name</th>
                        <th>Book/Batch Name</th>
                        {enabledOptCols.map(c => <th key={c.key}>{colHeaders[c.key] || c.label}</th>)}
                        <th>Pages</th>
                        <th>Rate/Page (₹)</th>
                        <th>Amount (₹)</th>
                        <th>Deduction Amount (₹)</th>
                        <th>Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, idx) => (
                        <tr key={row.id}>
                          <td className="inv-doc-td--center">{idx + 1}</td>
                          <td>{row.projectName}</td>
                          <td>{row.process}</td>
                          <td>{row.bookBatchName}</td>
                          {enabledOptCols.map(c => (
                            <td key={c.key}>
                              {["startDate", "endDate", "receivedDate", "uploadedDate"].includes(c.key) ? formatDate(row[c.key]) : row[c.key]}
                            </td>
                          ))}
                          <td className="inv-doc-td--num">{row.orderPages}</td>
                          <td className="inv-doc-td--num">{row.ratePage}</td>
                          <td className="inv-doc-td--num">{row.amount ? Number(row.amount).toLocaleString("en-IN") : ""}</td>
                          <td className="inv-doc-td--num">{row.deductionAmount ? Number(row.deductionAmount).toLocaleString("en-IN") : "-"}</td>
                          <td className="inv-doc-td--num inv-doc-td--total">{row.totalAmount ? Number(row.totalAmount).toLocaleString("en-IN") : ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals — flush below table */}
                <table className="inv-doc-totals-table">
                  <tbody>
                    <tr>
                      <td className="inv-doc-words-cell" rowSpan={3}>
                        <strong>Amount in Words: </strong>
                        <span>{grandTotal > 0 ? numberToWords(grandTotal) : "—"}</span>
                      </td>
                      <td className="inv-doc-total-label-cell"><strong>TOTAL:</strong></td>
                      <td className="inv-doc-total-val-cell">{fmt(subTotal)}</td>
                    </tr>
                    <tr>
                      <td className="inv-doc-total-label-cell"><strong>IGST ({igstPct}%):</strong></td>
                      <td className="inv-doc-total-val-cell">{fmt(igstAmt)}</td>
                    </tr>
                    <tr>
                      <td className="inv-doc-total-label-cell inv-doc-grand-label"><strong>GRAND TOTAL:</strong></td>
                      <td className="inv-doc-total-val-cell inv-doc-grand-val"><strong>{fmt(grandTotal)}</strong></td>
                    </tr>
                  </tbody>
                </table>

                {/* Bottom: Bank | QR | Signature */}
                <div className="inv-doc-bottom">
                  {/* Bank details */}
                  <div className="inv-doc-bank">
                    <div className="inv-doc-bank-title">BANK DETAILS:</div>
                    <table className="inv-doc-bank-table">
                      <tbody>
                        <tr><td><strong>Name in Bank A/c :</strong></td><td>{(currentBank.nameOnAccount || "").toUpperCase()}</td></tr>
                        <tr><td><strong>Bank Name :</strong></td>        <td>{currentBank.bankName}</td></tr>
                        <tr><td><strong>Bank A/c No :</strong></td>      <td>{currentBank.acNo}</td></tr>
                        <tr><td><strong>BRANCH :</strong></td>           <td>{currentBank.branch}</td></tr>
                        <tr><td><strong>IFSC CODE :</strong></td>        <td>{currentBank.ifsc}</td></tr>
                        <tr><td><strong>GPAY :</strong></td>             <td>{currentBank.gpay || ""}</td></tr>
                        <tr>
                          <td><strong>QR :</strong></td>
                          <td>
                            <div className="inv-doc-qr">
                              {currentBank.qrImage ? (
                                <img src={currentBank.qrImage} alt="Payment QR" className="inv-doc-qr-img" />
                              ) : (
                                <div className="inv-doc-qr-placeholder">
                                  <span className="inv-doc-qr-placeholder-icon">📱</span>
                                  <span className="inv-doc-qr-placeholder-text">QR Code</span>
                                </div>
                              )}
                              <div className="inv-doc-qr-label">Scan to Pay</div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="inv-doc-sig">
                    {sigImage && <div className="inv-doc-sig-img-wrap"><img src={sigImage} alt="Signature" className="inv-doc-sig-img" /></div>}
                    <div className="inv-doc-sig-label"><strong>AUTHORISED SIGNATORY</strong></div>
                    <div className="inv-doc-sig-name"><strong>Name:</strong> {sigName}</div>
                    <div className="inv-doc-sig-desig"><strong>Designation:</strong> {sigDesig}</div>
                  </div>
                </div>

                {useLetterPad && <div className="inv-doc-letterpad-footer-spacer" />}

              </div>{/* end inv-document */}
            </div>{/* end inv-document-outer */}
          </div>{/* end inv-preview-wrapper */}
        </div>
      )}

    </div>
  );
}