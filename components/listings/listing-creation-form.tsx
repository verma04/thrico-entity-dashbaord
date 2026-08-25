"use client";

import React from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Award,
} from "lucide-react";
import GooglePlacesInput from "@/components/layout/google-place-input";
import { ImageUpload } from "./image-upload";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { cn } from "@/lib/utils";
import { useModuleStore } from "@/store/useModuleStore";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";

interface ListingCreationFormProps {
  initialValues?: Record<string, any>;
  loading?: boolean;
  onFinish: (values: any) => void;
  onCancel?: () => void;
}

const CATEGORIES = [
  "Electronics & Appliances",
  "Vehicles",
  "Real Estate",
  "Home & Furniture",
  "Fashion & Beauty",
  "Sports, Hobbies & Books",
  "Pets",
  "Services",
];

const CONDITIONS = [
  {
    value: "NEW",
    label: "Brand New",
    desc: "Unopened in original box",
    icon: Award,
  },
  {
    value: "USED_LIKE_NEW",
    label: "Like New",
    desc: "Flawless with zero wear",
    icon: Sparkles,
  },
  {
    value: "USED_LIKE_GOOD",
    label: "Good Condition",
    desc: "Minor gentle cosmetic wear",
    icon: CheckCircle2,
  },
  {
    value: "USED_LIKE_FAIR",
    label: "Fair Condition",
    desc: "Noticeable wear, fully functional",
    icon: ShieldCheck,
  },
];

const listingSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Price must be 0 or greater"),
  location: Yup.string().required("Location is required"),
  category: Yup.string().required("Category is required"),
  condition: Yup.string().required("Condition is required"),
  media: Yup.array().min(1, "At least one photo is required"),
});

