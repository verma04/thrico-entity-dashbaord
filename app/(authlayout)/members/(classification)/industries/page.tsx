"use client";

import React, { useState } from "react";
import {
  useGetIndustries,
  useAddIndustry,
  useUpdateIndustry,
  useDeleteIndustry,
  Industry,
  useBulkAddIndustries,
} from "@/graphql/quries/industries/industry-queries";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Pencil,
  Trash2,
  Filter,
  Briefcase,
  Loader2,
  Building2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { notify } from "@/lib/notify";
import { Input } from "@/components/ui/input";

// ── Color palette for industries ──
const INDUSTRY_COLORS = [
  "#6366f1",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#f97316",
  "#14b8a6",
];

function getIndustryColor(index: number) {
  return INDUSTRY_COLORS[index % INDUSTRY_COLORS.length];
}

// ── Add/Edit Dialog ──
function IndustryDialog({
  open,
  onOpenChange,
  editingIndustry,
  isLoading,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingIndustry: Industry | null;
  isLoading: boolean;
  onSave: (values: { title: string }) => void;
}) {
  const [title, setTitle] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setTitle(editingIndustry?.title || "");
    }
  }, [open, editingIndustry]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-slate-200">
        <DialogHeader>
          <DialogTitle className="font-bold text-slate-800">
            {editingIndustry ? "Edit Industry" : "Add Industry"}
          </DialogTitle>
          <DialogDescription className="font-medium text-slate-500">
            {editingIndustry
              ? "Update the industry name"
              : "Create a new industry to classify your members"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label
              htmlFor="industry-title"
              className="text-sm font-semibold text-slate-700"
            >
              Industry Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="industry-title"
              placeholder="e.g., Technology, Finance, Healthcare"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-slate-200 focus-visible:ring-indigo-500/20"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            variant="outline"
            className="rounded-lg font-semibold border-slate-200"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || isLoading}
            className="rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingIndustry ? "Update" : "Save Industry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Industries Grid ──
