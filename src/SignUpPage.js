import React, { useState } from 'react';
import './SignUpPage.css';
import illustration from './signupkai.png';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    password: '',
    terms: false,
  });

  const [showVerification, setShowVerification] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showTerms, setShowTerms] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    console.log("CHANGE", e.target.name, e.target.value);
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validasi syarat & ketentuan
  if (!formData.terms) {
    alert("Kamu harus menyetujui Syarat & Ketentuan.");
    return;
  }

  // ✅ Validasi format email
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  if (!isEmailValid) {
    alert("⚠️ Format email tidak valid.");
    return;
  }

  // ✅ Validasi kekuatan password (minimal 8 karakter, huruf besar, kecil, angka, simbol)
  const isPasswordStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(formData.password);
  if (!isPasswordStrong) {
    alert("⚠️ Password harus minimal 8 karakter, dan mengandung huruf besar, kecil, angka, dan simbol.");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setUserEmail(formData.email);
      setShowVerification(true);
    } else {
      alert(data.message || '❌ Gagal mendaftar.');
    }
  } catch (err) {
    setLoading(false);
    console.error(err);
    alert('Terjadi kesalahan saat mendaftar.');
  }
};


 const handleVerify = async () => {
  setVerifying(true);
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, code: enteredCode })
    });

    const data = await res.json();
    setVerifying(false);

    if (res.ok) {
      alert('✅ Verifikasi berhasil! Mengarahkan ke halaman login...');
      navigate('/login'); // 👉 langsung redirect ke login
    } else {
      alert(data.message || '❌ Kode verifikasi salah.');
    }
  } catch (err) {
    setVerifying(false);
    console.error(err);
    alert('Terjadi kesalahan saat verifikasi.');
  }
};

  return (
    <div className="signup-container">
      <div className="signup-left">
        <img src={illustration} alt="Illustration" className="signup-illustration" />
      </div>
      <div className="signup-right">
        <h2>Buat Akun Baru</h2>
        <p className="subtitle">Gabung dengan KAI ROOMS dan mulai kelola rapat online dengan mudah.</p>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label>Nama</label>
          <input type="text" name="nama" value={formData.nama} onChange={handleChange} placeholder="Masukkan Nama" required />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Masukkan Email" required />

          <label>Nomor Telepon</label>
          <input type="tel" name="telepon" value={formData.telepon} onChange={handleChange} placeholder="Masukkan Nomor Telepon" required />

          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Masukkan Password" required />

          <div className="terms">
            <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} />
            <label htmlFor="terms">
            Saya menyetujui{" "}
          <span className="link-syarat" onClick={() => setShowTerms(true)}>
          Syarat & Ketentuan
          </span>
          </label>
          </div>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? '⏳ Mendaftarkan...' : 'Daftar'}
          </button>
        </form>

{showTerms && (
  <div className="popup-syarat">
    <div className="popup-box">
      <h3>Syarat & Ketentuan</h3>
      <ul>
        <li>🔹 Pengguna wajib menggunakan identitas asli dan dapat dipertanggungjawabkan.</li>
        <li>🔹 Dilarang menyalahgunakan sistem KAI ROOMS untuk tindakan yang bertentangan dengan hukum dan etika perusahaan.</li>
        <li>🔹 Informasi yang dimasukkan akan digunakan untuk kepentingan internal dan dijaga kerahasiaannya sesuai kebijakan privasi.</li>
        <li>🔹 Setiap aktivitas pengguna di dalam sistem dapat diawasi untuk memastikan kepatuhan terhadap ketentuan yang berlaku.</li>
        <li>🔹 Dengan mendaftar, pengguna menyetujui untuk mematuhi kebijakan dan peraturan yang ditetapkan oleh PT Kereta Api Indonesia (Persero).</li>
      </ul>
      <button className="signup-button" onClick={() => setShowTerms(false)}>
        Tutup
      </button>
    </div>
  </div>
)}


        {showVerification && (
          <div className="popup-verifikasi-signup">
            <h3>Verifikasi Email</h3>
            <p>Masukkan kode verifikasi yang dikirim ke email Anda:</p>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '10px' }}>
              Kode telah dikirim ke <strong>{userEmail}</strong>
            </p>
            <input
              type="text"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
              placeholder="Kode Verifikasi"
            />
            <button className="signup-button" onClick={handleVerify} disabled={verifying}>
              {verifying ? '⏳ Memverifikasi...' : 'Verifikasi'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUpPage;
