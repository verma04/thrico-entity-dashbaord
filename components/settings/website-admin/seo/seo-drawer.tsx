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
import { useFormik } from "formik";
import * as Yup from "yup";
import { Search, SaveIcon, Sparkles, Globe, X } from "lucide-react";
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
import { OgCardPreview } from "./og-card-preview";
import { SeoFormValues } from "./seo-types";

export interface SeoPageData {
  id: string;
  name: string;
  slug: string;
  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string[] | string | null;
    ogImage?: string | null;
    schemaMarkup?: unknown;
  } | null;
}

interface SeoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  page: SeoPageData | null;
  websiteUrl: string;
  onSave: (values: SeoFormValues) => void | Promise<void>;
  isSaving: boolean;
}

const seoValidationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required("Meta title is required")
    .max(70, "Meta title should stay under 70 characters"),
  description: Yup.string()
    .trim()
    .max(160, "Meta description should stay under 160 characters"),
  keywords: Yup.string().trim(),
  ogImage: Yup.string().trim(),
  schemaMarkup: Yup.string().trim(),
});

export function SeoDrawer({
  isOpen,
  onClose,
  page,
  websiteUrl,
  onSave,
  isSaving,
}: SeoDrawerProps) {
  const formik = useFormik<SeoFormValues>({
    initialValues: {
      title: page?.seo?.title || page?.name || "",
      description: page?.seo?.description || "",
      keywords: Array.isArray(page?.seo?.keywords)
        ? page?.seo?.keywords.join(", ")
        : (page?.seo?.keywords as string) || "",
      ogImage: page?.seo?.ogImage || "",
      schemaMarkup:
        typeof page?.seo?.schemaMarkup === "object" &&
        page?.seo?.schemaMarkup !== null
          ? JSON.stringify(page.seo.schemaMarkup, null, 2)
          : (page?.seo?.schemaMarkup as string) || "",
    },
    validationSchema: seoValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSave(values);
    },
  });

  const generateSchemaMarkup = () => {
    const title = formik.values.title || page?.name || "Page";
    const description = formik.values.description || "";
    const slug = page?.slug || "";

    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description: description,
      url: `${websiteUrl}/${slug}`,
    };

    formik.setFieldValue("schemaMarkup", JSON.stringify(schema, null, 2));
    toast.success("JSON-LD WebPage schema generated");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-[740px] p-0 flex flex-col h-full bg-[#f6f6f7] dark:bg-zinc-950 border-l border-[#d2d5d9] dark:border-zinc-800 shadow-2xl z-[150] overflow-hidden"
      >
        {/* 1. Sticky Drawer Top Header */}
        <div className="border-b border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4 shrink-0 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0 shadow-2xs">
              <Search className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-xs font-bold text-[#303030] dark:text-zinc-100 tracking-tight leading-tight">
                  Page SEO & Social Metadata
                </SheetTitle>
                <Badge
                  variant="outline"
                  className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 text-[10px] font-mono font-medium px-1.5 py-0 shrink-0"
                >
                  /{page?.slug || "page"}
                </Badge>
              </div>
              <SheetDescription className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5 truncate">
                Configure search title tags, OpenGraph previews, and structured JSON-LD data
              </SheetDescription>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 rounded-md hover:bg-muted shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 2. Scrollable Body - Polaris Form Canvas */}
        <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
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
              title={formik.values.title}
              description={formik.values.description}
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
                name="title"
                label="Meta Title Tag"
                required
                placeholder="e.g. Acme Community - Exclusive Builder Network"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.title && formik.errors.title
                    ? formik.errors.title
                    : undefined
                }
                helperText={
                  <span className="flex items-center justify-between">
                    <span>Keep between 45–60 characters for optimal visibility.</span>
                    <span
                      className={cn(
                        "font-mono font-medium text-[11px]",
                        (formik.values.title?.length || 0) > 60
                          ? "text-destructive font-semibold"
                          : "text-[#616161] dark:text-zinc-400",
                      )}
                    >
                      {formik.values.title?.length || 0}/60
                    </span>
                  </span>
                }
              />

              <PolarisTextarea
                id="seo-description"
                name="description"
                label="Meta Description Tag"
                required
                rows={3}
                placeholder="Enter a concise 1-2 sentence description summarizing this page for search engine users..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description && formik.errors.description
                    ? formik.errors.description
                    : undefined
                }
                helperText={
                  <span className="flex items-center justify-between">
                    <span>Keep between 120–160 characters for best display.</span>
                    <span
                      className={cn(
                        "font-mono font-medium text-[11px]",
                        (formik.values.description?.length || 0) > 160
                          ? "text-destructive font-semibold"
                          : "text-[#616161] dark:text-zinc-400",
                      )}
                    >
                      {formik.values.description?.length || 0}/160
                    </span>
                  </span>
                }
              />

              <PolarisInput
                id="seo-keywords"
                name="keywords"
                label="Meta Keywords"
                placeholder="community, creators, ecommerce, loyalty"
                value={formik.values.keywords}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                helperText="Comma-separated terms and keywords relevant to this page content."
              />
            </div>
          </PolarisCard>

          {/* Card 3: Social Media & OpenGraph Card */}
          <PolarisCard
            title="Social Media Card (OpenGraph)"
            description="Thumbnail image and preview displayed when this page link is shared across social media and chat apps."
          >
            <div className="space-y-4">
              {/* Live OpenGraph Social Preview */}
              <OgCardPreview
                title={formik.values.title}
                description={formik.values.description}
                ogImage={formik.values.ogImage}
                slug={page?.slug}
                websiteUrl={websiteUrl}
              />

              <div className="p-3 rounded-[8px] bg-[#f6f6f7]/70 dark:bg-zinc-800/40 border border-[#d2d5d9] dark:border-zinc-700">
                <ImageUploadWithCrop
                  currentImage={formik.values.ogImage || ""}
                  onImageUpdate={(url) =>
                    formik.setFieldValue("ogImage", url || "")
                  }
                  label="Social Share Image (OG Image)"
                  aspectRatio={1200 / 630}
                  recommendedWidth={1200}
                  recommendedHeight={630}
                  allowFreeDimensions={true}
                  uploadButtonText={
                    formik.values.ogImage
                      ? "Change social photo"
                      : "Upload social image (1200x630)"
                  }
                />
              </div>

              <PolarisInput
                id="seo-og-image"
                name="ogImage"
                label="Or Enter Direct Image URL"
                prefix={<Globe className="h-4 w-4" />}
                placeholder="https://images.unsplash.com/..."
                value={formik.values.ogImage || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
              <SchemaPreview schemaMarkup={formik.values.schemaMarkup} />

              <PolarisTextarea
                id="seo-schema"
                name="schemaMarkup"
                label="JSON-LD Markup"
                rows={5}
                className="font-mono text-[11.5px] leading-relaxed"
                placeholder='{"@context": "https://schema.org", "@type": "WebPage", ...}'
                value={formik.values.schemaMarkup}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                helperText="Must be valid JSON containing Schema.org structured annotations."
              />
            </div>
          </PolarisCard>
        </form>

        {/* 3. Sticky Drawer Bottom Footer */}
        <div className="border-t border-[#d2d5d9] dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-6 py-3.5 shrink-0 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving || formik.isSubmitting}
            className="h-8.5 px-3.5 rounded-[6px] text-xs font-medium border-[#d2d5d9] dark:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={() => formik.handleSubmit()}
            disabled={isSaving || formik.isSubmitting}
            className="h-8.5 px-4 rounded-[6px] bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white font-medium text-xs shadow-2xs gap-1.5 cursor-pointer"
          >
            <SaveIcon
              className={cn(
                "h-3.5 w-3.5",
                (isSaving || formik.isSubmitting) && "animate-spin",
              )}
            />
            {isSaving || formik.isSubmitting ? "Saving..." : "Save Metadata"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
