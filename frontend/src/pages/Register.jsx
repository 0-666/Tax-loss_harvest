import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Toast from "../components/Toast";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );
      localStorage.setItem("token", res.data.token);
      setToast({
        type: "success",
        title: "Account created",
        message: "Your profile is ready.",
      });
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err) {
      setToast({
        type: "error",
        title: "Registration failed",
        message: err.response?.data?.msg || "Please review your details and try again.",
      });
    }
  };

  return (
    <div className="app-shell">
      <div className="card">
        <h1 className="page-title">Create an account</h1>
        <p className="page-copy">
          Sign up now to monitor tax-loss harvesting opportunities with a clean investor dashboard.
        </p>

        <div className="form-group">
          <input
            className="form-input"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="form-input"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="form-input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button className="primary-btn" onClick={handleRegister}>
          Register
        </button>

        <p className="form-footer">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>

      <div className="toast-portal">
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </div>
  );
};

export default Register;