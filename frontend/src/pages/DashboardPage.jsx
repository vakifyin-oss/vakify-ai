import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import api from "../services/api";

const DUMMY_LEADERBOARD = [
  { rank: 1, name: "Aarav Sharma", score: 1240 },
  { rank: 2, name: "Meera Patel", score: 1165 },
  { rank: 3, name: "Vihaan Singh", score: 1098 },
  { rank: 4, name: "Ishita Nair", score: 1030 },
  { rank: 5, name: "Kabir Jain", score: 995 },
];

function toSeries(items = []) {
  return items.map((d) => Number(d?.count || 0));
}

function maxIn(...arrs) {
  const values = arrs.flat().map((x) => Number(x || 0));
  return Math.max(1, ...values);
}

function toSparkPath(values, width = 320, height = 110) {
  if (!values.length) return "";
  const max = Math.max(1, ...values);
  const stepX = values.length > 1 ? width / (values.length - 1) : width;
  return values
    .map((v, i) => {
      const x = i * stepX;
      const y = height - (v / max) * (height - 8) - 4;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function DashboardPage() {
  const [insights, setInsights] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardMe, setLeaderboardMe] = useState(null);
  const [styleData, setStyleData] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [quizStats, setQuizStats] = useState({ attempts: 0, best_score: 0 });
  const [quickQueries, setQuickQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);

    const [i, t, r, l, s, q, sugg] = await Promise.allSettled([
      api.get("/dashboard/insights"),
      api.get("/tasks/today"),
      api.get("/rewards/summary"),
      api.get("/leaderboard?scope=weekly"),
      api.get("/style/mine"),
      api.get("/quiz/weekly"),
      api.get("/chat/suggestions", { params: { topic: "data structures" } }),
    ]);

    if (i.status === "fulfilled") setInsights(i.value.data || null);
    if (t.status === "fulfilled") setTasks(t.value.data?.tasks || []);
    if (r.status === "fulfilled") setRewards(r.value.data || null);
    if (l.status === "fulfilled") {
      setLeaderboard(l.value.data?.rows || []);
      setLeaderboardMe(l.value.data?.me || null);
    }
    if (s.status === "fulfilled") setStyleData(s.value.data || null);
    if (q.status === "fulfilled") {
      setQuiz(q.value.data?.quiz || null);
      setQuizStats({
        attempts: q.value.data?.attempts || 0,
        best_score: q.value.data?.best_score || 0,
      });
    }
    if (sugg.status === "fulfilled") {
      setQuickQueries((sugg.value.data?.prompts || []).slice(0, 6));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const completedTasks = useMemo(() => tasks.filter((t) => t.status === "completed").length, [tasks]);
  const pendingTasks = useMemo(() => tasks.filter((t) => t.status !== "completed").length, [tasks]);
  const leaderboardRows = (leaderboard || []).length ? leaderboard.slice(0, 5) : DUMMY_LEADERBOARD;

  const dailyChat = toSeries(insights?.daily_chat || []);
  const dailyPractice = toSeries(insights?.daily_practice || []);
  const dailyDownloads = toSeries(insights?.daily_downloads || []);
  const activityMax = maxIn(dailyChat, dailyPractice, dailyDownloads);
  const chartBars = dailyChat.map((_, i) => ({
    chat: dailyChat[i] || 0,
    practice: dailyPractice[i] || 0,
    downloads: dailyDownloads[i] || 0,
  }));

  const styleScores = [
    { label: "Visual", value: styleData?.visual_score || 0 },
    { label: "Auditory", value: styleData?.auditory_score || 0 },
    { label: "Kinesthetic", value: styleData?.kinesthetic_score || 0 },
  ];
  const styleMax = Math.max(1, ...styleScores.map((s) => s.value));

  const sparkValues = [
    ...(dailyChat || []),
    ...(dailyPractice || []),
    ...(dailyDownloads || []),
  ].slice(-7);
  const sparkPath = toSparkPath(sparkValues);

  const kpis = [
    { label: "Total XP", value: rewards?.wallet?.current_xp ?? 0, hint: "Growth score" },
    { label: "Level", value: rewards?.wallet?.level ?? 1, hint: "Current rank" },
    { label: "Streak", value: `${rewards?.streak?.current_streak ?? 0} days`, hint: "Consistency" },
    { label: "Mastery", value: `${insights?.mastery_score ?? 0}%`, hint: "Knowledge index" },
  ];

  return (
    <AppShell title="Dashboard" subtitle="Phase-Next command center with tasks, analytics, and AI workflow.">
      {loading ? (
        <div className="panel dashboard-loader">Loading next-gen dashboard...</div>
      ) : (
        <>
          <section className="kpi-modern-grid">
            {kpis.map((kpi, idx) => (
              <article key={kpi.label} className="kpi-modern-card" style={{ animationDelay: `${idx * 80}ms` }}>
                <p>{kpi.label}</p>
                <h3>{kpi.value}</h3>
                <small>{kpi.hint}</small>
                <span className="kpi-glow" aria-hidden="true" />
              </article>
            ))}
          </section>

          <section className="dashboard-hero-grid">
            <article className="panel panel-rich activity-panel">
              <div className="panel-head">
                <h3>7-Day Activity Pulse</h3>
                <span className="pill todo">Auto-updated</span>
              </div>

              <div className="activity-bars">
                {chartBars.map((d, idx) => (
                  <div className="activity-col" key={`d-${idx}`}>
                    <div className="activity-stack">
                      <span style={{ height: `${Math.max(8, Math.round((d.chat / activityMax) * 100))}%` }} className="bar b1" />
                      <span style={{ height: `${Math.max(8, Math.round((d.practice / activityMax) * 100))}%` }} className="bar b2" />
                      <span style={{ height: `${Math.max(8, Math.round((d.downloads / activityMax) * 100))}%` }} className="bar b3" />
                    </div>
                    <small>D{idx + 1}</small>
                  </div>
                ))}
              </div>

              <div className="legend-row">
                <span><i className="dot b1" />Chat</span>
                <span><i className="dot b2" />Practice</span>
                <span><i className="dot b3" />Downloads</span>
              </div>
            </article>

            <article className="panel panel-rich">
              <div className="panel-head">
                <h3>Daily Tasks Engine</h3>
                <Link to="/tasks" className="text-link">Manage</Link>
              </div>
              <div className="task-progress-ring" style={{ "--value": `${Math.round((completedTasks / Math.max(1, tasks.length)) * 100)}%` }}>
                <div>
                  <strong>{completedTasks}/{tasks.length}</strong>
                  <small>completed</small>
                </div>
              </div>
              <div className="row-item">
                <span>Pending today</span>
                <strong>{pendingTasks}</strong>
              </div>
              <div className="row-item">
                <span>Weekly quiz attempts</span>
                <strong>{quizStats.attempts}</strong>
              </div>
              <div className="row-item">
                <span>Best weekly score</span>
                <strong>{quizStats.best_score}%</strong>
              </div>
            </article>
          </section>

          <section className="dashboard-split-grid">
            <article className="panel panel-rich">
              <div className="panel-head">
                <h3>Learning Profile Visual</h3>
                <Link to="/style" className="text-link">Tune style</Link>
              </div>

              <div className="style-bars-modern">
                {styleScores.map((score) => (
                  <div key={score.label} className="style-row-modern">
                    <span>{score.label}</span>
                    <div className="track">
                      <div className="fill" style={{ width: `${Math.round((score.value / styleMax) * 100)}%` }} />
                    </div>
                    <strong>{score.value}</strong>
                  </div>
                ))}
              </div>

              <div className="spark-wrap">
                <svg viewBox="0 0 320 110" preserveAspectRatio="none" aria-hidden="true">
                  <path d={sparkPath} />
                </svg>
                <p className="muted">Trend signal from recent activity.</p>
              </div>
            </article>

            <article className="panel panel-rich">
              <div className="panel-head">
                <h3>Quick AI Queries (Auto)</h3>
                <Link to="/chat" className="text-link">Open chat</Link>
              </div>
              <div className="query-grid">
                {quickQueries.map((query) => (
                  <button key={query} className="query-pill" type="button">
                    {query}
                  </button>
                ))}
                {quickQueries.length === 0 && (
                  <p className="muted">Generating smart queries from API suggestions...</p>
                )}
              </div>
            </article>
          </section>

          <section className="dashboard-split-grid">
            <article className="panel panel-rich">
              <div className="panel-head">
                <h3>Weekly Mission</h3>
                <Link to="/tasks" className="text-link">Open mission</Link>
              </div>
              <p className="muted strong-line">{quiz?.title || "Weekly challenge will auto-generate."}</p>
              <div className="row-item">
                <span>Window</span>
                <strong>{quiz ? `${quiz.week_start} → ${quiz.week_end}` : "Pending"}</strong>
              </div>
              <div className="row-item">
                <span>Questions</span>
                <strong>{(quiz?.questions || []).length}</strong>
              </div>
              <div className="button-row">
                <Link className="solid-btn" to="/tasks">Start Weekly Quiz</Link>
                <Link className="outline-btn" to="/practice">Open Lab</Link>
              </div>
            </article>

            <article className="panel panel-rich">
              <div className="panel-head">
                <h3>Leaderboard (Top 5)</h3>
                <Link to="/rewards" className="text-link">Full board</Link>
              </div>
              <div className="stack">
                {leaderboardRows.map((row) => (
                  <div className="leader-row" key={`${row.rank}-${row.name}`}>
                    <div>
                      <small>#{row.rank}</small>
                      <strong>{row.name}</strong>
                    </div>
                    <span>{row.score} XP</span>
                  </div>
                ))}
              </div>
              <p className="muted mt">Your rank: {leaderboardMe?.rank || "Unranked"} • Score: {leaderboardMe?.score || 0}</p>
            </article>
          </section>
        </>
      )}
    </AppShell>
  );
}
