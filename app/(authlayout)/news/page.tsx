"use client";

import React, { useState } from "react";
import { useNewsStore } from "@/store/useNewsStore";
import { NewsArticle } from "@/types/news-types";
import { NewsFilters } from "@/components/news/news-filters";
import { NewsList } from "@/components/news/news-list";
import { NewsEditor } from "@/components/news/news-editor";
import { NewsDetailView } from "@/components/news/news-detail-view";
import { CreateNewsDialog } from "@/components/news/create-news-dialog";
import { FileText, Newspaper } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Newspaper className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">News Management</h1>
          </div>
          <p className="text-muted-foreground">
            Create, edit, and manage news articles for your community
          </p>
        </div>
        <CreateNewsDialog />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <NewsFilters />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
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
    </div>
  );
}
