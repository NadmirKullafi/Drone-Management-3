import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useMerrDroninQuery,
  usePerditesoDronMutation,
  useMerrFlightsQuery
} from '../store/apiSlice';
import './DroneDetaje.css';

export default function DroneDetaje() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editim, setEditim] = useState(false);
  const [forma, setForma] = useState({});

  // RTK Query hooks
  const { data: droneData, isLoading } = useMerrDroninQuery(id, {
    onError: () => navigate('/dronat')
  });
  const { data: flightData } = useMerrFlightsQuery({ droniId: id, limit: 10 });
  const [perditesoDron] = usePerditesoDronMutation();

  const droni = droneData?.droni;
  const fluturimet = flightData?.fluturimet || [];

  // Inicializo formën kur droni ngarkohet
  React.useEffect(() => {
    if (droni && !editim) setForma(droni);
  }, [droni, editim]);

  const ruajEditimin = async () => {
    try {
      await perditesoDron({ id, ...forma }).unwrap();
      setEditim(false);
    } catch (err) {
      alert(err.data?.mesazhi || 'Gabim gjatë ruajtjes.');
    }
  };

  if (isLoading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (!droni) return null;

  const d = droni;

  return (
    <div className="detaje-page">
      <div className="detaje-header">
        <Link to="/dronat" className="btn-back">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
          Kthehu
        </Link>
        <div className="header-actions">
          {editim ? (
            <>
              <button className="btn-cancel" onClick={() => { setEditim(false); setForma(droni); }}>Anulo</button>
              <button className="btn-save" onClick={ruajEditimin}>Ruaj</button>
            </>
          ) : (
            <button className="btn-edit" onClick={() => setEditim(true)}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edito
            </button>
          )}
        </div>
      </div>

      <div className="detaje-grid">
        <div className="detaje-main-card">
          <div className="drone-hero">
            <div className="drone-hero-icon">
              <svg width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"/>
                <path d="M5 5l2.5 2.5M19 5l-2.5 2.5M5 19l2.5-2.5M19 19l-2.5-2.5"/>
                <circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/>
                <circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/>
              </svg>
            </div>
            <div className="drone-hero-info">
              {editim ? (
                <input className="edit-input edit-title" value={forma.emri || ''} onChange={e => setForma({...forma, emri: e.target.value})} />
              ) : <h1>{d.emri}</h1>}
              <p className="drone-model-text">{d.modeli}</p>
              <p className="drone-serial-text">Serial: {d.numriSerial}</p>
            </div>
            <div className="drone-status-big">
              {editim ? (
                <select className="edit-input" value={forma.statusi || ''} onChange={e => setForma({...forma, statusi: e.target.value})}>
                  <option value="aktiv">Aktiv</option>
                  <option value="në_fluturim">Në fluturim</option>
                  <option value="mirëmbajtje">Mirëmbajtje</option>
                  <option value="joaktiv">Joaktiv</option>
                  <option value="i_dëmtuar">I dëmtuar</option>
                </select>
              ) : (
                <span className={`badge badge-${d.statusi}`} style={{fontSize:'13px', padding:'5px 14px'}}>
                  {d.statusi.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>

          <div className="battery-section">
            <div className="battery-header">
              <span>Niveli i Baterisë</span>
              <strong style={{color: d.bateria > 50 ? '#10b981' : d.bateria > 20 ? '#f59e0b' : '#ef4444'}}>{d.bateria}%</strong>
            </div>
            <div className="battery-big">
              <div className="battery-big-fill" style={{
                width: `${d.bateria}%`,
                background: d.bateria > 50 ? 'linear-gradient(90deg, #10b981, #34d399)' :
                             d.bateria > 20 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' :
                             'linear-gradient(90deg, #ef4444, #f87171)'
              }}></div>
            </div>
          </div>

          <div className="specs-grid">
            <div className="spec-block">
              <span className="spec-block-label">Pesha</span>
              <span className="spec-block-value">{editim ? <input type="number" step="0.1" className="edit-input edit-small" value={forma.pesha || ''} onChange={e => setForma({...forma, pesha: e.target.value})} /> : `${d.pesha} kg`}</span>
            </div>
            <div className="spec-block">
              <span className="spec-block-label">Ngarkesa Max</span>
              <span className="spec-block-value">{editim ? <input type="number" step="0.1" className="edit-input edit-small" value={forma.ngarkesaMax || ''} onChange={e => setForma({...forma, ngarkesaMax: e.target.value})} /> : `${d.ngarkesaMax} kg`}</span>
            </div>
            <div className="spec-block">
              <span className="spec-block-label">Kohë Fluturimi</span>
              <span className="spec-block-value">{d.kohaMaksimaleFluturimit} min</span>
            </div>
            <div className="spec-block">
              <span className="spec-block-label">Shpejtësia Max</span>
              <span className="spec-block-value">{d.shpejtesiaMax} km/h</span>
            </div>
            <div className="spec-block">
              <span className="spec-block-label">Rangu</span>
              <span className="spec-block-value">{d.rangu} km</span>
            </div>
            <div className="spec-block">
              <span className="spec-block-label">Kamera / GPS</span>
              <span className="spec-block-value">{d.kamera ? '📷 Po' : '✗ Jo'} / {d.gps ? '📍 Po' : '✗ Jo'}</span>
            </div>
          </div>
        </div>

        <div className="detaje-side">
          <div className="side-card">
            <h3>Statistikat</h3>
            <div className="stat-rows">
              <div className="stat-row"><span>Fluturime Totale</span><strong>{d.fluturimeTotale}</strong></div>
              <div className="stat-row"><span>Orët e Fluturimit</span><strong>{d.oretFluturimit?.toFixed(1)} h</strong></div>
              <div className="stat-row"><span>Data Regjistrimit</span><strong>{new Date(d.dataRegjistimit).toLocaleDateString('sq-AL')}</strong></div>
            </div>
          </div>
          {d.shenimet && (
            <div className="side-card">
              <h3>Shënime</h3>
              <p className="notes-text">{d.shenimet}</p>
            </div>
          )}
        </div>
      </div>

      <div className="table-card" style={{marginTop:'20px'}}>
        <div className="table-header">
          <h3>Historia e Fluturimeve</h3>
          <Link to="/fluturimet" className="btn-link">Shiko të gjitha →</Link>
        </div>
        {fluturimet.length === 0 ? (
          <p style={{color:'var(--text-muted)', padding:'20px', fontSize:'14px'}}>Ky dron nuk ka fluturime të regjistruara.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Data</th><th>Qëllimi</th><th>Kohëzgjatja</th><th>Distanca</th><th>Statusi</th></tr>
            </thead>
            <tbody>
              {fluturimet.map(fl => (
                <tr key={fl._id}>
                  <td>{new Date(fl.fillimi).toLocaleDateString('sq-AL')}</td>
                  <td className="text-muted">{fl.qellimiMisionit}</td>
                  <td>{fl.kohezgjatja ? `${fl.kohezgjatja} min` : '-'}</td>
                  <td>{fl.distancaFluturuar ? `${fl.distancaFluturuar} km` : '-'}</td>
                  <td><span className={`badge badge-${fl.statusi}`}>{fl.statusi}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
