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
import { OfferCard } from "./offer-card";
import { OfferDialog } from "./offer-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, LayoutGrid, List as ListIcon, Tag } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import TableLoading from "@/components/layout/table-loading";

export function OffersManager() {
  const [view, setView] = useState<"grid" | "table">("table");
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

  const { data: categoriesData } = useGetOfferCategories();

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
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <Tabs
              value={view}
              onValueChange={(val: string) => setView(val as "grid" | "table")}
              className="bg-muted p-0.5 rounded-lg border border-border mr-2"
            >
              <TabsList className="bg-transparent border-none h-auto p-0 gap-0.5">
                <TabsTrigger
                  value="grid"
                  className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium"
                >
                  <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
                  Grid
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium"
                >
                  <ListIcon className="h-3.5 w-3.5 mr-1.5" />
                  Table
                </TabsTrigger>
              </TabsList>
            </Tabs>
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
          </div>
        }
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
             <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search offers..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
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
                {categories.map((cat: any) => (
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
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Status active={offers.length > 0}>
             {offers.length} Offers
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <AnimatePresence mode="wait">
          {offersLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TableLoading />
            </motion.div>
          ) : (
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {view === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {offers.map((offer: Offer) => (
                    <OfferCard 
                      key={offer.id} 
                      offer={offer} 
                      onEdit={handleEdit}
                      refetch={refetchOffers} 
                    />
                  ))}
                  {offers.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-dashed border-border rounded-xl bg-muted/20">
                      <div className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3 text-muted-foreground/40">
                        <Tag className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">No offers found</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try adjusting your search or filters, or create a new offer.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <OffersTable
                  offers={offers}
                  isLoading={offersLoading}
                  onEdit={handleEdit}
                  refetch={refetchOffers}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
