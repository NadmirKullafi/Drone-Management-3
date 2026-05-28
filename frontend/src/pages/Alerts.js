import React, { useState } from 'react';
import {
  useMerrAlarmetQuery,
  useMerrDronatQuery,
  useKrijoAlarmMutation,
  useLexoAlarmMutation,
  useZgjidhAlarmMutation
} from '../store/apiSlice';
import './Alerts.css';

const prioritetiNgjyrat = {
  i_ulët: { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' },
  mesatar: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  i_lartë: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  kritik:  { color: '#ff2d2d', bg: 'rgba(255,45,45,0.15)', border: 'rgba(255,45,45,0.3)' }
};

const llojIkona = {
  bateri_ulët: '🔋', sinyal_humbur: '📡', 'zonë_e_ndaluar': '⛔',
  motor_defekt: '⚙️', mot_i_keq: '🌩️', kolizion: '💥', tjetër: '⚠️'
};

export default function Alerts() {
  const [tregaModal, setTregaModal] = useState(false);
  const [filtriLexuar, setFiltriLexuar] = useState('');
  const [forma, setForma] = useState({ droni: '', lloji: 'bateri_ulët', mesazhi: '', prioriteti: 'mesatar' });

  // RTK Query hooks
  const { data: alertsData, isLoading } = useMerrAlarmetQuery(
    filtriLexuar !== '' ? { lexuar: filtriLexuar } : {},
    { pollingInterval: 20000 } // Rifresko çdo 20 sekonda
  );
  const { data: dronatData } = useMerrDronatQuery({ limit: 50 });

  const [krijoAlarm] = useKrijoAlarmMutation();
  const [lexoAlarm] = useLexoAlarmMutation();
  const [zgjidhAlarm] = useZgjidhAlarmMutation();

  const alarmet = alertsData?.alarmet || [];
  const dronat = dronatData?.dronat || [];
  const te_palexuarat = alarmet.filter(a => !a.lexuar).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await krijoAlarm(forma).unwrap();
      setTregaModal(false);
      setForma({ droni: '', lloji: 'bateri_ulët', mesazhi: '', prioriteti: 'mesatar' });
    } catch (err) { console.error(err); }
  };

  return (
    <div className="alerts-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Alarmet
            {te_palexuarat > 0 && <span className="unread-badge">{te_palexuarat}</span>}
          </h1>
          <p className="page-subtitle">Monitorimi i ngjarjeve dhe alarmeve</p>
        </div>
        <button className="btn-add" onClick={() => setTregaModal(true)}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Shto Alarm
        </button>
      </div>

      <div className="filters-bar" style={{marginBottom:'20px'}}>
        <select value={filtriLexuar} onChange={e => setFiltriLexuar(e.target.value)} className="filter-select">
          <option value="">Të gjithë alarmet</option>
          <option value="false">Të palexuar</option>
          <option value="true">Të lexuar</option>
        </select>
      </div>

      {isLoading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : alarmet.length === 0 ? (
        <div className="empty-center">
          <div className="empty-icon">✅</div>
          <h3>Nuk ka alarme</h3>
          <p>Sistemi po funksionon normalisht</p>
        </div>
      ) : (
        <div className="alerts-list">
          {alarmet.map(alarm => {
            const p = prioritetiNgjyrat[alarm.prioriteti] || prioritetiNgjyrat.mesatar;
            return (
              <div key={alarm._id}
                className={`alert-card ${alarm.lexuar ? 'lexuar' : ''} ${alarm.zgjidhur ? 'zgjidhur' : ''}`}
                style={{ borderColor: alarm.zgjidhur ? 'var(--border)' : p.border, background: alarm.zgjidhur ? 'var(--bg-card)' : p.bg }}>
                <div className="alert-icon-wrap">
                  <span className="alert-emoji">{llojIkona[alarm.lloji] || '⚠️'}</span>
                </div>
                <div className="alert-content">
                  <div className="alert-top">
                    <span className="alert-drone">{alarm.droni?.emri || 'Sistemi'}</span>
                    <span className="alert-time">{new Date(alarm.koha).toLocaleString('sq-AL')}</span>
                  </div>
                  <p className="alert-message" style={{color: alarm.zgjidhur ? 'var(--text-muted)' : p.color}}>
                    {alarm.mesazhi}
                  </p>
                  <div className="alert-meta">
                    <span className="alert-type">{alarm.lloji.replace(/_/g, ' ')}</span>
                    <span className="alert-prioritet" style={{color: p.color}}>{alarm.prioriteti.replace('_',' ').toUpperCase()}</span>
                    {alarm.zgjidhur && <span className="alert-solved">✓ Zgjidhur</span>}
                  </div>
                </div>
                {!alarm.zgjidhur && (
                  <div className="alert-actions">
                    {!alarm.lexuar && (
                      <button className="btn-read" onClick={() => lexoAlarm(alarm._id)}>Lexo</button>
                    )}
                    <button className="btn-solve" onClick={() => zgjidhAlarm(alarm._id)}>Zgjidh</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tregaModal && (
        <div className="modal-overlay" onClick={() => setTregaModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Shto Alarm Manual</h2>
              <button className="modal-close" onClick={() => setTregaModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Droni (Opsional)</label>
                <select value={forma.droni} onChange={e => setForma({...forma, droni: e.target.value})}>
                  <option value="">Alarm i Sistemit</option>
                  {dronat.map(d => <option key={d._id} value={d._id}>{d.emri}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Lloji *</label>
                  <select required value={forma.lloji} onChange={e => setForma({...forma, lloji: e.target.value})}>
                    <option value="bateri_ulët">Bateri e Ulët</option>
                    <option value="sinyal_humbur">Sinyal i Humbur</option>
                    <option value="zonë_e_ndaluar">Zonë e Ndaluar</option>
                    <option value="motor_defekt">Motor me Defekt</option>
                    <option value="mot_i_keq">Mot i Keq</option>
                    <option value="kolizion">Rrezik Kolizioni</option>
                    <option value="tjetër">Tjetër</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Prioriteti *</label>
                  <select value={forma.prioriteti} onChange={e => setForma({...forma, prioriteti: e.target.value})}>
                    <option value="i_ulët">I Ulët</option>
                    <option value="mesatar">Mesatar</option>
                    <option value="i_lartë">I Lartë</option>
                    <option value="kritik">Kritik</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Mesazhi *</label>
                <textarea required rows="3" placeholder="Përshkruani alarmin..." value={forma.mesazhi} onChange={e => setForma({...forma, mesazhi: e.target.value})} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setTregaModal(false)}>Anulo</button>
                <button type="submit" className="btn-save">Shto Alarmin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
