import { Link } from "react-router-dom";

export default function Logout() {
  return (
    <div style={{ margin: 0, fontFamily: "Arial", background: "#e8def8", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ background: "white", padding: 40, borderRadius: 20, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)", textAlign: "center", width: 450 }}>
        <div style={{ fontSize: 70, marginBottom: 15 }}>👋</div>
        <h1 style={{ color: "maroon", marginBottom: 10 }}>Logged Out Successfully</h1>
        <p style={{ fontSize: 18, color: "#555", marginBottom: 25 }}>
          Thank you for using the Student Portal. You have been logged out successfully.
        </p>
        <Link
          to="/student/login"
          style={{ background: "maroon", color: "white", padding: "12px 25px", borderRadius: 8, fontSize: 16, textDecoration: "none", display: "inline-block" }}
        >
          Go to Login Page
        </Link>
      </div>
    </div>
  );
}
