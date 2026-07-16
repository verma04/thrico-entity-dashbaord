"use client";

import React, { useState } from "react";
import { useNewsStore } from "@/store/useNewsStore";
import { NewsArticle } from "@/types/news-types";
import { NewsFilters } from "@/components/news/news-filters";
import { NewsList } from "@/components/news/news-list";
import { NewsEditor } from "@/components/news/news-editor";
import { NewsDetailView } from "@/components/news/news-detail-view";
import { CreateNewsDialog } from "@/components/news/create-news-dialog";
import {
  Newspaper,
  ShieldCheck,
  Zap,
  Activity,
  Globe,
  LayoutGrid,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

export default function NewsPage() {
  const { articles } = useNewsStore();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null,
  );
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
    <EcosystemWrapper anonymized-1="news-intelligence">
      <EcosystemHeader
        title="Editorial Governance"
        badgeText="Temporal Feed"
        description="Monitor community broadcast velocity, editorial protocols, and architectural news expansion across the global registry node."
        icon={Newspaper}
        actions={<CreateNewsDialog />}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">
              Verified Editorial Node Active
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <NewsFilters />
            </div>
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-lg text-[10px] font-bold text-zinc-600 uppercase tracking-widest whitespace-nowrap">
              <Zap className="h-3 w-3 text-indigo-500 fill-current" />
              {articles?.length || 0} Articles Synchronized
            </div>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Temporal Reach",
              value: "2.4k",
              icon: Globe,
              color: "text-zinc-900",
              bg: "bg-zinc-100",
            },
            {
              label: "Active Threads",
              value: articles?.length || 0,
              icon: Activity,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              label: "Registry Yield",
              value: "98%",
              icon: ShieldCheck,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-lg bg-white border border-zinc-200 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all"
            >
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 leading-none">
                  {stat.label}
                </span>
                <span className="text-2xl font-bold text-zinc-900 tracking-tight leading-none">
                  {stat.value}
                </span>
              </div>
              <div
                className={cn(
                  "p-3 rounded-lg transition-all shadow-sm",
                  stat.bg,
                )}
              >
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <LayoutGrid className="h-4 w-4 text-zinc-900" />
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-[0.2em]">
              Editorial Manifest
            </h2>
          </div>

          <div className="p-1 rounded-2xl bg-zinc-50 border border-zinc-100 min-h-[600px]">
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200/50 overflow-hidden">
               <NewsList onEdit={handleEdit} onView={handleView} />
            </div>
          </div>
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
