"use client";
import React, { useEffect } from "react";

const LogoutPage = () => {
  useEffect(() => {
    window.location.href = "http://accounts.thrico.com/logout";
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <span className="text-gray-500">Logging out...</span>
    </div>
  );
};

export default LogoutPage;
