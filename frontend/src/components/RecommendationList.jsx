import React from "react";

const RecommendationList = ({ selectedAssets }) => {
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

  const dividerContainerStyle = {
    divideY: "1px solid #e2e8f0",
  };

  const assetItemStyle = {
    padding: "1.5rem",
    borderBottom: "1px solid #e2e8f0",
    transition: "background-color 0.2s ease",
    cursor: "pointer",
  };

  const assetHeaderStyle = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  };

  const assetLeftStyle = {
    flex: 1,
  };

  const assetTickerContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  };

  const assetTickerStyle = {
    fontWeight: "600",
    color: "#1e293b",
    margin: 0,
  };

  const badgeStyle = {
    fontSize: "12px",
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
  };

  const assetNameStyle = {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  };

  const assetRightStyle = {
    marginLeft: "1rem",
    textAlign: "right",
  };

  const lossStyle = {
    fontWeight: "600",
    color: "#dc2626",
    margin: 0,
  };

  const savingsStyle = {
    fontSize: "14px",
    color: "#059669",
    fontWeight: "500",
    margin: "0.25rem 0 0 0",
  };

  const gridStyle = {
    marginTop: "0.75rem",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.5rem",
  };

  const gridItemStyle = {
    borderRadius: "6px",
    backgroundColor: "#f8fafc",
    padding: "0.5rem",
    fontSize: "12px",
  };

  const gridLabelStyle = {
    color: "#64748b",
  };

  const gridValueStyle = {
    fontWeight: "600",
    color: "#1e293b",
    marginTop: "0.25rem",
  };

  if (!selectedAssets || selectedAssets.length === 0) {
    return (
      <div style={emptyStateStyle}>
        <p style={{ color: "#64748b", margin: 0 }}>Run a simulation to see recommendations</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerSectionStyle}>
        <h2 style={headerTitleStyle}>🎯 Recommended Harvests ({selectedAssets.length})</h2>
      </div>

      <div style={dividerContainerStyle}>
        {selectedAssets.map((asset, i) => (
          <div
            key={i}
            style={assetItemStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <div style={assetHeaderStyle}>
              <div style={assetLeftStyle}>
                <div style={assetTickerContainerStyle}>
                  <h3 style={assetTickerStyle}>{asset.ticker}</h3>
                  <span style={badgeStyle}>Score: {asset.harvestScore.toFixed(2)}</span>
                </div>
                <p style={assetNameStyle}>{asset.name}</p>
              </div>
              <div style={assetRightStyle}>
                <p style={lossStyle}>Loss: ${Math.abs(asset.unrealizedPL).toFixed(2)}</p>
                <p style={savingsStyle}>Save: ${asset.taxSavings.toFixed(2)}</p>
              </div>
            </div>

            <div style={gridStyle}>
              <div style={gridItemStyle}>
                <span style={gridLabelStyle}>Qty</span>
                <p style={gridValueStyle}>{asset.quantity}</p>
              </div>
              <div style={gridItemStyle}>
                <span style={gridLabelStyle}>Buy Price</span>
                <p style={gridValueStyle}>${asset.buyPrice.toFixed(2)}</p>
              </div>
              <div style={gridItemStyle}>
                <span style={gridLabelStyle}>ML Rating</span>
                <p style={gridValueStyle}>{asset.mlRating}/100</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationList;

