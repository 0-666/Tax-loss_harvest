import { useEffect } from "react";

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast?.message) return;

    const timer = setTimeout(onClose, 3200);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const toastTypeStyles = {
    success: {
      backgroundColor: "#d1fae5",
      borderColor: "#10b981",
      color: "#047857",
    },
    error: {
      backgroundColor: "#fee2e2",
      borderColor: "#ef4444",
      color: "#dc2626",
    },
    info: {
      backgroundColor: "#dbeafe",
      borderColor: "#3b82f6",
      color: "#1e40af",
    },
  };

  const type = toast.type || "info";
  const typeColors = toastTypeStyles[type] || toastTypeStyles.info;

  const toastStyle = {
    position: "fixed",
    bottom: "1.5rem",
    right: "1.5rem",
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
    backgroundColor: typeColors.backgroundColor,
    border: `2px solid ${typeColors.borderColor}`,
    borderRadius: "8px",
    padding: "1rem",
    maxWidth: "400px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: 9999,
    animation: "slideIn 0.3s ease-in-out",
  };

  const textContainerStyle = {
    flex: 1,
  };

  const titleStyle = {
    fontSize: "14px",
    fontWeight: "700",
    color: typeColors.color,
    margin: 0,
    marginBottom: "0.25rem",
  };

  const messageStyle = {
    fontSize: "14px",
    color: typeColors.color,
    margin: 0,
  };

  const closeButtonStyle = {
    background: "none",
    border: "none",
    fontSize: "24px",
    fontWeight: "300",
    color: typeColors.color,
    cursor: "pointer",
    padding: "0",
    minWidth: "24px",
    minHeight: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.2s ease",
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      <div style={toastStyle}>
        <div style={textContainerStyle}>
          <strong style={titleStyle}>{toast.title}</strong>
          <p style={messageStyle}>{toast.message}</p>
        </div>
        <button
          style={closeButtonStyle}
          onClick={onClose}
          onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
          aria-label="Close toast"
        >
          ×
        </button>
      </div>
    </>
  );
};

export default Toast;

