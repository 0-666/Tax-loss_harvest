import React from "react";

const PortfolioTable = ({ portfolio, lockedAssets, onToggleLock }) => {
  const containerStyle = {
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
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

  const headerDescriptionStyle = {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "0.25rem",
    margin: 0,
  };

  const tableWrapperStyle = {
    overflowX: "auto",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const theadStyle = {
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  };

  const thStyle = {
    padding: "0.75rem 1.5rem",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "600",
    color: "#475569",
  };

  const thRightStyle = {
    ...thStyle,
    textAlign: "right",
  };

  const thCenterStyle = {
    ...thStyle,
    textAlign: "center",
  };

  const tbodyStyle = {
    divideY: "1px solid #e2e8f0",
  };

  const trStyle = (isLocked) => ({
    backgroundColor: isLocked ? "#fef3c7" : "transparent",
    transition: "background-color 0.2s ease",
    borderBottom: "1px solid #e2e8f0",
  });

  const tdStyle = {
    padding: "1rem 1.5rem",
    fontSize: "14px",
    color: "#1e293b",
  };

  const tdRightStyle = {
    ...tdStyle,
    textAlign: "right",
  };

  const tdCenterStyle = {
    ...tdStyle,
    textAlign: "center",
  };

  const lockButtonStyle = (isLocked) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: "8px",
    padding: "0.375rem 0.75rem",
    fontSize: "14px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    backgroundColor: isLocked ? "#fef08a" : "#f3f4f6",
    color: isLocked ? "#713f12" : "#374151",
  });

  return (
    <div style={containerStyle}>
      <div style={headerSectionStyle}>
        <h2 style={headerTitleStyle}>Portfolio Positions</h2>
        <p style={headerDescriptionStyle}>Click "Lock" to exclude assets from harvesting</p>
      </div>

      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={thStyle}>Ticker</th>
              <th style={thStyle}>Name</th>
              <th style={thRightStyle}>Qty</th>
              <th style={thRightStyle}>Buy Price</th>
              <th style={thRightStyle}>Current</th>
              <th style={thRightStyle}>P/L</th>
              <th style={thCenterStyle}>Tax Savings</th>
              <th style={thCenterStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((pos, i) => {
              const pl = (pos.currentPrice - pos.buyPrice) * pos.quantity;
              const taxSavings = Math.abs(pl) * 0.2;
              const isLocked = lockedAssets.includes(pos.ticker);

              return (
                <tr
                  key={i}
                  style={trStyle(isLocked)}
                  onMouseEnter={(e) => {
                    if (!isLocked) e.currentTarget.style.backgroundColor = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isLocked ? "#fef3c7" : "transparent";
                  }}
                >
                  <td style={tdStyle}>
                    <span style={{ fontWeight: "600" }}>{pos.ticker}</span>
                  </td>
                  <td style={tdStyle} style={{ fontSize: "14px", color: "#64748b" }}>
                    {pos.name}
                  </td>
                  <td style={tdRightStyle} style={{ fontWeight: "500" }}>
                    {pos.quantity}
                  </td>
                  <td style={tdRightStyle} style={{ color: "#64748b" }}>
                    ${pos.buyPrice.toFixed(2)}
                  </td>
                  <td style={tdRightStyle} style={{ color: "#64748b" }}>
                    ${pos.currentPrice.toFixed(2)}
                  </td>
                  <td
                    style={{
                      ...tdRightStyle,
                      fontWeight: "600",
                      color: pl < 0 ? "#dc2626" : "#16a34a",
                    }}
                  >
                    ${pl.toFixed(2)}
                  </td>
                  <td style={tdCenterStyle} style={{ fontWeight: "500" }}>
                    ${taxSavings.toFixed(2)}
                  </td>
                  <td style={tdCenterStyle}>
                    <button
                      onClick={() => onToggleLock(pos.ticker)}
                      style={lockButtonStyle(isLocked)}
                      onMouseEnter={(e) => {
                        if (isLocked) {
                          e.target.style.backgroundColor = "#fed7aa";
                        } else {
                          e.target.style.backgroundColor = "#e5e7eb";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isLocked) {
                          e.target.style.backgroundColor = "#fef08a";
                        } else {
                          e.target.style.backgroundColor = "#f3f4f6";
                        }
                      }}
                    >
                      {isLocked ? "🔒 Locked" : "🔓 Lock"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioTable;

