"use client";

import { Formik, Form, Field, FormikProps } from "formik";
import * as Yup from "yup";
import {
  SaveIcon,
  ShieldCheck,
  Activity,
  Globe,
  Layout,
  Layers,
  Wand2,
  Share2,
  FileText,
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
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

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
          then: (schema) => schema.required("Platform is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        url: Yup.string().when("platform", {
          is: (platform: string) => platform && platform.length > 0,
          then: (schema) =>
            schema.url("Must be a valid URL").required("URL is required"),
          otherwise: (schema) => schema.url("Must be a valid URL").notRequired(),
        }),
      },
      [["platform", "url"]]
    )
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

  // Fetch website data
  const { data: websiteData, refetch } = useGetWebsite({});

  // Update footer mutation
  const [updateFooterMutation, { loading: isUpdating }] = useUpdateFooter({
    onCompleted: () => {
      toast({
        title: "Footer Saved",
        description: "Global footer has been updated successfully.",
      });
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

  // Initial values from global footer
  const initialValues: FooterConfig = {
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
  };

  const handleSubmit = async (values: FooterConfig) => {
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
        (link) => link.platform || link.url
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
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={footerSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        values,
        setFieldValue,
        errors,
        touched,
        isSubmitting,
      }: FormikProps<FooterConfig>) => (
        <Form className="space-y-8">
          <EcosystemActionBar shadow="sm">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Footer Nodes: Active
                  </span>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Protocol: Valid</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="h-10 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-wider gap-3 shadow-xl shadow-slate-200 transition-all active:scale-95 group"
                >
                  <SaveIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                  {isUpdating ? "Synchronizing..." : "Save Footer"}
                </Button>
              </div>
            </div>
          </EcosystemActionBar>

          <EcosystemContainer className="space-y-12 p-8 lg:p-12">
            {/* Live Preview Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-1">
                <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black italic">
                  VP
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase leading-none">
                    Visual Protocol
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Real-time architectural simulation
                  </p>
                </div>
              </div>

              <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 p-6 overflow-hidden">
                <div className="border border-slate-50 rounded-2xl overflow-hidden bg-slate-50/30">
                  <LivePreviewFooter
                    content={{
                      logoText: values.logoText,
                      logoType: values.logoType,
                      logoImage: values.logoImage,
                      description: values.description,
                      socialLinks: values.socialLinks,
                      menuItems: values.menuItems,
                      copyrightText: values.copyrightText,
                    }}
                    layout={values.layout}
                  />
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center mt-6 italic opacity-60">
                  Synchronized Simulation Active
                </p>
              </div>
            </div>

            {/* Layout & Branding Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-1">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                    <Layout className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase leading-none">
                      Architecture
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Footer & Branding definitions
                    </p>
                  </div>
                </div>

                <div className="space-y-8 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                  <div className="space-y-2">
                    <Label
                      htmlFor="layout"
                      className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1"
                    >
                      Layout Variant
                    </Label>
                    <Select
                      value={values.layout}
                      onValueChange={(value) => setFieldValue("layout", value)}
                    >
                      <SelectTrigger
                        id="layout"
                        className="h-12 rounded-xl border-slate-100 bg-white font-medium"
                      >
                        <SelectValue placeholder="Select a layout" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        <SelectItem value="columns">Multi-Column</SelectItem>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="logoType"
                        className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1"
                      >
                        Logo Type
                      </Label>
                      <Select
                        value={values.logoType}
                        onValueChange={(value) =>
                          setFieldValue("logoType", value)
                        }
                      >
                        <SelectTrigger
                          id="logoType"
                          className="h-12 rounded-xl border-slate-100 bg-white font-medium"
                        >
                          <SelectValue placeholder="Select logo type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          <SelectItem value="text">Text Logo</SelectItem>
                          <SelectItem value="image">Image Logo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="logoText"
                        className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1"
                      >
                        Logo Text
                      </Label>
                      <Field
                        name="logoText"
                        as={Input}
                        id="logoText"
                        placeholder="My Brand"
                        className="h-12 rounded-xl border-slate-100 bg-white font-medium"
                        disabled={values.logoType === "image"}
                      />
                    </div>
                  </div>

                  {values.logoType === "image" && (
                    <div className="space-y-2">
                      <ImageUploadWithCrop
                        label="Logo Image Asset"
                        currentImage={values.logoImage}
                        onImageUpdate={(imageUrl: string) =>
                          setFieldValue("logoImage", imageUrl)
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
                      className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1"
                    >
                      Description Invariant
                    </Label>
                    <Field
                      name="description"
                      as={Textarea}
                      id="description"
                      placeholder="A brief description about your company..."
                      rows={3}
                      className="rounded-xl border-slate-100 bg-white font-medium resize-none shadow-sm focus:ring-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="copyrightText"
                      className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1"
                    >
                      Copyright Text
                    </Label>
                    <Field
                      name="copyrightText"
                      as={Input}
                      id="copyrightText"
                      placeholder="© 2025 All rights reserved."
                      className="h-12 rounded-xl border-slate-100 bg-white font-medium shadow-sm focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-1">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase leading-none">
                        Node Manifest
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Hierarchical link orchestration
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                    <MenuEditor
                      menuItems={values.menuItems}
                      onChange={(items) => setFieldValue("menuItems", items)}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-1">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                      <Share2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase leading-none">
                        Social Bridges
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        External platform connections
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                    <SocialLinksEditor
                      links={values.socialLinks}
                      onChange={(links) => setFieldValue("socialLinks", links)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </EcosystemContainer>
        </Form>
      )}
    </Formik>
  );
}
