import { SignUp } from "@clerk/react";

export default function SignUpPage() {
  return (
    <div className="auth-shell d-flex align-items-center justify-content-center">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/dashboard" />
    </div>
  );
}
