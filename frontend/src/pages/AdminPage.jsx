import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import api from "../services/api";

export default function AdminPage() {
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const loadData = async (search = "") => {
    setLoading(true);
    setError("");
    try {
      const [summaryRes, analyticsRes, usersRes] = await Promise.all([
        api.get("/admin/summary"),
        api.get("/admin/analytics"),
        api.get("/admin/users", { params: search ? { q: search } : {} }),
      ]);
      setSummary(summaryRes.data || null);
      setAnalytics(analyticsRes.data || null);
      setUsers(usersRes.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load admin panel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const metrics = useMemo(() => summary?.metrics || {}, [summary]);
  const feedbackSummary = analytics?.feedback_summary || {};
  const styleDist = analytics?.style_distribution || {};

  const onDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user and all related data?")) return;
    setActionMsg("");
    try {
      await api.delete(`/admin/users/${userId}`);
      setActionMsg(`Deleted user ${userId}`);
      await loadData(query.trim());
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete user.");
    }
  };

  const onSearch = async (e) => {
    e.preventDefault();
    await loadData(query.trim());
  };

  return (
    <AppShell title="Admin Control" subtitle="Roles, moderation, analytics, and governance.">
      {error && <div className="panel notice">{error}</div>}
      {actionMsg && <div className="panel notice">{actionMsg}</div>}

      <section className="grid three">
        <article className="panel kpi"><p>Users</p><h3>{metrics.users || 0}</h3></article>
        <article className="panel kpi"><p>Chats</p><h3>{metrics.chat_messages || 0}</h3></article>
        <article className="panel kpi"><p>Feedback</p><h3>{feedbackSummary.total || 0}</h3></article>
      </section>

      <section className="grid two">
        <article className="panel">
          <h3>Moderation Queue</h3>
          <div className="stack">
            <div className="row-item"><span>Low confidence responses</span><strong>{feedbackSummary.needs_work || 0}</strong></div>
            <div className="row-item"><span>Helpful responses</span><strong>{feedbackSummary.helpful || 0}</strong></div>
            <div className="row-item"><span>Average feedback score</span><strong>{feedbackSummary.avg_rating ?? 0}</strong></div>
          </div>
        </article>

        <article className="panel">
          <h3>Style Distribution</h3>
          <div className="stack">
            {Object.keys(styleDist).length ? Object.entries(styleDist).map(([k, v]) => (
              <div key={k} className="row-item"><span>{k}</span><strong>{v}</strong></div>
            )) : <p className="muted">No style data yet.</p>}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h3>User Management</h3>
          <form className="quick-links" onSubmit={onSearch}>
            <input
              className="bw-input"
              placeholder="Search by name or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="solid-btn" type="submit" disabled={loading}>Search</button>
          </form>
        </div>

        {loading ? (
          <p className="muted">Loading users...</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Style</th>
                  <th>Stats</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.user_id}>
                    <td>{u.user_id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.learning_style || "not set"}</td>
                    <td>C:{u.stats?.chats || 0} D:{u.stats?.downloads || 0} P:{u.stats?.practice || 0}</td>
                    <td>
                      {!u.is_admin ? (
                        <button className="outline-btn" onClick={() => onDeleteUser(u.user_id)} type="button">Delete</button>
                      ) : (
                        <span className="pill done">Admin</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p className="muted mt">No users found.</p>}
          </div>
        )}
      </section>
    </AppShell>
  );
}