function IndustriesGrid({
  industries,
  isLoading,
  onEdit,
  onDelete,
}: {
  industries: Industry[];
  isLoading: boolean;
  onEdit: (industry: Industry) => void;
  onDelete: (industry: Industry) => void;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <Card
              key={i}
              className="border border-slate-200 rounded-xl overflow-hidden"
            >
              <Skeleton className="h-1.5 w-full" />
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  if (industries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-xl border border-slate-200 border-dashed m-4">
        <Briefcase className="h-10 w-10 text-slate-300 mb-4" />
        <h3 className="text-xl font-semibold text-slate-800 tracking-tight">
          No industries found
        </h3>
        <p className="text-sm text-slate-500 text-center mt-2 max-w-sm">
          Try adding a new industry or adjusting your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
      {industries.map((industry, index) => {
        const color = getIndustryColor(index);
        return (
          <Card
            key={industry.id}
            className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden rounded-xl hover:border-indigo-500/20 hover:-translate-y-1 bg-white cursor-pointer"
          >
            {/* Color bar */}
            <div
              className="h-1.5 w-full opacity-80 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: color }}
            />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center shadow-sm"
                    style={{
                      backgroundColor: `${color}15`,
                      color: color,
                    }}
                  >
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-md w-full text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {industry.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                      Industry
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(industry);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(industry);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ── Recommended Industries ──
const RECOMMENDED_INDUSTRIES = [
  "Advertising & Media",
  "Advisory & Consulting Services",
  "Aerospace & Defence",
  "Agribusiness & Farming",
  "Airlines & Airport Services",
  "Architecture & Interior Design",
  "Automotive",
  "Banking",
  "Beauty",
  "Chemicals",
  "Construction",
  "Consumer Internet",
  "Consumer Products",
  "Defence & Security",
  "Ecology & Environment",
  "Education & Research",
  "Entertainment",
  "Event Management",
  "Facilities Management",
  "Fashion & Apparel",
  "Financial Services",
  "Gaming",
  "Government",
  "Health & Wellness",
  "High Tech",
  "HORECA",
  "Household Services",
  "Incubation & Entrepreneurship",
  "Industrial Manufacturing",
  "Influencers, Creators & Celebrities",
  "Information Technology",
  "Insurance",
  "Internet, D2C & E-commerce",
  "Legal",
  "Life Sciences & Healthcare",
  "Media Production",
  "Mill Products",
  "Mining",
  "Not For Profit",
  "Oil, Gas & Energy",
  "Performing Arts, Museums & Culture",
  "Profesional Networks",
  "Professional Association",
  "Professional Services",
  "Publishing & Printing",
  "Real Estate",
  "Real Estate - Commercial",
  "Real Estate - Residential",
  "Retail",
  "Sports",
  "Social Media & Networking",
  "Telecommunications",
  "Think Tanks",
  "Tours & Travels",
  "Trading",
  "Transportation, Logistics & Distribution",
  "Utilities",
  "VC, Private Equity & Angel Networks",
  "Veterinary Services",
  "Volunteering",
  "Zoos & Bootanical Gardens",
];

// ── Main Page ──
export default function IndustriesPage() {
  const { data, loading, refetch } = useGetIndustries();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [industryToDelete, setIndustryToDelete] = useState<Industry | null>(
    null,
  );

  const [addIndustry, { loading: creating }] = useAddIndustry({
    onCompleted: () => {
      notify.success("Industry created successfully");
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to create industry"),
  });

  const [updateIndustry, { loading: updating }] = useUpdateIndustry({
    onCompleted: () => {
      notify.success("Industry updated successfully");
      setIsDialogOpen(false);
      setEditingIndustry(null);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to update industry"),
  });

  const [deleteIndustry, { loading: deleting }] = useDeleteIndustry({
    onCompleted: () => {
      notify.success("Industry deleted successfully");
      setIndustryToDelete(null);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to delete industry"),
  });

  const [bulkAddIndustries, { loading: bulkAdding }] = useBulkAddIndustries({
    onCompleted: (res) => {
      const addedCount = res.bulkAddIndustries?.length || 0;
      if (addedCount > 0) {
        notify.success(`Successfully added ${addedCount} industries`);
      } else {
        notify.info("All recommended industries already exist");
      }
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to bulk add industries"),
  });

  const handleSave = async (values: { title: string }) => {
    if (editingIndustry) {
      await updateIndustry({
        variables: { input: { id: editingIndustry.id, title: values.title } },
      });
    } else {
      await addIndustry({
        variables: { input: values },
      });
    }
  };

  const handleDelete = async () => {
    if (!industryToDelete) return;
    await deleteIndustry({
      variables: { input: { id: industryToDelete.id } },
    });
  };

  const handleBulkAdd = async () => {
    await bulkAddIndustries({
      variables: { input: { titles: RECOMMENDED_INDUSTRIES } },
    });
  };

  const industries = data?.getIndustries || [];
  const filteredIndustries = industries.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <EcosystemActionBar shadow="none" className="rounded-xl border border-slate-200">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-[360px]">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search industries..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group align="right">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="font-semibold text-xs px-4 h-9 rounded-lg shadow-sm gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              onClick={handleBulkAdd}
              disabled={bulkAdding}
            >
              {bulkAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Recommended
            </Button>
            <Button
              className="font-semibold text-xs px-6 h-9 rounded-lg shadow-sm gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => {
                setEditingIndustry(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Industry
            </Button>
          </div>

          <EcosystemActionBar.Separator />

          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg border-border bg-card text-muted-foreground hover:text-foreground shadow-none"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Status active={filteredIndustries.length > 0}>
            {filteredIndustries.length} Industries
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        <IndustriesGrid
          industries={filteredIndustries}
          isLoading={loading}
          onEdit={(industry) => {
            setEditingIndustry(industry);
            setIsDialogOpen(true);
          }}
          onDelete={(industry) => setIndustryToDelete(industry)}
        />
      </EcosystemContainer>

      {/* Add/Edit Dialog */}
      <IndustryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingIndustry={editingIndustry}
        isLoading={creating || updating}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!industryToDelete}
        onOpenChange={(open) => !open && setIndustryToDelete(null)}
      >
        <AlertDialogContent className="rounded-2xl border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-slate-800">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium">
              This will permanently delete the industry{" "}
              <span className="font-bold text-slate-700">
                "{industryToDelete?.title}"
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="rounded-lg font-semibold border-slate-200"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold gap-2"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {deleting ? "Deleting..." : "Delete Industry"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
