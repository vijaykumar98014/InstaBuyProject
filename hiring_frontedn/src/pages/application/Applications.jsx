import { useState, useEffect } from "react";
import { applicationService } from "../../services/api";
import "./Applications.css";

const APPLICATION_STATUSES = [
  "APPLIED",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEWED",
  "OFFERED",
  "REJECTED",
];

const STATUS_META = {
  APPLIED:     { label: "Applied",     className: "badge--applied" },
  REVIEWING:   { label: "Reviewing",   className: "badge--reviewing" },
  SHORTLISTED: { label: "Shortlisted", className: "badge--shortlisted" },
  INTERVIEWED: { label: "Interviewed", className: "badge--interviewed" },
  OFFERED:     { label: "Offered",     className: "badge--offered" },
  REJECTED:    { label: "Rejected",    className: "badge--rejected" },
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  // per-row UI state
  const [expandedId, setExpandedId]     = useState(null);
  const [saving, setSaving]             = useState(null);
  const [rowFeedback, setRowFeedback]   = useState({});

  // filter state
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch]             = useState("");

  // interview modal state
  const [interviewModal, setInterviewModal] = useState(null); // { appId }
  const [interviewForm, setInterviewForm]   = useState({ interviewDate: "", interviewMode: "Online", remarks: "" });
  const [schedulingSaving, setSchedulingSaving] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await applicationService.getAllApplications();
        setApplications(res.data);
        setFiltered(res.data);
      } catch {
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // ── Filter + Search ────────────────────────────────────────────────────────
  useEffect(() => {
    let result = [...applications];
    if (filterStatus !== "ALL") {
      result = result.filter((a) => (a.status || "").toUpperCase() === filterStatus);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          (a.applicantName || "").toLowerCase().includes(q) ||
          (a.applicantEmail || "").toLowerCase().includes(q) ||
          (a.jobTitle || "").toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [filterStatus, search, applications]);

  // ── Status Update ──────────────────────────────────────────────────────────
  const handleStatusChange = async (appId, newStatus) => {
    setSaving(appId);
    try {
      await applicationService.updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
      setRowFeedback((prev) => ({
        ...prev,
        [appId]: { type: "success", msg: `Status updated to ${newStatus}` },
      }));
      setTimeout(() => setRowFeedback((prev) => ({ ...prev, [appId]: null })), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || "Status update failed.";
      setRowFeedback((prev) => ({ ...prev, [appId]: { type: "error", msg } }));
    } finally {
      setSaving(null);
    }
  };

  // ── Schedule Interview ─────────────────────────────────────────────────────
  const openInterviewModal = (appId) => {
    setInterviewModal({ appId });
    setInterviewForm({ interviewDate: "", interviewMode: "Online", remarks: "" });
  };

  const closeInterviewModal = () => {
    setInterviewModal(null);
  };

  const handleInterviewFormChange = (e) => {
    setInterviewForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleScheduleInterview = async () => {
    if (!interviewForm.interviewDate) return;
    setSchedulingSaving(true);
    try {
      await applicationService.scheduleInterview(interviewModal.appId, interviewForm);
      setApplications((prev) =>
        prev.map((a) =>
          a.id === interviewModal.appId
            ? { ...a, interviewDate: interviewForm.interviewDate, status: "INTERVIEWED" }
            : a
        )
      );
      setRowFeedback((prev) => ({
        ...prev,
        [interviewModal.appId]: { type: "success", msg: "Interview scheduled!" },
      }));
      setTimeout(
        () => setRowFeedback((prev) => ({ ...prev, [interviewModal.appId]: null })),
        3000
      );
      closeInterviewModal();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to schedule interview.";
      setRowFeedback((prev) => ({
        ...prev,
        [interviewModal.appId]: { type: "error", msg },
      }));
      closeInterviewModal();
    } finally {
      setSchedulingSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="ma-state">
        <div className="ma-spinner" />
        <p>Loading applications…</p>
      </div>
    );
  }

  if (error) {
    return <div className="ma-state ma-state--error">{error}</div>;
  }

  return (
    <div className="ma-page">

      {/* ── Page Header ── */}
      <div className="ma-header">
        <div>
          <h1 className="ma-title">Manage Applications</h1>
          <p className="ma-subtitle">Review candidates, update status, and schedule interviews.</p>
        </div>
        <span className="ma-total-badge">{filtered.length} / {applications.length} shown</span>
      </div>

      {/* ── Toolbar ── */}
      <div className="ma-toolbar">
        <input
          className="ma-search"
          type="text"
          placeholder="Search by name, email or job…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="ma-filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* ── Empty filtered state ── */}
      {filtered.length === 0 && (
        <div className="ma-state">
          <p className="ma-empty">No applications match your filters.</p>
        </div>
      )}

      {/* ── Application Cards ── */}
      <div className="ma-list">
        {filtered.map((app) => {
          const statusKey = (app.status || "APPLIED").toUpperCase();
          const meta = STATUS_META[statusKey] || { label: app.status, className: "" };
          const isExpanded = expandedId === app.id;
          const isSaving = saving === app.id;
          const fb = rowFeedback[app.id];

          return (
            <div className="ma-card" key={app.id}>

              {/* ── Card Top ── */}
              <div className="ma-card-top" onClick={() => setExpandedId(isExpanded ? null : app.id)}>
                <div className="ma-card-info">
                  <div className="ma-applicant-name">{app.applicantName || "N/A"}</div>
                  <div className="ma-applicant-email">{app.applicantEmail || "—"}</div>
                  <div className="ma-job-label">{app.jobTitle || "—"}</div>
                </div>

                <div className="ma-card-meta">
                  <span className={`ma-badge ${meta.className}`}>{meta.label}</span>
                  <span className="ma-applied-date">{formatDate(app.appliedAt || app.createdAt)}</span>
                  <span className="ma-expand-icon">{isExpanded ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* ── Expanded Panel ── */}
              {isExpanded && (
                <div className="ma-card-expanded">

                  <div className="ma-detail-grid">
                    {app.jobLocation && (
                      <div className="ma-detail-item">
                        <span className="ma-detail-label">Location</span>
                        <span className="ma-detail-val">📍 {app.jobLocation}</span>
                      </div>
                    )}
                    {app.jobType && (
                      <div className="ma-detail-item">
                        <span className="ma-detail-label">Job Type</span>
                        <span className="ma-detail-val">💼 {app.jobType}</span>
                      </div>
                    )}
                    {app.interviewDate && (
                      <div className="ma-detail-item">
                        <span className="ma-detail-label">Interview</span>
                        <span className="ma-detail-val">📅 {formatDate(app.interviewDate)}</span>
                      </div>
                    )}
                    {app.remarks && (
                      <div className="ma-detail-item ma-detail-item--full">
                        <span className="ma-detail-label">Remarks</span>
                        <span className="ma-detail-val">{app.remarks}</span>
                      </div>
                    )}
                  </div>

                  {/* ── Actions ── */}
                  <div className="ma-actions">
                    {fb && (
                      <span className={`ma-row-feedback ma-row-feedback--${fb.type}`}>
                        {fb.msg}
                      </span>
                    )}

                    <div className="ma-action-controls">
                      <select
                        className="ma-status-select"
                        value={statusKey}
                        disabled={isSaving}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      >
                        {APPLICATION_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {isSaving && <span className="ma-saving-spinner" />}

                      <button
                        className="ma-interview-btn"
                        onClick={() => openInterviewModal(app.id)}
                        disabled={isSaving}
                      >
                        📅 Schedule Interview
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* ── Interview Modal ── */}
      {interviewModal && (
        <div className="ma-modal-overlay" onClick={closeInterviewModal}>
          <div className="ma-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ma-modal-header">
              <h2 className="ma-modal-title">Schedule Interview</h2>
              <button className="ma-modal-close" onClick={closeInterviewModal}>✕</button>
            </div>

            <div className="ma-modal-body">
              <div className="form-group">
                <label className="form-label">Interview Date & Time <span className="required">*</span></label>
                <input
                  type="datetime-local"
                  name="interviewDate"
                  className="form-input"
                  value={interviewForm.interviewDate}
                  onChange={handleInterviewFormChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Interview Mode</label>
                <select
                  name="interviewMode"
                  className="form-input"
                  value={interviewForm.interviewMode}
                  onChange={handleInterviewFormChange}
                >
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Phone">Phone</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Remarks / Notes</label>
                <textarea
                  name="remarks"
                  className="form-input form-textarea"
                  rows={3}
                  placeholder="Any instructions or notes for the candidate…"
                  value={interviewForm.remarks}
                  onChange={handleInterviewFormChange}
                />
              </div>
            </div>

            <div className="ma-modal-footer">
              <button className="ma-btn ma-btn--cancel" onClick={closeInterviewModal}>
                Cancel
              </button>
              <button
                className="ma-btn ma-btn--confirm"
                onClick={handleScheduleInterview}
                disabled={schedulingSaving || !interviewForm.interviewDate}
              >
                {schedulingSaving ? <span className="ma-saving-spinner" /> : "Confirm Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageApplications;