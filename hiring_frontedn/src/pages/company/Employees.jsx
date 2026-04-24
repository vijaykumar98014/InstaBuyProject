import { useState, useEffect } from "react";
import { userService } from "../../services/api";
import "./Employees.css";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await userService.getAllUsers();
        // Filter company roles
        const companyRoles = ["DELIVERY", "TFG", "TAG", "ADMIN"];
        const filtered = res.data.filter((user) => companyRoles.includes(user.role));
        setEmployees(filtered);
      } catch {
        setError("Failed to load employees.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="emp-state">
        <div className="emp-spinner" />
        <p>Loading employees…</p>
      </div>
    );
  }

  if (error) {
    return <div className="emp-state emp-state--error">{error}</div>;
  }

  if (employees.length === 0) {
    return (
      <div className="emp-state">
        <div className="emp-empty-icon">👥</div>
        <p className="emp-empty-title">No employees found</p>
        <p className="emp-empty-sub">
          Add employees to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="emp-page">
      <div className="emp-header">
        <h1 className="emp-title">Employees</h1>
        <span className="emp-count">
          {employees.length} employee{employees.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="emp-list">
        {employees.map((emp) => (
          <div className="emp-card" key={emp.id}>
            <div className="emp-info">
              <div className="emp-name">{emp.name}</div>
              <div className="emp-email">{emp.email}</div>
            </div>
            <div className="emp-role">{emp.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employees;