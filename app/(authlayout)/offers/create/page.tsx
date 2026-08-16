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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { toast } from "sonner";
import {
  Star,
  TrendingUp,
  Tag,
  Calendar,
  Globe,
  Percent,
  FileText,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Clock,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { Offer } from "@/types/offer-types";
import { useRouter } from "next/navigation";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModuleStore } from "@/store/useModuleStore";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";

const offerSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(100, "Max 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Max 2000 characters"),
  categoryId: Yup.string().required("Category is required"),
  discount: Yup.string().max(50, "Max 50 characters"),
  code: Yup.string().max(50, "Max 50 characters"),
  validFrom: Yup.date().required("Start date is required"),
  validTo: Yup.date()
    .required("End date is required")
    .min(Yup.ref("validFrom"), "End date must be after start date"),
  website: Yup.string().url("Must be a valid URL"),
  terms: Yup.string().max(1000, "Max 1000 characters"),
  isFeatured: Yup.boolean(),
  isTrending: Yup.boolean(),
});

function CreateOfferPage() {
  const { addOffer, categories } = useOfferStore();
  const router = useRouter();
  const singularName = useModuleStore((state) => state.offerSingularName) || "Offer";
  const moduleName = useModuleStore((state) => state.offerModuleName) || "Offers";

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
      toast.success(`${singularName} Created`, {
        description: `"${values.title}" has been created successfully.`,
      });
      router.push("/offers/all");
    },
  });

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (Object.keys(formik.errors).length > 0) {
      toast.error("Please review and fix the highlighted form errors.");
    }
    formik.handleSubmit();
  };

  const selectedCategory = categories.find((c) => c.id === formik.values.categoryId);

  return (
    <FormikProvider value={formik}>
      <EcosystemWrapper>
        <EcosystemHeader
          title={`Create ${singularName}`}
          badgeText="New"
          description={`Publish a new promotion, deal, or member privilege for your community.`}
          icon={Tag}
          breadcrumbs={[
            { label: moduleName, href: "/offers/all" },
            { label: "Create" },
          ]}
        />

        <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
          <PolarisFormLayout
            sidebar={
              <div className="space-y-4">
                {/* Live Preview Card */}
                <PolarisSidebarCard
                  title={`${singularName} Preview`}
                  badge="Live Preview"
                  icon={Sparkles}
                >
                  <div className="space-y-3">
                    {/* Visual Asset Preview */}
                    <div className="aspect-[2/1] rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-center overflow-hidden relative group">
                      {formik.values.image ? (
                        <img
                          src={formik.values.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <FileText className="h-8 w-8 text-zinc-400 dark:text-zinc-600 mx-auto mb-1.5" />
                          <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                            Upload banner to preview
                          </p>
                        </div>
                      )}
                      {formik.values.discount && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary text-primary-foreground text-[10px] font-bold shadow-sm">
                            {formik.values.discount}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Headline and Details */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-tight">
                          {formik.values.title || `New ${singularName} Title`}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {selectedCategory && (
                          <Badge
                            variant="secondary"
                            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[10px] font-bold"
                          >
                            <Tag className="h-2.5 w-2.5 mr-1" />
                            {selectedCategory.name}
                          </Badge>
                        )}
                        {formik.values.isFeatured && (
                          <Badge className="bg-amber-400 text-amber-950 border-none text-[10px] font-bold flex items-center gap-0.5">
                            <Star className="h-2.5 w-2.5 fill-current" />
                            Featured
                          </Badge>
                        )}
                        {formik.values.isTrending && (
                          <Badge className="bg-emerald-500 text-white border-none text-[10px] font-bold flex items-center gap-0.5">
                            <TrendingUp className="h-2.5 w-2.5" />
                            Trending
                          </Badge>
                        )}
                      </div>

                      {formik.values.description && (
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                          {formik.values.description}
                        </p>
                      )}
                    </div>

                    {/* Summary Matrix */}
                    <div className="space-y-1 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      {formik.values.code && (
                        <PolarisSummaryRow
                          label="Promo Code"
                          value={
                            <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[11px] font-mono font-bold">
                              {formik.values.code}
                            </code>
                          }
                        />
                      )}
                      <PolarisSummaryRow
                        label="Category"
                        value={selectedCategory?.name || "Not selected"}
                      />
                      <PolarisSummaryRow
                        label="Validity"
                        value={
                          formik.values.validFrom && formik.values.validTo
                            ? `${new Date(formik.values.validFrom).toLocaleDateString()} - ${new Date(formik.values.validTo).toLocaleDateString()}`
                            : formik.values.validFrom
                            ? `From ${new Date(formik.values.validFrom).toLocaleDateString()}`
                            : "Not specified"
                        }
                        isLast
                      />
                    </div>
                  </div>
                </PolarisSidebarCard>

                {/* Promotional Strategy Tip */}
                <PolarisTipCard title={`${singularName} Promotion Tip`}>
                  Adding a high-contrast banner image, specific redemption codes, and distinct discount badges increases claim rates and community engagement.
                </PolarisTipCard>
              </div>
            }
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ── Step 1: Banner & Visual Asset ──────────────────────── */}
              <PolarisFormCard
                step={1}
                title={`${singularName} Banner Asset`}
                description={`Upload an eye-catching banner image (800×400px recommended).`}
                badge="Visuals"
              >
                <div className="space-y-3">
                  <ImageUploadWithCrop
                    label=""
                    currentImage={formik.values.image}
                    onImageUpdate={(url) => formik.setFieldValue("image", url)}
                    recommendedWidth={800}
                    recommendedHeight={400}
                    aspectRatio={2}
                    maxFileSize={3}
                  />
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Supports PNG, JPG, or WebP. Optimal ratio is 2:1 for seamless cross-device rendering.
                  </p>
                </div>
              </PolarisFormCard>

              {/* ── Step 2: Core Information ──────────────────────────── */}
              <PolarisFormCard
                step={2}
                title="Basic Information"
                description={`Provide key title, classification category, and comprehensive details.`}
                badge="Required"
              >
                <div className="space-y-4">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      {singularName} Title <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., 50% Off Annual Cloud Hosting Subscription"
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

                  {/* Category */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Category <span className="text-rose-500">*</span>
                    </Label>
                    <Select
                      value={formik.values.categoryId}
                      onValueChange={(value) => formik.setFieldValue("categoryId", value)}
                    >
                      <SelectTrigger className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter((c) => c.isActive !== false)
                          .map((cat) => (
                            <SelectItem key={cat.id} value={cat.id} className="text-xs">
                              {cat.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {formik.touched.categoryId && formik.errors.categoryId && (
                      <p className="text-[11px] text-rose-500 font-medium">
                        {formik.errors.categoryId as string}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Detailed Description <span className="text-rose-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      rows={4}
                      placeholder={`Describe the benefits, eligibility criteria, and redemption steps in detail...`}
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
                      <p className="text-[10px] text-zinc-400 font-mono">
                        {formik.values.description.length} characters (min 20)
                      </p>
                    </div>
                  </div>
                </div>
              </PolarisFormCard>

              {/* ── Step 3: Discount & Redemption ─────────────────────── */}
              <PolarisFormCard
                step={3}
                title="Discount & Redemption"
                description="Configure savings amount, coupon codes, and target destination URL."
                badge="Redemption"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Discount */}
                  <div className="space-y-1.5">
                    <Label htmlFor="discount" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Discount Value / Badge
                    </Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                      <Input
                        id="discount"
                        placeholder="e.g., 20% OFF or $50 Credit"
                        value={formik.values.discount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-10 pl-9 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="space-y-1.5">
                    <Label htmlFor="code" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Promo / Coupon Code
                    </Label>
                    <Input
                      id="code"
                      placeholder="e.g., COMMUNITY20"
                      value={formik.values.code}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="h-10 font-mono bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold uppercase"
                    />
                  </div>

                  {/* Website URL */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="website" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Redemption Website URL
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://partnerdomain.com/redeem"
                        value={formik.values.website}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-10 pl-9 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                      />
                    </div>
                    {formik.touched.website && formik.errors.website && (
                      <p className="text-[11px] text-rose-500 font-medium">
                        {formik.errors.website as string}
                      </p>
                    )}
                  </div>
                </div>
              </PolarisFormCard>

              {/* ── Step 4: Validity Schedule ─────────────────────────── */}
              <PolarisFormCard
                step={4}
                title="Validity Schedule"
                description="Specify the active availability window for this opportunity."
                badge="Required"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Valid From */}
                  <div className="space-y-1.5">
                    <Label htmlFor="validFrom" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Valid From <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                      <Input
                        id="validFrom"
                        type="date"
                        value={formik.values.validFrom}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-10 pl-9 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                      />
                    </div>
                    {formik.touched.validFrom && formik.errors.validFrom && (
                      <p className="text-[11px] text-rose-500 font-medium">
                        {formik.errors.validFrom as string}
                      </p>
                    )}
                  </div>

                  {/* Valid To */}
                  <div className="space-y-1.5">
                    <Label htmlFor="validTo" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Valid To <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                      <Input
                        id="validTo"
                        type="date"
                        value={formik.values.validTo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-10 pl-9 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                      />
                    </div>
                    {formik.touched.validTo && formik.errors.validTo && (
                      <p className="text-[11px] text-rose-500 font-medium">
                        {formik.errors.validTo as string}
                      </p>
                    )}
                  </div>
                </div>
              </PolarisFormCard>

              {/* ── Step 5: Terms & Visibility ────────────────────────── */}
              <PolarisFormCard
                step={5}
                title="Terms & Distribution"
                description="Add fine print and configure platform highlight toggles."
                badge="Optional"
              >
                <div className="space-y-4">
                  {/* Terms */}
                  <div className="space-y-1.5">
                    <Label htmlFor="terms" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Terms & Conditions
                    </Label>
                    <Textarea
                      id="terms"
                      rows={3}
                      placeholder="e.g. Valid only for first-time subscribers. Cannot be combined with other promotional codes."
                      value={formik.values.terms}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="min-h-[80px] bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-medium resize-none shadow-none"
                    />
                  </div>

                  {/* Highlights & Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center space-x-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 transition-colors">
                      <Checkbox
                        id="isFeatured"
                        checked={formik.values.isFeatured}
                        onCheckedChange={(checked) =>
                          formik.setFieldValue("isFeatured", checked)
                        }
                        className="h-4 w-4 rounded-md"
                      />
                      <Label
                        htmlFor="isFeatured"
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <Star className="h-4 w-4 text-amber-500" />
                        <div>
                          <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            Featured {singularName}
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            Highlight in premium top carousels
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 transition-colors">
                      <Checkbox
                        id="isTrending"
                        checked={formik.values.isTrending}
                        onCheckedChange={(checked) =>
                          formik.setFieldValue("isTrending", checked)
                        }
                        className="h-4 w-4 rounded-md"
                      />
                      <Label
                        htmlFor="isTrending"
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        <div>
                          <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            Trending {singularName}
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            Display high-velocity discovery tag
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </div>
              </PolarisFormCard>

              {/* Floating Action Panel */}
              <FloatingSavePanel
                hasChanged={formik.dirty}
                saved={false}
                isSaving={formik.isSubmitting}
                onSave={handleSubmit}
                onReset={() => {
                  formik.resetForm();
                  handleCancel();
                }}
                title={`Unsaved ${singularName} Profile`}
                description="You have modified offer parameters."
                buttonText={`Create ${singularName}`}
              />
            </form>
          </PolarisFormLayout>
        </EcosystemContainer>
      </EcosystemWrapper>
    </FormikProvider>
  );
}

export default withSubscriptionCheck(
  withModulePermission(CreateOfferPage, "OFFERS", "canCreate"),
  "offers"
);
