"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Globe,
  Layout,
  Layers,
  ChevronRight,
  Info,
  Smartphone,
  Laptop,
} from "lucide-react";

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
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

import {
  useWebsiteBuilderStore,
  LayoutType,
} from "@/store/useWebsiteBuilderStore";
import { LivePreviewNavbar } from "@/components/website-layout/preview/live-preview-navbar";
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
import { Badge } from "@/components/ui/badge";

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
  const [previewDevice, setPreviewDevice] = React.useState<"mobile" | "desktop">("desktop");
  const [saved, setSaved] = React.useState(false);

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
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-indigo-600/10 ring-1 ring-indigo-600/20">
                <Globe className="h-5 w-5 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Navigation Studio
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
              <span>Website Builder</span>
              <ChevronRight className="h-3 w-3" />
              <span>General Settings</span>
              <ChevronRight className="h-3 w-3" />
              <span>Global Navigation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
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
                        Identity & Layout
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Define how your brand and navigation are presented.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-8">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="layout"
                          className="text-sm font-medium"
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
                            className="bg-background"
                          >
                            <SelectValue placeholder="Select a layout" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simple">
                              Simple (Right Aligned)
                            </SelectItem>
                            <SelectItem value="centered">
                              Centered Logo
                            </SelectItem>
                            <SelectItem value="minimal">
                              Minimal (Hamburger)
                            </SelectItem>
                            <SelectItem value="stacked">
                              Stacked (Two Rows)
                            </SelectItem>
                            <SelectItem value="split">Split</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

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
                            <SelectItem value="image">
                              Image Logo
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      {formik.values.logoType === "image" ? (
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
                      ) : (
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
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Menu Editor Section */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden mb-12">
                  <CardHeader className="bg-muted/30 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Layers className="h-4 w-4 text-indigo-600" />
                      <CardTitle className="text-xl">
                        Menu Structure
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Orchestrate links and hierarchical navigation nodes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <MenuEditor
                      menuItems={formik.values.menuItems}
                      onChange={(items) =>
                        formik.setFieldValue("menuItems", items)
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
                    {/* Simulated Page Content */}
                    <div className="bg-slate-50 min-h-full">
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
                      <div className="p-8 space-y-6">
                        <div className="h-8 w-1/3 bg-slate-200 rounded-lg animate-pulse" />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
                          <div className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
                        </div>
                        <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
                        <div className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="border-none shadow-sm ring-1 ring-border/50">
                  <CardHeader className="pb-3 border-b bg-muted/20">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Info className="h-4 w-4 text-indigo-600" />
                      Platform Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3 text-xs text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          Centered logos work best for minimal, high-end brands.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          Limit top-level menu items to 5-7 for optimal clarity.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          SVG logos are recommended for crisp rendering across all devices.
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingSavePanel
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        isSaving={isUpdating}
        hasChanged={formik.dirty}
        saved={saved}
        title="Unsaved Changes"
        description="You have modified the navigation configuration."
      />
    </div>
  );
}
