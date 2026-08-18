"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Layout,
  Sparkles,
  ArrowRight,
  Layers,
  Trash2,
  Globe,
  Info,
  Upload,
} from "lucide-react";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
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
  AdminTableItem,
  AdminTableTag,
} from "@/components/shared/admin-table/admin-table";
import {
  EcosystemWrapper,
  EcosystemHeader,
  EcosystemContainer,
} from "@/components/layout/ecosystem";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CtaButton } from "@/components/ui/cta-button";

export function WebsitePagesManager() {
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
  const [showExportModal, setShowExportModal] = useState(false);

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
      header: "Page Name",
      cell: (row) => (
        <AdminTableItem
          icon={Layout}
          title={row.name}
          badge={
            row.slug === "home" ? (
              <AdminTableTag variant="indigo">Home Page</AdminTableTag>
            ) : undefined
          }
        />
      ),
    },
    {
      key: "namespace",
      header: "Path",
      cell: (row) => (
        <AdminTableTag variant="muted">
          /{row.slug}
        </AdminTableTag>
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
            {row.isEnabled ? "Active" : "Draft"}
          </AdminStatusBadge>
        </Button>
      ),
    },
    {
      key: "matrix-actions",
      header: "",
      headerClassName: "w-24 text-right",
      className: "text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <CtaButton
            variant="outline"
            className="h-6 px-2 text-[11px] font-medium"
            onClick={() => handleEditPage(row.id)}
          >
            <Layers className="h-3 w-3" />
            Design
          </CtaButton>
          {row.slug !== "home" && (
            <CtaButton
              variant="outline"
              className="h-6 w-6 px-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
              onClick={() => handleDeletePage(row.id)}
            >
              <Trash2 className="h-3 w-3" />
            </CtaButton>
          )}
        </div>
      ),
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Website Pages"
        description="Manage your website pages and URL paths."
        icon={Layout}
        badgeText="Website Builder"
        breadcrumbs={[{ label: "Website Builder" }, { label: "Website Pages" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowExportModal(true)}
              className="h-9 px-3 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
            <CtaButton onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              New Page
            </CtaButton>
          </div>
        }
      />

      <EcosystemContainer>
        {!isPremium && (
          <div className="p-8 rounded-[2rem] bg-indigo-600 shadow-xl overflow-hidden relative mb-8 border-none isolate">
            <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 pointer-events-none">
              <Sparkles className="h-32 w-32 text-indigo-100" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-indigo-100 font-bold text-[10px] uppercase tracking-widest border border-white/20 inline-block">
                    Upgrade Available
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Unlock Advanced Features
                </h3>
                <p className="text-sm font-medium text-indigo-100/90 max-w-xl leading-relaxed">
                  Create unlimited pages, nested menus, and get access to
                  premium modules.
                </p>
              </div>
              <Button
                className="h-12 px-8 rounded-xl bg-white hover:bg-indigo-50 text-indigo-600 font-bold shadow-md transition-all active:scale-95 shrink-0 gap-2"
                onClick={() => router.push("/settings/subscription")}
              >
                Upgrade Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <AdminTable
              columns={columns}
              data={displayPages}
              loading={websiteLoading}
              size="sm"
              keyExtractor={(p) => p.id}
              emptyIcon={Layout}
              emptyTitle="No Pages Found"
              emptyDescription="You haven't created any pages yet."
              className="border-0 shadow-none border-t-0 rounded-none bg-transparent"
            />
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden bg-muted/20">
                <div className="p-6">
                  <Globe className="h-8 w-8 mb-4 text-indigo-500 opacity-80" />
                  <h3 className="text-lg font-bold">Overview</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Overview of your website pages.
                  </p>
                </div>
                <div className="p-4 bg-background grid grid-cols-2 gap-4 divide-x border-t">
                  <div className="flex flex-col items-center justify-center py-2">
                    <span className="text-2xl font-bold">
                      {displayPages.length}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground mt-1">
                      Total Pages
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center py-2 text-emerald-600">
                    <span className="text-2xl font-bold">
                      {displayPages.filter((p: any) => p.isEnabled).length}
                    </span>
                    <span className="text-[10px] uppercase font-bold mt-1 text-emerald-600/70">
                      Published
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="border-none shadow-sm ring-1 ring-border/50">
                <CardHeader className="pb-3 border-b bg-muted/20">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Info className="h-4 w-4 text-indigo-600" />
                    Page Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3 text-xs text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>
                        The 'home' page is required and serves as the main page
                        of your website.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>Unpublishing a page hides it from visitors.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>Click "Design" to edit the page content.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
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
        title="Unpublish Page?"
        description="This page will be hidden from visitors. You can republish it at any time."
        confirmText="Unpublish Page"
        confirmVariant="destructive"
      />

      <ConfirmDialog
        open={deleteConfirmDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteConfirmDialog({ open: false, pageId: null })
        }
        onConfirm={confirmDelete}
        title="Delete Page?"
        description="This will permanently delete the page. This action cannot be undone."
        confirmText={deletingPage ? "Deleting..." : "Delete Page"}
        confirmVariant="destructive"
        isLoading={deletingPage}
      />

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="website pages"
        description="Export website pages, slug routes, and publication statuses as CSV."
        totalCount={displayPages.length}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          if (displayPages.length === 0) {
            toast({
              title: "Nothing to export",
              description: "No website pages found.",
              variant: "destructive",
            });
            return;
          }
          const csv = buildCsv(displayPages, [
            { header: "Page Name", getValue: (p: any) => p.name || "" },
            { header: "Slug", getValue: (p: any) => p.slug ? `/${p.slug}` : "" },
            { header: "Status", getValue: (p: any) => p.isEnabled ? "Published" : "Draft" },
            { header: "Created At", getValue: (p: any) => p.createdAt ? new Date(p.createdAt).toISOString().slice(0, 10) : "" },
            { header: "Updated At", getValue: (p: any) => p.updatedAt ? new Date(p.updatedAt).toISOString().slice(0, 10) : "" },
          ]);
          downloadCsv(csv, `website-pages-${new Date().toISOString().slice(0, 10)}`, format);
          toast({
            title: "Export ready",
            description: `${displayPages.length} page${displayPages.length !== 1 ? "s" : ""} exported.`,
          });
        }}
      />
    </EcosystemWrapper>
  );
}
