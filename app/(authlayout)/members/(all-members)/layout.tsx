"use client";
import * as React from "react";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      {children}
    </div>
  );
}

export default RootLayout;
