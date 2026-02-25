// src/components/AuthScreen.js
import { useState } from "react";
import { useLang, UI } from "../context/LanguageContext";

export default function AuthScreen({ title, btnLabel, onSubmit, footer, isRegister, isAdminLogin }) {
  const { lang } = useLang();
  const t = UI[lang];
  const [name, setName] = useState("");
  const [parish, setParish] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = () => {
    if (isAdminLogin) { if (password.trim()) onSubmit("", password.trim()); return; }
    if (isRegister) {
      if (name.trim() && password.trim()) onSubmit(name.trim(), password.trim(), parish.trim(), phone.trim());
      return;
    }
    if (name.trim() && password.trim()) onSubmit(name.trim(), password.trim());
  };

  const labelStyle = {
    fontSize: 11, color: "var(--muted)", fontWeight: 600,
    letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <div className="center" style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 36, color: "var(--gold)", marginBottom: 8 }}>✝</div>
        <h2 className="cormorant gold" style={{ fontSize: 26 }}>{title}</h2>
      </div>

      <div className="card">
        {!isAdminLogin && (
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>{t.namePlaceholder}</label>
            <input className="input" type="text" value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder={t.namePlaceholder} autoFocus />
          </div>
        )}

        {isRegister && (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>{lang === "ta" ? "ஆலயம் / இடம்" : "Parish / Location"}</label>
              <input className="input" type="text" value={parish}
                onChange={e => setParish(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder={lang === "ta" ? "உங்கள் ஆலயம் / ஊர்" : "Your parish or town"} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>{lang === "ta" ? "தொலைபேசி எண்" : "Phone Number"}</label>
              <input className="input" type="text" value={phone}
                onChange={e => setPhone(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder={lang === "ta" ? "உங்கள் தொலைபேசி எண்" : "Your phone number"} />
            </div>
          </>
        )}

        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>{t.passwordPlaceholder}</label>
          <div style={{ position: "relative" }}>
            <input className="input" type={showPw ? "text" : "password"} value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder={t.passwordPlaceholder}
              autoFocus={isAdminLogin} style={{ paddingRight: 44 }} />
            <button onClick={() => setShowPw(v => !v)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--muted)" }}>
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
          {isRegister && (
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 5, fontStyle: "italic" }}>
              {lang === "ta" ? "இந்த கடவுச்சொல்லை நினைவில் வையுங்கள் — உள்நுழைய இது தேவைப்படும்" : "Remember this password — you will need it to log in"}
            </p>
          )}
        </div>

        <button className="primary-btn full" onClick={handleSubmit}>{btnLabel}</button>
        {footer && <p className="center mt12 muted f13">{footer}</p>}
      </div>
    </div>
  );
}
