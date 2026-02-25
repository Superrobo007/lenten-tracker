// src/components/AdminScreen.js
import { useState, useEffect, useRef } from "react";
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
  const [attachment, setAttachment] = useState(null); // { name, dataUrl, type }
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parishFilter, setParishFilter] = useState("all");
  const fileInputRef = useRef(null);

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
    const parishes = [...new Set(enriched.map(m => m.parish).filter(Boolean))];
    setStats({
      total: enriched.length,
      active: enriched.filter(m => m.full > 0 || m.partial > 0).length,
      avg: enriched.length ? (totalFull / enriched.length).toFixed(1) : 0,
      parishes: parishes.length,
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      showToast(lang === "ta" ? "கோப்பு 5MB-ஐ விட சிறியதாக இருக்க வேண்டும்" : "File must be under 5MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAttachment({ name: file.name, dataUrl: ev.target.result, type: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleSendReminder = async () => {
    if (!reminderText.trim()) return;
    setUploading(true);
    try {
      // We store the dataUrl directly in Firestore for simplicity (for small files).
      // For production, use Firebase Storage instead.
      await sendReminder(reminderText.trim(), attachment || null);
      setReminderText("");
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadData();
      showToast(t.toastReminder);
    } catch (e) {
      showToast(t.toastError, "error");
    }
    setUploading(false);
  };

  const handleDeleteReminder = async (id) => {
    await deleteReminder(id);
    setReminders(r => r.filter(x => x.id !== id));
  };

  const allParishes = ["all", ...new Set(members.map(m => m.parish).filter(Boolean))];
  const filteredMembers = parishFilter === "all" ? members : members.filter(m => m.parish === parishFilter);

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
          <div className="stat-grid mb20" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            {[
              { icon: "👥", value: stats.total, label: t.statLabels[0] },
              { icon: "✨", value: stats.active, label: t.statLabels[1] },
              { icon: "📅", value: stats.avg, label: t.statLabels[2] },
              { icon: "⛪", value: stats.parishes, label: lang === "ta" ? "ஆலயங்கள்" : "Parishes" },
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
          {/* Parish filter */}
          {allParishes.length > 2 && (
            <div style={{ marginBottom: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {allParishes.map(p => (
                <button key={p} onClick={() => setParishFilter(p)}
                  className={`tab-btn ${parishFilter === p ? "active" : ""}`}
                  style={{ fontSize: 11, padding: "4px 10px" }}>
                  {p === "all" ? (lang === "ta" ? "அனைவரும்" : "All") : p}
                </button>
              ))}
            </div>
          )}
          <p className="muted f12 mb16">{filteredMembers.length} {t.members}</p>
          {filteredMembers.map(m => (
            <div key={m.id} className="card mb8">
              <div className="member-row">
                <div className="member-info">
                  <div className="member-name">{m.name}</div>
                  {m.parish && <div className="member-sub">⛪ {m.parish}</div>}
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

            {/* File attachment */}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
                📎 {lang === "ta" ? "படம் / PDF இணைக்க (விரும்பினால்)" : "Attach Image / PDF (optional)"}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileSelect}
                style={{ display: "none" }}
                id="attachment-input"
              />
              <label htmlFor="attachment-input" className="attach-label">
                📁 {lang === "ta" ? "கோப்பு தேர்ந்தெடு" : "Choose File"}
              </label>
              {attachment && (
                <div className="attachment-preview">
                  {attachment.type.startsWith("image/") ? (
                    <img src={attachment.dataUrl} alt="preview" style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6 }} />
                  ) : (
                    <div style={{ fontSize: 28 }}>📄</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{attachment.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{attachment.type}</div>
                  </div>
                  <button onClick={() => { setAttachment(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "var(--red)" }}>✕</button>
                </div>
              )}
              <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4, fontStyle: "italic" }}>
                {lang === "ta" ? "அதிகபட்சம் 5MB · JPG, PNG, PDF" : "Max 5MB · JPG, PNG, PDF"}
              </div>
            </div>

            <button className="primary-btn mt12" onClick={handleSendReminder} disabled={uploading}>
              {uploading ? (lang === "ta" ? "அனுப்புகிறது..." : "Sending...") : t.send}
            </button>
          </div>
          {reminders.length > 0 && (
            <>
              <p className="section-title">{t.prevReminders}</p>
              {reminders.map(r => (
                <div key={r.id} className="card mb8 reminder-item">
                  <div>{r.text}</div>
                  {r.attachmentUrl && (
                    <div style={{ marginTop: 8 }}>
                      {r.attachmentType && r.attachmentType.startsWith("image/") ? (
                        <img src={r.attachmentUrl} alt="attachment" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, border: "1px solid var(--border)" }} />
                      ) : (
                        <a href={r.attachmentUrl} target="_blank" rel="noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--purple)", fontWeight: 600, fontSize: 13, textDecoration: "underline" }}>
                          📄 {r.attachmentName || "View Attachment"}
                        </a>
                      )}
                    </div>
                  )}
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
