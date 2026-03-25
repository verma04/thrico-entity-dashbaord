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
        <div className="w-[340px] flex flex-col border-r bg-card relative shrink-0">
          {/* Page Selector Dropdown */}
          <div className="border-b bg-muted/30 p-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-background border rounded-md px-3 py-2">
                <CurrentIcon className="h-4 w-4 text-muted-foreground" />
                <select
                  value={currentPageId ?? ""}
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

              {isPremium ? (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0 bg-background"
                  title="Add New Page"
                  onClick={() => setIsAddPageOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 shrink-0 bg-background opacity-60 cursor-not-allowed"
                      disabled
                    >
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      Upgrade to create additional pages
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Main Content of Left Panel (Controls) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            <ThemeSelector />
            <FontSelector />

            <hr className="border-border/50" />
            <ModuleManager />
          </div>

          {/* --- MODULE SETTINGS DRAWER (Slide-over within Left Panel) --- */}
          <div
            className={cn(
              "absolute top-0 left-0 h-full bg-card z-20 transition-transform duration-300 ease-in-out shadow-xl",
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
