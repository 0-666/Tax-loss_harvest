import React from "react";

const HarvestChart = ({ selectedAssets }) => {
  const containerStyle = {
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  };

  const emptyStateStyle = {
    ...containerStyle,
    padding: "2rem",
    textAlign: "center",
  };

  const headerSectionStyle = {
    padding: "1.5rem",
    borderBottom: "1px solid #e2e8f0",
  };

  const headerTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: 0,
  };

  const headerSubtitleStyle = {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "0.25rem",
    margin: 0,
  };

  const totalSavingsStyle = {
    fontWeight: "600",
    color: "#059669",
  };

  const chartsContainerStyle = {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const chartItemStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  const chartHeaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const tickerStyle = {
    fontWeight: "500",
    color: "#1e293b",
  };

  const savingsTextStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#059669",
  };

  const barContainerStyle = {
    height: "12px",
    width: "100%",
    borderRadius: "9999px",
    backgroundColor: "#f1f5f9",
    overflow: "hidden",
  };

  const barFillStyle = (barWidth) => ({
    height: "100%",
    width: `${barWidth}%`,
    background: "linear-gradient(to right, #4ade80 0%, #16a34a 100%)",
    transition: "width 0.3s ease",
  });

  const distributionSectionStyle = {
    borderTop: "1px solid #e2e8f0",
    padding: "1.5rem",
  };

  const distributionLabelStyle = {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "0.75rem",
    margin: 0,
  };

  const legendContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  };

  const legendItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  const legendDotStyle = (color) => ({
    height: "12px",
    width: "12px",
    borderRadius: "9999px",
    backgroundColor: color,
  });

  const legendTickerStyle = {
    fontSize: "12px",
    color: "#64748b",
  };

  const moreStyle = {
    fontSize: "12px",
    color: "#94a3b8",
  };

  if (!selectedAssets || selectedAssets.length === 0) {
    return (
      <div style={emptyStateStyle}>
        <p style={{ color: "#64748b", margin: 0 }}>Run a simulation to see harvest breakdown</p>
      </div>
    );
  }

  const sorted = [...selectedAssets].sort((a, b) => b.taxSavings - a.taxSavings);
  const maxSavings = Math.max(...sorted.map((a) => a.taxSavings));
  const totalTaxSavings = sorted.reduce((sum, a) => sum + a.taxSavings, 0);

  const colors = ["#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#f59e0b"];

  return (
    <div style={containerStyle}>
      <div style={headerSectionStyle}>
        <h2 style={headerTitleStyle}>📊 Tax Savings Breakdown</h2>
        <p style={headerSubtitleStyle}>
          Total tax savings:{" "}
          <span style={totalSavingsStyle}>${totalTaxSavings.toFixed(2)}</span>
        </p>
      </div>

      <div style={chartsContainerStyle}>
        {sorted.map((asset, i) => {
          const barWidth = (asset.taxSavings / totalTaxSavings) * 100;

          return (
            <div key={i} style={chartItemStyle}>
              <div style={chartHeaderStyle}>
                <span style={tickerStyle}>{asset.ticker}</span>
                <span style={savingsTextStyle}>${asset.taxSavings.toFixed(2)}</span>
              </div>
              <div style={barContainerStyle}>
                <div style={barFillStyle(barWidth)} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={distributionSectionStyle}>
        <p style={distributionLabelStyle}>Asset Distribution</p>
        <div style={legendContainerStyle}>
          {sorted.slice(0, 5).map((asset, i) => (
            <div key={i} style={legendItemStyle}>
              <div style={legendDotStyle(colors[i % colors.length])} />
              <span style={legendTickerStyle}>{asset.ticker}</span>
            </div>
          ))}
          {sorted.length > 5 && <span style={moreStyle}>+{sorted.length - 5} more</span>}
        </div>
      </div>
    </div>
  );
};

export default HarvestChart;

