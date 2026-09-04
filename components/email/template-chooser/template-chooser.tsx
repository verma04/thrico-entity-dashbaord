"use client";

import React, { useState, useMemo } from "react";
import { Search, LayoutTemplate, Sparkles, ArrowRight, ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STARTERS, SIDEBAR_CATEGORIES } from "./template-data";
import { EmailThumbnail, EmailThumbnailSkeleton } from "./email-thumbnail";

interface TemplateChooserProps {
  onSelect: (key: string) => void;
  loading?: boolean;
}

export function TemplateChooser({ onSelect, loading = false }: TemplateChooserProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return STARTERS.filter((s) => {
      const matchCat = category === "All" || s.category === category || s.key === "blank";
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q || s.label.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [category, search]);

  const selectedStarter = useMemo(() => {
    return STARTERS.find((s) => s.key === selected);
  }, [selected]);

  return (
    <EcosystemWrapper className="animate-in fade-in duration-300 gap-4">
      {/* Ecosystem Header matching member/create pattern */}
      <EcosystemHeader
        title="Create Email Template"
        badgeText="Template Studio"
        description="Select a pre-configured email starter blueprint or start with a blank drag-and-drop canvas."
        icon={LayoutTemplate}
        breadcrumbs={[
          { label: "Email", href: "/email" },
          { label: "Templates", href: "/email/templates" },
          { label: "Create Template" },
        ]}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/email/templates")}
            className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-semibold text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer"
          >
            <ArrowLeft className="h-3 w-3" />
            All Templates
          </Button>
        }
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0 m-0 space-y-4 pb-24">
        {/* Filter Bar (Search + Categories) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none flex-1">
            {SIDEBAR_CATEGORIES.map((cat) => {
              const count =
                cat.key === "All"
                  ? STARTERS.length
                  : STARTERS.filter((s) => s.category === cat.key).length;
              const isSelected = category === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setCategory(cat.key)}
                  className={cn(
                    "h-7 px-2.5 rounded-[4px] text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5",
                    isSelected
                      ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-2xs"
                      : "bg-[#f6f6f7] dark:bg-zinc-800/60 border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <span>{cat.label}</span>
                  <span
                    className={cn(
                      "text-[9.5px] font-bold px-1.5 py-0 rounded-full",
                      isSelected
                        ? "bg-white/20 text-white dark:bg-black/20 dark:text-zinc-900"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search blueprints…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[30px] pl-8 pr-7 bg-[#f6f6f7] dark:bg-zinc-800/60 border-border/60 text-[11.5px] font-medium rounded-[4px]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Template Blueprints Compact Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
            {Array.from({ length: 12 }).map((_, idx) => (
              <EmailThumbnailSkeleton key={idx} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
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
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-white dark:bg-zinc-900 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 shadow-2xs">
            <div className="h-10 w-10 rounded-[6px] bg-muted/60 flex items-center justify-center text-muted-foreground">
              <LayoutTemplate className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[13px] font-bold text-foreground">
                No matching blueprints found
              </h3>
              <p className="text-[11px] text-muted-foreground max-w-sm">
                We couldn&apos;t find any email starters matching &quot;{search}&quot;. Try adjusting your search query or clear filters.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="h-7 text-[11px] font-semibold rounded-[4px] border-border"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </EcosystemContainer>

      {/* Floating Bottom Launch Bar */}
      <div
        className={cn(
          "fixed bottom-6 inset-x-0 mx-auto max-w-md z-50 transition-all duration-300 transform px-4",
          selected ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between gap-3 p-2.5 pl-3.5 bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-[8px] shadow-xl border border-zinc-700 dark:border-zinc-300 backdrop-blur-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-6 w-6 rounded-[4px] bg-zinc-700 dark:bg-zinc-200 flex items-center justify-center text-zinc-200 dark:text-zinc-800 shrink-0">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11.5px] font-bold truncate leading-tight">
                {selectedStarter?.label || "Selected Blueprint"}
              </p>
              <p className="text-[9.5px] text-zinc-400 dark:text-zinc-600 truncate leading-tight">
                Ready to customize in drag-and-drop studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelected(null)}
              className="h-7 px-2 text-[11px] text-zinc-400 hover:text-white dark:hover:text-zinc-900 rounded-[4px]"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => onSelect(selected!)}
              className="h-7 px-3 text-[11px] font-bold bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 shadow-2xs rounded-[4px] cursor-pointer"
            >
              Launch Studio
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </EcosystemWrapper>
  );
}
