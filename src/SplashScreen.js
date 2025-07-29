import React from 'react';
import './SplashScreen.css';
import logo from './KAI_ROOMS_logo.png';

function SplashScreen() {
  return (
    <div className="splash-screen">
      <img src={logo} alt="KAI_ROOMS_logo" className="logo" />
      <h1>KAI ROOMS</h1>
      <p>Optimizing Collaboration, Enhancing Productivity</p>

      <footer className="splash-footer">
        <p>© 2025 KAI Rooms by Salsabilla</p>
      </footer>
    </div>
  );
}

export default SplashScreen;
