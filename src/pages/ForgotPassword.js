import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      setSubmitted(true);
      setMessage(data.message || '✅ Jika email terdaftar, instruksi reset password sudah dikirim.');
    } catch (err) {
      console.error(err);
      setSubmitted(true);
      setMessage('❌ Terjadi kesalahan. Coba lagi nanti.');
    }
  };

  return (
    <div className="forgot-container">
      <h2>Lupa Password?</h2>
      <p>Masukkan email Anda untuk mengatur ulang password.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <button type="submit" className="btn-forgot">Kirim</button>
      </form>
      {submitted && <p className="notif-message">{message}</p>}
    </div>
  );
};

export default ForgotPassword;