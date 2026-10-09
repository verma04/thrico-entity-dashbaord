"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Link2,
  Globe,
  ExternalLink,
  Loader2,
  X,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  useGetMediaGalleryAlbums,
  useAddMediaGalleryLink,
} from "@/graphql/actions/mediaGallery";
import { fetchLinkPreview } from "@/app/actions/link-preview";
import { cn } from "@/lib/utils";

interface GalleryAlbum {
  id: string;
  title?: string | null;
  [key: string]: unknown;
}

interface LinkPreviewData {
  url?: string;
  title?: string;
  description?: string;
  images?: string[];
  favicons?: string[];
  mediaType?: string;
  contentType?: string;
  siteName?: string;
  [key: string]: unknown;
}

interface LinkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAlbumId?: string;
  onUploaded: () => void;
}

const linkValidationSchema = Yup.object().shape({
  url: Yup.string()
    .trim()
    .required("Please enter a link URL")
    .test("is-valid-url", "Please enter a valid HTTP or HTTPS URL", (val) => {
      if (!val) return false;
      try {
        const parsed = new URL(val);
        return ["http:", "https:"].includes(parsed.protocol);
      } catch {
        return false;
      }
    }),
  caption: Yup.string().max(500, "Caption cannot exceed 500 characters"),
  albumIds: Yup.array()
    .of(Yup.string().required())
    .min(1, "Select at least one destination gallery"),
});

