"use client";

import React, { useState } from "react";
import {
  useGetWallOfFame,
  useGetWallOfFameCategories,
} from "@/graphql/wall-of-fame";
import { WallOfFameTable } from "./wall-of-fame-table";
import { WallOfFameEditor } from "./wall-of-fame-editor";
import { Button } from "@/components/ui/button";
import { Plus, Trophy, LayoutGrid, RotateCcw, ShieldCheck, Star, Calendar } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Link from "next/link";

const TYPE_OPTIONS = [
  { value: "ALL",      label: "All Entries", icon: LayoutGrid, dot: "" },
  { value: "FEATURED", label: "Featured Only", icon: Star,       dot: "bg-amber-500" },
];

export function WallOfFameManager() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);

  // Queries
  const {
    data: entriesData,
    loading: entriesLoading,
    refetch: refetchEntries,
  } = useGetWallOfFame({
    input: {
      searchQuery: search || undefined,
      categoryId: selectedCategory === "all" ? undefined : selectedCategory,
      limit: 100,
      offset: 0,
    },
  });

  const { data: categoriesData } = useGetWallOfFameCategories();

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingEntry(null);
    setIsEditorOpen(true);
  };

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedType("ALL");
  };

  const entriesRaw = entriesData?.getWallOfFame || [];
  
  // Filter by featured if selected (since GQL might not support it directly in input yet)
  const entries = selectedType === "FEATURED" 
    ? entriesRaw.filter((e: any) => e.isFeatured)
    : entriesRaw;

  const categories = categoriesData?.getWallOfFameCategories || [];
  const currentType = TYPE_OPTIONS.find(opt => opt.value === selectedType) || TYPE_OPTIONS[0];

  return (
    <EcosystemWrapper anonymized-1="wall-of-fame-manager">
      <EcosystemHeader
        title="Recognition Manifest"
        badgeText="Legacy Registry"
        description="Oversee and manage the high-performance inductees in your ecosystem's architectural legacy."
        icon={Trophy}
        actions={
          <Link href="/wall-of-fame/add">
            <Button 
              className="font-semibold text-xs px-6 h-10 rounded-lg shadow-sm gap-2 bg-slate-900"
            >
              <Plus className="h-4 w-4" />
              Add Entity
            </Button>
          </Link>
        }
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-[400px]">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search by title or name..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] h-9 rounded-lg border-border bg-card text-sm font-medium text-foreground shadow-none focus:ring-2 focus:ring-ring/20">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-lg p-1">
                <SelectItem value="all" className="rounded-lg text-sm font-medium py-2">All Categories</SelectItem>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id} className="rounded-lg text-sm font-medium py-2">
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[160px] h-9 rounded-lg border-border bg-card text-sm font-medium text-foreground focus:ring-2 focus:ring-ring/20 shadow-none">
                <div className="flex items-center gap-2">
                  {currentType.dot && (
                    <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", currentType.dot)} />
                  )}
                  <SelectValue placeholder="Type" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-lg p-1">
                {TYPE_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-lg text-sm font-medium py-2"
                  >
                    <div className="flex items-center gap-2">
                      {opt.dot && (
                        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", opt.dot)} />
                      )}
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all"
              onClick={() => refetchEntries()}
              disabled={entriesLoading}
            >
              <RotateCcw
                size={14}
                className={cn(entriesLoading && "animate-spin")}
              />
            </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Status active={entries.length > 0}>
             {entries.length} Inductees Registered
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <WallOfFameTable
          entries={entries}
          isLoading={entriesLoading}
          onEdit={handleEdit}
          onRefetch={refetchEntries}
        />
      </EcosystemContainer>

      {/* Editor Modal */}
      <WallOfFameEditor
        entry={editingEntry}
        open={isEditorOpen}
        onOpenChange={(open) => {
          setIsEditorOpen(open);
          if (!open) setEditingEntry(null);
        }}
        onRefetch={refetchEntries}
      />
    </EcosystemWrapper>
  );
}
