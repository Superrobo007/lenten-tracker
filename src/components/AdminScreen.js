// src/components/AdminScreen.js
import { useState, useEffect } from "react";
import { getAllUsers, deleteUser, buildLeaderboard, sendReminder, getReminders, deleteReminder } from "../db";
import { useLang, UI } from "../context/LanguageContext";
import LeaderboardScreen from "./LeaderboardScreen";

export default function AdminScreen({ showToast }) {
  const { lang } = useLang();
  const t = UI[lang];
  const [tab, setTab] = useState(0);
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [reminderText, setReminderText] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [users, leaderboard, rems] = await Promise.all([
      getAllUsers(), buildLeaderboard(), getReminders(),
    ]);
    const lbMap = {};
    for (const r of leaderboard) lbMap[r.id] = r;
    const enriched = users.map(u => ({ ...u, ...(lbMap[u.id] || { full: 0, partial: 0 }) }));
    enriched.sort((a, b) => b.full - a.full);
    setMembers(enriched);
    const totalFull = enriched.reduce((s, m) => s + m.full, 0);
    setStats({
      total: enriched.length,
      active: enriched.filter(m => m.full > 0 || m.partial > 0).length,
      avg: enriched.length ? (totalFull / enriched.length).toFixed(1) : 0,
    });
    setReminders(rems);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleRemove = async (id) => {
    if (!window.confirm(t.confirmRemove)) return;
    await deleteUser(id);
    await loadData();
    showToast(t.toastRemoved);
  };

  const handleSendReminder = async () => {
    if (!reminderText.trim()) return;
    await sendReminder(reminderText.trim());
    setReminderText("");
    await loadData();
    showToast(t.toastReminder);
  };

  const handleDeleteReminder = async (id) => {
    await deleteReminder(id);
    setReminders(r => r.filter(x => x.id !== id));
  };

  return (
    <div>
      <h2 className="cormorant gold" style={{ fontSize: 26, marginBottom: 4 }}>{t.adminTitle}</h2>
      <p className="muted f12 italic mb20">{t.org}</p>

      <div className="tabs">
        {t.tabs.map((label, i) => (
          <button key={i} className={`tab-btn ${tab === i ? "active" : ""}`} onClick={() => setTab(i)}>
            {label}
          </button>
        ))}
      </div>

      {loading && tab !== 3 && <div className="loading">{t.loading}</div>}

      {/* OVERVIEW */}
      {tab === 0 && !loading && stats && (
        <div>
          <div className="stat-grid mb20">
            {[
              { icon: "👥", value: stats.total, label: t.statLabels[0] },
              { icon: "✨", value: stats.active, label: t.statLabels[1] },
              { icon: "📅", value: stats.avg, label: t.statLabels[2] },
            ].map((s, i) => (
              <div key={i} className="card stat-card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
          <button className="secondary-btn" onClick={loadData}>{t.refresh}</button>
        </div>
      )}

      {/* MEMBERS */}
      {tab === 1 && !loading && (
        <div>
          <p className="muted f12 mb16">{members.length} {t.members}</p>
          {members.map(m => (
            <div key={m.id} className="card mb8">
              <div className="member-row">
                <div className="member-info">
                  <div className="member-name">{m.name}</div>
                  <div className="member-sub">{m.joinedAt} {t.joinedAt}</div>
                  <div className="member-stats">✅ {m.full} {t.fullMark} · ⚡ {m.partial} {t.partialMark}</div>
                </div>
                <div className="member-actions">
                  <div className="member-pct" style={{ color: m.full > 20 ? "var(--green)" : "var(--gold)" }}>
                    {Math.round(m.full / 40 * 100)}%
                  </div>
                  <button className="danger-btn" onClick={() => handleRemove(m.id)}>{t.remove}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REMINDERS */}
      {tab === 2 && (
        <div>
          <div className="card mb20">
            <h3 className="gold" style={{ fontSize: 15, marginBottom: 12 }}>{t.reminderTitle}</h3>
            <textarea className="input full" value={reminderText} onChange={e => setReminderText(e.target.value)} placeholder={t.reminderPlaceholder} />
            <button className="primary-btn mt12" onClick={handleSendReminder}>{t.send}</button>
          </div>
          {reminders.length > 0 && (
            <>
              <p className="section-title">{t.prevReminders}</p>
              {reminders.map(r => (
                <div key={r.id} className="card mb8 reminder-item">
                  <div>{r.text}</div>
                  <div className="reminder-meta">
                    <span>{r.date} · {r.time}</span>
                    <button className="danger-btn" onClick={() => handleDeleteReminder(r.id)}>{t.remove}</button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* LEADERBOARD */}
      {tab === 3 && <LeaderboardScreen onBack={null} currentUserId={null} />}
    </div>
  );
}
