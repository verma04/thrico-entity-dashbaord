"use client";

import React from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
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
import { Badge } from "@/components/ui/badge";
import {
  Store,
  MapPin,
  DollarSign,
  Tag,
  Package,
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
          <div className="space-y-6">
            {/* Live Marketplace Preview Card */}
            <PolarisSidebarCard title={`${singularName} Preview`} badge="Live Preview" icon={Sparkles}>
              <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-hidden shadow-xs">
                {/* Image Container */}
                <div className="aspect-[3/2] w-full bg-zinc-200 dark:bg-zinc-800 relative flex items-center justify-center overflow-hidden">
                  {getPrimaryImageUrl() ? (
                    <img
                      src={getPrimaryImageUrl()!}
                      alt="Listing preview"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="h-8 w-8 text-zinc-400 mx-auto mb-1 opacity-60" />
                      <p className="text-[11px] text-zinc-400 font-medium">No photo uploaded</p>
                    </div>
                  )}
                  {formik.values.category && (
                    <div className="absolute top-2.5 right-2.5">
                      <Badge
                        variant="secondary"
                        className="bg-black/60 text-white backdrop-blur-md border-none text-[10px] font-bold px-2 py-0.5"
                      >
                        {formik.values.category}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                        {formik.values.title || `${singularName} Item Title`}
                      </h4>
                      {formik.values.location && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {formik.values.location}
                        </p>
                      )}
                    </div>
                    <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 shrink-0">
                      ₹{formik.values.price ? Number(formik.values.price).toLocaleString() : "0"}
                    </span>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                    <Badge
                      variant="outline"
                      className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-none text-[10px] font-bold"
                    >
                      {getConditionLabel()}
                    </Badge>
                    {formik.values.media.length > 1 && (
                      <Badge
                        variant="outline"
                        className="bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 text-[10px] font-semibold"
                      >
                        +{formik.values.media.length - 1} photos
                      </Badge>
                    )}
                  </div>

                  {/* Description Snippet */}
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                    {formik.values.description || "Detailed item description and specifics will appear here..."}
                  </div>
                </div>
              </div>

              {/* Structured Configuration Breakdown */}
              <div className="space-y-1.5 pt-2">
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
                    <span className="truncate max-w-[150px] inline-block">
                      {formik.values.location || "Not set"}
                    </span>
                  }
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Marketplace Tip */}
            <PolarisTipCard title={`${singularName} Listing Tip`}>
              Listings featuring at least 3 bright, high-resolution photos and detailed condition explanations sell 2.8× faster in community marketplaces.
            </PolarisTipCard>
          </div>
        }
      >
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Step 1: Photos & Product Overview */}
          <PolarisFormCard
            step={1}
            title={`Visual Media & ${singularName} Overview`}
            description="Upload multi-angle photos and write a descriptive title and summary."
            badge="Required"
          >
            {/* Multi-Photo Upload */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Item Gallery (Up to 4 photos) <span className="text-rose-500">*</span>
              </Label>
              <ImageUpload
                fileList={formik.values.media}
                onFilesChange={(files) =>
                  formik.setFieldValue("media", files)
                }
              />
              {formik.touched.media && formik.errors.media && (
                <p className="text-[11px] text-rose-500 font-medium">
                  {formik.errors.media as string}
                </p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Label htmlFor="title" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {singularName} Title <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder={`e.g., Apple MacBook Pro 16" M3 Max - 64GB RAM`}
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-[11px] text-rose-500 font-medium">
                  {formik.errors.title as string}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Item Description <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe specifications, inclusions, warranty status, and reason for selling..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="min-h-[110px] bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-medium resize-none shadow-none"
              />
              <div className="flex items-center justify-between">
                {formik.touched.description && formik.errors.description ? (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.description as string}
                  </p>
                ) : <span />}
                <p className="text-[10px] text-zinc-400 font-medium">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Listing Price (₹) <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                    ₹
                  </span>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="0"
                    className="h-10 pl-8 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.price && formik.errors.price && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.price as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Taxonomy Category <span className="text-rose-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => formik.setFieldValue("category", value)}
                  value={formik.values.category}
                >
                  <SelectTrigger
                    id="category"
                    className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
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
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.category as string}
                  </p>
                )}
              </div>
            </div>

            {/* Location Input */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Label htmlFor="location" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Item Location / Pickup Region <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 z-10" />
                <GooglePlacesInput
                  id="location"
                  name="location"
                  onBlur={formik.handleBlur}
                  placeholder="Search city, neighborhood or region..."
                  className="h-10 pl-9 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
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
                <p className="text-[11px] text-rose-500 font-medium">
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
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Condition Rating <span className="text-rose-500">*</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CONDITIONS.map((cond) => {
                  const Icon = cond.icon;
                  const isSelected = formik.values.condition === cond.value;
                  return (
                    <button
                      key={cond.value}
                      type="button"
                      onClick={() => formik.setFieldValue("condition", cond.value)}
                      className={cn(
                        "relative flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                        isSelected
                          ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900/[0.04] dark:bg-zinc-100/10 ring-2 ring-zinc-900/20 dark:ring-zinc-100/20 shadow-xs"
                          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-zinc-300 dark:hover:border-zinc-700",
                      )}
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center border transition-colors shrink-0 mt-0.5",
                          isSelected
                            ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                            : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                          {cond.label}
                        </span>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                          {cond.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {formik.touched.condition && formik.errors.condition && (
                <p className="text-[11px] text-rose-500 font-medium">
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
