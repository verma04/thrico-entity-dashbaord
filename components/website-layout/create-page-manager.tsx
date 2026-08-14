"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Layout,
  Globe,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useToast } from "@/hooks/use-toast";
import { useCreatePage, useGetWebsite } from "@/graphql/actions/website";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { EcosystemHeader } from "@/components/layout/ecosystem";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInfoBanner,
} from "@/components/gamification/shared/polaris-form-ui";

const createPageSchema = Yup.object().shape({
  name: Yup.string()
    .required("Give your new page a recognizable name")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters"),
  slug: Yup.string()
    .required("URL slug is required")
    .matches(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
});

export function CreatePageManager() {
  const router = useRouter();
  const { toast } = useToast();
  const { addPage } = useWebsiteBuilderStore();
  const [saved, setSaved] = useState(false);

  const { data: websiteData } = useGetWebsite({});
  const websiteId = websiteData?.getWebsite?.id;

  const [createPageMutation, { loading: isCreating }] = useCreatePage({
    onCompleted: (data) => {
      toast({
        title: "Page Created",
        description: `Page '${data.createPage.name}' has been successfully created.`,
      });
      setSaved(true);
      addPage(data.createPage.name, data.createPage.slug);

      setTimeout(() => {
        router.push("/app-layout");
      }, 1000);
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create page.",
        variant: "destructive",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
    },
    validationSchema: createPageSchema,
    onSubmit: (values) => {
      if (!websiteId) {
        toast({
          title: "System Error",
          description: "Cannot identify parent website context.",
          variant: "destructive",
        });
        return;
      }

      createPageMutation({
        variables: {
          websiteId,
          name: values.name,
          slug: values.slug,
        },
      });
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    formik.setFieldValue("name", val);

    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    formik.setFieldValue("slug", generatedSlug);
  };

  const currentSlug = formik.values.slug || "new-page";
  const currentPageName = formik.values.name || "Untitled Page";

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-black/10 overflow-hidden relative">
      {/* Centered Top Header matching Polaris Layout */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 md:px-8 py-3">
          <EcosystemHeader
            title="Create Page"
            description="Configure the title, URL slug, and routing for your website page."
            icon={Layout}
            badgeText="Website Builder"
            breadcrumbs={[
              { label: "Website Builder", href: "/app-layout" },
              { label: "Website Pages", href: "/app-layout" },
              { label: "Create Page" },
            ]}
            actions={
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="rounded-lg text-xs font-semibold"
              >
                Cancel
              </Button>
            }
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PolarisFormLayout
          sidebar={
            <div className="space-y-6">
              {/* Browser Preview Sidebar Card */}
              <PolarisSidebarCard
                title="Page Preview"
                badge="Draft Page"
                icon={Globe}
              >
                <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs overflow-hidden flex flex-col">
                  {/* Browser Address Bar */}
                  <div className="h-10 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-3.5 bg-zinc-50 dark:bg-zinc-900/80 gap-2">
                    <div className="flex gap-1.5 shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    </div>
                    <div className="flex-1 mx-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md h-6 flex items-center px-2.5 justify-center overflow-hidden">
                      <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 truncate">
                        <Globe className="h-3 w-3 shrink-0 text-zinc-400" />
                        thrico.community/{currentSlug}
                      </span>
                    </div>
                  </div>

                  {/* Browser Canvas */}
                  <div className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                      <Layout className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {currentPageName}
                      </h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
                        After saving, you can customize sections and design blocks.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary Metadata */}
                <div className="space-y-1.5 pt-2">
                  <PolarisSummaryRow label="Access URL" value={`/${currentSlug}`} />
                  <PolarisSummaryRow label="Page Status" value="Unpublished Draft" isLast />
                </div>
              </PolarisSidebarCard>

              {/* Strategic Tip */}
              <PolarisTipCard title="URL & SEO Best Practice">
                Keep path slugs clean and concise (e.g. <code>/about</code> or <code>/services</code>). This improves social link sharing, bookmarking, and search engine indexability.
              </PolarisTipCard>
            </div>
          }
        >
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <PolarisInfoBanner
              title="Publishing Workflow"
              description="Create the page container first, then use the visual page builder studio to drag and drop interactive modules, banners, and layout grids."
            />

            {/* Step 1: Page Details */}
            <PolarisFormCard
              step={1}
              title="Page Identity & Path"
              description="Enter the public title and URL slug path for this page."
              badge="Core Setup"
            >
              <div className="space-y-5">
                {/* Page Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Page Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. Services, About Us, Core Features"
                    value={formik.values.name}
                    onChange={handleNameChange}
                    onBlur={formik.handleBlur}
                    className="h-11 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-sm font-medium shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-[11px] font-medium text-rose-500 mt-1">
                      {formik.errors.name as string}
                    </p>
                  )}
                </div>

                {/* Slug Path */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="slug"
                    className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    URL Slug Path <span className="text-rose-500">*</span>
                  </Label>
                  <div className="flex items-center gap-0">
                    <div className="h-11 px-4 flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-l-lg border border-r-0 border-zinc-200 dark:border-zinc-700 text-zinc-500 font-mono text-sm font-semibold">
                      /
                    </div>
                    <Input
                      id="slug"
                      placeholder="services"
                      value={formik.values.slug}
                      className="h-11 text-sm font-mono rounded-l-none bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                      onChange={(e) => {
                        const val = e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-");
                        formik.setFieldValue("slug", val);
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.slug && formik.errors.slug && (
                    <p className="text-[11px] font-medium text-rose-500 mt-1">
                      {formik.errors.slug as string}
                    </p>
                  )}
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Defines the URL path visitors will use to reach this page (e.g. <code>thrico.community/{currentSlug}</code>).
                  </p>
                </div>
              </div>
            </PolarisFormCard>
          </form>
        </PolarisFormLayout>
      </div>

      <FloatingSavePanel
        hasChanged={formik.dirty && formik.values.name.length > 0}
        saved={saved}
        isSaving={isCreating}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        title="Unsaved Page"
        description="Ready to create this website page?"
        buttonText="Create Page"
      />
    </div>
  );
}
