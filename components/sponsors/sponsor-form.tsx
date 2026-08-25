"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  PolarisInput,
  PolarisTextarea,
  PolarisLabel,
} from "@/components/ui/platform/polaris-primitives";
import { Switch } from "@/components/ui/switch";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateSponsor,
  useUpdateSponsor,
} from "@/graphql/actions/sponsors";
import { useGetSponsorCategories } from "@/graphql/actions/sponsorCategories";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  HeartHandshake,
  Globe,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
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

interface SponsorFormProps {
  initialData?: any;
  isEdit?: boolean;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().nullable(),
  externalUrl: Yup.string()
    .test("is-url-valid", "Must be a valid URL", (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    })
    .nullable(),
  isActive: Yup.boolean().required("Status is required"),
  categoryId: Yup.string().nullable(),
});

export default function SponsorForm({ initialData, isEdit }: SponsorFormProps) {
  const router = useRouter();
  const [createSponsor, { loading: creating }] = useCreateSponsor();
  const [updateSponsor, { loading: updating }] = useUpdateSponsor();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: categoriesData } = useGetSponsorCategories();

  const initialValues = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    externalUrl: initialData?.externalUrl || "",
    isActive: initialData?.isActive ?? true,
    categoryId: initialData?.categoryId || "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    if (!imageFile && !initialData?.image) {
      toast.error("Sponsor image is required");
      return;
    }

    try {
      const input: any = {
        title: values.title,
        description: values.description,
        externalUrl: values.externalUrl,
        isActive: values.isActive,
        categoryId: values.categoryId || null,
      };

      if (imageFile) {
        input.imageUpload = imageFile;
      }

      if (isEdit && initialData?.id) {
        await updateSponsor({
          variables: { id: initialData.id, input },
        });
        toast.success("Sponsor updated successfully");
      } else {
        await createSponsor({
          variables: { input },
        });
        toast.success("Sponsor created successfully");
      }
      router.push("/sponsors/all");
    } catch (error) {
      toast.error(`Failed to ${isEdit ? "update" : "create"} sponsor`);
      console.error(error);
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={isEdit ? "Edit Sponsor" : "Create Sponsor"}
        description={
          isEdit
            ? "Update sponsor details and manage their platform exposure."
            : "Add a new commercial partner or sponsor to feature on your platform."
        }
        badgeText="Partners Studio"
        icon={HeartHandshake}
        breadcrumbs={[
          { label: "Sponsors", href: "/sponsors/all" },
          { label: isEdit ? "Edit Sponsor" : "Create Sponsor" },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            setFieldValue,
            handleChange,
            handleBlur,
            errors,
            touched,
            dirty,
            handleSubmit: formikSubmit,
            resetForm,
          }) => {
            const getSelectedCategoryName = () => {
              if (!values.categoryId) return "None";
              const cat = categoriesData?.getSponsorCategories?.find(
                (c: any) => c.id === values.categoryId,
              );
              return cat ? cat.title : "Assigned";
            };

            return (
              <PolarisFormLayout
                sidebar={
                  <div className="space-y-4">
                    {/* Live Partner Preview Card */}
                    <PolarisSidebarCard
                      title="Sponsor Preview"
                      badge="Live Brand"
                      icon={Sparkles}
                    >
                      <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 overflow-hidden shadow-xs">
                        {/* Logo Container */}
                        <div className="w-full aspect-[4/3] relative bg-white dark:bg-zinc-800/80 flex items-center justify-center p-4 border-b border-[#e1e3e5] dark:border-zinc-800">
                          {imageFile ? (
                            <Image
                              src={URL.createObjectURL(imageFile)}
                              alt="Preview"
                              fill
                              className="object-contain p-4"
                            />
                          ) : initialData?.image ? (
                            <Image
                              src={initialData.image}
                              alt="Preview"
                              fill
                              className="object-contain p-4"
                            />
                          ) : (
                            <div className="text-[#8c9196] text-[12px] flex flex-col items-center gap-2">
                              <HeartHandshake className="h-8 w-8 opacity-30" />
                              <span className="text-[11px] font-medium">
                                Brand Logo Preview
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="p-3.5 space-y-2.5">
                          <h4 className="font-semibold text-[14px] text-[#303030] dark:text-zinc-100 text-center truncate">
                            {values.title || "Sponsor Title"}
                          </h4>

                          {values.description && (
                            <p className="text-[12px] text-[#616161] dark:text-zinc-400 text-center leading-[16px] line-clamp-3">
                              {values.description}
                            </p>
                          )}

                          {values.externalUrl && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full h-8 text-[12px] font-semibold gap-1.5 border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 pointer-events-none rounded-[6px]"
                            >
                              <Globe className="h-3.5 w-3.5 text-[#616161]" />
                              Visit Partner Website
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Structured Configuration Breakdown */}
                      <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                        <PolarisSummaryRow
                          label="Partner Name"
                          value={
                            <span className="truncate max-w-[150px] inline-block font-semibold">
                              {values.title || "Not specified"}
                            </span>
                          }
                        />
                        <PolarisSummaryRow
                          label="Category"
                          value={getSelectedCategoryName()}
                        />
                        <PolarisSummaryRow
                          label="External Link"
                          value={values.externalUrl ? "Configured" : "None"}
                        />
                        <PolarisSummaryRow
                          label="Visibility"
                          value={values.isActive ? "Active (Live)" : "Hidden"}
                          isLast
                        />
                      </div>
                    </PolarisSidebarCard>

                    {/* Partnership Strategy Tip */}
                    <PolarisTipCard title="Sponsorship Exposure Tip">
                      High-contrast vector logos with transparent backgrounds
                      maintain optimal fidelity across dark and light dashboard
                      themes.
                    </PolarisTipCard>
                  </div>
                }
              >
                <Form className="space-y-4">
                  {/* Step 1: Partner Brand & Identity */}
                  <PolarisFormCard
                    step={1}
                    title="Partner Brand & Identity"
                    description="Upload the brand mark logo, partner title, and promotional description."
                    badge="Required"
                  >
                    {/* Image Upload Box */}
                    <div className="space-y-1.5">
                      <PolarisLabel required>Sponsor Logo / Asset</PolarisLabel>
                      <div className="w-full max-w-sm">
                        <ImageUploadWithCrop
                          returnFileOnly={true}
                          onFileChange={(file) => {
                            setImageFile(file);
                          }}
                          onImageUpdate={() => {}}
                          aspectRatio={4 / 3}
                          recommendedWidth={400}
                          currentImage={initialData?.image || undefined}
                          label=""
                        />
                      </div>
                      <p className="text-[11.5px] text-[#616161]">
                        Recommended aspect ratio is 4:3 (400 × 300px). Supports
                        PNG, JPG, WEBP.
                      </p>
                    </div>

                    {/* Title */}
                    <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                      <PolarisInput
                        id="title"
                        name="title"
                        label="Sponsor / Organization Name"
                        required
                        placeholder="e.g., Acme Innovations Corp"
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.title && errors.title
                            ? String(errors.title)
                            : null
                        }
                      />
                    </div>

                    {/* Description */}
                    <PolarisTextarea
                      id="description"
                      name="description"
                      label="Partner Profile & Offer Summary"
                      placeholder="Brief summary about the sponsor partnership, community perks, or mission..."
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </PolarisFormCard>

                  {/* Step 2: Destination Link & Taxonomy */}
                  <PolarisFormCard
                    step={2}
                    title="Destination Link & Taxonomy Tier"
                    description="Set up click-through destination URLs and assign sponsorship classification."
                    badge="Placement"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* External URL */}
                      <PolarisInput
                        id="externalUrl"
                        name="externalUrl"
                        type="url"
                        label="External Website Destination (URL)"
                        placeholder="https://partner-website.com"
                        prefix={<LinkIcon className="h-4 w-4" />}
                        value={values.externalUrl}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.externalUrl && errors.externalUrl
                            ? String(errors.externalUrl)
                            : null
                        }
                      />

                      {/* Category Select */}
                      <div className="space-y-1.5">
                        <PolarisLabel>Sponsorship Category / Tier</PolarisLabel>
                        <Select
                          value={values.categoryId || "none"}
                          onValueChange={(val) =>
                            setFieldValue(
                              "categoryId",
                              val === "none" ? "" : val,
                            )
                          }
                        >
                          <SelectTrigger className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]">
                            <SelectValue placeholder="Select tier or category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              No Specific Category
                            </SelectItem>
                            {categoriesData?.getSponsorCategories?.map(
                              (cat: any) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.title}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Active Status Switch Card */}
                    <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                      <div className="flex items-center justify-between p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40">
                        <div className="space-y-0.5">
                          <label className="text-[13px] font-semibold text-[#303030] dark:text-zinc-200">
                            Active Visibility Status
                          </label>
                          <p className="text-[11.5px] text-[#616161] dark:text-zinc-400">
                            Determines if this sponsor is actively displayed
                            across community portals.
                          </p>
                        </div>
                        <Switch
                          checked={values.isActive}
                          onCheckedChange={(val) =>
                            setFieldValue("isActive", val)
                          }
                        />
                      </div>
                    </div>
                  </PolarisFormCard>

                  {/* Floating Action Bar */}
                  <FloatingSavePanel
                    hasChanged={dirty || !!imageFile}
                    saved={false}
                    isSaving={creating || updating}
                    onSave={() => formikSubmit()}
                    onReset={() => {
                      resetForm();
                      setImageFile(null);
                      router.back();
                    }}
                    title={
                      isEdit ? "Save Sponsor Changes" : "Publish Sponsor"
                    }
                    description="You have unsaved changes to this partner configuration."
                    buttonText={isEdit ? "Update Sponsor" : "Publish Sponsor"}
                  />
                </Form>
              </PolarisFormLayout>
            );
          }}
        </Formik>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
