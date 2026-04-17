"use client";

import React from "react";

import ModuleManager from "./module-manager";
import ModuleSettings from "./module-settings";
import LivePreview from "./live-preview";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { Home, Mail, Users, Plus, Lock } from "lucide-react";
import ThemeSelector from "./theme-selector";
import FontSelector from "./font-selector";
import { Button } from "@/components/ui/button";
import { useIsPremium } from "@/hooks/useIsPremium";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CreatePageDialog } from "@/components/pages/create-page-dialog";
import { useGetWebsite } from "@/graphql/actions/website";

const BuilderLayout = () => {
  const { selectedModuleId, pages, currentPageId, setCurrentPage, addPage } =
    useWebsiteBuilderStore();
  const [isMounted, setIsMounted] = React.useState(false);
  const [isAddPageOpen, setIsAddPageOpen] = React.useState(false);
  const { isPremium } = useIsPremium();

  // Fetch website data for websiteId
  const { data: websiteData, refetch } = useGetWebsite({});

  // Set currentPageId to first page if not set
  React.useEffect(() => {
    if (!currentPageId && pages.length > 0) {
      setCurrentPage(pages[0].id);
    }
  }, [currentPageId, pages, setCurrentPage]);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const pageIcons = {
    home: Home,
    contact: Mail,
    about: Users,
  };

  const CurrentIcon =
    pageIcons[currentPageId as keyof typeof pageIcons] || Home;

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <>
      <div className="flex bg-background h-full w-full overflow-hidden">
        {/* --- LEFT PANEL: CONTROLS --- */}
        <div className="w-[380px] flex flex-col border-r bg-card/50 backdrop-blur-xl relative shrink-0 shadow-2xl z-20">
          {/* Page Selector & Global Controls */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Active Page</h2>
              {isPremium ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300"
                  onClick={() => setIsAddPageOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center cursor-not-allowed">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="text-xs">Upgrade to create more pages</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <CurrentIcon className="h-4 w-4 text-primary transition-transform group-focus-within:scale-110 duration-300" />
              </div>
              <select
                value={currentPageId ?? ""}
                onChange={(e) => setCurrentPage(e.target.value)}
                className="w-full bg-background border-2 border-transparent hover:border-primary/20 focus:border-primary/50 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold appearance-none cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md outline-none"
              >
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground/50">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 pt-2 h-px bg-gradient-to-r from-transparent via-border to-transparent mx-6" />

          {/* Main Content of Left Panel (Controls) */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 custom-scrollbar">
            <div className="space-y-6">
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Global Styles</h3>
                </div>
                <div className="grid gap-4">
                  <ThemeSelector />
                  <FontSelector />
                </div>
              </section>

              <div className="h-px bg-border/50" />
              
              <ModuleManager />
            </div>
          </div>

          {/* --- MODULE SETTINGS DRAWER --- */}
          <div
            className={cn(
              "absolute top-0 left-0 w-full h-full bg-card/95 backdrop-blur-xl z-30 transition-all duration-500 ease-in-out border-r",
              selectedModuleId
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0 pointer-events-none"
            )}
          >
            <div className="h-full relative overflow-y-auto custom-scrollbar">
              <ModuleSettings />
            </div>
          </div>
        </div>

        {/* --- RIGHT PANEL: LIVE PREVIEW --- */}
        <div className="flex-1 relative bg-slate-50/50 dark:bg-slate-900/50">
          <LivePreview />
        </div>
      </div>

      {/* Create Page Dialog */}
      <CreatePageDialog
        open={isAddPageOpen}
        onOpenChange={setIsAddPageOpen}
        websiteId={websiteData?.getWebsite?.id}
        onSuccess={(pageData) => {
          addPage(pageData.name, pageData.slug);
          refetch();
        }}
      />
    </>
  );
};

export default BuilderLayout;
