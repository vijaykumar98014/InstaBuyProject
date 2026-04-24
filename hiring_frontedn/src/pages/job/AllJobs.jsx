import { useState, useEffect } from "react";
import { jobService, applicationService } from "../../services/api";
import "./AllJobs.css";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(null);
  const [feedback, setFeedback] = useState({});

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobService.getAllJobs();
        // Filter to approved jobs
        const approved = res.data.filter(
          (j) => (j.status || "").toUpperCase() === "APPROVED"
        );
        setJobs(approved);
      } catch {
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

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

  if (loading) {
    return (
      <div className="all-jobs-state">
        <div className="all-jobs-spinner" />
        <p>Loading jobs…</p>
      </div>
    );
  }

  if (error) {
    return <div className="all-jobs-state all-jobs-state--error">{error}</div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="all-jobs-state">
        <div className="all-jobs-empty-icon">💼</div>
        <p className="all-jobs-empty-title">No jobs available</p>
        <p className="all-jobs-empty-sub">Check back later for new opportunities.</p>
      </div>
    );
  }

  return (
    <div className="all-jobs-page">
      <div className="all-jobs-header">
        <h1 className="all-jobs-title">All Jobs</h1>
        <span className="all-jobs-count">{jobs.length} opening{jobs.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="all-jobs-list">
        {jobs.map((job) => {
          const fb = feedback[job.id];
          const isApplying = applying === job.id;
          const applied = fb?.type === "success";

          return (
            <div className="all-jobs-card" key={job.id}>
              <div className="all-jobs-card-body">
                <div className="all-jobs-card-main">
                  <h2 className="all-jobs-job-title">{job.title}</h2>

                  <div className="all-jobs-job-meta">
                    {job.location && (
                      <span className="all-jobs-meta-chip">📍 {job.location}</span>
                    )}
                    {job.jobType && (
                      <span className="all-jobs-meta-chip">💼 {job.jobType}</span>
                    )}
                    {job.salary && (
                      <span className="all-jobs-meta-chip">💰 {job.salary}</span>
                    )}
                  </div>

                  {job.description && (
                    <p className="all-jobs-description">{job.description}</p>
                  )}

                  {job.skills && job.skills.length > 0 && (
                    <div className="all-jobs-skills">
                      {job.skills.map((skill, i) => (
                        <span className="all-jobs-skill-tag" key={i}>{skill}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="all-jobs-card-side">
                  {applied && <span className="all-jobs-applied-badge">Applied</span>}
                  <span className="all-jobs-posted-date">
                    Posted {new Date(job.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="all-jobs-card-footer">
                {fb && (
                  <span className={`all-jobs-feedback all-jobs-feedback--${fb.type}`}>
                    {fb.msg}
                  </span>
                )}

                <button
                  className={`all-jobs-btn ${applied ? 'all-jobs-btn--applied' : 'all-jobs-btn--apply'}`}
                  onClick={() => handleApply(job.id)}
                  disabled={isApplying || applied}
                >
                  {isApplying
                    ? <span className="all-jobs-spinner all-jobs-spinner--sm" />
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

export default AllJobs;