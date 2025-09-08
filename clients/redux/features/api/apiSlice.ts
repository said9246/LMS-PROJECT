import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userLoggedIn } from '../auth/authSlice';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:6000/api', // Directly specify your backend URL here
  }),
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => ({
        url: 'refresh-token',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    loadUser: builder.query({
      query: () => ({
        url: 'me',
        method: 'GET',
        credentials: 'include' as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
