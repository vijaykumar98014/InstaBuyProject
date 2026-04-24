import { useState } from "react";
import { jobService } from "../../services/api";
import "./CreateJob.css";

const JOB_TYPES   = ["Full-Time", "Part-Time", "Contract", "Internship", "Remote"];
const DEPARTMENTS  = ["Engineering", "Design", "Product", "Sales", "Marketing", "HR", "Finance", "Operations"];
const EXPERIENCE   = ["0-1 years", "1-3 years", "3-5 years", "5-8 years", "8+ years"];

const INITIAL_FORM = {
  title:          "",
  department:     "",
  jobType:        "",
  location:       "",
  salary:         "",
  experience:     "",
  description:    "",
  responsibilities: "",
  requirements:   "",
  skills:         "",        // comma-separated → split before POST
  openings:       "",
};

const CreateJob = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const validate = () => {
    if (!formData.title.trim())       return "Job title is required.";
    if (!formData.department)         return "Department is required.";
    if (!formData.jobType)            return "Job type is required.";
    if (!formData.location.trim())    return "Location is required.";
    if (!formData.description.trim()) return "Job description is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        skills: formData.skills
          ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        openings: formData.openings ? parseInt(formData.openings, 10) : 1,
        createdBy: user?.id,
        status: "PENDING",   // goes to TFG for approval
      };

      await jobService.createJob(payload);
      setSuccess("Job posted successfully! It will be reviewed by TFG before going live.");
      setFormData(INITIAL_FORM);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create job. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setError("");
    setSuccess("");
  };

  return (
    <div className="cj-page">

      <div className="cj-header">
        <h1 className="cj-title">Create Job Posting</h1>
        <p className="cj-subtitle">Fill in the details below. The job will be sent to TFG for approval.</p>
      </div>

      <form className="cj-form" onSubmit={handleSubmit} noValidate>

        {error   && <div className="cj-alert cj-alert--error">{error}</div>}
        {success && <div className="cj-alert cj-alert--success">{success}</div>}

        {/* ── Section: Basic Info ── */}
        <div className="cj-section">
          <h2 className="cj-section-title">Basic Information</h2>

          <div className="cj-row">
            <div className="form-group">
              <label className="form-label" htmlFor="title">Job Title <span className="required">*</span></label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                placeholder="e.g. Senior React Developer"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="department">Department <span className="required">*</span></label>
              <select
                id="department"
                name="department"
                className="form-input"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="cj-row">
            <div className="form-group">
              <label className="form-label" htmlFor="jobType">Job Type <span className="required">*</span></label>
              <select
                id="jobType"
                name="jobType"
                className="form-input"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option value="">Select type</option>
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">Location <span className="required">*</span></label>
              <input
                id="location"
                name="location"
                type="text"
                className="form-input"
                placeholder="e.g. Hyderabad / Remote"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="cj-row">
            <div className="form-group">
              <label className="form-label" htmlFor="salary">Salary Range</label>
              <input
                id="salary"
                name="salary"
                type="text"
                className="form-input"
                placeholder="e.g. ₹8L – ₹14L per annum"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="experience">Experience Required</label>
              <select
                id="experience"
                name="experience"
                className="form-input"
                value={formData.experience}
                onChange={handleChange}
              >
                <option value="">Select experience</option>
                {EXPERIENCE.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          <div className="cj-row cj-row--single">
            <div className="form-group">
              <label className="form-label" htmlFor="openings">Number of Openings</label>
              <input
                id="openings"
                name="openings"
                type="number"
                min="1"
                className="form-input form-input--short"
                placeholder="1"
                value={formData.openings}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* ── Section: Details ── */}
        <div className="cj-section">
          <h2 className="cj-section-title">Job Details</h2>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Job Description <span className="required">*</span></label>
            <textarea
              id="description"
              name="description"
              className="form-input form-textarea"
              placeholder="Describe the role, team, and what the candidate will be doing…"
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="responsibilities">Key Responsibilities</label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              className="form-input form-textarea"
              placeholder="List the main responsibilities of this role…"
              rows={3}
              value={formData.responsibilities}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="requirements">Requirements</label>
            <textarea
              id="requirements"
              name="requirements"
              className="form-input form-textarea"
              placeholder="List qualifications, degrees, or certifications required…"
              rows={3}
              value={formData.requirements}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="skills">
              Skills <span className="form-hint">(comma-separated)</span>
            </label>
            <input
              id="skills"
              name="skills"
              type="text"
              className="form-input"
              placeholder="e.g. React, Node.js, PostgreSQL, Docker"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="cj-actions">
          <button
            type="button"
            className="cj-btn cj-btn--secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </button>

          <button
            type="submit"
            className="cj-btn cj-btn--primary"
            disabled={loading}
          >
            {loading ? <span className="cj-spinner" /> : "Submit for Approval"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateJob;