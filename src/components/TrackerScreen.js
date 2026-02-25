// src/components/TrackerScreen.js
import { useState, useEffect } from "react";
import { DAYS, getLentenDay } from "../data/days";
import { getProgress, saveProgress, subscribeReminders } from "../db";
import { useLang, UI } from "../context/LanguageContext";
import CircleProgress from "./CircleProgress";

const MOTIVATIONAL_EN = [
  "Every step forward counts. Keep going! 🕊️",
  "You're on your way! Keep the faith strong. ✝️",
  "Lent is not about giving up — it's about growing up. 🌿",
  "Your commitment today is a prayer in action. 🙏",
  "Small acts of faith, done daily, move mountains. ⛰️",
  "The cross you carry today leads to resurrection. ✨",
];
const MOTIVATIONAL_TA = [
  "ஒவ்வொரு அடியும் முன்னேற்றமே. தொடர்ந்து செல்! 🕊️",
  "உயிர்ப்பு நாளை நோக்கி மேலும் ஒரு நாள் நெருங்கினீர்கள். ✝️",
  "தவக்காலம் விட்டுவிடுவதற்காக மட்டுமல்ல — வளர்வதற்காகவும். 🌿",
  "இன்றைய உங்கள் உறுதி ஒரு செயல் வடிவ செபம். 🙏",
  "தினமும் செய்யும் சிறிய விசுவாச செயல்கள் மலையையே அசைக்கும். ⛰️",
  "நீங்கள் சுமக்கும் சிலுவை உயிர்த்தெழுதலுக்கு வழிவகுக்கும். ✨",
];

function getStreak(progress) {
  const todayIdx = getLentenDay();
  let streak = 0;
  for (let i = todayIdx; i >= 0; i--) {
    const d = progress["d" + i] || {};
    if (d.do && d.give && d.avoid) streak++;
    else break;
  }
  return streak;
}

function getMotivationalMsg(totalFull, lang) {
  const msgs = lang === "ta" ? MOTIVATIONAL_TA : MOTIVATIONAL_EN;
  const idx = Math.min(Math.floor(totalFull / 7), msgs.length - 1);
  return msgs[idx];
}

