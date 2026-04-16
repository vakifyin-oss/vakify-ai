import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import api from "../services/api";

export default function RewardsPage() {
  const [rewards, setRewards] = useState(null);
  const [rows, setRows] = useState([]);
  const [scope, setScope] = useState("weekly");
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async (currentScope = scope) => {
    setLoading(true);
    const [rewardRes, boardRes] = await Promise.allSettled([
      api.get("/rewards/summary"),
      api.get(`/leaderboard?scope=${currentScope}`),
    ]);

    if (rewardRes.status === "fulfilled") setRewards(rewardRes.value.data || null);
    if (boardRes.status === "fulfilled") {
      setRows(boardRes.value.data?.rows || []);
      setMe(boardRes.value.data?.me || null);
    }
    setLoading(false);
  };

  useEffect(() => {
    load(scope);
  }, [scope]);

  return (
    <AppShell title="Rewards" subtitle="Track XP, streaks, and leaderboard performance.">
      {loading ? (
        <p>Loading rewards...</p>
      ) : (
        <>
          <section className="grid three">
            <article className="panel kpi">
              <p>Total XP</p>
              <h3>{rewards?.wallet?.current_xp ?? 0}</h3>
            </article>
            <article className="panel kpi">
              <p>Level</p>
              <h3>{rewards?.wallet?.level ?? 1}</h3>
            </article>
            <article className="panel kpi">
              <p>Streak</p>
              <h3>{rewards?.streak?.current_streak ?? 0}d</h3>
            </article>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h3>Leaderboard</h3>
              <div className="switch-wrap">
                <button className={`mini-btn ${scope === "weekly" ? "active" : ""}`} onClick={() => setScope("weekly")} type="button">Weekly</button>
                <button className={`mini-btn ${scope === "all_time" ? "active" : ""}`} onClick={() => setScope("all_time")} type="button">All Time</button>
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.user_id}>
                      <td>#{row.rank}</td>
                      <td>{row.name}</td>
                      <td>{row.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length === 0 && <p className="muted">No leaderboard data yet.</p>}
            </div>

            <p className="muted mt">Your rank: {me?.rank || "Unranked"} • Your score: {me?.score || 0}</p>
          </section>

          <section className="panel">
            <h3>Recent XP Events</h3>
            <div className="stack">
              {(rewards?.recent_xp_events || []).map((evt) => (
                <div className="row-item" key={evt.event_id}>
                  <span>{evt.source.replace(/_/g, " ")}</span>
                  <strong>+{evt.points} XP</strong>
                </div>
              ))}
              {(!rewards?.recent_xp_events || rewards.recent_xp_events.length === 0) && (
                <p className="muted">No XP events yet.</p>
              )}
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}
