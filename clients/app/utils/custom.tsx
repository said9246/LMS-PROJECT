"use client";
import React from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "../component/Loader/Loader";

const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoadUserQuery({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    ); 
  }

  return <>{children}</>;
};

export default Custom;
