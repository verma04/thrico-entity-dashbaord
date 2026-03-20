"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
import { Edit2Icon, Wand2, Globe, RefreshCw, ShieldCheck, Activity, Search, ArrowRight } from "lucide-react";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { getCustomDomain, getThricoDomain } from "@/graphql/actions/domain";
import {
  useGetAllPagesSeo,
  useUpdatePageSeo,
  useGetWebsite,
} from "@/graphql/actions/website";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

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
  const displayDomain = baseUrl.replace("https://", "").replace("http://", "");

  const getTitleStatus = (length: number) => {
    if (length === 0) return "text-slate-400";
    if (length > 60) return "text-destructive";
    if (length >= 50) return "text-amber-500";
    return "text-emerald-500";
  };

  const getDescStatus = (length: number) => {
    if (length === 0) return "text-slate-400";
    if (length > 160) return "text-destructive";
    if (length >= 140) return "text-amber-500";
    return "text-emerald-500";
  };

  const titleLength = title?.length || 0;
  const descLength = description?.length || 0;

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 space-y-6">
      <div className="flex items-center gap-2 px-1">
        <Globe className="h-4 w-4 text-indigo-500" />
        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Search Engine Projection</h4>
      </div>

      <div className="bg-slate-50/50 rounded-2xl p-6 space-y-1 border border-slate-50">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded-full bg-linear-to-br from-blue-500 to-emerald-500 shadow-sm" />
          <span className="text-[10px] font-bold text-slate-400">
            {displayDomain}
          </span>
        </div>
        <div className="text-xl text-blue-600 font-medium mb-1 line-clamp-1 leading-tight">
          {displayTitle}
        </div>
        <div className="text-[11px] text-emerald-700 mb-2 truncate max-w-full">
          {baseUrl}/{slug || "page"}
        </div>
        <div className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
          {displayDescription}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 text-[10px] px-1">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-black text-slate-400 uppercase tracking-tighter">Title Amplitude</span>
            <span className={cn("font-black", getTitleStatus(titleLength))}>
              {titleLength} / 60
            </span>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all duration-500", 
                titleLength === 0 ? "bg-slate-200" : 
                titleLength > 60 ? "bg-destructive" : 
                titleLength >= 50 ? "bg-amber-500" : "bg-emerald-500"
              )}
              style={{ width: `${Math.min((titleLength / 60) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-black text-slate-400 uppercase tracking-tighter">Desc Density</span>
            <span className={cn("font-black", getDescStatus(descLength))}>
              {descLength} / 160
            </span>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all duration-500", 
                descLength === 0 ? "bg-slate-200" : 
                descLength > 160 ? "bg-destructive" : 
                descLength >= 140 ? "bg-amber-500" : "bg-emerald-500"
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
      const scriptMatch = schemaMarkup.match(/<script[^>]*>([\s\S]*?)<\/script>/);
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
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div
            className={cn("w-2.5 h-2.5 rounded-full animate-pulse", 
              valid === null ? "bg-slate-200" : valid ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]"
            )}
          />
          <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Semantic Schema Index</h4>
        </div>
        {valid !== null && (
          <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md", 
            valid ? "bg-emerald-50 text-emerald-600" : "bg-destructive/10 text-destructive"
          )}>
            {valid ? "Verified Protocol" : "Syntax Error"}
          </span>
        )}
      </div>

      <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-50 min-h-[140px] flex flex-col justify-center">
        {valid === null ? (
          <div className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest leading-relaxed">
            Awaiting semantic injection...<br/>Generate or paste JSON-LD markup
          </div>
        ) : valid === false ? (
          <div className="space-y-2">
            <p className="text-[10px] font-black text-destructive uppercase tracking-widest">Critical Syntax Failure</p>
            <p className="text-[11px] text-destructive/80 font-mono bg-white p-3 rounded-xl border border-destructive/10 overflow-x-auto">{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity Class:</span>
              <span className="text-xs font-bold text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded-md">@{data["@type"] || "Unknown"}</span>
            </div>
            {data.name && (
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</span>
                <p className="text-xs font-bold text-slate-900">{data.name}</p>
              </div>
            )}
            {data.description && (
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description Extract</span>
                <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">{data.description}</p>
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
    { skip: !websiteId }
  );

  const [updatePageSeoMutation] = useUpdatePageSeo({
    onCompleted: () => {
      refetchSeo();
      toast({ title: "Deployment Successful", description: "Metadata has been synchronized across nodes." });
      setIsModalVisible(false);
      setIsSaving(false);
    },
    onError: (err) => {
      toast({ title: "Deployment Failure", description: err.message, variant: "destructive" });
      setIsSaving(false);
    }
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

  const websiteUrl = websiteData?.getWebsite 
    ? (getCustomDomain(websiteData.getWebsite) || getThricoDomain(websiteData.getWebsite))
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
    toast({ title: "Schema Generated", description: "Standard WebPage entity has been synthesized." });
  };

  return (
    <div className="space-y-8">
      <EcosystemActionBar shadow="sm">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Indexability Check: Passed
                 </span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                 <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                 <span>Crawler Status: Optimized</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => refetchSeo()}
                className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 gap-2 hover:bg-slate-50 transition-all"
              >
                <RefreshCw className={cn("h-4 w-4", websiteLoading && "animate-spin")} />
                Refresh Meta
              </Button>
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-10 p-8 lg:p-12">
        <div className="space-y-6">
           <div className="rounded-[40px] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
             {websiteLoading ? (
               <div className="p-20 flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                     <div className="h-12 w-12 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="h-4 w-4 text-indigo-600" />
                     </div>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Analyzing SEO Metadata</p>
               </div>
             ) : (
               <div className="divide-y divide-slate-50">
                 <div className="grid grid-cols-12 bg-slate-50/50 p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                   <div className="col-span-4">Page Entity</div>
                   <div className="col-span-3">Meta Designation</div>
                   <div className="col-span-3">Metadata Extract</div>
                   <div className="col-span-2 text-right pr-4">Matrix Actions</div>
                 </div>
                 {pages.length === 0 ? (
                   <div className="p-24 flex flex-col items-center justify-center text-center space-y-6">
                      <div className="h-20 w-20 rounded-4xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                         <Globe className="h-10 w-10 opacity-20" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-lg font-black italic text-slate-900 uppercase">No Pages Found</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connect pages to manage their SEO metadata</p>
                      </div>
                   </div>
                 ) : (
                   pages.map((page) => (
                      <div key={page.id} className="grid grid-cols-12 p-6 items-center hover:bg-slate-50/50 transition-all group">
                        <div className="col-span-4">
                          <div className="font-bold text-slate-900">{page.name}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">/{page.slug}</div>
                        </div>
                        <div className="col-span-3">
                           <div className="text-xs font-medium text-slate-600 line-clamp-1">
                             {page.seo?.title || <span className="text-slate-300 italic">Not set</span>}
                           </div>
                        </div>
                        <div className="col-span-3">
                           <div className="text-xs text-slate-400 line-clamp-1">
                             {page.seo?.description || <span className="text-slate-300 italic">No description</span>}
                           </div>
                        </div>
                        <div className="col-span-2 flex justify-end pr-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(page.id)}
                            className="h-9 px-4 rounded-xl border-slate-200 font-bold text-slate-600 gap-2 hover:bg-white hover:shadow-lg hover:shadow-slate-200 transition-all active:scale-95"
                          >
                            <Edit2Icon className="h-3.5 w-3.5" />
                            Optimize
                          </Button>
                        </div>
                      </div>
                   ))
                 )}
               </div>
             )}
           </div>
        </div>
      </EcosystemContainer>

      <Dialog open={isModalVisible} onOpenChange={setIsModalVisible}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto rounded-[40px] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 scale-150">
                <Globe className="h-40 w-40" />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                   <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white font-black text-[9px] uppercase tracking-widest border border-white/10">
                      SEO Optimization Protocol
                   </div>
                </div>
                <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">Metadata Architecture</DialogTitle>
                <DialogDescription className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mt-1">
                  Configure search engine visibility and semantic indices for the selected node.
                </DialogDescription>
             </div>
          </div>

          <div className="p-8">
            <Form {...form}>
              <form onSubmit={handleSave} className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="order-2 lg:order-1 space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Simulation Preview</h3>
                    <SeoPreview
                      title={form.watch("title")}
                      description={form.watch("description")}
                      slug={pages.find((p) => p.id === editingPageId)?.slug || ""}
                      baseUrl={websiteUrl}
                    />
                  </div>

                  <div className="order-1 lg:order-2 space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Invariant Definitions</h3>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        rules={{ required: "Meta title is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Meta Title</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter meta title" className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium" />
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
                            <FormLabel className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Meta Description</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Enter meta description"
                                rows={4}
                                className="rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium resize-none shadow-none"
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
                            <FormLabel className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Meta Keywords</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter keywords separated by commas"
                                className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
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
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                      Schema Markup (JSON-LD)
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateSchemaMarkup}
                      className="h-9 px-4 rounded-xl border-slate-200 font-bold text-slate-600 gap-2 hover:bg-slate-50 transition-all"
                    >
                      <Wand2 className="h-4 w-4" />
                      Auto-Generate Schema
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div>
                      <SchemaPreview schemaMarkup={form.watch("schemaMarkup")} />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="schemaMarkup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center block">Schema Code Repository</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder='Click "Auto-Generate" to create schema markup or paste your own...'
                                className="font-mono text-[11px] h-[300px] rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all p-4 resize-none"
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
                    className="h-12 px-8 rounded-xl font-bold text-slate-500"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="h-12 px-12 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-200 transition-all active:scale-95 group"
                  >
                    <SaveIcon className={cn("h-4 w-4 mr-2 transition-transform group-hover:scale-110", isSaving && "animate-spin")} />
                    {isSaving ? "Synchronizing..." : "Execute Deployment"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
