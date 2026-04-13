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

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-[400px]">
             <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search offers..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[170px] h-9 rounded-lg border-border bg-card text-sm font-medium text-foreground shadow-none focus:ring-2 focus:ring-ring/20">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-lg p-1">
                <SelectItem value="all" className="rounded-lg text-sm font-medium py-2">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="rounded-lg text-sm font-medium py-2">
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px] h-9 rounded-lg border-border bg-card text-sm font-medium text-foreground shadow-none focus:ring-2 focus:ring-ring/20">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-lg p-1">
                <SelectItem value="all" className="rounded-lg text-sm font-medium py-2">All Status</SelectItem>
                <SelectItem value="ACTIVE" className="rounded-lg text-sm font-medium py-2 text-emerald-600">Active</SelectItem>
                <SelectItem value="INACTIVE" className="rounded-lg text-sm font-medium py-2 text-muted-foreground">Inactive</SelectItem>
                <SelectItem value="EXPIRED" className="rounded-lg text-sm font-medium py-2 text-rose-600">Expired</SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Status active={offers.length > 0}>
             {offers.length} Offers
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
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
