"use client";

import React from "react";

import ModuleManager from "./module-manager";
import ModuleSettings from "./module-settings";
import LivePreview from "./live-preview";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { Globe, Plus, Lock, ChevronDown } from "lucide-react";
import ThemeSelector from "./theme-selector";
import FontSelector from "./font-selector";
import { useIsPremium } from "@/hooks/useIsPremium";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CreatePageDialog } from "@/components/pages/create-page-dialog";
import { useGetWebsite } from "@/graphql/actions/website";

const BuilderLayout = () => {
  const {
    selectedModuleId,
    selectModule,
    pages,
    currentPageId,
    setCurrentPage,
    addPage,
    initializeWebsiteData, // added this
  } = useWebsiteBuilderStore();
  const [isMounted, setIsMounted] = React.useState(false);
  const [isAddPageOpen, setIsAddPageOpen] = React.useState(false);
  const { isPremium } = useIsPremium();

  // Fetch website data for websiteId
  const { data: websiteData, refetch } = useGetWebsite({});

  // Initialize store with fetched data
  React.useEffect(() => {
    if (websiteData?.getWebsite) {
      const website = websiteData.getWebsite;
      initializeWebsiteData({
        ...website,
        globalFooter: {
          ...website?.footer,
          id: "footer",
          type: "footer",
          name: "Footer",
        },
        globalHeader: {
          ...website?.navbar,
          id: "navbar",
          type: "navbar",
          name: "Navbar",
        },
      });
    }
  }, [websiteData, initializeWebsiteData]);

  // Set currentPageId to first page if not set
  React.useEffect(() => {
    if (!currentPageId && pages.length > 0) {
      setCurrentPage(pages[0].id);
    }
  }, [currentPageId, pages, setCurrentPage]);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <>
      <div className="flex flex-col h-full w-full overflow-hidden bg-background">
        {/* ─── Unified Top Toolbar ─── */}
        <div className="h-10 border-b bg-card/90 backdrop-blur-sm flex items-center justify-between px-3 shrink-0 z-30">
          {/* Left: Page Navigation */}
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-primary/70" />

            <div className="relative flex items-center">
              <select
                value={currentPageId ?? ""}
                onChange={(e) => setCurrentPage(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-semibold cursor-pointer text-foreground appearance-none pr-5"
              >
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3 w-3 text-muted-foreground absolute right-0 pointer-events-none" />
            </div>

            <div className="w-px h-4 bg-border/50 mx-0.5" />

            {isPremium ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsAddPageOpen(true)}
                    className="p-1 rounded-md hover:bg-muted transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-[10px]">
                  Add new page
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="p-1 rounded-md opacity-40 cursor-not-allowed"
                    disabled
                  >
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-[10px]">
                  Upgrade to add pages
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Right: Builder badge */}
          <span className="text-[10px] text-muted-foreground/50 tracking-wider uppercase font-medium select-none">
            Builder
          </span>
        </div>

        {/* ─── Main Content Area ─── */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* ─── Left Panel: Design Controls ─── */}
          <div className="w-[280px] flex flex-col border-r bg-card shrink-0">
            {/* Scrollable Controls */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              <ThemeSelector />
              <FontSelector />
              <div className="h-px bg-border/40" />
              <ModuleManager />
            </div>
          </div>

          {/* ─── Module Settings Drawer (Overlay) ─── */}
          {selectedModuleId && (
            <div
              className="absolute inset-0 z-40 flex"
              style={{ pointerEvents: "none" }}
            >
              {/* Settings Panel */}
              <div
                className={cn(
                  "bg-card shadow-2xl border-r transition-all duration-200 ease-out h-full",
                )}
                style={{ pointerEvents: "auto" }}
              >
                <ModuleSettings />
              </div>
              {/* Click-away backdrop */}
              <div
                className="flex-1 bg-black/5 dark:bg-black/20 cursor-pointer"
                style={{ pointerEvents: "auto" }}
                onClick={() => selectModule(null)}
              />
            </div>
          )}

          {/* ─── Right Panel: Live Preview ─── */}
          <div className="flex-1 relative bg-muted/15 dark:bg-zinc-950/30">
            <LivePreview />
          </div>
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
