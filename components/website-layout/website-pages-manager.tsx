"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Layout,
  Layers,
  Trash2,
  Globe,
  Upload,
  Search,
  Edit2,
  Compass,
  ArrowUpRight,
  ArrowRight,
  FileCode,
  CornerDownRight,
  ExternalLink,
} from "lucide-react";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type {
  ExportCsvScope,
  ExportCsvFormat,
} from "@/components/shared/export-csv-modal";
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
import { EditPageDialog } from "@/components/pages/edit-page-dialog";
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
} from "@/components/layout/ecosystem";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInfoBanner,
  PolarisQuickChip,
} from "@/components/gamification/shared/polaris-form-ui";
import {
  PageRedirectConfig,
  getPageRedirect,
  formatRedirectDestination,
} from "@/components/website-layout/page-redirect-utils";

interface WebsitePageRecord {
  id: string;
  name: string;
  slug: string;
  isEnabled: boolean;
  isSystem?: boolean;
  canDelete?: boolean;
  redirect?: PageRedirectConfig;
  seo?: {
    schemaMarkup?: unknown;
    [key: string]: unknown;
  };
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
}

type StatusFilterType = "ALL" | "PUBLISHED" | "DRAFT" | "REDIRECTS";

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

  const [updatePageMutation] = useUpdatePage({
    onCompleted: (data) => {
      toast({
        title: "Status Updated",
        description: `Page '${data.updatePage.name}' is now ${
          data.updatePage.isEnabled ? "published" : "draft"
        }.`,
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

  // State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<WebsitePageRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("ALL");

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

  const displayPages: WebsitePageRecord[] = useMemo(() => {
    return (websiteData?.getWebsite?.pages as WebsitePageRecord[]) || [];
  }, [websiteData?.getWebsite?.pages]);

  const totalCount = displayPages.length;
  const publishedCount = useMemo(
    () => displayPages.filter((p) => p.isEnabled).length,
    [displayPages],
  );
  const draftCount = totalCount - publishedCount;
  const redirectCount = useMemo(
    () => displayPages.filter((p) => getPageRedirect(p) !== null).length,
    [displayPages],
  );

  // Filtered pages based on search and status chip
  const filteredPages = useMemo(() => {
    return displayPages.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" && p.isEnabled) ||
        (statusFilter === "DRAFT" && !p.isEnabled) ||
        (statusFilter === "REDIRECTS" && getPageRedirect(p) !== null);

      return matchesSearch && matchesStatus;
    });
  }, [displayPages, searchQuery, statusFilter]);

  const handleEditPage = (pageId: string) => {
    const page = displayPages.find((p) => p.id === pageId);
    setCurrentPage(pageId);
    if (page?.slug) {
      router.push(`/app-layout/layout?page=${page.slug}`);
    } else {
      router.push(`/app-layout/layout?pageId=${pageId}`);
    }
  };

  const handleOpenEditModal = (page: WebsitePageRecord) => {
    setEditingPage(page);
    setIsEditOpen(true);
  };

  const handleToggleStatus = (pageId: string, currentStatus: boolean) => {
    const page = displayPages.find((p: WebsitePageRecord) => p.id === pageId);
    if (!page || page.isSystem || page.slug === "home") return;

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

  const columns: AdminTableColumn<WebsitePageRecord>[] = [
    {
      key: "designation",
      header: "Page Name",
      cell: (row) => {
        const isHomePage = row.slug === "home";
        const redirect = getPageRedirect(row);

        return (
          <div className="flex items-center gap-2.5">
            <AdminTableItem
              icon={redirect ? CornerDownRight : Layout}
              title={row.name}
              badge={
                isHomePage ? (
                  <div className="flex items-center gap-1">
                    <Badge
                      variant="outline"
                      className="text-[9.5px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 px-1.5 py-0"
                    >
                      Root Index
                    </Badge>
                    {redirect && (
                      <Badge
                        variant="outline"
                        className="text-[9.5px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800 px-1.5 py-0 flex items-center gap-1"
                      >
                        <CornerDownRight className="h-2.5 w-2.5" />
                        <span>Redirect {redirect.statusCode}</span>
                      </Badge>
                    )}
                  </div>
                ) : redirect ? (
                  <Badge
                    variant="outline"
                    className="text-[9.5px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800 px-1.5 py-0 flex items-center gap-1"
                  >
                    <CornerDownRight className="h-2.5 w-2.5" />
                    <span>Redirect {redirect.statusCode}</span>
                  </Badge>
                ) : row.isSystem ? (
                  <AdminTableTag variant="indigo">System Page</AdminTableTag>
                ) : undefined
              }
              subtitle={
                redirect ? (
                  <span className="text-[10.5px] text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1">
                    <span>➔</span>
                    <span className="truncate max-w-[160px]">
                      {formatRedirectDestination(redirect)}
                    </span>
                    {redirect.openInNewTab && (
                      <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-70" />
                    )}
                  </span>
                ) : undefined
              }
            />
          </div>
        );
      },
    },
    {
      key: "namespace",
      header: "URL Path",
      cell: (row) => {
        const redirect = getPageRedirect(row);
        return (
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-[#616161] dark:text-zinc-400 bg-[#f6f6f7] dark:bg-zinc-800 px-2 py-0.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 select-all">
              /{row.slug}
            </span>
            {redirect && (
              <span
                className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold"
                title={`Redirects to ${redirect.targetUrl}`}
              >
                ➔
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "protocol-status",
      header: "Publishing Status",
      headerClassName: "text-center",
      className: "text-center",
      cell: (row) => {
        const isHomePage = row.slug === "home";
        return (
          <Button
            type="button"
            variant="ghost"
            className="p-0 h-auto hover:bg-transparent cursor-pointer"
            onClick={() => handleToggleStatus(row.id, row.isEnabled)}
            disabled={row.isSystem || isHomePage}
            title={
              isHomePage
                ? "The home page is always published"
                : row.isEnabled
                  ? "Click to switch to draft"
                  : "Click to publish"
            }
          >
            <AdminStatusBadge status={row.isEnabled ? "ACTIVE" : "DRAFT"}>
              {row.isEnabled ? "Published" : "Draft"}
            </AdminStatusBadge>
          </Button>
        );
      },
    },
    {
      key: "matrix-actions",
      header: "",
      headerClassName: "w-36 text-right",
      className: "text-right",
      cell: (row) => {
        const isHomePage = row.slug === "home";
        const redirect = getPageRedirect(row);
        return (
          <div className="flex items-center justify-end gap-1.5">
            {redirect ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs font-medium border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 shadow-2xs gap-1.5 cursor-pointer"
                onClick={() => handleOpenEditModal(row)}
                title="Configure URL Redirection"
              >
                <CornerDownRight className="h-3 w-3 text-amber-600" />
                <span>Redirect</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs font-medium border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[#303030] dark:text-zinc-200 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 shadow-2xs gap-1.5 cursor-pointer"
                onClick={() => handleEditPage(row.id)}
                title="Open in Visual Builder"
              >
                <Layers className="h-3 w-3" />
                <span>Design</span>
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[#616161] hover:text-[#303030] dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 shadow-2xs cursor-pointer"
              onClick={() => handleOpenEditModal(row)}
              title="Edit Page Properties"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            {row.canDelete && !isHomePage && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-[6px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 cursor-pointer"
                onClick={() => handleDeletePage(row.id)}
                title="Delete Page"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <EcosystemWrapper>
      {/* ─── Zero-Clutter Header ─── */}
      <EcosystemHeader
        title="Website Pages"
        description="Manage your website page architecture, URL routing paths, and publishing statuses."
        icon={Layout}
        badgeText="Website Studio"
        breadcrumbs={[
          { label: "Website Studio", href: "/app-layout" },
          { label: "Website Pages" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowExportModal(true)}
              className="h-8.5 px-3 gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border border-[#d2d5d9] dark:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 shadow-2xs text-xs font-medium text-[#303030] dark:text-zinc-200 cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="h-8.5 px-3.5 gap-1.5 bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-2xs text-xs font-medium cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              New Page
            </Button>
          </div>
        }
      />

      {/* ─── Responsive Polaris Form Layout Canvas ─── */}
      <div className="flex-1 overflow-y-auto">
        <PolarisFormLayout
          sidebar={
            <div className="space-y-4">
              {/* Pages Overview Stats Card */}
              <PolarisSidebarCard
                title="Pages Overview"
                badge={`${publishedCount} / ${totalCount} Live`}
                badgeVariant="indigo"
                icon={Globe}
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-[#f6f6f7] dark:bg-zinc-800/60 p-2.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-700/80 text-center">
                      <span className="text-xl font-bold font-mono text-[#303030] dark:text-zinc-100 block">
                        {totalCount}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#616161] dark:text-zinc-400">
                        Total Pages
                      </span>
                    </div>
                    <div className="bg-[#f6f6f7] dark:bg-zinc-800/60 p-2.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-700/80 text-center">
                      <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
                        {publishedCount}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        Published
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1.5">
                    <PolarisSummaryRow
                      label="Root Index Route"
                      value={<span className="font-mono text-xs">/home</span>}
                    />
                    <PolarisSummaryRow
                      label="Primary Domain"
                      value={
                        websiteData?.getWebsite?.customDomain ? (
                          <span className="font-mono text-xs truncate max-w-[140px] block">
                            {websiteData.getWebsite.customDomain}
                          </span>
                        ) : (
                          "thrico.community"
                        )
                      }
                    />
                    <PolarisSummaryRow
                      label="Redirect Routes"
                      value={
                        <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
                          {redirectCount} configured
                        </span>
                      }
                    />
                    <PolarisSummaryRow
                      label="Studio Mode"
                      value="Linear CMS"
                      isLast
                    />
                  </div>
                </div>
              </PolarisSidebarCard>

              {/* Studio Quick Shortcuts */}
              <PolarisSidebarCard
                title="Studio Shortcuts"
                badge="Linear Hub"
                icon={Compass}
              >
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => router.push("/app-layout/layout")}
                    className="w-full flex items-center justify-between p-2 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-800/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 hover:border-[#aeb4b9] text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-[4px] bg-white dark:bg-zinc-900 border border-[#d2d5d9] dark:border-zinc-700 flex items-center justify-center shrink-0">
                        <Layers className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#303030] dark:text-zinc-100 block">
                          Visual Builder
                        </span>
                        <span className="text-[10.5px] text-[#616161] dark:text-zinc-400 block">
                          Canvas editor & live preview
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/app-layout/navigation")}
                    className="w-full flex items-center justify-between p-2 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-800/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 hover:border-[#aeb4b9] text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-[4px] bg-white dark:bg-zinc-900 border border-[#d2d5d9] dark:border-zinc-700 flex items-center justify-center shrink-0">
                        <FileCode className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#303030] dark:text-zinc-100 block">
                          Navbar & Menu
                        </span>
                        <span className="text-[10.5px] text-[#616161] dark:text-zinc-400 block">
                          Header links & layout
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/app-layout/seo")}
                    className="w-full flex items-center justify-between p-2 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-800/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 hover:border-[#aeb4b9] text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-[4px] bg-white dark:bg-zinc-900 border border-[#d2d5d9] dark:border-zinc-700 flex items-center justify-center shrink-0">
                        <Globe className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#303030] dark:text-zinc-100 block">
                          SEO & Meta Tags
                        </span>
                        <span className="text-[10.5px] text-[#616161] dark:text-zinc-400 block">
                          OpenGraph & social cards
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                </div>
              </PolarisSidebarCard>

              {/* Best Practice Tip Card */}
              <PolarisTipCard title="Page Architecture Standards">
                <ul className="space-y-1.5 list-disc pl-3 text-[11px]">
                  <li>
                    The <strong>/home</strong> page acts as the root index route and cannot be unpublished.
                  </li>
                  <li>
                    Draft pages are accessible to administrators in the builder, but return 404 to visitors.
                  </li>
                  <li>
                    Click <strong>Design</strong> to open the visual layout canvas and configure page components.
                  </li>
                </ul>
              </PolarisTipCard>
            </div>
          }
        >
          {/* Main Form Column (8 Cols) */}
          <div className="space-y-4">
            {/* Polaris Info Banner */}
            <PolarisInfoBanner
              title="Website Routing Architecture"
              description="Configure pages, URL routes, and publication statuses. Click Design to customize block layouts and modules in the visual editor."
            />

            {/* Pro Upgrade Banner (Polaris & Linear Card) */}
            {!isPremium && (
              <div className="rounded-[10px] border border-indigo-200/90 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/50 dark:from-indigo-950/40 dark:via-zinc-900 dark:to-purple-950/20 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4 relative overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-900/60 px-2 py-0.5 rounded-[4px] border border-indigo-200 dark:border-indigo-800">
                        Pro Architecture
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#303030] dark:text-zinc-100">
                      Unlock Unlimited Pages & Premium Modules
                    </h3>
                    <p className="text-xs text-[#616161] dark:text-zinc-400 max-w-xl leading-relaxed">
                      Create unlimited nested page routes, multi-tier navigation menus, and gain access to custom builder components.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => router.push("/settings/subscription")}
                    className="h-8 px-3.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs gap-1.5 shrink-0 cursor-pointer"
                  >
                    <span>Upgrade</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Main Form Card: Pages Directory */}
            <PolarisFormCard
              icon={Layout}
              title="Website Pages Directory"
              description="Manage public website routes, publication states, and visual design layouts."
              badge={`${filteredPages.length} ${filteredPages.length === 1 ? "Page" : "Pages"}`}
              badgeVariant="indigo"
            >
              {/* Search & Quick Chips Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-2 border-b border-[#e1e3e5]/60 dark:border-zinc-800/80">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#616161] dark:text-zinc-400 pointer-events-none" />
                  <Input
                    placeholder="Search pages by name or slug..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 pr-12 text-xs bg-[#f6f6f7] dark:bg-zinc-800/50 border-[#d2d5d9] dark:border-zinc-700 focus-visible:ring-1 focus-visible:ring-[#005bd3]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#616161] hover:text-[#303030] dark:text-zinc-400 dark:hover:text-zinc-100 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <PolarisQuickChip
                    label={`All (${totalCount})`}
                    active={statusFilter === "ALL"}
                    onClick={() => setStatusFilter("ALL")}
                  />
                  <PolarisQuickChip
                    label={`Published (${publishedCount})`}
                    active={statusFilter === "PUBLISHED"}
                    onClick={() => setStatusFilter("PUBLISHED")}
                  />
                  <PolarisQuickChip
                    label={`Drafts (${draftCount})`}
                    active={statusFilter === "DRAFT"}
                    onClick={() => setStatusFilter("DRAFT")}
                  />
                  <PolarisQuickChip
                    label={`Redirects (${redirectCount})`}
                    active={statusFilter === "REDIRECTS"}
                    onClick={() => setStatusFilter("REDIRECTS")}
                  />
                </div>
              </div>

              {/* Polaris Admin Table Wrapper */}
              <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
                <AdminTable
                  columns={columns}
                  data={filteredPages}
                  loading={websiteLoading}
                  size="sm"
                  keyExtractor={(p) => p.id}
                  emptyIcon={Layout}
                  emptyTitle={
                    searchQuery ? "No Matching Pages Found" : "No Pages Found"
                  }
                  emptyDescription={
                    searchQuery
                      ? `No pages match "${searchQuery}". Try a different keyword.`
                      : "You haven't created any pages yet."
                  }
                  className="border-0 shadow-none border-t-0 rounded-none bg-transparent"
                />
              </div>
            </PolarisFormCard>
          </div>
        </PolarisFormLayout>
      </div>

      {/* ─── Create Page Modal Dialog ─── */}
      <CreatePageDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        websiteId={websiteData?.getWebsite?.id}
        onSuccess={(pageData) => {
          addPage(pageData.name, pageData.slug, pageData.redirect);
          refetch();
        }}
      />

      {/* ─── Edit Page Modal Dialog (Formik + Yup) ─── */}
      <EditPageDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        page={editingPage}
        onSuccess={refetch}
      />

      {/* ─── Unpublish Confirm Dialog ─── */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          !open &&
          setConfirmDialog({ open: false, pageId: null, currentStatus: false })
        }
        onConfirm={confirmToggle}
        title="Unpublish Page?"
        description="This page will be hidden from visitors and return a 404 response. You can republish it at any time."
        confirmText="Unpublish Page"
        confirmVariant="destructive"
      />

      {/* ─── Delete Page Confirm Dialog ─── */}
      <ConfirmDialog
        open={deleteConfirmDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteConfirmDialog({ open: false, pageId: null })
        }
        onConfirm={confirmDelete}
        title="Delete Page?"
        description="This will permanently delete the page and all assigned block modules. This action cannot be undone."
        confirmText={deletingPage ? "Deleting..." : "Delete Page"}
        confirmVariant="destructive"
        isLoading={deletingPage}
      />

      {/* ─── Export CSV Modal ─── */}
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
            {
              header: "Page Name",
              getValue: (p: WebsitePageRecord) => p.name || "",
            },
            {
              header: "Slug",
              getValue: (p: WebsitePageRecord) =>
                p.slug ? `/${p.slug}` : "",
            },
            {
              header: "Status",
              getValue: (p: WebsitePageRecord) =>
                p.isEnabled ? "Published" : "Draft",
            },
            {
              header: "Redirect",
              getValue: (p: WebsitePageRecord) => {
                const r = getPageRedirect(p);
                return r
                  ? `${r.type.toUpperCase()}: ${r.targetUrl} (${r.statusCode})`
                  : "None";
              },
            },
            {
              header: "Created At",
              getValue: (p: WebsitePageRecord) =>
                p.createdAt
                  ? new Date(p.createdAt).toISOString().slice(0, 10)
                  : "",
            },
            {
              header: "Updated At",
              getValue: (p: WebsitePageRecord) =>
                p.updatedAt
                  ? new Date(p.updatedAt).toISOString().slice(0, 10)
                  : "",
            },
          ]);
          downloadCsv(
            csv,
            `website-pages-${new Date().toISOString().slice(0, 10)}`,
            format,
          );
          toast({
            title: "Export ready",
            description: `${displayPages.length} page${displayPages.length !== 1 ? "s" : ""} exported.`,
          });
        }}
      />
    </EcosystemWrapper>
  );
}
