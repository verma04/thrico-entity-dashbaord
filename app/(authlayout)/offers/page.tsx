"use client";

import React, { useState } from "react";
import { Offer } from "@/types/offer-types";
import { OfferEditor } from "@/components/offers/offer-editor";
import { OfferList } from "@/components/offers/offer-list";
import { OfferSettings } from "@/components/offers/offer-settings";
import { CategoryManager } from "@/components/wall-of-fame/category-manager";
import { useOfferStore } from "@/store/useOfferStore";
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
import {
  Tag,
  Plus,
  Search,
  X,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  FolderTree,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OffersPage() {
  const {
    filters,
    setFilters,
    resetFilters,
    categories,
    getPendingCount,
    getAdminOffersCount,
    getUserOffersCount,
  } = useOfferStore();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const pendingCount = getPendingCount();
  const adminCount = getAdminOffersCount();
  const userCount = getUserOffersCount();

  const handleEdit = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setSelectedOffer(null);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedOffer(null);
  };

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending", count: pendingCount },
    { value: "rejected", label: "Rejected" },
    { value: "expired", label: "Expired" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Tag className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Offers Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage platform offers and user submissions
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="all" className="gap-2">
            <Tag className="h-4 w-4" />
            All Offers
          </TabsTrigger>
          <TabsTrigger value="admin" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Admin Offers
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-muted">
              {adminCount}
            </span>
          </TabsTrigger>
          <TabsTrigger value="user" className="gap-2">
            <Clock className="h-4 w-4" />
            User Offers
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-muted">
              {userCount}
            </span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <FolderTree className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* All Offers Tab */}
        <TabsContent value="all" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Offer
            </Button>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={filters.status === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters({ status: option.value as any })}
                >
                  {option.label}
                  {option.count !== undefined && option.count > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-primary-foreground/20">
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
                Featured
              </Button>

              <Button
                variant={filters.trending ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters({ trending: filters.trending ? undefined : true })}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Trending
              </Button>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search offers..."
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
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(filters.searchQuery || filters.categoryId || filters.featured || filters.trending) && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          <OfferList onEdit={handleEdit} />
        </TabsContent>

        {/* Admin Offers Tab */}
        <TabsContent value="admin" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Offer
            </Button>
          </div>
          <OfferList onEdit={handleEdit} />
        </TabsContent>

        {/* User Offers Tab */}
        <TabsContent value="user" className="space-y-6">
          <OfferList onEdit={handleEdit} />
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <OfferSettings />
        </TabsContent>
      </Tabs>

      {/* Editor */}
      <OfferEditor offer={selectedOffer} open={isEditorOpen} onOpenChange={handleCloseEditor} />
    </div>
  );
}
