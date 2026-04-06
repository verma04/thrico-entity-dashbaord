"use client";

import React from "react";
import { useOfferStore } from "@/store/useOfferStore";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { useToast } from "@/components/ui/use-toast";
import {
  Save,
  Star,
  TrendingUp,
  Tag,
  Calendar,
  Globe,
  ChevronRight,
  Percent,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Offer } from "@/types/offer-types";
import { useRouter } from "next/navigation";

const offerSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters"),
  categoryId: Yup.string().required("Category is required"),
  discount: Yup.string(),
  code: Yup.string(),
  validFrom: Yup.date().required("Start date is required"),
  validTo: Yup.date()
    .required("End date is required")
    .min(Yup.ref("validFrom"), "End date must be after start date"),
  website: Yup.string().url("Must be a valid URL"),
});

export default function CreateOfferPage() {
  const { addOffer, categories } = useOfferStore();
  const { toast } = useToast();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      image: "",
      categoryId: "",
      discount: "",
      code: "",
      validFrom: "",
      validTo: "",
      terms: "",
      website: "",
      isFeatured: false,
      isTrending: false,
    },
    validationSchema: offerSchema,
    onSubmit: (values) => {
      const now = new Date().toISOString();

      const offerData: Offer = {
        id: `offer-${Date.now()}`,
        ...values,
        categoryName: categories.find((c) => c.id === values.categoryId)?.name,
        status: "approved",
        source: "admin",
        addedBy: "admin",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };

      addOffer(offerData);
      toast({
        title: "Offer Created",
        description: `"${values.title}" has been created.`,
      });
      router.push("/offers/all");
    },
  });

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden rounded-t-[inherit]">
      {/* Header section - Sticky */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Create New Offer
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
              <span>Offers</span>
              <ChevronRight className="h-3 w-3" />
              <span>Create New</span>
            </div>
          </div>
          <div className="hidden sm:flex gap-3">
            <Button
              variant="outline"
              type="button"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => formik.handleSubmit()}
              disabled={!formik.isValid || formik.isSubmitting}
              className="shadow-sm border-primary/20"
            >
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Create Offer
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <form className="space-y-8">
                {/* Image Upload */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">Offer Image</CardTitle>
                    <CardDescription>
                      Upload an eye-catching image for your offer (800x400px
                      recommended)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ImageUploadWithCrop
                      label=""
                      currentImage={formik.values.image}
                      onImageUpdate={(url) =>
                        formik.setFieldValue("image", url)
                      }
                      recommendedWidth={800}
                      recommendedHeight={400}
                      aspectRatio={2}
                      maxFileSize={3}
                    />
                  </CardContent>
                </Card>

                {/* Basic Info */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">Basic Information</CardTitle>
                    <CardDescription>
                      Core details about your offer
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">
                        Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        {...formik.getFieldProps("title")}
                        placeholder="e.g., 50% Off Summer Sale"
                        className={cn(
                          formik.touched.title &&
                            formik.errors.title &&
                            "border-destructive"
                        )}
                      />
                      {formik.touched.title && formik.errors.title && (
                        <p className="text-xs text-destructive">
                          {formik.errors.title}
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
                        {...formik.getFieldProps("description")}
                        rows={4}
                        placeholder="Describe the offer in detail..."
                        className={cn(
                          "resize-none",
                          formik.touched.description &&
                            formik.errors.description &&
                            "border-destructive"
                        )}
                      />
                      {formik.touched.description &&
                        formik.errors.description && (
                          <p className="text-xs text-destructive">
                            {formik.errors.description}
                          </p>
                        )}
                      <p className="text-[11px] text-muted-foreground text-right italic">
                        {formik.values.description.length} characters (min 20)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Category <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formik.values.categoryId}
                        onValueChange={(value) =>
                          formik.setFieldValue("categoryId", value)
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            formik.touched.categoryId &&
                              formik.errors.categoryId &&
                              "border-destructive"
                          )}
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter((c) => c.isActive)
                            .map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {formik.touched.categoryId &&
                        formik.errors.categoryId && (
                          <p className="text-xs text-destructive">
                            {formik.errors.categoryId}
                          </p>
                        )}
                    </div>
                  </CardContent>
                </Card>

                {/* Discount & Promo */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">
                      Discount & Promo Code
                    </CardTitle>
                    <CardDescription>
                      Set the discount amount and promo code
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="discount"
                          className="text-sm font-medium"
                        >
                          Discount
                        </Label>
                        <div className="relative">
                          <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="discount"
                            {...formik.getFieldProps("discount")}
                            placeholder="e.g., 20% OFF"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="code" className="text-sm font-medium">
                          Promo Code
                        </Label>
                        <Input
                          id="code"
                          {...formik.getFieldProps("code")}
                          placeholder="SAVE20"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Validity Period */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">Validity Period</CardTitle>
                    <CardDescription>
                      Set the start and end dates for this offer
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="validFrom"
                          className="text-sm font-medium"
                        >
                          Valid From <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                          <Input
                            id="validFrom"
                            type="date"
                            {...formik.getFieldProps("validFrom")}
                            className={cn(
                              "pl-10",
                              formik.touched.validFrom &&
                                formik.errors.validFrom &&
                                "border-destructive"
                            )}
                          />
                        </div>
                        {formik.touched.validFrom &&
                          formik.errors.validFrom && (
                            <p className="text-xs text-destructive">
                              {formik.errors.validFrom}
                            </p>
                          )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="validTo" className="text-sm font-medium">
                          Valid To <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                          <Input
                            id="validTo"
                            type="date"
                            {...formik.getFieldProps("validTo")}
                            className={cn(
                              "pl-10",
                              formik.touched.validTo &&
                                formik.errors.validTo &&
                                "border-destructive"
                            )}
                          />
                        </div>
                        {formik.touched.validTo && formik.errors.validTo && (
                          <p className="text-xs text-destructive">
                            {formik.errors.validTo}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Details */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">
                      Additional Details
                    </CardTitle>
                    <CardDescription>
                      Website URL and terms & conditions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm font-medium">
                        Website URL
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="website"
                          {...formik.getFieldProps("website")}
                          placeholder="https://example.com"
                          type="url"
                          className="pl-10"
                        />
                      </div>
                      {formik.touched.website && formik.errors.website && (
                        <p className="text-xs text-destructive">
                          {formik.errors.website}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="terms" className="text-sm font-medium">
                        Terms & Conditions
                      </Label>
                      <Textarea
                        id="terms"
                        {...formik.getFieldProps("terms")}
                        rows={3}
                        placeholder="Additional terms..."
                        className="resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Options */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">Admin Options</CardTitle>
                    <CardDescription>
                      Feature and trending settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                      <Checkbox
                        id="isFeatured"
                        checked={formik.values.isFeatured}
                        onCheckedChange={(checked) =>
                          formik.setFieldValue("isFeatured", checked)
                        }
                      />
                      <Label
                        htmlFor="isFeatured"
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <Star className="h-4 w-4 text-yellow-500" />
                        <div>
                          <div className="font-medium">Featured Offer</div>
                          <div className="text-xs text-muted-foreground">
                            Display this offer prominently
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                      <Checkbox
                        id="isTrending"
                        checked={formik.values.isTrending}
                        onCheckedChange={(checked) =>
                          formik.setFieldValue("isTrending", checked)
                        }
                      />
                      <Label
                        htmlFor="isTrending"
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <div>
                          <div className="font-medium">Trending Offer</div>
                          <div className="text-xs text-muted-foreground">
                            Mark as trending
                          </div>
                        </div>
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Live Preview Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Offer Preview</h3>
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
                    <div className="aspect-[2/1] rounded-lg bg-muted/50 border border-border flex items-center justify-center overflow-hidden">
                      {formik.values.image ? (
                        <img
                          src={formik.values.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No image uploaded
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-lg leading-tight flex-1">
                          {formik.values.title || "Offer Title"}
                        </h4>
                        {formik.values.discount && (
                          <Badge className="bg-primary text-primary-foreground">
                            {formik.values.discount}
                          </Badge>
                        )}
                      </div>
                      {formik.values.code && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {formik.values.code}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {formik.values.categoryId && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/5 text-primary border-primary/10"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {categories.find(
                            (c) => c.id === formik.values.categoryId
                          )?.name || "Category"}
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
                          "Describe your offer in detail..."}
                      </p>
                    </div>

                    {(formik.values.validFrom || formik.values.validTo) && (
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          Validity
                        </h5>
                        <p className="text-sm text-foreground/80">
                          {formik.values.validFrom && (
                            <span>
                              From{" "}
                              {new Date(
                                formik.values.validFrom
                              ).toLocaleDateString()}
                            </span>
                          )}
                          {formik.values.validFrom &&
                            formik.values.validTo && <span> • </span>}
                          {formik.values.validTo && (
                            <span>
                              To{" "}
                              {new Date(
                                formik.values.validTo
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    <Button className="w-full mt-4" disabled>
                      Claim Offer
                    </Button>

                    <p className="text-[10px] text-center text-muted-foreground italic">
                      Preview version - Final layout may vary slightly
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