export function ListingCreationForm({
  initialValues,
  loading,
  onFinish,
  onCancel,
}: ListingCreationFormProps) {
  const moduleName = useModuleStore((state) => state.listingModuleName);
  const singularName = useModuleStore((state) => state.listingSingularName);

  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      price: initialValues?.price || "",
      category: initialValues?.category || "",
      condition: initialValues?.condition || "NEW",
      location: initialValues?.location || "",
      media: (initialValues?.media || []) as any[],
    },
    validationSchema: listingSchema,
    onSubmit: (values) => {
      onFinish(values);
    },
  });

  const getPrimaryImageUrl = () => {
    if (!formik.values.media || formik.values.media.length === 0) return null;
    const first = formik.values.media[0];
    if (first.file) return URL.createObjectURL(first.file);
    return first.thumbUrl || first.url || null;
  };

  const getConditionLabel = () => {
    return (
      CONDITIONS.find((c) => c.value === formik.values.condition)?.label ||
      formik.values.condition
    );
  };

  return (
    <FormikProvider value={formik}>
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Marketplace Preview Card */}
            <PolarisSidebarCard
              title={`${singularName} Preview`}
              badge="Live Preview"
              icon={Sparkles}
            >
              <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 overflow-hidden shadow-xs">
                {/* Image Container */}
                <div className="aspect-[3/2] w-full bg-[#e1e3e5] dark:bg-zinc-800 relative flex items-center justify-center overflow-hidden">
                  {getPrimaryImageUrl() ? (
                    <img
                      src={getPrimaryImageUrl()!}
                      alt="Listing preview"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="h-8 w-8 text-[#8c9196] mx-auto mb-1 opacity-60" />
                      <p className="text-[11px] text-[#616161] font-medium">
                        No photo uploaded
                      </p>
                    </div>
                  )}
                  {formik.values.category && (
                    <div className="absolute top-2.5 right-2.5">
                      <Badge
                        variant="secondary"
                        className="bg-black/75 text-white backdrop-blur-xs border-none text-[10px] font-semibold px-2 py-0.5 rounded-[4px]"
                      >
                        {formik.values.category}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-[14px] text-[#303030] dark:text-zinc-100 truncate">
                        {formik.values.title || `${singularName} Item Title`}
                      </h4>
                      {formik.values.location && (
                        <p className="text-[12px] text-[#616161] dark:text-zinc-400 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {formik.values.location}
                        </p>
                      )}
                    </div>
                    <span className="text-[15px] font-bold text-[#303030] dark:text-zinc-100 shrink-0">
                      ₹
                      {formik.values.price
                        ? Number(formik.values.price).toLocaleString()
                        : "0"}
                    </span>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#e1e3e5] dark:border-zinc-800">
                    <Badge
                      variant="outline"
                      className="bg-[#303030] dark:bg-zinc-100 text-white dark:text-zinc-900 border-none text-[10px] font-bold rounded-[4px]"
                    >
                      {getConditionLabel()}
                    </Badge>
                    {formik.values.media.length > 1 && (
                      <Badge
                        variant="outline"
                        className="bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-300 border-[#d2d5d9] text-[10px] font-semibold rounded-[4px]"
                      >
                        +{formik.values.media.length - 1} photos
                      </Badge>
                    )}
                  </div>

                  {/* Description Snippet */}
                  <div className="text-[11.5px] text-[#616161] dark:text-zinc-400 leading-[16px] line-clamp-2">
                    {formik.values.description ||
                      "Detailed item description and specifics will appear here..."}
                  </div>
                </div>
              </div>

              {/* Structured Configuration Breakdown */}
              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Item Title"
                  value={
                    <span className="truncate max-w-[150px] inline-block font-semibold">
                      {formik.values.title || "Not specified"}
                    </span>
                  }
                />
                <PolarisSummaryRow
                  label="Listed Price"
                  value={`₹${formik.values.price ? Number(formik.values.price).toLocaleString() : "0"}`}
                />
                <PolarisSummaryRow
                  label="Category"
                  value={formik.values.category || "Uncategorized"}
                />
                <PolarisSummaryRow
                  label="Condition"
                  value={getConditionLabel()}
                />
                <PolarisSummaryRow
                  label="Location"
                  value={
                    <span className="truncate max-w-[150px] inline-block font-semibold">
                      {formik.values.location || "Not set"}
                    </span>
                  }
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Marketplace Tip */}
            <PolarisTipCard title={`${singularName} Listing Tip`}>
              Listings featuring at least 3 bright, high-resolution photos and
              detailed condition explanations sell 2.8× faster in community
              marketplaces.
            </PolarisTipCard>
          </div>
        }
      >
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Step 1: Photos & Product Overview */}
          <PolarisFormCard
            step={1}
            title={`Visual Media & ${singularName} Overview`}
            description="Upload multi-angle photos and write a descriptive title and summary."
            badge="Required"
          >
            {/* Multi-Photo Upload */}
            <div className="space-y-2">
              <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
                Item Gallery (Up to 4 photos){" "}
                <span className="text-[#d72c0d] ml-0.5">*</span>
              </label>
              <ImageUpload
                fileList={formik.values.media}
                onFilesChange={(files) =>
                  formik.setFieldValue("media", files)
                }
              />
              {formik.touched.media && formik.errors.media && (
                <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                  {formik.errors.media as string}
                </p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-1.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <label
                htmlFor="title"
                className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
              >
                {singularName} Title{" "}
                <span className="text-[#d72c0d] ml-0.5">*</span>
              </label>
              <Input
                id="title"
                name="title"
                placeholder={`e.g., Apple MacBook Pro 16" M3 Max - 64GB RAM`}
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                  {formik.errors.title as string}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label
                htmlFor="description"
                className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
              >
                Item Description{" "}
                <span className="text-[#d72c0d] ml-0.5">*</span>
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe specifications, inclusions, warranty status, and reason for selling..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="min-h-[110px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px] p-3 resize-none shadow-none"
              />
              <div className="flex items-center justify-between">
                {formik.touched.description && formik.errors.description ? (
                  <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                    {formik.errors.description as string}
                  </p>
                ) : (
                  <span />
                )}
                <p className="text-[11.5px] text-[#616161] font-medium">
                  {formik.values.description.length} characters (min 10)
                </p>
              </div>
            </div>
          </PolarisFormCard>

          {/* Step 2: Pricing, Category & Location */}
          <PolarisFormCard
            step={2}
            title="Valuation, Category & Location"
            description="Establish the listing price, marketplace taxonomy category, and pickup city."
            badge="Pricing"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="price"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                >
                  Listing Price (₹){" "}
                  <span className="text-[#d72c0d] ml-0.5">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-[#616161]">
                    ₹
                  </span>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="0"
                    className="h-[40px] pl-8 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] text-[#303030] dark:text-zinc-100 rounded-[8px]"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.price && formik.errors.price && (
                  <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                    {formik.errors.price as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="category"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                >
                  Taxonomy Category{" "}
                  <span className="text-[#d72c0d] ml-0.5">*</span>
                </label>
                <Select
                  onValueChange={(value) =>
                    formik.setFieldValue("category", value)
                  }
                  value={formik.values.category}
                >
                  <SelectTrigger
                    id="category"
                    className="h-[40px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] text-[#303030] dark:text-zinc-100 rounded-[8px]"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.category && formik.errors.category && (
                  <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                    {formik.errors.category as string}
                  </p>
                )}
              </div>
            </div>

            {/* Location Input */}
            <div className="space-y-1.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <label
                htmlFor="location"
                className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
              >
                Item Location / Pickup Region{" "}
                <span className="text-[#d72c0d] ml-0.5">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#616161] z-10" />
                <GooglePlacesInput
                  id="location"
                  name="location"
                  onBlur={formik.handleBlur}
                  placeholder="Search city, neighborhood or region..."
                  className="h-[40px] pl-9 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] text-[#303030] dark:text-zinc-100 rounded-[8px]"
                  initialValue={
                    formik.values.location
                      ? {
                          name: formik.values.location,
                          address: formik.values.location,
                          latitude: 0,
                          longitude: 0,
                        }
                      : null
                  }
                  onChange={(loc) => {
                    formik.setFieldValue("location", loc.address || loc.name);
                  }}
                />
              </div>
              {formik.touched.location && formik.errors.location && (
                <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                  {formik.errors.location as string}
                </p>
              )}
            </div>
          </PolarisFormCard>

          {/* Step 3: Condition Quality Grading */}
          <PolarisFormCard
            step={3}
            title="Item Condition & Quality Grading"
            description="Accurately rate the wear level to ensure buyer confidence and avoid disputes."
            badge="Assurance"
          >
            <div className="space-y-2">
              <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
                Condition Rating{" "}
                <span className="text-[#d72c0d] ml-0.5">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CONDITIONS.map((cond) => {
                  const Icon = cond.icon;
                  const isSelected = formik.values.condition === cond.value;
                  return (
                    <button
                      key={cond.value}
                      type="button"
                      onClick={() =>
                        formik.setFieldValue("condition", cond.value)
                      }
                      className={cn(
                        "relative flex items-start gap-3 p-3.5 rounded-[8px] border text-left transition-all cursor-pointer",
                        isSelected
                          ? "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs"
                          : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                      )}
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-[6px] flex items-center justify-center border transition-colors shrink-0 mt-0.5",
                          isSelected
                            ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                            : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-700",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100 block">
                          {cond.label}
                        </span>
                        <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[16px]">
                          {cond.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {formik.touched.condition && formik.errors.condition && (
                <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                  {formik.errors.condition as string}
                </p>
              )}
            </div>
          </PolarisFormCard>

          {/* Floating Save Action Bar */}
          <FloatingSavePanel
            hasChanged={formik.dirty}
            saved={false}
            isSaving={loading}
            onSave={() => formik.handleSubmit()}
            onReset={() => {
              formik.resetForm();
              if (onCancel) onCancel();
              else window.history.back();
            }}
            title={`Publish ${singularName}`}
            description="You have unsaved changes to this marketplace listing."
            buttonText={`Publish ${singularName}`}
          />
        </form>
      </PolarisFormLayout>
    </FormikProvider>
  );
}
