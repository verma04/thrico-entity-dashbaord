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
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { Layout, Loader2, X, Globe } from "lucide-react";
import { useCreatePage } from "@/graphql/actions/website";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CreatePageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteId?: string;
  onSuccess?: (pageData: { id: string; name: string; slug: string }) => void;
  onError?: (error: Error) => void;
  showToast?: boolean;
  successMessage?: string;
}

const createPageValidationSchema = Yup.object().shape({
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
});

export function CreatePageDialog({
  open,
  onOpenChange,
  websiteId,
  onSuccess,
  onError,
  showToast = true,
  successMessage = "Page created successfully!",
}: CreatePageDialogProps) {
  const { toast } = useToast();

  const [createPageMutation] = useCreatePage();

  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
    },
    validationSchema: createPageValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!websiteId) {
        if (showToast) {
          toast({
            title: "Error",
            description: "Website context not found. Please refresh and try again.",
            variant: "destructive",
          });
        }
        setSubmitting(false);
        return;
      }

      const cleanSlug = values.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      try {
        const res = await createPageMutation({
          variables: {
            websiteId,
            name: values.name.trim(),
            slug: cleanSlug,
          },
        });

        const createdPage = res.data?.createPage;

        if (showToast) {
          toast({
            title: "Page Created",
            description: successMessage,
          });
        }

        resetForm();
        onOpenChange(false);

        if (createdPage) {
          onSuccess?.({
            id: createdPage.id,
            name: createdPage.name,
            slug: createdPage.slug,
          });
        }
      } catch (err: unknown) {
        const message = (err as Error)?.message || "Failed to create page";
        if (showToast) {
          toast({
            title: "Creation Failed",
            description: message,
            variant: "destructive",
          });
        }
        onError?.(err as Error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    formik.setFieldValue("name", val);

    // Auto-generate slug only if user hasn't manually edited slug
    if (!formik.touched.slug) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      formik.setFieldValue("slug", generatedSlug);
    }
  };

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
                <Layout className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-xs font-bold text-[#303030] dark:text-zinc-100">
                  Create New Page
                </DialogTitle>
                <DialogDescription className="text-[11px] text-[#616161] dark:text-zinc-400">
                  Configure page title and URL routing for your website
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
              description="Define public name and URL path slug."
            >
              {/* Page Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="dialog-page-name"
                  className="text-xs font-semibold text-[#303030] dark:text-zinc-100"
                >
                  Page Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dialog-page-name"
                  name="name"
                  placeholder="e.g. Services, About Us, Resources"
                  value={formik.values.name}
                  onChange={handleNameChange}
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
                <Label
                  htmlFor="dialog-page-slug"
                  className="text-xs font-semibold text-[#303030] dark:text-zinc-100"
                >
                  URL Slug Path <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-0">
                  <div className="h-9 px-3 flex items-center bg-[#f6f6f7] dark:bg-zinc-800 rounded-l-[6px] border border-r-0 border-[#d2d5d9] dark:border-zinc-700 text-[#616161] font-mono text-xs font-semibold select-none">
                    /
                  </div>
                  <Input
                    id="dialog-page-slug"
                    name="slug"
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
                    disabled={formik.isSubmitting}
                    className={cn(
                      "h-9 text-xs font-mono rounded-l-none rounded-r-[6px] bg-white dark:bg-zinc-900 border-[#d2d5d9] dark:border-zinc-800",
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
                    thrico.community/{formik.values.slug || "new-page"}
                  </span>
                </div>
              </div>
            </PolarisFormCard>
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
              Create Page
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
