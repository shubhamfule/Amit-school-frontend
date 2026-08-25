import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("studentaccountant@amitschool.edu");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (!user) {
        setError("Invalid email or password.");
        return;
      }
      sessionStorage.setItem("accountantAuthenticated", "true");
      navigate("/student-accountant", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-logo"><i className="bi bi-bank"></i></div>
        <div className="login-header-text">
          <h1>Amit Group of Schools</h1>
          <p>Late Amit Nakhate Shikshan Sanstha</p>
        </div>
      </header>

      <div className="login-tagline">STUDENT ACCOUNTANT PORTAL</div>

      <div className="login-wrap">
        <div className="login-container">
          <div className="login-box">
            <div className="login-icon"><i className="bi bi-lock"></i></div>
            <div className="login-content">
              <h2>Accountant Login</h2>
              <p>Secure access for registered users</p>
            </div>
          </div>

          <div className="login-form-box">
            <div className="login-instructions">
              Enter your registered email ID and password to continue.
            </div>

            {error && (
              <div className="login-error"><i className="bi bi-exclamation-circle"></i>{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <label htmlFor="login-email"><i className="bi bi-envelope"></i>Email ID *</label>
              <input
                id="login-email" type="email" placeholder="Enter your registered email"
                value={email} onChange={(e) => setEmail(e.target.value)} required
              />

              <label htmlFor="login-password"><i className="bi bi-lock"></i>Password *</label>
              <input
                id="login-password" type="password" placeholder="Enter your password"
                value={password} onChange={(e) => setPassword(e.target.value)} required
              />

              <div className="login-remember-row">
                <label className="login-remember">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  Remember me
                </label>
                <a href="#" className="login-forgot" onClick={(e) => e.preventDefault()}>Forgot password?</a>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                <i className="bi bi-box-arrow-in-right"></i>{loading ? "Signing in…" : "Login"}
              </button>
            </form>

            <div className="login-links">
              Demo access · your existing dashboard data is preserved.
            </div>
          </div>
        </div>
      </div>

      <footer className="login-footer">
        © 2026 Amit Group of Schools · admin@amitschool.edu · +91 71229 98728, +91 87668 92284 · Privacy Policy
      </footer>
    </div>
  );
}
