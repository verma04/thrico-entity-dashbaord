"use client";

import React, { useState } from "react";
import {
  useGetInterests,
  useAddInterest,
  useUpdateInterest,
  useDeleteInterest,
  Interest,
  useBulkAddInterests,
} from "@/graphql/quries/interests/interest-queries";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, LayoutGrid, Network, Upload } from "lucide-react";
import { useDebounce } from "use-debounce";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
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

import { InterestDialog } from "../../../../../components/classfications/interests/interest-dialog";
import { InterestsListView } from "../../../../../components/classfications/interests/interests-list-view";
import { InterestsGraphView } from "../../../../../components/classfications/interests/interests-graph-view";
import { RECOMMENDED_INTERESTS } from "../../../../../components/classfications/interests/recommended-interests";

export default function InterestsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, loading, refetch } = useGetInterests({
    variables: { search: debouncedSearch, limit: 100 },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInterest, setEditingInterest] = useState<Interest | null>(null);
  const [interestToDelete, setInterestToDelete] = useState<Interest | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("list");
  const [showExportModal, setShowExportModal] = useState(false);

  const [addInterest, { loading: creating }] = useAddInterest({
    onCompleted: () => {
      notify.success("Interest created successfully");
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to create interest"),
  });

  const [updateInterest, { loading: updating }] = useUpdateInterest({
    onCompleted: () => {
      notify.success("Interest updated successfully");
      setIsDialogOpen(false);
      setEditingInterest(null);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to update interest"),
  });

  const [deleteInterest, { loading: deleting }] = useDeleteInterest({
    onCompleted: () => {
      notify.success("Interest deleted successfully");
      setInterestToDelete(null);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to delete interest"),
  });

  const [bulkAddInterests, { loading: bulkAdding }] = useBulkAddInterests({
    onCompleted: (res) => {
      const addedCount = res.bulkAddInterests?.length || 0;
      if (addedCount > 0) {
        notify.success(`Successfully added ${addedCount} interests`);
      } else {
        notify.info("All recommended interests already exist");
      }
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to bulk add interests"),
  });

  const handleSave = async (values: { title: string }) => {
    if (editingInterest) {
      await updateInterest({
        variables: { input: { id: editingInterest.id, title: values.title } },
      });
    } else {
      await addInterest({
        variables: { input: values },
      });
    }
  };

  const handleDelete = async () => {
    if (!interestToDelete) return;
    await deleteInterest({
      variables: { input: { id: interestToDelete.id } },
    });
  };

  const handleBulkAdd = async () => {
    await bulkAddInterests({
      variables: { input: { titles: RECOMMENDED_INTERESTS } },
    });
  };

  const interests = data?.getInterests || [];

  return (
    <>
      <ClassificationActionBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search interests..."
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
                setEditingInterest(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Interest
            </CtaButton>
            <Button
              variant="outline"
              onClick={() => setShowExportModal(true)}
              className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
          </>
        }
        statusText={`${interests.length} Interests`}
        statusActive={interests.length > 0}
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        {activeTab === "list" ? (
          <InterestsListView
            interests={interests}
            isLoading={loading}
            onEdit={(interest) => {
              setEditingInterest(interest);
              setIsDialogOpen(true);
            }}
            onDelete={(interest) => setInterestToDelete(interest)}
          />
        ) : (
          <InterestsGraphView />
        )}
      </EcosystemContainer>

      {/* Add/Edit Dialog */}
      <InterestDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingInterest={editingInterest}
        isLoading={creating || updating}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!interestToDelete}
        onOpenChange={(open) => !open && setInterestToDelete(null)}
      >
        <AlertDialogContent className="rounded-2xl border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-foreground">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              This will permanently delete the interest{" "}
              <span className="font-bold text-foreground">
                &quot;{interestToDelete?.title}&quot;
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
              className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white rounded-lg font-semibold gap-2"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {deleting ? "Deleting..." : "Delete Interest"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="interests"
        description="Export community member interest classifications as CSV."
        totalCount={interests.length}
        matchingCount={debouncedSearch.trim() ? interests.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          if (interests.length === 0) {
            toast.error("Nothing to export", { description: "No interests found." });
            return;
          }
          const csv = buildCsv(interests, [
            { header: "Interest Title", getValue: (i) => i.title || "" },
            { header: "Created At", getValue: (i) => i.createdAt ? new Date(i.createdAt).toISOString().slice(0, 10) : "" },
            { header: "Updated At", getValue: (i) => i.updatedAt ? new Date(i.updatedAt).toISOString().slice(0, 10) : "" },
          ]);
          downloadCsv(csv, `interests-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${interests.length} interest${interests.length !== 1 ? "s" : ""} exported.` });
        }}
      />
    </>
  );
}
