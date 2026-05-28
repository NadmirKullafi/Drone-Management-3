import React, { useState } from 'react';
import {
  useMerrFlightsQuery,
  useMerrStatistikaFluturimQuery,
  useMerrDronatQuery,
  useKrijoFluturimMutation,
  usePerfundoFluturimMutation,
  useFshiFluturimMutation
} from '../store/apiSlice';
import './Flights.css';

const modalBosh = {
  droni: '', fillimi: '', destinacioni: { emri: '', lat: '', lng: '' },
  qellimiMisionit: 'vëzhgim', ngarkesa: 0
};

export default function Flights() {
  const [tregaModal, setTregaModal] = useState(false);
  const [forma, setForma] = useState(modalBosh);
  const [gabim, setGabim] = useState('');
  const [filtriStatus, setFiltriStatus] = useState('');

  // RTK Query hooks
  const { data: flightData, isLoading } = useMerrFlightsQuery(
    { statusi: filtriStatus },
    { pollingInterval: 15000 }
  );
  const { data: statsData } = useMerrStatistikaFluturimQuery();
  const { data: dronatData } = useMerrDronatQuery({ statusi: 'aktiv', limit: 50 });

  const [krijoFluturim] = useKrijoFluturimMutation();
  const [perfundoFluturim] = usePerfundoFluturimMutation();
  const [fshiFluturim] = useFshiFluturimMutation();

  const fluturimet = flightData?.fluturimet || [];
  const statistika = statsData?.statistika || {};
  const dronat = dronatData?.dronat || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGabim('');
    try {
      const payload = { ...forma, fillimi: forma.fillimi || new Date().toISOString() };
      await krijoFluturim(payload).unwrap();
      setTregaModal(false);
      setForma(modalBosh);
    } catch (err) {
      setGabim(err.data?.mesazhi || 'Gabim gjatë regjistrimit.');
    }
  };

  const handlePerfundo = async (id) => {
    const bateria = prompt('Bateria mbetur (%):', '60');
    const distanca = prompt('Distanca e fluturuar (km):', '5');
    if (!bateria) return;
    try {
      await perfundoFluturim({
        id,
        bateriaMbarim: parseInt(bateria),
        distancaFluturuar: parseFloat(distanca) || 0,
        suksesshme: true
      }).unwrap();
    } catch (err) {
      alert(err.data?.mesazhi || 'Gabim.');
    }
  };

  const handleFshi = async (id) => {
    if (!window.confirm('Fshi fluturimin?')) return;
    try {
      await fshiFluturim(id).unwrap();
    } catch (err) {
      alert('Gabim gjatë fshirjes.');
    }
  };

  return (
    <div className="flights-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fluturimet</h1>
          <p className="page-subtitle">Menaxhimi i historisë së fluturimeve</p>
        </div>
        <button className="btn-add" onClick={() => setTregaModal(true)}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Regjistro Fluturim
        </button>
      </div>

      <div className="flight-stats">
        {[
          { label: 'Total', value: statistika.total || 0, color: '#6366f1' },
          { label: 'Aktive', value: statistika.aktive || 0, color: '#818cf8' },
          { label: 'Kompletuara', value: statistika.kompletuara || 0, color: '#10b981' },
          { label: 'Distanca Total', value: `${statistika.distancaTotal || 0} km`, color: '#0ea5e9' },
          { label: 'Orë Totale', value: `${Math.round((statistika.kohaTotale || 0) / 60)} h`, color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="flight-stat-item">
            <div className="flight-stat-value" style={{color: s.color}}>{s.value}</div>
            <div className="flight-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="filters-bar" style={{marginBottom:'20px'}}>
        <select value={filtriStatus} onChange={e => setFiltriStatus(e.target.value)} className="filter-select">
          <option value="">Të gjithë statuset</option>
          <option value="planifikuar">Planifikuar</option>
          <option value="aktiv">Aktiv</option>
          <option value="kompletuar">Kompletuar</option>
          <option value="anuluar">Anuluar</option>
          <option value="dështuar">Dështuar</option>
        </select>
      </div>

      {isLoading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : fluturimet.length === 0 ? (
        <div className="empty-center">
          <div className="empty-icon">✈️</div>
          <h3>Nuk ka fluturime</h3>
          <p>Regjistroni fluturimin e parë</p>
          <button className="btn-add" onClick={() => setTregaModal(true)}>Regjistro Tani</button>
        </div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Droni</th><th>Operatori</th><th>Qëllimi</th><th>Fillimi</th>
                <th>Kohëzgjatja</th><th>Distanca</th><th>Bateria</th><th>Statusi</th><th>Veprime</th>
              </tr>
            </thead>
            <tbody>
              {fluturimet.map(fl => (
                <tr key={fl._id}>
                  <td><strong>{fl.droni?.emri || 'N/A'}</strong></td>
                  <td className="text-muted">{fl.operatori?.emri || '-'}</td>
                  <td className="text-muted">{fl.qellimiMisionit}</td>
                  <td className="text-muted">{new Date(fl.fillimi).toLocaleString('sq-AL')}</td>
                  <td>{fl.kohezgjatja ? `${fl.kohezgjatja} min` : '-'}</td>
                  <td>{fl.distancaFluturuar ? `${fl.distancaFluturuar} km` : '-'}</td>
                  <td>
                    {fl.bateriaFillim !== undefined ? (
                      <span style={{fontSize:'12px'}}>
                        <span style={{color:'#10b981'}}>{fl.bateriaFillim}%</span>
                        {fl.bateriaMbarim !== undefined && <> → <span style={{color:'#f59e0b'}}>{fl.bateriaMbarim}%</span></>}
                      </span>
                    ) : '-'}
                  </td>
                  <td><span className={`badge badge-${fl.statusi}`}>{fl.statusi}</span></td>
                  <td>
                    <div style={{display:'flex', gap:'6px'}}>
                      {fl.statusi === 'aktiv' && (
                        <button className="btn-complete" onClick={() => handlePerfundo(fl._id)}>Përfundo</button>
                      )}
                      <button className="btn-delete-sm" onClick={() => handleFshi(fl._id)}>
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tregaModal && (
        <div className="modal-overlay" onClick={() => setTregaModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Regjistro Fluturim të Ri</h2>
              <button className="modal-close" onClick={() => setTregaModal(false)}>✕</button>
            </div>
            {gabim && <div className="auth-error" style={{margin:'0 0 12px'}}>{gabim}</div>}
            {dronat.length === 0 && (
              <div className="auth-error" style={{margin:'0 0 12px'}}>⚠️ Nuk ka drone të disponueshëm.</div>
            )}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Droni *</label>
                <select required value={forma.droni} onChange={e => setForma({...forma, droni: e.target.value})}>
                  <option value="">Zgjidhni dronin...</option>
                  {dronat.map(d => <option key={d._id} value={d._id}>{d.emri} - {d.modeli}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Qëllimi i Misionit *</label>
                <select value={forma.qellimiMisionit} onChange={e => setForma({...forma, qellimiMisionit: e.target.value})}>
                  <option value="vëzhgim">Vëzhgim</option>
                  <option value="dorëzim">Dorëzim</option>
                  <option value="fotografim">Fotografim</option>
                  <option value="kërkim_shpëtim">Kërkim dhe Shpëtim</option>
                  <option value="inspektim">Inspektim</option>
                  <option value="tjetër">Tjetër</option>
                </select>
              </div>
              <div className="form-group">
                <label>Data/Ora e Fillimit *</label>
                <input type="datetime-local" required value={forma.fillimi} onChange={e => setForma({...forma, fillimi: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Destinacioni (Opsional)</label>
                <input placeholder="p.sh. Tiranë - Zona Industriale" value={forma.destinacioni?.emri || ''} onChange={e => setForma({...forma, destinacioni: {...forma.destinacioni, emri: e.target.value}})} />
              </div>
              <div className="form-group">
                <label>Ngarkesa (kg)</label>
                <input type="number" step="0.1" min="0" value={forma.ngarkesa} onChange={e => setForma({...forma, ngarkesa: e.target.value})} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setTregaModal(false)}>Anulo</button>
                <button type="submit" className="btn-save" disabled={dronat.length === 0}>Regjistro Fluturimin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
