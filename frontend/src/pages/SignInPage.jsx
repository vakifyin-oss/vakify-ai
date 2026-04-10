import { SignIn } from "@clerk/react";

export default function SignInPage() {
  return (
    <div className="auth-shell d-flex align-items-center justify-content-center">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/dashboard" />
    </div>
  );
}
