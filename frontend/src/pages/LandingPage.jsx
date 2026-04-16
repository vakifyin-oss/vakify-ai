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
      <div className="auth-hero">
        <h1>Vakify.Ai</h1>
        <p>Learn, practice, compete, and improve every day with an AI-first workflow.</p>
      </div>
      <div className="auth-card">
        <SignIn />
      </div>
    </div>
  );
}
