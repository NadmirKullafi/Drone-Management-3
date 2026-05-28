import React from 'react';
import { Link } from 'react-router-dom';
import {
  useMerrStatistikaDroneQuery,
  useMerrStatistikaFluturimQuery,
  useMerrDronatQuery,
  useMerrFlightsQuery
} from '../store/apiSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

const statistikaData = [
  { emri: 'Jan', fluturime: 12, ore: 24 },
  { emri: 'Feb', fluturime: 18, ore: 36 },
  { emri: 'Mar', fluturime: 15, ore: 30 },
  { emri: 'Pri', fluturime: 25, ore: 48 },
  { emri: 'Maj', fluturime: 22, ore: 44 },
  { emri: 'Qer', fluturime: 30, ore: 58 },
];

export default function Dashboard() {
  const { data: droneStatsData, isLoading: l1 } = useMerrStatistikaDroneQuery();
  const { data: flightStatsData, isLoading: l2 } = useMerrStatistikaFluturimQuery();
  const { data: dronatData, isLoading: l3 } = useMerrDronatQuery({ limit: 5 });
  const { data: fluturimeteData, isLoading: l4 } = useMerrFlightsQuery({ limit: 5 });

  const duke_ngarkuar = l1 || l2 || l3 || l4;
  if (duke_ngarkuar) return <div className="loading-spinner"><div className="spinner"></div></div>;

  const s = droneStatsData?.statistika || {};
  const f = flightStatsData?.statistika || {};
  const dronatFundit = dronatData?.dronat || [];
  const fluturimeFundit = fluturimeteData?.fluturimet || [];

  const pieData = [
    { name: 'Aktiv', value: s.aktiv || 0, color: '#10b981' },
    { name: 'Ne fluturim', value: s.neFliturim || 0, color: '#6366f1' },
    { name: 'Mirembajtje', value: s.mirembajte || 0, color: '#f59e0b' },
    { name: 'Joaktiv', value: s.joaktiv || 0, color: '#64748b' },
  ].filter(d => d.value > 0);

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Pasqyre e pergjithshme e sistemit te dronave</p>
        </div>
        <div className="header-date">
          {new Date().toLocaleDateString('sq-AL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon drone-icon">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/>
              <path d="M5 5l2.5 2.5M19 5l-2.5 2.5M5 19l2.5-2.5M19 19l-2.5-2.5"/>
              <circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/>
              <circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Dronat Total</span>
            <span className="stat-value">{s.total || 0}</span>
            <span className="stat-sub">{s.aktiv || 0} aktiv</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon flight-icon">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M12 2L8 6H3l3 4-2 5 8-2 8 2-2-5 3-4h-5L12 2z"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Fluturime Aktive</span>
            <span className="stat-value">{s.neFliturim || 0}</span>
            <span className="stat-sub">{f.total || 0} gjithsej</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon distance-icon">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Distanca Totale</span>
            <span className="stat-value">{f.distancaTotal || 0} km</span>
            <span className="stat-sub">{f.kompletuara || 0} fluturime</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon alert-icon">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Bateri te Uleta</span>
            <span className="stat-value">{s.bateriaUlet || 0}</span>
            <span className="stat-sub">Kerkon vemendje</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Fluturimet Mujore</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={statistikaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.5)" />
              <XAxis dataKey="emri" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
              <Line type="monotone" dataKey="fluturime" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} />
              <Line type="monotone" dataKey="ore" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9', r: 3 }} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            <span><span className="legend-dot" style={{background:'#6366f1'}}></span>Fluturime</span>
            <span><span className="legend-dot" style={{background:'#0ea5e9'}}></span>Ore</span>
          </div>
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Statusi i Dronave</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {pieData.map((d, i) => (
                  <div key={i} className="pie-item">
                    <span className="legend-dot" style={{background:d.color}}></span>
                    <span>{d.name}</span>
                    <strong>{d.value}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>Nuk ka drone te regjistruar</p>
              <Link to="/dronat" className="btn-primary">Shto Dron</Link>
            </div>
          )}
        </div>
      </div>

      <div className="tables-grid">
        <div className="table-card">
          <div className="table-header">
            <h3>Dronat e Fundit</h3>
            <Link to="/dronat" className="btn-link">Shiko te gjitha</Link>
          </div>
          {dronatFundit.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr><th>Emri</th><th>Modeli</th><th>Statusi</th><th>Bateria</th></tr>
              </thead>
              <tbody>
                {dronatFundit.map(d => (
                  <tr key={d._id}>
                    <td><Link to={`/dronat/${d._id}`} className="table-link">{d.emri}</Link></td>
                    <td className="text-muted">{d.modeli}</td>
                    <td><span className={`badge badge-${d.statusi}`}>{d.statusi.replace('_',' ')}</span></td>
                    <td>
                      <div className="battery-bar">
                        <div className="battery-fill" style={{ width: `${d.bateria}%`, background: d.bateria > 50 ? '#10b981' : d.bateria > 20 ? '#f59e0b' : '#ef4444' }}></div>
                      </div>
                      <span className="battery-text">{d.bateria}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>Nuk ka drone</p>
              <Link to="/dronat" className="btn-primary">Shto Dron</Link>
            </div>
          )}
        </div>
        <div className="table-card">
          <div className="table-header">
            <h3>Fluturimet e Fundit</h3>
            <Link to="/fluturimet" className="btn-link">Shiko te gjitha</Link>
          </div>
          {fluturimeFundit.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr><th>Droni</th><th>Qellimi</th><th>Statusi</th><th>Data</th></tr>
              </thead>
              <tbody>
                {fluturimeFundit.map(fl => (
                  <tr key={fl._id}>
                    <td>{fl.droni?.emri || '-'}</td>
                    <td className="text-muted">{fl.qellimiMisionit}</td>
                    <td><span className={`badge badge-${fl.statusi}`}>{fl.statusi}</span></td>
                    <td className="text-muted">{new Date(fl.createdAt).toLocaleDateString('sq-AL')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>Nuk ka fluturime</p>
              <Link to="/fluturimet" className="btn-primary">Regjistro Fluturim</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
