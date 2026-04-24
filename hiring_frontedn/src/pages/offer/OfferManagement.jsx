import { useState, useEffect } from "react";
import { offerService, applicationService } from "../../services/api";
import "./OfferManagement.css";

const STATUS_META = {
  PENDING: { label: "Pending", className: "status--pending" },
  ACCEPTED: { label: "Accepted", className: "status--accepted" },
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

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    applicationId: "",
    salary: "",
    description: "",
    validUntil: "",
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offersRes, appsRes] = await Promise.all([
          offerService.getAllOffers(),
          applicationService.getAllApplications(),
        ]);
        setOffers(offersRes.data);
        setApplications(appsRes.data.filter((app) => app.status === "SHORTLISTED"));
      } catch {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateOffer = async () => {
    if (!createForm.applicationId || !createForm.salary) return;
    setCreating(true);
    try {
      await offerService.createOffer(createForm);
      // Refresh offers
      const res = await offerService.getAllOffers();
      setOffers(res.data);
      setShowCreateModal(false);
      setCreateForm({ applicationId: "", salary: "", description: "", validUntil: "" });
    } catch (err) {
      setError("Failed to create offer.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="om-state">
        <div className="om-spinner" />
        <p>Loading offers…</p>
      </div>
    );
  }

  if (error) {
    return <div className="om-state om-state--error">{error}</div>;
  }

  return (
    <div className="om-page">
      <div className="om-header">
        <h1 className="om-title">Offer Management</h1>
        <button
          className="om-create-btn"
          onClick={() => setShowCreateModal(true)}
        >
          Create Offer
        </button>
      </div>

      <div className="om-list">
        {offers.map((offer) => {
          const meta = getStatusMeta(offer.status);
          return (
            <div className="om-card" key={offer.id}>
              <div className="om-card-left">
                <div className="om-applicant-name">{offer.applicantName || "N/A"}</div>
                <div className="om-job-title">{offer.jobTitle || "—"}</div>
                <div className="om-salary">💰 {offer.salary}</div>
              </div>

              <div className="om-card-right">
                <span className={`om-status-badge ${meta.className}`}>
                  {meta.label}
                </span>
                <div className="om-dates">
                  <div className="om-date-row">
                    <span className="om-date-label">Offered</span>
                    <span className="om-date-val">{formatDate(offer.createdAt)}</span>
                  </div>
                  {offer.validUntil && (
                    <div className="om-date-row">
                      <span className="om-date-label">Valid until</span>
                      <span className="om-date-val">{formatDate(offer.validUntil)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <div className="om-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="om-modal" onClick={(e) => e.stopPropagation()}>
            <div className="om-modal-header">
              <h2 className="om-modal-title">Create Offer</h2>
              <button className="om-modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>

            <div className="om-modal-body">
              <div className="form-group">
                <label className="form-label">Application <span className="required">*</span></label>
                <select
                  className="form-input"
                  value={createForm.applicationId}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, applicationId: e.target.value }))}
                >
                  <option value="">Select application</option>
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.applicantName} - {app.jobTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Salary <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. ₹10L per annum"
                  value={createForm.salary}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, salary: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea"
                  rows={3}
                  placeholder="Offer details..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Valid Until</label>
                <input
                  type="date"
                  className="form-input"
                  value={createForm.validUntil}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, validUntil: e.target.value }))}
                />
              </div>
            </div>

            <div className="om-modal-footer">
              <button className="om-btn om-btn--cancel" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button
                className="om-btn om-btn--confirm"
                onClick={handleCreateOffer}
                disabled={creating || !createForm.applicationId || !createForm.salary}
              >
                {creating ? "Creating..." : "Create Offer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferManagement;