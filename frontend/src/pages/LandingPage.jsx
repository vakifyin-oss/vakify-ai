import { useEffect } from "react";
import { Link } from "react-router-dom";
import ParticlesBackdrop from "../components/ParticlesBackdrop";

export default function LandingPage() {
  useEffect(() => {
    document.body.classList.add("auth-body");
    return () => document.body.classList.remove("auth-body");
  }, []);

  return (
    <div className="auth-shell auth-shell-v3">
      <ParticlesBackdrop className="auth-particles" />
      <div className="auth-aurora" aria-hidden="true" />
      <div className="auth-noise" aria-hidden="true" />
      <div className="auth-grid">
        <section className="auth-panel">
          <p className="page-kicker text-white-50 mb-2">Adaptive AI Learning Platform</p>
          <h1 className="mb-2">One Platform. Three Learning Styles. Infinite Progress.</h1>
          <p className="mb-3 text-white-50">
            Analyze learner style, explain concepts with AI, assign synced tasks, and track outcomes in one workspace.
          </p>
          <div className="auth-list">
            <div>Psychological style test and direct selection</div>
            <div>Style-adaptive chatbot with downloadable assets</div>
            <div>Topic-linked Java practice lab with activity tracking</div>
          </div>
        </section>

        <section className="glass-card auth-form auth-form-v2">
          <div className="auth-form-head">
            <div className="auth-form-mark">AL</div>
            <div>
              <h3 className="mb-1">Start Learning Smarter</h3>
              <p className="text-muted mb-0">Choose separate login by role.</p>
            </div>
          </div>
          <div className="d-grid gap-2">
            <Link to="/register" className="btn brand-btn">Create Account</Link>
            <Link to="/user-login" className="btn surface-btn">User Login</Link>
            <Link to="/admin-login" className="btn surface-btn">Admin Login</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
