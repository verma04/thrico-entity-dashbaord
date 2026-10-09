"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Layout,
  Globe,
  ArrowLeft,
  Sparkles,
  FileText,
  Compass,
  CornerDownRight,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useToast } from "@/hooks/use-toast";
import {
  useCreatePage,
  useUpdatePageSeo,
  useGetWebsite,
} from "@/graphql/actions/website";
import { GET_WEBSITE } from "@/graphql/quries/website/index";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisModeTile,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInfoBanner,
} from "@/components/gamification/shared/polaris-form-ui";
import { cn } from "@/lib/utils";

interface CreatePageFormValues {
  name: string;
  slug: string;
  pageType: "content" | "redirect";
  archetype: "standard" | "landing" | "resources";
  redirectType: "internal" | "external";
  redirectUrl: string;
  openInNewTab: boolean;
  statusCode: 301 | 302;
}

const createPageSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Give your new page a recognizable name")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters"),
  slug: Yup.string()
    .trim()
    .required("URL slug path is required")
    .matches(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  pageType: Yup.string().oneOf(["content", "redirect"]).required(),
  archetype: Yup.string().when("pageType", {
    is: "content",
    then: (schema) =>
      schema.oneOf(["standard", "landing", "resources"]).required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  redirectType: Yup.string().when("pageType", {
    is: "redirect",
    then: (schema) => schema.oneOf(["internal", "external"]).required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  redirectUrl: Yup.string().when("pageType", {
    is: "redirect",
    then: (schema) =>
      schema
        .trim()
        .required("Destination URL or target page is required")
        .test(
          "valid-destination",
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

export function CreatePageManager() {
  const router = useRouter();
  const { toast } = useToast();
  const { addPage } = useWebsiteBuilderStore();
  const [saved, setSaved] = useState(false);

  const { data: websiteData } = useGetWebsite({});
  const websiteId = websiteData?.getWebsite?.id;

  const existingPages = (websiteData?.getWebsite?.pages || []) as Array<{
    id: string;
    name: string;
    slug: string;
  }>;

  const [updatePageSeoMutation] = useUpdatePageSeo();

  const [createPageMutation, { loading: isCreating }] = useCreatePage({
    refetchQueries: [{ query: GET_WEBSITE }],
    awaitRefetchQueries: true,
    onCompleted: async (data) => {
      const createdPage = data?.createPage;
      const isRedirect = formik.values.pageType === "redirect";

      if (createdPage?.id && isRedirect) {
        try {
          await updatePageSeoMutation({
            variables: {
              pageId: createdPage.id,
              schemaMarkup: {
                redirect: {
                  isRedirect: true,
                  type: formik.values.redirectType,
                  targetUrl: formik.values.redirectUrl.trim(),
                  openInNewTab: formik.values.openInNewTab,
                  statusCode: formik.values.statusCode,
                },
              },
            },
          });
        } catch (err: unknown) {
          console.error("Failed to persist redirect SEO metadata:", err);
        }
      }

      toast({
        title: "Page Created",
        description: isRedirect
          ? `Redirect page '${createdPage?.name || "New Page"}' configured successfully.`
          : `Page '${createdPage?.name || "New Page"}' has been successfully created.`,
      });
      setSaved(true);

      if (createdPage?.name && createdPage?.slug) {
        addPage(
          createdPage.name,
          createdPage.slug,
          isRedirect
            ? {
                isRedirect: true,
                type: formik.values.redirectType,
                targetUrl: formik.values.redirectUrl.trim(),
                openInNewTab: formik.values.openInNewTab,
                statusCode: formik.values.statusCode,
              }
            : undefined,
        );
      }

      setTimeout(() => {
        router.push("/app-layout");
      }, 500);
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create page.",
        variant: "destructive",
      });
    },
  });

  const formik = useFormik<CreatePageFormValues>({
    initialValues: {
      name: "",
      slug: "",
      pageType: "content",
      archetype: "standard",
      redirectType: "internal",
      redirectUrl: "",
      openInNewTab: false,
      statusCode: 301,
    },
    validationSchema: createPageSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!websiteId) {
        toast({
          title: "System Error",
          description: "Cannot identify parent website context. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const cleanSlug = values.slug
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
        return;
      }

      try {
        await createPageMutation({
          variables: {
            websiteId,
            name: values.name.trim(),
            slug: cleanSlug,
          },
        });
      } catch (err: unknown) {
        console.error("Page creation error:", err);
      }
    },
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const errors = await formik.validateForm();
    const errorKeys = Object.keys(errors) as Array<keyof typeof errors>;
    if (errorKeys.length > 0) {
      formik.setTouched(
        errorKeys.reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {},
        ),
      );
      const firstKey = errorKeys[0];
      const firstError = errors[firstKey];
      toast({
        title: "Validation Error",
        description:
          typeof firstError === "string"
            ? firstError
            : "Please fill in all required fields properly.",
        variant: "destructive",
      });
      const el = document.getElementById(firstKey);
      if (el) {
        el.focus();
      }
      return;
    }
    await formik.submitForm();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    formik.setFieldValue("name", val);

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

  const currentSlug = formik.values.slug || "new-page";
  const currentPageName = formik.values.name || "Untitled Page";
  const isRedirect = formik.values.pageType === "redirect";

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Create Page"
        description="Configure the title, URL slug, and layout archetype or redirect rule for your website page."
        icon={Layout}
        badgeText="Website Studio"
        breadcrumbs={[
          { label: "Website Studio", href: "/app-layout" },
          { label: "Website Pages", href: "/app-layout" },
          { label: "Create Page" },
        ]}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/app-layout")}
            className="h-8 px-3 text-xs gap-1.5 border-[#d2d5d9] dark:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 cursor-pointer shadow-2xs text-[#303030] dark:text-zinc-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Cancel
          </Button>
        }
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <PolarisFormLayout
          sidebar={
            <div className="space-y-4">
              {/* Browser Preview Sidebar Card */}
              <PolarisSidebarCard
                title="Page Preview"
                badge={isRedirect ? "URL Redirect" : "Draft Page"}
                icon={isRedirect ? CornerDownRight : Globe}
              >
                <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs overflow-hidden flex flex-col">
                  {/* Browser Address Bar */}
                  <div className="h-8 border-b border-[#d2d5d9] dark:border-zinc-800 flex items-center px-3 bg-[#f6f6f7] dark:bg-zinc-900/80 gap-2">
                    <div className="flex gap-1.5 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#d2d5d9] dark:bg-zinc-700" />
                      <div className="w-2 h-2 rounded-full bg-[#d2d5d9] dark:bg-zinc-700" />
                      <div className="w-2 h-2 rounded-full bg-[#d2d5d9] dark:bg-zinc-700" />
                    </div>
                    <div className="flex-1 mx-1 bg-white dark:bg-zinc-950 border border-[#d2d5d9] dark:border-zinc-800 rounded-[4px] h-5.5 flex items-center px-2 justify-center overflow-hidden">
                      <span className="text-[10px] text-[#616161] font-mono flex items-center gap-1 truncate">
                        <Globe className="h-3 w-3 shrink-0 text-[#8c9196]" />
                        thrico.community/{currentSlug}
                      </span>
                    </div>
                  </div>

                  {/* Browser Canvas */}
                  {isRedirect ? (
                    <div className="p-4 flex flex-col items-center justify-center text-center space-y-2.5">
                      <div className="w-10 h-10 rounded-[8px] bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-900/40">
                        <CornerDownRight className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-[#303030] dark:text-zinc-100 truncate max-w-[200px]">
                          {currentPageName}
                        </h4>
                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#616161] dark:text-zinc-400 font-mono">
                          <span>/{currentSlug}</span>
                          <ArrowRight className="h-3 w-3 text-amber-600" />
                          <span className="text-amber-700 dark:text-amber-400 font-semibold truncate max-w-[120px]">
                            {formik.values.redirectUrl || "target"}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[9.5px] uppercase font-mono px-1.5 py-0 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                      >
                        HTTP {formik.values.statusCode} Redirect
                      </Badge>
                    </div>
                  ) : (
                    <div className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                      <div className="w-10 h-10 rounded-[8px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                        <Layout className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#303030] dark:text-zinc-100 truncate max-w-[200px]">
                          {currentPageName}
                        </h4>
                        <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5 max-w-[200px] mx-auto leading-tight">
                          After saving, you can customize layout sections and visual design blocks.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary Metadata */}
                <div className="space-y-1 pt-2 border-t border-[#e1e3e5]/60 dark:border-zinc-800/80">
                  <PolarisSummaryRow
                    label="Access Route"
                    value={`/${currentSlug}`}
                  />
                  <PolarisSummaryRow
                    label="Type"
                    value={
                      <Badge
                        variant="outline"
                        className="text-[9.5px] uppercase font-mono px-1 py-0"
                      >
                        {isRedirect ? "Redirect" : formik.values.archetype}
                      </Badge>
                    }
                  />
                  {isRedirect && (
                    <PolarisSummaryRow
                      label="Target Mode"
                      value={
                        formik.values.redirectType === "internal"
                          ? "Internal Page"
                          : "External URL"
                      }
                    />
                  )}
                  <PolarisSummaryRow
                    label="Publication State"
                    value="Draft (Unpublished)"
                    isLast
                  />
                </div>
              </PolarisSidebarCard>

              {/* Strategic Tip */}
              <PolarisTipCard title={isRedirect ? "Redirect Best Practice" : "URL & SEO Best Practice"}>
                {isRedirect ? (
                  <>
                    Use <strong>301 Permanent</strong> for moved routes or legacy links so search engines preserve search authority. Use <strong>Internal</strong> to link cleanly to existing site modules.
                  </>
                ) : (
                  <>
                    Keep path slugs clean and concise (e.g. <code>/about</code> or{" "}
                    <code>/services</code>). This improves social link sharing,
                    bookmarking, and search engine indexability.
                  </>
                )}
              </PolarisTipCard>
            </div>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <PolarisInfoBanner
              variant="info"
              title={isRedirect ? "URL Redirection Rule" : "Publishing Workflow"}
              description={
                isRedirect
                  ? "Incoming traffic to this route will seamlessly route to the target destination. No visual layout blocks or canvas modules are required."
                  : "Create the page container first, then use the visual page builder studio to drag and drop interactive modules, banners, and layout grids."
              }
            />

            {/* Step 1: Page Identity & Path */}
            <PolarisFormCard
              step={1}
              title="Page Identity & Path"
              description="Enter the public title and URL slug path for this page."
              badge="Core Setup"
            >
              <div className="space-y-3.5">
                {/* Page Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-xs font-semibold text-[#303030] dark:text-zinc-100 select-none block"
                  >
                    Page Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Services, About Us, Partner Portal"
                    value={formik.values.name}
                    onChange={handleNameChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "h-9 text-xs bg-white dark:bg-zinc-900 border-[#d2d5d9] dark:border-zinc-800 text-[#303030] dark:text-zinc-100 rounded-[6px]",
                      (formik.touched.name || formik.submitCount > 0) &&
                        formik.errors.name &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                  />
                  {(formik.touched.name || formik.submitCount > 0) &&
                    formik.errors.name && (
                      <p className="text-[11px] font-medium text-destructive">
                        {formik.errors.name}
                      </p>
                    )}
                </div>

                {/* Slug Path */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="slug"
                    className="text-xs font-semibold text-[#303030] dark:text-zinc-100 select-none block"
                  >
                    URL Slug Path <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex items-center gap-0">
                    <div className="h-9 px-3 flex items-center bg-[#f6f6f7] dark:bg-zinc-800 rounded-l-[6px] border border-r-0 border-[#d2d5d9] dark:border-zinc-700 text-[#616161] font-mono text-xs font-semibold select-none">
                      /
                    </div>
                    <Input
                      id="slug"
                      name="slug"
                      placeholder="services"
                      value={formik.values.slug}
                      className={cn(
                        "h-9 text-xs font-mono rounded-l-none rounded-r-[6px] bg-white dark:bg-zinc-900 border-[#d2d5d9] dark:border-zinc-800 text-[#303030] dark:text-zinc-100",
                        (formik.touched.slug || formik.submitCount > 0) &&
                          formik.errors.slug &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
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
                    />
                  </div>
                  {(formik.touched.slug || formik.submitCount > 0) &&
                    formik.errors.slug && (
                      <p className="text-[11px] font-medium text-destructive">
                        {formik.errors.slug}
                      </p>
                    )}
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                    Defines the URL path visitors use to reach this page
                    (e.g. <code>thrico.community/{currentSlug}</code>).
                  </p>
                </div>
              </div>
            </PolarisFormCard>

            {/* Step 2: Page Behavior Mode */}
            <PolarisFormCard
              step={2}
              title="Page Behavior"
              description="Choose whether this route serves visual page content or automatically redirects."
              badge="Routing Mode"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <PolarisModeTile
                  label="Standard Content Page"
                  description="Build responsive visual sections, hero headers, grids, and dynamic modules"
                  icon={Layout}
                  selected={formik.values.pageType === "content"}
                  onClick={() => formik.setFieldValue("pageType", "content")}
                />
                <PolarisModeTile
                  label="URL Redirection"
                  description="Forward traffic arriving at this route to an internal page or external website"
                  icon={CornerDownRight}
                  selected={formik.values.pageType === "redirect"}
                  onClick={() => formik.setFieldValue("pageType", "redirect")}
                />
              </div>
            </PolarisFormCard>

            {/* Step 3: Content Archetype OR Redirect Destination */}
            {formik.values.pageType === "content" ? (
              <PolarisFormCard
                step={3}
                title="Page Archetype"
                description="Choose the primary visual purpose for this page container."
                badge="Template"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <PolarisModeTile
                    label="Standard Page"
                    description="Multi-section informational page with headers, cards, and text"
                    icon={FileText}
                    selected={formik.values.archetype === "standard"}
                    onClick={() => formik.setFieldValue("archetype", "standard")}
                  />
                  <PolarisModeTile
                    label="Landing / Showcase"
                    description="High-converting hero page with CTA banners and media spotlight"
                    icon={Sparkles}
                    selected={formik.values.archetype === "landing"}
                    onClick={() => formik.setFieldValue("archetype", "landing")}
                  />
                  <PolarisModeTile
                    label="Resources & Hub"
                    description="Directory page for documentation, policies, FAQs, or courses"
                    icon={Compass}
                    selected={formik.values.archetype === "resources"}
                    onClick={() => formik.setFieldValue("archetype", "resources")}
                  />
                </div>
              </PolarisFormCard>
            ) : (
              <PolarisFormCard
                step={3}
                title="Redirect Destination & Behavior"
                description="Configure the destination URL and routing status code for this redirect."
                badge="Destination"
              >
                <div className="space-y-4">
                  {/* Redirect Type Tiles */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#303030] dark:text-zinc-100 select-none block">
                      Destination Target
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <PolarisModeTile
                        label="Internal Website Page"
                        description="Route visitors to an existing page on your website"
                        icon={FileText}
                        selected={formik.values.redirectType === "internal"}
                        onClick={() => {
                          formik.setFieldValue("redirectType", "internal");
                          if (formik.values.redirectUrl.startsWith("http")) {
                            formik.setFieldValue("redirectUrl", "/");
                          }
                        }}
                      />
                      <PolarisModeTile
                        label="External URL"
                        description="Forward to an external domain or web link (https://...)"
                        icon={Globe}
                        selected={formik.values.redirectType === "external"}
                        onClick={() => {
                          formik.setFieldValue("redirectType", "external");
                          if (!formik.values.redirectUrl.startsWith("http")) {
                            formik.setFieldValue("redirectUrl", "https://");
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Destination Field */}
                  {formik.values.redirectType === "internal" ? (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="internal-redirect"
                        className="text-xs font-semibold text-[#303030] dark:text-zinc-100 select-none block"
                      >
                        Target Website Page <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formik.values.redirectUrl || "/"}
                        onValueChange={(val) =>
                          formik.setFieldValue("redirectUrl", val)
                        }
                      >
                        <SelectTrigger
                          id="internal-redirect"
                          className="h-9 text-xs bg-white dark:bg-zinc-900 border-[#d2d5d9] dark:border-zinc-800"
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
                      <p className="text-[11px] text-muted-foreground">
                        Select which page in your website visitors will be forwarded to.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="redirectUrl"
                        className="text-xs font-semibold text-[#303030] dark:text-zinc-100 select-none block"
                      >
                        External Target URL <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="redirectUrl"
                        name="redirectUrl"
                        placeholder="https://example.com/partner"
                        value={formik.values.redirectUrl}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={cn(
                          "h-9 text-xs font-mono bg-white dark:bg-zinc-900 border-[#d2d5d9] dark:border-zinc-800",
                          formik.touched.redirectUrl &&
                            formik.errors.redirectUrl &&
                            "border-destructive focus-visible:ring-destructive",
                        )}
                      />
                      {formik.touched.redirectUrl &&
                        formik.errors.redirectUrl && (
                          <p className="text-[11px] font-medium text-destructive">
                            {formik.errors.redirectUrl}
                          </p>
                        )}
                      <p className="text-[11px] text-muted-foreground">
                        Full destination URL including <code>https://</code>.
                      </p>
                    </div>
                  )}

                  {/* Open in New Tab Switch */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/15">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="openInNewTab"
                        className="text-xs font-semibold text-foreground cursor-pointer"
                      >
                        Open in New Tab
                      </Label>
                      <p className="text-[11px] text-muted-foreground">
                        Launch target in a new browser window when clicked
                      </p>
                    </div>
                    <Switch
                      id="openInNewTab"
                      checked={formik.values.openInNewTab}
                      onCheckedChange={(checked) =>
                        formik.setFieldValue("openInNewTab", checked)
                      }
                    />
                  </div>

                  {/* HTTP Status Code Selection */}
                  <div className="space-y-1.5 pt-1">
                    <Label className="text-xs font-semibold text-[#303030] dark:text-zinc-100 select-none block">
                      HTTP Status Code
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => formik.setFieldValue("statusCode", 301)}
                        className={cn(
                          "p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-2.5",
                          formik.values.statusCode === 301
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                            : "border-border/60 hover:border-border hover:bg-muted/30 bg-card",
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0",
                            formik.values.statusCode === 301
                              ? "border-primary bg-primary text-white"
                              : "border-muted-foreground/40",
                          )}
                        >
                          {formik.values.statusCode === 301 && (
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-foreground">
                            301 Moved Permanently
                          </div>
                          <div className="text-[10.5px] text-muted-foreground leading-snug mt-0.5">
                            Best for SEO when URL has permanently relocated
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => formik.setFieldValue("statusCode", 302)}
                        className={cn(
                          "p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-2.5",
                          formik.values.statusCode === 302
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                            : "border-border/60 hover:border-border hover:bg-muted/30 bg-card",
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0",
                            formik.values.statusCode === 302
                              ? "border-primary bg-primary text-white"
                              : "border-muted-foreground/40",
                          )}
                        >
                          {formik.values.statusCode === 302 && (
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-foreground">
                            302 Found / Temporary
                          </div>
                          <div className="text-[10.5px] text-muted-foreground leading-snug mt-0.5">
                            Short-term forward or temporary marketing campaign
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </PolarisFormCard>
            )}
          </form>
        </PolarisFormLayout>
      </EcosystemContainer>

      <FloatingSavePanel
        hasChanged={formik.dirty || formik.values.name.trim().length > 0}
        saved={saved}
        isSaving={isCreating}
        onSave={handleSubmit}
        onReset={() => {
          formik.resetForm();
          router.push("/app-layout");
        }}
        title="New Website Page"
        description="Ready to create this website page?"
        buttonText={isRedirect ? "Create Redirect" : "Create Page"}
      />
    </EcosystemWrapper>
  );
}
