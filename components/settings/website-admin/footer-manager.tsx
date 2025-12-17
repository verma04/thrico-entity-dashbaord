"use client";

import { Formik, Form, Field, FormikProps } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SaveIcon } from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import {
  useWebsiteBuilderStore,
  LayoutType,
} from "@/store/useWebsiteBuilderStore";
import { LivePreviewFooter } from "@/components/website-layout/preview/live-preview-footer";
import { SocialLinksEditor } from "@/components/website-layout/settings/social-links-editor";
import { MenuEditor } from "@/components/website-layout/settings/menu-editor";

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
    Yup.object().shape({
      id: Yup.string().required(),
      platform: Yup.string().required("Platform is required"),
      url: Yup.string().url("Must be a valid URL").required("URL is required"),
    })
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

  const handleSubmit = (values: FooterConfig) => {
    // Update store
    updateModuleLayout(globalFooter.id, values.layout);
    updateModuleContent(globalFooter.id, {
      logoText: values.logoText,
      logoType: values.logoType,
      logoImage: values.logoImage,
      description: values.description,
      socialLinks: values.socialLinks,
      menuItems: values.menuItems,
      copyrightText: values.copyrightText,
    });

    toast({
      title: "Footer Saved",
      description: "Global footer has been updated successfully.",
    });
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
        <Form className="space-y-6">
          {/* ------------------------------------------------ */}
          {/* LIVE PREVIEW */}
          {/* ------------------------------------------------ */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  See how your footer will look on your website
                </CardDescription>
              </div>

              <Button
                type="submit"
                size="sm"
                className="gap-2 shadow-lg"
                disabled={isSubmitting}
              >
                <SaveIcon className="h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Footer"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg overflow-hidden bg-background shadow-sm">
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
              <div className="text-xs text-muted-foreground text-center">
                Preview updates automatically as you make changes
              </div>
            </CardContent>
          </Card>

          {/* ------------------------------------------------ */}
          {/* LAYOUT & BRANDING */}
          {/* ------------------------------------------------ */}
          <Card>
            <CardHeader>
              <CardTitle>Layout & Branding</CardTitle>
              <CardDescription>
                Configure the look of your footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Layout Selector */}
              <div className="space-y-2">
                <Label htmlFor="layout">Layout Variant</Label>
                <Select
                  value={values.layout}
                  onValueChange={(value) => setFieldValue("layout", value)}
                >
                  <SelectTrigger id="layout" className="w-full">
                    <SelectValue placeholder="Select a layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="columns">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Multi-Column</span>
                        <span className="text-xs text-muted-foreground">Logo + 3 columns of links</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="simple">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Simple</span>
                        <span className="text-xs text-muted-foreground">Center-aligned with links</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="minimal">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Minimal</span>
                        <span className="text-xs text-muted-foreground">Single line footer</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="corporate">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Corporate</span>
                        <span className="text-xs text-muted-foreground">Professional multi-section</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="newsletter">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Newsletter</span>
                        <span className="text-xs text-muted-foreground">Newsletter signup focused</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.layout && touched.layout && (
                  <p className="text-xs text-red-500">{errors.layout}</p>
                )}
              </div>

              {/* Logo Type Selector */}
              <div className="space-y-2">
                <Label htmlFor="logoType">Logo Type</Label>
                <Select
                  value={values.logoType}
                  onValueChange={(value) => setFieldValue("logoType", value)}
                >
                  <SelectTrigger id="logoType">
                    <SelectValue placeholder="Select logo type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Logo</SelectItem>
                    <SelectItem value="image">Image Logo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.logoType && touched.logoType && (
                  <p className="text-xs text-red-500">{errors.logoType}</p>
                )}
              </div>

              {/* Logo Content */}
              <div className="space-y-4">
                {/* Text Logo */}
                {(values.logoType === "text" || !values.logoType) && (
                  <div className="space-y-2">
                    <Label htmlFor="logoText">Logo Text</Label>
                    <Field
                      name="logoText"
                      as={Input}
                      id="logoText"
                      placeholder="My Brand"
                    />
                    {errors.logoText && touched.logoText && (
                      <p className="text-xs text-red-500">{errors.logoText}</p>
                    )}
                  </div>
                )}

                {/* Image Logo */}
                {values.logoType === "image" && (
                  <div className="space-y-2">
                    <ImageUploadWithCrop
                      label="Logo Image"
                      currentImage={values.logoImage}
                      onImageUpdate={(imageUrl: string) =>
                        setFieldValue("logoImage", imageUrl)
                      }
                      recommendedWidth={150}
                      recommendedHeight={50}
                      aspectRatio={3}
                      showDimensions
                    />
                    {errors.logoImage && touched.logoImage && (
                      <p className="text-xs text-red-500">{errors.logoImage}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Field
                  name="description"
                  as={Textarea}
                  id="description"
                  placeholder="A brief description about your company..."
                  rows={3}
                />
                {errors.description && touched.description && (
                  <p className="text-xs text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Copyright Text */}
              <div className="space-y-2">
                <Label htmlFor="copyrightText">Copyright Text</Label>
                <Field
                  name="copyrightText"
                  as={Input}
                  id="copyrightText"
                  placeholder="© 2025 All rights reserved."
                />
                {errors.copyrightText && touched.copyrightText && (
                  <p className="text-xs text-red-500">{errors.copyrightText}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ------------------------------------------------ */}
          {/* NAVIGATION LINKS */}
          {/* ------------------------------------------------ */}
          <Card>
            <CardHeader>
              <CardTitle>Footer Navigation</CardTitle>
              <CardDescription>
                Add navigation links and columns to your footer
              </CardDescription>
            </CardHeader>

            <CardContent>
              <MenuEditor
                menuItems={values.menuItems}
                onChange={(items) => setFieldValue("menuItems", items)}
              />
            </CardContent>
          </Card>

          {/* ------------------------------------------------ */}
          {/* SOCIAL LINKS */}
          {/* ------------------------------------------------ */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Connect your social media profiles
              </CardDescription>
            </CardHeader>

            <CardContent>
              <SocialLinksEditor
                links={values.socialLinks}
                onChange={(links) => setFieldValue("socialLinks", links)}
              />
            </CardContent>
          </Card>
        </Form>
      )}
    </Formik>
  );
}
