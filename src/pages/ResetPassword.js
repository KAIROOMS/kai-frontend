import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) return setMessage(data.message || "Gagal reset password.");

      setMessage(data.message);
      setTimeout(() => navigate("/login"), 2000); // redirect ke login
    } catch (err) {
      console.error(err);
      setMessage("Terjadi kesalahan saat reset password.");
    }
  };

  return (
    <div className="reset-container">
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="Masukkan password baru"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />
      <button onClick={handleReset} className="btn-reset">Simpan Password</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ResetPassword;