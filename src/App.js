import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SplashScreen from './SplashScreen';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import Dashboard from './Dashboard';
import RiwayatRapat from './riwayatrapat';
import Aktivitas from './Aktivitas';
import Roomstatus from './Roomstatus';
import Notifikasi from './notifikasi';
import HybridMeetingStatus from './HybridMeetingStatus';
import Pengaturan from './Pengaturan';
import AuthSuccess from './AuthSuccess';
import AuthError from './AuthError';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from "./pages/ResetPassword";
import AdminApproval from './AdminApproval';







function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("user"));

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Dengarkan perubahan localStorage → update state auth
 useEffect(() => {
  const syncAuthState = () => {
    const user = localStorage.getItem("user");
    console.log("📦 user from localStorage:", user);
    setIsAuthenticated(!!user);
    console.log("🔄 Auth state updated, isAuthenticated:", !!user);
  };

  // ✅ Langsung cek saat mount
  syncAuthState();

  // ✅ Jaga-jaga kalau pakai event storage juga
  window.addEventListener("storage", syncAuthState);
  return () => window.removeEventListener("storage", syncAuthState);
}, []);


  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
        <Route path="/riwayat-rapat" element={isAuthenticated ? <RiwayatRapat /> : <Navigate to="/login" />} />
        <Route path="/aktivitas" element={isAuthenticated ? <Aktivitas /> : <Navigate to="/login" />} />
        <Route path="/room-status" element={isAuthenticated ? <Roomstatus /> : <Navigate to="/login" />} />
        <Route path="/notifikasi" element={isAuthenticated ? <Notifikasi /> : <Navigate to="/login" />} />
        <Route path="/pengaturan" element={isAuthenticated ? <Pengaturan /> : <Navigate to="/login" />} />
        <Route path="/hybrid-meeting-status" element={isAuthenticated ? <HybridMeetingStatus /> : <Navigate to="/login" />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/auth/error" element={<AuthError />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin-approval" element={<AdminApproval />} />
      </Routes>
    </Router>
  );
}

export default App;
