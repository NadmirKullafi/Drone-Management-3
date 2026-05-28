import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  vendosCredencialet,
  dil as dilAction,
  selectPerdoruesi,
  selectEsteAutentifikuar
} from '../store/authSlice';
import { useHyrjeMutation, useRegjistroMutation } from '../store/apiSlice';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const perdoruesi = useSelector(selectPerdoruesi);
  const esteAutentifikuar = useSelector(selectEsteAutentifikuar);

  const [hyrjeMutation] = useHyrjeMutation();
  const [regjistroMutation] = useRegjistroMutation();

  const hyrje = async (email, fjalekalimi) => {
    const rezultati = await hyrjeMutation({ email, fjalekalimi }).unwrap();
    dispatch(vendosCredencialet({
      perdoruesi: rezultati.perdoruesi,
      token: rezultati.token
    }));
    return rezultati;
  };

  const dalje = () => {
    dispatch(dilAction());
  };

  const regjistro = async (teDhenat) => {
    const rezultati = await regjistroMutation(teDhenat).unwrap();
    dispatch(vendosCredencialet({
      perdoruesi: rezultati.perdoruesi,
      token: rezultati.token
    }));
    return rezultati;
  };

  return (
    <AuthContext.Provider value={{
      perdoruesi,
      esteAutentifikuar,
      duke_ngarkuar: false,
      hyrje,
      dalje,
      regjistro
    }}>
      {children}
    </AuthContext.Provider>
  );
};
