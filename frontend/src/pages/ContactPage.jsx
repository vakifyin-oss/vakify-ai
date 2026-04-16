import { useState } from "react";
import AppShell from "../components/AppShell";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AppShell title="Contact" subtitle="Share feedback, feature requests, or support issues.">
      <section className="panel" style={{ maxWidth: 760 }}>
        {submitted ? (
          <div>
            <h3>Thanks, message received.</h3>
            <p className="muted">For production, connect this form to your backend ticketing or email API.</p>
          </div>
        ) : (
          <form className="stack" onSubmit={submit}>
            <label>
              Full Name
              <input className="bw-input" type="text" required />
            </label>
            <label>
              Email
              <input className="bw-input" type="email" required />
            </label>
            <label>
              Message
              <textarea className="bw-input" rows={6} required />
            </label>
            <button className="solid-btn" type="submit">Send</button>
          </form>
        )}
      </section>
    </AppShell>
  );
}
