// src/components/AuthScreen.js
import { useState } from "react";

export default function AuthScreen({ title, btnLabel, onSubmit, footer, isPassword }) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim()) onSubmit(value.trim());
  };

  return (
    <div style={{ maxWidth: 380, margin: "40px auto" }}>
      <h2 className="cormorant gold center" style={{ fontSize: 26, marginBottom: 24 }}>{title}</h2>
      <input
        className="input"
        type={isPassword ? "password" : "text"}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSubmit()}
        placeholder={isPassword ? "கடவுச்சொல்" : "உங்கள் பெயர்"}
        autoFocus
      />
      <button className="primary-btn full mt12" onClick={handleSubmit}>{btnLabel}</button>
      {footer && <p className="center mt12 muted f13">{footer}</p>}
    </div>
  );
}
