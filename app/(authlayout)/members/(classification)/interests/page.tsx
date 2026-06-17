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
import { Plus, Filter, Loader2, LayoutGrid, Network } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { InterestDialog } from "../../../../../components/classfications/interests/interest-dialog";
import { InterestsListView } from "../../../../../components/classfications/interests/interests-list-view";
import { InterestsGraphView } from "../../../../../components/classfications/interests/interests-graph-view";
import { RECOMMENDED_INTERESTS } from "../../../../../components/classfications/interests/recommended-interests";

export default function InterestsPage() {
  const { data, loading, refetch } = useGetInterests();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInterest, setEditingInterest] = useState<Interest | null>(null);
  const [interestToDelete, setInterestToDelete] = useState<Interest | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("list");

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
  const filteredInterests = interests.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <EcosystemActionBar
        shadow="none"
        className="rounded-xl border border-border"
      >
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-[360px]">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search interests..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group align="right">
          {/* View toggle */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-9 p-0.5 bg-muted/60 rounded-lg">
              <TabsTrigger
                value="list"
                className="h-8 px-3 text-xs font-semibold gap-1.5 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                List
              </TabsTrigger>
              <TabsTrigger
                value="graph"
                className="h-8 px-3 text-xs font-semibold gap-1.5 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Network className="h-3.5 w-3.5" />
                Graph
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <EcosystemActionBar.Separator />

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
                setEditingInterest(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Interest
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

          <EcosystemActionBar.Status active={filteredInterests.length > 0}>
            {filteredInterests.length} Interests
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        {activeTab === "list" ? (
          <InterestsListView
            interests={filteredInterests}
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
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold gap-2"
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
    </>
  );
}
