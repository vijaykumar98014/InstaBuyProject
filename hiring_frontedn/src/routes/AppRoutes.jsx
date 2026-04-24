import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login from "../pages/auth/Login";
import CandidateSignup from "../pages/auth/CandidateSignup";
import CompanySignup from "../pages/auth/CompanySignup";

// Candidate Pages
import CandidateDashboard from "../pages/candidate/Dashboard";
import Jobs from "../pages/candidate/Jobs";
import MyApplications from "../pages/candidate/MyApplications";
import CandidateOffer from "../pages/candidate/Offer";

// Company Pages
import CompanyDashboard from "../pages/company/Dashboard";
import Employees from "../pages/company/Employees";
import AddEmployee from "../pages/company/AddEmployee";
import CompanyJobs from "../pages/job/CompanyJobs";
import CreateJob from "../pages/job/CreateJob";
import Applications from "../pages/application/Applications";
import Interview from "../pages/application/Interview";
import OfferManagement from "../pages/offer/OfferManagement";

// Layout
import MainLayout from "../components/Layout/MainLayout";

// ─── Role-based Protected Route ─────────────────────────────────────────────

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// ─── Root Redirect based on role ────────────────────────────────────────────

const RoleRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "CANDIDATE":
      return <Navigate to="/candidate/dashboard" replace />;
    case "DELIVERY":
      return <Navigate to="/company/create-job" replace />;
    case "TFG":
      return <Navigate to="/company/jobs" replace />;
    case "TAG":
      return <Navigate to="/company/applications" replace />;
    case "ADMIN":
      return <Navigate to="/company/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// ─── App Routes ──────────────────────────────────────────────────────────────

const AppRoutes = () => {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/candidate-signup" element={<CandidateSignup />} />
        <Route path="/company-signup" element={<CompanySignup />} />

        {/* Root redirect */}
        <Route path="/" element={<RoleRedirect />} />

        {/* Candidate Routes */}
        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute allowedRoles={["CANDIDATE"]}>
              <MainLayout>
                <CandidateDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute allowedRoles={["CANDIDATE"]}>
              <MainLayout>
                <Jobs />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute allowedRoles={["CANDIDATE"]}>
              <MainLayout>
                <MyApplications />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-offers"
          element={
            <ProtectedRoute allowedRoles={["CANDIDATE"]}>
              <MainLayout>
                <CandidateOffer />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Company Routes */}
        <Route
          path="/company/dashboard"
          element={
            <ProtectedRoute allowedRoles={["DELIVERY", "TFG", "TAG", "ADMIN"]}>
              <MainLayout>
                <CompanyDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/employees"
          element={
            <ProtectedRoute allowedRoles={["DELIVERY", "TFG", "TAG", "ADMIN"]}>
              <MainLayout>
                <Employees />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/add-employee"
          element={
            <ProtectedRoute allowedRoles={["DELIVERY", "TFG", "TAG", "ADMIN"]}>
              <MainLayout>
                <AddEmployee />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/jobs"
          element={
            <ProtectedRoute allowedRoles={["DELIVERY", "TFG", "TAG", "ADMIN"]}>
              <MainLayout>
                <CompanyJobs />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/create-job"
          element={
            <ProtectedRoute allowedRoles={["DELIVERY", "ADMIN"]}>
              <MainLayout>
                <CreateJob />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/applications"
          element={
            <ProtectedRoute allowedRoles={["TAG", "ADMIN"]}>
              <MainLayout>
                <Applications />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/interview"
          element={
            <ProtectedRoute allowedRoles={["TAG", "ADMIN"]}>
              <MainLayout>
                <Interview />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/offers"
          element={
            <ProtectedRoute allowedRoles={["TAG", "ADMIN"]}>
              <MainLayout>
                <OfferManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Unauthorized */}
        <Route
          path="/unauthorized"
          element={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <h2>403 - Unauthorized</h2>
              <p>You do not have permission to view this page.</p>
              <a href="/login">Back to Login</a>
            </div>
          }
        />

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <h2>404 - Page Not Found</h2>
              <a href="/">Go Home</a>
            </div>
          }
        />

      </Routes>
    </Router>
  );
};

export default AppRoutes;