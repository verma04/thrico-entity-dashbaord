"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ShoppingBag,
  MapPin,
  DollarSign,
  ChevronRight,
  Save,
  Tag,
  Package,
  Image as ImageIcon,
} from "lucide-react";
import GooglePlacesInput from "@/components/layout/google-place-input";
import { ImageUpload } from "./image-upload";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { cn } from "@/lib/utils";

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
  { value: "NEW", label: "New", description: "Brand new, unused item" },
  { value: "USED_LIKE_NEW", label: "Like New", description: "No visible wear" },
  {
    value: "USED_LIKE_GOOD",
    label: "Good",
    description: "Minor signs of wear",
  },
  { value: "USED_LIKE_FAIR", label: "Fair", description: "Noticeable wear" },
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
    .min(0, "Price must be greater than 0"),
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

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden rounded-t-[inherit]">
      {/* Header section - Sticky */}
      {/* Header section - Sticky */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Create Marketplace Listing
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
              <span>Listings</span>
              <ChevronRight className="h-3 w-3" />
              <span>Create New Listing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <form className="space-y-8">
                {/* Photos */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">Photos</CardTitle>
                    <CardDescription>
                      Upload clear photos of your item (up to 4 images)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ImageUpload
                      fileList={formik.values.media}
                      onFilesChange={(files) =>
                        formik.setFieldValue("media", files)
                      }
                    />
                    {formik.touched.media && formik.errors.media && (
                      <p className="text-xs text-destructive mt-2">
                        {String(formik.errors.media)}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Basic Info */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">Basic Information</CardTitle>
                    <CardDescription>
                      Core details about your listing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">
                        Listing Title{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g., iPhone 14 Pro Max 256GB"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={cn(
                          formik.touched.title &&
                            formik.errors.title &&
                            "border-destructive"
                        )}
                      />
                      {formik.touched.title && formik.errors.title && (
                        <p className="text-xs text-destructive">
                          {String(formik.errors.title)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Description <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your item in detail..."
                        className={cn(
                          "min-h-[120px] resize-none",
                          formik.touched.description &&
                            formik.errors.description &&
                            "border-destructive"
                        )}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.description &&
                        formik.errors.description && (
                          <p className="text-xs text-destructive">
                            {String(formik.errors.description)}
                          </p>
                        )}
                      <p className="text-[11px] text-muted-foreground text-right italic">
                        {formik.values.description.length} characters (min 10)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing & Location */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">
                      Pricing & Location
                    </CardTitle>
                    <CardDescription>
                      Set your price and where the item is located
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-sm font-medium">
                          Price (₹) <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            placeholder="0"
                            className={cn(
                              "pl-10",
                              formik.touched.price &&
                                formik.errors.price &&
                                "border-destructive"
                            )}
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </div>
                        {formik.touched.price && formik.errors.price && (
                          <p className="text-xs text-destructive">
                            {String(formik.errors.price)}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="location"
                          className="text-sm font-medium"
                        >
                          Location <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                          <GooglePlacesInput
                            id="location"
                            name="location"
                            onBlur={formik.handleBlur}
                            placeholder="City, Country"
                            className={cn(
                              "pl-10",
                              formik.touched.location &&
                                formik.errors.location &&
                                "border-destructive"
                            )}
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
                              console.log("Location selected:", loc);
                              formik.setFieldValue(
                                "location",
                                loc.address || loc.name
                              );
                            }}
                          />
                        </div>
                        {formik.touched.location && formik.errors.location && (
                          <p className="text-xs text-destructive">
                            {String(formik.errors.location)}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Category & Condition */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">
                      Category & Condition
                    </CardTitle>
                    <CardDescription>
                      Classify your item and describe its condition
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          formik.setFieldValue("category", value)
                        }
                        value={formik.values.category}
                      >
                        <SelectTrigger
                          id="category"
                          className={cn(
                            formik.touched.category &&
                              formik.errors.category &&
                              "border-destructive"
                          )}
                        >
                          <SelectValue placeholder="Select a category" />
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
                        <p className="text-xs text-destructive">
                          {String(formik.errors.category)}
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Condition <span className="text-destructive">*</span>
                      </Label>
                      <RadioGroup
                        value={formik.values.condition}
                        onValueChange={(val) =>
                          formik.setFieldValue("condition", val)
                        }
                      >
                        <div className="space-y-3">
                          {CONDITIONS.map((condition) => (
                            <div
                              key={condition.value}
                              className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                            >
                              <RadioGroupItem
                                value={condition.value}
                                id={condition.value}
                                className="mt-0.5"
                              />
                              <Label
                                htmlFor={condition.value}
                                className="flex-1 cursor-pointer"
                              >
                                <span className="font-medium block">
                                  {condition.label}
                                </span>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {condition.description}
                                </p>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                      {formik.touched.condition && formik.errors.condition && (
                        <p className="text-xs text-destructive">
                          {String(formik.errors.condition)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Live Preview Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Listing Preview</h3>
                  <Badge
                    variant="outline"
                    className="bg-green-500/5 text-green-600 border-green-500/20"
                  >
                    Live Preview
                  </Badge>
                </div>

                <Card className="border-none shadow-xl ring-1 ring-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
                  <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
                  <CardContent className="pt-6 space-y-6">
                    {/* Image Preview */}
                    <div className="aspect-video rounded-lg bg-muted/50 border border-border flex items-center justify-center overflow-hidden">
                      {formik.values.media.length > 0 ? (
                        <img
                          src={
                            formik.values.media[0].file
                              ? URL.createObjectURL(formik.values.media[0].file)
                              : formik.values.media[0].thumbUrl || formik.values.media[0].url || ""
                          }
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No image uploaded
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-lg leading-tight">
                        {formik.values.title || "Listing Title"}
                      </h4>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">
                          ₹{formik.values.price || "0"}
                        </span>
                        {formik.values.condition && (
                          <Badge variant="secondary" className="text-xs">
                            {CONDITIONS.find(
                              (c) => c.value === formik.values.condition
                            )?.label || formik.values.condition}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {formik.values.location && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/5 text-primary border-primary/10"
                        >
                          <MapPin className="h-3 w-3 mr-1" />
                          {formik.values.location}
                        </Badge>
                      )}
                      {formik.values.category && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-500/5 text-blue-600 border-blue-500/10"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {formik.values.category}
                        </Badge>
                      )}
                    </div>

                    <Separator className="opacity-50" />

                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Description
                      </h5>
                      <p className="text-sm line-clamp-4 text-foreground/80 leading-relaxed">
                        {formik.values.description ||
                          "Describe your item in detail..."}
                      </p>
                    </div>

                    <Button className="w-full mt-4" disabled>
                      Contact Seller
                    </Button>

                    <p className="text-[10px] text-center text-muted-foreground italic">
                      Preview version - Final layout may vary slightly
                    </p>
                  </CardContent>
                </Card>

                <div className="p-4 rounded-xl bg-muted/30 border border-dashed border-border flex items-start gap-4">
                  <div className="mt-1 p-1 bg-primary/20 rounded-full">
                    <Package className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Make sure your photos are clear and your description is
                    detailed to attract more buyers.
                  </p>
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
        onSave={() => formik.handleSubmit()}
        onReset={() => {
          formik.resetForm();
          if (onCancel) onCancel();
          else window.history.back();
        }}
        title="Unsaved Marketplace Listing"
        description="You have unfilled form data."
        buttonText="Publish Listing"
      />
    </div>
  );
}
