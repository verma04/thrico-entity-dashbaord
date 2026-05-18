"use client";

import * as React from "react";

function AIAgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      {children}
    </div>
  );
}

export default AIAgentLayout;
