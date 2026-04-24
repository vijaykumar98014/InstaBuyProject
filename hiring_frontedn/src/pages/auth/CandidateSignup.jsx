import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userService } from "../../services/api";
import "./CandidateSignup.css";

const ROLES = ["CANDIDATE", "DELIVERY", "TFG", "TAG", "ADMIN"];

const CandidateSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CANDIDATE",
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await userService.signup(formData);
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="candidate-signup-page">
      <div className="candidate-signup-card">

        <div className="signup-header">
          <div className="signup-logo">HireTrack</div>
          <h1 className="signup-title">Create an account</h1>
          <p className="signup-subtitle">Join HireTrack to get started</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>

          {error && <div className="signup-error">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? <span className="signup-spinner" /> : "Create Account"}
          </button>

        </form>

        <p className="signup-footer">
          Already have an account?{" "}
          <Link to="/login" className="signup-link">Sign in</Link>
        </p>

      </div>
    </div>
  );
};

export default CandidateSignup;