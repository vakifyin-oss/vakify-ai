import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import api from "../services/api";

const OPTIONS = [
  { key: "visual", label: "Visual", desc: "Diagrams, structure, and visual understanding." },
  { key: "auditory", label: "Auditory", desc: "Voice-led explanations and spoken memory." },
  { key: "kinesthetic", label: "Kinesthetic", desc: "Hands-on coding and active problem solving." },
];

export default function LearningStylePage() {
  const [style, setStyle] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const res = await api.get("/style/mine");
    setStyle(res.data?.learning_style || null);
  };

  useEffect(() => {
    load();
  }, []);

  const choose = async (nextStyle) => {
    setSaving(true);
    setMessage("");
    await api.post("/style/select", { learning_style: nextStyle });
    setStyle(nextStyle);
    setMessage("Learning style updated.");
    setSaving(false);
  };

  return (
    <AppShell title="Learning Style" subtitle="Set your preferred learning mode. You can change it anytime.">
      {message && <div className="panel notice">{message}</div>}
      <section className="grid three">
        {OPTIONS.map((opt) => (
          <article key={opt.key} className={`panel style-card ${style === opt.key ? "active" : ""}`}>
            <h3>{opt.label}</h3>
            <p className="muted">{opt.desc}</p>
            <button className={style === opt.key ? "outline-btn" : "solid-btn"} onClick={() => choose(opt.key)} disabled={saving} type="button">
              {style === opt.key ? "Selected" : "Select"}
            </button>
          </article>
        ))}
      </section>
      <section className="panel">
        <h3>Why this matters</h3>
        <p className="muted">Chat response formatting and lab access adapt from this selection. Kinesthetic unlocks the coding lab runner.</p>
      </section>
    </AppShell>
  );
}
