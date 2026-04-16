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
import {
  Plus,
  Loader2,
  Lock,
  Sparkles,
  Layout,
  ShieldCheck,
  Activity,
  RotateCcw,
  Search,
  Filter,
  ArrowRight,
  Layers,
} from "lucide-react";
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
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

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
  const displayPages = websiteData?.getWebsite?.pages || [];

  const handleEditPage = (pageId: string) => {
    setCurrentPage(pageId);
    router.push("/app-layout/layout");
  };

  const handleToggleStatus = (pageId: string, currentStatus: boolean) => {
    const page = displayPages?.find((p: any) => p.id === pageId);
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
    <div className="space-y-8">
      <EcosystemActionBar shadow="sm">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Routing Engine Active
              </span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
              <span>Namespace Safety: Valid</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 gap-2 hover:bg-slate-50 transition-all"
            >
              <RotateCcw
                className={cn("h-4 w-4", websiteLoading && "animate-spin")}
              />
              Sync Manifest
            </Button>
            {isPremium ? (
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="h-10 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-wider gap-3 shadow-xl shadow-slate-200 transition-all active:scale-95 group"
              >
                <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
                New Invariant Page
              </Button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled
                    className="h-10 px-8 rounded-xl bg-slate-100 text-slate-400 font-black text-[11px] uppercase tracking-wider gap-3 cursor-not-allowed"
                  >
                    <Lock className="h-4 w-4" /> New Invariant Page
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-xl border-slate-200 bg-white font-bold text-slate-900 shadow-xl">
                  <p className="text-xs">Upgrade for architectural expansion</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-10 p-8 lg:p-12">
        {!isPremium && (
          <div className="p-8 rounded-[2.5rem] bg-indigo-600 shadow-2xl shadow-indigo-200 overflow-hidden relative border-none">
            <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12">
              <Sparkles className="h-32 w-32 text-indigo-100" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-indigo-100 font-black text-[9px] uppercase tracking-widest border border-white/20">
                    System Upgrade Available
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                  Unlock Master Architecture
                </h3>
                <p className="text-[11px] font-bold text-indigo-100/80 uppercase tracking-tight max-w-xl leading-relaxed">
                  Evolve your platform with unlimited page definitions,
                  architectural nesting, and high-tier module access.
                </p>
              </div>
              <Button
                className="h-14 px-10 rounded-2xl bg-white hover:bg-indigo-50 text-indigo-600 font-black text-[12px] uppercase tracking-widest shadow-2xl transition-all active:scale-95 gap-3"
                onClick={() => router.push("/settings/subscription")}
              >
                Elevate Protocol
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">
                Hierarchy Manifest
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                {displayPages.length} active route definitions
              </p>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
            {websiteLoading ? (
              <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-indigo-600" />
                  </div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Synchronizing Namespace
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                <div className="grid grid-cols-12 bg-slate-50/50 p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <div className="col-span-4">Designation</div>
                  <div className="col-span-3">Namespace Slug</div>
                  <div className="col-span-2 text-center">Protocol Status</div>
                  <div className="col-span-3 text-right pr-4">
                    Matrix Actions
                  </div>
                </div>
                {displayPages.length === 0 ? (
                  <div className="p-24 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="h-20 w-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                      <Layout className="h-10 w-10 opacity-20" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-black italic text-slate-900 uppercase">
                        Void Detected
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        No architectural pages have been instantiated
                      </p>
                    </div>
                  </div>
                ) : (
                  displayPages.map((page: any) => (
                    <PageListItem
                      key={page.id}
                      page={page}
                      onEdit={handleEditPage}
                      onDelete={handleDeletePage}
                      onToggleStatus={handleToggleStatus}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </EcosystemContainer>

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
