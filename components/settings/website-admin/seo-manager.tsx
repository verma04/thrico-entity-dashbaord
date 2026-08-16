"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import {
  Edit2Icon,
  Wand2,
  Globe,
  SaveIcon,
  Search,
  CheckCircle2,
  AlertCircle,
  Code2,
  Sparkles,
  Upload,
} from "lucide-react";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";

import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
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

interface SeoFormValues {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  schemaMarkup: string;
}

// ------------------------------------------------
// SEO PREVIEW (SERP MOCKUP)
// ------------------------------------------------
function SeoPreview({
  title,
  description,
  slug,
  baseUrl,
}: {
  title: string;
  description: string;
  slug: string;
  baseUrl: string;
}) {
  const displayTitle = title || "Your Page Title - My Website";
  const displayDescription =
    description ||
    "Add a meta description to preview how your snippet appears to searchers on Google and Bing.";
  const safeBaseUrl =
    typeof baseUrl === "string" ? baseUrl : "thrico.community";
  const displayDomain = safeBaseUrl
    .replace("https://", "")
    .replace("http://", "");

  const titleLength = title?.length || 0;
  const descLength = description?.length || 0;

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            Google SERP Projection
          </h4>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
        >
          Live Preview
        </Badge>
      </div>

      {/* Snippet Card */}
      <div className="bg-zinc-50/80 dark:bg-zinc-900/50 rounded-xl p-4 space-y-1.5 border border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center text-[9px] font-bold">
            G
          </div>
          <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
            {displayDomain}
          </span>
        </div>
        <div className="text-base text-blue-600 dark:text-blue-400 font-semibold line-clamp-1 leading-snug">
          {displayTitle}
        </div>
        <div className="text-[11px] font-mono text-zinc-500 truncate max-w-full">
          https://{displayDomain}/{slug || "page"}
        </div>
        <div className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed pt-0.5">
          {displayDescription}
        </div>
      </div>

      {/* Length meters */}
      <div className="grid grid-cols-2 gap-4 text-xs pt-1">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-semibold text-zinc-500">Title Length</span>
            <span
              className={cn(
                "font-bold font-mono",
                titleLength > 60
                  ? "text-rose-500"
                  : titleLength >= 45
                    ? "text-emerald-600"
                    : "text-zinc-600 dark:text-zinc-400",
              )}
            >
              {titleLength}/60
            </span>
          </div>
          <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300 rounded-full",
                titleLength > 60
                  ? "bg-rose-500"
                  : titleLength >= 45
                    ? "bg-emerald-500"
                    : "bg-zinc-900 dark:bg-zinc-100",
              )}
              style={{ width: `${Math.min((titleLength / 60) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-semibold text-zinc-500">Description</span>
            <span
              className={cn(
                "font-bold font-mono",
                descLength > 160
                  ? "text-rose-500"
                  : descLength >= 120
                    ? "text-emerald-600"
                    : "text-zinc-600 dark:text-zinc-400",
              )}
            >
              {descLength}/160
            </span>
          </div>
          <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300 rounded-full",
                descLength > 160
                  ? "bg-rose-500"
                  : descLength >= 120
                    ? "bg-emerald-500"
                    : "bg-zinc-900 dark:bg-zinc-100",
              )}
              style={{ width: `${Math.min((descLength / 160) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------
// SCHEMA PREVIEW
// ------------------------------------------------
function SchemaPreview({ schemaMarkup }: { schemaMarkup: string }) {
  let parsedJson: any = null;
  let isValid = false;

  if (schemaMarkup) {
    try {
      parsedJson = JSON.parse(schemaMarkup);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <Code2 className="h-4 w-4" />
          <span>Structured Data (JSON-LD)</span>
        </div>
        {schemaMarkup && (
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-bold",
              isValid
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
            )}
          >
            {isValid ? "Valid JSON" : "Invalid Syntax"}
          </Badge>
        )}
      </div>
      {isValid && parsedJson ? (
        <div className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 space-y-1 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <p>
            <span className="text-zinc-400">@type:</span>{" "}
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {parsedJson["@type"] || "WebPage"}
            </span>
          </p>
          {parsedJson.name && (
            <p>
              <span className="text-zinc-400">name:</span> {parsedJson.name}
            </p>
          )}
          {parsedJson.description && (
            <p className="line-clamp-2">
              <span className="text-zinc-400">description:</span>{" "}
              {parsedJson.description}
            </p>
          )}
        </div>
      ) : (
        <p className="text-[11px] text-zinc-400">
          Schema markup allows search engines to show rich snippets (breadcrumbs, site navigation, and product features).
        </p>
      )}
    </div>
  );
}

// ------------------------------------------------
// SEO MANAGER MAIN COMPONENT
// ------------------------------------------------
export default function SeoManager() {
  const { toast } = useToast();
  const { pages, setPages } = useWebsiteBuilderStore();
  const [websiteUrl, setWebsiteUrl] = useState("https://thrico.community");
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const { data: websiteData, loading: websiteLoading } = useGetWebsite({});
  const websiteId = websiteData?.getWebsite?.id;

  const { refetch: refetchPagesSeo } = useGetAllPagesSeo({
    variables: { websiteId: websiteId || "" },
    skip: !websiteId,
    onCompleted: (data) => {
      if (data?.getAllPagesSeo) {
        setPages(data.getAllPagesSeo);
      }
    },
  });

  const [updatePageSeoMutation, { loading: isSaving }] = useUpdatePageSeo({
    onCompleted: () => {
      toast({
        title: "SEO Saved",
        description: "Meta tags and semantic search data updated.",
      });
      setIsModalVisible(false);
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

  const form = useForm<SeoFormValues>({
    defaultValues: {
      title: "",
      description: "",
      keywords: "",
      ogImage: "",
      schemaMarkup: "",
    },
  });

  const handleEditClick = (page: any) => {
    setEditingPageId(page.id);
    form.reset({
      title: page.seo?.title || page.name || "",
      description: page.seo?.description || "",
      keywords: Array.isArray(page.seo?.keywords)
        ? page.seo.keywords.join(", ")
        : page.seo?.keywords || "",
      ogImage: page.seo?.ogImage || "",
      schemaMarkup: page.seo?.schemaMarkup || "",
    });
    setIsModalVisible(true);
  };

  const handleSave = form.handleSubmit((values) => {
    if (!editingPageId) return;

    const keywordsArray = values.keywords
      ? values.keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : [];

    updatePageSeoMutation({
      variables: {
        pageId: editingPageId,
        input: {
          title: values.title,
          description: values.description,
          keywords: keywordsArray,
          ogImage: values.ogImage,
          schemaMarkup: values.schemaMarkup,
        },
      },
    });
  });

  const generateSchemaMarkup = () => {
    const page = pages.find((p) => p.id === editingPageId);
    const title = form.getValues("title") || page?.name || "Page";
    const description = form.getValues("description") || "";
    const slug = page?.slug || "";

    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description: description,
      url: `${websiteUrl}/${slug}`,
    };

    form.setValue("schemaMarkup", JSON.stringify(schema, null, 2));
    toast({
      title: "Schema Generated",
      description: "JSON-LD WebPage schema has been created.",
    });
  };

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
      {/* Centered Top Header with max-w-[1040px] Breathing Space */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 md:px-8 py-3">
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
        </div>
      </div>

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
                Keep page titles between 45–60 characters to avoid truncation on Google search result pages. Always provide a clear, benefit-driven meta description.
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

      {/* SEO Edit Modal */}
      <Dialog open={isModalVisible} onOpenChange={setIsModalVisible}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl p-0 overflow-hidden text-zinc-900 dark:text-zinc-100">
          <div className="border-b border-zinc-100 dark:border-zinc-800 px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
            <div>
              <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Page SEO & Social Metadata
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                Customize title tags, descriptions, and JSON-LD schema.
              </DialogDescription>
            </div>
            <Badge
              variant="outline"
              className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 text-[10px] font-bold"
            >
              /{pages.find((p) => p.id === editingPageId)?.slug || "page"}
            </Badge>
          </div>

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={handleSave} className="space-y-6">
                {/* Live Preview */}
                <SeoPreview
                  title={form.watch("title")}
                  description={form.watch("description")}
                  slug={pages.find((p) => p.id === editingPageId)?.slug || ""}
                  baseUrl={websiteUrl}
                />

                {/* Form Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: "Meta title is required" }}
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          Meta Title Tag <span className="text-rose-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Acme Community - Exclusive Builder Network"
                            className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-medium shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                          />
                        </FormControl>
                        <FormMessage className="text-[11px] text-rose-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    rules={{ required: "Meta description is required" }}
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          Meta Description Tag <span className="text-rose-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter a concise 1-2 sentence description summarizing this page for search engine users..."
                            rows={3}
                            className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs resize-none shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                          />
                        </FormControl>
                        <FormMessage className="text-[11px] text-rose-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          Meta Keywords
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="community, creators, ecommerce, loyalty"
                            className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-medium shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                          />
                        </FormControl>
                        <p className="text-[11px] text-zinc-400">
                          Comma-separated terms relevant to this page content.
                        </p>
                        <FormMessage className="text-[11px] text-rose-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Schema Markup */}
                <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Structured Data (JSON-LD)
                      </h4>
                      <p className="text-[11px] text-zinc-500">
                        Inject semantic Schema.org annotations for Google Rich Snippets.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateSchemaMarkup}
                      className="h-8 px-3 rounded-lg text-xs font-semibold border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 gap-1.5"
                    >
                      <Sparkles className="h-3 w-3" />
                      Auto-Generate
                    </Button>
                  </div>

                  <SchemaPreview schemaMarkup={form.watch("schemaMarkup")} />

                  <FormField
                    control={form.control}
                    name="schemaMarkup"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='{"@context": "https://schema.org", "@type": "WebPage", ...}'
                            className="font-mono text-[11px] h-28 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl p-3 resize-none shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                          />
                        </FormControl>
                        <FormMessage className="text-[11px] text-rose-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-800 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalVisible(false)}
                    disabled={isSaving}
                    className="h-9 px-4 rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="h-9 px-5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs shadow-xs"
                  >
                    <SaveIcon
                      className={cn(
                        "h-3.5 w-3.5 mr-1.5",
                        isSaving && "animate-spin",
                      )}
                    />
                    {isSaving ? "Saving..." : "Save Metadata"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

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
            { header: "Slug", getValue: (p: any) => p.slug ? `/${p.slug}` : "" },
            { header: "Meta Title", getValue: (p: any) => p.seo?.title || "" },
            { header: "Meta Description", getValue: (p: any) => p.seo?.description || "" },
            { header: "Keywords", getValue: (p: any) => Array.isArray(p.seo?.keywords) ? p.seo.keywords.join(", ") : (p.seo?.keywords || "") },
            { header: "SEO Status", getValue: (p: any) => (p.seo?.title && p.seo?.description) ? "Optimized" : "Draft Meta" },
            { header: "Include in Sitemap", getValue: (p: any) => (p.seo?.includeInSitemap ?? true) ? "Yes" : "No" },
          ]);
          downloadCsv(csv, `website-seo-${new Date().toISOString().slice(0, 10)}`, format);
          toast({
            title: "Export ready",
            description: `${pages.length} page${pages.length !== 1 ? "s" : ""} exported.`,
          });
        }}
      />
    </div>
  );
}
