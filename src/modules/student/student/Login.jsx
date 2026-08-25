import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../lib/auth";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Student Login – Amit Group of Schools";
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      setShowError(true);
      return;
    }
    let user;
    try {
      user = await login(userId.trim(), password.trim());
    } catch {
      setShowError(true);
      return;
    }
    if (!user) {
      setShowError(true);
      return;
    }
    setShowError(false);
    if (remember) {
      localStorage.setItem("rememberedEmail", userId.trim());
    } else {
      localStorage.removeItem("rememberedEmail");
    }
    navigate("/student/dashboard");
  }

  return (
    <div style={styles.body}>
      <div style={styles.header}>
        <div style={styles.logo}>🎓</div>
        <div style={{ marginLeft: 20 }}>
          <h1 style={{ fontSize: 34 }}>Amit Group of Schools</h1>
          <p style={{ marginTop: 5, color: "#ddd" }}>Late Amit Nakhate Shikshan Sanstha</p>
        </div>
      </div>

      <div style={styles.tagline}>SCHOOL MANAGEMENT SYSTEM</div>

      <div style={styles.container}>
        <div style={styles.loginBox}>
          <div style={styles.loginIcon}><i className="bi bi-person-lock"></i></div>
          <div>
            <h2 style={{ marginBottom: 5 }}>STUDENT LOGIN</h2>
            <p style={{ color: "#ddd", fontSize: 14 }}>Welcome Back ✨🎉</p>
          </div>
        </div>

        <div style={styles.formBox}>
          <div style={styles.instructions}>Enter your User ID and Password to continue.</div>

          {showError && (
            <div style={styles.errorMsg}>
              <i className="bi bi-exclamation-circle"></i> Please enter both your User ID and password.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={styles.label}><i className="bi bi-person" style={{ color: "#5c0f14" }}></i> User ID *</label>
            <input
              type="text"
              style={styles.input}
              placeholder="Enter your User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />

            <label style={styles.label}><i className="bi bi-lock" style={{ color: "#5c0f14" }}></i> Password *</label>
            <input
              type="password"
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div style={styles.rememberRow}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: "normal" }}>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ width: "auto" }} />
                Remember Me
              </label>
              <a href="#" style={styles.forgotLink}>Forgot Password?</a>
            </div>

            <button type="submit" style={styles.loginBtn}>
              <i className="bi bi-box-arrow-in-right"></i> Login
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            New Applicant? <a href="#" style={styles.link}>Register Here</a>
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        © 2012 Amit Group of Schools | Email - amitconvent@gmail.com | Contact - +91 71229 98728, +91 87668 92284 | Privacy Policy
      </footer>
    </div>
  );
}

const styles = {
  body: { background: "#f4f4f4", fontFamily: "Arial, sans-serif", minHeight: "100vh" },
  header: { background: "#4d0011", color: "white", padding: "20px 40px", display: "flex", alignItems: "center" },
  logo: { width: 70, height: 70, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 },
  tagline: { background: "#7a0019", color: "white", textAlign: "center", padding: 10, borderTop: "3px solid gold", fontSize: 13, fontWeight: "bold", letterSpacing: 1 },
  container: { width: 450, margin: "50px auto" },
  loginBox: { background: "#4d0011", color: "white", padding: 25, borderRadius: "10px 10px 0 0", display: "flex", alignItems: "center" },
  loginIcon: { fontSize: 28, background: "#f9eaed", color: "#5c0f14", padding: 12, borderRadius: 8, marginRight: 15 },
  formBox: { background: "white", padding: 30, borderRadius: "0 0 10px 10px", boxShadow: "0 3px 15px rgba(0,0,0,0.15)" },
  instructions: { background: "#f9eaed", borderLeft: "4px solid #5c0f14", padding: 12, marginBottom: 25, color: "#333" },
  errorMsg: { background: "#f9e2e2", color: "#a10000", borderLeft: "4px solid #a10000", padding: "10px 12px", marginBottom: 18, fontSize: 13, borderRadius: 4 },
  label: { fontWeight: "bold", display: "block", marginBottom: 8, color: "#333" },
  input: { width: "100%", padding: 12, border: "1px solid #ccc", borderRadius: 5, marginBottom: 18, fontSize: 14 },
  rememberRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  forgotLink: { color: "#5c0f14", textDecoration: "none", fontWeight: "bold", fontSize: 14 },
  loginBtn: { width: "100%", background: "#5c0f14", color: "white", padding: 14, border: "none", borderRadius: 5, fontSize: 16, fontWeight: "bold", cursor: "pointer" },
  link: { color: "#5c0f14", textDecoration: "none", fontWeight: "bold" },
  footer: { background: "#5c0f14", color: "#f5c542", textAlign: "center", padding: 15, marginTop: 50, fontSize: 14 }
};