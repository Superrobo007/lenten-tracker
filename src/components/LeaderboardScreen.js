// src/components/LeaderboardScreen.js
import { useState, useEffect } from "react";
import { subscribeLeaderboard } from "../db";
import { useLang, UI } from "../context/LanguageContext";
import CircleProgress from "./CircleProgress";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardScreen({ onBack, currentUserId }) {
  const { lang } = useLang();
  const t = UI[lang];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeLeaderboard(rows => { setData(rows); setLoading(false); });
    return () => unsub();
  }, []);

  return (
    <div>
      <div className="flex-center gap12 mb20">
        {onBack && <button className="ghost-btn" onClick={onBack}>{t.back}</button>}
        <h2 className="cormorant gold" style={{ fontSize: 22 }}>{t.lbTitle}</h2>
      </div>

      {loading ? (
        <div className="loading">{t.loading}</div>
      ) : !data.length ? (
        <p className="muted center italic">{t.noData}</p>
      ) : (
        data.map((p, i) => {
          const pct = Math.round(p.full / 40 * 100);
          const isMe = p.id === currentUserId;
          return (
            <div key={p.id} className={`lb-row ${i < 3 ? "top" : ""} ${isMe ? "me" : ""}`}>
              <div className="lb-medal">{MEDALS[i] || "#" + (i + 1)}</div>
              <div style={{ flex: 1 }}>
                <div className={`lb-name ${i === 0 ? "gold-text" : ""}`}>
                  {p.name} {isMe && <span className="muted" style={{ fontSize: 10 }}>{t.youLabel}</span>}
                </div>
                <div className="lb-sub">✅ {p.full} {t.fullMark} · ⚡ {p.partial} {t.partialMark}</div>
              </div>
              <CircleProgress pct={pct} size={50} light />
            </div>
          );
        })
      )}
    </div>
  );
}
