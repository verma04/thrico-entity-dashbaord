"use client";

import { useState, useEffect } from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  DollarSign,
  Package,
  Layers,
  Globe,
} from "lucide-react";
import { ProductPreview } from "./product-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useShopStore } from "@/store/useShopStore";
import { ProductFormValues } from "./product-form";
import { CATEGORY_CONFIG } from "./category-config";
import { useModuleStore } from "@/store/useModuleStore";

import { BasicInfoSection } from "./form-sections/basic-info";
import { MediaSection } from "./form-sections/media-section";
import { PricingSection } from "./form-sections/pricing-section";
import { VariantsSection } from "./form-sections/variants-section";
import { ExternalLinkSection } from "./form-sections/external-link-section";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";

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
  embedded?: boolean;
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
  embedded = false,
}: ProductCreationFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const moduleName = useModuleStore((state) => state.shopModuleName);
  const singularName = useModuleStore((state) => state.shopSingularName);

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
      const submissionData: ProductFormValues = {
        ...values,
        variants: variants,
        hasVariants: hasVariants,
      };

      onFinish(submissionData);
    },
  });

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
    if (mode === "create") return `Publish ${singularName}`;
    switch (activeTab) {
      case "media":
        return "Save Media";
      case "options":
        return "Save Options";
      case "inventory":
        return "Save Variants";
      default:
        return "Save Product";
    }
  };

  const getCategoryName = () => {
    const cat = categories.find((c) => c.id === formik.values.category);
    return cat ? cat.name : formik.values.category || "Uncategorized";
  };

  return (
    <FormikProvider value={formik}>
      <PolarisFormLayout
        sidebar={
          <div className="space-y-6">
            {/* Live Product Preview */}
            <PolarisSidebarCard title={`${singularName} Preview`} badge="Live Storefront" icon={Sparkles}>
              <ProductPreview
                formData={{
                  ...formik.values,
                  hasVariants,
                  options,
                }}
              />

              {/* Structured Configuration Breakdown */}
              <div className="space-y-1.5 pt-2">
                <PolarisSummaryRow
                  label="Product Title"
                  value={
                    <span className="truncate max-w-[150px] inline-block font-semibold">
                      {formik.values.title || "Not specified"}
                    </span>
                  }
                />
                <PolarisSummaryRow
                  label="Price"
                  value={
                    formik.values.price
                      ? `${formik.values.currency} ${formik.values.price}`
                      : "Not set"
                  }
                />
                <PolarisSummaryRow
                  label="Category"
                  value={getCategoryName()}
                />
                <PolarisSummaryRow
                  label="Stock Status"
                  value={formik.values.isOutOfStock ? "Out of Stock" : "In Stock"}
                />
                {formik.values.sku && (
                  <PolarisSummaryRow
                    label="SKU"
                    value={formik.values.sku}
                    isLast
                  />
                )}
              </div>
            </PolarisSidebarCard>

            {/* Storefront Conversion Tip */}
            <PolarisTipCard title={`${singularName} Commerce Tip`}>
              Clear multi-angle imagery, concise SKU labeling, and categorized pricing increase checkout conversion rates by up to 35%.
            </PolarisTipCard>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "create" ? (
            <>
              <PolarisFormCard
                step={1}
                title={`Core ${singularName} Identity`}
                description={`Provide a title, SKU identifier, detailed description, and availability status.`}
                badge="Required"
              >
                <BasicInfoSection />
              </PolarisFormCard>

              <PolarisFormCard
                step={2}
                title="Product Media & Imagery"
                description="Upload high-resolution photography and multi-angle product shots."
                badge="Media"
              >
                <MediaSection />
              </PolarisFormCard>

              <PolarisFormCard
                step={3}
                title="Valuation & Category Classification"
                description="Set the base retail price, currency unit, and storefront taxonomy category."
                badge="Pricing"
              >
                <PricingSection categories={categories} />
              </PolarisFormCard>

              <PolarisFormCard
                step={4}
                title="External Fulfillment & Attribution"
                description="Attach an external checkout URL with auto-generated UTM tracking codes."
                badge="Optional"
              >
                <ExternalLinkSection entityName={entityName} />
              </PolarisFormCard>
            </>
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full space-y-6"
            >
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-1">
                <TabsList className="bg-transparent h-auto p-0 gap-6">
                  <TabsTrigger
                    value="general"
                    className="bg-transparent border-b-2 border-transparent data-[state=active]:border-zinc-900 dark:data-[state=active]:border-zinc-100 data-[state=active]:bg-transparent rounded-none px-0 pb-2 text-xs font-semibold transition-all text-zinc-500 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100"
                  >
                    General Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="media"
                    className="bg-transparent border-b-2 border-transparent data-[state=active]:border-zinc-900 dark:data-[state=active]:border-zinc-100 data-[state=active]:bg-transparent rounded-none px-0 pb-2 text-xs font-semibold transition-all text-zinc-500 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100"
                  >
                    Media Gallery
                  </TabsTrigger>
                  <TabsTrigger
                    value="options"
                    className="bg-transparent border-b-2 border-transparent data-[state=active]:border-zinc-900 dark:data-[state=active]:border-zinc-100 data-[state=active]:bg-transparent rounded-none px-0 pb-2 text-xs font-semibold transition-all text-zinc-500 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100"
                  >
                    Options & Attributes
                  </TabsTrigger>
                  <TabsTrigger
                    value="inventory"
                    className="bg-transparent border-b-2 border-transparent data-[state=active]:border-zinc-900 dark:data-[state=active]:border-zinc-100 data-[state=active]:bg-transparent rounded-none px-0 pb-2 text-xs font-semibold transition-all text-zinc-500 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100"
                  >
                    SKU Variants
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="general"
                className="space-y-6 mt-0 border-none p-0 outline-none"
              >
                <PolarisFormCard
                  step={1}
                  title="General Product Details"
                  description="Manage basic information, pricing, and external checkout links."
                >
                  <BasicInfoSection />
                  <PricingSection categories={categories} />
                  <ExternalLinkSection entityName={entityName} />
                </PolarisFormCard>
              </TabsContent>

              <TabsContent
                value="media"
                className="mt-0 border-none p-0 outline-none"
              >
                <PolarisFormCard
                  step={2}
                  title="Media Gallery"
                  description="Upload and organize catalog images for this product."
                >
                  <MediaSection />
                </PolarisFormCard>
              </TabsContent>

              <TabsContent
                value="options"
                className="mt-0 border-none p-0 outline-none"
              >
                <PolarisFormCard
                  step={3}
                  title="Product Options"
                  description="Configure product attribute options such as Size, Color, and Material."
                >
                  <VariantsSection
                    showOnly="options"
                    onTabChange={setActiveTab}
                  />
                </PolarisFormCard>
              </TabsContent>

              <TabsContent
                value="inventory"
                className="mt-0 border-none p-0 outline-none"
              >
                <PolarisFormCard
                  step={4}
                  title="Variant SKU Inventory"
                  description="Manage individual inventory quantities and prices per variant combination."
                >
                  <VariantsSection
                    showOnly="table"
                    onTabChange={setActiveTab}
                  />
                </PolarisFormCard>
              </TabsContent>
            </Tabs>
          )}

          {/* Floating Action Bar */}
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
            title={mode === "create" ? `Publish ${singularName}` : `Save ${singularName}`}
            description="You have unsaved changes to this product configuration."
            buttonText={getButtonLabel()}
          />
        </form>
      </PolarisFormLayout>
    </FormikProvider>
  );
}
