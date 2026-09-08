"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Edit2Icon, Globe, Search, Upload } from "lucide-react";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type {
  ExportCsvScope,
  ExportCsvFormat,
} from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";

import { getCustomDomain, getThricoDomain } from "@/graphql/actions/domain";
import {
  useGetAllPagesSeo,
  useUpdatePageSeo,
  useGetWebsite,
} from "@/graphql/actions/website";
import {
  AdminTable,
  AdminTableColumn,
} from "@/components/shared/admin-table/admin-table";
import { cn } from "@/lib/utils";
import { EcosystemHeader } from "@/components/layout/ecosystem";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInfoBanner,
} from "@/components/gamification/shared/polaris-form-ui";
import { SeoDrawer, SeoFormValues } from "./seo";

export default function SeoManager() {
  const { toast } = useToast();
  const [pages, setPages] = useState<any[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState("https://thrico.community");
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const { data: websiteData, loading: websiteLoading } = useGetWebsite({});
  const websiteId = websiteData?.getWebsite?.id;

  const { data: seoData, refetch: refetchPagesSeo } = useGetAllPagesSeo(
    websiteId || "",
    {
      skip: !websiteId,
      onCompleted: (data) => {
        if (data?.getAllPagesSeo) {
          setPages(data.getAllPagesSeo);
        }
      },
    },
  );

  useEffect(() => {
    if (seoData?.getAllPagesSeo) {
      setPages(seoData.getAllPagesSeo);
    } else if (websiteData?.getWebsite?.pages && pages.length === 0) {
      setPages(websiteData.getWebsite.pages);
    }
  }, [seoData, websiteData, pages.length]);

  const [updatePageSeoMutation, { loading: isSaving }] = useUpdatePageSeo({
    onCompleted: () => {
      toast({
        title: "SEO Saved",
        description: "Meta tags and semantic search data updated.",
      });
      setIsDrawerOpen(false);
      refetchPagesSeo();
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update page SEO.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    async function fetchDomain() {
      try {
        const custom = await getCustomDomain();
        if (custom) {
          setWebsiteUrl(`https://${custom}`);
          return;
        }
        const thrico = await getThricoDomain();
        if (thrico) {
          setWebsiteUrl(`https://${thrico}`);
        }
      } catch (err) {
        console.error("Failed to fetch domain:", err);
      }
    }
    fetchDomain();
  }, []);

  const handleEditClick = (page: any) => {
    setEditingPageId(page.id);
    setIsDrawerOpen(true);
  };

  const handleSave = (values: SeoFormValues) => {
    if (!editingPageId) return;

    const keywordsArray = values.keywords
      ? values.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : [];

    updatePageSeoMutation({
      variables: {
        pageId: editingPageId,
        title: values.title,
        description: values.description,
        keywords: keywordsArray,
        ogImage: values.ogImage,
        schemaMarkup: values.schemaMarkup,
      },
    });
  };

  const editingPage = pages.find((p) => p.id === editingPageId) || null;
  const optimizedCount = pages.filter((p: any) => p.seo?.title).length;

  const columns: AdminTableColumn<any>[] = [
    {
      key: "name",
      header: "Page & Path",
      cell: (row) => (
        <div className="space-y-0.5">
          <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            {row.name}
            {row.slug === "home" && (
              <Badge
                variant="outline"
                className="text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 py-0"
              >
                Homepage
              </Badge>
            )}
          </div>
          <div className="text-[11px] font-mono text-zinc-400">/{row.slug}</div>
        </div>
      ),
    },
    {
      key: "seo-title",
      header: "Meta Title",
      cell: (row) => (
        <div className="max-w-[220px]">
          {row.seo?.title ? (
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1">
              {row.seo.title}
            </span>
          ) : (
            <span className="text-xs text-zinc-400 italic">Not configured</span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "SEO Status",
      cell: (row) => {
        const isOptimized = !!row.seo?.title && !!row.seo?.description;
        return (
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-bold",
              isOptimized
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
            )}
          >
            {isOptimized ? "Optimized" : "Draft Meta"}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEditClick(row)}
          className="h-8 rounded-lg text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 border-transparent shadow-xs gap-1.5"
        >
          <Edit2Icon className="h-3 w-3" />
          Optimize
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-black/10 overflow-hidden relative">
      <EcosystemHeader
        title="SEO Settings"
        description="Manage meta tags, search engine previews, and JSON-LD schema across website pages."
        icon={Globe}
        badgeText="Website Builder"
        breadcrumbs={[
          { label: "Website Builder", href: "/app-layout" },
          { label: "General Settings", href: "/app-layout/settings" },
          { label: "SEO & Discoverability" },
        ]}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowExportModal(true)}
            className="h-8 gap-1.5 text-xs font-medium bg-card border-border shadow-2xs text-foreground px-2.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Export
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <PolarisFormLayout
          sidebar={
            <div className="space-y-6">
              {/* SEO Health Overview Card */}
              <PolarisSidebarCard
                title="SEO Index Health"
                badge={`${Math.round((optimizedCount / (pages.length || 1)) * 100)}% Ready`}
                icon={Globe}
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 text-center">
                      <span className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 block">
                        {pages.length}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Total Pages
                      </span>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 text-center">
                      <span className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 block">
                        {optimizedCount}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Optimized
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <PolarisSummaryRow
                      label="Canonical Domain"
                      value={websiteUrl.replace("https://", "")}
                    />
                    <PolarisSummaryRow
                      label="Schema Status"
                      value="JSON-LD Ready"
                      isLast
                    />
                  </div>
                </div>
              </PolarisSidebarCard>

              {/* Strategic Tip */}
              <PolarisTipCard title="Search Engine Best Practices">
                Keep page titles between 45–60 characters to avoid truncation on
                Google search result pages. Always provide a clear,
                benefit-driven meta description.
              </PolarisTipCard>
            </div>
          }
        >
          <div className="space-y-6">
            <PolarisInfoBanner
              title="Search Engine Indexing"
              description="Each published page generates its own OpenGraph cards and meta headers. Click 'Optimize' on any page to configure titles, descriptions, and structured schema."
            />

            {/* Step 1: Pages Table */}
            <PolarisFormCard
              step={1}
              title="Page Metadata Architecture"
              description="Manage search engine indexing and social cards on a per-page basis."
              badge="Pages"
              icon={Search}
            >
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
                <AdminTable
                  columns={columns}
                  data={pages}
                  loading={websiteLoading}
                  keyExtractor={(p) => p.id}
                  emptyIcon={Globe}
                  emptyTitle="No Pages Found"
                  emptyDescription="Create pages to begin configuring SEO metadata."
                  className="border-0 shadow-none rounded-none bg-transparent"
                />
              </div>
            </PolarisFormCard>
          </div>
        </PolarisFormLayout>
      </div>

      {/* SEO Edit Drawer Component */}
      <SeoDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        page={editingPage}
        websiteUrl={websiteUrl}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* Export CSV Modal */}
      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="SEO pages"
        description="Export website pages, meta titles, descriptions, and SEO configuration as CSV."
        totalCount={pages.length}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          if (pages.length === 0) {
            toast({
              title: "Nothing to export",
              description: "No SEO pages found.",
              variant: "destructive",
            });
            return;
          }
          const csv = buildCsv(pages, [
            { header: "Page Name", getValue: (p: any) => p.name || "" },
            {
              header: "Slug",
              getValue: (p: any) => (p.slug ? `/${p.slug}` : ""),
            },
            { header: "Meta Title", getValue: (p: any) => p.seo?.title || "" },
            {
              header: "Meta Description",
              getValue: (p: any) => p.seo?.description || "",
            },
            {
              header: "Keywords",
              getValue: (p: any) =>
                Array.isArray(p.seo?.keywords)
                  ? p.seo.keywords.join(", ")
                  : p.seo?.keywords || "",
            },
            {
              header: "SEO Status",
              getValue: (p: any) =>
                p.seo?.title && p.seo?.description ? "Optimized" : "Draft Meta",
            },
            {
              header: "Include in Sitemap",
              getValue: (p: any) =>
                (p.seo?.includeInSitemap ?? true) ? "Yes" : "No",
            },
          ]);
          downloadCsv(
            csv,
            `website-seo-${new Date().toISOString().slice(0, 10)}`,
            format,
          );
          toast({
            title: "Export ready",
            description: `${pages.length} page${pages.length !== 1 ? "s" : ""} exported.`,
          });
        }}
      />
    </div>
  );
}
