import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [forma, setForma] = useState({ emri: '', email: '', fjalekalimi: '', roli: 'operator' });
  const [gabim, setGabim] = useState('');
  const [duke_regjistruar, setDukeRegjistruar] = useState(false);
  const { regjistro } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGabim('');
    setDukeRegjistruar(true);
    try {
      await regjistro(forma);
      navigate('/');
    } catch (err) {
      setGabim(err.response?.data?.mesazhi || 'Gabim gjatë regjistrimit.');
    } finally {
      setDukeRegjistruar(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-circles">
          <div className="circle c1"></div>
          <div className="circle c2"></div>
          <div className="circle c3"></div>
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"/>
                <path d="M5 5l2.5 2.5M19 5l-2.5 2.5M5 19l2.5-2.5M19 19l-2.5-2.5"/>
                <circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/>
                <circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/>
              </svg>
            </div>
            <h1>DroneControl</h1>
          </div>

          <h2 className="auth-title">Krijoni llogari</h2>
          <p className="auth-subtitle">Bashkohuni me ekipin tuaj të dronave</p>

          {gabim && <div className="auth-error">{gabim}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Emri i plotë</label>
              <input
                type="text"
                placeholder="Nadi Kola"
                value={forma.emri}
                onChange={e => setForma({...forma, emri: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="nadi@shembull.al"
                value={forma.email}
                onChange={e => setForma({...forma, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Fjalëkalimi</label>
              <input
                type="password"
                placeholder="Minimum 6 karaktere"
                value={forma.fjalekalimi}
                onChange={e => setForma({...forma, fjalekalimi: e.target.value})}
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label>Roli</label>
              <select
                value={forma.roli}
                onChange={e => setForma({...forma, roli: e.target.value})}
              >
                <option value="operator">Operator</option>
                <option value="admin">Administrator</option>
                <option value="vëzhgues">Vëzhgues</option>
              </select>
            </div>
            <button type="submit" className="btn-auth" disabled={duke_regjistruar}>
              {duke_regjistruar ? (
                <span className="btn-loading">
                  <div className="btn-spinner"></div>
                  Duke regjistruar...
                </span>
              ) : 'Regjistrohu'}
            </button>
          </form>

          <p className="auth-switch">
            Keni llogari? <Link to="/hyrje">Hyni këtu</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
