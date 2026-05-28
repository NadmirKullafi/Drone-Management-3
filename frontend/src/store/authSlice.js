import { createSlice } from '@reduxjs/toolkit';

// Auth slice - menaxhon gjendjen e autentifikimit
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    perdoruesi: null,
    token: localStorage.getItem('token') || null,
    esteAutentifikuar: !!localStorage.getItem('token')
  },
  reducers: {
    vendosCredencialet: (state, action) => {
      const { perdoruesi, token } = action.payload;
      state.perdoruesi = perdoruesi;
      state.token = token;
      state.esteAutentifikuar = true;
      localStorage.setItem('token', token);
    },
    dil: (state) => {
      state.perdoruesi = null;
      state.token = null;
      state.esteAutentifikuar = false;
      localStorage.removeItem('token');
    },
    vendosPerdoruesin: (state, action) => {
      state.perdoruesi = action.payload;
      state.esteAutentifikuar = true;
    }
  }
});

export const { vendosCredencialet, dil, vendosPerdoruesin } = authSlice.actions;

// Selectors
export const selectPerdoruesi = (state) => state.auth.perdoruesi;
export const selectToken = (state) => state.auth.token;
export const selectEsteAutentifikuar = (state) => state.auth.esteAutentifikuar;

export default authSlice.reducer;
