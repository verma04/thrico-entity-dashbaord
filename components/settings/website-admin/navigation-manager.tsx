"use client";

import { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  SaveIcon,
  ShieldCheck,
  Activity,
  Globe,
  Layout,
  Layers,
  Wand2,
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
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

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
  const { data: websiteData, refetch, loading: websiteLoading } = useGetWebsite({});

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
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={navigationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, errors, touched, isSubmitting }) => (
        <Form className="space-y-8">
          <EcosystemActionBar shadow="sm">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Navigation Nodes: Active
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
                  {isUpdating ? "Synchronizing..." : "Save Navigation"}
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
                      Layout & Branding definitions
                    </p>
                  </div>
                </div>

                <div className="space-y-8 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="layout"
                        className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1"
                      >
                        Layout Variant
                      </Label>
                      <Select
                        value={values.layout}
                        onValueChange={(value) =>
                          setFieldValue("layout", value)
                        }
                      >
                        <SelectTrigger
                          id="layout"
                          className="h-12 rounded-xl border-slate-100 bg-white font-medium"
                        >
                          <SelectValue placeholder="Select a layout" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
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
                    </div>

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
                  </div>

                  <div className="space-y-4 pt-4">
                    {values.logoType === "image" ? (
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
                    ) : (
                      <div className="space-y-2">
                        <Label
                          htmlFor="logoText"
                          className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1"
                        >
                          Logo Text Invariant
                        </Label>
                        <Field
                          name="logoText"
                          as={Input}
                          id="logoText"
                          placeholder="My Brand"
                          className="h-12 rounded-xl border-slate-100 bg-white font-medium"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

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
            </div>
          </EcosystemContainer>
        </Form>
      )}
    </Formik>
  );
}
