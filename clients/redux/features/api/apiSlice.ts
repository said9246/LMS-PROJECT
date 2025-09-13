// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { userLoggedIn } from '../auth/authSlice';

// export const apiSlice = createApi({
//   reducerPath: 'api',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'http://localhost:6000/api', // Directly specify your backend URL here
//   }),
//   endpoints: (builder) => ({
//     refreshToken: builder.query({
//       query: () => ({
//         url: 'refresh-token',
//         method: 'GET',
//         credentials: 'include' as const,
//       }),
//     }),
//     loadUser: builder.query({
//       query: () => ({
//         url: 'me',
//         method: 'GET',
//         credentials: 'include' as const,
//       }),
//       async onQueryStarted(arg, { queryFulfilled, dispatch }) {
//         try {
//           const result = await queryFulfilled;
//           dispatch(
//             userLoggedIn({
//               accessToken: result.data.accessToken,
//               user: result.data.user,
//             })
//           );
//         } catch (error) {
//           console.log(error);
//         }
//       },
//     }),
//   }),
// });

// export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;

//     refreshToken: builder.query({
//       query: () => ({
//         url: 'refresh-token',
//         method: 'GET',
//         credentials: 'include' as const,
//       }),
//     }),
//     loadUser: builder.query({
//       query: () => ({
//         url: 'me',
//         method: 'GET',
//         credentials: 'include' as const,


//       }),      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
//         try {
//           const result = await queryFulfilled
//           dispatch(
//             userLoggedIn({
//               accessToken: result.data.accessToken,
//               user: result.data.user,
//             })
//           )
//         } catch (error) {
//           console.log(error)
//         }
//       },
//     }),
//   }),
// })

// export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice   
 
// -----------------------------------------------------------------------------------------------------------------------------------------
// 'use client'  
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// // import { userLoggedIn } from '../auth/authSlice'

// export const apiSlice = createApi({
//   reducerPath: 'api',
//   baseQuery: fetchBaseQuery({

//     baseUrl: process.env.NEXT_PUBLIC_SERVER_URL, // Directly specify your backend URL here
//   }),
//   endpoints: (builder) => ({

//   }),   });

//   export const {}= apiSlice;
// ----------------------------------------------------------------------------------------------------------------------------------------
"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice"; // yahan apna slice import karo

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
    credentials: "include", // har request ke sath cookies bhejne ke liye
  }),
  endpoints: (builder) => ({
    // Refresh Token API
    refreshToken: builder.query<{ accessToken: string }, void>({
      query: () => ({
        url: "refresh-token",
        method: "GET",
      }),
    }),

    // Load User API
    loadUser: builder.query<{ accessToken: string; user: any }, void>({
      query: () => ({
        url: "me",
        method: "GET",
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
          
          // console.log("Load user error:", error);
            toast.error("Something went wrong while loading user");

        }
      },
    }),
  }),
});

// Hooks export (agar UI me use karna ho)
export const {
  useRefreshTokenQuery,
  useLoadUserQuery,
} = apiSlice;
  