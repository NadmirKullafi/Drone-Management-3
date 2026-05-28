import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Drone', 'Flight', 'Alert', 'User'],

  endpoints: (builder) => ({

    // AUTH
    hyrje: builder.mutation({
      query: (kredencialet) => ({ url: '/auth/hyrje', method: 'POST', body: kredencialet })
    }),
    regjistro: builder.mutation({
      query: (teDhenat) => ({ url: '/auth/regjistro', method: 'POST', body: teDhenat })
    }),
    merrProfil: builder.query({
      query: () => '/auth/profili',
      providesTags: ['User']
    }),

    // DRONAT
    merrDronat: builder.query({
      query: (params = {}) => {
        const { statusi, kerkimi, faqja = 1, limit = 20 } = params;
        const search = new URLSearchParams();
        if (statusi) search.append('statusi', statusi);
        if (kerkimi) search.append('kerkimi', kerkimi);
        search.append('faqja', faqja);
        search.append('limit', limit);
        return `/drones?${search.toString()}`;
      },
      providesTags: (result) =>
        result?.dronat
          ? [...result.dronat.map(({ _id }) => ({ type: 'Drone', id: _id })), { type: 'Drone', id: 'LIST' }]
          : [{ type: 'Drone', id: 'LIST' }]
    }),
    merrStatistikaDrone: builder.query({
      query: () => '/drones/statistika',
      providesTags: [{ type: 'Drone', id: 'STATS' }]
    }),
    merrDronin: builder.query({
      query: (id) => `/drones/${id}`,
      providesTags: (result, error, id) => [{ type: 'Drone', id }]
    }),
    shtoDron: builder.mutation({
      query: (droni) => ({ url: '/drones', method: 'POST', body: droni }),
      invalidatesTags: [{ type: 'Drone', id: 'LIST' }, { type: 'Drone', id: 'STATS' }]
    }),
    perditesoDron: builder.mutation({
      query: ({ id, ...teDhenat }) => ({ url: `/drones/${id}`, method: 'PUT', body: teDhenat }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Drone', id }, { type: 'Drone', id: 'LIST' }, { type: 'Drone', id: 'STATS' }
      ]
    }),
    fshiDron: builder.mutation({
      query: (id) => ({ url: `/drones/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Drone', id: 'LIST' }, { type: 'Drone', id: 'STATS' }]
    }),

    // FLUTURIMET
    merrFlights: builder.query({
      query: (params = {}) => {
        const { statusi, droniId, faqja = 1, limit = 10 } = params;
        const search = new URLSearchParams();
        if (statusi) search.append('statusi', statusi);
        if (droniId) search.append('droniId', droniId);
        search.append('faqja', faqja);
        search.append('limit', limit);
        return `/flights?${search.toString()}`;
      },
      providesTags: (result) =>
        result?.fluturimet
          ? [...result.fluturimet.map(({ _id }) => ({ type: 'Flight', id: _id })), { type: 'Flight', id: 'LIST' }]
          : [{ type: 'Flight', id: 'LIST' }]
    }),
    merrStatistikaFluturim: builder.query({
      query: () => '/flights/statistika',
      providesTags: [{ type: 'Flight', id: 'STATS' }]
    }),
    krijoFluturim: builder.mutation({
      query: (fluturimi) => ({ url: '/flights', method: 'POST', body: fluturimi }),
      invalidatesTags: [
        { type: 'Flight', id: 'LIST' }, { type: 'Flight', id: 'STATS' },
        { type: 'Drone', id: 'LIST' }, { type: 'Drone', id: 'STATS' }
      ]
    }),
    perfundoFluturim: builder.mutation({
      query: ({ id, ...teDhenat }) => ({ url: `/flights/${id}/perfundo`, method: 'PUT', body: teDhenat }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Flight', id }, { type: 'Flight', id: 'LIST' }, { type: 'Flight', id: 'STATS' },
        { type: 'Drone', id: 'LIST' }, { type: 'Drone', id: 'STATS' }
      ]
    }),
    fshiFluturim: builder.mutation({
      query: (id) => ({ url: `/flights/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Flight', id: 'LIST' }, { type: 'Flight', id: 'STATS' }]
    }),

    // ALARMET
    merrAlarmet: builder.query({
      query: (params = {}) => {
        const { lexuar, prioriteti } = params;
        const search = new URLSearchParams();
        if (lexuar !== undefined) search.append('lexuar', lexuar);
        if (prioriteti) search.append('prioriteti', prioriteti);
        return `/alerts?${search.toString()}`;
      },
      providesTags: (result) =>
        result?.alarmet
          ? [...result.alarmet.map(({ _id }) => ({ type: 'Alert', id: _id })), { type: 'Alert', id: 'LIST' }]
          : [{ type: 'Alert', id: 'LIST' }]
    }),
    krijoAlarm: builder.mutation({
      query: (alarmi) => ({ url: '/alerts', method: 'POST', body: alarmi }),
      invalidatesTags: [{ type: 'Alert', id: 'LIST' }]
    }),
    lexoAlarm: builder.mutation({
      query: (id) => ({ url: `/alerts/${id}/lexo`, method: 'PUT' }),
      invalidatesTags: (result, error, id) => [{ type: 'Alert', id }, { type: 'Alert', id: 'LIST' }]
    }),
    zgjidhAlarm: builder.mutation({
      query: (id) => ({ url: `/alerts/${id}/zgjidh`, method: 'PUT' }),
      invalidatesTags: (result, error, id) => [{ type: 'Alert', id }, { type: 'Alert', id: 'LIST' }]
    })
  })
});

export const {
  useHyrjeMutation,
  useRegjistroMutation,
  useMerrProfilQuery,
  useMerrDronatQuery,
  useMerrStatistikaDroneQuery,
  useMerrDroninQuery,
  useShtoDronMutation,
  usePerditesoDronMutation,
  useFshiDronMutation,
  useMerrFlightsQuery,
  useMerrStatistikaFluturimQuery,
  useKrijoFluturimMutation,
  usePerfundoFluturimMutation,
  useFshiFluturimMutation,
  useMerrAlarmetQuery,
  useKrijoAlarmMutation,
  useLexoAlarmMutation,
  useZgjidhAlarmMutation
} = apiSlice;
