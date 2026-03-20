"use client";

import React, { useState } from "react";
import { WallOfFameEntry } from "@/types/wall-of-fame-types";
import { EntryEditor } from "@/components/wall-of-fame/entry-editor";
import { EntryList } from "@/components/wall-of-fame/entry-list";
import { CategoryManager } from "@/components/wall-of-fame/category-manager";
import { useWallOfFameStore } from "@/store/useWallOfFameStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Award, Plus, Search, X, Star, FolderTree, ShieldCheck, Zap, ArrowRight, Activity, Globe, RotateCcw, Timer, Sparkles } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

export default function WallOfFamePage() {
  const { filters, setFilters, resetFilters, categories, getActiveCount } =
    useWallOfFameStore();
  const [selectedEntry, setSelectedEntry] = useState<WallOfFameEntry | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const activeCount = getActiveCount();

  const handleEdit = (entry: WallOfFameEntry) => {
    setSelectedEntry(entry);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setSelectedEntry(null);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedEntry(null);
  };

  const statusOptions = [
    { value: "all", label: "Global Registry" },
    { value: "active", label: "Active Nodes", count: activeCount },
    { value: "inactive", label: "Static Nodes" },
  ];

  return (
    <EcosystemWrapper anonymized-1="wall-of-fame">
      <EcosystemHeader
        title="Legacy Intelligence"
        badgeText="Distinction Registry"
        description="Monitor high-performance instantiation velocity, achievement protocols, and architectural legacy expansion across the global registry node."
        icon={Award}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Legacy Stream: Synchronized
                 </span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                 <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                 <span>Verified Achievement Node</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Button 
                className="h-10 px-6 rounded-xl bg-slate-900 border-slate-800 font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl hover:bg-black transition-all"
                onClick={handleCreate}
              >
                <Plus className="h-3.5 w-3.5" />
                Add Entity
              </Button>
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-12 p-8 lg:p-12">
        <Tabs defaultValue="entries" className="w-full">
          <div className="flex items-center justify-between mb-10 px-1">
             <TabsList className="h-12 bg-slate-100 border border-slate-200 rounded-2xl p-1 shadow-inner">
                <TabsTrigger value="entries" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg">
                   <Award className="h-4 w-4" />
                   Manifest Entries
                </TabsTrigger>
                <TabsTrigger value="categories" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg">
                   <FolderTree className="h-4 w-4" />
                   Taxonomy Nodes
                </TabsTrigger>
             </TabsList>
             
             <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{activeCount} Achievement States Operational</span>
             </div>
          </div>

          <TabsContent value="entries" className="space-y-12 mt-0 outline-hidden">
             {/* Search & Filter Bar */}
             <div className="p-8 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col gap-8 group">
                <div className="flex flex-wrap items-center gap-4">
                   {statusOptions.map((option) => (
                     <Button
                       key={option.value}
                       variant="outline"
                       size="sm"
                       className={cn(
                          "h-10 px-6 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest transition-all gap-3",
                          filters.status === option.value ? "bg-slate-900 text-white border-slate-900 shadow-lg" : "bg-white text-slate-500 hover:bg-slate-50"
                       )}
                       onClick={() => setFilters({ status: option.value as any })}
                     >
                       {option.label}
                       {option.count !== undefined && (
                         <span className={cn(
                           "px-2 py-0.5 rounded-full text-[9px] font-black",
                           filters.status === option.value ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 shadow-inner"
                         )}>
                           {option.count}
                         </span>
                       )}
                     </Button>
                   ))}

                   <div className="h-6 w-px bg-slate-200 mx-2" />

                   <Button
                     variant="outline"
                     size="sm"
                     className={cn(
                        "h-10 px-6 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest transition-all gap-3",
                        filters.featured ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-200" : "bg-white text-slate-500 hover:bg-slate-50"
                     )}
                     onClick={() => setFilters({ featured: filters.featured ? undefined : true })}
                   >
                     <Star className={cn("h-4 w-4", filters.featured && "fill-current")} />
                     Elite Priority
                   </Button>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                   <div className="flex-1 min-w-[300px] relative group/search">
                      <div className="absolute inset-x-0 inset-y-0 bg-indigo-500/5 rounded-2xl blur-xl opacity-0 group-focus-within/search:opacity-100 transition-opacity" />
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/search:text-indigo-500 transition-colors" />
                      <Input
                        placeholder="SEARCH REGISTRY MANIFEST..."
                        value={filters.searchQuery || ""}
                        onChange={(e) => setFilters({ searchQuery: e.target.value })}
                        className="h-14 pl-14 pr-12 rounded-2xl border-slate-100 bg-slate-50/50 font-black text-xs uppercase tracking-widest focus-visible:ring-indigo-500/20 focus-visible:ring-offset-0 focus-visible:border-indigo-200 transition-all placeholder:text-slate-300 relative z-10 shadow-inner"
                      />
                      {filters.searchQuery && (
                        <button
                          onClick={() => setFilters({ searchQuery: "" })}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 relative z-20"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                   </div>

                   <Select
                     value={filters.category || "all"}
                     onValueChange={(value) =>
                       setFilters({ category: value === "all" ? undefined : value })
                     }
                   >
                     <SelectTrigger className="h-14 w-[240px] rounded-2xl border-slate-100 bg-slate-50/50 font-black text-xs uppercase tracking-widest focus:ring-indigo-500/20 shadow-inner">
                        <FolderTree className="h-4 w-4 mr-3 text-indigo-500" />
                        <SelectValue placeholder="TAXONOMY NODE" />
                     </SelectTrigger>
                     <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                       <SelectItem value="all" className="font-black text-[10px] uppercase">ALL CATEGORIES</SelectItem>
                       {categories.map((cat) => (
                         <SelectItem key={cat} value={cat} className="font-black text-[10px] uppercase">
                           {cat}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>

                   {(filters.searchQuery || filters.category || filters.featured) && (
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       onClick={resetFilters}
                       className="h-10 px-4 text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                     >
                       <RotateCcw className="h-4 w-4 mr-2" />
                       Reset Registry
                     </Button>
                   )}
                </div>
             </div>

             {/* Content Header */}
             <div className="flex items-center gap-3 px-1">
                <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                   <Activity className="h-5 w-5" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Recognition Manifest</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">Foundational distinction archive</p>
                </div>
             </div>

             <div className="p-1 rounded-[3.5rem] bg-slate-50 border border-slate-100 shadow-inner min-h-[600px]">
                <EntryList onEdit={handleEdit} />
             </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-0 outline-hidden">
             <div className="p-1 rounded-[3.5rem] bg-slate-50 border border-slate-100 shadow-inner min-h-[600px]">
                <CategoryManager />
             </div>
          </TabsContent>
        </Tabs>
      </EcosystemContainer>

      {/* Editor */}
      <EntryEditor entry={selectedEntry} open={isEditorOpen} onOpenChange={handleCloseEditor} />
    </EcosystemWrapper>
  );
}
