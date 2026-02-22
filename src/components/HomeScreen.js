// src/components/HomeScreen.js
export default function HomeScreen({ onRegister, onLogin }) {
  return (
    <div className="center" style={{ paddingTop: 50 }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>✝</div>
      <h1 className="cormorant gold" style={{ fontSize: 32, letterSpacing: 3, marginBottom: 6 }}>
        தவக்கால பயணம்
      </h1>
      <p className="muted f13" style={{ marginBottom: 4 }}>Lenten Journey 2026 · 40 நாட்கள்</p>
      <p className="muted" style={{ fontSize: 11, marginBottom: 48 }}>
        TNBC Commission for Charismatic Renewal and Proclamation
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 280, margin: "0 auto" }}>
        <button className="primary-btn" onClick={onRegister}>புதிய பதிவு</button>
        <button className="secondary-btn" onClick={onLogin}>மீண்டும் உள்நுழை</button>
      </div>
    </div>
  );
}
