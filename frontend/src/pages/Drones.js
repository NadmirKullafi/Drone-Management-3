import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useMerrDronatQuery,
  useShtoDronMutation,
  useFshiDronMutation
} from '../store/apiSlice';
import './Drones.css';

const modalBosh = {
  emri: '', modeli: '', numriSerial: '', pesha: '', ngarkesaMax: '',
  kohaMaksimaleFluturimit: '', shpejtesiaMax: '', rangu: '', kamera: true, gps: true, shenimet: ''
};

export default function Drones() {
  const [tregaModal, setTregaModal] = useState(false);
  const [forma, setForma] = useState(modalBosh);
  const [gabim, setGabim] = useState('');
  const [kerkimi, setKerkimi] = useState('');
  const [filtriStatus, setFiltriStatus] = useState('');

  // RTK Query hooks
  const { data, isLoading } = useMerrDronatQuery(
    { kerkimi, statusi: filtriStatus },
    { pollingInterval: 30000 } // Rifresko çdo 30 sekonda automatikisht
  );
  const [shtoDron] = useShtoDronMutation();
  const [fshiDron] = useFshiDronMutation();

  const dronat = data?.dronat || [];
  const total = data?.total || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGabim('');
    try {
      await shtoDron(forma).unwrap();
      setTregaModal(false);
      setForma(modalBosh);
    } catch (err) {
      setGabim(err.data?.mesazhi || 'Gabim gjatë shtimit.');
    }
  };

  const handleFshi = async (id) => {
    if (!window.confirm('A jeni i sigurt që doni ta fshini këtë dron?')) return;
    try {
      await fshiDron(id).unwrap();
    } catch (err) {
      alert(err.data?.mesazhi || 'Gabim gjatë fshirjes.');
    }
  };

  return (
    <div className="drones-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dronat</h1>
          <p className="page-subtitle">{total} drone të regjistruar</p>
        </div>
        <button className="btn-add" onClick={() => setTregaModal(true)}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Shto Dron
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input placeholder="Kërko dron..." value={kerkimi} onChange={e => setKerkimi(e.target.value)} />
        </div>
        <select value={filtriStatus} onChange={e => setFiltriStatus(e.target.value)} className="filter-select">
          <option value="">Të gjithë statuset</option>
          <option value="aktiv">Aktiv</option>
          <option value="në_fluturim">Në fluturim</option>
          <option value="mirëmbajtje">Mirëmbajtje</option>
          <option value="joaktiv">Joaktiv</option>
          <option value="i_dëmtuar">I dëmtuar</option>
        </select>
      </div>

      {isLoading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : dronat.length === 0 ? (
        <div className="empty-center">
          <div className="empty-icon">🚁</div>
          <h3>Nuk ka drone</h3>
          <p>Shtoni dronin e parë për të filluar menaxhimin</p>
          <button className="btn-add" onClick={() => setTregaModal(true)}>Shto Dronin e Parë</button>
        </div>
      ) : (
        <div className="drones-grid">
          {dronat.map(dron => (
            <div key={dron._id} className="drone-card">
              <div className="drone-card-header">
                <div className="drone-model-badge">{dron.modeli}</div>
                <span className={`badge badge-${dron.statusi}`}>{dron.statusi.replace('_', ' ')}</span>
              </div>
              <div className="drone-icon-big">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24" opacity="0.2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M5 5l2.5 2.5M19 5l-2.5 2.5M5 19l2.5-2.5M19 19l-2.5-2.5"/>
                  <circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/>
                  <circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/>
                </svg>
              </div>
              <h3 className="drone-name">{dron.emri}</h3>
              <p className="drone-serial">#{dron.numriSerial}</p>
              <div className="drone-battery">
                <div className="battery-label">
                  <span>Bateria</span>
                  <span style={{ color: dron.bateria > 50 ? '#10b981' : dron.bateria > 20 ? '#f59e0b' : '#ef4444' }}>{dron.bateria}%</span>
                </div>
                <div className="battery-track">
                  <div className="battery-progress" style={{ width: `${dron.bateria}%`, background: dron.bateria > 50 ? '#10b981' : dron.bateria > 20 ? '#f59e0b' : '#ef4444' }}></div>
                </div>
              </div>
              <div className="drone-specs">
                <div className="spec-item">
                  <span className="spec-label">Fluturime</span>
                  <span className="spec-value">{dron.fluturimeTotale}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Shpejtësia</span>
                  <span className="spec-value">{dron.shpejtesiaMax} km/h</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Rangu</span>
                  <span className="spec-value">{dron.rangu} km</span>
                </div>
              </div>
              <div className="drone-actions">
                <Link to={`/dronat/${dron._id}`} className="btn-details">Detaje</Link>
                <button className="btn-delete" onClick={() => handleFshi(dron._id)}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {tregaModal && (
        <div className="modal-overlay" onClick={() => setTregaModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Shto Dron të Ri</h2>
              <button className="modal-close" onClick={() => setTregaModal(false)}>✕</button>
            </div>
            {gabim && <div className="auth-error" style={{margin:'0 0 12px'}}>{gabim}</div>}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Emri i Dronit *</label>
                  <input required placeholder="p.sh. Falcon Alpha" value={forma.emri} onChange={e => setForma({...forma, emri: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Modeli *</label>
                  <input required placeholder="p.sh. DJI Phantom 4" value={forma.modeli} onChange={e => setForma({...forma, modeli: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Numri Serial *</label>
                <input required placeholder="p.sh. SN-2024-001" value={forma.numriSerial} onChange={e => setForma({...forma, numriSerial: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Pesha (kg) *</label>
                  <input type="number" step="0.1" min="0.1" required value={forma.pesha} onChange={e => setForma({...forma, pesha: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Ngarkesa Max (kg) *</label>
                  <input type="number" step="0.1" min="0" required value={forma.ngarkesaMax} onChange={e => setForma({...forma, ngarkesaMax: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Koha Max Fluturimit (min) *</label>
                  <input type="number" min="1" required value={forma.kohaMaksimaleFluturimit} onChange={e => setForma({...forma, kohaMaksimaleFluturimit: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Shpejtësia Max (km/h) *</label>
                  <input type="number" min="1" required value={forma.shpejtesiaMax} onChange={e => setForma({...forma, shpejtesiaMax: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Rangu (km) *</label>
                <input type="number" step="0.1" min="0.1" required value={forma.rangu} onChange={e => setForma({...forma, rangu: e.target.value})} />
              </div>
              <div className="form-row checkboxes">
                <label className="checkbox-label">
                  <input type="checkbox" checked={forma.kamera} onChange={e => setForma({...forma, kamera: e.target.checked})} /> Ka Kamerë
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={forma.gps} onChange={e => setForma({...forma, gps: e.target.checked})} /> Ka GPS
                </label>
              </div>
              <div className="form-group">
                <label>Shënime</label>
                <textarea rows="3" placeholder="Shënime opsionale..." value={forma.shenimet} onChange={e => setForma({...forma, shenimet: e.target.value})} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setTregaModal(false)}>Anulo</button>
                <button type="submit" className="btn-save">Shto Dronin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
