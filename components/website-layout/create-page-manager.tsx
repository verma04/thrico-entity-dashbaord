"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Layout, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useToast } from "@/hooks/use-toast";
import { useCreatePage, useGetWebsite } from "@/graphql/actions/website";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
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
    <EcosystemWrapper>
      <EcosystemHeader
        title="Create Page"
        description="Configure the title, URL slug, and routing for your website page."
        icon={Layout}
        badgeText="Website Studio"
        breadcrumbs={[
          { label: "Website Studio", href: "/app-layout" },
          { label: "Website Pages", href: "/app-layout" },
          { label: "Create Page" },
        ]}
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <PolarisFormLayout
          sidebar={
            <div className="space-y-4">
              {/* Browser Preview Sidebar Card */}
              <PolarisSidebarCard
                title="Page Preview"
                badge="Draft Page"
                icon={Globe}
              >
                <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs overflow-hidden flex flex-col">
                  {/* Browser Address Bar */}
                  <div className="h-9 border-b border-[#d2d5d9] dark:border-zinc-800 flex items-center px-3 bg-[#f6f6f7] dark:bg-zinc-900/80 gap-2">
                    <div className="flex gap-1.5 shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#d2d5d9] dark:bg-zinc-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#d2d5d9] dark:bg-zinc-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#d2d5d9] dark:bg-zinc-700" />
                    </div>
                    <div className="flex-1 mx-1 bg-white dark:bg-zinc-950 border border-[#d2d5d9] dark:border-zinc-800 rounded-[4px] h-6 flex items-center px-2 justify-center overflow-hidden">
                      <span className="text-[10px] text-[#616161] font-mono flex items-center gap-1 truncate">
                        <Globe className="h-3 w-3 shrink-0 text-[#8c9196]" />
                        thrico.community/{currentSlug}
                      </span>
                    </div>
                  </div>

                  {/* Browser Canvas */}
                  <div className="p-5 flex flex-col items-center justify-center text-center space-y-2.5">
                    <div className="w-12 h-12 rounded-[8px] bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 flex items-center justify-center border border-[#d2d5d9] dark:border-zinc-700">
                      <Layout className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-semibold text-[#303030] dark:text-zinc-100">
                        {currentPageName}
                      </h4>
                      <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 mt-0.5 max-w-[180px] mx-auto leading-[15px]">
                        After saving, you can customize sections and design
                        blocks.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary Metadata */}
                <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                  <PolarisSummaryRow
                    label="Access URL"
                    value={`/${currentSlug}`}
                  />
                  <PolarisSummaryRow
                    label="Page Status"
                    value="Unpublished Draft"
                    isLast
                  />
                </div>
              </PolarisSidebarCard>

              {/* Strategic Tip */}
              <PolarisTipCard title="URL & SEO Best Practice">
                Keep path slugs clean and concise (e.g. <code>/about</code> or{" "}
                <code>/services</code>). This improves social link sharing,
                bookmarking, and search engine indexability.
              </PolarisTipCard>
            </div>
          }
        >
          <form onSubmit={formik.handleSubmit} className="space-y-4">
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
              <div className="space-y-3">
                {/* Page Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                  >
                    Page Name <span className="text-[#d72c0d] ml-0.5">*</span>
                  </label>
                  <Input
                    id="name"
                    placeholder="e.g. Services, About Us, Core Features"
                    value={formik.values.name}
                    onChange={handleNameChange}
                    onBlur={formik.handleBlur}
                    className="h-[40px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] text-[#303030] dark:text-zinc-100 rounded-[8px]"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-[12.5px] font-normal text-[#d72c0d] leading-[18px]">
                      {formik.errors.name as string}
                    </p>
                  )}
                </div>

                {/* Slug Path */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="slug"
                    className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                  >
                    URL Slug Path{" "}
                    <span className="text-[#d72c0d] ml-0.5">*</span>
                  </label>
                  <div className="flex items-center gap-0">
                    <div className="h-[40px] px-3.5 flex items-center bg-[#f6f6f7] dark:bg-zinc-800 rounded-l-[8px] border border-r-0 border-[#aeb4b9] dark:border-zinc-700 text-[#616161] font-mono text-[14px] font-semibold select-none">
                      /
                    </div>
                    <Input
                      id="slug"
                      placeholder="services"
                      value={formik.values.slug}
                      className="h-[40px] text-[14px] font-mono rounded-l-none rounded-r-[8px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100"
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
                    <p className="text-[12.5px] font-normal text-[#d72c0d] leading-[18px]">
                      {formik.errors.slug as string}
                    </p>
                  )}
                  <p className="text-[11.5px] text-[#616161]">
                    Defines the URL path visitors will use to reach this page
                    (e.g. <code>thrico.community/{currentSlug}</code>).
                  </p>
                </div>
              </div>
            </PolarisFormCard>
          </form>
        </PolarisFormLayout>
      </EcosystemContainer>

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
    </EcosystemWrapper>
  );
}
