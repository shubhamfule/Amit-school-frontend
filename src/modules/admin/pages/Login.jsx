import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your email and password.');
      return;
    }
    const user = login(email, password);
    if (!user) {
      setError('Invalid username or password.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
       setLoading(false);
      navigate(user.basePath);
    }, 500);
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-logo"><i className="ti ti-school"></i></div>
        <div className="login-header-text">
          <h1>Amit Group of Schools</h1>
          <p>Late Amit Nakhate Shikshan Sanstha</p>
        </div>
      </header>

      <div className="login-tagline"> AMIT SCHOOL MANAGEMENT SYSTEM</div>

      <div className="login-wrap">
        <div className="login-container">
          <div className="login-box">
            <div className="login-icon"><i className="ti ti-lock-access"></i></div>
            <div className="login-content">
              <h2>Login</h2>
              <p>Secure access for registered users</p>
            </div>
          </div>

          <div className="login-form-box">
            <div className="login-instructions">
              Enter your registered email ID and password to continue.
            </div>

            {error && (
              <div className="login-error"><i className="ti ti-alert-circle"></i>{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <label htmlFor="login-email"><i className="ti ti-mail"></i>Email ID *</label>
              <input
                id="login-email" type="text" placeholder="Enter your registered email"
                value={email} onChange={(e) => setEmail(e.target.value)} required
              />

              <label htmlFor="login-password"><i className="ti ti-lock"></i>Password *</label>
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
                <i className="ti ti-login-2"></i>{loading ? 'Signing in…' : 'Login'}
              </button>
            </form>

            <div className="login-links">
              New applicant? <a href="#" onClick={(e) => e.preventDefault()}>Register here</a>
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
