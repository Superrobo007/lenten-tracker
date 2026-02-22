// src/components/AdminScreen.js
import { useState, useEffect } from "react";
import { getAllUsers, deleteUser, buildLeaderboard, sendReminder, getReminders, deleteReminder } from "../db";
import LeaderboardScreen from "./LeaderboardScreen";

const TABS = [
  { id: "overview",  label: "கண்ணோட்டம்" },
  { id: "members",   label: "உறுப்பினர்கள்" },
  { id: "reminder",  label: "நினைவூட்டல்" },
  { id: "leaderboard", label: "தரவரிசை" },
];

export default function AdminScreen({ showToast }) {
  const [tab, setTab] = useState("overview");
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [reminderText, setReminderText] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [users, leaderboard, rems] = await Promise.all([
      getAllUsers(),
      buildLeaderboard(),
      getReminders(),
    ]);
    // Merge leaderboard stats into members
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
    if (!window.confirm("இந்த உறுப்பினரை நீக்கவா?")) return;
    await deleteUser(id);
    await loadData();
    showToast("உறுப்பினர் நீக்கப்பட்டார்");
  };

  const handleSendReminder = async () => {
    if (!reminderText.trim()) return;
    await sendReminder(reminderText.trim());
    setReminderText("");
    await loadData();
    showToast("நினைவூட்டல் அனுப்பப்பட்டது ✓");
  };

  const handleDeleteReminder = async (id) => {
    await deleteReminder(id);
    setReminders(r => r.filter(x => x.id !== id));
  };

  return (
    <div>
      <h2 className="cormorant gold" style={{ fontSize: 26, marginBottom: 4 }}>நிர்வாக பலகை</h2>
      <p className="muted f12 mb20">TNBC Lenten Journey 2026</p>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && tab !== "leaderboard" && <div className="loading">ஏற்றுகிறது...</div>}

      {/* OVERVIEW */}
      {tab === "overview" && !loading && stats && (
        <div>
          <div className="stat-grid mb20">
            {[
              { icon: "👥", value: stats.total,  label: "மொத்த உறுப்பினர்கள்" },
              { icon: "✨", value: stats.active, label: "செயலில் உள்ளவர்கள்" },
              { icon: "📅", value: stats.avg,    label: "சராசரி முழு நாட்கள்" },
            ].map((s, i) => (
              <div key={i} className="card stat-card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
          <button className="secondary-btn" onClick={loadData}>புதுப்பி ↻</button>
        </div>
      )}

      {/* MEMBERS */}
      {tab === "members" && !loading && (
        <div>
          <p className="muted f12 mb16">{members.length} உறுப்பினர்கள் பதிவாகியுள்ளனர்</p>
          {members.map(m => (
            <div key={m.id} className="card mb8">
              <div className="member-row">
                <div className="member-info">
                  <div className="member-name">{m.name}</div>
                  <div className="member-sub">{m.joinedAt} அன்று சேர்ந்தார்</div>
                  <div className="member-stats">✅ {m.full} முழு · ⚡ {m.partial} பகுதி</div>
                </div>
                <div className="member-actions">
                  <div className="member-pct" style={{ color: m.full > 20 ? "var(--green)" : "var(--gold)" }}>
                    {Math.round(m.full / 40 * 100)}%
                  </div>
                  <button className="danger-btn" onClick={() => handleRemove(m.id)}>நீக்கு</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REMINDER */}
      {tab === "reminder" && (
        <div>
          <div className="card mb20">
            <h3 className="gold" style={{ fontSize: 15, marginBottom: 12 }}>அனைவருக்கும் நினைவூட்டல் அனுப்பு</h3>
            <textarea
              className="input full"
              value={reminderText}
              onChange={e => setReminderText(e.target.value)}
              placeholder="உங்கள் செய்தியை இங்கே உள்ளிடுக..."
            />
            <button className="primary-btn mt12" onClick={handleSendReminder}>அனுப்பு</button>
          </div>

          {reminders.length > 0 && (
            <>
              <p className="section-title">முந்தைய நினைவூட்டல்கள்</p>
              {reminders.map(r => (
                <div key={r.id} className="card mb8 reminder-item">
                  <div>{r.text}</div>
                  <div className="reminder-meta">
                    <span>{r.date} · {r.time}</span>
                    <button className="danger-btn" onClick={() => handleDeleteReminder(r.id)}>நீக்கு</button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* LEADERBOARD */}
      {tab === "leaderboard" && (
        <LeaderboardScreen onBack={null} currentUserId={null} />
      )}
    </div>
  );
}