export function LinkUploadDialog({
  open,
  onOpenChange,
  currentAlbumId,
  onUploaded,
}: LinkUploadDialogProps) {
  const { data: albumsData } = useGetMediaGalleryAlbums();
  const allAlbums: GalleryAlbum[] = useMemo(
    () => albumsData?.getMediaGalleryAlbums || [],
    [albumsData],
  );

  const [previewData, setPreviewData] = useState<LinkPreviewData | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const primaryAlbumId = currentAlbumId || allAlbums[0]?.id || "";
  const [addLink] = useAddMediaGalleryLink(primaryAlbumId);

  const formik = useFormik({
    initialValues: {
      url: "",
      caption: "",
      albumIds: currentAlbumId ? [currentAlbumId] : [],
    },
    validationSchema: linkValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const targetAlbumIds =
          values.albumIds.length > 0 ? values.albumIds : [primaryAlbumId];

        const targetThumbnail =
          previewData?.images && previewData.images.length > 0
            ? previewData.images[0]
            : null;

        const effectiveCaption =
          values.caption?.trim() || previewData?.title || null;

        await addLink({
          variables: {
            input: {
              albumId: targetAlbumIds[0],
              albumIds: targetAlbumIds,
              url: values.url.trim(),
              caption: effectiveCaption,
              type: "LINK",
              thumbnailUrl: targetThumbnail,
              metadata: previewData ? JSON.stringify(previewData) : null,
            },
          },
        });

        toast.success(
          `Successfully added link to ${targetAlbumIds.length} ${
            targetAlbumIds.length === 1 ? "gallery" : "galleries"
          }!`,
        );
        resetForm();
        setPreviewData(null);
        setPreviewError(null);
        onUploaded();
        onOpenChange(false);
      } catch (err: unknown) {
        toast.error((err as Error)?.message || "Failed to add link to gallery");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Ensure currentAlbumId is selected whenever dialog opens
  useEffect(() => {
    if (open) {
      if (currentAlbumId) {
        formik.setFieldValue("albumIds", [currentAlbumId]);
      } else if (allAlbums.length > 0) {
        formik.setFieldValue("albumIds", [allAlbums[0].id]);
      }
    } else {
      setPreviewData(null);
      setPreviewError(null);
      setIsPreviewLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentAlbumId, allAlbums]);

  // Debounced live unfurl
  const handleFetchPreview = useCallback(async (rawUrl: string) => {
    if (!rawUrl || !rawUrl.trim()) {
      setPreviewData(null);
      setPreviewError(null);
      return;
    }

    try {
      const parsed = new URL(rawUrl.trim());
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return;
      }
    } catch {
      return;
    }

    setIsPreviewLoading(true);
    setPreviewError(null);

    try {
      const data = await fetchLinkPreview(rawUrl.trim());
      if (data && (data as LinkPreviewData).title) {
        setPreviewData(data as LinkPreviewData);
      } else {
        setPreviewData(null);
        setPreviewError("No OpenGraph metadata found for this URL.");
      }
    } catch (err: unknown) {
      setPreviewData(null);
      setPreviewError(
        (err as Error)?.message || "Could not fetch preview for this link.",
      );
    } finally {
      setIsPreviewLoading(false);
    }
  }, []);

  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    formik.handleBlur(e);
    handleFetchPreview(formik.values.url);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    const val = e.target.value;
    if (val.startsWith("http://") || val.startsWith("https://")) {
      const timeoutId = setTimeout(() => {
        handleFetchPreview(val);
      }, 700);
      return () => clearTimeout(timeoutId);
    }
  };

  const toggleAlbum = (id: string) => {
    const current = formik.values.albumIds;
    if (id === currentAlbumId) return; // Keep current album selected
    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    formik.setFieldValue("albumIds", next);
  };

  const domain = useMemo(() => {
    try {
      return new URL(formik.values.url).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  }, [formik.values.url]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 shadow-2xl rounded-xl bg-white dark:bg-zinc-900">
        {/* Header (Pattern C: Modal Dialog) */}
        <div className="p-5 border-b border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <Link2 className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-xs font-bold text-[#303030] dark:text-zinc-100">
                Add Link to Media Gallery
              </DialogTitle>
              <DialogDescription className="text-[11px] text-[#616161] dark:text-zinc-400">
                Paste any web page or article URL to generate a rich OpenGraph preview
              </DialogDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            disabled={formik.isSubmitting}
            className="h-7 w-7 rounded-md hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {/* Scrollable Modal Body */}
          <div className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
            {/* Step 1: Link Destination */}
            <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
                  1
                </span>
                <span className="text-xs font-bold uppercase tracking-wide text-foreground">
                  Target URL & Source
                </span>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="link-url-input"
                  className="text-xs font-semibold text-foreground flex items-center justify-between"
                >
                  <span>Website / Page URL</span>
                  {isPreviewLoading && (
                    <span className="flex items-center gap-1 text-[10.5px] text-indigo-600 dark:text-indigo-400 font-normal">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Unfurling metadata...
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    id="link-url-input"
                    name="url"
                    type="url"
                    placeholder="https://example.com/article-or-post"
                    value={formik.values.url}
                    onChange={handleUrlChange}
                    onBlur={handleUrlBlur}
                    className={cn(
                      "h-9 text-xs pl-8 font-mono",
                      formik.touched.url &&
                        formik.errors.url &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                  />
                  <Globe className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                {formik.touched.url && formik.errors.url ? (
                  <p className="text-[11px] text-destructive font-medium mt-1">
                    {formik.errors.url}
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Paste YouTube links, blog posts, news stories, portfolio links, or external resources.
                  </p>
                )}
              </div>
            </div>

            {/* Step 2: Live Meta Properties Preview */}
            <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
                    2
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wide text-foreground">
                    Live Meta Preview
                  </span>
                </div>
                {previewData && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/30 gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    OpenGraph Detected
                  </Badge>
                )}
              </div>

              {isPreviewLoading ? (
                <div className="rounded-lg border border-dashed border-border/70 p-6 flex flex-col items-center justify-center text-center gap-2 bg-muted/20">
                  <Loader2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
                  <p className="text-xs font-medium text-foreground">
                    Fetching meta properties & preview...
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Extracting og:title, og:image, description and favicon
                  </p>
                </div>
              ) : previewData ? (
                <div className="rounded-lg border border-border/80 overflow-hidden bg-background shadow-2xs">
                  <div className="flex flex-col sm:flex-row items-stretch">
                    {previewData.images && previewData.images.length > 0 && (
                      <div className="sm:w-36 h-28 sm:h-auto flex-shrink-0 bg-muted relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewData.images[0]}
                          alt={previewData.title || "Link preview"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-3 flex flex-col justify-center flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground font-medium mb-1 truncate">
                        {previewData.favicons &&
                        previewData.favicons.length > 0 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={previewData.favicons[0]}
                            alt=""
                            className="w-3.5 h-3.5 rounded-xs shrink-0"
                          />
                        ) : (
                          <Globe className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
                        )}
                        <span className="truncate">{domain}</span>
                        <a
                          href={formik.values.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto text-muted-foreground/60 hover:text-primary transition-colors"
                          title="Open link in new tab"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <h4 className="font-semibold text-xs line-clamp-1 mb-1 text-foreground">
                        {previewData.title}
                      </h4>

                      {previewData.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {previewData.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : previewError ? (
                <div className="rounded-lg border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-3 flex items-start gap-2 text-amber-700 dark:text-amber-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-snug">
                    <p className="font-semibold">Metadata could not be scraped</p>
                    <p className="text-muted-foreground mt-0.5">
                      The link will still be saved with standard fallback presentation.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border/60 p-5 flex flex-col items-center justify-center text-center gap-1.5 bg-muted/10">
                  <Sparkles className="w-5 h-5 text-muted-foreground/50" />
                  <p className="text-xs font-medium text-foreground">
                    No URL entered yet
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Enter a link above to generate a preview card automatically.
                  </p>
                </div>
              )}
            </div>

            {/* Step 3: Caption / Custom Title */}
            <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
                  3
                </span>
                <span className="text-xs font-bold uppercase tracking-wide text-foreground">
                  Custom Caption / Title (Optional)
                </span>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="link-caption-input"
                  className="text-xs font-semibold text-foreground"
                >
                  Display Caption
                </Label>
                <Textarea
                  id="link-caption-input"
                  name="caption"
                  rows={2}
                  placeholder={
                    previewData?.title
                      ? `Defaults to: "${previewData.title}"`
                      : "Add custom context, notes, or author credits for this link..."
                  }
                  value={formik.values.caption}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="text-xs resize-none"
                />
                <p className="text-[11px] text-muted-foreground leading-snug">
                  If left empty, the scraped page title will be displayed automatically.
                </p>
              </div>
            </div>

            {/* Step 4: Multi-Gallery Distribution */}
            {allAlbums.length > 1 && (
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.03] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
                      4
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-foreground flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      Destination Galleries ({formik.values.albumIds.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        formik.setFieldValue(
                          "albumIds",
                          formik.values.albumIds.length === allAlbums.length
                            ? currentAlbumId
                              ? [currentAlbumId]
                              : []
                            : allAlbums.map((a) => a.id),
                        )
                      }
                      className="text-[10.5px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      {formik.values.albumIds.length === allAlbums.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-32 overflow-y-auto p-1">
                  {allAlbums.map((alb) => {
                    const isSelected = formik.values.albumIds.includes(alb.id);
                    const isCurrent = alb.id === currentAlbumId;

                    return (
                      <button
                        type="button"
                        key={alb.id}
                        onClick={() => toggleAlbum(alb.id)}
                        disabled={isCurrent}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-all border",
                          isSelected
                            ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100 font-medium"
                            : "bg-background border-border/70 text-muted-foreground hover:border-border hover:text-foreground",
                          isCurrent && "cursor-default opacity-90",
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors",
                            isSelected
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "border-muted-foreground/40",
                          )}
                        >
                          {isSelected && (
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="truncate flex-1 text-[11px]">
                          {alb.title || "Untitled Gallery"}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-1 py-0.2 rounded-xs">
                            Current
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {formik.touched.albumIds && formik.errors.albumIds && (
                  <p className="text-[11px] text-destructive font-medium">
                    {formik.errors.albumIds as string}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sticky Modal Footer (Pattern C: Modal Dialog) */}
          <div className="p-3.5 border-t border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={formik.isSubmitting}
              className="h-9 text-xs border-[#d2d5d9] dark:border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={formik.isSubmitting || !formik.values.url}
              className="bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-xs h-9 font-medium cursor-pointer"
            >
              {formik.isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Adding Link...
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5 mr-1.5" />
                  Add Link to Gallery
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
