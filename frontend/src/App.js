import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { vendosPerdoruesin, dil, selectEsteAutentifikuar } from './store/authSlice';
import { useMerrProfilQuery } from './store/apiSlice';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Drones from './pages/Drones';
import DroneDetaje from './pages/DroneDetaje';
import Flights from './pages/Flights';
import Alerts from './pages/Alerts';

// Inicializon përdoruesin nga token ekzistues
const AuthInitializer = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const { data, error } = useMerrProfilQuery(undefined, { skip: !token });

  useEffect(() => {
    if (data?.perdoruesi) {
      dispatch(vendosPerdoruesin(data.perdoruesi));
    }
    if (error) {
      dispatch(dil());
    }
  }, [data, error, dispatch]);

  return null;
};

const RutaPrivate = ({ children }) => {
  const esteAutentifikuar = useSelector(selectEsteAutentifikuar);
  const token = localStorage.getItem('token');
  if (!token && !esteAutentifikuar) return <Navigate to="/hyrje" />;
  return children;
};

const RutaPublike = ({ children }) => {
  const esteAutentifikuar = useSelector(selectEsteAutentifikuar);
  const token = localStorage.getItem('token');
  if (token || esteAutentifikuar) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
      <AuthInitializer />
      <Routes>
        <Route path="/hyrje" element={<RutaPublike><Login /></RutaPublike>} />
        <Route path="/regjistro" element={<RutaPublike><Register /></RutaPublike>} />
        <Route path="/" element={<RutaPrivate><Layout /></RutaPrivate>}>
          <Route index element={<Dashboard />} />
          <Route path="dronat" element={<Drones />} />
          <Route path="dronat/:id" element={<DroneDetaje />} />
          <Route path="fluturimet" element={<Flights />} />
          <Route path="alarmet" element={<Alerts />} />
        </Route>
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
