// src/components/LeaderboardScreen.js
import { useState, useEffect } from "react";
import { subscribeLeaderboard } from "../db";
import CircleProgress from "./CircleProgress";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardScreen({ onBack, currentUserId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeLeaderboard(rows => {
      setData(rows);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div>
      <div className="flex-center gap12 mb20">
        {onBack && <button className="ghost-btn" onClick={onBack}>← பின்</button>}
        <h2 className="cormorant gold" style={{ fontSize: 22 }}>🏆 சமூக முன்னேற்றம்</h2>
      </div>

      {loading ? (
        <div className="loading">ஏற்றுகிறது...</div>
      ) : !data.length ? (
        <p className="muted center">இன்னும் யாரும் பங்கேற்கவில்லை</p>
      ) : (
        data.map((p, i) => {
          const pct = Math.round(p.full / 40 * 100);
          const isMe = p.id === currentUserId;
          return (
            <div key={p.id} className={`lb-row ${i < 3 ? "top" : ""} ${isMe ? "me" : ""}`}>
              <div className="lb-medal">{MEDALS[i] || "#" + (i + 1)}</div>
              <div style={{ flex: 1 }}>
                <div className={`lb-name ${i === 0 ? "gold" : ""}`}>
                  {p.name} {isMe && <span className="muted" style={{ fontSize: 10 }}>(நீங்கள்)</span>}
                </div>
                <div className="lb-sub">✅ {p.full} முழு · ⚡ {p.partial} பகுதி</div>
              </div>
              <CircleProgress pct={pct} size={50} />
            </div>
          );
        })
      )}
    </div>
  );
}
