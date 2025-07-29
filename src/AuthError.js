import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthError = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Silakan coba lagi atau login manual.");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("message");
    if (msg) setMessage(decodeURIComponent(msg));
  }, []);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>❌ Login Google Gagal</h2>
      <p>{message}</p>
      <button onClick={() => navigate("/login")} style={{ marginTop: "20px" }}>
        Kembali ke Login
      </button>
    </div>
  );
};

export default AuthError;
