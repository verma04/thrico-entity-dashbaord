"use client";

import React from "react";
import { useFaqStore } from "@/store/useFaqStore";
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
import { cn } from "@/lib/utils";

export const FaqFilters: React.FC = () => {
  const {
    filters,
    setFilters,
    resetFilters,
    categories,
    getActiveCount,
    getInactiveCount,
  } = useFaqStore();

  const activeCount = getActiveCount();
  const inactiveCount = getInactiveCount();

  const statusOptions = [
    { value: "all", label: "All FAQs" },
    { value: "active", label: "Active", count: activeCount },
    { value: "inactive", label: "Inactive", count: inactiveCount },
  ];

  return (
    <div className="space-y-4">
      {/* Status Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            variant={filters.status === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilters({ status: option.value as any })}
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

      {/* Search and Category Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
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
          value={filters.categoryId || "all"}
          onValueChange={(value) =>
            setFilters({ categoryId: value === "all" ? undefined : value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Filters */}
        {(filters.searchQuery || filters.categoryId || filters.status !== "all") && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};
