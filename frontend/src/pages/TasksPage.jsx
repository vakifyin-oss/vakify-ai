import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import api from "../services/api";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [quizStats, setQuizStats] = useState({ attempts: 0, best_score: 0 });
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [t, q] = await Promise.allSettled([api.get("/tasks/today"), api.get("/quiz/weekly")]);
    if (t.status === "fulfilled") setTasks(t.value.data?.tasks || []);
    if (q.status === "fulfilled") {
      setQuiz(q.value.data?.quiz || null);
      setQuizStats({ attempts: q.value.data?.attempts || 0, best_score: q.value.data?.best_score || 0 });
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const pendingCount = useMemo(() => tasks.filter((x) => x.status !== "completed").length, [tasks]);

  const completeTask = async (taskId) => {
    setMessage("");
    await api.post(`/tasks/${taskId}/submit`, {
      submission: "Completed from daily tasks page",
      score: 100,
    });
    setMessage("Task completed and XP added.");
    await load();
  };

  const submitQuiz = async () => {
    if (!quiz) return;
    setMessage("");
    const payload = { answers };
    const res = await api.post(`/quiz/${quiz.quiz_id}/submit`, payload);
    setMessage(`Quiz submitted. Score: ${res.data.score}/${res.data.total} (${res.data.percentage}%).`);
    await load();
  };

  return (
    <AppShell title="Daily Tasks" subtitle="Generated every day. Complete tasks and weekly quiz to gain XP.">
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          {message && <div className="panel notice">{message}</div>}

          <section className="panel">
            <div className="panel-head">
              <h3>Today Task Summary</h3>
              <span className="pill todo">{pendingCount} pending</span>
            </div>
            <div className="stack">
              {tasks.map((task) => (
                <article key={task.task_id} className="task-card">
                  <div>
                    <strong>{task.title}</strong>
                    <p className="muted">{task.description}</p>
                    <small className="muted">{task.task_type} • {task.difficulty} • {task.points_reward} XP</small>
                  </div>
                  {task.status === "completed" ? (
                    <span className="pill done">Completed</span>
                  ) : (
                    <button className="solid-btn" onClick={() => completeTask(task.task_id)} type="button">Mark Complete</button>
                  )}
                </article>
              ))}
              {tasks.length === 0 && <p className="muted">No tasks available yet.</p>}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h3>Weekly Quiz</h3>
              <p className="muted">Attempts: {quizStats.attempts} • Best: {quizStats.best_score}%</p>
            </div>

            {!quiz ? (
              <p className="muted">Quiz not available yet.</p>
            ) : (
              <>
                <p className="muted">{quiz.title} ({quiz.week_start} to {quiz.week_end})</p>
                <div className="stack">
                  {(quiz.questions || []).map((q) => (
                    <article key={q.id} className="quiz-question">
                      <strong>Q{q.id}. {q.question}</strong>
                      {q.type === "mcq" ? (
                        <div className="choice-wrap">
                          {(q.options || []).map((opt) => (
                            <label key={opt} className="choice-item">
                              <input
                                type="radio"
                                name={`q-${q.id}`}
                                value={opt}
                                checked={answers[String(q.id)] === opt}
                                onChange={(e) => setAnswers((prev) => ({ ...prev, [String(q.id)]: e.target.value }))}
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <textarea
                          className="bw-input"
                          rows={3}
                          placeholder="Type your answer"
                          value={answers[String(q.id)] || ""}
                          onChange={(e) => setAnswers((prev) => ({ ...prev, [String(q.id)]: e.target.value }))}
                        />
                      )}
                    </article>
                  ))}
                </div>
                <button className="solid-btn mt" onClick={submitQuiz} type="button">Submit Weekly Quiz</button>
              </>
            )}
          </section>
        </>
      )}
    </AppShell>
  );
}
