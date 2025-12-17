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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsPremium } from "@/hooks/useIsPremium";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

const BuilderLayout = () => {
  const { selectedModuleId, pages, currentPageId, setCurrentPage, addPage } =
    useWebsiteBuilderStore();
  const [isMounted, setIsMounted] = React.useState(false);
  const [isAddPageOpen, setIsAddPageOpen] = React.useState(false);
  const [newPageName, setNewPageName] = React.useState("");
  const [newPageSlug, setNewPageSlug] = React.useState("");
  const { isPremium } = useIsPremium();

  const handleAddPage = () => {
    if (!newPageName || !newPageSlug) return;
    addPage(newPageName, newPageSlug);
    setNewPageName("");
    setNewPageSlug("");
    setIsAddPageOpen(false);
  };

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
      <div className="flex bg-background h-[calc(100vh-6rem)] overflow-hidden border rounded-xl w-full shadow-sm">
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

              <Dialog open={isAddPageOpen} onOpenChange={setIsAddPageOpen}>
                {isPremium ? (
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 shrink-0 bg-background"
                      title="Add New Page"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
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
                      <p className="text-xs">Upgrade to create additional pages</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <DialogContent className="w-[400px] z-[1000]">
                  <DialogHeader>
                    <DialogTitle>Add New Page</DialogTitle>
                    <DialogDescription>
                      Create a new page for your website.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Page Name</Label>
                      <Input
                        placeholder="e.g. Services"
                        value={newPageName}
                        onChange={(e) => {
                          setNewPageName(e.target.value);
                          // Auto-generate slug from name
                          const slug = e.target.value
                            .toLowerCase()
                            .trim()
                            .replace(/[^\w\s-]/g, "") // Remove special characters
                            .replace(/\s+/g, "-") // Replace spaces with hyphens
                            .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
                          setNewPageSlug(slug);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL Slug</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">/</span>
                        <Input
                          placeholder="services"
                          value={newPageSlug}
                          onChange={(e) =>
                            setNewPageSlug(
                              e.target.value.toLowerCase().replace(/\s+/g, "-")
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddPageOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddPage} disabled={!newPageName || !newPageSlug}>
                      Create Page
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
    </>
  );
};

export default BuilderLayout;
