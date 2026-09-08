"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { Search, SaveIcon, Sparkles, Globe } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  PolarisCard,
  PolarisInput,
  PolarisTextarea,
} from "@/components/ui/platform/polaris-primitives";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { SeoPreview } from "./seo-preview";
import { SchemaPreview } from "./schema-preview";
import { SeoFormValues } from "./seo-types";

interface SeoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  page: any | null;
  websiteUrl: string;
  onSave: (values: SeoFormValues) => void | Promise<void>;
  isSaving: boolean;
}

export function SeoDrawer({
  isOpen,
  onClose,
  page,
  websiteUrl,
  onSave,
  isSaving,
}: SeoDrawerProps) {
  const form = useForm<SeoFormValues>({
    defaultValues: {
      title: "",
      description: "",
      keywords: "",
      ogImage: "",
      schemaMarkup: "",
    },
  });

  useEffect(() => {
    if (page && isOpen) {
      form.reset({
        title: page.seo?.title || page.name || "",
        description: page.seo?.description || "",
        keywords: Array.isArray(page.seo?.keywords)
          ? page.seo.keywords.join(", ")
          : page.seo?.keywords || "",
        ogImage: page.seo?.ogImage || "",
        schemaMarkup: page.seo?.schemaMarkup || "",
      });
    }
  }, [page, isOpen, form]);

  const generateSchemaMarkup = () => {
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

    form.setValue("schemaMarkup", JSON.stringify(schema, null, 2), {
      shouldDirty: true,
    });
    toast.success("JSON-LD WebPage schema generated");
  };

  const handleSubmit = form.handleSubmit((values) => {
    onSave(values);
  });

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-[740px] p-0 flex flex-col h-full bg-[#f6f6f7] dark:bg-zinc-950 border-l border-[#d2d5d9] dark:border-zinc-800 shadow-2xl z-[150] overflow-hidden"
      >
        {/* Drawer Top Header */}
        <div className="border-b border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4 shrink-0 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-[8px] bg-zinc-100 dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 flex items-center justify-center shrink-0 shadow-2xs">
              <Search className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-[15px] font-semibold text-[#303030] dark:text-zinc-100 tracking-tight leading-tight">
                  Page SEO & Social Metadata
                </SheetTitle>
                <Badge
                  variant="outline"
                  className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 text-[10px] font-mono font-medium px-2 py-0 shrink-0"
                >
                  /{page?.slug || "page"}
                </Badge>
              </div>
              <SheetDescription className="text-[12px] text-[#616161] dark:text-zinc-400 mt-0.5 truncate">
                Configure search title tags, OpenGraph previews, and structured JSON-LD data.
              </SheetDescription>
            </div>
          </div>
        </div>

        {/* Drawer Body - Scrollable Polaris Form Canvas */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Card 1: Google SERP Projection (Live Preview) */}
          <PolarisCard
            title="Live Search Engine Preview"
            badge={
              <Badge
                variant="outline"
                className="text-[10px] bg-[#f6f6f7] dark:bg-zinc-800 border-[#d2d5d9] dark:border-zinc-700 text-[#616161] dark:text-zinc-300"
              >
                Google SERP
              </Badge>
            }
            description="Real-time projection of how this page snippet appears in search engine results."
          >
            <SeoPreview
              title={form.watch("title")}
              description={form.watch("description")}
              slug={page?.slug || ""}
              baseUrl={websiteUrl}
            />
          </PolarisCard>

          {/* Card 2: Page Metadata Form */}
          <PolarisCard
            title="Page Search Metadata"
            description="Essential meta tags indexed by search bots and web crawlers."
          >
            <div className="space-y-3.5">
              <PolarisInput
                id="seo-title"
                label="Meta Title Tag"
                required
                placeholder="e.g. Acme Community - Exclusive Builder Network"
                value={form.watch("title")}
                onChange={(e) =>
                  form.setValue("title", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                error={form.formState.errors.title?.message}
                helperText={
                  <span className="flex items-center justify-between">
                    <span>Keep between 45–60 characters for optimal visibility.</span>
                    <span
                      className={cn(
                        "font-mono font-medium text-[11px]",
                        (form.watch("title")?.length || 0) > 60
                          ? "text-[#d72c0d] dark:text-rose-400"
                          : "text-[#616161] dark:text-zinc-400",
                      )}
                    >
                      {form.watch("title")?.length || 0}/60
                    </span>
                  </span>
                }
              />

              <PolarisTextarea
                id="seo-description"
                label="Meta Description Tag"
                required
                rows={3}
                placeholder="Enter a concise 1-2 sentence description summarizing this page for search engine users..."
                value={form.watch("description")}
                onChange={(e) =>
                  form.setValue("description", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                error={form.formState.errors.description?.message}
                helperText={
                  <span className="flex items-center justify-between">
                    <span>Keep between 120–160 characters for best display.</span>
                    <span
                      className={cn(
                        "font-mono font-medium text-[11px]",
                        (form.watch("description")?.length || 0) > 160
                          ? "text-[#d72c0d] dark:text-rose-400"
                          : "text-[#616161] dark:text-zinc-400",
                      )}
                    >
                      {form.watch("description")?.length || 0}/160
                    </span>
                  </span>
                }
              />

              <PolarisInput
                id="seo-keywords"
                label="Meta Keywords"
                placeholder="community, creators, ecommerce, loyalty"
                value={form.watch("keywords")}
                onChange={(e) =>
                  form.setValue("keywords", e.target.value, {
                    shouldDirty: true,
                  })
                }
                helperText="Comma-separated terms and keywords relevant to this page content."
              />
            </div>
          </PolarisCard>

          {/* Card 3: Social Media & OpenGraph Card */}
          <PolarisCard
            title="Social Media Card (OpenGraph)"
            description="Thumbnail image and preview displayed when this page link is shared across social media and chat apps."
          >
            <div className="space-y-3.5">
              <div className="p-3 rounded-[8px] bg-[#f6f6f7]/70 dark:bg-zinc-800/40 border border-[#d2d5d9] dark:border-zinc-700">
                <ImageUploadWithCrop
                  currentImage={form.watch("ogImage") || ""}
                  onImageUpdate={(url) =>
                    form.setValue("ogImage", url, { shouldDirty: true })
                  }
                  label="Social Share Image (OG Image)"
                  aspectRatio={1200 / 630}
                  recommendedWidth={1200}
                  recommendedHeight={630}
                  uploadButtonText={
                    form.watch("ogImage")
                      ? "Change social photo"
                      : "Upload social image (1200x630)"
                  }
                />
              </div>

              <PolarisInput
                id="seo-og-image"
                label="Or Enter Direct Image URL"
                prefix={<Globe className="h-4 w-4" />}
                placeholder="https://images.unsplash.com/..."
                value={form.watch("ogImage")}
                onChange={(e) =>
                  form.setValue("ogImage", e.target.value, {
                    shouldDirty: true,
                  })
                }
                helperText="Direct image URL for OpenGraph social cards (must begin with https://)."
              />
            </div>
          </PolarisCard>

          {/* Card 4: Structured Data (JSON-LD) Card */}
          <PolarisCard
            title="Structured Data (JSON-LD)"
            description="Semantic Schema.org annotations for Google Rich Snippets."
            headerAction={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateSchemaMarkup}
                className="h-7 px-2.5 rounded-[6px] text-xs font-semibold border-[#d2d5d9] dark:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 gap-1.5 shadow-2xs"
              >
                <Sparkles className="h-3 w-3 text-amber-500" />
                Auto-Generate
              </Button>
            }
          >
            <div className="space-y-3">
              <SchemaPreview schemaMarkup={form.watch("schemaMarkup")} />

              <PolarisTextarea
                id="seo-schema"
                label="JSON-LD Markup"
                rows={5}
                className="font-mono text-[11.5px] leading-relaxed"
                placeholder='{"@context": "https://schema.org", "@type": "WebPage", ...}'
                value={form.watch("schemaMarkup")}
                onChange={(e) =>
                  form.setValue("schemaMarkup", e.target.value, {
                    shouldDirty: true,
                  })
                }
                helperText="Must be valid JSON containing Schema.org structured annotations."
              />
            </div>
          </PolarisCard>
        </form>

        {/* Drawer Sticky Bottom Footer */}
        <div className="border-t border-[#d2d5d9] dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-6 py-3.5 shrink-0 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="h-8 px-3.5 rounded-[6px] text-xs font-medium border-[#d2d5d9] dark:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="h-8 px-4 rounded-[6px] bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold text-xs shadow-xs gap-1.5"
          >
            <SaveIcon
              className={cn(
                "h-3.5 w-3.5",
                isSaving && "animate-spin",
              )}
            />
            {isSaving ? "Saving..." : "Save Metadata"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
