import React from "react";

const MetricsRow = ({ metrics }) => {
  const metricCards = [
    {
      label: "Total Tax Saved",
      value: `$${(Math.round(metrics.totalTaxSavings * 100) / 100).toFixed(2)}`,
      icon: "📊",
      bgGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      label: "Assets Harvested",
      value: metrics.assetsHarvested,
      icon: "🎯",
      bgGradient: "linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)",
    },
    {
      label: "Net Portfolio Gain",
      value: `$${(Math.round(metrics.netPortfolioGain * 100) / 100).toFixed(2)}`,
      icon: "📈",
      bgGradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    },
    {
      label: "Portfolio Value",
      value: `$${(Math.round(metrics.portfolioValue * 100) / 100).toFixed(2)}`,
      icon: "💼",
      bgGradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
    },
  ];

  const containerStyle = {
    marginBottom: "2rem",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem",
  };

  const cardStyle = {
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    backgroundColor: "white",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "box-shadow 0.3s ease",
    cursor: "pointer",
  };

  const cardHeaderStyle = {
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#64748b",
    margin: 0,
  };

  const iconStyle = {
    fontSize: "24px",
  };

  const valueStyle = (gradient) => ({
    fontSize: "24px",
    fontWeight: "bold",
    background: gradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: 0,
  });

  return (
    <div style={containerStyle}>
      {metricCards.map((card, i) => (
        <div
          key={i}
          style={cardStyle}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)")}
        >
          <div style={cardHeaderStyle}>
            <p style={labelStyle}>{card.label}</p>
            <span style={iconStyle}>{card.icon}</span>
          </div>
          <p style={valueStyle(card.bgGradient)}>{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default MetricsRow;

