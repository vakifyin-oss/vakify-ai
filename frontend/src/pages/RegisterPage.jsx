import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ParticlesBackdrop from "../components/ParticlesBackdrop";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.add("auth-body");
    return () => document.body.classList.remove("auth-body");
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/user-login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="auth-shell auth-shell-v3">
      <ParticlesBackdrop className="auth-particles" />
      <div className="auth-aurora" aria-hidden="true" />
      <div className="auth-noise" aria-hidden="true" />
      <div className="auth-grid">
        <section className="auth-panel">
          <p className="page-kicker text-white-50 mb-2">Get Started</p>
          <h2 className="mb-2">Create Your Adaptive Workspace</h2>
          <p className="mb-0 text-white-50">
            Register once and get a learning path customized to your cognitive style and live progress.
          </p>
          <div className="auth-list">
            <div>Secure JWT authentication with hashed passwords</div>
            <div>AI-driven style assessment and personalization</div>
            <div>Chat + task + downloads synced in one account</div>
          </div>
        </section>

        <section className="glass-card auth-form auth-form-v2">
          <div className="auth-form-head">
            <div className="auth-form-mark">AL</div>
            <div>
              <h3 className="mb-1">Create Account</h3>
              <p className="text-muted mb-0">Start your adaptive learning setup.</p>
            </div>
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={submit} className="d-grid gap-3 mt-3">
            <label className="auth-field">
              <span>Full name</span>
              <input className="form-control" placeholder="Ravi Kumar" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="auth-field">
              <span>Email</span>
              <input className="form-control" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label className="auth-field">
              <span>Password</span>
              <input type="password" className="form-control" placeholder="Create a password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </label>
            <button className="btn brand-btn">Create account</button>
          </form>
          <div className="auth-actions mt-3">
            <div className="auth-actions-top">
              <p className="auth-actions-title mb-0">Already have an account?</p>
              <small className="text-muted">Jump back to login</small>
            </div>
            <div className="auth-links-row auth-links-row-v2 mt-2">
              <Link to="/user-login" className="auth-link-pill auth-link-primary">User Login</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
