// src/AuthSuccess.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userString = urlParams.get("user");

    if (token && userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));
        console.log("👁️ USER dari URL:", user);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        localStorage.setItem("email", user.email);
        window.dispatchEvent(new Event("storage")); // Biar update ke App.js
        navigate("/dashboard");
      } catch (err) {
        console.error("❌ Gagal parse user dari URL:", err);
        navigate("/login");
      }
    } else {
      console.warn("❌ Token atau user tidak ditemukan di URL");
      navigate("/login");
    }
  }, [navigate]);

  return <p>Sedang login dengan Google... ⏳</p>;
};

export default AuthSuccess;
