// src/components/HomeScreen.js
import { useLang, UI } from "../context/LanguageContext";

export default function HomeScreen({ onRegister, onLogin }) {
  const { lang } = useLang();
  const t = UI[lang];
  return (
    <div className="center" style={{ paddingTop: 40 }}>
      <div className="home-cross">✝</div>
      <h1 className="home-title">{t.welcome}</h1>
      <div className="home-purple-line" />
      <p className="muted f13" style={{ marginBottom: 4 }}>{t.subtitle}</p>
      <p className="muted italic" style={{ fontSize: 11, marginBottom: 48 }}>{t.org}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 280, margin: "0 auto" }}>
        <button className="primary-btn" onClick={onRegister}>{t.newReg}</button>
        <button className="secondary-btn" onClick={onLogin}>{t.loginAgain}</button>
      </div>
    </div>
  );
}
