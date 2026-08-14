"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Globe,
  Layout,
  Layers,
  Smartphone,
  Laptop,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/hooks/use-toast";
import { useUpdateNavbar, useGetWebsite } from "@/graphql/actions/website";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

import {
  useWebsiteBuilderStore,
  LayoutType,
} from "@/store/useWebsiteBuilderStore";
import { LivePreviewNavbar } from "@/components/website-layout/preview/live-preview-navbar";
import { MenuEditor } from "@/components/website-layout/settings/menu-editor";

import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { cn } from "@/lib/utils";
import { EcosystemHeader } from "@/components/layout/ecosystem";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInfoBanner,
} from "@/components/gamification/shared/polaris-form-ui";

// ------------------------------------------------
// TYPES
// ------------------------------------------------

interface NavigationItem {
  id: string;
  label: string;
  link?: string;
  icon?: string;
  children?: NavigationItem[];
}

interface NavigationConfig {
  layout: LayoutType;
  logoText: string;
  logoType: "text" | "image";
  logoImage?: string;
  menuItems: NavigationItem[];
}

// ------------------------------------------------
// VALIDATION SCHEMA
// ------------------------------------------------

const navigationSchema = Yup.object().shape({
  layout: Yup.string().required("Layout is required"),
  logoText: Yup.string()
    .required("Logo text is required")
    .min(1, "Logo text must be at least 1 character"),
  logoType: Yup.string().oneOf(["text", "image"]).required(),
  logoImage: Yup.string().when("logoType", {
    is: "image",
    then: (schema) =>
      schema.required("Logo image is required when using image logo"),
    otherwise: (schema) => schema.notRequired(),
  }),
  menuItems: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required(),
      label: Yup.string().required("Label is required"),
      link: Yup.string(),
      icon: Yup.string(),
      children: Yup.array(),
    }),
  ),
});

// ------------------------------------------------
// COMPONENT
// ------------------------------------------------

