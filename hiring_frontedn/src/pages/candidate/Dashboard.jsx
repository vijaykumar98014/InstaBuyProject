import { useState, useEffect } from "react";
import { applicationService, offerService } from "../../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    applications: 0,
    offers: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      try {
        const [appsRes, offersRes] = await Promise.all([
          applicationService.getApplicationsByUser(user.id),
          offerService.getOffersByUser(user.id),
        ]);

        const applications = appsRes.data;
        const offers = offersRes.data;
        const pending = offers.filter((o) => o.status === "PENDING").length;

        setStats({
          applications: applications.length,
          offers: offers.length,
          pending,
        });
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="dashboard-state">
        <div className="dashboard-spinner" />
        <p>Loading dashboard…</p>
      </div>
    );
  }

  if (error) {
    return <div className="dashboard-state dashboard-state--error">{error}</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back, {user?.name || "User"}!</h1>
        <p className="dashboard-subtitle">Here's your job application overview</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-number">{stats.applications}</div>
            <div className="stat-label">Applications Submitted</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎉</div>
          <div className="stat-content">
            <div className="stat-number">{stats.offers}</div>
            <div className="stat-label">Offers Received</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending Offers</div>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <a href="/jobs" className="dashboard-btn dashboard-btn--primary">
          Browse Jobs
        </a>
        <a href="/my-applications" className="dashboard-btn dashboard-btn--secondary">
          View Applications
        </a>
      </div>
    </div>
  );
};

export default Dashboard;