import React, { useState, useRef, useEffect } from "react";
import "./TimeLog.css";

// ── View Modes ────────────────────────────────────────────────────────────────
const VIEW_MODES = [
    { key: "daily", label: "Daily", icon: "📅" },
    { key: "weekly", label: "Weekly", icon: "🗓" },
    { key: "monthly", label: "Monthly", icon: "📆" },
];

// ── Mock Data ─────────────────────────────────────────────────────────────────
const EMPLOYEES = ["All", "Sureka", "Ayeesha M", "Shakina A", "T. Mohamed Usen", "Karthika"];
const PROJECTS = ["All", "Arrow Data-Tech Portal", "WorkWise App", "Client Dashboard", "API Module"];

const MOCK_LOGS = [
    {
        id: 1, employee: "Sureka", initial: "S", date: "2026-05-21", project: "Arrow Data-Tech Portal", checkIn: "09:02", checkOut: "18:05", workedHrs: "7h 48m", breakCount: 3, breakHrs: "0h 45m", lunchIn: "13:00", lunchOut: "13:45", lunchHrs: "0h 45m", pages: 42, status: "Complete",
        timeline: [{ type: "check-in", time: "09:02", label: "Check In" }, { type: "break-start", time: "10:30", label: "Break" }, { type: "break-end", time: "10:45", label: "Resume" }, { type: "lunch-start", time: "13:00", label: "Lunch" }, { type: "lunch-end", time: "13:45", label: "Resume" }, { type: "break-start", time: "15:30", label: "Break" }, { type: "break-end", time: "15:45", label: "Resume" }, { type: "check-out", time: "18:05", label: "Check Out" }]
    },
    {
        id: 2, employee: "Ayeesha M", initial: "A", date: "2026-05-21", project: "WorkWise App", checkIn: "08:55", checkOut: "17:58", workedHrs: "8h 18m", breakCount: 2, breakHrs: "0h 30m", lunchIn: "13:15", lunchOut: "14:00", lunchHrs: "0h 45m", pages: 58, status: "Complete",
        timeline: [{ type: "check-in", time: "08:55", label: "Check In" }, { type: "break-start", time: "11:00", label: "Break" }, { type: "break-end", time: "11:15", label: "Resume" }, { type: "lunch-start", time: "13:15", label: "Lunch" }, { type: "lunch-end", time: "14:00", label: "Resume" }, { type: "break-start", time: "16:00", label: "Break" }, { type: "break-end", time: "16:15", label: "Resume" }, { type: "check-out", time: "17:58", label: "Check Out" }]
    },
    {
        id: 3, employee: "Shakina A", initial: "S", date: "2026-05-21", project: "Client Dashboard", checkIn: "09:10", checkOut: "—", workedHrs: "5h 12m", breakCount: 1, breakHrs: "0h 15m", lunchIn: "13:00", lunchOut: "13:50", lunchHrs: "0h 50m", pages: 27, status: "Active",
        timeline: [{ type: "check-in", time: "09:10", label: "Check In" }, { type: "break-start", time: "11:30", label: "Break" }, { type: "break-end", time: "11:45", label: "Resume" }, { type: "lunch-start", time: "13:00", label: "Lunch" }, { type: "lunch-end", time: "13:50", label: "Resume" }]
    },
    {
        id: 4, employee: "T. Mohamed Usen", initial: "T", date: "2026-05-21", project: "API Module", checkIn: "09:00", checkOut: "18:00", workedHrs: "8h 00m", breakCount: 2, breakHrs: "0h 30m", lunchIn: "13:00", lunchOut: "13:30", lunchHrs: "0h 30m", pages: 64, status: "Complete",
        timeline: [{ type: "check-in", time: "09:00", label: "Check In" }, { type: "break-start", time: "10:45", label: "Break" }, { type: "break-end", time: "11:00", label: "Resume" }, { type: "lunch-start", time: "13:00", label: "Lunch" }, { type: "lunch-end", time: "13:30", label: "Resume" }, { type: "break-start", time: "15:45", label: "Break" }, { type: "break-end", time: "16:00", label: "Resume" }, { type: "check-out", time: "18:00", label: "Check Out" }]
    },
    {
        id: 5, employee: "Karthika", initial: "K", date: "2026-05-20", project: "Arrow Data-Tech Portal", checkIn: "09:05", checkOut: "17:50", workedHrs: "7h 30m", breakCount: 2, breakHrs: "0h 30m", lunchIn: "13:05", lunchOut: "13:50", lunchHrs: "0h 45m", pages: 39, status: "Complete",
        timeline: [{ type: "check-in", time: "09:05", label: "Check In" }, { type: "break-start", time: "11:00", label: "Break" }, { type: "break-end", time: "11:15", label: "Resume" }, { type: "lunch-start", time: "13:05", label: "Lunch" }, { type: "lunch-end", time: "13:50", label: "Resume" }, { type: "break-start", time: "15:30", label: "Break" }, { type: "break-end", time: "15:45", label: "Resume" }, { type: "check-out", time: "17:50", label: "Check Out" }]
    },
    {
        id: 6, employee: "Sureka", initial: "S", date: "2026-05-20", project: "WorkWise App", checkIn: "09:00", checkOut: "18:10", workedHrs: "8h 25m", breakCount: 3, breakHrs: "0h 45m", lunchIn: "13:00", lunchOut: "13:45", lunchHrs: "0h 45m", pages: 51, status: "Complete",
        timeline: [{ type: "check-in", time: "09:00", label: "Check In" }, { type: "break-start", time: "10:30", label: "Break" }, { type: "break-end", time: "10:45", label: "Resume" }, { type: "lunch-start", time: "13:00", label: "Lunch" }, { type: "lunch-end", time: "13:45", label: "Resume" }, { type: "break-start", time: "15:30", label: "Break" }, { type: "break-end", time: "15:45", label: "Resume" }, { type: "break-start", time: "17:00", label: "Break" }, { type: "break-end", time: "17:15", label: "Resume" }, { type: "check-out", time: "18:10", label: "Check Out" }]
    },
    {
        id: 7, employee: "Ayeesha M", initial: "A", date: "2026-05-20", project: "Client Dashboard", checkIn: "09:00", checkOut: "18:00", workedHrs: "8h 00m", breakCount: 2, breakHrs: "0h 30m", lunchIn: "13:00", lunchOut: "13:45", lunchHrs: "0h 45m", pages: 44, status: "Complete",
        timeline: [{ type: "check-in", time: "09:00", label: "Check In" }, { type: "break-start", time: "11:00", label: "Break" }, { type: "break-end", time: "11:15", label: "Resume" }, { type: "lunch-start", time: "13:00", label: "Lunch" }, { type: "lunch-end", time: "13:45", label: "Resume" }, { type: "break-start", time: "16:00", label: "Break" }, { type: "break-end", time: "16:15", label: "Resume" }, { type: "check-out", time: "18:00", label: "Check Out" }]
    },
    {
        id: 8, employee: "T. Mohamed Usen", initial: "T", date: "2026-05-19", project: "API Module", checkIn: "09:00", checkOut: "17:45", workedHrs: "7h 45m", breakCount: 2, breakHrs: "0h 30m", lunchIn: "13:00", lunchOut: "13:30", lunchHrs: "0h 30m", pages: 55, status: "Complete",
        timeline: [{ type: "check-in", time: "09:00", label: "Check In" }, { type: "break-start", time: "10:45", label: "Break" }, { type: "break-end", time: "11:00", label: "Resume" }, { type: "lunch-start", time: "13:00", label: "Lunch" }, { type: "lunch-end", time: "13:30", label: "Resume" }, { type: "check-out", time: "17:45", label: "Check Out" }]
    },
    {
        id: 9, employee: "Karthika", initial: "K", date: "2026-05-19", project: "Arrow Data-Tech Portal", checkIn: "09:10", checkOut: "18:00", workedHrs: "7h 50m", breakCount: 2, breakHrs: "0h 30m", lunchIn: "13:10", lunchOut: "13:55", lunchHrs: "0h 45m", pages: 47, status: "Complete",
        timeline: [{ type: "check-in", time: "09:10", label: "Check In" }, { type: "lunch-start", time: "13:10", label: "Lunch" }, { type: "lunch-end", time: "13:55", label: "Resume" }, { type: "check-out", time: "18:00", label: "Check Out" }]
    },
    {
        id: 10, employee: "Shakina A", initial: "S", date: "2026-05-19", project: "Client Dashboard", checkIn: "09:05", checkOut: "17:55", workedHrs: "8h 05m", breakCount: 2, breakHrs: "0h 30m", lunchIn: "13:00", lunchOut: "13:45", lunchHrs: "0h 45m", pages: 36, status: "Complete",
        timeline: [{ type: "check-in", time: "09:05", label: "Check In" }, { type: "lunch-start", time: "13:00", label: "Lunch" }, { type: "lunch-end", time: "13:45", label: "Resume" }, { type: "check-out", time: "17:55", label: "Check Out" }]
    },
    {
        id: 11, employee: "Sureka", initial: "S", date: "2026-05-19", project: "Arrow Data-Tech Portal", checkIn: "09:00", checkOut: "18:00", workedHrs: "8h 00m", breakCount: 2, breakHrs: "0h 30m", lunchIn: "13:00", lunchOut: "13:45", lunchHrs: "0h 45m", pages: 48, status: "Complete",
        timeline: [{ type: "check-in", time: "09:00", label: "Check In" }, { type: "lunch-start", time: "13:00", label: "Lunch" }, { type: "lunch-end", time: "13:45", label: "Resume" }, { type: "check-out", time: "18:00", label: "Check Out" }]
    },
    {
        id: 12, employee: "Ayeesha M", initial: "A", date: "2026-05-15", project: "WorkWise App", checkIn: "08:50", checkOut: "17:50", workedHrs: "8h 15m", breakCount: 2, breakHrs: "0h 30m", lunchIn: "13:00", lunchOut: "13:45", lunchHrs: "0h 45m", pages: 61, status: "Complete",
        timeline: [{ type: "check-in", time: "08:50", label: "Check In" }, { type: "lunch-start", time: "13:00", label: "Lunch" }, { type: "lunch-end", time: "13:45", label: "Resume" }, { type: "check-out", time: "17:50", label: "Check Out" }]
    },
    {
        id: 13, employee: "T. Mohamed Usen", initial: "T", date: "2026-05-14", project: "API Module", checkIn: "09:00", checkOut: "18:10", workedHrs: "8h 25m", breakCount: 3, breakHrs: "0h 45m", lunchIn: "13:00", lunchOut: "13:30", lunchHrs: "0h 30m", pages: 70, status: "Complete",
        timeline: [{ type: "check-in", time: "09:00", label: "Check In" }, { type: "lunch-start", time: "13:00", label: "Lunch" }, { type: "lunch-end", time: "13:30", label: "Resume" }, { type: "check-out", time: "18:10", label: "Check Out" }]
    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const AVATAR_COLORS = { S: "#6c63ff", A: "#00b894", T: "#0984e3", K: "#e17055" };
const avatarColor = (i) => AVATAR_COLORS[i] || "#a29bfe";

const STATUS_META = {
    Active: { cls: "status--active", icon: "●" },
    Complete: { cls: "status--complete", icon: "✓" },
    Absent: { cls: "status--absent", icon: "✗" },
};

const TIMELINE_META = {
    "check-in": { cls: "tl--checkin", icon: "▶" },
    "check-out": { cls: "tl--checkout", icon: "⏹" },
    "break-start": { cls: "tl--break", icon: "⏸" },
    "break-end": { cls: "tl--resume", icon: "▷" },
    "lunch-start": { cls: "tl--lunch", icon: "🍽" },
    "lunch-end": { cls: "tl--resume", icon: "▷" },
};

// ── Date helpers ──────────────────────────────────────────────────────────────
function getWeekRange(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const mon = new Date(d.setDate(diff));
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return { start: mon, end: sun };
}

function formatDateRange(start, end) {
    const fmt = (d) => d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    return `${fmt(start)} – ${fmt(end)}`;
}

function getMonthName(date) {
    return new Date(date).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function isSameDay(dateStr, ref) { return dateStr === ref; }

function isSameWeek(dateStr, refDate) {
    const { start, end } = getWeekRange(refDate);
    const d = new Date(dateStr);
    return d >= start && d <= end;
}

function isSameMonth(dateStr, refDate) {
    const d = new Date(dateStr), r = new Date(refDate);
    return d.getMonth() === r.getMonth() && d.getFullYear() === r.getFullYear();
}

function parseHrsToMin(str) {
    if (!str || str === "—") return 0;
    const m = str.match(/(\d+)h\s*(\d+)m/);
    return m ? parseInt(m[1]) * 60 + parseInt(m[2]) : 0;
}

function minsToHrsStr(mins) {
    const h = Math.floor(mins / 60), m = mins % 60;
    return `${h}h ${String(m).padStart(2, "0")}m`;
}

function addDays(dateStr, n) {
    const d = new Date(dateStr); d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
}
function addWeeks(dateStr, n) { return addDays(dateStr, n * 7); }
function addMonths(dateStr, n) {
    const d = new Date(dateStr); d.setMonth(d.getMonth() + n);
    return d.toISOString().slice(0, 10);
}

// ── Aggregation helpers ───────────────────────────────────────────────────────
function buildAggrRows(logs) {
    const map = {};
    logs.forEach(log => {
        if (!map[log.employee]) map[log.employee] = {
            employee: log.employee, initial: log.initial, project: log.project,
            totalDays: 0, totalWorkedMin: 0, totalBreakMin: 0, totalLunchMin: 0,
            totalBreakCount: 0, totalPages: 0,
        };
        const e = map[log.employee];
        e.totalDays++;
        e.totalWorkedMin += parseHrsToMin(log.workedHrs);
        e.totalBreakMin += parseHrsToMin(log.breakHrs);
        e.totalLunchMin += parseHrsToMin(log.lunchHrs);
        e.totalBreakCount += log.breakCount;
        e.totalPages += log.pages;
        e.project = log.project;
    });
    return Object.values(map).map(e => ({
        ...e,
        workedHrs: minsToHrsStr(e.totalWorkedMin),
        breakHrs: minsToHrsStr(e.totalBreakMin),
        lunchHrs: minsToHrsStr(e.totalLunchMin),
        avgWorkedHrs: minsToHrsStr(Math.round(e.totalWorkedMin / e.totalDays)),
        avgPages: Math.round(e.totalPages / e.totalDays),
    }));
}

function buildSummary(logs) {
    return {
        total: logs.length,
        totalPages: logs.reduce((a, l) => a + l.pages, 0),
        active: logs.filter(l => l.status === "Active").length,
        complete: logs.filter(l => l.status === "Complete").length,
        avgBreaks: logs.length ? (logs.reduce((a, l) => a + l.breakCount, 0) / logs.length).toFixed(1) : "0",
    };
}

function buildAggrSummary(rows) {
    const totalWorkedMin = rows.reduce((a, r) => a + r.totalWorkedMin, 0);
    return {
        total: rows.length,
        totalPages: rows.reduce((a, r) => a + r.totalPages, 0),
        totalDays: rows.reduce((a, r) => a + r.totalDays, 0),
        avgWorked: rows.length ? minsToHrsStr(Math.round(totalWorkedMin / rows.length)) : "0h 00m",
        active: 0,
        complete: rows.length,
        avgBreaks: rows.length ? (rows.reduce((a, r) => a + r.totalBreakCount, 0) / rows.length).toFixed(1) : "0",
    };
}

// ── Calendar Component ────────────────────────────────────────────────────────
function CalendarPicker({ currentDate, viewMode, onSelect, onClose }) {
    const [calDate, setCalDate] = useState(() => new Date(currentDate));
    const today = new Date("2026-05-21");

    const year = calDate.getFullYear();
    const month = calDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMon = new Date(year, month + 1, 0).getDate();
    // Mon-start offset
    const offset = (firstDay === 0 ? 6 : firstDay - 1);

    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMon; d++) cells.push(d);

    const monthLabel = calDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

    const selDate = new Date(currentDate);
    const weekRange = viewMode === "weekly" ? getWeekRange(currentDate) : null;

    const handleDay = (day) => {
        if (!day) return;
        const chosen = new Date(year, month, day);
        onSelect(chosen.toISOString().slice(0, 10));
        onClose();
    };

    const isSelected = (day) => {
        if (!day) return false;
        const d = new Date(year, month, day);
        if (viewMode === "daily") {
            return d.toDateString() === selDate.toDateString();
        }
        if (viewMode === "weekly" && weekRange) {
            return d >= weekRange.start && d <= weekRange.end;
        }
        if (viewMode === "monthly") {
            return d.getMonth() === selDate.getMonth() && d.getFullYear() === selDate.getFullYear();
        }
        return false;
    };

    const isWeekStart = (day) => {
        if (!day || viewMode !== "weekly") return false;
        const d = new Date(year, month, day);
        return d.toDateString() === weekRange?.start?.toDateString();
    };

    const isWeekEnd = (day) => {
        if (!day || viewMode !== "weekly") return false;
        const d = new Date(year, month, day);
        return d.toDateString() === weekRange?.end?.toDateString();
    };

    const isToday = (day) => {
        if (!day) return false;
        return new Date(year, month, day).toDateString() === today.toDateString();
    };

    const getDayClass = (day) => {
        if (!day) return "cal-day cal-day--empty";
        const sel = isSelected(day);
        let cls = "cal-day";
        if (isToday(day)) cls += " cal-day--today";
        if (sel) {
            if (viewMode === "weekly") {
                cls += " cal-day--in-week";
                if (isWeekStart(day)) cls += " cal-day--week-start cal-day--selected";
                else if (isWeekEnd(day)) cls += " cal-day--week-end cal-day--selected";
            } else if (viewMode === "monthly") {
                cls += " cal-day--selected";
            } else {
                cls += " cal-day--selected";
            }
        }
        return cls;
    };

    return (
        <div className="tl-calendar-popup" onClick={e => e.stopPropagation()}>
            <div className="cal-header">
                <span className="cal-month-label">{monthLabel}</span>
                <div className="cal-nav">
                    <button className="cal-nav-btn" onClick={() => setCalDate(new Date(year, month - 1, 1))}>‹</button>
                    <button className="cal-nav-btn" onClick={() => setCalDate(new Date(year, month + 1, 1))}>›</button>
                </div>
            </div>
            <div className="cal-grid-head">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (
                    <div key={d} className="cal-dow">{d}</div>
                ))}
            </div>
            <div className="cal-grid">
                {cells.map((day, i) => (
                    <div key={i} className={getDayClass(day)} onClick={() => handleDay(day)}>
                        {day || ""}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function TimeLog() {
    const TODAY = "2026-05-21";

    const [viewMode, setViewMode] = useState("daily");
    const [periodDate, setPeriodDate] = useState(TODAY);
    const [filterEmp, setFilterEmp] = useState("All");
    const [filterProj, setFilterProj] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [expandedId, setExpandedId] = useState(null);
    const [search, setSearch] = useState("");
    const [showCal, setShowCal] = useState(false);
    const calRef = useRef(null);

    // Close calendar on outside click
    useEffect(() => {
        const handler = (e) => {
            if (calRef.current && !calRef.current.contains(e.target)) setShowCal(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Period navigation
    const navigatePeriod = (dir) => {
        if (viewMode === "daily") setPeriodDate(p => addDays(p, dir));
        else if (viewMode === "weekly") setPeriodDate(p => addWeeks(p, dir));
        else setPeriodDate(p => addMonths(p, dir));
        setExpandedId(null);
    };

    const resetPeriod = () => { setPeriodDate(TODAY); setExpandedId(null); };

    const getPeriodLabel = () => {
        if (viewMode === "daily")
            return new Date(periodDate).toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
        if (viewMode === "weekly") {
            const { start, end } = getWeekRange(periodDate);
            return `Week: ${formatDateRange(start, end)}`;
        }
        return getMonthName(periodDate);
    };

    const isCurrentPeriod = () => {
        if (viewMode === "daily") return periodDate === TODAY;
        if (viewMode === "weekly") { const { start, end } = getWeekRange(TODAY); const d = new Date(periodDate); return d >= start && d <= end; }
        return isSameMonth(periodDate, TODAY);
    };

    // Filter data
    const periodLogs = MOCK_LOGS.filter(l => {
        if (viewMode === "daily") return isSameDay(l.date, periodDate);
        if (viewMode === "weekly") return isSameWeek(l.date, periodDate);
        return isSameMonth(l.date, periodDate);
    });

    const filteredDaily = periodLogs.filter(l => {
        if (filterEmp !== "All" && l.employee !== filterEmp) return false;
        if (filterProj !== "All" && l.project !== filterProj) return false;
        if (filterStatus !== "All" && l.status !== filterStatus) return false;
        if (search && !l.employee.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const filteredAggr = periodLogs.filter(l => {
        if (filterEmp !== "All" && l.employee !== filterEmp) return false;
        if (filterProj !== "All" && l.project !== filterProj) return false;
        if (search && !l.employee.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const aggrRows = buildAggrRows(filteredAggr);
    const summary = viewMode === "daily" ? buildSummary(filteredDaily) : buildAggrSummary(aggrRows);

    const toggleExpand = (id) => setExpandedId(prev => (prev === id ? null : id));

    const clearFilters = () => { setFilterEmp("All"); setFilterProj("All"); setFilterStatus("All"); setSearch(""); };
    const hasFilters = filterEmp !== "All" || filterProj !== "All" || filterStatus !== "All" || search;

    return (
        <div className="tl-wrapper">

            {/* ── Page Header ── */}
            <div className="tl-page-header">
                <div className="tl-page-title">
                    <span className="tl-page-icon">⏱</span>
                    <div>
                        <h1>Time Log</h1>
                        <p className="tl-page-sub">Monitor employee activity, breaks, lunch &amp; output</p>
                    </div>
                </div>
                <div className="tl-header-date">
                    {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                </div>
            </div>

            {/* ── View Tabs + Period Navigator ── */}
            <div className="tl-view-tabs">
                <div className="tl-tabs-bar">
                    {VIEW_MODES.map(m => (
                        <button
                            key={m.key}
                            className={`tl-tab-btn ${viewMode === m.key ? "tl-tab-btn--active" : ""}`}
                            onClick={() => { setViewMode(m.key); setExpandedId(null); }}
                        >
                            <span className="tl-tab-icon">{m.icon}</span>
                            <span className="tl-tab-label">{m.label}</span>
                        </button>
                    ))}
                </div>

                <div className="tl-period-nav">
                    <button className="tl-nav-btn" onClick={() => navigatePeriod(-1)} title="Previous">‹</button>
                    <span className="tl-period-label">{getPeriodLabel()}</span>
                    <button className="tl-nav-btn" onClick={() => navigatePeriod(1)} title="Next">›</button>

                    {/* Calendar Picker */}
                    <div className="tl-calendar-popup-wrap" ref={calRef}>
                        <button
                            className="tl-calendar-btn"
                            onClick={() => setShowCal(s => !s)}
                            title="Pick date"
                        >📅</button>
                        {showCal && (
                            <CalendarPicker
                                currentDate={periodDate}
                                viewMode={viewMode}
                                onSelect={(d) => { setPeriodDate(d); setExpandedId(null); }}
                                onClose={() => setShowCal(false)}
                            />
                        )}
                    </div>

                    {!isCurrentPeriod() && (
                        <button className="tl-today-btn" onClick={resetPeriod}>Today</button>
                    )}
                </div>
            </div>

            {/* ── Summary Cards ── */}
            <div className="tl-summary-row">
                {viewMode === "daily" ? (
                    <>
                        <SummaryCard icon="👥" label="Total Records" value={summary.total} accent="blue" />
                        <SummaryCard icon="🟢" label="Currently Active" value={summary.active} accent="green" />
                        <SummaryCard icon="✅" label="Completed Today" value={summary.complete} accent="purple" />
                        <SummaryCard icon="📄" label="Total Pages" value={summary.totalPages} accent="orange" />
                        <SummaryCard icon="☕" label="Avg. Breaks/User" value={summary.avgBreaks} accent="cyan" />
                    </>
                ) : viewMode === "weekly" ? (
                    <>
                        <SummaryCard icon="👥" label="Employees" value={summary.total} accent="blue" />
                        <SummaryCard icon="📅" label="Total Days Logged" value={summary.totalDays} accent="green" />
                        <SummaryCard icon="⏱" label="Avg. Hrs/Employee" value={summary.avgWorked} accent="purple" />
                        <SummaryCard icon="📄" label="Total Pages" value={summary.totalPages} accent="orange" />
                        <SummaryCard icon="☕" label="Avg. Breaks/User" value={summary.avgBreaks} accent="cyan" />
                    </>
                ) : (
                    <>
                        <SummaryCard icon="👥" label="Employees" value={summary.total} accent="blue" />
                        <SummaryCard icon="📅" label="Days Logged" value={summary.totalDays} accent="green" />
                        <SummaryCard icon="⏱" label="Avg. Hrs/Employee" value={summary.avgWorked} accent="purple" />
                        <SummaryCard icon="📄" label="Total Pages" value={summary.totalPages} accent="orange" />
                        <SummaryCard icon="☕" label="Avg. Breaks/User" value={summary.avgBreaks} accent="cyan" />
                    </>
                )}
            </div>

            {/* ── Filters ── */}
            <div className="tl-filters">
                <div className="tl-search-wrap">
                    <span className="tl-search-icon">🔍</span>
                    <input
                        className="tl-search"
                        placeholder="Search employee…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="tl-filter-group">
                    <label className="tl-filter-label">Employee</label>
                    <select className="tl-select" value={filterEmp} onChange={e => setFilterEmp(e.target.value)}>
                        {EMPLOYEES.map(e => <option key={e}>{e}</option>)}
                    </select>
                </div>

                <div className="tl-filter-group">
                    <label className="tl-filter-label">Project</label>
                    <select className="tl-select" value={filterProj} onChange={e => setFilterProj(e.target.value)}>
                        {PROJECTS.map(p => <option key={p}>{p}</option>)}
                    </select>
                </div>

                {viewMode === "daily" && (
                    <div className="tl-filter-group">
                        <label className="tl-filter-label">Status</label>
                        <select className="tl-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            {["All", "Active", "Complete", "Absent"].map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                )}

                {hasFilters && (
                    <button className="tl-clear-btn" onClick={clearFilters}>✕ Clear</button>
                )}
            </div>

            {/* ── Tables ── */}
            {viewMode === "daily" && (
                <DailyTable
                    filtered={filteredDaily}
                    total={MOCK_LOGS.length}
                    summary={summary}
                    expandedId={expandedId}
                    toggleExpand={toggleExpand}
                />
            )}

            {viewMode === "weekly" && (
                <AggrTable
                    mode="weekly"
                    rows={aggrRows}
                    total={MOCK_LOGS.length}
                    summary={summary}
                    expandedId={expandedId}
                    toggleExpand={toggleExpand}
                    periodLogs={filteredAggr}
                />
            )}

            {viewMode === "monthly" && (
                <AggrTable
                    mode="monthly"
                    rows={aggrRows}
                    total={MOCK_LOGS.length}
                    summary={summary}
                    expandedId={expandedId}
                    toggleExpand={toggleExpand}
                    periodLogs={filteredAggr}
                />
            )}
        </div>
    );
}

// ── Daily Table ───────────────────────────────────────────────────────────────
function DailyTable({ filtered, total, summary, expandedId, toggleExpand }) {
    return (
        <div className="tl-table-card">
            <div className="tl-table-container">
                <table className="tl-table">
                    <thead>
                        <tr>
                            <th className="th-identity" colSpan={3}><span className="th-group-label">Identity</span></th>
                            <th className="th-shift" colSpan={3}><span className="th-group-label">Shift</span></th>
                            <th className="th-break" colSpan={2}><span className="th-group-label">Break</span></th>
                            <th className="th-lunch" colSpan={3}><span className="th-group-label">Lunch</span></th>
                            <th className="th-output" colSpan={3}><span className="th-group-label">Output</span></th>
                        </tr>
                        <tr className="tr-subhead">
                            <th>Employee</th><th>Date</th><th>Project</th>
                            <th>Check In</th><th>Check Out</th><th>Worked Hrs</th>
                            <th>Breaks</th><th>Break Hrs</th>
                            <th>Lunch In</th><th>Lunch Out</th><th>Lunch Hrs</th>
                            <th>Pages</th><th>Status</th><th>Timeline</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={14} className="tl-empty">
                                    <div className="tl-empty-inner">
                                        <span className="tl-empty-icon">📭</span>
                                        <span>No records match the current filters.</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filtered.map(log => (
                            <React.Fragment key={log.id}>
                                <tr className={`tl-row ${expandedId === log.id ? "tl-row--expanded" : ""}`}>
                                    <td className="td-employee col-left">
                                        <div className="emp-cell">
                                            <div className="emp-avatar-sm" style={{ background: avatarColor(log.initial) }}>{log.initial}</div>
                                            <span className="emp-name">{log.employee}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="date-badge">
                                            {new Date(log.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                                        </span>
                                    </td>
                                    <td><span className="project-tag" title={log.project}>{log.project}</span></td>
                                    <td className="td-time td-checkin">{log.checkIn}</td>
                                    <td className="td-time td-checkout">{log.checkOut}</td>
                                    <td><span className="hrs-pill hrs-pill--worked">{log.workedHrs}</span></td>
                                    <td><span className="break-count">{log.breakCount}×</span></td>
                                    <td><span className="hrs-pill hrs-pill--break">{log.breakHrs}</span></td>
                                    <td className="td-time">{log.lunchIn}</td>
                                    <td className="td-time">{log.lunchOut}</td>
                                    <td><span className="hrs-pill hrs-pill--lunch">{log.lunchHrs}</span></td>
                                    <td><span className="pages-val">{log.pages}</span><span className="pages-label">pg</span></td>
                                    <td>
                                        <span className={`status-badge ${STATUS_META[log.status]?.cls}`}>
                                            {STATUS_META[log.status]?.icon} {log.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className={`expand-btn ${expandedId === log.id ? "expand-btn--open" : ""}`}
                                            onClick={() => toggleExpand(log.id)}
                                            title="View timeline"
                                        >
                                            {expandedId === log.id ? "▲" : "▼"}
                                        </button>
                                    </td>
                                </tr>
                                {expandedId === log.id && (
                                    <tr className="tl-timeline-row">
                                        <td colSpan={14}>
                                            <div className="tl-timeline-wrap">
                                                <div className="tl-timeline-header">
                                                    <span className="tl-timeline-title">
                                                        Activity Timeline — {log.employee} · {new Date(log.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
                                                    </span>
                                                </div>
                                                <div className="tl-timeline">
                                                    {log.timeline.map((event, idx) => (
                                                        <div key={idx} className={`tl-event ${TIMELINE_META[event.type]?.cls}`}>
                                                            <div className="tl-event-dot"><span>{TIMELINE_META[event.type]?.icon}</span></div>
                                                            {idx < log.timeline.length - 1 && <div className="tl-event-line" />}
                                                            <div className="tl-event-info">
                                                                <span className="tl-event-time">{event.time}</span>
                                                                <span className="tl-event-label">{event.label}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            <TableFooter filtered={filtered.length} total={total} summary={summary} mode="daily" />
        </div>
    );
}

// ── Aggregated Table (Weekly + Monthly) ───────────────────────────────────────
function AggrTable({ mode, rows, total, summary, expandedId, toggleExpand, periodLogs }) {
    const modeLabel = mode === "weekly" ? "Work Summary" : "Monthly Work Summary";
    const emptyMsg = mode === "weekly" ? "No records for this week." : "No records for this month.";

    return (
        <div className="tl-table-card">
            <div className="tl-table-container">
                <table className="tl-table tl-table--aggr">
                    <thead>
                        <tr>
                            <th className="th-identity" colSpan={2}><span className="th-group-label">Identity</span></th>
                            <th className="th-shift" colSpan={3}><span className="th-group-label">{modeLabel}</span></th>
                            <th className="th-break" colSpan={2}><span className="th-group-label">Break</span></th>
                            <th className="th-lunch" colSpan={1}><span className="th-group-label">Lunch</span></th>
                            <th className="th-output" colSpan={3}><span className="th-group-label">Output</span></th>
                        </tr>
                        <tr className="tr-subhead tr-subhead--aggr">
                            <th>Employee</th>
                            <th>Project</th>
                            <th>Days Logged</th>
                            <th>Total Hours</th>
                            <th>Avg Hrs/Day</th>
                            <th>Total Breaks</th>
                            <th>Break Hrs</th>
                            <th>Lunch Hrs</th>
                            <th>Total Pages</th>
                            <th>Avg Pages/Day</th>
                            <th>Day Logs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="tl-empty">
                                    <div className="tl-empty-inner">
                                        <span className="tl-empty-icon">📭</span>
                                        <span>{emptyMsg}</span>
                                    </div>
                                </td>
                            </tr>
                        ) : rows.map((row, idx) => {
                            const empLogs = periodLogs.filter(l => l.employee === row.employee);
                            return (
                                <React.Fragment key={idx}>
                                    <tr className={`tl-row ${expandedId === idx ? "tl-row--expanded" : ""}`}>
                                        <td className="td-employee col-left">
                                            <div className="emp-cell">
                                                <div className="emp-avatar-sm" style={{ background: avatarColor(row.initial) }}>{row.initial}</div>
                                                <span className="emp-name">{row.employee}</span>
                                            </div>
                                        </td>
                                        <td><span className="project-tag" title={row.project}>{row.project}</span></td>
                                        <td><span className="days-badge">{row.totalDays}d</span></td>
                                        <td><span className="hrs-pill hrs-pill--worked">{row.workedHrs}</span></td>
                                        <td><span className="hrs-pill hrs-pill--avg">{row.avgWorkedHrs}</span></td>
                                        <td><span className="break-count">{row.totalBreakCount}×</span></td>
                                        <td><span className="hrs-pill hrs-pill--break">{row.breakHrs}</span></td>
                                        <td><span className="hrs-pill hrs-pill--lunch">{row.lunchHrs}</span></td>
                                        <td><span className="pages-val">{row.totalPages}</span><span className="pages-label">pg</span></td>
                                        <td><span className="pages-val">{row.avgPages}</span><span className="pages-label">pg/d</span></td>
                                        <td>
                                            <button
                                                className={`expand-btn ${expandedId === idx ? "expand-btn--open" : ""}`}
                                                onClick={() => toggleExpand(idx)}
                                                title="View daily breakdown"
                                            >
                                                {expandedId === idx ? "▲" : "▼"}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedId === idx && (
                                        <tr className="tl-timeline-row">
                                            <td colSpan={11}>
                                                <DailyBreakdown logs={empLogs} employee={row.employee} />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <TableFooter filtered={rows.length} total={total} summary={summary} mode={mode} />
        </div>
    );
}

// ── Daily Breakdown ───────────────────────────────────────────────────────────
function DailyBreakdown({ logs, employee }) {
    return (
        <div className="tl-timeline-wrap tl-breakdown-wrap">
            <div className="tl-timeline-header">
                <span className="tl-timeline-title">Daily Log Breakdown — {employee}</span>
            </div>
            <div className="tl-breakdown-grid">
                {logs.map(log => (
                    <div key={log.id} className="tl-breakdown-card">
                        <div className="tl-bd-header">
                            <span className="tl-bd-date">
                                {new Date(log.date).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" })}
                            </span>
                            <span className={`status-badge ${STATUS_META[log.status]?.cls}`}>
                                {STATUS_META[log.status]?.icon} {log.status}
                            </span>
                        </div>
                        <div className="tl-bd-stats">
                            <div className="tl-bd-stat">
                                <span className="tl-bd-stat-label">Project</span>
                                <span className="project-tag" title={log.project}>{log.project}</span>
                            </div>
                            <div className="tl-bd-stat">
                                <span className="tl-bd-stat-label">Worked</span>
                                <span className="hrs-pill hrs-pill--worked">{log.workedHrs}</span>
                            </div>
                            <div className="tl-bd-stat">
                                <span className="tl-bd-stat-label">Check In</span>
                                <span className="tl-bd-stat-val tl-bd-stat-val--in">{log.checkIn}</span>
                            </div>
                            <div className="tl-bd-stat">
                                <span className="tl-bd-stat-label">Check Out</span>
                                <span className="tl-bd-stat-val tl-bd-stat-val--out">{log.checkOut}</span>
                            </div>
                            <div className="tl-bd-stat">
                                <span className="tl-bd-stat-label">Breaks</span>
                                <span className="break-count">{log.breakCount}×</span>
                            </div>
                            <div className="tl-bd-stat">
                                <span className="tl-bd-stat-label">Pages</span>
                                <span className="pages-val">{log.pages}<span className="pages-label">pg</span></span>
                            </div>
                        </div>
                        <div className="tl-bd-timeline">
                            {log.timeline.map((event, i) => (
                                <div key={i} className={`tl-event tl-event--mini ${TIMELINE_META[event.type]?.cls}`}>
                                    <div className="tl-event-dot tl-event-dot--mini">
                                        <span>{TIMELINE_META[event.type]?.icon}</span>
                                    </div>
                                    {i < log.timeline.length - 1 && <div className="tl-event-line tl-event-line--mini" />}
                                    <div className="tl-event-info">
                                        <span className="tl-event-time">{event.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Table Footer ──────────────────────────────────────────────────────────────
function TableFooter({ filtered, total, summary, mode }) {
    return (
        <div className="tl-table-footer">
            <span className="tl-record-count">
                Showing <strong>{filtered}</strong> {mode === "daily" ? "records" : "employees"}
                {mode === "daily" && <> of <strong>{total}</strong> total</>}
            </span>
            <div className="tl-footer-totals">
                <span className="footer-stat">
                    <span className="footer-stat-label">Total Pages:</span>
                    <span className="footer-stat-val">{summary.totalPages}</span>
                </span>
                <span className="footer-divider">|</span>
                {mode === "daily" ? (
                    <span className="footer-stat">
                        <span className="footer-stat-label">Active Now:</span>
                        <span className="footer-stat-val footer-stat-val--active">{summary.active}</span>
                    </span>
                ) : (
                    <span className="footer-stat">
                        <span className="footer-stat-label">Days Logged:</span>
                        <span className="footer-stat-val footer-stat-val--active">{summary.totalDays}</span>
                    </span>
                )}
            </div>
        </div>
    );
}

// ── Summary Card ──────────────────────────────────────────────────────────────
function SummaryCard({ icon, label, value, accent }) {
    return (
        <div className={`tl-sum-card tl-sum-card--${accent}`}>
            <div className="tl-sum-icon">{icon}</div>
            <div className="tl-sum-body">
                <span className="tl-sum-value">{value}</span>
                <span className="tl-sum-label">{label}</span>
            </div>
            <div className="tl-sum-glow" />
        </div>
    );
}