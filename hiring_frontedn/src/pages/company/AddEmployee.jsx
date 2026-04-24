import { useState } from "react";
import { userService } from "../../services/api";
import "./AddEmployee.css";

const COMPANY_ROLES = ["DELIVERY", "TFG", "TAG"];

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "DELIVERY",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
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
      setSuccess("Employee added successfully!");
      setFormData({ name: "", email: "", password: "", role: "DELIVERY" });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add employee. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-emp-page">
      <div className="add-emp-card">
        <div className="add-emp-header">
          <h1 className="add-emp-title">Add Employee</h1>
          <p className="add-emp-subtitle">Create a new employee account</p>
        </div>

        <form className="add-emp-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="add-emp-error">{error}</div>}
          {success && <div className="add-emp-success">{success}</div>}

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
              placeholder="employee@company.com"
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
              {COMPANY_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="add-emp-btn" disabled={loading}>
            {loading ? <span className="add-emp-spinner" /> : "Add Employee"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;