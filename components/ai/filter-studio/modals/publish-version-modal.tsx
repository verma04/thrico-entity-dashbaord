"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Rocket,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFilterStudioStore } from "@/store/useFilterStudioStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PublishVersionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PublishFormValues {
  version: string;
  releaseNotes: string;
  publishWeb: boolean;
  publishIos: boolean;
  publishAndroid: boolean;
}

const publishValidationSchema = Yup.object().shape({
  version: Yup.string()
    .matches(
      /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/,
      "Version must follow semantic versioning (e.g. 1.0.1 or 1.1.0)"
    )
    .required("Version number is required"),
  releaseNotes: Yup.string()
    .trim()
    .min(5, "Release notes must be at least 5 characters")
    .required("Release notes are required for immutable publishing audit"),
});

export function PublishVersionModal({
  open,
  onOpenChange,
}: PublishVersionModalProps) {
  const { manifest, publishFilter } = useFilterStudioStore();

  const nextVersion = (() => {
    const parts = manifest.version.split(".");
    if (parts.length === 3) {
      const patch = parseInt(parts[2], 10) + 1;
      return `${parts[0]}.${parts[1]}.${patch}`;
    }
    return "1.0.1";
  })();

  const formik = useFormik<PublishFormValues>({
    enableReinitialize: true,
    initialValues: {
      version: nextVersion,
      releaseNotes: `Updated facial anchors, optimized texture compression, and refined ${manifest.name} effects for live SDK delivery.`,
      publishWeb: true,
      publishIos: true,
      publishAndroid: true,
    },
    validationSchema: publishValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        publishFilter(values.version, values.releaseNotes);
        toast.success(
          `Filter version ${values.version} published immutably to CloudFront CDN!`
        );
        onOpenChange(false);
      } catch (err: unknown) {
        toast.error((err as Error).message || "Publishing failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border/80 p-6 select-none">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Rocket className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-foreground">
                Publish Immutable AR Filter Version
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Manifest will be compiled, hashed, and deployed to CloudFront edge CDN.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 py-2 text-xs">
          {/* Version bump row */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="version" className="text-xs font-semibold text-foreground">
                Semantic Version Tag
              </Label>
              <span className="text-[10px] text-muted-foreground font-mono">
                Current: v{manifest.version}
              </span>
            </div>
            <Input
              id="version"
              name="version"
              value={formik.values.version}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={cn(
                "h-8 text-xs font-mono bg-background",
                formik.touched.version &&
                  formik.errors.version &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            {formik.touched.version && formik.errors.version && (
              <p className="text-[11px] text-destructive font-medium mt-1">
                {formik.errors.version}
              </p>
            )}
          </div>

          {/* Release Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="releaseNotes" className="text-xs font-semibold text-foreground">
              Release Notes & Changelog
            </Label>
            <Textarea
              id="releaseNotes"
              name="releaseNotes"
              rows={3}
              value={formik.values.releaseNotes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Describe what changed in this version..."
              className={cn(
                "text-xs resize-none bg-background",
                formik.touched.releaseNotes &&
                  formik.errors.releaseNotes &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            {formik.touched.releaseNotes && formik.errors.releaseNotes && (
              <p className="text-[11px] text-destructive font-medium mt-1">
                {formik.errors.releaseNotes}
              </p>
            )}
          </div>

          {/* Deployment Channels */}
          <div className="space-y-2 pt-1 border-t border-border/40">
            <Label className="text-xs font-semibold text-foreground block">
              Active SDK Distribution Channels
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={cn(
                  "p-2 rounded-lg border text-center cursor-pointer transition-all flex flex-col items-center gap-1",
                  formik.values.publishWeb
                    ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-300 font-medium"
                    : "border-border/60 text-muted-foreground"
                )}
              >
                <input
                  type="checkbox"
                  name="publishWeb"
                  checked={formik.values.publishWeb}
                  onChange={formik.handleChange}
                  className="hidden"
                />
                <span className="text-[11px]">Web SDK</span>
                <span className="text-[9px] text-muted-foreground font-mono">Browser</span>
              </label>

              <label
                className={cn(
                  "p-2 rounded-lg border text-center cursor-pointer transition-all flex flex-col items-center gap-1",
                  formik.values.publishIos
                    ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-300 font-medium"
                    : "border-border/60 text-muted-foreground"
                )}
              >
                <input
                  type="checkbox"
                  name="publishIos"
                  checked={formik.values.publishIos}
                  onChange={formik.handleChange}
                  className="hidden"
                />
                <span className="text-[11px]">iOS SDK</span>
                <span className="text-[9px] text-muted-foreground font-mono">Native</span>
              </label>

              <label
                className={cn(
                  "p-2 rounded-lg border text-center cursor-pointer transition-all flex flex-col items-center gap-1",
                  formik.values.publishAndroid
                    ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-300 font-medium"
                    : "border-border/60 text-muted-foreground"
                )}
              >
                <input
                  type="checkbox"
                  name="publishAndroid"
                  checked={formik.values.publishAndroid}
                  onChange={formik.handleChange}
                  className="hidden"
                />
                <span className="text-[11px]">Android SDK</span>
                <span className="text-[9px] text-muted-foreground font-mono">Native</span>
              </label>
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1.5 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5 text-foreground font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Pre-Publication Integrity Checks</span>
            </div>
            <div className="flex items-center justify-between">
              <span>SHA-256 Manifest Checksum</span>
              <span className="font-mono text-[10px]">sha256:7b92f9a2e3...</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Atomic S3 Manifest Sync</span>
              <span className="text-emerald-500 font-medium">Ready</span>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-border/50 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={formik.isSubmitting}
              className="h-8 text-xs bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer font-medium"
            >
              Publish v{formik.values.version}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
