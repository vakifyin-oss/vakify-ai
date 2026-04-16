import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import api from "../services/api";

const PRESETS = [
  "Explain recursion in the simplest way",
  "Give me a Java interview question",
  "Create revision notes for OOP",
  "Generate one coding challenge for today",
];

export default function ChatbotPage() {
  const [history, setHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [style, setStyle] = useState("visual");

  const load = async () => {
    const [h, s] = await Promise.allSettled([api.get("/chat/history"), api.get("/style/mine")]);
    if (h.status === "fulfilled") setHistory(h.value.data || []);
    if (s.status === "fulfilled" && s.value.data?.learning_style) setStyle(s.value.data.learning_style);
  };

  useEffect(() => {
    load();
  }, []);

  const conversation = useMemo(() => history.slice().reverse(), [history]);

  const ask = async (text = question) => {
    const clean = text.trim();
    if (!clean || loading) return;

    setLoading(true);
    setError("");
    try {
      await api.post("/chat/", { question: clean, style_override: style });
      setQuestion("");
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to get AI response.");
    } finally {
      setLoading(false);
    }
  };

  const sendFeedback = async (chatId, rating) => {
    try {
      await api.post("/chat/feedback", { chat_id: chatId, rating });
      await load();
    } catch {
      // intentionally silent for quick UX
    }
  };

  return (
    <AppShell title="AI Chat" subtitle="Chat-first learning interface with feedback loop.">
      <section className="panel">
        <div className="chat-toolbar">
          <select className="bw-input" value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="visual">Visual</option>
            <option value="auditory">Auditory</option>
            <option value="kinesthetic">Kinesthetic</option>
          </select>
          <div className="preset-wrap">
            {PRESETS.map((p) => (
              <button key={p} className="mini-btn" onClick={() => ask(p)} type="button">{p}</button>
            ))}
          </div>
        </div>

        <div className="chat-box">
          {conversation.map((item) => (
            <article key={item.chat_id} className="chat-item">
              <div className="bubble user">
                <p className="meta">You</p>
                <p>{item.question}</p>
              </div>
              <div className="bubble ai">
                <p className="meta">Vakify AI • {item.response_type}</p>
                <p>{item.response}</p>
                <div className="feedback-row">
                  <button className={`mini-btn ${item.feedback?.rating === 1 ? "active" : ""}`} onClick={() => sendFeedback(item.chat_id, 1)} type="button">Helpful</button>
                  <button className={`mini-btn ${item.feedback?.rating === -1 ? "active" : ""}`} onClick={() => sendFeedback(item.chat_id, -1)} type="button">Needs Work</button>
                </div>
              </div>
            </article>
          ))}
          {conversation.length === 0 && <p className="muted">Start by asking your first question.</p>}
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="composer">
          <textarea
            className="bw-input"
            rows={3}
            placeholder="Ask anything..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button className="solid-btn" onClick={() => ask()} disabled={loading} type="button">
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </section>
    </AppShell>
  );
}
