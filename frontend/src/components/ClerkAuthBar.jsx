import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

export default function ClerkAuthBar() {
  return (
    <header className="container py-2 d-flex justify-content-end gap-2">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="btn btn-sm surface-btn" type="button">Sign in</button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="btn btn-sm brand-btn" type="button">Sign up</button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </header>
  );
}
