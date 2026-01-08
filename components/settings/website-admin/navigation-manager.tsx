"use client";

import { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
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

import { SaveIcon } from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

import {
  useWebsiteBuilderStore,
  LayoutType,
} from "@/store/useWebsiteBuilderStore";
import { LivePreviewNavbar } from "@/components/website-layout/preview/live-preview-navbar";
import { MenuEditor } from "@/components/website-layout/settings/menu-editor";

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
    })
  ),
});

// ------------------------------------------------
// COMPONENT
// ------------------------------------------------

export default function NavigationManager() {
  const { toast } = useToast();
  const { globalHeader, updateModuleContent, updateModuleLayout } =
    useWebsiteBuilderStore();

  // Fetch website data
  const { data: websiteData, refetch } = useGetWebsite({});

  // Update navbar mutation
  const [updateNavbarMutation, { loading: isUpdating }] = useUpdateNavbar({
    onCompleted: () => {
      toast({
        title: "Navigation Saved",
        description: "Global navigation has been updated.",
      });
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

  // Initial values from global header
  const initialValues: NavigationConfig = {
    layout: globalHeader.layout,
    logoText: globalHeader.content?.logoText || "Brand",
    logoType: globalHeader.content?.logoType || "text",
    logoImage: globalHeader.content?.logoImage || "",
    menuItems: globalHeader.content?.menuItems || [],
  };

  const handleSubmit = async (values: NavigationConfig) => {
    if (!websiteData?.getWebsite?.id) {
      toast({
        title: "Error",
        description: "Website not found",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call GraphQL mutation to update navbar in database
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

      // Update local store for immediate UI update
      updateModuleLayout(globalHeader.id, values.layout);
      updateModuleContent(globalHeader.id, {
        logoText: values.logoText,
        logoType: values.logoType,
        logoImage: values.logoImage,
        menuItems: values.menuItems,
      });
    } catch (error) {
      // Error handling is done in the mutation's onError callback
      console.error("Navbar update failed:", error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={navigationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, errors, touched, isSubmitting }) => (
        <Form className="space-y-6">
          {/* ------------------------------------------------ */}
          {/* SAVE BUTTON (TOP) */}
          {/* ------------------------------------------------ */}

          {/* ------------------------------------------------ */}
          {/* LIVE PREVIEW */}
          {/* ------------------------------------------------ */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  See how your navigation will look on your website
                </CardDescription>
              </div>

              <Button
                type="submit"
                size="sm"
                className="gap-2 shadow-lg"
                disabled={isUpdating}
              >
                <SaveIcon className="h-4 w-4" />
                {isUpdating ? "Saving..." : "Save Navigation"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg overflow-hidden bg-background">
                <LivePreviewNavbar
                  content={{
                    logoText: values.logoText,
                    logoType: values.logoType,
                    logoImage: values.logoImage,
                    menuItems: values.menuItems,
                  }}
                  layout={values.layout}
                  previewDevice="desktop"
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
                Configure the look of your navigation bar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Layout Selector */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="layout">Layout Variant</Label>
                  <Select
                    value={values.layout}
                    onValueChange={(value) => setFieldValue("layout", value)}
                  >
                    <SelectTrigger id="layout">
                      <SelectValue placeholder="Select a layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">
                        Simple (Right Aligned)
                      </SelectItem>
                      <SelectItem value="centered">Centered Logo</SelectItem>
                      <SelectItem value="minimal">
                        Minimal (Hamburger)
                      </SelectItem>
                      <SelectItem value="stacked">
                        Stacked (Two Rows)
                      </SelectItem>
                      <SelectItem value="split">Split</SelectItem>
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
            </CardContent>
          </Card>

          {/* ------------------------------------------------ */}
          {/* MENU EDITOR */}
          {/* ------------------------------------------------ */}
          <Card>
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
              <CardDescription>Customize your navigation links</CardDescription>
            </CardHeader>

            <CardContent>
              <MenuEditor
                menuItems={values.menuItems}
                onChange={(items) => setFieldValue("menuItems", items)}
              />
            </CardContent>
          </Card>

          {/* Save button moved to top */}
        </Form>
      )}
    </Formik>
  );
}
