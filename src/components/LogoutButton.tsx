import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../lib/auth";

export default function LogoutButton() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  if (!user || location.pathname === "/login" || location.pathname === "/") {
    return null;
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <button
      onClick={handleLogout}
      title={`Logged in as ${user.label} — click to logout`}
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        zIndex: 99999,
        background: "#111827",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: "6px 14px",
        fontSize: 13,
        fontFamily: "system-ui, -apple-system, sans-serif",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        opacity: 0.88,
      }}
    >
      ⏻ Logout ({user.label})
    </button>
  );
}