export default function NavigationManager() {
  const { toast } = useToast();
  const { globalHeader, updateModuleContent, updateModuleLayout } =
    useWebsiteBuilderStore();
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("desktop");
  const [saved, setSaved] = useState(false);

  // Fetch website data
  const {
    data: websiteData,
    refetch,
  } = useGetWebsite({});

  // Update navbar mutation
  const [updateNavbarMutation, { loading: isUpdating }] = useUpdateNavbar({
    onCompleted: () => {
      toast({
        title: "Navigation Saved",
        description: "Global navigation has been updated.",
      });
      setSaved(true);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update navigation",
        variant: "destructive",
      });
    },
  });

  const formik = useFormik<NavigationConfig>({
    initialValues: {
      layout: globalHeader.layout,
      logoText: globalHeader.content?.logoText || "Brand",
      logoType: globalHeader.content?.logoType || "text",
      logoImage: globalHeader.content?.logoImage || "",
      menuItems: globalHeader.content?.menuItems || [],
    },
    validationSchema: navigationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!websiteData?.getWebsite?.id) {
        toast({
          title: "Error",
          description: "Website not found",
          variant: "destructive",
        });
        return;
      }

      try {
        await updateNavbarMutation({
          variables: {
            websiteId: websiteData.getWebsite.id,
            layout: values.layout,
            content: {
              logoText: values.logoText,
              logoType: values.logoType,
              logoImage: values.logoImage,
              menuItems: values.menuItems,
            },
          },
        });

        updateModuleLayout(globalHeader.id, values.layout);
        updateModuleContent(globalHeader.id, {
          logoText: values.logoText,
          logoType: values.logoType,
          logoImage: values.logoImage,
          menuItems: values.menuItems,
        });
      } catch (error) {
        console.error("Navbar update failed:", error);
      }
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-black/10 overflow-hidden relative">
      {/* Top Header with max-w-[1040px] Centered Breathing Space */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 md:px-8 py-3">
          <EcosystemHeader
            title="Navigation Settings"
            description="Configure your website's global navigation layout, branding, and menu hierarchy."
            icon={Globe}
            badgeText="Website Builder"
            breadcrumbs={[
              { label: "Website Builder", href: "/app-layout" },
              { label: "General Settings", href: "/app-layout/settings" },
              { label: "Global Navigation" },
            ]}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PolarisFormLayout
          sidebar={
            <div className="space-y-6">
              {/* Live Preview Sidebar Card */}
              <PolarisSidebarCard
                title="Live Header Preview"
                badge={previewDevice === "desktop" ? "Desktop View" : "Mobile View"}
                icon={Layout}
              >
                <div className="space-y-3">
                  {/* Device Switcher Pills */}
                  <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("desktop")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all",
                        previewDevice === "desktop"
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                          : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
                      )}
                    >
                      <Laptop className="h-3.5 w-3.5" />
                      Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("mobile")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all",
                        previewDevice === "mobile"
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                          : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
                      )}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      Mobile
                    </button>
                  </div>

                  {/* Canvas Device Frame */}
                  <div
                    className={cn(
                      "relative mx-auto transition-all duration-300 overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm rounded-xl",
                      previewDevice === "mobile"
                        ? "w-full max-w-[280px] h-[380px]"
                        : "w-full aspect-[4/3]",
                    )}
                  >
                    <div className="absolute inset-0 overflow-y-auto no-scrollbar">
                      <div className="bg-zinc-50/50 dark:bg-zinc-900/30 min-h-full flex flex-col">
                        <LivePreviewNavbar
                          content={{
                            logoText: formik.values.logoText,
                            logoType: formik.values.logoType,
                            logoImage: formik.values.logoImage,
                            menuItems: formik.values.menuItems,
                          }}
                          layout={formik.values.layout}
                          previewDevice={previewDevice}
                        />
                        <div className="p-4 space-y-3 flex-1">
                          <div className="h-4 w-1/3 bg-zinc-200/60 dark:bg-zinc-800 rounded animate-pulse" />
                          <div className="grid grid-cols-2 gap-2">
                            <div className="h-16 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl animate-pulse" />
                            <div className="h-16 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl animate-pulse" />
                          </div>
                          <div className="h-24 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Rows */}
                  <div className="space-y-1.5 pt-2">
                    <PolarisSummaryRow
                      label="Layout Style"
                      value={formik.values.layout}
                    />
                    <PolarisSummaryRow
                      label="Menu Links"
                      value={`${formik.values.menuItems?.length || 0} top items`}
                      isLast
                    />
                  </div>
                </div>
              </PolarisSidebarCard>

              {/* Strategic Tip */}
              <PolarisTipCard title="Navigation Best Practice">
                Keep primary navigation focused to 5-7 top-level links. Use dropdown menus for secondary pages to reduce decision fatigue for visitors.
              </PolarisTipCard>
            </div>
          }
        >
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <PolarisInfoBanner
              title="Global Navbar Scope"
              description="Changes made to the global navigation apply to all pages across your website automatically."
            />

            {/* Step 1: Identity & Layout */}
            <PolarisFormCard
              step={1}
              title="Brand Identity & Layout"
              description="Configure how your brand logo and header alignment appear to visitors."
              badge="Branding"
              icon={Layout}
            >
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Layout Selector */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="layout"
                      className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Navigation Layout
                    </Label>
                    <Select
                      value={formik.values.layout}
                      onValueChange={(value) =>
                        formik.setFieldValue("layout", value)
                      }
                    >
                      <SelectTrigger
                        id="layout"
                        className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                      >
                        <SelectValue placeholder="Select a layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">
                          Simple (Right Aligned Links)
                        </SelectItem>
                        <SelectItem value="centered">
                          Centered Logo
                        </SelectItem>
                        <SelectItem value="minimal">
                          Minimal (Hamburger Menu)
                        </SelectItem>
                        <SelectItem value="stacked">
                          Stacked (Two Rows)
                        </SelectItem>
                        <SelectItem value="split">Split Navigation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Logo Preference */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="logoType"
                      className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Logo Display Type
                    </Label>
                    <Select
                      value={formik.values.logoType}
                      onValueChange={(value) =>
                        formik.setFieldValue("logoType", value)
                      }
                    >
                      <SelectTrigger
                        id="logoType"
                        className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                      >
                        <SelectValue placeholder="Select logo type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text / Wordmark</SelectItem>
                        <SelectItem value="image">Image / Graphic Logo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Logo Value input */}
                <div className="pt-1">
                  {formik.values.logoType === "image" ? (
                    <div className="space-y-2 bg-zinc-50 dark:bg-zinc-900/40 p-5 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                      <ImageUploadWithCrop
                        label="Upload Brand Logo"
                        currentImage={formik.values.logoImage}
                        onImageUpdate={(imageUrl: string) =>
                          formik.setFieldValue("logoImage", imageUrl)
                        }
                        recommendedWidth={150}
                        recommendedHeight={50}
                        aspectRatio={3}
                        showDimensions
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="logoText"
                        className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                      >
                        Brand Name / Text
                      </Label>
                      <Input
                        id="logoText"
                        placeholder="e.g. Acme Community"
                        {...formik.getFieldProps("logoText")}
                        className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-medium shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                      />
                    </div>
                  )}
                </div>
              </div>
            </PolarisFormCard>

            {/* Step 2: Menu Structure */}
            <PolarisFormCard
              step={2}
              title="Menu Items & Hierarchy"
              description="Add, arrange, and nest links to build your header navigation menu."
              badge="Structure"
              icon={Layers}
            >
              <MenuEditor
                menuItems={formik.values.menuItems}
                onChange={(items) =>
                  formik.setFieldValue("menuItems", items)
                }
              />
            </PolarisFormCard>
          </form>
        </PolarisFormLayout>
      </div>

      <FloatingSavePanel
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        isSaving={isUpdating}
        hasChanged={formik.dirty}
        saved={saved}
        title="Unsaved Navigation"
        description="You have modified the navigation configuration."
        buttonText="Save Navigation"
      />
    </div>
  );
}
