"use client";

import React, { useState } from "react";
import { useNewsStore } from "@/store/useNewsStore";
import { NewsArticle } from "@/types/news-types";
import { NewsFilters } from "@/components/news/news-filters";
import { NewsList } from "@/components/news/news-list";
import { NewsEditor } from "@/components/news/news-editor";
import { NewsDetailView } from "@/components/news/news-detail-view";
import { CreateNewsDialog } from "@/components/news/create-news-dialog";
import { Newspaper, ShieldCheck, Zap, ArrowRight, Activity, Globe, Search, Plus } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function NewsPage() {
  const { articles } = useNewsStore();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleEdit = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsEditorOpen(true);
    setIsDetailOpen(false);
  };

  const handleView = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsDetailOpen(true);
  };

  return (
    <EcosystemWrapper anonymized-1="news-management">
      <EcosystemHeader
        title="Broadcast Intelligence"
        badgeText="Temporal Registry"
        description="Monitor community broadcast velocity, editorial protocols, and architectural news expansion across the global registry node."
        icon={Newspaper}
        actions={<CreateNewsDialog />}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Broadcast Stream: Operational
                 </span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                 <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                 <span>Verified Editorial Node</span>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="hidden md:block">
                 <NewsFilters />
              </div>
              <div className="h-4 w-px bg-slate-200 mx-1" />
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">
                 <Zap className="h-3 w-3 text-indigo-500 fill-current animate-pulse" />
                 {articles?.length || 0} Articles Synchronized
              </div>
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-12 p-8 lg:p-12">
        {/* Statistics Row (Mini) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { label: "Temporal Reach", value: "2.4k", icon: Globe, color: "text-indigo-500", bg: "bg-indigo-500/10" },
             { label: "Active Threads", value: articles?.length || 0, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
             { label: "Registry Yield", value: "98%", icon: ShieldCheck, color: "text-amber-500", bg: "bg-amber-500/10" }
           ].map((stat, i) => (
             <div key={i} className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-between group hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500">
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</span>
                   <span className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</span>
                </div>
                <div className={cn("p-3 rounded-xl transition-all duration-500 group-hover:scale-110 shadow-lg shadow-black/5", stat.bg)}>
                   <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
             </div>
           ))}
        </div>

        {/* Custom Header for List */}
        <div className="flex items-center justify-between px-1">
           <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-[1.2rem] bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                 <Newspaper className="h-5 w-5" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Foundational Registry</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">Editorial archive & distribution manifest</p>
              </div>
           </div>
           
           <div className="md:hidden">
              <NewsFilters />
           </div>
        </div>

        {/* Content */}
        <div className="p-1 rounded-[3.5rem] bg-slate-50 border border-slate-100 shadow-inner min-h-[600px]">
           <NewsList onEdit={handleEdit} onView={handleView} />
        </div>

        {/* Editor Dialog */}
        <NewsEditor
          article={selectedArticle}
          open={isEditorOpen}
          onOpenChange={(open) => {
            setIsEditorOpen(open);
            if (!open) setSelectedArticle(null);
          }}
        />

        {/* Detail View Dialog */}
        <NewsDetailView
          article={selectedArticle}
          open={isDetailOpen}
          onOpenChange={(open) => {
            setIsDetailOpen(open);
            if (!open) setSelectedArticle(null);
          }}
          onEdit={handleEdit}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
