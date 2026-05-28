import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import authReducer from './authSlice';

// Redux Store kryesor
const store = configureStore({
  reducer: {
    // RTK Query API reducer
    [apiSlice.reducerPath]: apiSlice.reducer,
    // Auth state reducer
    auth: authReducer
  },
  // Shton automatikisht RTK Query middleware (caching, invalidation, polling)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware)
});

export default store;
