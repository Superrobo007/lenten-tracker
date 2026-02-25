// src/App.js
import { useState, useEffect } from "react";
import { LanguageProvider, useLang, UI } from "./context/LanguageContext";
import HomeScreen from "./components/HomeScreen";
import AuthScreen from "./components/AuthScreen";
import TrackerScreen from "./components/TrackerScreen";
import LeaderboardScreen from "./components/LeaderboardScreen";
import AdminScreen from "./components/AdminScreen";
import Toast from "./components/Toast";
import { ADMIN_PASSWORD } from "./data/days";
import { registerUser, loginUser } from "./db";
import "./App.css";

function AppInner() {
  const { lang, toggle } = useLang();
  const t = UI[lang];

  const [screen, setScreen] = useState("home");
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("lenten_session");
    if (saved) {
      try { const u = JSON.parse(saved); setUser(u); setScreen("tracker"); }
      catch {}
    }
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleRegister = async (name, password, parish, phone) => {
    try {
      const newUser = await registerUser(name, password, parish, phone);
      localStorage.setItem("lenten_session", JSON.stringify(newUser));
      setUser(newUser);
      setScreen("tracker");
      showToast(t.toastWelcome(newUser.name));
    } catch (e) {
      if (e.message === "NAME_TAKEN") showToast(t.toastNameTaken, "error");
      else showToast(t.toastError, "error");
    }
  };

  const handleLogin = async (name, password) => {
    try {
      const found = await loginUser(name, password);
      localStorage.setItem("lenten_session", JSON.stringify(found));
      setUser(found);
      setScreen("tracker");
      showToast(t.toastBack(found.name));
    } catch (e) {
      if (e.message === "WRONG_PASSWORD") showToast(t.toastWrongPw, "error");
      else showToast(t.toastNotFound, "error");
    }
  };

  const handleAdminLogin = (pass) => {
    if (pass === ADMIN_PASSWORD) { setIsAdmin(true); setScreen("admin"); }
    else showToast(t.toastAdminWrong, "error");
  };

  const logout = () => {
    localStorage.removeItem("lenten_session");
    setUser(null); setIsAdmin(false); setScreen("home");
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <span className="cross">✝</span>
          <div>
            <div className="brand-name">{t.appName}</div>
            <div className="brand-sub">{t.appSub}</div>
          </div>
        </div>
        <div className="header-actions">
          <div className="lang-toggle">
            <button className={`lang-btn ${lang === "ta" ? "active" : ""}`} onClick={() => lang !== "ta" && toggle()}>தமிழ்</button>
            <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => lang !== "en" && toggle()}>EN</button>
          </div>
          {user && <span className="user-badge">🙏 {user.name}</span>}
          {(user || isAdmin) && <button className="ghost-btn" onClick={logout}>{t.logout}</button>}
          {!user && screen !== "home" && <button className="ghost-btn" onClick={() => setScreen("home")}>{t.back}</button>}
          {!isAdmin && !user && screen === "home" && (
            <button className="ghost-btn small" onClick={() => setScreen("adminLogin")}>{t.admin}</button>
          )}
        </div>
      </header>

      {toast && <Toast message={toast.msg} type={toast.type} />}

      <main className="main">
        {screen === "home" && <HomeScreen onRegister={() => setScreen("register")} onLogin={() => setScreen("login")} />}
        {screen === "register" && (
          <AuthScreen
            title={t.register} btnLabel={t.newReg}
            onSubmit={handleRegister} isRegister
            footer={<>{t.alreadyReg} <span className="link" onClick={() => setScreen("login")}>{t.login}</span></>}
          />
        )}
        {screen === "login" && (
          <AuthScreen
            title={t.login} btnLabel={t.login}
            onSubmit={handleLogin}
            footer={<>{t.notReg} <span className="link" onClick={() => setScreen("register")}>{t.newReg}</span></>}
          />
        )}
        {screen === "adminLogin" && (
          <AuthScreen title={t.adminLogin} btnLabel={t.submit} onSubmit={(_, pw) => handleAdminLogin(pw)} isAdminLogin />
        )}
        {/* TrackerScreen — leaderboard button removed; no onLeaderboard prop */}
        {screen === "tracker" && user && (
          <TrackerScreen user={user} showToast={showToast} />
        )}
        {screen === "leaderboard" && (
          <LeaderboardScreen onBack={() => setScreen(user ? "tracker" : "home")} currentUserId={user?.id} />
        )}
        {screen === "admin" && isAdmin && (
          <AdminScreen showToast={showToast} />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return <LanguageProvider><AppInner /></LanguageProvider>;
}
