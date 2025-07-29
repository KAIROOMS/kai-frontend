import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminApproval.css';
import axios from 'axios';

const AdminApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const currentUserEmail = localStorage.getItem('email');

  const adminEmails = ["sbilla241@gmail.com", "admin@kai.id"];

  useEffect(() => {
    if (!adminEmails.includes(currentUserEmail)) {
      alert("Akses ditolak. Hanya admin yang dapat membuka halaman ini.");
      navigate("/dashboard");
      return;
    }

    const fetchPendingUsers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/pending-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.users.length > 0) {
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 4000); // Alert otomatis hilang
        }

        setPendingUsers(res.data.users);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data user.");
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, [currentUserEmail, navigate, token]);

  const handleApprove = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/approve-user/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPendingUsers(prev => prev.filter(user => user._id !== id));
      alert("✅ User berhasil disetujui.");
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menyetujui user.");
    }
  };

  return (
    <div className="admin-approval-container">
      <h2>Daftar User Menunggu Persetujuan</h2>

      {showAlert && (
        <div className="alert-notification">
          🔔 Ada user baru menunggu persetujuan!
        </div>
      )}

      {loading ? (
        <p>🔄 Memuat...</p>
      ) : pendingUsers.length === 0 ? (
        <p>Tidak ada user yang menunggu.</p>
      ) : (
        <ul className="user-list">
          {pendingUsers.map(user => (
            <li key={user._id} className="user-item">
              <div>
                <strong>{user.nama}</strong> - {user.email}
              </div>
              <button onClick={() => handleApprove(user._id)} className="approve-btn">
                Setujui
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminApproval;
