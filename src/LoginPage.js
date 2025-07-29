import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import illustration from "./KAI_ROOMS_illustration.png";
import googleLogo from "./google-logo.png";
import { GoogleLogin } from "@react-oauth/google";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("🔵 Response dari login:", data);

    if (!res.ok) {
  console.warn("❗ Login gagal di res.ok:", data.message);
  setPopupMessage(data.message || "❌ Gagal login. Coba lagi.");
  setShowPopup(true);
  return;
}

if (!data.user?.verified) {
  console.warn("❗ Akun belum diverifikasi.");
  setPopupMessage("⚠️ Akun kamu belum diverifikasi.");
  setShowPopup(true);
  return;
}

if (!data.user?.isApproved) {
  console.warn("❗ Akun belum disetujui admin.");
  setPopupMessage("⚠️ Akun kamu belum disetujui oleh admin.");
  setShowPopup(true);
  return;
}


   

    // ✅ Simpan user & trigger manual storage event
    const finalUser = {
  ...data.user,
  _id: data.user.id  // pastikan _id dipakai di seluruh frontend
};
console.log("🔥 Lolos semua validasi, menyimpan ke localStorage...");
console.log("🔐 Final user yang disimpan:", finalUser);
localStorage.setItem("user", JSON.stringify(finalUser));
    localStorage.setItem("token", data.token); 
    localStorage.setItem("email", data.user.email); 
    // ✅ Trigger event agar App.js detect perubahan
    window.dispatchEvent(new Event("storage"));

    console.log("✅ Navigating to dashboard...");
    navigate("/dashboard");
  } catch (err) {
    console.error(err);
    setPopupMessage("❌ Terjadi kesalahan saat login.");
    setShowPopup(true);
  }
};

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={illustration} alt="KAI ROOMS" className="illustration" />
        <p className="tagline">
          Kelola dan ikuti rapat online dengan mudah di platform meeting resmi dari KAI.
        </p>
      </div>

      <div className="login-right">
        <h2>Masuk ke Akun Anda</h2>
        <p className="subtitle">
          Kelola rapat online dengan mudah dan tetap produktif bersama KAI ROOMS.
        </p>

        <input
          type="email"
          placeholder="Masukkan Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Masukkan Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="options">
          <label className="remember">
            <input type="checkbox" />
            Ingat Saya
          </label>
          <span className="forgot" onClick={() => navigate("/forgot-password")} style={{ cursor: "pointer", color: "blue" }}>
          Forgot password
          </span>
        </div>

        <button className="btn-login" onClick={handleLogin}>Masuk</button>

        <button className="btn-google" onClick={() => {
  window.location.href = process.env.REACT_APP_API_URL+"/api/auth/google";
}}>
  <img src={googleLogo} alt="Google Logo" style={{ width: '20px', marginRight: '10px' }} />
  Sign in with Google
</button>



        

        <p className="register">
          Belum punya akun?{" "}
          <Link to="/signup" className="link" style={{ color: 'blue' }}>
            Daftar di sini
          </Link>
        </p>

        {showPopup && (
          <div className="popup-verifikasi-signup">
            <h3>Login Gagal</h3>
            <p>{popupMessage}</p>
            <button className="signup-button" onClick={() => setShowPopup(false)}>Tutup</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;