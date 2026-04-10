import { Show, UserButton } from "@clerk/react";

export default function ClerkAuthBar() {
  return (
    <header className="container py-2 d-flex justify-content-end gap-2">
      <Show when="signed-in">
        <UserButton />
      </Show>
    </header>
  );
}
