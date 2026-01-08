"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Lock, Sparkles } from "lucide-react";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { useIsPremium } from "@/hooks/useIsPremium";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useGetWebsite,
  useUpdatePage,
  useDeletePage,
} from "@/graphql/actions/website";
import { useToast } from "@/hooks/use-toast";
import { PageListItem } from "@/components/pages/page-list-item";
import { CreatePageDialog } from "@/components/pages/create-page-dialog";
import { ConfirmDialog } from "@/components/pages/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  const router = useRouter();
  const { addPage, deletePage, setCurrentPage, togglePageStatus } =
    useWebsiteBuilderStore();
  const { isPremium } = useIsPremium();
  const { toast } = useToast();

  // Fetch website data
  const {
    data: websiteData,
    loading: websiteLoading,
    error: websiteError,
    refetch,
  } = useGetWebsite({});

  // Update page mutation
  const [updatePageMutation, { loading: updatingPage }] = useUpdatePage({
    onCompleted: (data) => {
      toast({
        title: "Success",
        description: `Page ${
          data.updatePage.isEnabled ? "published" : "unpublished"
        } successfully!`,
      });
      togglePageStatus(data.updatePage.id);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update page status",
        variant: "destructive",
      });
    },
  });
  // Delete page mutation
  const [deletePageMutation, { loading: deletingPage }] = useDeletePage({
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Page deleted successfully!",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete page",
        variant: "destructive",
      });
    },
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    pageId: string | null;
    currentStatus: boolean;
  }>({ open: false, pageId: null, currentStatus: false });

  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    open: boolean;
    pageId: string | null;
  }>({ open: false, pageId: null });

  // Use server pages if available, otherwise fallback to local store
  const displayPages = websiteData?.getWebsite?.pages;

  const handleEditPage = (pageId: string) => {
    setCurrentPage(pageId);
    router.push("/app-layout/layout");
  };

  const handleToggleStatus = (pageId: string, currentStatus: boolean) => {
    const page = displayPages?.find((p) => p.id === pageId);
    if (!page || page.slug === "home") return;

    // If page is currently active (enabled), show confirmation before making it draft
    if (currentStatus) {
      setConfirmDialog({ open: true, pageId, currentStatus });
    } else {
      // If page is draft, directly enable it without confirmation
      updatePageMutation({
        variables: {
          pageId: pageId,
          isEnabled: true,
        },
      });
    }
  };

  const confirmToggle = () => {
    if (confirmDialog.pageId) {
      updatePageMutation({
        variables: {
          pageId: confirmDialog.pageId,
          isEnabled: false,
        },
      });
      setConfirmDialog({ open: false, pageId: null, currentStatus: false });
    }
  };

  const handleDeletePage = (pageId: string) => {
    setDeleteConfirmDialog({ open: true, pageId });
  };

  const confirmDelete = () => {
    if (deleteConfirmDialog.pageId) {
      deletePageMutation({
        variables: {
          pageId: deleteConfirmDialog.pageId,
        },
      });
      // Also update local store
      deletePage(deleteConfirmDialog.pageId);
      setDeleteConfirmDialog({ open: false, pageId: null });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Page Management</CardTitle>
              <CardDescription>
                Manage your website structure and pages.
              </CardDescription>
            </div>
            {isPremium ? (
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create New Page
              </Button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button disabled className="cursor-not-allowed opacity-60">
                    <Lock className="mr-2 h-4 w-4" /> Create New Page
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Upgrade to create additional pages</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isPremium && (
            <Alert className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <AlertDescription className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-purple-900">
                    Unlock All Features with Premium
                  </p>
                  <p className="text-sm text-purple-700 mt-1">
                    Upgrade to create unlimited pages, access advanced modules,
                    and unlock all website builder features.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="ml-4 bg-purple-600 hover:bg-purple-700"
                  onClick={() => router.push("/settings/subscription")}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Upgrade Now
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {websiteLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Loading pages...
              </span>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 bg-muted/50 p-4 text-sm font-medium text-muted-foreground border-b">
                <div className="col-span-4">Page Name</div>
                <div className="col-span-3">Slug</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>
              {displayPages?.map((page) => (
                <PageListItem
                  key={page.id}
                  page={page}
                  onEdit={handleEditPage}
                  onDelete={handleDeletePage}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreatePageDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        websiteId={websiteData?.getWebsite?.id}
        onSuccess={(pageData) => {
          addPage(pageData.name, pageData.slug);
          refetch();
        }}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          !open &&
          setConfirmDialog({ open: false, pageId: null, currentStatus: false })
        }
        onConfirm={confirmToggle}
        title="Unpublish Page?"
        description="Are you sure you want to change this page to draft status? The page will be unpublished and removed from your live website."
        confirmText="Yes, Unpublish"
        confirmVariant="destructive"
      />

      <ConfirmDialog
        open={deleteConfirmDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteConfirmDialog({ open: false, pageId: null })
        }
        onConfirm={confirmDelete}
        title="Delete Page?"
        description="Are you sure you want to delete this page? This action cannot be undone and all modules within this page will be permanently removed."
        confirmText={deletingPage ? "Deleting..." : "Yes, Delete Page"}
        confirmVariant="destructive"
        isLoading={deletingPage}
      />
    </div>
  );
};

export default Page;

const PageSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-9 w-9 rounded-md" />
    </CardHeader>
    <CardContent>
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
    </CardContent>
  </Card>
);
