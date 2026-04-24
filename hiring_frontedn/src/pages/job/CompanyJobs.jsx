import { useState, useEffect } from "react";
import { jobService } from "../../services/api";
import "./CompanyJobs.css";

const STATUS_META = {
  PENDING: { label: "Pending Approval", className: "status--pending" },
  APPROVED: { label: "Approved", className: "status--approved" },
  REJECTED: { label: "Rejected", className: "status--rejected" },
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

const CompanyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approving, setApproving] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobService.getAllJobs();
        // Filter jobs created by the company or all for admin
        const filtered = user.role === "ADMIN" ? res.data : res.data.filter((j) => j.createdBy === user.id);
        setJobs(filtered);
      } catch {
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [user?.id, user?.role]);

  const handleApprove = async (jobId) => {
    setApproving(jobId);
    try {
      await jobService.approveJob(jobId);
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "APPROVED" } : job
        )
      );
    } catch (err) {
      setError("Failed to approve job.");
    } finally {
      setApproving(null);
    }
  };

  if (loading) {
    return (
      <div className="cj-state">
        <div className="cj-spinner" />
        <p>Loading jobs…</p>
      </div>
    );
  }

  if (error) {
    return <div className="cj-state cj-state--error">{error}</div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="cj-state">
        <div className="cj-empty-icon">💼</div>
        <p className="cj-empty-title">No jobs found</p>
        <p className="cj-empty-sub">
          Jobs will appear here once posted.
        </p>
      </div>
    );
  }

  return (
    <div className="cj-page">
      <div className="cj-header">
        <h1 className="cj-title">Company Jobs</h1>
        <span className="cj-count">
          {jobs.length} job{jobs.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="cj-list">
        {jobs.map((job) => {
          const meta = getStatusMeta(job.status);
          const isApproving = approving === job.id;
          return (
            <div className="cj-card" key={job.id}>
              <div className="cj-card-left">
                <div className="cj-job-title">{job.title}</div>
                <div className="cj-job-department">{job.department}</div>
                <div className="cj-job-meta">
                  {job.location && <span>📍 {job.location}</span>}
                  {job.jobType && <span>💼 {job.jobType}</span>}
                </div>
              </div>

              <div className="cj-card-right">
                <span className={`cj-status-badge ${meta.className}`}>
                  {meta.label}
                </span>
                <div className="cj-date">Posted: {formatDate(job.createdAt)}</div>
                {job.status === "PENDING" && user.role === "TFG" && (
                  <button
                    className="cj-approve-btn"
                    onClick={() => handleApprove(job.id)}
                    disabled={isApproving}
                  >
                    {isApproving ? "Approving..." : "Approve"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyJobs;