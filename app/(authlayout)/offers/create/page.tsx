"use client";

import React from "react";
import {
  useCreateOffer,
  useGetOfferCategories,
} from "@/graphql/actions/offers";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageCropper } from "@/components/communities/add/image-cropper";
import Image from "next/image";
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
  Camera,
} from "lucide-react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
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
  PolarisInput,
  PolarisTextarea,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";
import { PolarisEligibilityCard } from "@/components/gamification/shared/polaris-eligibility-card";

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
  memberEligibility: Yup.string().default("ALL"),
  membershipTierId: Yup.array().when("memberEligibility", {
    is: "TIERS",
    then: (schema) =>
      schema.min(1, "Please select at least one membership tier"),
    otherwise: (schema) => schema.notRequired(),
  }),
  eligibleTierIds: Yup.array().when("memberEligibility", {
    is: "TIERS",
    then: (schema) =>
      schema.min(1, "Please select at least one membership tier"),
    otherwise: (schema) => schema.notRequired(),
  }),
  eligibleUserIds: Yup.array().when("memberEligibility", {
    is: "SPECIFIC_CUSTOMERS",
    then: (schema) => schema.min(1, "Please select at least one customer"),
    otherwise: (schema) => schema.notRequired(),
  }),
  eligibleCommunityIds: Yup.array().when("memberEligibility", {
    is: "COMMUNITY",
    then: (schema) => schema.min(1, "Please select at least one community"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

function CreateOfferPage() {
  const { data: categoriesData, loading: categoriesLoading } =
    useGetOfferCategories();
  const categories = categoriesData?.getOfferCategories || [];
  const router = useRouter();
  const singularName =
    useModuleStore((state) => state.offerSingularName) || "Offer";
  const moduleName =
    useModuleStore((state) => state.offerModuleName) || "Offers";

  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [cropModalVisible, setCropModalVisible] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [coverFile, setCoverFile] = React.useState<File | null>(null);

  const [createOfferMutation, { loading: isCreating }] = useCreateOffer({
    refetchQueries: ["GetOffers", "GetOfferStats"],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success(`${singularName} Created`, {
        description: `"${formik.values.title}" has been created successfully.`,
      });
      router.push("/offers/all");
    },
    onError: (error) => {
      toast.error(
        error.message || `Failed to create ${singularName.toLowerCase()}`,
      );
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      categoryId: "",
      discount: "",
      code: "",
      validFrom: "",
      validTo: "",
      terms: "",
      website: "",
      isFeatured: false,
      isTrending: false,
      communityId: "",
      communityIds: [] as string[],
      memberEligibility: "ALL",
      membershipTierId: [] as string[],
      eligibleTierIds: [] as string[],
      eligibleUserIds: [] as string[],
      eligibleSegmentIds: [] as string[],
      eligibleCommunityIds: [] as string[],
    },
    validationSchema: offerSchema,
    onSubmit: async (values) => {
      try {
        const memberEligibility = values.memberEligibility || "ALL";
        const membershipTierId =
          values.membershipTierId || values.eligibleTierIds || [];
        const eligibleTierIds =
          values.eligibleTierIds || values.membershipTierId || [];
        const eligibleUserIds = values.eligibleUserIds || [];
        const eligibleSegmentIds = values.eligibleSegmentIds || [];
        const eligibleCommunityIds =
          values.eligibleCommunityIds || values.communityIds || [];
        const communityIds =
          values.communityIds || values.eligibleCommunityIds || [];
        const communityId =
          values.communityId || (communityIds.length > 0 ? communityIds[0] : undefined);

        await createOfferMutation({
          variables: {
            input: {
              title: values.title.trim(),
              description: values.description.trim(),
              categoryId: values.categoryId,
              discount: values.discount.trim(),
              validityStart: values.validFrom
                ? new Date(values.validFrom).toISOString()
                : new Date().toISOString(),
              validityEnd: values.validTo
                ? new Date(values.validTo).toISOString()
                : new Date().toISOString(),
              image: coverFile || undefined,
              termsAndConditions: values.terms
                ? values.terms.trim()
                : undefined,
              website: values.website ? values.website.trim() : undefined,
              status: "APPROVED",
              isActive: true,
              communityId,
              communityIds: communityIds.length > 0 ? communityIds : undefined,
              memberEligibility,
              eligibility: {
                memberEligibility,
                membershipTierId,
                eligibleTierIds,
                eligibleUserIds,
                eligibleSegmentIds,
                eligibleCommunityIds,
                communityIds,
              },
            },
          },
        });
      } catch (err) {
        // Handled in onError
      }
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setCropModalVisible(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImage: any, croppedUrl: string) => {
    setCoverFile(croppedImage);
    setImageUrl(croppedUrl);
    setCropModalVisible(false);
    setSelectedImage(null);
    toast.success("Banner image updated successfully");
  };

  const handleCancel = () => {
    router.push("/offers/all");
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (Object.keys(formik.errors).length > 0) {
      toast.error("Please review and fix the highlighted form errors.");
    }
    formik.handleSubmit();
  };

  const selectedCategory = categories.find(
    (c) => c.id === formik.values.categoryId,
  );

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
            { label: `Create ${singularName}` },
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
                  <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3 space-y-2.5 shadow-2xs">
                    {/* Visual Asset Preview */}
                    <div className="aspect-[2/1] rounded-[4px] bg-[#e1e3e5] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 flex items-center justify-center overflow-hidden relative group">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-3">
                          <FileText className="h-7 w-7 text-[#8c9196] mx-auto mb-1" />
                          <p className="text-[10.5px] font-medium text-[#616161]">
                            Upload banner to preview
                          </p>
                        </div>
                      )}
                      {formik.values.discount && (
                        <div className="absolute top-1.5 right-1.5">
                          <Badge className="bg-[#303030] dark:bg-zinc-100 text-white dark:text-zinc-900 text-[9.5px] font-bold shadow-2xs rounded-[3px] border-none">
                            {formik.values.discount}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Headline and Details */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-[13px] text-[#303030] dark:text-zinc-100 leading-tight truncate">
                          {formik.values.title || `New ${singularName} Title`}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-1 mt-1.5">
                        {selectedCategory && (
                          <Badge
                            variant="secondary"
                            className="bg-white dark:bg-zinc-800 border border-[#d2d5d9] text-[#303030] dark:text-zinc-200 text-[9.5px] font-semibold rounded-[3px]"
                          >
                            <Tag className="h-2.5 w-2.5 mr-1" />
                            {selectedCategory.name}
                          </Badge>
                        )}
                        {formik.values.isFeatured && (
                          <Badge className="bg-amber-400 text-amber-950 border-none text-[9.5px] font-bold flex items-center gap-0.5 rounded-[3px]">
                            <Star className="h-2.5 w-2.5 fill-current" />
                            Featured
                          </Badge>
                        )}
                        {formik.values.isTrending && (
                          <Badge className="bg-emerald-600 text-white border-none text-[9.5px] font-bold flex items-center gap-0.5 rounded-[3px]">
                            <TrendingUp className="h-2.5 w-2.5" />
                            Trending
                          </Badge>
                        )}
                      </div>

                      {formik.values.description && (
                        <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-1.5 line-clamp-3 leading-[15px]">
                          {formik.values.description}
                        </p>
                      )}
                    </div>

                    {/* Summary Matrix */}
                    <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                      {formik.values.code && (
                        <PolarisSummaryRow
                          label="Promo Code"
                          value={
                            <code className="px-1.5 py-0.5 rounded-[3px] bg-white dark:bg-zinc-800 border border-[#d2d5d9] text-[10px] font-mono font-bold text-[#303030] dark:text-zinc-100">
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
                      />
                      <PolarisSummaryRow
                        label="Audience"
                        value={
                          formik.values.memberEligibility === "ALL"
                            ? "All Members"
                            : formik.values.memberEligibility === "VERIFIED"
                              ? "Verified Members"
                              : formik.values.memberEligibility === "TIERS"
                                ? `Specific Tiers (${(formik.values.eligibleTierIds || formik.values.membershipTierId || []).length})`
                                : formik.values.memberEligibility === "COMMUNITY"
                                  ? `Specific Communities (${(formik.values.eligibleCommunityIds || formik.values.communityIds || []).length})`
                                  : formik.values.memberEligibility === "SPECIFIC_CUSTOMERS"
                                    ? `Specific Members (${(formik.values.eligibleUserIds || []).length})`
                                    : formik.values.memberEligibility === "OUTSIDE_PLATFORM"
                                      ? "Outside Platform (Public)"
                                      : "All Members"
                        }
                        isLast
                      />
                    </div>
                  </div>
                </PolarisSidebarCard>

                {/* Promotional Strategy Tip */}
                <PolarisTipCard title={`${singularName} Promotion Tip`}>
                  Adding a high-contrast banner image, specific redemption
                  codes, and distinct discount badges increases claim rates and
                  community engagement.
                </PolarisTipCard>
              </div>
            }
          >
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* ── Step 1: Banner & Visual Asset ──────────────────────── */}
              <PolarisFormCard
                step={1}
                title={`${singularName} Banner Asset`}
                description="Upload an eye-catching banner image (800×400px recommended)."
                badge="Visuals"
              >
                <div className="space-y-1.5">
                  <div className="relative group aspect-[2/1] w-full rounded-[6px] overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7] dark:bg-zinc-900 flex items-center justify-center">
                    <Image
                      src={
                        imageUrl ||
                        `https://cdn.thrico.network/defaultEventCover.png`
                      }
                      alt={`${singularName} banner`}
                      width={800}
                      height={400}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-8 px-3 bg-zinc-900/80 hover:bg-zinc-900 text-white backdrop-blur-xs border-none text-[12px] font-semibold shadow-md gap-1.5 cursor-pointer rounded-[4px]"
                        onClick={() =>
                          document.getElementById("offer-banner-upload")?.click()
                        }
                      >
                        <Camera className="h-3 w-3" />
                        {imageUrl ? "Change Banner Image" : "Upload Banner Image"}
                      </Button>
                    </div>
                    <input
                      id="offer-banner-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                    Supports PNG, JPG, or WebP. Optimal ratio is 2:1 for
                    seamless cross-device rendering. Max 5MB.
                  </p>
                </div>
              </PolarisFormCard>

              {/* ── Step 2: Core Information ──────────────────────────── */}
              <PolarisFormCard
                step={2}
                title="Basic Information"
                description="Provide key title, classification category, and comprehensive details."
                badge="Required"
              >
                <div className="space-y-3">
                  <PolarisInput
                    id="title"
                    name="title"
                    label={`${singularName} Title`}
                    required
                    placeholder="e.g., 50% Off Annual Cloud Hosting Subscription"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && formik.errors.title ? String(formik.errors.title) : undefined}
                  />

                  {/* Category */}
                  <div className="space-y-1">
                    <PolarisLabel required>Category</PolarisLabel>
                    <Select
                      value={formik.values.categoryId}
                      onValueChange={(value) =>
                        formik.setFieldValue("categoryId", value)
                      }
                      disabled={categoriesLoading}
                    >
                      <SelectTrigger className="h-[34px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12.5px] text-[#303030] dark:text-zinc-100 rounded-[6px]">
                        <SelectValue
                          placeholder={
                            categoriesLoading
                              ? "Loading categories..."
                              : "Select a category"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter((c) => c.isActive !== false)
                          .map((cat) => (
                            <SelectItem
                              key={cat.id}
                              value={cat.id}
                              className="text-[12.5px]"
                            >
                              {cat.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {formik.touched.categoryId && formik.errors.categoryId && (
                      <p className="text-[12px] text-[#d72c0d] font-normal leading-[16px]">
                        {formik.errors.categoryId as string}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <PolarisTextarea
                    id="description"
                    name="description"
                    label="Detailed Description"
                    required
                    rows={3}
                    placeholder="Describe the benefits, eligibility criteria, and redemption steps in detail..."
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText={`${formik.values.description.length} characters (min 20)`}
                    error={formik.touched.description && formik.errors.description ? String(formik.errors.description) : undefined}
                  />
                </div>
              </PolarisFormCard>

              {/* ── Step 3: Discount & Redemption ─────────────────────── */}
              <PolarisFormCard
                step={3}
                title="Discount & Redemption"
                description="Configure savings amount, coupon codes, and target destination URL."
                badge="Redemption"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <PolarisInput
                    id="discount"
                    name="discount"
                    label="Discount Value / Badge"
                    placeholder="e.g., 20% OFF or $50 Credit"
                    prefix={<Percent className="h-3.5 w-3.5 text-[#616161]" />}
                    value={formik.values.discount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  <PolarisInput
                    id="code"
                    name="code"
                    label="Promo / Coupon Code"
                    placeholder="e.g., COMMUNITY20"
                    className="font-mono uppercase"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {/* Website URL */}
                  <div className="sm:col-span-2">
                    <PolarisInput
                      id="website"
                      name="website"
                      type="url"
                      label="Redemption Website URL"
                      placeholder="https://partnerdomain.com/redeem"
                      prefix={<Globe className="h-3.5 w-3.5 text-[#616161]" />}
                      value={formik.values.website}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.website && formik.errors.website ? String(formik.errors.website) : undefined}
                    />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <PolarisInput
                    id="validFrom"
                    name="validFrom"
                    type="date"
                    label="Valid From"
                    required
                    prefix={<Calendar className="h-3.5 w-3.5 text-[#616161] pointer-events-none" />}
                    value={formik.values.validFrom}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.validFrom && formik.errors.validFrom ? String(formik.errors.validFrom) : undefined}
                  />

                  <PolarisInput
                    id="validTo"
                    name="validTo"
                    type="date"
                    label="Valid To"
                    required
                    prefix={<Calendar className="h-3.5 w-3.5 text-[#616161] pointer-events-none" />}
                    value={formik.values.validTo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.validTo && formik.errors.validTo ? String(formik.errors.validTo) : undefined}
                  />
                </div>
              </PolarisFormCard>

              {/* ── Step 5: Terms & Distribution ────────────────────────── */}
              <PolarisFormCard
                step={5}
                title="Terms & Distribution"
                description="Add fine print and configure platform highlight toggles."
                badge="Optional"
              >
                <div className="space-y-3">
                  <PolarisTextarea
                    id="terms"
                    name="terms"
                    label="Terms & Conditions"
                    rows={2}
                    placeholder="e.g. Valid only for first-time subscribers. Cannot be combined with other promotional codes."
                    value={formik.values.terms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {/* Highlights & Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                    <div className="flex items-center space-x-2.5 p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                      <Checkbox
                        id="isFeatured"
                        checked={formik.values.isFeatured}
                        onCheckedChange={(checked) =>
                          formik.setFieldValue("isFeatured", checked)
                        }
                        className="h-3.5 w-3.5 rounded-[3px]"
                      />
                      <label
                        htmlFor="isFeatured"
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <Star className="h-3.5 w-3.5 text-amber-500" />
                        <div>
                          <div className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                            Featured {singularName}
                          </div>
                          <div className="text-[11px] text-[#616161]">
                            Highlight in premium top carousels
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center space-x-2.5 p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                      <Checkbox
                        id="isTrending"
                        checked={formik.values.isTrending}
                        onCheckedChange={(checked) =>
                          formik.setFieldValue("isTrending", checked)
                        }
                        className="h-3.5 w-3.5 rounded-[3px]"
                      />
                      <label
                        htmlFor="isTrending"
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                        <div>
                          <div className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                            Trending {singularName}
                          </div>
                          <div className="text-[11px] text-[#616161]">
                            Display high-velocity discovery tag
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </PolarisFormCard>

              {/* ── Step 6: Audience & Eligibility ─────────────────────── */}
              <PolarisEligibilityCard
                key={`eligibility-${formik.values.memberEligibility || "ALL"}`}
                step={6}
                title="Audience & Eligibility"
                description={`Specify which communities, members, or tiers can view and claim this ${singularName.toLowerCase()}.`}
                badge="Access"
                allowOutsidePlatform={true}
                allowCommunity={true}
                eligibility={formik.values.memberEligibility || "ALL"}
                onEligibilityChange={(val) => {
                  formik.setFieldValue("memberEligibility", val);
                  if (
                    val === "ALL" ||
                    val === "VERIFIED" ||
                    val === "OUTSIDE_PLATFORM"
                  ) {
                    formik.setFieldValue("membershipTierId", []);
                    formik.setFieldValue("eligibleTierIds", []);
                    formik.setFieldValue("eligibleUserIds", []);
                    formik.setFieldValue("eligibleCommunityIds", []);
                    formik.setFieldValue("communityIds", []);
                  }
                }}
                tierIds={
                  formik.values.membershipTierId ||
                  formik.values.eligibleTierIds ||
                  []
                }
                onTierIdsChange={(tiers) => {
                  formik.setFieldValue("membershipTierId", tiers);
                  formik.setFieldValue("eligibleTierIds", tiers);
                }}
                communityIds={
                  formik.values.eligibleCommunityIds ||
                  formik.values.communityIds ||
                  []
                }
                onCommunityIdsChange={(comms) => {
                  formik.setFieldValue("eligibleCommunityIds", comms);
                  formik.setFieldValue("communityIds", comms);
                }}
                userIds={formik.values.eligibleUserIds || []}
                onUserIdsChange={(users) => {
                  formik.setFieldValue("eligibleUserIds", users);
                }}
                errorMessage={
                  formik.values.memberEligibility === "TIERS"
                    ? ((formik.touched.membershipTierId && formik.errors.membershipTierId) ||
                        (formik.touched.eligibleTierIds && formik.errors.eligibleTierIds)) as string
                    : formik.values.memberEligibility === "COMMUNITY"
                      ? ((formik.touched.eligibleCommunityIds && formik.errors.eligibleCommunityIds) ||
                          (formik.touched.communityIds && formik.errors.communityIds)) as string
                      : formik.values.memberEligibility === "SPECIFIC_CUSTOMERS"
                        ? (formik.touched.eligibleUserIds && (formik.errors.eligibleUserIds as string))
                        : null
                }
              />

              {/* Floating Action Panel */}
              <FloatingSavePanel
                hasChanged={formik.dirty}
                saved={false}
                isSaving={formik.isSubmitting || isCreating}
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

      {/* Image Cropper Modal */}
      {selectedImage && (
        <ImageCropper
          cropModalVisible={cropModalVisible}
          image={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setCropModalVisible(false);
            setSelectedImage(null);
          }}
        />
      )}
    </FormikProvider>
  );
}

export default withSubscriptionCheck(
  withModulePermission(CreateOfferPage, "OFFERS", "canCreate"),
  "offers",
);
