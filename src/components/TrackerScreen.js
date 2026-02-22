// src/components/TrackerScreen.js
import { useState, useEffect } from "react";
import { DAYS, getLentenDay } from "../data/days";
import { getProgress, saveProgress, subscribeReminders } from "../db";
import { useLang, UI } from "../context/LanguageContext";
import CircleProgress from "./CircleProgress";

export default function TrackerScreen({ user, onLeaderboard, showToast }) {
  const { lang } = useLang();
  const t = UI[lang];
  const [progress, setProgress] = useState({});
  const [selectedDay, setSelectedDay] = useState(getLentenDay());
  const [banner, setBanner] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getProgress(user.id).then(p => { setProgress(p); setLoaded(true); });
    const unsub = subscribeReminders(rems => { if (rems.length) setBanner(rems[0]); });
    return () => unsub();
  }, [user.id]);

  const handleCheck = async (dayIdx, field) => {
    const key = "d" + dayIdx;
    const cur = progress[key] || {};
    const updated = { ...progress, [key]: { ...cur, [field]: !cur[field] } };
    setProgress(updated);
    await saveProgress(user.id, dayIdx, updated[key]);
  };

  const getDayProg = i => {
    const d = progress["d" + i] || {};
    return [d.do, d.give, d.avoid].filter(Boolean).length;
  };

  const totalFull = Object.keys(progress).filter(k => {
    const d = progress[k]; return k.startsWith("d") && d?.do && d?.give && d?.avoid;
  }).length;

  const pct = Math.round(totalFull / 40 * 100);
  const todayIdx = getLentenDay();
  const dayData = DAYS[selectedDay][lang];
  const dp = progress["d" + selectedDay] || {};

  if (!loaded) return <div className="loading">{t.loading}</div>;

  return (
    <div>
      {/* Reminder banner */}
      {banner && (
        <div className="reminder-banner">
          <span>📣</span>
          <span style={{ flex: 1 }}>{banner.text}</span>
          <span className="muted f10">{banner.date}</span>
          <span className="banner-close" onClick={() => setBanner(null)}>✕</span>
        </div>
      )}

      {/* Progress summary */}
      <div className="card flex-center gap12 mb20" style={{ flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <div className="muted f12 mb8">{t.progress}</div>
          <div className="cormorant gold" style={{ fontSize: 30, fontWeight: 700 }}>
            {totalFull}<span className="muted" style={{ fontSize: 14 }}>{t.days}</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: pct + "%" }} />
          </div>
        </div>
        <CircleProgress pct={pct} size={78} />
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
            return <button key={i} className={cls} onClick={() => setSelectedDay(i)}>{i + 1}</button>;
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
          <div>
            <div className="cormorant gold bold" style={{ fontSize: 18 }}>{t.dayLabel} {selectedDay + 1}</div>
            {selectedDay === todayIdx && <div className="muted italic" style={{ fontSize: 11 }}>{t.todayLabel}</div>}
          </div>
          <div className="muted f13" style={{ marginLeft: "auto" }}>{getDayProg(selectedDay)}/3</div>
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
      </div>

      <button className="secondary-btn full" onClick={onLeaderboard}>{t.leaderboard}</button>
    </div>
  );
}
