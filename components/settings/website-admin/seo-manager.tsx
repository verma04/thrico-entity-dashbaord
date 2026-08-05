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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import {
  Edit2Icon,
  Wand2,
  Globe,
  RefreshCw,
  SaveIcon,
  ChevronRight,
  Info,
} from "lucide-react";

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
import { EcosystemWrapper, EcosystemHeader, EcosystemContainer } from "@/components/layout/ecosystem";

interface SeoFormValues {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  schemaMarkup: string;
}

// SEO Preview Component
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
    "Add a meta description to see how your page appears in search results.";
  const safeBaseUrl = typeof baseUrl === "string" ? baseUrl : "thrico.community";
  const displayDomain = safeBaseUrl.replace("https://", "").replace("http://", "");

  const getTitleStatus = (length: number) => {
    if (length === 0) return "text-muted-foreground";
    if (length > 60) return "text-destructive";
    if (length >= 50) return "text-amber-500";
    return "text-emerald-500";
  };

  const getDescStatus = (length: number) => {
    if (length === 0) return "text-muted-foreground";
    if (length > 160) return "text-destructive";
    if (length >= 140) return "text-amber-500";
    return "text-emerald-500";
  };

  const titleLength = title?.length || 0;
  const descLength = description?.length || 0;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-slate-200/50 space-y-6">
      <div className="flex items-center gap-2 px-1">
        <Globe className="h-4 w-4 text-indigo-500" />
        <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest">
          Search Engine Projection
        </h4>
      </div>

      <div className="bg-muted/30 rounded-2xl p-6 space-y-1 border border-slate-50">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded-full bg-linear-to-br from-blue-500 to-emerald-500 shadow-sm" />
          <span className="text-[10px] font-bold text-muted-foreground">
            {displayDomain}
          </span>
        </div>
        <div className="text-xl text-blue-600 font-medium mb-1 line-clamp-1 leading-tight">
          {displayTitle}
        </div>
        <div className="text-[11px] text-emerald-700 mb-2 truncate max-w-full">
          {baseUrl}/{slug || "page"}
        </div>
        <div className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
          {displayDescription}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 text-[10px] px-1">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-black text-muted-foreground uppercase tracking-tighter">
              Title Amplitude
            </span>
            <span className={cn("font-black", getTitleStatus(titleLength))}>
              {titleLength} / 60
            </span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                titleLength === 0
                  ? "bg-muted"
                  : titleLength > 60
                    ? "bg-destructive"
                    : titleLength >= 50
                      ? "bg-amber-500"
                      : "bg-emerald-500",
              )}
              style={{ width: `${Math.min((titleLength / 60) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-black text-muted-foreground uppercase tracking-tighter">
              Desc Density
            </span>
            <span className={cn("font-black", getDescStatus(descLength))}>
              {descLength} / 160
            </span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                descLength === 0
                  ? "bg-muted"
                  : descLength > 160
                    ? "bg-destructive"
                    : descLength >= 140
                      ? "bg-amber-500"
                      : "bg-emerald-500",
              )}
              style={{ width: `${Math.min((descLength / 160) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Schema Markup Preview Component
function SchemaPreview({ schemaMarkup }: { schemaMarkup: string }) {
  const parseSchema = () => {
    if (!schemaMarkup || schemaMarkup.trim() === "") {
      return { valid: null, data: null, error: null };
    }

    try {
      let jsonStr = schemaMarkup;
      const scriptMatch = schemaMarkup.match(
        /<script[^>]*>([\s\S]*?)<\/script>/,
      );
      if (scriptMatch) {
        jsonStr = scriptMatch[1].trim();
      }

      const parsed = JSON.parse(jsonStr);
      return { valid: true, data: parsed, error: null };
    } catch (error) {
      return {
        valid: false,
        data: null,
        error: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  };

  const { valid, data, error } = parseSchema();

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-slate-200/50 space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2.5 h-2.5 rounded-full animate-pulse",
              valid === null
                ? "bg-muted"
                : valid
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  : "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]",
            )}
          />
          <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest">
            Semantic Schema Index
          </h4>
        </div>
        {valid !== null && (
          <span
            className={cn(
              "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
              valid
                ? "bg-emerald-50 text-emerald-600"
                : "bg-destructive/10 text-destructive",
            )}
          >
            {valid ? "Verified Protocol" : "Syntax Error"}
          </span>
        )}
      </div>

      <div className="bg-muted/30 rounded-2xl p-6 border border-slate-50 min-h-[140px] flex flex-col justify-center">
        {valid === null ? (
          <div className="text-[10px] font-bold text-muted-foreground text-center uppercase tracking-widest leading-relaxed">
            Awaiting semantic injection...
            <br />
            Generate or paste JSON-LD markup
          </div>
        ) : valid === false ? (
          <div className="space-y-2">
            <p className="text-[10px] font-black text-destructive uppercase tracking-widest">
              Critical Syntax Failure
            </p>
            <p className="text-[11px] text-destructive/80 font-mono bg-card p-3 rounded-xl border border-destructive/10 overflow-x-auto">
              {error}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Entity Class:
              </span>
              <span className="text-xs font-bold text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded-md">
                @{data["@type"] || "Unknown"}
              </span>
            </div>
            {data.name && (
              <div className="space-y-1">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  Designation
                </span>
                <p className="text-xs font-bold text-foreground">{data.name}</p>
              </div>
            )}
            {data.description && (
              <div className="space-y-1">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  Description Extract
                </span>
                <p className="text-xs font-medium text-muted-foreground line-clamp-2 leading-relaxed">
                  {data.description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SeoManager() {
  const { toast } = useToast();
  const { updatePageSeo } = useWebsiteBuilderStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data: websiteData, loading: websiteLoading } = useGetWebsite({});
  const websiteId = websiteData?.getWebsite?.id;

  const { data: seoData, refetch: refetchSeo } = useGetAllPagesSeo(
    websiteId || "",
    { skip: !websiteId },
  );

  const [updatePageSeoMutation] = useUpdatePageSeo({
    onCompleted: () => {
      refetchSeo();
      toast({
        title: "Deployment Successful",
        description: "Metadata has been synchronized across nodes.",
      });
      setIsModalVisible(false);
      setIsSaving(false);
    },
    onError: (err) => {
      toast({
        title: "Deployment Failure",
        description: err.message,
        variant: "destructive",
      });
      setIsSaving(false);
    },
  });

  const form = useForm<SeoFormValues>({
    defaultValues: {
      title: "",
      description: "",
      keywords: "",
      ogImage: "",
      schemaMarkup: "",
    },
  });

  const websiteDomain = websiteData?.getWebsite?.customDomain;
  const websiteUrl = typeof websiteDomain === "string" && websiteDomain.trim().length > 0
    ? websiteDomain.startsWith("http") ? websiteDomain : `https://${websiteDomain}`
    : "https://thrico.community";

  const pages = seoData?.getAllPagesSeo || [];

  const handleEdit = (pageId: string) => {
    const page = pages.find((p) => p.id === pageId);
    if (page) {
      setEditingPageId(pageId);
      form.reset({
        title: page.seo?.title || "",
        description: page.seo?.description || "",
        keywords: page.seo?.keywords || "",
        ogImage: page.seo?.ogImage || "",
        schemaMarkup: page.seo?.schemaMarkup || "",
      });
      setIsModalVisible(true);
    }
  };

  const handleSave = form.handleSubmit(async (values) => {
    if (!editingPageId) return;
    setIsSaving(true);
    try {
      await updatePageSeoMutation({
        variables: {
          pageId: editingPageId,
          ...values,
        },
      });
      updatePageSeo(editingPageId, values);
    } catch (error) {
      console.error("SEO update failed:", error);
      setIsSaving(false);
    }
  });

  const generateSchemaMarkup = () => {
    const currentPage = pages.find((p) => p.id === editingPageId);
    if (!currentPage) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: form.getValues("title") || currentPage.name,
      description: form.getValues("description"),
      url: `${websiteUrl}/${currentPage.slug}`,
    };

    form.setValue("schemaMarkup", JSON.stringify(schema, null, 2));
    toast({
      title: "Schema Generated",
      description: "Standard WebPage entity has been synthesized.",
    });
  };

  const columns: AdminTableColumn<any>[] = [
    {
      key: "page",
      header: "Page",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{row.name}</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
            /{row.slug}
          </span>
        </div>
      ),
    },
    {
      key: "designation",
      header: "Meta Designation",
      cell: (row) => (
        <div className="text-xs font-medium text-foreground line-clamp-1">
          {row.seo?.title || (
            <span className="text-muted-foreground italic">Not set</span>
          )}
        </div>
      ),
    },
    {
      key: "extract",
      header: "Metadata Extract",
      cell: (row) => (
        <div className="text-xs text-muted-foreground line-clamp-1">
          {row.seo?.description || (
            <span className="text-muted-foreground italic">No description</span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Matrix Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleEdit(row.id)}
          className="h-8 px-4 rounded-xl font-bold bg-background gap-2 transition-all active:scale-95"
        >
          <Edit2Icon className="h-3.5 w-3.5" />
          Optimize
        </Button>
      ),
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="SEO Settings"
        description="Manage search engine metadata for your website."
        icon={Globe}
        badgeText="Website Builder"
        breadcrumbs={[
          { label: "Website Builder" },
          { label: "SEO Settings" }
        ]}
        actions={
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                  Crawler Status
                </span>
              </div>
              <span className="text-[9px] font-bold text-emerald-600/80 uppercase tracking-tighter mt-1">
                Indexability: Passed
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchSeo()}
              className="h-10 px-4 rounded-xl bg-background font-bold gap-2 shadow-sm transition-all active:scale-95"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", websiteLoading && "animate-spin")}
              />
              Refetch
            </Button>
          </div>
        }
      />

      <EcosystemContainer>
        <div className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4 border-b">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="h-4 w-4 text-indigo-600" />
                    <CardTitle className="text-xl">
                      Page SEO
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Manage search engine metadata for each page.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <AdminTable
                    columns={columns}
                    data={pages}
                    loading={websiteLoading}
                    keyExtractor={(p) => p.id}
                    emptyIcon={Globe}
                    emptyTitle="No Pages Found"
                    emptyDescription="Manage SEO metadata to optimize discoverability."
                    className="border-0 shadow-none border-t-0 rounded-none bg-transparent"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden bg-muted/20">
                    <div className="p-6">
                      <Globe className="h-8 w-8 mb-4 text-emerald-500 opacity-80" />
                      <h3 className="text-lg font-bold">SEO Overview</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Overview of your pages' SEO status.
                      </p>
                   </div>
                   <div className="p-4 bg-background grid grid-cols-2 gap-4 divide-x border-t">
                      <div className="flex flex-col items-center justify-center py-2">
                        <span className="text-2xl font-bold">{pages.length}</span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Total Pages</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-2 text-indigo-600">
                        <span className="text-2xl font-bold">{pages.filter((p:any) => p.seo?.title).length}</span>
                        <span className="text-[10px] uppercase font-bold mt-1 text-indigo-600/70">Optimized</span>
                      </div>
                   </div>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-border/50">
                  <CardHeader className="pb-3 border-b bg-muted/20">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Info className="h-4 w-4 text-indigo-600" />
                      SEO Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3 text-xs text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          Always set a precise Meta Designation. It dictates your search engine preview title.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          Missing Meta Extracts (descriptions) may result in search engines deriving arbitrary summaries.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          Click "Optimize" to unlock Schema markup and social graph modifications.
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </EcosystemContainer>

      <Dialog open={isModalVisible} onOpenChange={setIsModalVisible}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto rounded-[40px] border-none shadow-2xl p-0 overflow-hidden text-foreground">
          <div className="bg-primary text-primary-foreground p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 scale-150">
              <Globe className="h-40 w-40" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="px-3 py-1 rounded-full bg-card/10 backdrop-blur-md text-white font-black text-[9px] uppercase tracking-widest border border-white/10">
                  SEO Optimization Protocol
                </div>
              </div>
              <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">
                Metadata Architecture
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-bold text-[11px] uppercase tracking-wider mt-1">
                Configure search engine visibility and semantic indices for the
                selected node.
              </DialogDescription>
            </div>
          </div>

          <div className="p-8">
            <Form {...form}>
              <form onSubmit={handleSave} className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="order-2 lg:order-1 space-y-6">
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">
                      Simulation Preview
                    </h3>
                    <SeoPreview
                      title={form.watch("title")}
                      description={form.watch("description")}
                      slug={
                        pages.find((p) => p.id === editingPageId)?.slug || ""
                      }
                      baseUrl={websiteUrl}
                    />
                  </div>

                  <div className="order-1 lg:order-2 space-y-6">
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">
                      Invariant Definitions
                    </h3>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        rules={{ required: "Meta title is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                              Meta Title
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter meta title"
                                className="h-12 rounded-xl border-border bg-muted/30 focus:bg-card focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        rules={{ required: "Meta description is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                              Meta Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Enter meta description"
                                rows={4}
                                className="rounded-xl border-border bg-muted/30 focus:bg-card focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium resize-none shadow-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="keywords"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                              Meta Keywords
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter keywords separated by commas"
                                className="h-12 rounded-xl border-border bg-muted/30 focus:bg-card focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">
                      Schema Markup (JSON-LD)
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateSchemaMarkup}
                      className="h-9 px-4 rounded-xl border-border font-bold text-muted-foreground gap-2 hover:bg-muted/50 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm shadow-slate-200"
                    >
                      <Wand2 className="h-3.5 w-3.5 text-indigo-500" />
                      Auto-Generate Schema
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div>
                      <SchemaPreview
                        schemaMarkup={form.watch("schemaMarkup")}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="schemaMarkup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center block">
                              Schema Code Repository
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder='Click "Auto-Generate" to create schema markup or paste your own...'
                                className="font-mono text-[11px] h-[300px] rounded-xl border-border bg-muted/30 focus:bg-card focus:ring-4 focus:ring-indigo-500/5 transition-all p-4 resize-none shadow-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-6 border-t border-slate-50 gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsModalVisible(false)}
                    disabled={isSaving}
                    className="h-12 px-8 rounded-xl font-bold text-muted-foreground hover:bg-muted/50 transition-all"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="h-12 px-12 rounded-xl bg-primary text-primary-foreground hover:bg-black text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-200 transition-all active:scale-95 group"
                  >
                    <SaveIcon
                      className={cn(
                        "h-4 w-4 mr-2 transition-transform group-hover:scale-110",
                        isSaving && "animate-spin",
                      )}
                    />
                    {isSaving ? "Synchronizing..." : "Execute Deployment"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </EcosystemWrapper>
  );
}
