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
  FileEdit,
  Loader2,
  X,
  Globe,
  Lock,
  CornerDownRight,
  FileText,
  Check,
} from "lucide-react";
import {
  useUpdatePage,
  useUpdatePageSeo,
  useGetWebsite,
} from "@/graphql/actions/website";
import { GET_WEBSITE } from "@/graphql/quries/website/index";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  PageRedirectConfig,
  getPageRedirect,
} from "@/components/website-layout/page-redirect-utils";

export interface EditPageDialogPageData {
  id: string;
  name: string;
  slug: string;
  isEnabled: boolean;
  isSystem?: boolean;
  redirect?: PageRedirectConfig;
  seo?: {
    schemaMarkup?: unknown;
    [key: string]: unknown;
  };
}

interface EditPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: EditPageDialogPageData | null;
  onSuccess?: () => void;
}

interface EditPageFormValues {
  name: string;
  slug: string;
  isEnabled: boolean;
  isRedirect: boolean;
  redirectType: "internal" | "external";
  redirectUrl: string;
  openInNewTab: boolean;
  statusCode: 301 | 302;
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
          "not-self-redirect",
          "Cannot redirect a page to itself",
          function (val) {
            if (!val) return true;
            if (this.parent.redirectType === "internal") {
              const currentSlug = this.parent.slug;
              const cleanVal = val.replace(/^\//, "");
              if (
                cleanVal === currentSlug ||
                (currentSlug === "home" && (val === "/" || cleanVal === "home" || cleanVal === ""))
              ) {
                return false;
              }
            }
            return true;
          },
        )
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

export function EditPageDialog({
  open,
  onOpenChange,
  page,
  onSuccess,
}: EditPageDialogProps) {
  const { toast } = useToast();
  const { updatePageRedirect } = useWebsiteBuilderStore();

  const isHome = page?.slug === "home" || page?.isSystem;

  const { data: websiteData } = useGetWebsite({});
  const existingPages = (websiteData?.getWebsite?.pages || []) as Array<{
    id: string;
    name: string;
    slug: string;
  }>;

  const [updatePageMutation] = useUpdatePage({
    refetchQueries: [{ query: GET_WEBSITE }],
    awaitRefetchQueries: true,
  });

  const [updatePageSeoMutation] = useUpdatePageSeo();

  const initialRedirect = getPageRedirect(page);

  const formik = useFormik<EditPageFormValues>({
    initialValues: {
      name: page?.name || "",
      slug: page?.slug || "",
      isEnabled: page?.isEnabled ?? true,
      isRedirect: Boolean(initialRedirect?.isRedirect),
      redirectType: initialRedirect?.type || "internal",
      redirectUrl: initialRedirect?.targetUrl || "",
      openInNewTab: Boolean(initialRedirect?.openInNewTab),
      statusCode: initialRedirect?.statusCode || 301,
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

        const redirectConfig: PageRedirectConfig | null =
          values.isRedirect
            ? {
                isRedirect: true,
                type: values.redirectType,
                targetUrl: values.redirectUrl.trim(),
                openInNewTab: values.openInNewTab,
                statusCode: values.statusCode,
              }
            : null;

        // Persist redirect configuration in page schema markup
        let currentSchemaMarkup: Record<string, unknown> = {};
        if (page.seo?.schemaMarkup) {
          try {
            currentSchemaMarkup =
              typeof page.seo.schemaMarkup === "string"
                ? JSON.parse(page.seo.schemaMarkup)
                : page.seo.schemaMarkup;
          } catch {
            currentSchemaMarkup = {};
          }
        }

        try {
          await updatePageSeoMutation({
            variables: {
              pageId: page.id,
              schemaMarkup: {
                ...currentSchemaMarkup,
                redirect: redirectConfig
                  ? redirectConfig
                  : { isRedirect: false },
              },
            },
          });
        } catch (seoErr) {
          console.error("Failed to update redirect SEO schema:", seoErr);
        }

        updatePageRedirect(page.id, redirectConfig);

        toast({
          title: "Page Updated",
          description: `Page '${values.name.trim()}' settings have been saved successfully.`,
        });

        onOpenChange(false);
        onSuccess?.();
      } catch (err: unknown) {
        toast({
          title: "Update Failed",
          description:
            (err as Error)?.message || "Failed to update page settings.",
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
                {formik.values.isRedirect ? (
                  <CornerDownRight className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                ) : (
                  <FileEdit className="h-4 w-4" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xs font-bold text-[#303030] dark:text-zinc-100">
                  Edit Page Settings
                </DialogTitle>
                <DialogDescription className="text-[11px] text-[#616161] dark:text-zinc-400">
                  Configure title, URL route slug, and redirect behavior
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
                <span>
                  The homepage is always published as the primary entry point of your website.
                </span>
              </div>
            )}

            {/* Redirection Configuration Card (Enabled for both Home and Custom Pages) */}
            <PolarisFormCard
              title="URL Redirection"
              description={
                isHome
                  ? "Automatically forward visitors landing on root (/) to another page or external URL."
                  : "Automatically forward visitors landing on this URL to another destination."
              }
            >
                <div className="space-y-3.5">
                  {isHome && (
                    <div className="p-2.5 rounded-lg border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200 text-[11px] flex items-start gap-2">
                      <Globe className="h-3.5 w-3.5 shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" />
                      <span>
                        <strong>Root Forwarding:</strong> When enabled, any user visiting your website domain root (<strong>/</strong>) will immediately redirect to the configured destination.
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/15">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="edit-enable-redirect"
                        className="text-xs font-semibold text-foreground cursor-pointer"
                      >
                        {isHome ? "Enable Homepage Redirection" : "Enable Page Redirect"}
                      </Label>
                      <p className="text-[11px] text-muted-foreground">
                        {isHome
                          ? "Forward traffic arriving at root domain (/)"
                          : `Forward traffic arriving at /${formik.values.slug || "this-page"}`}
                      </p>
                    </div>
                    <Switch
                      id="edit-enable-redirect"
                      checked={formik.values.isRedirect}
                      onCheckedChange={(checked) => {
                        formik.setFieldValue("isRedirect", checked);
                        if (
                          checked &&
                          isHome &&
                          (!formik.values.redirectUrl || formik.values.redirectUrl === "/")
                        ) {
                          const firstOther = existingPages.find(
                            (p) => p.slug !== "home" && p.slug !== "",
                          )?.slug;
                          if (firstOther) {
                            formik.setFieldValue("redirectUrl", `/${firstOther}`);
                          } else {
                            formik.setFieldValue("redirectType", "external");
                            formik.setFieldValue("redirectUrl", "https://");
                          }
                        }
                      }}
                      disabled={formik.isSubmitting}
                    />
                  </div>

                  {formik.values.isRedirect && (
                    <div className="space-y-3 pt-2 border-t border-border/50">
                      {/* Destination Type Selector */}
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
                                const firstOther = existingPages.find(
                                  (p) => p.slug !== "home" && p.slug !== "",
                                )?.slug;
                                formik.setFieldValue(
                                  "redirectUrl",
                                  isHome ? (firstOther ? `/${firstOther}` : "") : "/",
                                );
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

                      {/* Destination Input */}
                      {formik.values.redirectType === "internal" ? (
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="edit-internal-select"
                            className="text-xs font-semibold text-foreground"
                          >
                            Target Website Page <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={formik.values.redirectUrl || ""}
                            onValueChange={(val) =>
                              formik.setFieldValue("redirectUrl", val)
                            }
                          >
                            <SelectTrigger
                              id="edit-internal-select"
                              className="h-8.5 text-xs bg-white dark:bg-zinc-900 border-[#d2d5d9] dark:border-zinc-800"
                            >
                              <SelectValue placeholder="Select target page..." />
                            </SelectTrigger>
                            <SelectContent>
                              {!isHome && (
                                <SelectItem value="/">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-3 w-3 text-muted-foreground" />
                                    <span>Home Page</span>
                                    <span className="text-muted-foreground font-mono text-[10px]">
                                      /
                                    </span>
                                  </div>
                                </SelectItem>
                              )}
                              {existingPages
                                .filter(
                                  (p) =>
                                    p.slug !== formik.values.slug &&
                                    (!isHome || (p.slug !== "home" && p.slug !== "")),
                                )
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
                            htmlFor="edit-redirectUrl"
                            className="text-xs font-semibold text-foreground"
                          >
                            External Target URL <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="edit-redirectUrl"
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
                            htmlFor="edit-openInNewTab"
                            className="text-xs font-medium text-foreground cursor-pointer"
                          >
                            Open in New Tab
                          </Label>
                          <p className="text-[10px] text-muted-foreground">
                            Opens the destination in a new browser window
                          </p>
                        </div>
                        <Switch
                          id="edit-openInNewTab"
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
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
