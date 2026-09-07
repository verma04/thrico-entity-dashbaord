"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Globe,
  Layout,
  Layers,
  Share2,
  PanelBottom,
  Smartphone,
  Laptop,
  Mail,
  Building2,
  Columns3,
  Rows,
  AlignCenter,
  Sparkles,
  ShieldCheck,
  Phone,
  MapPin,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/hooks/use-toast";
import { useUpdateFooter, useGetWebsite } from "@/graphql/actions/website";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

import {
  useWebsiteBuilderStore,
  LayoutType,
} from "@/store/useWebsiteBuilderStore";
import { LivePreviewFooter } from "@/components/website-layout/preview/live-preview-footer";
import { SocialLinksEditor } from "@/components/website-layout/settings/social-links-editor";
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

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface MenuItem {
  id: string;
  label: string;
  link?: string;
  icon?: string;
  children?: MenuItem[];
}

interface FooterConfig {
  layout: LayoutType;
  logoText: string;
  logoType: "text" | "image";
  logoImage?: string;
  description: string;
  socialLinks: SocialLink[];
  menuItems: MenuItem[];
  copyrightText: string;
  // Newsletter layout
  newsletterTitle?: string;
  newsletterDescription?: string;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;
  newsletterDisclaimer?: string;
  // Corporate layout
  companyName?: string;
  address?: string;
  email?: string;
  phone?: string;
  registrationNumber?: string;
  // Columns layout
  showNewsletterSnippet?: boolean;
  // Minimal layout
  showStatusIndicator?: boolean;
  statusText?: string;
  // Simple layout
  badgeText?: string;
}

// ------------------------------------------------
// VALIDATION SCHEMA
// ------------------------------------------------

const footerSchema = Yup.object().shape({
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
  description: Yup.string(),
  socialLinks: Yup.array().of(
    Yup.object().shape(
      {
        id: Yup.string().required(),
        platform: Yup.string().when("url", {
          is: (url: string) => url && url.length > 0,
          then: (schema: any) => schema.required("Platform is required"),
          otherwise: (schema: any) => schema.notRequired(),
        }),
        url: Yup.string().when("platform", {
          is: (platform: string) => platform && platform.length > 0,
          then: (schema: any) =>
            schema.url("Must be a valid URL").required("URL is required"),
          otherwise: (schema: any) =>
            schema.url("Must be a valid URL").notRequired(),
        }),
      },
      [["platform", "url"]],
    ),
  ),
  copyrightText: Yup.string(),
});

// ------------------------------------------------
// COMPONENT
// ------------------------------------------------

