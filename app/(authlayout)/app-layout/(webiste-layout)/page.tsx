"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Lock,
  Sparkles,
  Layout,
  ShieldCheck,
  ArrowRight,
  Layers,
  Trash2,
  ChevronRight,
  Globe,
  Info,
} from "lucide-react";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { useIsPremium } from "@/hooks/useIsPremium";
import {
  useGetWebsite,
  useUpdatePage,
  useDeletePage,
} from "@/graphql/actions/website";
import { useToast } from "@/hooks/use-toast";
import { CreatePageDialog } from "@/components/pages/create-page-dialog";
import { ConfirmDialog } from "@/components/pages/confirm-dialog";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
} from "@/components/shared/admin-table/admin-table";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

const Page = () => {
  const router = useRouter();
  const { addPage, deletePage, setCurrentPage, togglePageStatus } =
    useWebsiteBuilderStore();
  const { isPremium } = useIsPremium();
  const { toast } = useToast();

  const {
    data: websiteData,
    loading: websiteLoading,
    refetch,
  } = useGetWebsite({});

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

  const displayPages = websiteData?.getWebsite?.pages || [];

  const handleEditPage = (pageId: string) => {
    setCurrentPage(pageId);
    router.push("/app-layout/layout");
  };

  const handleToggleStatus = (pageId: string, currentStatus: boolean) => {
    const page = displayPages?.find((p: any) => p.id === pageId);
    if (!page || page.slug === "home") return;

    if (currentStatus) {
      setConfirmDialog({ open: true, pageId, currentStatus });
    } else {
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
      deletePage(deleteConfirmDialog.pageId);
      setDeleteConfirmDialog({ open: false, pageId: null });
    }
  };

  const columns: AdminTableColumn<any>[] = [
    {
      key: "designation",
      header: "Designation",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Layout className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-foreground leading-tight">
              {row.name}
            </span>
            {row.slug === "home" && (
              <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-0.5">
                Root Invariant
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "namespace",
      header: "Namespace",
      cell: (row) => (
        <code className="px-2 py-0.5 rounded-md bg-muted border border-border text-[11px] font-mono text-muted-foreground">
          /{row.slug}
        </code>
      ),
    },
    {
      key: "protocol-status",
      header: "Status",
      headerClassName: "text-center",
      className: "text-center",
      cell: (row) => (
        <Button
          variant="ghost"
          className="p-0 h-auto hover:bg-transparent"
          onClick={() => handleToggleStatus(row.id, row.isEnabled)}
          disabled={row.slug === "home"}
        >
          <AdminStatusBadge status={row.isEnabled ? "ACTIVE" : "DRAFT"}>
            {row.isEnabled ? "Active" : "Archival Draft"}
          </AdminStatusBadge>
        </Button>
      ),
    },
    {
      key: "matrix-actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-lg font-bold text-[11px] uppercase tracking-wide gap-2 bg-background hover:bg-muted"
            onClick={() => handleEditPage(row.id)}
          >
            <Layers className="h-3.5 w-3.5" />
            Design
          </Button>
          {row.slug !== "home" && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleDeletePage(row.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-indigo-600/10 ring-1 ring-indigo-600/20">
                <Layout className="h-5 w-5 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                App Hierarchy
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
              <span>Website Builder</span>
              <ChevronRight className="h-3 w-3" />
              <span>Project Pages</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/app-layout/create")}
              className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-sm transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              New Page
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {!isPremium && (
            <div className="p-8 rounded-[2rem] bg-indigo-600 shadow-xl overflow-hidden relative mb-8 border-none isolate">
              <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 pointer-events-none">
                <Sparkles className="h-32 w-32 text-indigo-100" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-indigo-100 font-bold text-[10px] uppercase tracking-widest border border-white/20 inline-block">
                      System Upgrade Available
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Unlock Master Architecture
                  </h3>
                  <p className="text-sm font-medium text-indigo-100/90 max-w-xl leading-relaxed">
                    Evolve your platform with unlimited page definitions, architectural nesting, and high-tier module access.
                  </p>
                </div>
                <Button
                  className="h-12 px-8 rounded-xl bg-white hover:bg-indigo-50 text-indigo-600 font-bold shadow-md transition-all active:scale-95 shrink-0 gap-2"
                  onClick={() => router.push("/settings/subscription")}
                >
                  Elevate Protocol
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4 border-b">
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="h-4 w-4 text-indigo-600" />
                    <CardTitle className="text-xl">
                      Hierarchy Manifest
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Manage the architectural structure of your platform and define URI segments.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <AdminTable
                    columns={columns}
                    data={displayPages}
                    loading={websiteLoading}
                    keyExtractor={(p) => p.id}
                    emptyIcon={Layout}
                    emptyTitle="Void Detected"
                    emptyDescription="No architectural pages have been instantiated in this namespace."
                    className="border-0 shadow-none border-t-0 rounded-none bg-transparent"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden bg-muted/20">
                   <div className="p-6">
                      <Globe className="h-8 w-8 mb-4 text-indigo-500 opacity-80" />
                      <h3 className="text-lg font-bold">Project Pulse</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Overview of active structural nodes.
                      </p>
                   </div>
                   <div className="p-4 bg-background grid grid-cols-2 gap-4 divide-x border-t">
                      <div className="flex flex-col items-center justify-center py-2">
                        <span className="text-2xl font-bold">{displayPages.length}</span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Total Nodes</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-2 text-emerald-600">
                        <span className="text-2xl font-bold">{displayPages.filter((p:any) => p.isEnabled).length}</span>
                        <span className="text-[10px] uppercase font-bold mt-1 text-emerald-600/70">Published</span>
                      </div>
                   </div>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-border/50">
                  <CardHeader className="pb-3 border-b bg-muted/20">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Info className="h-4 w-4 text-indigo-600" />
                      Structural Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3 text-xs text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          The 'home' invariant is immutable and maps to the root domain trajectory.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          Unpublishing a node moves it to draft status, immediately revoking public access.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          Click "Design" to enter the canvas editor for a specific structural node.
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </div>

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
        title="Unpublish Namespace?"
        description="This action will restrict access to this URI segment. The node will remain in archival status but will not be resolvable by community entities."
        confirmText="Confirm Strike"
        confirmVariant="destructive"
      />

      <ConfirmDialog
        open={deleteConfirmDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteConfirmDialog({ open: false, pageId: null })
        }
        onConfirm={confirmDelete}
        title="Purge Node?"
        description="This will permanently delete the architectural node and all nested invariants. This action is terminal and cannot be reversed."
        confirmText={deletingPage ? "Purging..." : "Execute Purge"}
        confirmVariant="destructive"
        isLoading={deletingPage}
      />
    </div>
  );
};

export default Page;
