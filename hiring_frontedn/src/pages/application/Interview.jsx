import { useState, useEffect } from "react";
import { applicationService } from "../../services/api";
import "./Interview.css";

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const Interview = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await applicationService.getAllApplications();
        const withInterviews = res.data.filter((app) => app.interviewDate);
        setInterviews(withInterviews);
      } catch {
        setError("Failed to load interviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <div className="interview-state">
        <div className="interview-spinner" />
        <p>Loading interviews…</p>
      </div>
    );
  }

  if (error) {
    return <div className="interview-state interview-state--error">{error}</div>;
  }

  if (interviews.length === 0) {
    return (
      <div className="interview-state">
        <div className="interview-empty-icon">📅</div>
        <p className="interview-empty-title">No interviews scheduled</p>
        <p className="interview-empty-sub">
          Interviews will appear here once scheduled.
        </p>
      </div>
    );
  }

  return (
    <div className="interview-page">
      <div className="interview-header">
        <h1 className="interview-title">Scheduled Interviews</h1>
        <span className="interview-count">
          {interviews.length} interview{interviews.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="interview-list">
        {interviews.map((app) => (
          <div className="interview-card" key={app.id}>
            <div className="interview-card-left">
              <div className="interview-applicant-name">{app.applicantName || "N/A"}</div>
              <div className="interview-applicant-email">{app.applicantEmail || "—"}</div>
              <div className="interview-job-title">{app.jobTitle || "—"}</div>
            </div>

            <div className="interview-card-right">
              <div className="interview-date">
                📅 {formatDate(app.interviewDate)}
              </div>
              {app.interviewMode && (
                <div className="interview-mode">Mode: {app.interviewMode}</div>
              )}
              {app.remarks && (
                <div className="interview-remarks">💬 {app.remarks}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Interview;