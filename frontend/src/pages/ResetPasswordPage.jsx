import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ParticlesBackdrop from "../components/ParticlesBackdrop";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.body.classList.add("auth-body");
    return () => document.body.classList.remove("auth-body");
  }, []);

  const requestToken = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setGeneratedToken("");
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message || "Reset token generated.");
      if (res.data.reset_token) setGeneratedToken(res.data.reset_token);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate reset token.");
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        new_password: newPassword,
      });
      setMessage(res.data.message || "Password reset successful.");
      setToken("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password.");
    }
  };

  return (
    <div className="auth-shell auth-shell-v3">
      <ParticlesBackdrop className="auth-particles" />
      <div className="auth-aurora" aria-hidden="true" />
      <div className="auth-noise" aria-hidden="true" />
      <div className="auth-grid">
        <section className="auth-panel">
          <p className="page-kicker text-white-50 mb-2">Account Recovery</p>
          <h2 className="mb-2">Reset Access Securely</h2>
          <p className="mb-0 text-white-50">
            Generate a token and set a new password to continue your adaptive learning journey.
          </p>
        </section>

        <section className="glass-card auth-form auth-form-v2">
          <div className="auth-form-head">
            <img className="auth-form-logo" src="/vakify-logo.svg" alt="Vakify logo" />
            <div>
              <h3 className="mb-1">Forgot Password</h3>
              <p className="text-muted mb-0">Generate a reset token in seconds.</p>
            </div>
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          {message && <div className="alert alert-success py-2">{message}</div>}
          <form onSubmit={requestToken} className="d-grid gap-3 mt-3 mb-3">
            <label className="auth-field">
              <span>Registered email</span>
              <input
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button className="btn surface-btn">Generate Reset Token</button>
          </form>
          {generatedToken && (
            <div className="alert alert-warning py-2 mt-1 mb-3">
              Demo reset token: <code>{generatedToken}</code>
            </div>
          )}

          <h3 className="mb-2 mt-4">Reset Password</h3>
          <form onSubmit={resetPassword} className="d-grid gap-3">
            <label className="auth-field">
              <span>Reset token</span>
              <input
                className="form-control"
                placeholder="Paste token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </label>
            <label className="auth-field">
              <span>New password</span>
              <input
                type="password"
                className="form-control"
                placeholder="Create a new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <button className="btn brand-btn">Reset Password</button>
          </form>
          <div className="auth-actions mt-3">
            <div className="auth-actions-top">
              <p className="auth-actions-title mb-0">Back to login</p>
              <small className="text-muted">Return to your account</small>
            </div>
            <div className="auth-links-row auth-links-row-v2 mt-2">
              <Link to="/login" className="auth-link-pill auth-link-primary">Login</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
