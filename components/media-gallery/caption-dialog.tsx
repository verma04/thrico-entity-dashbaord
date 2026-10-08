"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MessageSquareText, Loader2, X } from "lucide-react";
import { useUpdateMediaGalleryImage } from "@/graphql/actions/mediaGallery";
import { cn } from "@/lib/utils";

export interface CaptionDialogImage {
  id: string;
  caption?: string | null;
  [key: string]: unknown;
}

interface CaptionDialogProps {
  open: boolean;
  image: CaptionDialogImage | null;
  albumId: string;
  onClose: () => void;
  onSaved: () => void;
}

const validationSchema = Yup.object().shape({
  caption: Yup.string()
    .trim()
    .max(500, "Caption cannot exceed 500 characters"),
});

export function CaptionDialog({
  open,
  image,
  albumId,
  onClose,
  onSaved,
}: CaptionDialogProps) {
  const [updateImage] = useUpdateMediaGalleryImage(albumId);

  const formik = useFormik({
    initialValues: {
      caption: image?.caption ?? "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      if (!image) return;
      try {
        await updateImage({
          variables: {
            id: image.id,
            input: { caption: values.caption ? values.caption.trim() : null },
          },
        });
        toast.success("Caption updated successfully");
        onSaved();
        onClose();
      } catch (err: unknown) {
        toast.error((err as Error)?.message || "Failed to save caption");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 shadow-2xl rounded-xl bg-white dark:bg-zinc-900">
        {/* Header (Pattern C: Modal Dialog) */}
        <div className="p-5 border-b border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <MessageSquareText className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-xs font-bold text-[#303030] dark:text-zinc-100">
                Edit Photo Caption
              </DialogTitle>
              <DialogDescription className="text-[11px] text-[#616161] dark:text-zinc-400">
                Add context or photographer credits displayed in the lightbox
              </DialogDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 rounded-md hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={formik.handleSubmit}>
          <div className="p-5 space-y-3.5">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="caption"
                  className="text-xs font-semibold text-[#303030] dark:text-zinc-100"
                >
                  Caption Text
                </Label>
                <span className="text-[11px] text-[#616161] dark:text-zinc-400 font-mono">
                  {formik.values.caption.length}/500
                </span>
              </div>
              <Input
                id="caption"
                name="caption"
                placeholder="Add descriptive caption or credits…"
                value={formik.values.caption}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "h-9 text-xs",
                  formik.touched.caption &&
                    formik.errors.caption &&
                    "border-destructive focus-visible:ring-destructive",
                )}
              />
              {formik.touched.caption && formik.errors.caption && (
                <p className="text-[11px] text-destructive font-medium mt-1">
                  {formik.errors.caption}
                </p>
              )}
              <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-snug">
                This caption will appear as the subtitle overlay during gallery lightbox browsing.
              </p>
            </div>
          </div>

          {/* Footer (Pattern C: Modal Dialog) */}
          <div className="p-3.5 border-t border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={formik.isSubmitting}
              className="h-8.5 px-3 text-xs border-[#d2d5d9] dark:border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="h-8.5 px-4 text-xs font-medium bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
            >
              {formik.isSubmitting && (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              )}
              Save Caption
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
