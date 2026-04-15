import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [styleData, setStyleData] = useState(null);
  const [downloads, setDownloads] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [practiceRows, setPracticeRows] = useState([]);
  const [insights, setInsights] = useState(null);
  const [downloadError, setDownloadError] = useState("");
  const [todayTasks, setTodayTasks] = useState([]);
  const [weeklyQuiz, setWeeklyQuiz] = useState(null);
  const [quizStats, setQuizStats] = useState({ attempts: 0, best_score: 0 });
  const [rewards, setRewards] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardMe, setLeaderboardMe] = useState(null);
  const [taskActionLoading, setTaskActionLoading] = useState(null);

  useEffect(() => {
    api.get("/style/mine").then((res) => {
      if (!res.data.learning_style) {
        navigate("/style");
        return;
      }
      setStyleData(res.data);
    });

    Promise.allSettled([
      api.get("/downloads/mine"),
      api.get("/chat/history"),
      api.get("/practice/mine"),
      api.get("/dashboard/insights"),
      api.get("/tasks/today"),
      api.get("/quiz/weekly"),
      api.get("/rewards/summary"),
      api.get("/leaderboard?scope=weekly"),
    ]).then(([d, c, p, i, t, q, r, l]) => {
      if (d.status === "fulfilled") setDownloads(d.value.data || []);
      if (c.status === "fulfilled") setChatHistory(c.value.data || []);
      if (p.status === "fulfilled") setPracticeRows(p.value.data || []);
      if (i.status === "fulfilled") setInsights(i.value.data || null);
      if (t.status === "fulfilled") setTodayTasks(t.value.data?.tasks || []);
      if (q.status === "fulfilled") {
        setWeeklyQuiz(q.value.data?.quiz || null);
        setQuizStats({
          attempts: q.value.data?.attempts || 0,
          best_score: q.value.data?.best_score || 0,
        });
      }
      if (r.status === "fulfilled") setRewards(r.value.data || null);
      if (l.status === "fulfilled") {
        setLeaderboard(l.value.data?.rows || []);
        setLeaderboardMe(l.value.data?.me || null);
      }
    });
  }, [navigate]);

  const learningMode = styleData?.learning_style
    ? styleData.learning_style.charAt(0).toUpperCase() + styleData.learning_style.slice(1)
    : "Not set";

  const completedCount = practiceRows.filter((r) => r.status === "completed").length;
  const totalPracticeTime = practiceRows.reduce((sum, r) => sum + (r.time_spent || 0), 0);
  const practiceMinutes = Math.round(totalPracticeTime / 60);
  const masteryScore = insights?.mastery_score ?? 0;
  const streakDays = insights?.streak_days ?? 0;

  const styleScores = [
    { key: "visual", name: "Visual", score: styleData?.visual_score || 0, cls: "s-visual" },
    { key: "auditory", name: "Auditory", score: styleData?.auditory_score || 0, cls: "s-auditory" },
    { key: "kinesthetic", name: "Kinesthetic", score: styleData?.kinesthetic_score || 0, cls: "s-kinesthetic" },
  ];

  const maxStyle = Math.max(...styleScores.map((s) => s.score), 1);

  const weeklyMax = Math.max(
    ...[...(insights?.daily_chat || []), ...(insights?.daily_practice || []), ...(insights?.daily_downloads || [])].map((x) => x.count || 0),
    1
  );

  const downloadHistoryFile = async (item) => {
    setDownloadError("");
    try {
      const fileResp = await api.get(`/downloads/file/${item.download_id}`, { responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(new Blob([fileResp.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `download_${item.download_id}_${item.content_type}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setDownloadError(err.response?.data?.error || "Failed to download file.");
    }
  };

  const latestQuestion = chatHistory[0]?.question || "No question yet";
  const suggestedTopic = insights?.recommended_topic || "Object-oriented programming";
  const displayStreak = rewards?.streak?.current_streak ?? streakDays;

  const refreshProgressData = async () => {
    const [tasksRes, rewardsRes, boardRes] = await Promise.all([
      api.get("/tasks/today"),
      api.get("/rewards/summary"),
      api.get("/leaderboard?scope=weekly"),
    ]);
    setTodayTasks(tasksRes.data?.tasks || []);
    setRewards(rewardsRes.data || null);
    setLeaderboard(boardRes.data?.rows || []);
    setLeaderboardMe(boardRes.data?.me || null);
  };

  const completeTask = async (taskId) => {
    setTaskActionLoading(taskId);
    try {
      await api.post(`/tasks/${taskId}/submit`, {
        submission: "Completed from dashboard quick action",
        score: 100,
      });
      await refreshProgressData();
    } finally {
      setTaskActionLoading(null);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container page-wrap dashboard-v2">
        <header className="db2-header">
          <div>
            <p className="db2-kicker mb-1">Learning Analytics</p>
            <h2 className="db2-title mb-1">Welcome, {user?.name}</h2>
            <p className="db2-subtitle mb-0">Mode: <strong>{learningMode}</strong></p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <Link to="/chat" className="btn brand-btn">Open AI Chat</Link>
            <Link to="/practice" className="btn surface-btn">Practice Lab</Link>
          </div>
        </header>

        <section className="db2-kpis">
          <article className="db2-kpi">
            <p>Questions</p>
            <h3>{chatHistory.length}</h3>
            <span>AI conversations</span>
          </article>
          <article className="db2-kpi">
            <p>Downloads</p>
            <h3>{downloads.length}</h3>
            <span>Generated resources</span>
          </article>
          <article className="db2-kpi">
            <p>Practice</p>
            <h3>{completedCount}</h3>
            <span>Completed tasks</span>
          </article>
          <article className="db2-kpi">
            <p>Mastery</p>
            <h3>{masteryScore}%</h3>
            <span>Streak {displayStreak} days</span>
          </article>
        </section>

        <section className="row g-3 mb-3">
          <div className="col-xl-6">
            <div className="db2-panel h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Today's Tasks</h5>
                <span className="db2-pill">{todayTasks.length} items</span>
              </div>
              {todayTasks.length === 0 ? (
                <p className="text-muted mb-0">No task generated yet.</p>
              ) : (
                <div className="d-grid gap-2">
                  {todayTasks.map((task) => (
                    <div key={task.task_id} className="border rounded-3 p-2">
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div>
                          <strong>{task.title}</strong>
                          <p className="mb-1 text-muted small">{task.description}</p>
                          <small>Type: {task.task_type} | Difficulty: {task.difficulty} | XP: {task.points_reward}</small>
                        </div>
                        {task.status === "completed" ? (
                          <span className="badge text-bg-success">Done</span>
                        ) : (
                          <button
                            className="btn btn-sm brand-btn"
                            onClick={() => completeTask(task.task_id)}
                            disabled={taskActionLoading === task.task_id}
                          >
                            {taskActionLoading === task.task_id ? "Saving..." : "Mark Complete"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-xl-6">
            <div className="db2-panel h-100">
              <h5 className="mb-3">Weekly Quiz</h5>
              {!weeklyQuiz ? (
                <p className="text-muted mb-0">Quiz not generated yet.</p>
              ) : (
                <>
                  <p className="mb-1"><strong>{weeklyQuiz.title}</strong></p>
                  <p className="mb-1 text-muted">Difficulty: {weeklyQuiz.difficulty}</p>
                  <p className="mb-1 text-muted">Questions: {(weeklyQuiz.questions || []).length}</p>
                  <p className="mb-1 text-muted">Attempts: {quizStats.attempts}</p>
                  <p className="mb-3 text-muted">Best Score: {quizStats.best_score}%</p>
                  <small className="text-muted d-block">Quiz window: {weeklyQuiz.week_start} to {weeklyQuiz.week_end}</small>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="row g-3 mb-3">
          <div className="col-xl-6">
            <div className="db2-panel h-100">
              <h5 className="mb-3">Rewards Summary</h5>
              <p className="mb-1"><strong>XP:</strong> {rewards?.wallet?.current_xp ?? 0}</p>
              <p className="mb-1"><strong>Level:</strong> {rewards?.wallet?.level ?? 1}</p>
              <p className="mb-1"><strong>Reward Points:</strong> {rewards?.wallet?.reward_points ?? 0}</p>
              <p className="mb-0"><strong>Current Streak:</strong> {rewards?.streak?.current_streak ?? 0} days</p>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="db2-panel h-100">
              <h5 className="mb-3">Weekly Leaderboard</h5>
              {leaderboard.length === 0 ? (
                <p className="text-muted mb-2">No entries yet.</p>
              ) : (
                <div className="d-grid gap-1 mb-2">
                  {leaderboard.slice(0, 5).map((row) => (
                    <div key={row.user_id} className="d-flex justify-content-between">
                      <span>#{row.rank} {row.name}</span>
                      <strong>{row.score} XP</strong>
                    </div>
                  ))}
                </div>
              )}
              <small className="text-muted">
                Your rank: {leaderboardMe?.rank || "Not ranked yet"} | Score: {leaderboardMe?.score || 0}
              </small>
            </div>
          </div>
        </section>

        <section className="row g-3 mb-3">
          <div className="col-xl-6">
            <div className="db2-panel">
              <div className="db2-panel-head">
                <h5 className="mb-0">Learning Style Scores</h5>
                <small>/20 scale</small>
              </div>
              <div className="d-grid gap-3 mt-3">
                {styleScores.map((s) => (
                  <div key={s.key}>
                    <div className="d-flex justify-content-between mb-1">
                      <strong>{s.name}</strong>
                      <span>{s.score}</span>
                    </div>
                    <div className="db2-track">
                      <div className={`db2-fill ${s.cls}`} style={{ width: `${Math.max(8, Math.round((s.score / maxStyle) * 100))}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <Link to="/style" className="btn btn-sm surface-btn">Retake Test</Link>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="db2-panel">
              <div className="db2-panel-head">
                <h5 className="mb-0">Weekly Activity</h5>
                <small>7 days</small>
              </div>
              <div className="db2-chart-row mt-3">
                <div className="db2-mini-chart">
                  <p className="db2-mini-title">Chat</p>
                  <div className="db2-bars">
                    {(insights?.daily_chat || []).map((d) => (
                      <div key={`c-${d.date}`} className="db2-bar-col">
                        <div className="db2-bar-bg">
                          <div className="db2-bar chat" style={{ height: `${Math.max(6, Math.round(((d.count || 0) / weeklyMax) * 100))}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="db2-mini-chart">
                  <p className="db2-mini-title">Practice</p>
                  <div className="db2-bars">
                    {(insights?.daily_practice || []).map((d) => (
                      <div key={`p-${d.date}`} className="db2-bar-col">
                        <div className="db2-bar-bg">
                          <div className="db2-bar practice" style={{ height: `${Math.max(6, Math.round(((d.count || 0) / weeklyMax) * 100))}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="db2-mini-chart">
                  <p className="db2-mini-title">Downloads</p>
                  <div className="db2-bars">
                    {(insights?.daily_downloads || []).map((d) => (
                      <div key={`d-${d.date}`} className="db2-bar-col">
                        <div className="db2-bar-bg">
                          <div className="db2-bar download" style={{ height: `${Math.max(6, Math.round(((d.count || 0) / weeklyMax) * 100))}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="row g-3 mb-3">
          <div className="col-xl-6">
            <div className="db2-panel h-100">
              <h5 className="mb-3">Current Learning Context</h5>
              <p><strong>Last Question:</strong> {latestQuestion}</p>
              <p><strong>Suggested Topic:</strong> {suggestedTopic}</p>
              <p><strong>Practice Time:</strong> {practiceMinutes} minutes</p>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="db2-panel h-100">
              <h5 className="mb-3">Quick Actions</h5>
              <div className="d-grid gap-2">
                <Link to="/chat" className="btn surface-btn text-start">Ask detailed AI explanation</Link>
                <Link to="/practice" className="btn surface-btn text-start">Continue Java practice</Link>
                <Link to="/style" className="btn surface-btn text-start">Update learning style</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="db2-panel">
          <h5 className="mb-3">Download History</h5>
          {downloadError && <div className="alert alert-danger py-2">{downloadError}</div>}
          {downloads.length === 0 ? (
            <p className="text-muted mb-0">No downloads yet.</p>
          ) : (
            <div className="db2-table-wrap">
              <table className="table table-sm mb-0">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Time</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {downloads.map((d) => (
                    <tr key={d.download_id}>
                      <td><span className="db2-pill">{d.content_type}</span></td>
                      <td>{new Date(d.timestamp).toLocaleString()}</td>
                      <td className="text-end">
                        <button className="btn btn-sm surface-btn" onClick={() => downloadHistoryFile(d)}>Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
