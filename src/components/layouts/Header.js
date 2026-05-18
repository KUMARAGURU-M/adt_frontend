// src/components/layouts/Header.js

import React from 'react';
import { useNavigate } from 'react-router-dom'; // ← ADD
import './Header.css';

const Header = () => {
  const navigate = useNavigate(); // ← ADD

  return (
    <header className="main-header">

      <div className="header-brand">
        <h1 className="company-title">
          <span className="text-pink">ARROW</span>
          <span className="text-gray">DATA</span>
          <span className="text-cyan">TECH</span>
        </h1>
        <p className="company-location">Puducherry</p>
      </div>

      <div className="header-divider" aria-hidden="true" />

      <div className="header-user">
        <div className="user-details">
          <span className="logged-label">Logged in as</span>
          <strong className="user-name">T. Mohamed Usen</strong>
        </div>
        {/* ↓ ONLY CHANGE — add onClick */}
        <button className="logout-button" onClick={() => navigate('/login')}>
          Logout
        </button>
      </div>

    </header>
  );
};

export default Header;