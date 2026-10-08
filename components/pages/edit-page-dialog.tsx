"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { FileEdit, Loader2, X, Globe, Lock } from "lucide-react";
import { useUpdatePage } from "@/graphql/actions/website";
import { GET_WEBSITE } from "@/graphql/quries/website/index";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface EditPageDialogPageData {
  id: string;
  name: string;
  slug: string;
  isEnabled: boolean;
  isSystem?: boolean;
}

interface EditPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: EditPageDialogPageData | null;
  onSuccess?: () => void;
}

const editPageValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Page name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters"),
  slug: Yup.string()
    .trim()
    .required("URL slug path is required")
    .matches(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  isEnabled: Yup.boolean().required(),
});

export function EditPageDialog({
  open,
  onOpenChange,
  page,
  onSuccess,
}: EditPageDialogProps) {
  const { toast } = useToast();

  const isHome = page?.slug === "home" || page?.isSystem;

  const [updatePageMutation] = useUpdatePage({
    refetchQueries: [{ query: GET_WEBSITE }],
    awaitRefetchQueries: true,
  });

  const formik = useFormik({
    initialValues: {
      name: page?.name || "",
      slug: page?.slug || "",
      isEnabled: page?.isEnabled ?? true,
    },
    validationSchema: editPageValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      if (!page?.id) {
        toast({
          title: "Error",
          description: "Page reference is missing.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      const cleanSlug = isHome
        ? page.slug
        : values.slug
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "");

      if (!cleanSlug) {
        toast({
          title: "Validation Error",
          description: "A valid URL slug is required.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      try {
        await updatePageMutation({
          variables: {
            pageId: page.id,
            name: values.name.trim(),
            slug: cleanSlug,
            isEnabled: isHome ? true : values.isEnabled,
          },
        });

        toast({
          title: "Page Updated",
          description: `Page '${values.name.trim()}' settings have been saved successfully.`,
        });

        onOpenChange(false);
        onSuccess?.();
      } catch (err: unknown) {
        toast({
          title: "Update Failed",
          description: (err as Error)?.message || "Failed to update page settings.",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 shadow-2xl rounded-xl bg-white dark:bg-zinc-900">
        <form onSubmit={formik.handleSubmit}>
          {/* 1. Header with Icon Avatar */}
          <div className="px-5 py-4 border-b border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                <FileEdit className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-xs font-bold text-[#303030] dark:text-zinc-100">
                  Edit Page Settings
                </DialogTitle>
                <DialogDescription className="text-[11px] text-[#616161] dark:text-zinc-400">
                  Configure title, URL route slug, and visibility status
                </DialogDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-7 w-7 rounded-md hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* 2. Scrollable Body */}
          <div className="p-4 space-y-3.5">
            <PolarisFormCard
              title="Page Identity & Routing"
              description="Customize the public page name and URL routing slug."
            >
              {/* Page Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-page-name"
                  className="text-xs font-semibold text-[#303030] dark:text-zinc-100"
                >
                  Page Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-page-name"
                  name="name"
                  placeholder="e.g. Services, About Us, Resources"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                  className={cn(
                    "h-9 text-xs bg-white dark:bg-zinc-900 border-[#d2d5d9] dark:border-zinc-800",
                    formik.touched.name &&
                      formik.errors.name &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-[11px] text-destructive font-medium mt-1">
                    {formik.errors.name}
                  </p>
                )}
              </div>

              {/* URL Slug */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="edit-page-slug"
                    className="text-xs font-semibold text-[#303030] dark:text-zinc-100"
                  >
                    URL Slug Path <span className="text-destructive">*</span>
                  </Label>
                  {isHome && (
                    <span className="flex items-center gap-1 text-[10.5px] text-amber-600 dark:text-amber-400 font-medium">
                      <Lock className="h-3 w-3" />
                      Root Route (Locked)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-0">
                  <div className="h-9 px-3 flex items-center bg-[#f6f6f7] dark:bg-zinc-800 rounded-l-[6px] border border-r-0 border-[#d2d5d9] dark:border-zinc-700 text-[#616161] font-mono text-xs font-semibold select-none">
                    /
                  </div>
                  <Input
                    id="edit-page-slug"
                    name="slug"
                    disabled={isHome || formik.isSubmitting}
                    placeholder="services"
                    value={formik.values.slug}
                    onChange={(e) => {
                      const val = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "");
                      formik.setFieldValue("slug", val);
                    }}
                    onBlur={(e) => {
                      formik.handleBlur(e);
                      const cleaned = (formik.values.slug || "").replace(
                        /^-+|-+$/g,
                        "",
                      );
                      formik.setFieldValue("slug", cleaned);
                    }}
                    className={cn(
                      "h-9 text-xs font-mono rounded-l-none rounded-r-[6px] bg-white dark:bg-zinc-900 border-[#d2d5d9] dark:border-zinc-800",
                      isHome && "opacity-75 cursor-not-allowed bg-muted/40",
                      formik.touched.slug &&
                        formik.errors.slug &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                  />
                </div>
                {formik.touched.slug && formik.errors.slug && (
                  <p className="text-[11px] text-destructive font-medium mt-1">
                    {formik.errors.slug}
                  </p>
                )}
                <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#616161] dark:text-zinc-400 font-mono">
                  <Globe className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    thrico.community/{formik.values.slug || "page"}
                  </span>
                </div>
              </div>
            </PolarisFormCard>

            {/* Publishing Status Toggle (hidden/locked if Home page) */}
            {!isHome ? (
              <div className="flex items-center justify-between p-3 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/60">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                    Published Status
                  </h4>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                    When active, this page is publicly accessible to visitors.
                  </p>
                </div>
                <Switch
                  checked={formik.values.isEnabled}
                  onCheckedChange={(checked) =>
                    formik.setFieldValue("isEnabled", checked)
                  }
                  disabled={formik.isSubmitting}
                />
              </div>
            ) : (
              <div className="p-2.5 rounded-[8px] border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>The homepage is always published as the primary entry point of your website.</span>
              </div>
            )}
          </div>

          {/* 3. Sticky Footer */}
          <div className="p-3.5 border-t border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={formik.isSubmitting}
              className="h-8.5 px-3 text-xs border-[#d2d5d9] dark:border-zinc-700 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="h-8.5 px-4 text-xs font-medium bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-2xs cursor-pointer"
            >
              {formik.isSubmitting && (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
