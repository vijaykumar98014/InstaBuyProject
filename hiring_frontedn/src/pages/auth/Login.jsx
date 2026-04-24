import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userService } from "../../services/api";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const getRoleRedirect = (role) => {
    switch (role) {
      case "CANDIDATE":   return "/candidate/dashboard";
      case "DELIVERY":    return "/company/create-job";
      case "TFG":         return "/company/jobs";
      case "TAG":         return "/company/applications";
      case "ADMIN":       return "/company/dashboard";
      default:            return "/login";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await userService.login(formData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate(getRoleRedirect(user.role));
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <div className="login-logo">HireTrack</div>
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to your account to continue</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>

          {error && <div className="login-error">{error}</div>}

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
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="login-spinner" /> : "Sign In"}
          </button>

        </form>

        <p className="login-footer">
          Don&apos;t have an account?{" "}
          <Link to="/candidate-signup" className="login-link">Create one</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;