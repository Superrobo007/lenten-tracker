// src/components/CircleProgress.js
export default function CircleProgress({ pct, size = 78, light }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const trackColor = light ? "#DDD0BB" : "var(--border)";
  const fillColor = light ? "#8B6914" : "var(--gold)";

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth="7" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={fillColor} strokeWidth="7"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size > 60 ? 14 : 10, fontWeight: 700, color: fillColor,
        fontFamily: "'Cormorant Garamond', serif"
      }}>
        {pct}%
      </div>
    </div>
  );
}
