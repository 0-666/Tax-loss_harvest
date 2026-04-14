import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "./Toast";
import MetricsRow from "./MetricsRow";
import PortfolioTable from "./PortfolioTable";
import RecommendationList from "./RecommendationList";
import HarvestChart from "./HarvestChart";

const Dashboard = () => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [targetOffset, setTargetOffset] = useState(50000);
  const [lockedAssets, setLockedAssets] = useState([]);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [newTicker, setNewTicker] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newBuyPrice, setNewBuyPrice] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setToast({
        type: "info",
        title: "Sign in required",
        message: "Please login to access the dashboard.",
      });
      setTimeout(() => navigate("/"), 1200);
      return;
    }

    fetchPortfolio();
  }, [navigate, token]);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/portfolio", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        validateStatus: () => true,
      });

      if (response.status === 200 && response.data.portfolio) {
        setPortfolioData(response.data.portfolio);
        setLockedAssets(response.data.portfolio.filter((pos) => pos.locked).map((pos) => pos.ticker));
      } else {
        setPortfolioData([]);
        setLockedAssets([]);
        if (response.status === 401) {
          showToast("error", "Unauthorized", "Please login again to load your portfolio.");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/"), 900);
        }
      }
    } catch (error) {
      console.log("Using backend mock portfolio");
    }
  };

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
  };

  const handleRunSimulation = async () => {
    if (!targetOffset || targetOffset <= 0) {
      showToast("error", "Invalid input", "Target offset must be greater than 0");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/simulate",
        {
          targetOffset,
          lockedAssets,
          portfolio: portfolioData.length > 0 ? portfolioData : undefined,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      setResults(response.data);
      showToast(
        "success",
        "Simulation complete",
        `Found ${response.data.selectedAssets.length} assets to harvest`
      );
    } catch (error) {
      showToast(
        "error",
        "Simulation failed",
        error.response?.data?.error || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLock = async (ticker) => {
    const position = portfolioData.find((pos) => pos.ticker === ticker);
    if (!position) return;

    const newLockedValue = !position.locked;

    try {
      await axios.patch(
        `http://localhost:5000/api/portfolio/${ticker}/lock`,
        { locked: newLockedValue },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const updatedPortfolio = portfolioData.map((pos) =>
        pos.ticker === ticker ? { ...pos, locked: newLockedValue } : pos
      );
      setPortfolioData(updatedPortfolio);
      setLockedAssets(updatedPortfolio.filter((pos) => pos.locked).map((pos) => pos.ticker));
      showToast(
        "success",
        `Asset ${newLockedValue ? "locked" : "unlocked"}`,
        `${ticker} has been ${newLockedValue ? "locked" : "unlocked"} for harvesting.`
      );
    } catch (error) {
      showToast(
        "error",
        "Lock update failed",
        error.response?.data?.error || error.message
      );
    }
  };

  const addStockToPortfolio = async () => {
    if (!newTicker || !newQuantity || !newBuyPrice) {
      showToast("error", "Missing information", "Ticker, quantity and buy price are required.");
      return;
    }

    const quantityValue = Number(newQuantity);
    const buyPriceValue = Number(newBuyPrice);

    if (quantityValue <= 0 || buyPriceValue <= 0) {
      showToast("error", "Invalid values", "Quantity and buy price must be positive numbers.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/portfolio",
        {
          ticker: newTicker,
          quantity: quantityValue,
          buyPrice: buyPriceValue,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      setPortfolioData((prev) => [...prev, response.data.position]);
      setLockedAssets((prev) =>
        response.data.position.locked ? [...prev, response.data.position.ticker] : prev
      );
      setNewTicker("");
      setNewQuantity("");
      setNewBuyPrice("");
      showToast("success", "Stock added", `${response.data.position.ticker} was added successfully.`);
    } catch (error) {
      showToast("error", "Add failed", error.response?.data?.error || error.message);
    }
  };

  const handleTickerChange = async (e) => {
    const value = e.target.value;
    setNewTicker(value);
    if (value.length > 1) {
      try {
        const response = await axios.get(`http://localhost:8001/api/stock-search?query=${encodeURIComponent(value)}`);
        setSearchResults(response.data);
        setShowSuggestions(true);
      } catch (error) {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (symbol) => {
    setNewTicker(symbol);
    setShowSuggestions(false);
  };

  const headerStyle = {
    position: "sticky",
    top: 0,
    zIndex: 40,
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(4px)",
  };

  const headerContainerStyle = {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const logoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  };

  const logoBgStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    fontSize: "18px",
    fontWeight: "bold",
    color: "white",
  };

  const mainContentStyle = {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "2rem 1rem",
  };

  const inputSectionStyle = {
    marginBottom: "2rem",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    backgroundColor: "white",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  };

  const inputGridStyle = {
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: "1fr 1fr",
  };

  const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
  };

  const inputLabelStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#475569",
    marginBottom: "0.5rem",
  };

  const inputStyle = {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "0.75rem",
    fontSize: "16px",
    color: "#1e293b",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "0.75rem",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    transition: "transform 0.2s",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
    opacity: isLoading ? 0.5 : 1,
    pointerEvents: isLoading ? "none" : "auto",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    transform: "translateY(-1px)",
  };

  const lockedTextStyle = {
    marginTop: "0.5rem",
    fontSize: "12px",
    color: "#6f6b8a",
  };

  const gridLayout = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "2rem",
    marginBottom: "2rem",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e0e7ff 100%)",
      }}
    >
      {/* Header */}
      <header style={headerStyle}>
        <div style={headerContainerStyle}>
          <div style={logoStyle}>
            <div style={logoBgStyle}>💰</div>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>
              Tax-Loss Harvester
            </h1>
          </div>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Simulate optimal harvesting strategy
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div style={mainContentStyle}>
        {/* Input Section */}
        <div style={inputSectionStyle}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "1rem" }}>
            Simulation Parameters
          </h2>
          <div style={inputGridStyle}>
            <div style={inputGroupStyle}>
              <label style={inputLabelStyle}>Target Tax Offset ($)</label>
              <input
                type="number"
                min="0"
                step="1000"
                value={targetOffset}
                onChange={(e) => setTargetOffset(parseFloat(e.target.value))}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                placeholder="50000"
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                onClick={handleRunSimulation}
                disabled={isLoading}
                onMouseEnter={(e) => (e.target.style.transform = "translateY(-1px)")}
                onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
                style={buttonStyle}
              >
                {isLoading ? "Running Simulation..." : "Run Simulation"}
              </button>
            </div>
          </div>
          <p style={lockedTextStyle}>
            Locked Assets: {lockedAssets.length > 0 ? lockedAssets.join(", ") : "None"}
          </p>
        </div>

        <div style={{ marginBottom: "2rem", borderRadius: "16px", border: "1px solid #e2e8f0", backgroundColor: "white", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "1rem" }}>
            Add Stock to Portfolio
          </h2>
          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div style={{ ...inputGroupStyle, position: "relative" }}>
              <label style={inputLabelStyle}>Ticker symbol</label>
              <input
                className=""
                type="text"
                placeholder="AAPL"
                value={newTicker}
                onChange={handleTickerChange}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                style={inputStyle}
              />
              {showSuggestions && searchResults.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  background: 'white',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  {searchResults.map((result) => (
                    <div
                      key={result.symbol}
                      style={{
                        padding: '0.5rem',
                        cursor: 'pointer',
                        borderBottom: '1px solid #e2e8f0',
                        hover: { backgroundColor: '#f8fafc' }
                      }}
                      onClick={() => selectSuggestion(result.symbol)}
                    >
                      <strong>{result.symbol}</strong> - {result.name} ({result.type})
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={inputGroupStyle}>
              <label style={inputLabelStyle}>Quantity</label>
              <input
                type="number"
                min="1"
                placeholder="10"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={inputLabelStyle}>Buy price</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="120.50"
                value={newBuyPrice}
                onChange={(e) => setNewBuyPrice(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
          <button
            onClick={addStockToPortfolio}
            style={{
              ...buttonStyle,
              marginTop: "1rem",
              maxWidth: "240px",
              width: "100%",
            }}
          >
            Add stock
          </button>
        </div>

        {/* Metrics Row */}
        {results && <MetricsRow metrics={results.metrics} />}

        {/* Charts & Recommendations */}
        <div style={gridLayout}>
          {results && <HarvestChart selectedAssets={results.selectedAssets} />}
          {results && <RecommendationList selectedAssets={results.selectedAssets} />}
        </div>

        {/* Portfolio Table */}
        {portfolioData.length > 0 && (
          <PortfolioTable
            portfolio={portfolioData}
            lockedAssets={lockedAssets}
            onToggleLock={toggleLock}
          />
        )}
      </div>

      {/* Toast */}
      <div style={{ position: "fixed", right: "1rem", top: "1rem", zIndex: 50 }}>
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </div>
  );
};

export default Dashboard;

