"use client";

import React from "react";
import Loader from "../component/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoadUserQuery({});

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isLoading ? <Loader /> : children}
    </div>
  );
};

export default Custom;
