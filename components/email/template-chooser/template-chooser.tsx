"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, LayoutTemplate, Sparkles, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { STARTERS, SIDEBAR_CATEGORIES } from "./template-data";
import { EmailThumbnail } from "./email-thumbnail";

export function TemplateChooser({ onSelect }: { onSelect: (key: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return STARTERS.filter((s) => {
      const matchCat = category === "All" || s.category === category || s.key === "blank";
      const q = search.toLowerCase();
      const matchSearch =
        !q || s.label.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [category, search]);

  const selectedStarter = useMemo(() => {
    return STARTERS.find((s) => s.key === selected);
  }, [selected]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-black/10 overflow-hidden relative">
      {/* Header */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-3">
          <EcosystemHeader
            title="Create Email Template"
            badgeText="Template Studio"
            description="Select a pre-configured email starter or start from scratch with the drag-and-drop builder."
            icon={LayoutTemplate}
            breadcrumbs={[
              { label: "Email", href: "/email" },
              { label: "Templates", href: "/email/templates" },
              { label: "Create" },
            ]}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-6 pb-28">
          {/* Filter Bar (Search + Categories) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1">
                {SIDEBAR_CATEGORIES.map((cat) => {
                  const count =
                    cat.key === "All"
                      ? STARTERS.length
                      : STARTERS.filter((s) => s.category === cat.key).length;
                  const isSelected = category === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setCategory(cat.key)}
                      className={cn(
                        "h-8 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5",
                        isSelected
                          ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      )}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-1.5 py-0.2 rounded-full",
                          isSelected
                            ? "bg-white/20 text-white dark:bg-black/20 dark:text-zinc-900"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Search template blueprints..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 pl-8 pr-7 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs font-medium"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Template Blueprints Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((starter) => (
                <EmailThumbnail
                  key={starter.key}
                  starter={starter}
                  selected={selected === starter.key}
                  onSelect={() => {
                    if (starter.key === "blank") {
                      onSelect("blank");
                    } else {
                      setSelected(starter.key === selected ? null : starter.key);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                <LayoutTemplate className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  No matching templates found
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm">
                  We couldn't find any email starters matching &quot;{search}&quot;. Try adjusting your search query or clear filters.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="h-8 text-xs font-semibold"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Launch Bar */}
      <div
        className={cn(
          "fixed bottom-6 inset-x-0 mx-auto max-w-lg z-50 transition-all duration-300 transform",
          selected ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between gap-4 p-3.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 dark:border-zinc-200 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0 pl-1">
            <div className="h-8 w-8 rounded-xl bg-zinc-800 dark:bg-zinc-200 flex items-center justify-center text-zinc-200 dark:text-zinc-800 shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">
                {selectedStarter?.label || "Selected Starter"}
              </p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-600 truncate">
                Ready to customize in drag-and-drop studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelected(null)}
              className="h-8 text-xs text-zinc-400 hover:text-white dark:hover:text-zinc-900"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => onSelect(selected!)}
              className="h-8 px-4 text-xs font-bold bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 shadow-xs"
            >
              Launch Builder
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
