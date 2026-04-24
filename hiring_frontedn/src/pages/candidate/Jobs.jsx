import { useState, useEffect } from "react";
import { jobService, applicationService } from "../../services/api";
import "./Jobs.css";

const Jobs = () => {
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [applying, setApplying]   = useState(null);   // jobId currently being applied
  const [feedback, setFeedback]   = useState({});     // { [jobId]: { type, msg } }

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ── Fetch Jobs ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobService.getAllJobs();
        setJobs(res.data);
      } catch {
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // ── Apply Handler ──────────────────────────────────────────────────────────
  const handleApply = async (jobId) => {
    if (!user) return;
    setApplying(jobId);
    setFeedback((prev) => ({ ...prev, [jobId]: null }));

    try {
      await applicationService.applyForJob({
        jobId,
        userId: user.id,
        applicantName: user.name,
        applicantEmail: user.email,
      });
      setFeedback((prev) => ({
        ...prev,
        [jobId]: { type: "success", msg: "Application submitted!" },
      }));
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to apply. Please try again.";
      setFeedback((prev) => ({
        ...prev,
        [jobId]: { type: "error", msg },
      }));
    } finally {
      setApplying(null);
    }
  };

  // ── Render States ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="jobs-state">
        <div className="jobs-spinner" />
        <p>Loading jobs…</p>
      </div>
    );
  }

  if (error) {
    return <div className="jobs-state jobs-state--error">{error}</div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="jobs-state">
        <p className="jobs-empty">No jobs available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="jobs-page">

      <div className="jobs-header">
        <h1 className="jobs-title">Available Jobs</h1>
        <span className="jobs-count">{jobs.length} opening{jobs.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="jobs-grid">
        {jobs.map((job) => {
          const fb = feedback[job.id];
          const isApplying = applying === job.id;
          const applied = fb?.type === "success";

          return (
            <div className="job-card" key={job.id}>

              <div className="job-card-header">
                <div>
                  <h2 className="job-title">{job.title}</h2>
                  <p className="job-company">{job.companyName || "HireTrack Inc."}</p>
                </div>
                <span className={`job-status-badge job-status--${(job.status || "open").toLowerCase()}`}>
                  {job.status || "Open"}
                </span>
              </div>

              <div className="job-meta">
                {job.location && (
                  <span className="job-meta-item">📍 {job.location}</span>
                )}
                {job.jobType && (
                  <span className="job-meta-item">💼 {job.jobType}</span>
                )}
                {job.salary && (
                  <span className="job-meta-item">💰 {job.salary}</span>
                )}
              </div>

              {job.description && (
                <p className="job-description">{job.description}</p>
              )}

              {job.skills && job.skills.length > 0 && (
                <div className="job-skills">
                  {job.skills.map((skill, i) => (
                    <span className="job-skill-tag" key={i}>{skill}</span>
                  ))}
                </div>
              )}

              <div className="job-card-footer">
                {fb && (
                  <span className={`job-feedback job-feedback--${fb.type}`}>
                    {fb.msg}
                  </span>
                )}

                <button
                  className="job-apply-btn"
                  onClick={() => handleApply(job.id)}
                  disabled={isApplying || applied}
                >
                  {isApplying
                    ? <span className="btn-spinner" />
                    : applied
                    ? "✓ Applied"
                    : "Apply Now"}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Jobs;