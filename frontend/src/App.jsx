import "./App.css";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

function App() {
  return (
    <main className="app-shell">
      <h1>Vakify.Ai</h1>
      <p>Clerk authentication is now active.</p>

      <header className="auth-actions">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button type="button">Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button type="button">Sign Up</button>
          </SignUpButton>
        </Show>

        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </main>
  );
}

export default App;
