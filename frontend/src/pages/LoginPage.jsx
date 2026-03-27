import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import ParticlesBackdrop from "../components/ParticlesBackdrop";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.add("auth-body");
    return () => document.body.classList.remove("auth-body");
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password, "user");
      const style = await api.get("/style/mine");
      navigate(style.data.learning_style ? "/dashboard" : "/style");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="auth-shell auth-shell-v3">
      <ParticlesBackdrop className="auth-particles" />
      <div className="auth-aurora" aria-hidden="true" />
      <div className="auth-noise" aria-hidden="true" />
      <div className="auth-grid">
        <section className="auth-panel">
          <p className="page-kicker text-white-50 mb-2">Vakify.Ai</p>
          <h2 className="mb-2">Learn Your Way</h2>
          <p className="mb-0 text-white-50">
            Personalized chatbot, learning-style detection, and synced Java practice in one workflow.
          </p>
          <div className="auth-list">
            <div>Adaptive responses for Visual, Auditory, Kinesthetic</div>
            <div>Topic-based practice lab linked from chat</div>
            <div>Auto-generated downloadable learning resources</div>
          </div>
        </section>

        <section className="glass-card auth-form auth-form-v2">
          <div className="auth-form-head">
            <div className="auth-form-mark">AL</div>
            <div>
              <h3 className="mb-1">User Login</h3>
              <p className="text-muted mb-0">Sign in to continue your adaptive learning journey.</p>
            </div>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={submit} className="d-grid gap-3 mt-3">
            <label className="auth-field">
              <span>Email</span>
              <input
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="auth-pass-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-pass-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <button className="btn brand-btn" disabled={!email.trim() || password.length < 1}>
              Login
            </button>
          </form>

          <div className="auth-actions mt-3">
            <div className="auth-actions-top">
              <p className="auth-actions-title mb-0">Next steps</p>
              <small className="text-muted">Create an account or recover access</small>
            </div>
            <div className="auth-links-row auth-links-row-v2 mt-2">
              <Link to="/register" className="auth-link-pill auth-link-primary">Create account</Link>
              <Link to="/reset-password" className="auth-link-pill">Forgot password</Link>
              <Link to="/admin-login" className="auth-link-pill">Admin login</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
