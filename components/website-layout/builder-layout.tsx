"use client";

import React from "react";

import ModuleManager from "./module-manager";
import ModuleSettings from "./module-settings";
import LivePreview from "./live-preview";
import { useSearchParams } from "next/navigation";
import {
  ThemeType,
  useWebsiteBuilderStore,
} from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import {
  Globe,
  Plus,
  Lock,
  ChevronDown,
  Check,
  Layout,
  RotateCw,
} from "lucide-react";
import ThemeSelector from "./theme-selector";
import FontSelector from "./font-selector";
import { syncBuilderUrl } from "./builder-url-utils";
import { useIsPremium } from "@/hooks/useIsPremium";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    initializeWebsiteData,
    theme,
    setTheme,
  } = useWebsiteBuilderStore();
  const resetInitialized = useWebsiteBuilderStore((s) => s.resetInitialized);
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = React.useState(false);
  const [isAddPageOpen, setIsAddPageOpen] = React.useState(false);
  const { isPremium } = useIsPremium();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = React.useState(false);

  // Fetch website data for websiteId
  const { data: websiteData, refetch } = useGetWebsite({});

  // Initialize store with fetched data and URL params atomically
  React.useEffect(() => {
    if (websiteData?.getWebsite) {
      const website = websiteData.getWebsite;
      const pageParam = searchParams.get("page") || searchParams.get("pageId");
      const themeParam = searchParams.get("theme") as ThemeType | null;

      initializeWebsiteData(
        {
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
        },
        {
          initialPageSlugOrId: pageParam,
          initialTheme: themeParam,
        },
      );

      // If user landed on builder without URL query params, sync initial default page & theme cleanly
      if (!pageParam && website.pages && website.pages.length > 0) {
        const firstPage = website.pages[0];
        const defaultTheme = themeParam || website.theme || "academia";
        syncBuilderUrl({
          page: firstPage.slug || null,
          pageId: firstPage.slug ? null : firstPage.id,
          theme: defaultTheme,
        });
      }
    }
  }, [websiteData, searchParams, initializeWebsiteData]);

  // Handle browser back / forward navigation via popstate
  React.useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get("page") || params.get("pageId");
      const themeParam = params.get("theme") as ThemeType | null;

      if (pageParam && pages.length > 0) {
        const matched = pages.find(
          (p) => p.slug === pageParam || p.id === pageParam,
        );
        if (matched && matched.id !== currentPageId) {
          setCurrentPage(matched.id);
        }
      }

      const validThemes: ThemeType[] = [
        "academia",
        "enterprise",
        "creator",
        "association",
        "startup",
      ];
      if (
        themeParam &&
        validThemes.includes(themeParam) &&
        themeParam !== theme
      ) {
        setTheme(themeParam);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [pages, currentPageId, theme, setCurrentPage, setTheme]);

  React.useEffect(() => {
    setIsMounted(true);
    // Reset initialization flag on mount so fresh server data is loaded
    resetInitialized();
  }, [resetInitialized]);

  // Cleanup: reset on unmount so next open re-fetches from server
  React.useEffect(() => {
    return () => {
      resetInitialized();
    };
  }, [resetInitialized]);

  const currentPage =
    pages.find((p) => p.id === currentPageId) ||
    (currentPageId ? null : pages[0]) ||
    null;

  const handleSelectPage = React.useCallback(
    (page: { id: string; slug: string }) => {
      setCurrentPage(page.id);
      syncBuilderUrl({
        page: page.slug || null,
        pageId: page.slug ? null : page.id,
        theme: theme || null,
      });
    },
    [setCurrentPage, theme],
  );

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <>
      <div className="flex flex-col h-full w-full overflow-hidden bg-[#f6f6f7] dark:bg-zinc-950">
        {/* ─── Polaris Top Toolbar ─── */}
        <div className="h-11 border-b border-[#d2d5d9] dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md flex items-center justify-between px-3.5 shrink-0 z-30 shadow-2xs">
          {/* Left: Page Switcher & Creation */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="h-8 px-2.5 rounded-lg border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 flex items-center gap-2 text-xs font-semibold text-[#303030] dark:text-zinc-100 transition-all cursor-pointer shadow-2xs"
                >
                  <Globe className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-[200px]">
                    {currentPage ? currentPage.name : "Select Page"}
                  </span>
                  {currentPage && (
                    <span className="text-[10px] font-mono text-[#616161] dark:text-zinc-400 hidden sm:inline">
                      /{currentPage.slug}
                    </span>
                  )}
                  <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5 shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 p-1 border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl rounded-xl"
              >
                <DropdownMenuLabel className="text-[10.5px] uppercase font-bold tracking-wider text-[#616161] dark:text-zinc-400 px-2 py-1.5">
                  Website Pages ({pages.length})
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#e1e3e5]/60 dark:bg-zinc-800/80 my-1" />
                {pages.map((page) => {
                  const isSelected = page.id === currentPageId;
                  return (
                    <DropdownMenuItem
                      key={page.id}
                      onClick={() => handleSelectPage(page)}
                      className={cn(
                        "flex items-center justify-between px-2 py-1.5 rounded-lg text-xs cursor-pointer",
                        isSelected
                          ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold"
                          : "text-[#303030] dark:text-zinc-200 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800",
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Layout className="h-3 w-3 shrink-0 opacity-70" />
                        <span className="truncate">{page.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className="text-[10px] font-mono text-muted-foreground">
                          /{page.slug}
                        </span>
                        {isSelected && (
                          <Check className="h-3 w-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-4 bg-[#e1e3e5] dark:bg-zinc-800 mx-0.5" />

            {isPremium ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddPageOpen(true)}
                    className="h-8 px-2.5 text-xs font-medium border-[#d2d5d9] dark:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 text-[#303030] dark:text-zinc-200 gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">New Page</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-[11px]">
                  Add new page container
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled
                    className="h-8 px-2.5 text-xs border-[#d2d5d9] dark:border-zinc-700 opacity-50 cursor-not-allowed gap-1.5"
                  >
                    <Lock className="h-3 w-3" />
                    <span className="hidden sm:inline">Add Page</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-[11px]">
                  Upgrade plan to add pages
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Right: Studio Status Indicator & Manual Sync */}
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-300 border-[#d2d5d9] dark:border-zinc-700"
            >
              {pages.length} {pages.length === 1 ? "Page" : "Pages"} Configured
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
            >
              Linear Editor
            </Badge>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={async () => {
                setIsSyncing(true);
                try {
                  await refetch();
                  toast({
                    title: "Synchronized",
                    description:
                      "Website layout and pages are synced with server.",
                  });
                } catch (error: unknown) {
                  toast({
                    title: "Sync Failed",
                    description:
                      (error as Error)?.message ||
                      "Failed to sync website data",
                    variant: "destructive",
                  });
                } finally {
                  setIsSyncing(false);
                }
              }}
              disabled={isSyncing}
              className="h-8 px-2.5 text-xs font-medium border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 text-[#303030] dark:text-zinc-200 gap-1.5 shadow-2xs cursor-pointer ml-1"
            >
              <RotateCw
                className={cn(
                  "h-3.5 w-3.5",
                  isSyncing && "animate-spin text-indigo-600",
                )}
              />
              <span className="hidden sm:inline">
                {isSyncing ? "Syncing..." : "Sync Changes"}
              </span>
            </Button>
          </div>
        </div>

        {/* ─── Main Content Canvas ─── */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* ─── Left Panel: Design Controls ─── */}
          <div className="w-[300px] flex flex-col border-r border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0 shadow-2xs">
            {/* Scrollable Controls */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
              <ThemeSelector />
              <FontSelector />
              <div className="h-px bg-[#e1e3e5]/60 dark:bg-zinc-800/80 my-1" />
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
                  "bg-white dark:bg-zinc-900 shadow-2xl border-r border-[#d2d5d9] dark:border-zinc-800 transition-all duration-200 ease-out h-full",
                )}
                style={{ pointerEvents: "auto" }}
              >
                <ModuleSettings />
              </div>
              {/* Click-away backdrop */}
              <div
                className="flex-1 bg-black/20 dark:bg-black/50 backdrop-blur-[1px] cursor-pointer"
                style={{ pointerEvents: "auto" }}
                onClick={() => selectModule(null)}
              />
            </div>
          )}

          {/* ─── Right Panel: Live Preview Canvas ─── */}
          <div className="flex-1 relative bg-[#f6f6f7] dark:bg-zinc-950 overflow-hidden">
            <LivePreview />
          </div>
        </div>
      </div>

      {/* Create Page Modal Dialog */}
      <CreatePageDialog
        open={isAddPageOpen}
        onOpenChange={setIsAddPageOpen}
        websiteId={websiteData?.getWebsite?.id}
        onSuccess={(pageData) => {
          addPage(pageData.name, pageData.slug);
          setCurrentPage(pageData.id);
          syncBuilderUrl({
            page: pageData.slug || null,
            pageId: pageData.slug ? null : pageData.id,
            theme: theme || null,
          });
          refetch();
        }}
      />
    </>
  );
};

export default BuilderLayout;
