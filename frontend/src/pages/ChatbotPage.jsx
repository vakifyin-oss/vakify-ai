import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import api from "../services/api";

const PRESETS = [
  "Explain recursion in the simplest way",
  "Give me a Java interview question",
  "Create revision notes for OOP",
  "Generate one coding challenge for today",
];
const RESPONSE_TABS = ["Explain", "Diagram", "Code", "Practice", "Quiz"];
const CHAT_MODES = [
  { value: "concise", label: "Concise" },
  { value: "detailed", label: "Detailed" },
  { value: "eli5", label: "ELI5" },
  { value: "exam", label: "Exam Mode" },
];

export default function ChatbotPage() {
  const [history, setHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [style, setStyle] = useState("visual");
  const [chatMode, setChatMode] = useState("detailed");
  const [activeTabByChat, setActiveTabByChat] = useState({});

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
      const promptByMode = {
        concise: `${clean}\n\nRespond in concise mode with short bullets.`,
        detailed: `${clean}\n\nRespond in detailed learning mode with clear sections.`,
        eli5: `${clean}\n\nExplain like I am 5 with simple examples.`,
        exam: `${clean}\n\nRespond in exam mode: concept, key points, likely questions.`,
      };
      await api.post("/chat/", {
        question: promptByMode[chatMode] || clean,
        style_override: style,
      });
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

  const getConfidenceBand = (item) => {
    if (item.feedback?.rating === 1) return "High";
    if (item.feedback?.rating === -1) return "Low";
    if ((item.response || "").length > 900) return "High";
    if ((item.response || "").length > 450) return "Medium";
    return "Medium";
  };

  const getTabContent = (item, tab) => {
    const response = item.response || "";
    const words = response.split(" ").slice(0, 14).join(" ");
    if (tab === "Explain") return response;
    if (tab === "Diagram") return `Flow: Query -> Intent -> RAG -> LLM -> Validate -> Score\nFocus: ${words}...`;
    if (tab === "Code") return `Pseudo implementation:\n1) Parse prompt\n2) Retrieve context\n3) Generate answer\n4) Validate response\n5) Return confidence band`;
    if (tab === "Practice") return `Practice task:\n- Build one small implementation for: ${item.question}\n- Add 2 test cases\n- Explain output.`;
    return `Quick quiz:\n1) Define the concept in one line.\n2) Give one real-world example.\n3) Mention one common mistake.`;
  };

  return (
    <AppShell title="AI Chat" subtitle="Chat-first learning interface with feedback loop.">
      <section className="panel">
        <div className="chat-toolbar">
          <div className="grid two">
            <select className="bw-input" value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="visual">Visual</option>
              <option value="auditory">Auditory</option>
              <option value="kinesthetic">Kinesthetic</option>
            </select>
            <select className="bw-input" value={chatMode} onChange={(e) => setChatMode(e.target.value)}>
              {CHAT_MODES.map((mode) => (
                <option key={mode.value} value={mode.value}>{mode.label}</option>
              ))}
            </select>
          </div>
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
                <div className="meta-row">
                  <p className="meta">Vakify AI • {item.response_type}</p>
                  <span className={`pill ${getConfidenceBand(item) === "High" ? "done" : "todo"}`}>
                    {getConfidenceBand(item)} confidence
                  </span>
                </div>
                <div className="tab-row">
                  {RESPONSE_TABS.map((tab) => (
                    <button
                      key={`${item.chat_id}-${tab}`}
                      className={`mini-btn ${((activeTabByChat[item.chat_id] || "Explain") === tab) ? "active" : ""}`}
                      onClick={() => setActiveTabByChat((prev) => ({ ...prev, [item.chat_id]: tab }))}
                      type="button"
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <p>{getTabContent(item, activeTabByChat[item.chat_id] || "Explain")}</p>
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