export default function TrackerScreen({ user, showToast }) {
  const { lang } = useLang();
  const t = UI[lang];
  const [progress, setProgress] = useState({});
  const [selectedDay, setSelectedDay] = useState(getLentenDay());
  const [banner, setBanner] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    getProgress(user.id).then(p => { setProgress(p); setLoaded(true); });
    const unsub = subscribeReminders(rems => { if (rems.length) setBanner(rems[0]); });
    return () => unsub();
  }, [user.id]);

  const handleCheck = async (dayIdx, field) => {
    const key = "d" + dayIdx;
    const cur = progress[key] || {};
    const wasChecked = cur[field];
    const updated = { ...progress, [key]: { ...cur, [field]: !cur[field] } };
    setProgress(updated);
    setAnimKey(k => k + 1);
    await saveProgress(user.id, dayIdx, updated[key]);
    if (!wasChecked) {
      const newD = updated[key];
      if (newD.do && newD.give && newD.avoid) {
        showToast(lang === "ta" ? `நாள் ${dayIdx + 1} முழுமை! 🎉` : `Day ${dayIdx + 1} complete! 🎉`);
      }
    }
  };

  const getDayProg = i => {
    const d = progress["d" + i] || {};
    return [d.do, d.give, d.avoid].filter(Boolean).length;
  };

  const totalFull = Object.keys(progress).filter(k => {
    const d = progress[k]; return k.startsWith("d") && d?.do && d?.give && d?.avoid;
  }).length;

  const totalPartial = Object.keys(progress).filter(k => {
    const d = progress[k];
    return k.startsWith("d") && (d?.do || d?.give || d?.avoid) && !(d?.do && d?.give && d?.avoid);
  }).length;

  const totalChecks = Object.keys(progress).filter(k => k.startsWith("d")).reduce((acc, k) => {
    const d = progress[k] || {};
    return acc + [d.do, d.give, d.avoid].filter(Boolean).length;
  }, 0);

  const pct = Math.round(totalFull / 40 * 100);
  const streak = getStreak(progress);
  const todayIdx = getLentenDay();
  const dayData = DAYS[selectedDay][lang];
  const dp = progress["d" + selectedDay] || {};
  const daysLeft = Math.max(0, 39 - todayIdx);

  if (!loaded) return <div className="loading">{t.loading}</div>;

  return (
    <div>
      {/* Reminder banner */}
      {banner && (
        <div className="reminder-banner">
          <span>📣</span>
          <span style={{ flex: 1 }}>{banner.text}</span>
          {banner.attachmentUrl && (
            <a href={banner.attachmentUrl} target="_blank" rel="noreferrer"
              style={{ color: "var(--purple)", fontWeight: 700, fontSize: 12, textDecoration: "underline", whiteSpace: "nowrap", marginLeft: 8 }}>
              📎 {lang === "ta" ? "காண்க" : "View"}
            </a>
          )}
          <span className="muted f10" style={{ marginLeft: 8 }}>{banner.date}</span>
          <span className="banner-close" onClick={() => setBanner(null)}>✕</span>
        </div>
      )}

      {/* === STATS DASHBOARD === */}
      <div className="stats-dashboard">
        {/* Main hero card */}
        <div className="stats-main-card">
          <div className="stats-hero-row">
            <CircleProgress pct={pct} size={96} />
            <div className="stats-hero-text">
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span className="stats-big-num">{totalFull}</span>
                <span className="stats-big-denom">/40</span>
              </div>
              <div className="stats-big-label">{lang === "ta" ? "முழு நாட்கள்" : "Full Days"}</div>
              <div className="stats-motivational">{getMotivationalMsg(totalFull, lang)}</div>
            </div>
          </div>
          {/* Journey bar */}
          <div style={{ marginTop: 14 }}>
            <div className="journey-bar-header">
              <span className="f12 muted">{lang === "ta" ? "40 நாள் பயணம்" : "40-Day Journey"}</span>
              <span className="f12 gold">{pct}%</span>
            </div>
            <div className="journey-bar-track">
              <div className="journey-bar-fill" style={{ width: pct + "%" }} key={animKey} />
              {[25, 50, 75].map(m => (
                <div key={m} className="journey-milestone" style={{ left: m + "%" }}>
                  <div className={`milestone-dot ${pct >= m ? "reached" : ""}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mini stat chips */}
        <div className="stats-chips-row">
          <div className="stat-chip streak-chip">
            <div className="stat-chip-icon">🔥</div>
            <div className="stat-chip-val">{streak}</div>
            <div className="stat-chip-lbl">{lang === "ta" ? "தொடர் நாட்கள்" : "Streak"}</div>
          </div>
          <div className="stat-chip checks-chip">
            <div className="stat-chip-icon">✅</div>
            <div className="stat-chip-val">{totalChecks}</div>
            <div className="stat-chip-lbl">{lang === "ta" ? "மொத்த செயல்கள்" : "Actions Done"}</div>
          </div>
          <div className="stat-chip partial-chip">
            <div className="stat-chip-icon">⚡</div>
            <div className="stat-chip-val">{totalPartial}</div>
            <div className="stat-chip-lbl">{lang === "ta" ? "பகுதி நாட்கள்" : "Partial"}</div>
          </div>
          <div className="stat-chip remaining-chip">
            <div className="stat-chip-icon">📅</div>
            <div className="stat-chip-val">{daysLeft}</div>
            <div className="stat-chip-lbl">{lang === "ta" ? "நாட்கள் மீதம்" : "Days Left"}</div>
          </div>
        </div>
      </div>

      {/* Day grid */}
      <div className="card mb20">
        <div className="muted f12 mb8">{t.selectDay}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {DAYS.map((_, i) => {
            const p = getDayProg(i);
            let cls = "day-pill";
            if (i === selectedDay) cls += " selected";
            else if (p === 3) cls += " done";
            else if (p > 0) cls += " partial";
            if (i === todayIdx) cls += " today";
            return (
              <button key={i} className={cls} onClick={() => setSelectedDay(i)}>
                {p === 3 && i !== selectedDay ? "✓" : i + 1}
              </button>
            );
          })}
        </div>
        <div className="legend mt8">
          <span><span className="legend-dot" style={{ background: "var(--green)" }} />{t.full}</span>
          <span><span className="legend-dot" style={{ background: "var(--gold-light)" }} />{t.partial}</span>
          <span><span className="legend-dot" style={{ background: "var(--border)" }} />{t.pending}</span>
          <span><span className="legend-dot" style={{ border: "2px solid var(--gold)", background: "transparent" }} />{t.today}</span>
        </div>
      </div>

      {/* Day detail */}
      <div className="card mb20">
        <div className="flex-center gap12 mb16">
          <div className="day-badge">{selectedDay + 1}</div>
          <div style={{ flex: 1 }}>
            <div className="cormorant gold bold" style={{ fontSize: 18 }}>{t.dayLabel} {selectedDay + 1}</div>
            {selectedDay === todayIdx && <div className="muted italic" style={{ fontSize: 11 }}>{t.todayLabel}</div>}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["do","give","avoid"].map(k => (
              <span key={k} style={{
                width: 20, height: 20, borderRadius: "50%",
                background: dp[k] ? "var(--green)" : "var(--border-light)",
                border: `1px solid ${dp[k] ? "var(--green)" : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, color: "#fff"
              }}>{dp[k] ? "✓" : ""}</span>
            ))}
          </div>
        </div>

        {[
          { key: "do",    label: t.doLabel,    icon: "🙏", color: "var(--blue-accent)",  text: dayData.do },
          { key: "give",  label: t.giveLabel,  icon: "❤️", color: "var(--pink-accent)",  text: dayData.give },
          { key: "avoid", label: t.avoidLabel, icon: "🕊️", color: "var(--gold)",         text: dayData.avoid },
        ].map(item => (
          <div
            key={item.key}
            className={`check-row ${dp[item.key] ? "checked" : ""}`}
            onClick={() => handleCheck(selectedDay, item.key)}
          >
            <div className={`check-circle ${dp[item.key] ? "checked" : ""}`}>
              {dp[item.key] ? "✓" : ""}
            </div>
            <div style={{ flex: 1 }}>
              <div className="check-label" style={{ color: item.color }}>{item.icon} {item.label}</div>
              <div className={`check-text ${dp[item.key] ? "done" : ""}`}>{item.text}</div>
            </div>
          </div>
        ))}

        {dp.do && dp.give && dp.avoid && (
          <div className="day-complete-badge">
            <span>🌟</span>
            <span>{lang === "ta" ? "இன்று முழுமையானது! மிகவும் நல்லது!" : "Day Complete! Well done!"}</span>
          </div>
        )}
      </div>
    </div>
  );
}
