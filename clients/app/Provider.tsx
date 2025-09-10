"use client";

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../redux/store";

interface ProviderProps {
  children: React.ReactNode;
}

export function Provider({ children }: ProviderProps) {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
