import { useEffect } from "react";
import { SignIn, useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div className="auth-wrap auth-v2">
      <div className="auth-shell-v2">
        <header className="auth-top-v2">
          <div className="auth-brand-v2">
            <img src="/vakify-logo.svg" alt="Vakify logo" />
            <div>
              <strong>Vakify 2.0</strong>
              <small>Adaptive AI learning OS</small>
            </div>
          </div>
          <div className="auth-pill-v2">Secure auth • Cloud ready • Admin ready</div>
        </header>

        <section className="auth-main-v2">
          <div className="auth-left-v2">
            <div className="auth-mini-pill-v2">Visual • Audio • Kinesthetic learning</div>
            <h1>Vakify</h1>
            <p>
              A complete UX foundation for AI chat, multi-language labs, daily tasks, weekly quizzes,
              rewards, leaderboards, and secure admin control.
            </p>
            <div className="auth-style-cards-v2">
              <div>Visual</div>
              <div>Audio</div>
              <div>Kinetic</div>
            </div>
          </div>

          <div className="auth-right-v2">
            <div className="auth-gateway-v2">
              <h3>Login gateway</h3>
              <p>One learner experience with secure cloud authentication.</p>
              <ul>
                <li>Auto profile on signup</li>
                <li>Google + email authentication</li>
                <li>Secure role-ready backend</li>
              </ul>
            </div>
            <div className="auth-card auth-card-pro auth-card-v2">
              <SignIn />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
