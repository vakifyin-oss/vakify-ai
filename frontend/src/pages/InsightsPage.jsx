import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import api from "../services/api";

function extractWeakTopics(history = []) {
  const stop = new Set(["what", "how", "does", "about", "with", "from", "java", "python", "please", "explain"]);
  const map = new Map();
  history.forEach((row) => {
    const text = (row?.question || "").toLowerCase();
    text.split(/\s+/).forEach((token) => {
      const clean = token.replace(/[^a-z0-9]/g, "");
      if (!clean || clean.length < 4 || stop.has(clean)) return;
      map.set(clean, (map.get(clean) || 0) + 1);
    });
  });
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([topic, count]) => ({ topic, count }));
}

export default function InsightsPage() {
  const [insights, setInsights] = useState(null);
  const [history, setHistory] = useState([]);
  const [rewards, setRewards] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [i, h, r] = await Promise.allSettled([
        api.get("/dashboard/insights"),
        api.get("/chat/history"),
        api.get("/rewards/summary"),
      ]);
      if (i.status === "fulfilled") setInsights(i.value.data || null);
      if (h.status === "fulfilled") setHistory(h.value.data || []);
      if (r.status === "fulfilled") setRewards(r.value.data || null);
      setLoading(false);
    };
    load();
  }, []);

  const weakTopics = useMemo(() => extractWeakTopics(history), [history]);
  const lowConfidenceCount = useMemo(
    () => history.filter((h) => h?.feedback?.rating === -1).length,
    [history]
  );

  return (
    <AppShell title="Insights" subtitle="Weak topics, confidence trends, and next best actions.">
      {loading ? (
        <div className="panel">Loading insights...</div>
      ) : (
        <>
          <section className="grid three">
            <article className="panel kpi">
              <p>Weak Topics</p>
              <h3>{weakTopics.length}</h3>
            </article>
            <article className="panel kpi">
              <p>Needs-work Feedback</p>
              <h3>{lowConfidenceCount}</h3>
            </article>
            <article className="panel kpi">
              <p>Current Streak</p>
              <h3>{rewards?.streak?.current_streak ?? 0}d</h3>
            </article>
          </section>

          <section className="grid two">
            <article className="panel">
              <div className="panel-head">
                <h3>Weak Topic Radar</h3>
                <span className="pill todo">Auto inferred</span>
              </div>
              <div className="stack">
                {weakTopics.map((item) => (
                  <div key={item.topic} className="row-item">
                    <span>{item.topic}</span>
                    <strong>{item.count} mentions</strong>
                  </div>
                ))}
                {weakTopics.length === 0 && <p className="muted">No weak-topic signal yet.</p>}
              </div>
            </article>

            <article className="panel">
              <div className="panel-head">
                <h3>Next Best Actions</h3>
                <span className="pill done">AI recommended</span>
              </div>
              <div className="stack">
                <div className="row-item"><span>Retry a low-confidence query</span><strong>+10 XP</strong></div>
                <div className="row-item"><span>Complete today practical task</span><strong>+25 XP</strong></div>
                <div className="row-item"><span>Attempt weekly quiz</span><strong>+50 XP</strong></div>
                <div className="row-item"><span>Practice your weakest topic in lab</span><strong>+30 XP</strong></div>
              </div>
              <p className="muted mt">Suggested topic: {insights?.recommended_topic || "Object-oriented programming"}</p>
            </article>
          </section>
        </>
      )}
    </AppShell>
  );
}
