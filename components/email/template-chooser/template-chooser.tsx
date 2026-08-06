import React, { useState } from "react";
import { Search, ChevronRight, Plus, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { STARTERS, SIDEBAR_CATEGORIES } from "./template-data";
import { EmailThumbnail } from "./email-thumbnail";

export function TemplateChooser({ onSelect }: { onSelect: (key: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = STARTERS.filter((s) => {
    const matchCat = category === "All" || s.category === category || s.key === "blank";
    const q = search.toLowerCase();
    const matchSearch =
      !q || s.label.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Create Email Template"
        badgeText="Email"
        description="Choose a starting point for your email template."
        icon={LayoutTemplate}
      />

      <EcosystemContainer className="p-0 flex flex-1 h-[calc(100vh-140px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-200/60 bg-slate-50/50 flex flex-col p-5 shrink-0">
          <p className="text-[11px] font-bold text-slate-400 mb-4 px-3 uppercase tracking-widest">
            Categories
          </p>
          <nav className="flex flex-col gap-1.5">
            {SIDEBAR_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 text-left w-full",
                  category === cat.key
                    ? "bg-white text-primary shadow-sm border border-slate-200/60"
                    : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 border border-transparent"
                )}
              >
                {React.cloneElement(cat.icon as React.ReactElement, {
                  className: category === cat.key ? "text-primary" : "text-slate-400",
                  size: 16,
                })}
                {cat.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-background/50">
          {/* Top Bar / Search */}
          <div className="p-6 pb-4 flex items-center justify-between gap-4 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-4 flex-1">
              <h2 className="text-xl font-bold text-slate-900 whitespace-nowrap tracking-tight">
                {category === "All" ? "All Templates" : category}
                <span className="ml-2.5 text-sm text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                  {filtered.length}
                </span>
              </h2>
              <div className="relative w-full max-w-sm ml-auto">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 shadow-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200/60">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="rounded-xl font-medium border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                onClick={() => onSelect(selected ?? "blank")}
                className="rounded-xl font-semibold shadow-sm"
              >
                {selected ? "Use Template" : "Start Blank"}
                {selected ? (
                  <ChevronRight className="ml-2 h-4 w-4" />
                ) : (
                  <Plus className="ml-2 h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((s) => (
                  <EmailThumbnail
                    key={s.key}
                    starter={s}
                    selected={selected === s.key}
                    onSelect={() => {
                      if (s.key === "blank") {
                        onSelect("blank");
                      } else {
                        setSelected(s.key === selected ? null : s.key);
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <LayoutTemplate className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No templates found</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  We couldn't find any templates matching your search criteria.
                </p>
                <Button variant="outline" onClick={() => { setSearch(""); setCategory("All"); }}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
