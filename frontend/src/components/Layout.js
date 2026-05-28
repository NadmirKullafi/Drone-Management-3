import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const ikonat = {
  dashboard: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  drone: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/>
      <path d="M5 5l2.5 2.5M19 5l-2.5 2.5M5 19l2.5-2.5M19 19l-2.5-2.5"/>
      <circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/>
      <circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/>
    </svg>
  ),
  flight: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M12 2L8 6H3l3 4-2 5 8-2 8 2-2-5 3-4h-5L12 2z"/>
    </svg>
  ),
  alert: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  logout: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  menu: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
};

export default function Layout() {
  const { perdoruesi, dalje } = useAuth();
  const navigate = useNavigate();
  const [sidebarHapur, setSidebarHapur] = useState(false);

  const handleDalje = () => {
    dalje();
    navigate('/hyrje');
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarHapur ? 'hapur' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            {ikonat.drone}
          </div>
          <span className="logo-text">DroneControl</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({isActive}) => `nav-item ${isActive ? 'aktiv' : ''}`}
            onClick={() => setSidebarHapur(false)}>
            {ikonat.dashboard}
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/dronat" className={({isActive}) => `nav-item ${isActive ? 'aktiv' : ''}`}
            onClick={() => setSidebarHapur(false)}>
            {ikonat.drone}
            <span>Dronat</span>
          </NavLink>
          <NavLink to="/fluturimet" className={({isActive}) => `nav-item ${isActive ? 'aktiv' : ''}`}
            onClick={() => setSidebarHapur(false)}>
            {ikonat.flight}
            <span>Fluturimet</span>
          </NavLink>
          <NavLink to="/alarmet" className={({isActive}) => `nav-item ${isActive ? 'aktiv' : ''}`}
            onClick={() => setSidebarHapur(false)}>
            {ikonat.alert}
            <span>Alarmet</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {perdoruesi?.emri?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="user-name">{perdoruesi?.emri}</div>
              <div className="user-role">{perdoruesi?.roli}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={handleDalje} title="Dil">
            {ikonat.logout}
          </button>
        </div>
      </aside>

      {/* Overlay për mobile */}
      {sidebarHapur && (
        <div className="overlay" onClick={() => setSidebarHapur(false)} />
      )}

      {/* Kontent kryesor */}
      <main className="main-content">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setSidebarHapur(!sidebarHapur)}>
            {ikonat.menu}
          </button>
          <div className="topbar-right">
            <div className="status-dot aktiv"></div>
            <span className="topbar-user">{perdoruesi?.emri}</span>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
