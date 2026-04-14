import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Toast from "../components/Toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setToast({
        type: "success",
        title: "Welcome back!",
        message: "You are logged in successfully.",
      });
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err) {
      setToast({
        type: "error",
        title: "Login failed",
        message: err.response?.data?.msg || "Please check your email and password.",
      });
    }
  };

  return (
    <div className="app-shell">
      <div className="card">
        <h1 className="page-title">Log in to your dashboard</h1>
        <p className="page-copy">
          Manage your tax-loss harvesting and portfolio insights from one clean place.
        </p>

        <div className="form-group">
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

        <button className="primary-btn" onClick={handleLogin}>
          Sign in
        </button>

        <p className="form-footer">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>

      <div className="toast-portal">
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </div>
  );
};

export default Login;