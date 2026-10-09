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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import {
  Layout,
  Loader2,
  X,
  Globe,
  CornerDownRight,
  FileText,
  Check,
} from "lucide-react";
import {
  useCreatePage,
  useUpdatePageSeo,
  useGetWebsite,
} from "@/graphql/actions/website";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PageRedirectConfig } from "@/components/website-layout/page-redirect-utils";

interface CreatePageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteId?: string;
  onSuccess?: (pageData: {
    id: string;
    name: string;
    slug: string;
    redirect?: PageRedirectConfig;
  }) => void;
  onError?: (error: Error) => void;
  showToast?: boolean;
  successMessage?: string;
}

interface CreatePageDialogFormValues {
  name: string;
  slug: string;
  isRedirect: boolean;
  redirectType: "internal" | "external";
  redirectUrl: string;
  openInNewTab: boolean;
  statusCode: 301 | 302;
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
  isRedirect: Yup.boolean().required(),
  redirectType: Yup.string().when("isRedirect", {
    is: true,
    then: (schema) => schema.oneOf(["internal", "external"]).required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  redirectUrl: Yup.string().when("isRedirect", {
    is: true,
    then: (schema) =>
      schema
        .trim()
        .required("Destination URL or target page is required")
        .test(
          "valid-external-url",
          "External URL must begin with http:// or https://",
          function (val) {
            if (!val) return false;
            if (this.parent.redirectType === "external") {
              return /^https?:\/\/.+/i.test(val);
            }
            return true;
          },
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
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

  const { data: websiteData } = useGetWebsite({});
  const existingPages = (websiteData?.getWebsite?.pages || []) as Array<{
    id: string;
    name: string;
    slug: string;
  }>;

  const [createPageMutation] = useCreatePage();
  const [updatePageSeoMutation] = useUpdatePageSeo();

  const formik = useFormik<CreatePageDialogFormValues>({
    initialValues: {
      name: "",
      slug: "",
      isRedirect: false,
      redirectType: "internal",
      redirectUrl: "",
      openInNewTab: false,
      statusCode: 301,
    },
    validationSchema: createPageValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const activeWebsiteId = websiteId || websiteData?.getWebsite?.id;

      if (!activeWebsiteId) {
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
            websiteId: activeWebsiteId,
            name: values.name.trim(),
            slug: cleanSlug,
          },
        });

        const createdPage = res.data?.createPage;
        const redirectConfig: PageRedirectConfig | undefined = values.isRedirect
          ? {
              isRedirect: true,
              type: values.redirectType,
              targetUrl: values.redirectUrl.trim(),
              openInNewTab: values.openInNewTab,
              statusCode: values.statusCode,
            }
          : undefined;

        if (createdPage?.id && redirectConfig) {
          try {
            await updatePageSeoMutation({
              variables: {
                pageId: createdPage.id,
                schemaMarkup: {
                  redirect: redirectConfig,
                },
              },
            });
          } catch (seoErr) {
            console.error("Failed to persist redirect schema:", seoErr);
          }
        }

        if (showToast) {
          toast({
            title: values.isRedirect ? "Redirect Page Created" : "Page Created",
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
            redirect: redirectConfig,
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
                {formik.values.isRedirect ? (
                  <CornerDownRight className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                ) : (
                  <Layout className="h-4 w-4" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xs font-bold text-[#303030] dark:text-zinc-100">
                  {formik.values.isRedirect
                    ? "Create Redirect Page"
                    : "Create New Page"}
                </DialogTitle>
                <DialogDescription className="text-[11px] text-[#616161] dark:text-zinc-400">
                  Configure title and routing destination for your website
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
          <div className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto">
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
                  placeholder="e.g. Services, Partner Portal, Resources"
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

            {/* Redirection Options Card */}
            <PolarisFormCard
              title="URL Redirection"
              description="Optionally forward this route to an internal page or external URL."
            >
              <div className="space-y-3.5">
                {/* Enable Redirect Switch */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/15">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="dialog-enable-redirect"
                      className="text-xs font-semibold text-foreground cursor-pointer"
                    >
                      Enable Page Redirect
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Forward visitors from this route to another URL
                    </p>
                  </div>
                  <Switch
                    id="dialog-enable-redirect"
                    checked={formik.values.isRedirect}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("isRedirect", checked)
                    }
                  />
                </div>

                {formik.values.isRedirect && (
                  <div className="space-y-3 pt-2 border-t border-border/50">
                    {/* Destination Mode Segmented Selector */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">
                        Destination Type
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            formik.setFieldValue("redirectType", "internal");
                            if (formik.values.redirectUrl.startsWith("http")) {
                              formik.setFieldValue("redirectUrl", "/");
                            }
                          }}
                          className={cn(
                            "h-8 px-2.5 rounded-md border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                            formik.values.redirectType === "internal"
                              ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30"
                              : "border-border/70 hover:border-border text-muted-foreground bg-card",
                          )}
                        >
                          <FileText className="h-3 w-3" />
                          <span>Internal Page</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            formik.setFieldValue("redirectType", "external");
                            if (!formik.values.redirectUrl.startsWith("http")) {
                              formik.setFieldValue("redirectUrl", "https://");
                            }
                          }}
                          className={cn(
                            "h-8 px-2.5 rounded-md border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                            formik.values.redirectType === "external"
                              ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30"
                              : "border-border/70 hover:border-border text-muted-foreground bg-card",
                          )}
                        >
                          <Globe className="h-3 w-3" />
                          <span>External URL</span>
                        </button>
                      </div>
                    </div>

                    {/* Target Selector */}
                    {formik.values.redirectType === "internal" ? (
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="dialog-internal-select"
                          className="text-xs font-semibold text-foreground"
                        >
                          Target Page <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formik.values.redirectUrl || "/"}
                          onValueChange={(val) =>
                            formik.setFieldValue("redirectUrl", val)
                          }
                        >
                          <SelectTrigger
                            id="dialog-internal-select"
                            className="h-8.5 text-xs bg-white dark:bg-zinc-900 border-[#d2d5d9] dark:border-zinc-800"
                          >
                            <SelectValue placeholder="Select target page..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="/">
                              <div className="flex items-center gap-2">
                                <FileText className="h-3 w-3 text-muted-foreground" />
                                <span>Home Page</span>
                                <span className="text-muted-foreground font-mono text-[10px]">
                                  /
                                </span>
                              </div>
                            </SelectItem>
                            {existingPages
                              .filter((p) => p.slug !== formik.values.slug)
                              .map((p) => (
                                <SelectItem key={p.id} value={`/${p.slug}`}>
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-3 w-3 text-muted-foreground" />
                                    <span>{p.name}</span>
                                    <span className="text-muted-foreground font-mono text-[10px]">
                                      /{p.slug}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="dialog-redirectUrl"
                          className="text-xs font-semibold text-foreground"
                        >
                          Destination URL <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="dialog-redirectUrl"
                          name="redirectUrl"
                          placeholder="https://example.com/partner"
                          value={formik.values.redirectUrl}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={cn(
                            "h-8.5 text-xs font-mono bg-white dark:bg-zinc-900 border-[#d2d5d9] dark:border-zinc-800",
                            formik.touched.redirectUrl &&
                              formik.errors.redirectUrl &&
                              "border-destructive focus-visible:ring-destructive",
                          )}
                        />
                        {formik.touched.redirectUrl &&
                          formik.errors.redirectUrl && (
                            <p className="text-[11px] text-destructive font-medium mt-1">
                              {formik.errors.redirectUrl}
                            </p>
                          )}
                      </div>
                    )}

                    {/* Open in New Tab Switch */}
                    <div className="flex items-center justify-between p-2 rounded-lg border border-border/60 bg-muted/10">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="dialog-openInNewTab"
                          className="text-xs font-medium text-foreground cursor-pointer"
                        >
                          Open in New Tab
                        </Label>
                        <p className="text-[10px] text-muted-foreground">
                          Target opens in a new browser window
                        </p>
                      </div>
                      <Switch
                        id="dialog-openInNewTab"
                        checked={formik.values.openInNewTab}
                        onCheckedChange={(checked) =>
                          formik.setFieldValue("openInNewTab", checked)
                        }
                      />
                    </div>

                    {/* Status Code Buttons */}
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-foreground">
                        Status Code
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => formik.setFieldValue("statusCode", 301)}
                          className={cn(
                            "p-2 rounded-md border text-left text-xs transition-all cursor-pointer flex items-center justify-between",
                            formik.values.statusCode === 301
                              ? "border-primary bg-primary/5 text-foreground font-semibold"
                              : "border-border/60 text-muted-foreground bg-card",
                          )}
                        >
                          <span>301 Permanent</span>
                          {formik.values.statusCode === 301 && (
                            <Check className="h-3 w-3 text-primary stroke-[3]" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => formik.setFieldValue("statusCode", 302)}
                          className={cn(
                            "p-2 rounded-md border text-left text-xs transition-all cursor-pointer flex items-center justify-between",
                            formik.values.statusCode === 302
                              ? "border-primary bg-primary/5 text-foreground font-semibold"
                              : "border-border/60 text-muted-foreground bg-card",
                          )}
                        >
                          <span>302 Temporary</span>
                          {formik.values.statusCode === 302 && (
                            <Check className="h-3 w-3 text-primary stroke-[3]" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
              {formik.values.isRedirect ? "Create Redirect" : "Create Page"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
