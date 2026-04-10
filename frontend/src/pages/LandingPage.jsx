import { useEffect } from "react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
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
          <p className="page-kicker text-white-50 mb-2">Vakify.Ai</p>
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
            <img className="auth-form-logo" src="/vakify-logo.svg" alt="Vakify logo" />
            <div>
              <h3 className="mb-1">Start Learning Smarter</h3>
              <p className="text-muted mb-0">Sign in with Clerk to continue.</p>
            </div>
          </div>
          <div className="d-grid gap-2">
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <button className="btn brand-btn" type="button">Create Account</button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="btn surface-btn" type="button">Sign In</button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <div className="d-flex justify-content-between align-items-center p-2 border rounded-3">
                <span className="text-muted small">Signed in</span>
                <UserButton />
              </div>
            </Show>
          </div>
        </section>
      </div>
    </div>
  );
}
