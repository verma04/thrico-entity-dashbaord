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
import { Award, Plus, Search, X, Star, FolderTree } from "lucide-react";
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
    { value: "all", label: "All Entries" },
    { value: "active", label: "Active", count: activeCount },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Wall of Fame</h1>
          </div>
          <p className="text-muted-foreground">
            Showcase outstanding achievements and contributions
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="entries" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="entries" className="gap-2">
            <Award className="h-4 w-4" />
            Manage Entries
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <FolderTree className="h-4 w-4" />
            Categories
          </TabsTrigger>
        </TabsList>

        {/* Entries Tab */}
        <TabsContent value="entries" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            {/* Status Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={filters.status === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters({ status: option.value as any })}
                >
                  {option.label}
                  {option.count !== undefined && (
                    <span
                      className={cn(
                        "ml-1.5 px-1.5 py-0.5 text-xs rounded-full",
                        filters.status === option.value
                          ? "bg-primary-foreground/20"
                          : "bg-muted"
                      )}
                    >
                      {option.count}
                    </span>
                  )}
                </Button>
              ))}

              <Button
                variant={filters.featured ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters({ featured: filters.featured ? undefined : true })}
              >
                <Star className="h-4 w-4 mr-1" />
                Featured Only
              </Button>
            </div>

            {/* Search & Category */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search entries..."
                  value={filters.searchQuery || ""}
                  onChange={(e) => setFilters({ searchQuery: e.target.value })}
                  className="pl-9 pr-9"
                />
                {filters.searchQuery && (
                  <button
                    onClick={() => setFilters({ searchQuery: "" })}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

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
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(filters.searchQuery || filters.category || filters.featured) && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Entry List */}
          <EntryList onEdit={handleEdit} />
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>
      </Tabs>

      {/* Editor */}
      <EntryEditor entry={selectedEntry} open={isEditorOpen} onOpenChange={handleCloseEditor} />
    </div>
  );
}
