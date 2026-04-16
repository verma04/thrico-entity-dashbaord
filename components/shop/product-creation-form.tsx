"use client";

import { useState, useEffect } from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/use-toast";
import { ShoppingBag, Info, ChevronRight, Save, Loader2 } from "lucide-react";
import { ProductPreview } from "./product-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";

import { useShopStore } from "@/store/useShopStore";
import { ProductFormValues } from "./product-form"; // Reuse types if possible
import { CATEGORY_CONFIG } from "./category-config";

import { BasicInfoSection } from "./form-sections/basic-info";
import { MediaSection } from "./form-sections/media-section";
import { PricingSection } from "./form-sections/pricing-section";
import { VariantsSection } from "./form-sections/variants-section";
import { ExternalLinkSection } from "./form-sections/external-link-section";

// Schema mimicking ProductForm but ensuring it works here
const productSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Title must be at least 2 characters")
    .required("Title is required"),
  description: Yup.string(),
  price: Yup.string().required("Price is required"),
  currency: Yup.string().required("Currency is required"),
  category: Yup.string().required("Category is required"),
  image: Yup.string(),
  images: Yup.array().of(Yup.string()).optional(),
  isOutOfStock: Yup.boolean().optional(),
  sku: Yup.string().optional(),
  externalLink: Yup.string().url("Invalid URL").optional(),
});

interface ProductCreationFormProps {
  initialValues?: ProductFormValues;
  loading: boolean;
  onFinish: (values: ProductFormValues) => void;
  onSaveVariants?: () => Promise<void>;
  onSaveMedia?: (values: ProductFormValues) => Promise<void>;
  onSaveOptions?: () => Promise<void>;
  onCancel?: () => void;
  categories: { id: string; name: string }[];
  entityName?: string;
  mode?: "create" | "edit";
}

