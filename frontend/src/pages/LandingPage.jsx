import { useEffect } from "react";
import { SignIn, useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.remove("auth-body");
    return () => {};
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div className="container py-5 d-flex justify-content-center">
      <SignIn />
    </div>
  );
}
