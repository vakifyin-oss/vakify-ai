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
    <div className="auth-wrap">
      <div className="auth-hero auth-hero-pro">
        <p className="auth-kicker">Production Login</p>
        <h1>Vakify.Ai</h1>
        <p>Secure sign-in for your adaptive learning workspace. Built for desktop and mobile.</p>
        <div className="auth-chips">
          <span>AI Chat</span>
          <span>Daily Tasks</span>
          <span>Weekly Quiz</span>
          <span>Leaderboard</span>
        </div>
      </div>
      <div className="auth-card auth-card-pro">
        <SignIn />
      </div>
    </div>
  );
}
