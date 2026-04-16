import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import api from "../services/api";

export default function DashboardPage() {
  const [insights, setInsights] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [styleData, setStyleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [i, t, r, l, s] = await Promise.allSettled([
        api.get("/dashboard/insights"),
        api.get("/tasks/today"),
        api.get("/rewards/summary"),
        api.get("/leaderboard?scope=weekly"),
        api.get("/style/mine"),
      ]);
      if (i.status === "fulfilled") setInsights(i.value.data || null);
      if (t.status === "fulfilled") setTasks(t.value.data?.tasks || []);
      if (r.status === "fulfilled") setRewards(r.value.data || null);
      if (l.status === "fulfilled") setLeaderboard(l.value.data?.rows || []);
      if (s.status === "fulfilled") setStyleData(s.value.data || null);
      setLoading(false);
    };
    load();
  }, []);

  const completedTasks = useMemo(() => tasks.filter((t) => t.status === "completed").length, [tasks]);

  const kpis = [
    { label: "XP", value: rewards?.wallet?.current_xp ?? 0 },
    { label: "Level", value: rewards?.wallet?.level ?? 1 },
    { label: "Streak", value: `${rewards?.streak?.current_streak ?? 0} days` },
    { label: "Mastery", value: `${insights?.mastery_score ?? 0}%` },
  ];

  return (
    <AppShell title="Dashboard" subtitle="Your black-and-white command center for daily learning.">
      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <section className="grid four">
            {kpis.map((kpi) => (
              <article key={kpi.label} className="panel kpi">
                <p>{kpi.label}</p>
                <h3>{kpi.value}</h3>
              </article>
            ))}
          </section>

          <section className="grid two">
            <article className="panel">
              <div className="panel-head">
                <h3>Today Tasks</h3>
                <Link to="/tasks" className="text-link">Open</Link>
              </div>
              <p className="muted">Completed {completedTasks} / {tasks.length}</p>
              <div className="stack">
                {tasks.slice(0, 3).map((task) => (
                  <div key={task.task_id} className="row-item">
                    <div>
                      <strong>{task.title}</strong>
                      <p className="muted small">{task.task_type} • {task.difficulty}</p>
                    </div>
                    <span className={`pill ${task.status === "completed" ? "done" : "todo"}`}>{task.status}</span>
                  </div>
                ))}
                {tasks.length === 0 && <p className="muted">No tasks generated yet.</p>}
              </div>
            </article>

            <article className="panel">
              <div className="panel-head">
                <h3>Leaderboard</h3>
                <Link to="/rewards" className="text-link">View all</Link>
              </div>
              <div className="stack">
                {leaderboard.slice(0, 5).map((row) => (
                  <div className="row-item" key={row.user_id}>
                    <span>#{row.rank} {row.name}</span>
                    <strong>{row.score}</strong>
                  </div>
                ))}
                {leaderboard.length === 0 && <p className="muted">No ranking yet.</p>}
              </div>
            </article>
          </section>

          <section className="grid two">
            <article className="panel">
              <h3>Learning Signals</h3>
              <p className="muted">Recommended topic: {insights?.recommended_topic || "No suggestion yet"}</p>
              <p className="muted">Current style: {styleData?.learning_style || "Not selected"}</p>
            </article>

            <article className="panel">
              <h3>Quick Actions</h3>
              <div className="quick-links">
                <Link to="/chat" className="solid-btn">Ask AI</Link>
                <Link to="/practice" className="outline-btn">Open Lab</Link>
                <Link to="/style" className="outline-btn">Update Style</Link>
              </div>
            </article>
          </section>
        </>
      )}
    </AppShell>
  );
}
