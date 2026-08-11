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
import { Plus, Loader2, LayoutGrid, Network } from "lucide-react";
import { useDebounce } from "use-debounce";
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
import { ClassificationActionBar } from "../../../../../components/classfications/shared/classification-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { notify } from "@/lib/notify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CtaButton } from "@/components/ui/cta-button";

import { IndustryDialog } from "../../../../../components/classfications/industries/industry-dialog";
import { IndustriesListView } from "../../../../../components/classfications/industries/industries-list-view";
import { IndustriesGraphView } from "../../../../../components/classfications/industries/industries-graph-view";
import { RECOMMENDED_INDUSTRIES } from "../../../../../components/classfications/industries/recommended-industries";

export default function IndustriesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, loading, refetch } = useGetIndustries({
    variables: { search: debouncedSearch, limit: 100 },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [industryToDelete, setIndustryToDelete] = useState<Industry | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("list");

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

  return (
    <>
      <ClassificationActionBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search industries..."
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={
          <>
            <CtaButton
              variant="outline"
              onClick={handleBulkAdd}
              disabled={bulkAdding}
            >
              {bulkAdding ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              Add Recommended
            </CtaButton>
            <CtaButton
              onClick={() => {
                setEditingIndustry(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Industry
            </CtaButton>
          </>
        }
        statusText={`${industries.length} Industries`}
        statusActive={industries.length > 0}
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        {activeTab === "list" ? (
          <IndustriesListView
            industries={industries}
            isLoading={loading}
            onEdit={(industry) => {
              setEditingIndustry(industry);
              setIsDialogOpen(true);
            }}
            onDelete={(industry) => setIndustryToDelete(industry)}
          />
        ) : (
          <IndustriesGraphView />
        )}
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
        <AlertDialogContent className="rounded-2xl border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-foreground">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              This will permanently delete the industry{" "}
              <span className="font-bold text-foreground">
                "{industryToDelete?.title}"
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="rounded-lg font-semibold border-border"
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
