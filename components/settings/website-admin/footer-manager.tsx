"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Globe,
  Layout,
  Layers,
  Share2,
  PanelBottom,
  ChevronRight,
  Info,
  Smartphone,
  Laptop,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EcosystemWrapper, EcosystemHeader, EcosystemContainer } from "@/components/layout/ecosystem";

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
  const [previewDevice, setPreviewDevice] = React.useState<"mobile" | "desktop">("desktop");
  const [saved, setSaved] = React.useState(false);

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

        await updateFooterMutation({
          variables: {
            websiteId: websiteData.getWebsite.id,
            layout: values.layout,
            content: {
              logoText: values.logoText,
              logoType: values.logoType,
              logoImage: values.logoImage,
              description: values.description,
              socialLinks: validSocialLinks,
              menuItems: values.menuItems,
              copyrightText: values.copyrightText,
            },
          },
        });

        updateModuleLayout(globalFooter.id, values.layout);
        updateModuleContent(globalFooter.id, {
          logoText: values.logoText,
          logoType: values.logoType,
          logoImage: values.logoImage,
          description: values.description,
          socialLinks: validSocialLinks,
          menuItems: values.menuItems,
          copyrightText: values.copyrightText,
        });
      } catch (error) {
        console.error("Footer update failed:", error);
      }
    },
  });

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Footer Settings"
        description="Configure your website's global footer layout and structure."
        icon={PanelBottom}
        badgeText="Website Builder"
        breadcrumbs={[
          { label: "Website Builder" },
          { label: "General Settings" },
          { label: "Global Footer" }
        ]}
      />

      <EcosystemContainer>
        <div className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-8 space-y-8">
              <form onSubmit={formik.handleSubmit} className="space-y-8">
                {/* Architecture & Branding Section */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Layout className="h-4 w-4 text-indigo-600" />
                      <CardTitle className="text-xl">
                        Identity & Base
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Configure the foundational branding and layout of your footer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-8">
                    <div className="space-y-2">
                      <Label
                        htmlFor="layout"
                        className="text-sm font-medium"
                      >
                        Footer Layout
                      </Label>
                      <Select
                        value={formik.values.layout}
                        onValueChange={(value) =>
                          formik.setFieldValue("layout", value)
                        }
                      >
                        <SelectTrigger
                          id="layout"
                          className="bg-background"
                        >
                          <SelectValue placeholder="Select a layout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="columns">
                            Multi-Column
                          </SelectItem>
                          <SelectItem value="simple">Simple</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="corporate">Corporate</SelectItem>
                          <SelectItem value="newsletter">
                            Newsletter
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="logoType"
                          className="text-sm font-medium"
                        >
                          Logo Preference
                        </Label>
                        <Select
                          value={formik.values.logoType}
                          onValueChange={(value) =>
                            formik.setFieldValue("logoType", value)
                          }
                        >
                          <SelectTrigger
                            id="logoType"
                            className="bg-background"
                          >
                            <SelectValue placeholder="Select logo type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text Logo</SelectItem>
                            <SelectItem value="image">Image Logo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="logoText"
                          className="text-sm font-medium"
                        >
                          Brand Name
                        </Label>
                        <Input
                          id="logoText"
                          placeholder="My Brand"
                          {...formik.getFieldProps("logoText")}
                          disabled={formik.values.logoType === "image"}
                        />
                      </div>
                    </div>

                    {formik.values.logoType === "image" && (
                      <div className="space-y-2 bg-muted/20 p-6 rounded-2xl border border-dashed">
                        <ImageUploadWithCrop
                          label="Logo Image Asset"
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

                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Brand Statement
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="A brief description about your company..."
                        rows={3}
                        className="bg-background resize-none"
                        {...formik.getFieldProps("description")}
                      />
                    </div>

                    <div className="space-y-2">
                       <Label
                        htmlFor="copyrightText"
                        className="text-sm font-medium"
                      >
                        Copyright Attribution
                      </Label>
                      <Input
                        id="copyrightText"
                        placeholder="© 2025 All rights reserved."
                        {...formik.getFieldProps("copyrightText")}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Menu Structure Section */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Layers className="h-4 w-4 text-indigo-600" />
                      <CardTitle className="text-xl">
                        Information Grid
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Organize your navigation links and menus.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <MenuEditor
                      menuItems={formik.values.menuItems}
                      onChange={(items) => formik.setFieldValue("menuItems", items)}
                    />
                  </CardContent>
                </Card>

                {/* Social Bridges Section */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden mb-12">
                  <CardHeader className="bg-muted/30 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Share2 className="h-4 w-4 text-indigo-600" />
                      <CardTitle className="text-xl">
                        Social Presence
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Link your external platform profiles and digital bridges.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <SocialLinksEditor
                      links={formik.values.socialLinks}
                      onChange={(links) =>
                        formik.setFieldValue("socialLinks", links)
                      }
                    />
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Sidebar / Preview Section */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Live Preview</h3>
                  <div className="flex items-center p-1 bg-muted rounded-lg border">
                    <button
                      onClick={() => setPreviewDevice("desktop")}
                      className={cn(
                        "p-1.5 rounded-md transition-all",
                        previewDevice === "desktop" ? "bg-background shadow-sm text-indigo-600" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Laptop className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice("mobile")}
                      className={cn(
                        "p-1.5 rounded-md transition-all",
                        previewDevice === "mobile" ? "bg-background shadow-sm text-indigo-600" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Smartphone className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Device Frame */}
                <div className={cn(
                  "relative mx-auto transition-all duration-500 overflow-hidden border bg-background shadow-xl rounded-2xl",
                  previewDevice === "mobile" ? "w-[320px] h-[580px]" : "w-full aspect-video"
                )}>
                  <div className="absolute inset-0 overflow-y-auto">
                    <div className="bg-muted/50 min-h-full flex flex-col">
                      <div className="flex-1 p-8 space-y-6">
                        <div className="h-8 w-1/3 bg-muted rounded-lg animate-pulse" />
                        <div className="h-64 bg-muted rounded-3xl animate-pulse" />
                      </div>
                      <LivePreviewFooter
                        content={{
                          logoText: formik.values.logoText,
                          logoType: formik.values.logoType,
                          logoImage: formik.values.logoImage,
                          description: formik.values.description,
                          socialLinks: formik.values.socialLinks,
                          menuItems: formik.values.menuItems,
                          copyrightText: formik.values.copyrightText,
                        }}
                        layout={formik.values.layout}
                      />
                    </div>
                  </div>
                </div>

                <Card className="border-none shadow-sm ring-1 ring-border/50">
                  <CardHeader className="pb-3 border-b bg-muted/20">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                       <Info className="h-4 w-4 text-indigo-600" />
                      Footer Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3 text-xs text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          Social links increase brand trust and community engagement.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          Ensure your copyright text is updated for legal compliance.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          Multi-column layouts are ideal for sites with deep content hierarchy.
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </EcosystemContainer>

      <FloatingSavePanel
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        isSaving={isUpdating}
        hasChanged={formik.dirty}
        saved={saved}
        title="Unsaved Changes"
        description="You have modified the footer configuration."
      />
    </EcosystemWrapper>
  );
}
