"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useNewsStore } from "@/store/useNewsStore";
import { NewsStatus } from "@/types/news-types";
import { cn } from "@/lib/utils";

interface NewsFiltersProps {
  className?: string;
}

export const NewsFilters: React.FC<NewsFiltersProps> = ({ className }) => {
  const { filters, setFilters, resetFilters, categories, getDraftCount, getPublishedCount } =
    useNewsStore();

  const draftCount = getDraftCount();
  const publishedCount = getPublishedCount();

  const statusOptions: { value: NewsStatus | "all"; label: string; count?: number }[] = [
    { value: "all", label: "All Articles" },
    { value: "draft", label: "Drafts", count: draftCount },
    { value: "published", label: "Published", count: publishedCount },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Status Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            variant={filters.status === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilters({ status: option.value })}
            className="relative"
          >
            {option.label}
            {option.count !== undefined && option.count > 0 && (
              <span
                className={cn(
                  "ml-1.5 px-1.5 py-0.5 text-xs rounded-full",
                  filters.status === option.value
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {option.count}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Search and Filters Row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={filters.searchQuery || ""}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            className="pl-9 pr-9"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters({ searchQuery: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <Select
          value={filters.category || "all"}
          onValueChange={(value) =>
            setFilters({ category: value === "all" ? undefined : value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(value: any) => setFilters({ sortBy: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Filters */}
        {(filters.searchQuery || filters.category || filters.sortBy !== "newest") && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};
