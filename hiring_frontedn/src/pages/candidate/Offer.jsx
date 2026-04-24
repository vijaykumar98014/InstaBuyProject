import { useState, useEffect } from "react";
import { offerService } from "../../services/api";
import "./Offer.css";

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

const Offer = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user?.id) return;

    const fetchOffers = async () => {
      try {
        const res = await offerService.getOffersByUser(user.id);
        setOffers(res.data);
      } catch {
        setError("Failed to load your offers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [user?.id]);

  const handleStatusUpdate = async (offerId, status) => {
    setUpdating(offerId);
    try {
      await offerService.updateOfferStatus(offerId, status);
      setOffers((prev) =>
        prev.map((offer) =>
          offer.id === offerId ? { ...offer, status } : offer
        )
      );
    } catch (err) {
      setError("Failed to update offer status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="offer-state">
        <div className="offer-spinner" />
        <p>Loading your offers…</p>
      </div>
    );
  }

  if (error) {
    return <div className="offer-state offer-state--error">{error}</div>;
  }

  if (offers.length === 0) {
    return (
      <div className="offer-state">
        <div className="offer-empty-icon">🎉</div>
        <p className="offer-empty-title">No offers yet</p>
        <p className="offer-empty-sub">
          Keep applying to jobs and you might get an offer soon!
        </p>
      </div>
    );
  }

  return (
    <div className="offer-page">
      <div className="offer-header">
        <h1 className="offer-title">My Offers</h1>
        <span className="offer-count">
          {offers.length} offer{offers.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="offer-list">
        {offers.map((offer) => {
          const meta = getStatusMeta(offer.status);
          const isUpdating = updating === offer.id;
          return (
            <div className="offer-card" key={offer.id}>
              <div className="offer-card-left">
                <div className="offer-job-title">{offer.jobTitle || "Job Title N/A"}</div>
                <div className="offer-company">{offer.companyName || "—"}</div>

                <div className="offer-meta">
                  {offer.salary && (
                    <span className="offer-meta-item">💰 {offer.salary}</span>
                  )}
                  {offer.location && (
                    <span className="offer-meta-item">📍 {offer.location}</span>
                  )}
                </div>

                {offer.description && (
                  <p className="offer-description">{offer.description}</p>
                )}
              </div>

              <div className="offer-card-right">
                <span className={`offer-status-badge ${meta.className}`}>
                  {meta.label}
                </span>

                <div className="offer-dates">
                  <div className="offer-date-row">
                    <span className="offer-date-label">Offered</span>
                    <span className="offer-date-val">{formatDate(offer.createdAt)}</span>
                  </div>
                  {offer.validUntil && (
                    <div className="offer-date-row">
                      <span className="offer-date-label">Valid until</span>
                      <span className="offer-date-val">{formatDate(offer.validUntil)}</span>
                    </div>
                  )}
                </div>

                {offer.status === "PENDING" && (
                  <div className="offer-actions">
                    <button
                      className="offer-btn offer-btn--accept"
                      onClick={() => handleStatusUpdate(offer.id, "ACCEPTED")}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Accept"}
                    </button>
                    <button
                      className="offer-btn offer-btn--reject"
                      onClick={() => handleStatusUpdate(offer.id, "REJECTED")}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Offer;