export default function FooterManager() {
  const { toast } = useToast();
  const { globalFooter, updateModuleContent, updateModuleLayout } =
    useWebsiteBuilderStore();
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("desktop");
  const [saved, setSaved] = useState(false);

  // Fetch website data
  const { data: websiteData, refetch } = useGetWebsite({});

  // Update footer mutation
  const [updateFooterMutation, { loading: isUpdating }] = useUpdateFooter({
    onCompleted: () => {
      toast({
        title: "Footer Saved",
        description: "Global footer has been updated successfully.",
      });
      setSaved(true);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update footer",
        variant: "destructive",
      });
    },
  });

  const formik = useFormik<FooterConfig>({
    initialValues: {
      layout: globalFooter.layout,
      logoText: globalFooter.content?.logoText || "Brand",
      logoType: globalFooter.content?.logoType || "text",
      logoImage: globalFooter.content?.logoImage || "",
      description: globalFooter.content?.description || "",
      socialLinks: globalFooter.content?.socialLinks || [],
      menuItems: globalFooter.content?.menuItems || [],
      copyrightText:
        globalFooter.content?.copyrightText ||
        `© ${new Date().getFullYear()} All rights reserved.`,
      newsletterTitle:
        globalFooter.content?.newsletterTitle ||
        "Stay in the loop with our newsletter",
      newsletterDescription:
        globalFooter.content?.newsletterDescription ||
        "Get our weekly product updates, design insights, and community highlights delivered directly to your inbox.",
      newsletterPlaceholder:
        globalFooter.content?.newsletterPlaceholder ||
        "Enter your email address...",
      newsletterButtonText:
        globalFooter.content?.newsletterButtonText || "Subscribe",
      newsletterDisclaimer:
        globalFooter.content?.newsletterDisclaimer ||
        "We respect your privacy. No spam ever. Unsubscribe at any time.",
      companyName: globalFooter.content?.companyName || "",
      address: globalFooter.content?.address || "",
      email: globalFooter.content?.email || "",
      phone: globalFooter.content?.phone || "",
      registrationNumber: globalFooter.content?.registrationNumber || "",
      showNewsletterSnippet:
        globalFooter.content?.showNewsletterSnippet ?? false,
      showStatusIndicator:
        globalFooter.content?.showStatusIndicator ?? true,
      statusText:
        globalFooter.content?.statusText || "All systems operational",
      badgeText: globalFooter.content?.badgeText || "",
    },
    validationSchema: footerSchema,
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
        const validSocialLinks = values.socialLinks.filter(
          (link) => link.platform || link.url,
        );

        const contentPayload = {
          logoText: values.logoText,
          logoType: values.logoType,
          logoImage: values.logoImage,
          description: values.description,
          socialLinks: validSocialLinks,
          menuItems: values.menuItems,
          copyrightText: values.copyrightText,
          newsletterTitle: values.newsletterTitle,
          newsletterDescription: values.newsletterDescription,
          newsletterPlaceholder: values.newsletterPlaceholder,
          newsletterButtonText: values.newsletterButtonText,
          newsletterDisclaimer: values.newsletterDisclaimer,
          companyName: values.companyName,
          address: values.address,
          email: values.email,
          phone: values.phone,
          registrationNumber: values.registrationNumber,
          showNewsletterSnippet: values.showNewsletterSnippet,
          showStatusIndicator: values.showStatusIndicator,
          statusText: values.statusText,
          badgeText: values.badgeText,
        };

        await updateFooterMutation({
          variables: {
            websiteId: websiteData.getWebsite.id,
            layout: values.layout,
            content: contentPayload,
          },
        });

        updateModuleLayout(globalFooter.id, values.layout);
        updateModuleContent(globalFooter.id, contentPayload);
      } catch (error) {
        console.error("Footer update failed:", error);
      }
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-black/10 overflow-hidden relative">
      {/* Centered Top Header with max-w-[1040px] Breathing Space */}
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 md:px-8 py-3">
          <EcosystemHeader
            title="Footer Settings"
            description="Configure your website's global footer layout, copyright, links, and social channels."
            icon={PanelBottom}
            badgeText="Website Builder"
            breadcrumbs={[
              { label: "Website Builder", href: "/app-layout" },
              { label: "General Settings", href: "/app-layout/settings" },
              { label: "Global Footer" },
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
                title="Live Footer Preview"
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

                  {/* Device Canvas Frame */}
                  <div
                    className={cn(
                      "relative mx-auto transition-all duration-300 overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm rounded-xl",
                      previewDevice === "mobile"
                        ? "w-full max-w-[280px] h-[380px]"
                        : "w-full aspect-[4/3]",
                    )}
                  >
                    <div className="absolute inset-0 overflow-y-auto no-scrollbar">
                      <div className="bg-zinc-50/50 dark:bg-zinc-900/30 min-h-full flex flex-col justify-end">
                        <div className="p-4 space-y-3">
                          <div className="h-4 w-1/3 bg-zinc-200/60 dark:bg-zinc-800 rounded animate-pulse" />
                          <div className="grid grid-cols-2 gap-2">
                            <div className="h-14 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl animate-pulse" />
                            <div className="h-14 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl animate-pulse" />
                          </div>
                        </div>

                        <LivePreviewFooter
                          content={formik.values}
                          layout={formik.values.layout}
                          previewDevice={previewDevice}
                        />
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
                      label="Social Profiles"
                      value={`${formik.values.socialLinks?.length || 0} channels`}
                      isLast
                    />
                  </div>
                </div>
              </PolarisSidebarCard>

              {/* Strategic Tip */}
              <PolarisTipCard title="Footer Design Best Practice">
                Your footer is the ultimate trust signal for members and search bots. Ensure essential legal pages (Privacy Policy, Terms of Service) and current copyright statements are linked clearly.
              </PolarisTipCard>
            </div>
          }
        >
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <PolarisInfoBanner
              title="Global Footer Architecture"
              description="Your footer appears on the bottom of every page across your domain. Keep copyright, brand messaging, and external links aligned with your brand voice."
            />

            {/* Step 1: Identity & Base */}
            <PolarisFormCard
              step={1}
              title="Identity & Base Layout"
              description="Configure footer layout structure, brand voice, and copyright attribution."
              badge="Foundations"
              icon={Layout}
            >
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="layout"
                    className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Footer Layout Style
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
                      <SelectItem value="columns">
                        Multi-Column (Detailed Grid)
                      </SelectItem>
                      <SelectItem value="simple">Simple (Inline)</SelectItem>
                      <SelectItem value="minimal">Minimal (Clean Stack)</SelectItem>
                      <SelectItem value="corporate">Corporate (Heavy Base)</SelectItem>
                      <SelectItem value="newsletter">
                        Newsletter (Lead Capture Centric)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
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
                        <SelectItem value="text">Text Wordmark</SelectItem>
                        <SelectItem value="image">Image Asset</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="logoText"
                      className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Brand Name
                    </Label>
                    <Input
                      id="logoText"
                      placeholder="My Brand"
                      {...formik.getFieldProps("logoText")}
                      disabled={formik.values.logoType === "image"}
                      className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-medium shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                    />
                  </div>
                </div>

                {formik.values.logoType === "image" && (
                  <div className="bg-zinc-50 dark:bg-zinc-900/40 p-5 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                    <ImageUploadWithCrop
                      label="Upload Footer Logo"
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
                )}

                <div className="space-y-1.5">
                  <Label
                    htmlFor="description"
                    className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Brand Statement / Mission Bio
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="A brief 1-2 sentence description summarizing your community or brand mission..."
                    rows={3}
                    className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs resize-none shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                    {...formik.getFieldProps("description")}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="copyrightText"
                    className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Copyright Attribution
                  </Label>
                  <Input
                    id="copyrightText"
                    placeholder={`© ${new Date().getFullYear()} All rights reserved.`}
                    {...formik.getFieldProps("copyrightText")}
                    className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-medium shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                  />
                </div>
              </div>
            </PolarisFormCard>

            {/* Step 2: Layout-Specific Configuration */}
            {formik.values.layout === "newsletter" && (
              <PolarisFormCard
                step={2}
                title="Newsletter Lead Capture Settings"
                description="Customize the lead magnet headline, description, email placeholder, and privacy reassurance."
                badge="Newsletter Layout"
                icon={Mail}
              >
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="newsletterTitle"
                      className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Newsletter Headline
                    </Label>
                    <Input
                      id="newsletterTitle"
                      placeholder="Stay in the loop with our newsletter"
                      {...formik.getFieldProps("newsletterTitle")}
                      className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-medium shadow-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="newsletterDescription"
                      className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Supporting Subtitle
                    </Label>
                    <Textarea
                      id="newsletterDescription"
                      placeholder="Get our weekly product updates, design insights, and community highlights..."
                      rows={2}
                      {...formik.getFieldProps("newsletterDescription")}
                      className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs resize-none shadow-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="newsletterPlaceholder"
                        className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                      >
                        Email Field Placeholder
                      </Label>
                      <Input
                        id="newsletterPlaceholder"
                        placeholder="Enter your email address..."
                        {...formik.getFieldProps("newsletterPlaceholder")}
                        className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-medium shadow-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="newsletterButtonText"
                        className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                      >
                        Button Label
                      </Label>
                      <Input
                        id="newsletterButtonText"
                        placeholder="Subscribe"
                        {...formik.getFieldProps("newsletterButtonText")}
                        className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-medium shadow-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="newsletterDisclaimer"
                      className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Trust & Privacy Disclaimer
                    </Label>
                    <Input
                      id="newsletterDisclaimer"
                      placeholder="We respect your privacy. No spam ever. Unsubscribe at any time."
                      {...formik.getFieldProps("newsletterDisclaimer")}
                      className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-medium shadow-none"
                    />
                  </div>
                </div>
              </PolarisFormCard>
            )}

            {formik.values.layout === "corporate" && (
              <PolarisFormCard
                step={2}
                title="Corporate & Enterprise Information"
                description="Display official business details, physical headquarters address, contact channels, and regulatory badges."
                badge="Corporate Layout"
                icon={Building2}
              >
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="companyName"
                      className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Registered Entity Name
                    </Label>
                    <Input
                      id="companyName"
                      placeholder="Acme Global Technologies Inc."
                      {...formik.getFieldProps("companyName")}
                      className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-medium shadow-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="address"
                      className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Headquarters / Physical Address
                    </Label>
                    <Input
                      id="address"
                      placeholder="100 Innovation Way, Suite 400, San Francisco, CA 94105"
                      {...formik.getFieldProps("address")}
                      className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-medium shadow-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="email"
                        className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                      >
                        Corporate / Inquiries Email
                      </Label>
                      <Input
                        id="email"
                        placeholder="contact@company.com"
                        {...formik.getFieldProps("email")}
                        className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-medium shadow-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="phone"
                        className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                      >
                        Support / Direct Phone
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+1 (800) 555-0199"
                        {...formik.getFieldProps("phone")}
                        className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-medium shadow-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="registrationNumber"
                      className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Registration, Tax ID or Security Certification
                    </Label>
                    <Input
                      id="registrationNumber"
                      placeholder="Reg. No. 8923-4410 • ISO 27001 Certified • SOC2 Type II"
                      {...formik.getFieldProps("registrationNumber")}
                      className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-medium shadow-none"
                    />
                  </div>
                </div>
              </PolarisFormCard>
            )}

            {formik.values.layout === "columns" && (
              <PolarisFormCard
                step={2}
                title="Multi-Column Layout Options"
                description="Fine-tune multi-column directory features and brand column highlights."
                badge="Columns Layout"
                icon={Columns3}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="showNewsletterSnippet"
                        className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer"
                      >
                        Brand Column Newsletter Box
                      </Label>
                      <p className="text-[11px] text-zinc-500">
                        Include a compact email subscription input directly underneath the brand statement.
                      </p>
                    </div>
                    <Switch
                      id="showNewsletterSnippet"
                      checked={formik.values.showNewsletterSnippet}
                      onCheckedChange={(val) =>
                        formik.setFieldValue("showNewsletterSnippet", val)
                      }
                    />
                  </div>
                </div>
              </PolarisFormCard>
            )}

            {formik.values.layout === "minimal" && (
              <PolarisFormCard
                step={2}
                title="Minimal Bar Options"
                description="Configure single-bar status indicator and clean horizontal alignment."
                badge="Minimal Layout"
                icon={Rows}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="showStatusIndicator"
                        className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer"
                      >
                        Live System Status Badge
                      </Label>
                      <p className="text-[11px] text-zinc-500">
                        Display a pulsing green indicator to signal live system health or platform version.
                      </p>
                    </div>
                    <Switch
                      id="showStatusIndicator"
                      checked={formik.values.showStatusIndicator}
                      onCheckedChange={(val) =>
                        formik.setFieldValue("showStatusIndicator", val)
                      }
                    />
                  </div>

                  {formik.values.showStatusIndicator && (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="statusText"
                        className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                      >
                        Status Label
                      </Label>
                      <Input
                        id="statusText"
                        placeholder="All systems operational"
                        {...formik.getFieldProps("statusText")}
                        className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-medium shadow-none"
                      />
                    </div>
                  )}
                </div>
              </PolarisFormCard>
            )}

            {formik.values.layout === "simple" && (
              <PolarisFormCard
                step={2}
                title="Centered Simple Options"
                description="Customize centered branding badges and community trust labels."
                badge="Simple Layout"
                icon={AlignCenter}
              >
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="badgeText"
                      className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Top Badge Pill (Optional)
                    </Label>
                    <Input
                      id="badgeText"
                      placeholder="e.g., ✦ Official Community Hub"
                      {...formik.getFieldProps("badgeText")}
                      className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-medium shadow-none"
                    />
                  </div>
                </div>
              </PolarisFormCard>
            )}

            {/* Step 3: Information Grid & Menu */}
            <PolarisFormCard
              step={3}
              title="Footer Links & Columns"
              description="Organize navigation menus, legal links, and multi-column categories."
              badge="Navigation"
              icon={Layers}
            >
              <MenuEditor
                menuItems={formik.values.menuItems}
                onChange={(items) => formik.setFieldValue("menuItems", items)}
              />
            </PolarisFormCard>

            {/* Step 4: Social Bridges */}
            <PolarisFormCard
              step={4}
              title="Social Media Profiles"
              description="Connect official social accounts (X, Instagram, LinkedIn, YouTube, Discord)."
              badge="Bridges"
              icon={Share2}
            >
              <SocialLinksEditor
                links={formik.values.socialLinks}
                onChange={(links) =>
                  formik.setFieldValue("socialLinks", links)
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
        title="Unsaved Footer Changes"
        description="You have modified footer branding, links, or social accounts."
        buttonText="Save Footer"
      />
    </div>
  );
}
