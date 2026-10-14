"use client";

import React from "react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { toast } from "sonner";
import {
  Pencil,
  Loader2,
  Video,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Moment, useAdminEditMoment } from "@/graphql/actions/moments";
import { useModuleStore } from "@/store/useModuleStore";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import { cn } from "@/lib/utils";

export interface ChangeThumbnailDialogProps {
  moment: Moment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (updatedMoment: Moment) => void;
}

interface FormValues {
  caption: string;
  thumbnailUrl: string;
}

const validationSchema = Yup.object().shape({
  caption: Yup.string()
    .trim()
    .required("Story caption is required")
    .max(500, "Caption cannot exceed 500 characters"),
  thumbnailUrl: Yup.string().trim().optional(),
});

export function ChangeThumbnailDialog({
  moment,
  open,
  onOpenChange,
  onSuccess,
}: ChangeThumbnailDialogProps) {
  const singularName = useModuleStore((state) => state.momentSingularName);
  const { editMoment, loading } = useAdminEditMoment();

  const formik = useFormik<FormValues>({
    initialValues: {
      caption: moment?.caption || "",
      thumbnailUrl: moment?.thumbnailUrl || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      if (!moment) return;
      try {
        const { data } = await editMoment({
          variables: {
            id: moment.id,
            input: {
              caption: values.caption.trim(),
              thumbnailUrl: values.thumbnailUrl.trim() || undefined,
            },
          },
        });

        if (data?.adminEditMoment) {
          toast.success(`${singularName} updated successfully`);
          onSuccess?.(data.adminEditMoment);
          onOpenChange(false);
        } else {
          toast.error(`Failed to update ${singularName.toLowerCase()}`);
        }
      } catch (err: unknown) {
        toast.error((err as Error).message || "An error occurred while updating");
      }
    },
  });

  const currentPreviewUrl = formik.values.thumbnailUrl
    ? getPreferredMediaUrl(formik.values.thumbnailUrl)
    : "";

  const isDirtyThumbnail =
    Boolean(formik.values.thumbnailUrl) &&
    formik.values.thumbnailUrl !== (moment?.thumbnailUrl || "");

  const isDirtyCaption = formik.values.caption !== (moment?.caption || "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[580px] p-0 overflow-hidden bg-background border-border/80 shadow-2xl rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="p-5 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Pencil className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-foreground">
                Edit {singularName}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-snug">
                Update story caption and custom 9:16 portrait cover frame.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Card 1: Caption */}
              <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-2xs">
                      1
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                      Story Caption
                    </h3>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {formik.values.caption.length}/500
                  </span>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="caption" className="text-xs font-semibold text-foreground">
                    Caption
                  </Label>
                  <Textarea
                    id="caption"
                    name="caption"
                    rows={3}
                    maxLength={500}
                    placeholder={`Write a catchy caption for your ${singularName.toLowerCase()}...`}
                    value={formik.values.caption}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "text-xs resize-none bg-background border-border/80 min-h-[72px]",
                      formik.touched.caption &&
                        formik.errors.caption &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                  />
                  {formik.touched.caption && formik.errors.caption ? (
                    <p className="text-[11px] text-destructive font-medium mt-1">
                      {formik.errors.caption}
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Displayed beneath the video player and in feed cards across your community.
                    </p>
                  )}
                </div>
              </div>

              {/* Card 2: Cover Thumbnail Upload & Preview */}
              <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-2xs">
                      2
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                      Cover Thumbnail (9:16 Portrait)
                    </h3>
                  </div>
                  {isDirtyThumbnail && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <Sparkles className="h-2.5 w-2.5" />
                      New Cover Staged
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start pt-1">
                  {/* Visual 9:16 Live Preview Frame */}
                  <div className="relative aspect-9/16 w-28 sm:w-32 rounded-xl overflow-hidden bg-zinc-950 border border-border/70 shrink-0 shadow-sm flex flex-col items-center justify-center group mx-auto sm:mx-0">
                    {currentPreviewUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={currentPreviewUrl}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                        <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-semibold text-white border border-white/10 shadow-2xs">
                          9:16
                        </span>
                        {isDirtyThumbnail && (
                          <span className="absolute bottom-1.5 inset-x-1.5 text-center px-1 py-0.5 rounded bg-emerald-600/90 backdrop-blur-xs text-[8.5px] font-bold text-white shadow-2xs">
                            Staged
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 p-2 text-center text-muted-foreground/60">
                        <Video className="h-6 w-6" />
                        <span className="text-[9px] font-bold uppercase tracking-widest leading-none">
                          No Cover
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Crop & Upload Actions */}
                  <div className="flex-1 space-y-2.5 w-full">
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Custom static covers appear in feeds, stories, and notifications. Standard vertical format (720×1280 or 1080×1920) is recommended.
                    </p>

                    <div className="pt-1">
                      <ImageUploadWithCrop
                        label=""
                        currentImage={formik.values.thumbnailUrl}
                        aspectRatio={9 / 16}
                        recommendedWidth={720}
                        recommendedHeight={1280}
                        maxFileSize={10}
                        uploadButtonText="Upload Cover"
                        changeButtonText="Crop / Replace"
                        removeButtonText="Remove Cover"
                        showDimensions={false}
                        onImageUpdate={(cdnUrl) => {
                          formik.setFieldValue("thumbnailUrl", cdnUrl);
                          formik.setFieldTouched("thumbnailUrl", true, false);
                        }}
                      />
                    </div>

                    {formik.touched.thumbnailUrl && formik.errors.thumbnailUrl && (
                      <p className="text-[11px] text-destructive font-medium mt-1">
                        {formik.errors.thumbnailUrl}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-4 border-t border-border/60 bg-muted/10 flex sm:flex-row gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={loading || formik.isSubmitting}
                className="text-xs h-9 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={
                  loading ||
                  formik.isSubmitting ||
                  (!isDirtyCaption && !isDirtyThumbnail) ||
                  !formik.isValid
                }
                className="bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-xs h-9 font-medium cursor-pointer"
              >
                {loading || formik.isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Saving…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </FormikProvider>
      </DialogContent>
    </Dialog>
  );
}

export const EditMomentDialog = ChangeThumbnailDialog;
export default ChangeThumbnailDialog;
