import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ParticlesBackdrop from "../components/ParticlesBackdrop";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.add("auth-body");
    return () => document.body.classList.remove("auth-body");
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password, "admin");
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || "Admin login failed");
    }
  };

  return (
    <div className="auth-shell auth-shell-v3">
      <ParticlesBackdrop className="auth-particles" />
      <div className="auth-aurora" aria-hidden="true" />
      <div className="auth-noise" aria-hidden="true" />
      <div className="auth-grid">
        <section className="auth-panel">
          <p className="page-kicker text-white-50 mb-2">Administrator Access</p>
          <h2 className="mb-2">Admin Control Login</h2>
          <p className="mb-0 text-white-50">
            Secure admin zone for monitoring users, chats, downloads, and platform activity.
          </p>
          <div className="auth-list">
            <div>Platform metrics and health overview</div>
            <div>User management controls</div>
            <div>Role-based protected route</div>
          </div>
        </section>

        <section className="glass-card auth-form auth-form-v2">
          <div className="auth-form-head">
            <img className="auth-form-logo" src="/vakify-logo.svg" alt="Vakify logo" />
            <div>
              <h3 className="mb-1">Admin Login</h3>
              <p className="text-muted mb-0">Only emails in ADMIN_EMAILS are allowed.</p>
            </div>
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={submit} className="d-grid gap-3 mt-3">
            <label className="auth-field">
              <span>Admin email</span>
              <input className="form-control" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="auth-field">
              <span>Password</span>
              <input type="password" className="form-control" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button className="btn brand-btn">Login as Admin</button>
          </form>
          <div className="auth-actions mt-3">
            <div className="auth-actions-top">
              <p className="auth-actions-title mb-0">Need a learner account?</p>
              <small className="text-muted">Switch back to user login</small>
            </div>
            <div className="auth-links-row auth-links-row-v2 mt-2">
              <Link to="/login" className="auth-link-pill auth-link-primary">User Login</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
