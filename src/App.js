// src/App.js
import { useState, useEffect } from "react";
import HomeScreen from "./components/HomeScreen";
import AuthScreen from "./components/AuthScreen";
import TrackerScreen from "./components/TrackerScreen";
import LeaderboardScreen from "./components/LeaderboardScreen";
import AdminScreen from "./components/AdminScreen";
import Toast from "./components/Toast";
import { ADMIN_PASSWORD } from "./data/days";
import { registerUser, loginUser } from "./db";
import "./App.css";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState(null);

  // Restore session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lenten_session");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setUser(u);
        setScreen("tracker");
      } catch {}
    }
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleRegister = async (name) => {
    try {
      const newUser = await registerUser(name);
      localStorage.setItem("lenten_session", JSON.stringify(newUser));
      setUser(newUser);
      setScreen("tracker");
      showToast("வரவேற்கிறோம், " + newUser.name + "! 🙏");
    } catch (e) {
      if (e.message === "NAME_TAKEN") showToast("இந்தப் பெயர் ஏற்கனவே உள்ளது", "error");
      else showToast("பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.", "error");
    }
  };

  const handleLogin = async (name) => {
    try {
      const found = await loginUser(name);
      localStorage.setItem("lenten_session", JSON.stringify(found));
      setUser(found);
      setScreen("tracker");
      showToast("மீண்டும் வரவேற்கிறோம், " + found.name + "! 🙏");
    } catch {
      showToast("பெயர் காணவில்லை. முதலில் பதிவு செய்யவும்.", "error");
    }
  };

  const handleAdminLogin = (pass) => {
    if (pass === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setScreen("admin");
    } else {
      showToast("தவறான கடவுச்சொல்", "error");
    }
  };

  const logout = () => {
    localStorage.removeItem("lenten_session");
    setUser(null);
    setIsAdmin(false);
    setScreen("home");
  };

  return (
    <div className="app">
      <div className="ambient-glow" />

      <header className="header">
        <div className="header-brand">
          <span className="cross">✝</span>
          <div>
            <div className="brand-name">TNBC</div>
            <div className="brand-sub">தவக்கால பயண தடிமி</div>
          </div>
        </div>
        <div className="header-actions">
          {user && <span className="user-badge">🙏 {user.name}</span>}
          {(user || isAdmin) && <button className="ghost-btn" onClick={logout}>வெளி</button>}
          {!user && screen !== "home" && <button className="ghost-btn" onClick={() => setScreen("home")}>← பின்</button>}
          {!isAdmin && !user && screen === "home" && (
            <button className="ghost-btn small" onClick={() => setScreen("adminLogin")}>நிர்வாக</button>
          )}
        </div>
      </header>

      {toast && <Toast message={toast.msg} type={toast.type} />}

      <main className="main">
        {screen === "home" && (
          <HomeScreen
            onRegister={() => setScreen("register")}
            onLogin={() => setScreen("login")}
          />
        )}
        {screen === "register" && (
          <AuthScreen
            title="புதிய பதிவு"
            btnLabel="பதிவு செய்யுங்கள்"
            onSubmit={handleRegister}
            footer={<>ஏற்கனவே உள்ளீர்களா? <span className="link" onClick={() => setScreen("login")}>உள்நுழைக</span></>}
          />
        )}
        {screen === "login" && (
          <AuthScreen
            title="உள்நுழைக"
            btnLabel="உள்நுழைக"
            onSubmit={handleLogin}
            footer={<>புதியவரா? <span className="link" onClick={() => setScreen("register")}>பதிவு செய்க</span></>}
          />
        )}
        {screen === "adminLogin" && (
          <AuthScreen
            title="நிர்வாக உள்நுழைவு"
            btnLabel="உள்நுழைக"
            isPassword
            onSubmit={handleAdminLogin}
          />
        )}
        {screen === "tracker" && user && (
          <TrackerScreen
            user={user}
            onLeaderboard={() => setScreen("leaderboard")}
            showToast={showToast}
          />
        )}
        {screen === "leaderboard" && (
          <LeaderboardScreen
            onBack={() => setScreen(user ? "tracker" : "home")}
            currentUserId={user?.id}
          />
        )}
        {screen === "admin" && isAdmin && (
          <AdminScreen showToast={showToast} onLeaderboard={() => setScreen("leaderboard")} />
        )}
      </main>
    </div>
  );
}