export function ProductCreationForm({
  initialValues,
  loading,
  onFinish,
  onSaveVariants,
  onSaveMedia,
  onSaveOptions,
  onCancel,
  categories,
  entityName = "My Store",
  mode = "create",
}: ProductCreationFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");

  // Zustand Store
  const {
    variants,
    options,
    setVariants,
    setOptions,
    hasVariants,
    setHasVariants,
    reset,
  } = useShopStore();

  // Initialize store
  useEffect(() => {
    if (initialValues) {
      if (initialValues.variants) setVariants(initialValues.variants);
      if (initialValues.options) setOptions(initialValues.options);
      if (initialValues.hasVariants !== undefined)
        setHasVariants(initialValues.hasVariants);
    } else {
      reset();
    }
  }, [initialValues, setVariants, setOptions, setHasVariants, reset]);

  const formik = useFormik({
    initialValues: initialValues || {
      title: "",
      description: "",
      price: "",
      currency: "USD",
      category: "",
      image: "",
      images: [],
      isOutOfStock: false,
      externalLink: "",
    },
    validationSchema: productSchema,
    onSubmit: (values) => {
      // Merge Formik values with Zustand state
      const submissionData: ProductFormValues = {
        ...values,
        variants: variants,

        hasVariants: hasVariants,
      };

      onFinish(submissionData);
    },
  });

  // Category Preset Logic
  useEffect(() => {
    const categoryId = formik.values.category;
    // Only apply if we have no options yet and we are not in edit mode (checking initialValues id/presence might be better but checking options length is okay for now)
    // Actually, if user switches category, maybe we should suggest?
    // Let's be conservative: only if options are empty.
    if (categoryId && options.length === 0 && !initialValues) {
      const config = CATEGORY_CONFIG[categoryId];
      if (config) {
        // We need a way to set options in batch.
        // Current store has addOption.
        // Let's iterate.
        config.presets.forEach((preset) => {
          // Check if option exists? Logic is getting complex for effect.
          // Ideally store should handle "applyPreset(preset)".
        });
      }
    }
  }, [formik.values.category, options.length, initialValues]);

  const handleSubmit = (e?: React.BaseSyntheticEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (mode === "edit" && activeTab === "inventory" && onSaveVariants) {
      onSaveVariants();
    } else if (mode === "edit" && activeTab === "options" && onSaveOptions) {
      onSaveOptions();
    } else if (mode === "edit" && activeTab === "media" && onSaveMedia) {
      onSaveMedia(formik.values);
    } else {
      formik.handleSubmit();
    }
  };

  const getButtonLabel = () => {
    if (mode === "create") return "Create Product";
    switch (activeTab) {
      case "media":
        return "Save Media";
      case "options":
        return "Save Options";
      case "inventory":
        return "Save Variants";
      default:
        return "Save General Info";
    }
  };

  // Show validation errors via toast if user tries to submit
  useEffect(() => {
    if (formik.submitCount > 0 && !formik.isValid) {
      const errorKeys = Object.keys(formik.errors);
      if (errorKeys.length > 0) {
        toast({
          title: "Check form values",
          description:
            "There are validation errors in the form. Please check all fields.",
          variant: "destructive",
        });
      }
    }
  }, [formik.submitCount, formik.isValid, formik.errors, toast]);

  return (
   <>
    <FormikProvider value={formik}>
      <>
        <div className="flex flex-col h-full bg-background min-h-0 rounded-t-[inherit]">
        {/* Header section - Sticky */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b px-6 py-4">
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {mode === "create" ? "Create Product" : "Edit Product"}
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
                <span>Shop</span>
                <ChevronRight className="h-3 w-3" />
                <span>{mode === "create" ? "New" : "Edit"} Product</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto pb-20 sm:pb-0">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {mode === "create" ? (
                    <>
                      <BasicInfoSection />
                      <MediaSection />
                      <PricingSection categories={categories} />
                      <ExternalLinkSection entityName={entityName} />
                    </>
                  ) : (
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full space-y-8"
                    >
                      <div className="flex items-center justify-between border-b pb-1">
                        <TabsList className="bg-transparent h-auto p-0 gap-6">
                          <TabsTrigger
                            value="general"
                            className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-0 pb-2 text-sm font-medium transition-all"
                          >
                            General
                          </TabsTrigger>
                          <TabsTrigger
                            value="media"
                            className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-0 pb-2 text-sm font-medium transition-all"
                          >
                            Media
                          </TabsTrigger>
                          <TabsTrigger
                            value="options"
                            className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-0 pb-2 text-sm font-medium transition-all"
                          >
                            Product Options
                          </TabsTrigger>
                          <TabsTrigger
                            value="inventory"
                            className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-0 pb-2 text-sm font-medium transition-all"
                          >
                            Variants
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent
                        value="general"
                        className="space-y-8 mt-0 border-none p-0 outline-none"
                      >
                        <BasicInfoSection />
                        <PricingSection categories={categories} />
                        <ExternalLinkSection entityName={entityName} />
                      </TabsContent>

                      <TabsContent
                        value="media"
                        className="mt-0 border-none p-0 outline-none"
                      >
                        <MediaSection />
                      </TabsContent>

                      <TabsContent
                        value="options"
                        className="mt-0 border-none p-0 outline-none"
                      >
                        <VariantsSection
                          showOnly="options"
                          onTabChange={setActiveTab}
                        />
                      </TabsContent>

                      <TabsContent
                        value="inventory"
                        className="mt-0 border-none p-0 outline-none"
                      >
                        <VariantsSection
                          showOnly="table"
                          onTabChange={setActiveTab}
                        />
                      </TabsContent>
                    </Tabs>
                  )}
                </form>
              </div>

              {/* Side Preview */}
              <div className="lg:col-span-4">
                <div className="sticky top-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">Product Preview</h3>
                  </div>
                  <ProductPreview
                    formData={{
                      ...formik.values,
                      hasVariants,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={false}
        isSaving={loading}
        onSave={handleSubmit}
        onReset={() => {
          formik.resetForm();
          if (onCancel) onCancel();
          else window.history.back();
        }}
        title={`Unsaved ${mode === "create" ? "Product Data" : "Changes"}`}
        description="You have unfilled form data."
        buttonText={getButtonLabel()}
      />
      </>
 
   </FormikProvider>
   </>
  );
}
