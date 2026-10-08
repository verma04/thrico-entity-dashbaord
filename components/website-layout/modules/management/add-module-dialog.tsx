"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, PlusCircle, Lock, Layers, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsPremium } from "@/hooks/useIsPremium";
import { AVAILABLE_MODULES, BASIC_MODULE_TYPES } from "./constants";
import { useModuleCreation } from "../../hooks/use-module-creation";
import { PolarisQuickChip } from "@/components/gamification/shared/polaris-form-ui";

interface AddModuleDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function AddModuleDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}: AddModuleDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onOpenChange = setControlledOpen || setInternalOpen;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { isPremium } = useIsPremium();
  const { handleAddModule, isCreating } = useModuleCreation();
  const [creatingModuleType, setCreatingModuleType] = useState<string | null>(
    null,
  );

  const categories = useMemo(
    () => Array.from(new Set(AVAILABLE_MODULES.map((m) => m.category))).sort(),
    [],
  );

  const filteredModules = useMemo(() => {
    return AVAILABLE_MODULES.filter((module) => {
      const matchesSearch =
        searchQuery === "" ||
        module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || module.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const groupedModules = useMemo(() => {
    return categories.reduce((acc, category) => {
      const categoryModules = filteredModules.filter(
        (m) => m.category === category,
      );
      if (categoryModules.length > 0) {
        acc[category] = categoryModules;
      }
      return acc;
    }, {} as Record<string, typeof filteredModules>);
  }, [categories, filteredModules]);

  const onAddModule = async (item: (typeof AVAILABLE_MODULES)[0]) => {
    if (isCreating) return;

    const isPremiumModule = !BASIC_MODULE_TYPES.includes(item.type);
    setCreatingModuleType(item.type);

    try {
      const success = await handleAddModule(
        item.type,
        item.name,
        item.defaultLayout,
        isPremiumModule,
      );
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setCreatingModuleType(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10"
          >
            <PlusCircle className="h-3 w-3" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="z-[2000] max-w-3xl p-0 gap-0 overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 shadow-2xl rounded-xl bg-white dark:bg-zinc-900">
        {/* 1. Polaris Header */}
        <div className="px-5 py-4 border-b border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-xs font-bold text-[#303030] dark:text-zinc-100">
                Add Section Module
              </DialogTitle>
              <DialogDescription className="text-[11px] text-[#616161] dark:text-zinc-400">
                Select a visual design section to append to this page layout
              </DialogDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-7 w-7 rounded-md hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 2. Controls Bar: Search & Category Chips */}
        <div className="p-4 border-b border-[#e1e3e5]/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-[#616161] dark:text-zinc-400" />
            <Input
              placeholder="Search sections and layout modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8.5 text-xs bg-[#f6f6f7] dark:bg-zinc-800/60 border-[#d2d5d9] dark:border-zinc-700"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <PolarisQuickChip
              label="All Categories"
              active={selectedCategory === "all"}
              onClick={() => setSelectedCategory("all")}
            />
            {categories.map((category) => (
              <PolarisQuickChip
                key={category}
                label={category}
                active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </div>
        </div>

        {/* 3. Scrollable Module Grid */}
        <div className="overflow-y-auto max-h-[52vh] p-5 space-y-6 bg-[#f6f6f7]/50 dark:bg-zinc-950/40">
          {Object.entries(groupedModules).map(([category, modules]) => (
            <div key={category} className="space-y-2.5">
              <div className="flex items-center gap-2 pb-1.5 border-b border-[#e1e3e5]/60 dark:border-zinc-800/80">
                <span className="text-[11px] font-bold text-[#303030] dark:text-zinc-200 uppercase tracking-wider">
                  {category}
                </span>
                <Badge
                  variant="outline"
                  className="text-[9.5px] px-1.5 py-0 font-mono bg-white dark:bg-zinc-900 text-muted-foreground border-border/70"
                >
                  {modules.length}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {modules.map((item) => {
                  const IconComponent = item.icon;
                  const isPremiumModule = !BASIC_MODULE_TYPES.includes(item.type);
                  const isLocked = isPremiumModule && !isPremium;
                  const isCurrentCreating =
                    isCreating && creatingModuleType === item.type;

                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => onAddModule(item)}
                      disabled={isCreating || isLocked}
                      className={cn(
                        "relative flex items-start gap-3 p-3 rounded-[8px] border text-left transition-all cursor-pointer w-full bg-white dark:bg-zinc-900",
                        isLocked
                          ? "opacity-60 cursor-not-allowed border-[#d2d5d9] dark:border-zinc-800"
                          : isCurrentCreating
                            ? "border-[#303030] dark:border-zinc-100 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-2xs"
                            : "border-[#d2d5d9] dark:border-zinc-800 hover:border-[#aeb4b9] dark:hover:border-zinc-700 hover:shadow-2xs",
                      )}
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-[6px] flex items-center justify-center shrink-0 border transition-colors",
                          isCurrentCreating
                            ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900"
                            : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 border-[#d2d5d9] dark:border-zinc-700",
                        )}
                      >
                        {isCurrentCreating ? (
                          <Loader2 className="h-4 w-4 animate-spin text-current" />
                        ) : (
                          <IconComponent className="h-4 w-4" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-[#303030] dark:text-zinc-100 block truncate">
                            {item.name}
                          </span>
                          {isPremiumModule && (
                            <Badge
                              variant="outline"
                              className="text-[9.5px] px-1 py-0 font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 shrink-0 flex items-center gap-0.5"
                            >
                              <Lock className="h-2.5 w-2.5" />
                              Pro
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5 line-clamp-2 leading-[15px]">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {Object.keys(groupedModules).length === 0 && (
            <div className="text-center py-12 text-[#616161] dark:text-zinc-400">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-medium">No sections found matching your search</p>
            </div>
          )}
        </div>

        {/* 4. Polaris Sticky Footer */}
        <div className="p-3.5 border-t border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-between">
          <span className="text-[11px] text-[#616161] dark:text-zinc-400 font-mono">
            {filteredModules.length} module{filteredModules.length !== 1 ? "s" : ""} available
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-8 px-3 text-xs border-[#d2d5d9] dark:border-zinc-700 cursor-pointer"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
