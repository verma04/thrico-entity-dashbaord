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
import { Plus, Search, Filter, LayoutGrid, RotateCcw, Tag } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
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
    <EcosystemWrapper>
      <EcosystemHeader
        title="All Offers"
        badgeText="Marketing & Discounts"
        description="Manage all active and inactive offers across the platform."
        icon={Tag}
        actions={
          <Button
            onClick={() => {
              setEditingOffer(null);
              setIsDialogOpen(true);
            }}
            className="font-semibold text-xs px-6 h-10 rounded-lg shadow-sm gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Offer
          </Button>
        }
      />

      <EcosystemActionBar>
        <div className="flex items-center gap-2 relative z-10 w-full md:max-w-[400px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input
            placeholder="Search offers..."
            className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-4 focus-visible:ring-indigo-500/5 transition-all font-medium text-slate-700 placeholder:text-slate-400 border shadow-sm w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            title="Reset Filters"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg shrink-0 border-transparent bg-transparent text-slate-400 hover:text-indigo-600 hover:bg-slate-200"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4 pr-4 ml-auto">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm font-semibold text-slate-600 focus:ring-4 focus:ring-indigo-500/5 hidden md:flex">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-slate-400" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-xl p-1">
              <SelectItem value="all" className="font-semibold rounded-lg py-2.5">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="font-semibold rounded-lg py-2.5">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px] h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm font-semibold text-slate-600 focus:ring-4 focus:ring-indigo-500/5 hidden md:flex">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-xl p-1">
              <SelectItem value="all" className="font-semibold rounded-lg py-2.5">All Status</SelectItem>
              <SelectItem value="ACTIVE" className="font-semibold rounded-lg py-2.5 text-emerald-600">Active</SelectItem>
              <SelectItem value="INACTIVE" className="font-semibold rounded-lg py-2.5 text-slate-500">Inactive</SelectItem>
              <SelectItem value="EXPIRED" className="font-semibold rounded-lg py-2.5 text-rose-600">Expired</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap shadow-inner">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            {offers.length} Offers
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <OffersTable
          offers={offers}
          isLoading={offersLoading}
          onEdit={handleEdit}
          refetch={refetchOffers}
        />
      </EcosystemContainer>

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
    </EcosystemWrapper>
  );
}
