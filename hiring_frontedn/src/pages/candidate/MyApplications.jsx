import { useState, useEffect } from "react";
import { applicationService } from "../../services/api";
import "./MyApplications.css";

const STATUS_META = {
  APPLIED:    { label: "Applied",    className: "status--applied" },
  REVIEWING:  { label: "Reviewing",  className: "status--reviewing" },
  SHORTLISTED:{ label: "Shortlisted",className: "status--shortlisted" },
  INTERVIEWED:{ label: "Interviewed",className: "status--interviewed" },
  OFFERED:    { label: "Offered",    className: "status--offered" },
  REJECTED:   { label: "Rejected",   className: "status--rejected" },
};

const getStatusMeta = (status = "") => {
  const key = status.toUpperCase();
  return STATUS_META[key] || { label: status || "Unknown", className: "status--default" };
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user?.id) return;

    const fetchApplications = async () => {
      try {
        const res = await applicationService.getApplicationsByUser(user.id);
        setApplications(res.data);
      } catch {
        setError("Failed to load your applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // ── Render States ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="myapp-state">
        <div className="myapp-spinner" />
        <p>Loading your applications…</p>
      </div>
    );
  }

  if (error) {
    return <div className="myapp-state myapp-state--error">{error}</div>;
  }

  if (applications.length === 0) {
    return (
      <div className="myapp-state">
        <div className="myapp-empty-icon">📋</div>
        <p className="myapp-empty-title">No applications yet</p>
        <p className="myapp-empty-sub">
          Browse available jobs and hit <strong>Apply Now</strong> to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="myapp-page">

      <div className="myapp-header">
        <h1 className="myapp-title">My Applications</h1>
        <span className="myapp-count">
          {applications.length} application{applications.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="myapp-list">
        {applications.map((app) => {
          const meta = getStatusMeta(app.status);
          return (
            <div className="myapp-card" key={app.id}>

              <div className="myapp-card-left">
                <div className="myapp-job-title">{app.jobTitle || "Job Title N/A"}</div>
                <div className="myapp-company">{app.companyName || "—"}</div>

                <div className="myapp-meta">
                  {app.jobLocation && (
                    <span className="myapp-meta-item">📍 {app.jobLocation}</span>
                  )}
                  {app.jobType && (
                    <span className="myapp-meta-item">💼 {app.jobType}</span>
                  )}
                </div>
              </div>

              <div className="myapp-card-right">
                <span className={`myapp-status-badge ${meta.className}`}>
                  {meta.label}
                </span>

                <div className="myapp-dates">
                  <div className="myapp-date-row">
                    <span className="myapp-date-label">Applied</span>
                    <span className="myapp-date-val">{formatDate(app.appliedAt || app.createdAt)}</span>
                  </div>
                  {app.interviewDate && (
                    <div className="myapp-date-row">
                      <span className="myapp-date-label">Interview</span>
                      <span className="myapp-date-val">{formatDate(app.interviewDate)}</span>
                    </div>
                  )}
                  {app.updatedAt && (
                    <div className="myapp-date-row">
                      <span className="myapp-date-label">Last updated</span>
                      <span className="myapp-date-val">{formatDate(app.updatedAt)}</span>
                    </div>
                  )}
                </div>

                {app.remarks && (
                  <p className="myapp-remarks">💬 {app.remarks}</p>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default MyApplications;