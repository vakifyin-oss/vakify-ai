import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import api from "../services/api";

export default function PracticePage() {
  const [style, setStyle] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [code, setCode] = useState("");
  const [runOutput, setRunOutput] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [startedAt, setStartedAt] = useState(Date.now());

  const load = async () => {
    setLoading(true);
    setError("");
    const styleRes = await api.get("/style/mine");
    const currentStyle = styleRes.data?.learning_style || null;
    setStyle(currentStyle);

    if (currentStyle !== "kinesthetic") {
      setLoading(false);
      return;
    }

    const [tasksRes, historyRes] = await Promise.allSettled([api.get("/practice/tasks"), api.get("/practice/mine")]);
    if (tasksRes.status === "fulfilled") {
      const rows = tasksRes.value.data?.tasks || [];
      setTasks(rows);
      if (rows[0]) {
        setSelectedTask(rows[0].task_name);
        setCode(rows[0].starter_code || "");
      }
    }
    if (historyRes.status === "fulfilled") setHistory(historyRes.value.data || []);

    setStartedAt(Date.now());
    setLoading(false);
  };

  useEffect(() => {
    load().catch(() => {
      setError("Failed to load practice lab.");
      setLoading(false);
    });
  }, []);

  const activeTask = useMemo(() => tasks.find((t) => t.task_name === selectedTask) || null, [tasks, selectedTask]);

  const onTaskChange = (taskName) => {
    setSelectedTask(taskName);
    const task = tasks.find((t) => t.task_name === taskName);
    setCode(task?.starter_code || "");
    setRunOutput(null);
    setStartedAt(Date.now());
  };

  const runCode = async () => {
    setRunning(true);
    setError("");
    try {
      const res = await api.post("/practice/run", { source_code: code });
      setRunOutput(res.data || null);
    } catch (err) {
      setError(err.response?.data?.error || "Run failed.");
    } finally {
      setRunning(false);
    }
  };

  const submitActivity = async () => {
    if (!activeTask) return;
    setSaving(true);
    setError("");
    try {
      const elapsed = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));
      await api.post("/practice/submit", {
        task_name: activeTask.task_name,
        status: runOutput?.stderr ? "needs_review" : "completed",
        code_submitted: code,
        time_spent: elapsed,
      });
      const historyRes = await api.get("/practice/mine");
      setHistory(historyRes.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save activity.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell title="Practice Lab" subtitle="Run and submit coding exercises.">
        <p>Loading practice lab...</p>
      </AppShell>
    );
  }

  if (style !== "kinesthetic") {
    return (
      <AppShell title="Practice Lab" subtitle="Kinesthetic mode required for the coding lab.">
        <section className="panel">
          <h3>Practice lab currently locked</h3>
          <p className="muted">Switch your learning style to Kinesthetic from the Learning Style page to unlock Java lab execution.</p>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell title="Practice Lab" subtitle="Select task, run Java code, and submit your attempt.">
      <section className="grid two">
        <article className="panel">
          <h3>Task Runner</h3>
          <label className="muted">Select task</label>
          <select className="bw-input" value={selectedTask} onChange={(e) => onTaskChange(e.target.value)}>
            {tasks.map((task) => (
              <option value={task.task_name} key={task.task_name}>{task.task_name}</option>
            ))}
          </select>
          <p className="muted mt">{activeTask?.description || "No task selected"}</p>

          <textarea
            className="bw-input"
            rows={16}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <div className="button-row">
            <button className="solid-btn" onClick={runCode} disabled={running} type="button">{running ? "Running..." : "Run"}</button>
            <button className="outline-btn" onClick={submitActivity} disabled={saving} type="button">{saving ? "Saving..." : "Submit"}</button>
          </div>

          {error && <p className="error-text">{error}</p>}
        </article>

        <article className="panel">
          <h3>Output</h3>
          <pre className="output-box">{runOutput?.stdout || "No stdout yet."}</pre>
          {runOutput?.stderr && <pre className="output-box error">{runOutput.stderr}</pre>}
          <p className="muted">Status: {runOutput?.judge0_status || runOutput?.status || "Not run"}</p>

          <h3 className="mt">Recent Submissions</h3>
          <div className="stack">
            {history.slice(0, 8).map((item) => (
              <div className="row-item" key={item.activity_id}>
                <span>{item.task_name}</span>
                <small>{item.status}</small>
              </div>
            ))}
            {history.length === 0 && <p className="muted">No submissions yet.</p>}
          </div>
        </article>
      </section>
    </AppShell>
  );
}
