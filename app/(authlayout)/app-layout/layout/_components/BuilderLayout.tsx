"use client";

import React from "react";
import ThemeSelector from "./ThemeSelector";
import ModuleManager from "./ModuleManager";
import ModuleSettings from "./ModuleSettings";
import LivePreview from "./LivePreview";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { Home, Mail, Users } from "lucide-react";

const BuilderLayout = () => {
  const { selectedModuleId, pages, currentPageId, setCurrentPage } =
    useWebsiteBuilderStore();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const pageIcons = {
    home: Home,
    contact: Mail,
    about: Users,
  };

  const currentPage = pages.find((p) => p.id === currentPageId);
  const CurrentIcon =
    pageIcons[currentPageId as keyof typeof pageIcons] || Home;

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="flex bg-background h-[calc(100vh-6rem)] overflow-hidden border rounded-xl w-full shadow-sm">
      {/* --- LEFT PANEL: CONTROLS --- */}
      <div className="w-[340px] flex flex-col border-r bg-card relative shrink-0">
        {/* Page Selector Dropdown */}
        <div className="border-b bg-muted/30 p-3">
          <div className="flex items-center gap-2 bg-background border rounded-md px-3 py-2">
            <CurrentIcon className="h-4 w-4 text-muted-foreground" />
            <select
              value={currentPageId}
              onChange={(e) => setCurrentPage(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium cursor-pointer"
            >
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content of Left Panel (Controls) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          <ThemeSelector />
          <hr className="border-border/50" />
          <ModuleManager />
        </div>

        {/* --- MODULE SETTINGS DRAWER (Slide-over within Left Panel) --- */}
        <div
          className={cn(
            "absolute inset-0 bg-card z-20 transition-transform duration-300 ease-in-out shadow-xl",
            selectedModuleId
              ? "translate-x-0"
              : "-translate-x-full pointer-events-none"
          )}
        >
          <ModuleSettings />
        </div>
      </div>

      {/* --- RIGHT PANEL: LIVE PREVIEW --- */}
      <div className="flex-1 relative bg-slate-50/50 dark:bg-slate-900/50">
        <LivePreview />
      </div>
    </div>
  );
};

export default BuilderLayout;
