"use client";

import React, { useState } from "react";
import {
  useGetOffers,
  useGetOfferCategories,
  useCreateOffer,
  useUpdateOffer,
  useDeleteOffer,
  Offer,
  CreateOfferInput,
} from "@/graphql/actions/offers";
import { OffersTable } from "./offers-table";
import { OfferDialog } from "./offer-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, LayoutGrid, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function OffersManager() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  // Queries
  const {
    data: offersData,
    loading: offersLoading,
    refetch: refetchOffers,
  } = useGetOffers({
    search: search || undefined,
    categoryId: selectedCategory === "all" ? undefined : selectedCategory,
    status: selectedStatus === "all" ? undefined : selectedStatus,
  });

  const { data: categoriesData, loading: categoriesLoading } =
    useGetOfferCategories();

  // Mutations
  const [createOffer, { loading: isCreating }] = useCreateOffer({
    onCompleted: () => {
      toast.success("Offer created successfully");
      setIsDialogOpen(false);
      refetchOffers();
    },
    onError: (error) => toast.error(error.message),
  });

  const [updateOffer, { loading: isUpdating }] = useUpdateOffer({
    onCompleted: () => {
      toast.success("Offer updated successfully");
      setIsDialogOpen(false);
      setEditingOffer(null);
      refetchOffers();
    },
    onError: (error) => toast.error(error.message),
  });

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setIsDialogOpen(true);
  };

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedStatus("all");
  };

  const offers = offersData?.getOffers || [];
  const categories = categoriesData?.getOfferCategories || [];

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search offers..."
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            title="Reset Filters"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={() => {
            setEditingOffer(null);
            setIsDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Offer
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border bg-muted/30">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-2">
          <Filter className="h-4 w-4" />
          Filters:
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px] h-9 bg-background">
            <LayoutGrid className="h-3.5 w-3.5 mr-2" />
            <SelectValue placeholder="All Categories" />
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

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[150px] h-9 bg-background">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto text-xs text-muted-foreground font-medium">
          Showing {offers.length} offers
        </div>
      </div>

      {/* Main Table */}
      <OffersTable
        offers={offers}
        isLoading={offersLoading}
        onEdit={handleEdit}
        refetch={refetchOffers}
      />

      {/* Create/Edit Dialog */}
      <OfferDialog
        isOpen={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingOffer(null);
        }}
        editingOffer={editingOffer}
        categories={categories}
        isLoading={isCreating || isUpdating}
        onSave={(values) => {
          if (editingOffer) {
            updateOffer({
              variables: {
                id: editingOffer.id,
                input: values,
              },
            });
          } else {
            createOffer({
              variables: {
                input: values,
              },
            });
          }
        }}
      />
    </div>
  );
}
