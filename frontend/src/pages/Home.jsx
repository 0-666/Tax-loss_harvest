import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../components/Toast";

const Home = () => {
  const [toast, setToast] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchProfile();
    }

    setToast({
      type: "success",
      title: "Welcome back",
      message: "Your tax-loss dashboard is ready.",
    });
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      setProfile(response.data.user);
    } catch (err) {
      console.log("Unable to load profile", err.message);
      localStorage.removeItem("token");
    }
  };

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    showToast("info", "Logged out", "You have been signed out.");
    setTimeout(() => navigate("/"), 600);
  };

  return (
    <div className="app-shell">
      {/* Header Bar */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          {/* Left side - User Profile */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold"
            }}>
              {profile ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>
                {profile ? `Welcome, ${profile.name}` : "Welcome"}
              </div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                {profile ? profile.email : "Please sign in"}
              </div>
            </div>
          </div>

          {/* Right side - Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link
              to="/dashboard"
              style={{
                padding: "0.5rem 1rem",
                background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-1px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: "0.5rem 1rem",
                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-1px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="home-card">
        <div className="home-hero">
          <span className="home-eyebrow">Tax Loss Center</span>
          <h1 className="home-headline">Tax-loss harvesting made easy.</h1>
          <p className="home-description">
            Capture losses, reduce your tax bill, and keep your portfolio aligned with a modern dashboard built for investors.
          </p>
        </div>

        <div className="home-data">
          <strong>Portfolio Overview</strong>
          <p>
            Connected • Real-time portfolio insights are ready. Your dashboard provides optimal harvesting opportunities and live market data.
          </p>
          <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div style={{ padding: "1rem", background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", borderRadius: "8px", border: "1px solid #0ea5e9" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#0ea5e9" }}>📊</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", marginTop: "0.5rem" }}>Smart Analysis</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>AI-powered tax-loss harvesting recommendations</div>
            </div>
            <div style={{ padding: "1rem", background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", borderRadius: "8px", border: "1px solid #22c55e" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#22c55e" }}>💰</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", marginTop: "0.5rem" }}>Tax Savings</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Maximize your tax benefits with optimal strategies</div>
            </div>
            <div style={{ padding: "1rem", background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", borderRadius: "8px", border: "1px solid #f59e0b" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}>📈</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", marginTop: "0.5rem" }}>Live Data</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Real-time stock prices and market insights</div>
            </div>
          </div>
        </div>
      </div>

      <div className="toast-portal">
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </div>
  );
};

export default Home;