"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChildSidebarContainer } from "./child-sidebar";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <SidebarProvider
        defaultOpen={true}
        style={{ "--sidebar-width": "210px" } as React.CSSProperties}
      >
        <div className="flex-1 overflow-hidden min-h-0 w-full">
          <ChildSidebarContainer>{children}</ChildSidebarContainer>
        </div>
      </SidebarProvider>
    </div>
  );
}
