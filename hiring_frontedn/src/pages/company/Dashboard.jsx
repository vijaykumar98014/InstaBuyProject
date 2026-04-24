import { useState, useEffect } from "react";
import { jobService, applicationService, offerService } from "../../services/api";
import "./Dashboard.css";

const CompanyDashboard = () => {
  const [stats, setStats] = useState({
    jobs: 0,
    applications: 0,
    offers: 0,
    employees: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobsRes, appsRes, offersRes] = await Promise.all([
          jobService.getAllJobs(),
          applicationService.getAllApplications(),
          offerService.getAllOffers(),
        ]);

        const jobs = jobsRes.data.filter((j) => j.createdBy === user.id).length;
        const applications = appsRes.data.length;
        const offers = offersRes.data.length;
        // For employees, perhaps fetch users with company role, but for now, set to 0 or mock
        const employees = 0; // TODO: implement employee count

        setStats({
          jobs,
          applications,
          offers,
          employees,
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
        <h1 className="dashboard-title">Company Dashboard</h1>
        <p className="dashboard-subtitle">Manage your hiring process</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-content">
            <div className="stat-number">{stats.jobs}</div>
            <div className="stat-label">Jobs Posted</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-number">{stats.applications}</div>
            <div className="stat-label">Applications Received</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎉</div>
          <div className="stat-content">
            <div className="stat-number">{stats.offers}</div>
            <div className="stat-label">Offers Made</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{stats.employees}</div>
            <div className="stat-label">Employees</div>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <a href="/company/create-job" className="dashboard-btn dashboard-btn--primary">
          Post New Job
        </a>
        <a href="/company/applications" className="dashboard-btn dashboard-btn--secondary">
          View Applications
        </a>
      </div>
    </div>
  );
};

export default CompanyDashboard;