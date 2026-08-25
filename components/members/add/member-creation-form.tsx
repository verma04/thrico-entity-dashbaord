"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  ArrowLeft,
  Info,
  User,
  Calendar as CalendarIcon,
  Mail,
  Phone,
  MapPin,
  Globe,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Link from "next/link";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  PolarisCard,
  PolarisInput,
  PolarisTextarea,
  PolarisLabel,
  PolarisSelect,
  PolarisMultiSelect,
  PolarisCombobox,
  PolarisDatePicker,
} from "@/components/ui/platform/polaris-primitives";
import { useGetIndustries } from "@/graphql/quries/industries/industry-queries";
import { useGetSkills } from "@/graphql/quries/skills/skill-queries";
import { useGetFunctions } from "@/graphql/quries/functions/function-queries";
import { useGetInterests } from "@/graphql/quries/interests/interest-queries";
import {
  DetailedSkillsSection,
  skillValidationSchema,
} from "./detailed-skills-section";
import { useQuery } from "@apollo/client";
import { GET_MEMBERSHIP_TIERS } from "@/graphql/membership-tier";

export interface MemberCreationFormProps {
  showHeader?: boolean;
  initialValues?: any;
  loading?: boolean;
  onFinish?: (values: any) => void;
  onCancel?: () => void;
  isEdit?: boolean;
  serverError?: string | null;
  backHref?: string;
  pageTitle?: string;
  className?: string;
}

export function MemberCreationForm({
  showHeader = true,
  initialValues,
  loading = false,
  onFinish,
  onCancel,
  isEdit = false,
  serverError,
  backHref = "/members",
  pageTitle = isEdit ? "Edit member" : "Add member",
  className,
}: MemberCreationFormProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialValues?.avatar || null,
  );

  useEffect(() => {
    if (initialValues?.avatar) {
      setImageUrl(initialValues.avatar);
    }
  }, [initialValues?.avatar]);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { data: industryData } = useGetIndustries();
  const industries = industryData?.getIndustries || [];

  const { data: jobFunctionData } = useGetFunctions();
  const jobFunctions = jobFunctionData?.getFunctions || [];

  const { data: skillData } = useGetSkills();
  const skills = skillData?.getSkills || [];

  const { data: interestData } = useGetInterests();
  const interests = interestData?.getInterests || [];

  const { data: tiersData } = useQuery(GET_MEMBERSHIP_TIERS);
  const membershipTiers = tiersData?.getMembershipTiers || [];

  const memberSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .max(50, "Max 50 characters"),
    lastName: Yup.string()
      .required("Last name is required")
      .max(50, "Max 50 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    headline: Yup.string().max(100, "Max 100 characters"),
    about: Yup.string().max(500, "Max 500 characters"),
    dob: Yup.date().nullable(),
    industryIds: Yup.array().of(Yup.string()),
    jobFunctionIds: Yup.array().of(Yup.string()),
    skillIds: Yup.array().of(Yup.string()),
    skills: Yup.array().of(skillValidationSchema),
    interestIds: Yup.array().of(Yup.string()),
    membershipTierId: Yup.string().nullable(),
    phone: Yup.string().max(20, "Max 20 characters"),
    gender: Yup.string().nullable(),
    language: Yup.string().max(50, "Max 50 characters"),
    location: Yup.string().max(100, "Max 100 characters"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      email: initialValues?.email || "",
      headline: initialValues?.headline || "",
      about: initialValues?.about || "",
      dob: initialValues?.dob ? new Date(initialValues.dob) : null,
      industryIds:
        initialValues?.industries?.map((i: any) =>
          typeof i === "string" ? i : i.id,
        ) || [],
      jobFunctionIds:
        initialValues?.jobFunctions?.map((j: any) =>
          typeof j === "string" ? j : j.id,
        ) || [],
      skillIds:
        initialValues?.skills
          ?.map((s: any) => (typeof s === "string" ? s : s.id))
          .filter(Boolean) || [],
      skills:
        initialValues?.skills?.map((s: any) => ({
          name: typeof s === "string" ? s : s.name || "",
          level: s.level || "BEGINNER",
          yearsOfExperience: s.yearsOfExperience || 0,
        })) || [],
      interestIds:
        initialValues?.interests?.map((int: any) =>
          typeof int === "string" ? int : int.id,
        ) || [],
      membershipTierId:
        initialValues?.membershipTier?.id ||
        initialValues?.membershipTierId ||
        null,
      phone: initialValues?.phone || "",
      gender: initialValues?.gender || "",
      language: initialValues?.language || "",
      location: initialValues?.location || "",
    },
    validationSchema: memberSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (onFinish) {
        onFinish({
          ...values,
          avatar: imageUrl,
        });
      }
    },
  });

  const isFormModified = useMemo(() => {
    if (!initialValues) {
      return (
        formik.dirty ||
        !!imageUrl ||
        Object.values(formik.values).some((v) =>
          Array.isArray(v) ? v.length > 0 : !!v,
        )
      );
    }
    const initialAvatar = initialValues?.avatar || null;
    const avatarChanged = imageUrl !== initialAvatar;
    return formik.dirty || avatarChanged;
  }, [formik.dirty, formik.values, imageUrl, initialValues]);

  const handleInputChange = (field: string, value: any) => {
    formik.setFieldValue(field, value);
  };

  const handleImageCropComplete = (croppedImageUrl: string) => {
    setImageUrl(croppedImageUrl);
    toast.success("Profile photo updated");
  };

  const handleReset = () => {
    formik.resetForm();
    setImageUrl(initialValues?.avatar || null);
    if (onCancel) {
      onCancel();
    } else {
      router.push(backHref);
    }
  };

  const selectedTier = membershipTiers.find(
    (t: any) => t.id === formik.values.membershipTierId,
  );

  return (
    <FormikProvider value={formik}>
      <div className={cn("min-h-full pb-28", className)}>
        {/* Top Header */}
        {showHeader && (
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#d2d5d9] dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <Link
                href={backHref}
                className="inline-flex items-center justify-center h-8 w-8 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[#303030] dark:text-zinc-200 hover:bg-[#f6f6f7] transition-colors shadow-2xs"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <h1 className="text-[17px] font-semibold text-[#303030] dark:text-zinc-100 leading-tight">
                  {pageTitle}
                </h1>
                <p className="text-[12.5px] text-[#616161] dark:text-zinc-400 mt-0.5">
                  {isEdit
                    ? "Update member profile, permissions, and directory visibility."
                    : "Add a new member to your community directory and assign access tiers."}
                </p>
              </div>
            </div>
          </div>
        )}

        {serverError && (
          <Alert
            variant="destructive"
            className="mb-4 rounded-[12px] border border-[#d72c0d]/30 bg-rose-50/50"
          >
            <AlertCircle className="h-4 w-4 text-[#d72c0d]" />
            <AlertTitle className="text-[13px] font-semibold text-[#d72c0d]">
              Update Failed
            </AlertTitle>
            <AlertDescription className="text-[12px] text-[#d72c0d]/90">
              {serverError}
            </AlertDescription>
          </Alert>
        )}

        {/* Polaris 2-Column Responsive Grid */}
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start relative">
            {/* ── Left Column (Main Form - 8 Cols) ── */}
            <div className="lg:col-span-8 space-y-4">
              {/* Card 1: Member Identity & Basic Info */}
              <PolarisCard
                title="Member Identity"
                description="Personal name, contact details, demographic attributes, and professional headline."
              >
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PolarisInput
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    required
                    placeholder="e.g. Alex"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.firstName && formik.errors.firstName
                        ? String(formik.errors.firstName)
                        : null
                    }
                  />
                  <PolarisInput
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    required
                    placeholder="e.g. Mercer"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.lastName && formik.errors.lastName
                        ? String(formik.errors.lastName)
                        : null
                    }
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PolarisInput
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    required
                    placeholder="alex.mercer@company.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    prefix={<Mail className="h-4 w-4" />}
                    error={
                      formik.touched.email && formik.errors.email
                        ? String(formik.errors.email)
                        : null
                    }
                  />
                  <PolarisInput
                    id="phone"
                    name="phone"
                    type="tel"
                    label="Phone Number"
                    placeholder="+1 (555) 000-0000"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    prefix={<Phone className="h-4 w-4" />}
                  />
                </div>

                {/* Gender, Language, Location, DOB */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Gender Select */}
                  <PolarisSelect
                    id="gender"
                    label="Gender"
                    placeholder="Select gender"
                    value={formik.values.gender || ""}
                    onChange={(val) => handleInputChange("gender", val)}
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Non-Binary", label: "Non-Binary" },
                      { value: "Other", label: "Other" },
                      {
                        value: "Prefer not to say",
                        label: "Prefer not to say",
                      },
                    ]}
                  />

                  <PolarisInput
                    id="language"
                    name="language"
                    label="Preferred Language"
                    placeholder="e.g. English, French, Spanish"
                    value={formik.values.language}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    prefix={<Globe className="h-4 w-4" />}
                  />

                  <PolarisInput
                    id="location"
                    name="location"
                    label="Location"
                    placeholder="e.g. San Francisco, CA"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    prefix={<MapPin className="h-4 w-4" />}
                  />

                  {/* Date of Birth */}
                  <PolarisDatePicker
                    id="dob"
                    label="Date of Birth"
                    placeholder="Pick birth date"
                    value={formik.values.dob}
                    onChange={(date) => handleInputChange("dob", date)}
                    fromYear={1930}
                    toYear={new Date().getFullYear()}
                    defaultMonth={formik.values.dob || new Date(2000, 0, 1)}
                    allowClear
                  />
                </div>

                {/* Headline */}
                <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                  <PolarisInput
                    id="headline"
                    name="headline"
                    label="Professional Headline"
                    placeholder="e.g. Senior Product Architect & Community Advocate"
                    value={formik.values.headline}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                {/* About / Bio */}
                <PolarisTextarea
                  id="about"
                  name="about"
                  label="Member Bio & Summary"
                  placeholder="Brief summary about the member's background, journey, and community interests..."
                  value={formik.values.about}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </PolarisCard>

              {/* Card 2: Taxonomy & Community Classification */}
              <PolarisCard
                title="Taxonomy & Classification"
                description="Assign membership tiers, industry sectors, and functional domain interests."
              >
                {/* Membership Tier Combobox */}
                <PolarisCombobox
                  id="membershipTierId"
                  label="Membership Tier"
                  placeholder="Select membership tier..."
                  searchPlaceholder="Search membership tiers..."
                  value={formik.values.membershipTierId}
                  onChange={(val) =>
                    formik.setFieldValue("membershipTierId", val)
                  }
                  allowClear
                  clearLabel="None (General Member)"
                  icon={<ShieldCheck className="h-4 w-4" />}
                  options={membershipTiers.map((tier: any) => ({
                    value: tier.id,
                    label: tier.name,
                  }))}
                />

                {/* Industries Multi-Select */}
                <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                  <PolarisMultiSelect
                    id="industryIds"
                    label="Industries"
                    labelAction={
                      <span className="text-[12px] text-[#616161]">
                        {formik.values.industryIds.length} selected
                      </span>
                    }
                    placeholder="Select industries..."
                    searchPlaceholder="Search industries..."
                    values={formik.values.industryIds}
                    onChange={(vals) =>
                      formik.setFieldValue("industryIds", vals)
                    }
                    options={industries.map((ind: any) => ({
                      value: ind.id,
                      label: ind.name,
                    }))}
                  />
                </div>

                {/* Job Functions Multi-Select */}
                <PolarisMultiSelect
                  id="jobFunctionIds"
                  label="Job Functions"
                  labelAction={
                    <span className="text-[12px] text-[#616161]">
                      {formik.values.jobFunctionIds.length} selected
                    </span>
                  }
                  placeholder="Select job functions..."
                  searchPlaceholder="Search job functions..."
                  values={formik.values.jobFunctionIds}
                  onChange={(vals) =>
                    formik.setFieldValue("jobFunctionIds", vals)
                  }
                  options={jobFunctions.map((jf: any) => ({
                    value: jf.id,
                    label: jf.name,
                  }))}
                />

                {/* Topics of Interest Multi-Select */}
                <PolarisMultiSelect
                  id="interestIds"
                  label="Topics & Interests"
                  labelAction={
                    <span className="text-[12px] text-[#616161]">
                      {formik.values.interestIds.length} selected
                    </span>
                  }
                  placeholder="Select topics of interest..."
                  searchPlaceholder="Search interests..."
                  values={formik.values.interestIds}
                  onChange={(vals) =>
                    formik.setFieldValue("interestIds", vals)
                  }
                  options={interests.map((int: any) => ({
                    value: int.id,
                    label: int.name,
                  }))}
                />
              </PolarisCard>

              {/* Card 3: Skills & Competencies */}
              <DetailedSkillsSection availableSkills={skills} />
            </div>

            {/* ── Right Column (Sticky Preview & Media - 4 Cols) ── */}
            <div className="lg:col-span-4 space-y-4 self-start sticky top-6 z-20">
              {/* Profile Photo Card */}
              <PolarisCard
                title="Profile Photo"
                description="Upload headshot or avatar (1:1 square recommended)."
              >
                <div className="flex flex-col items-center justify-center p-3 rounded-[8px] bg-[#f6f6f7]/60 dark:bg-zinc-800/40 border border-[#d2d5d9] dark:border-zinc-700">
                  <div className="relative mb-3">
                    <div className="h-24 w-24 rounded-full border-2 border-white dark:border-zinc-700 shadow-sm overflow-hidden bg-white dark:bg-zinc-800 flex items-center justify-center">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt="Member Avatar"
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-10 w-10 text-[#8c9196]" />
                      )}
                    </div>
                  </div>

                  <div className="w-full">
                    <ImageUploadWithCrop
                      currentImage={imageUrl || ""}
                      onImageUpdate={handleImageCropComplete}
                      label=""
                      aspectRatio={1}
                      circularCrop={true}
                      recommendedWidth={400}
                      recommendedHeight={400}
                      uploadButtonText={
                        imageUrl ? "Change photo" : "Upload photo"
                      }
                    />
                  </div>
                </div>
              </PolarisCard>

              {/* Live Profile Card Preview */}
              <PolarisCard title="Live Member Card Preview">
                <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full border border-[#d2d5d9] bg-[#f6f6f7] flex items-center justify-center overflow-hidden shrink-0">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt="Avatar"
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-[#8c9196]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-[14px] text-[#303030] dark:text-zinc-100 truncate">
                        {[formik.values.firstName, formik.values.lastName]
                          .filter(Boolean)
                          .join(" ") || "Member Name"}
                      </h4>
                      <p className="text-[12px] text-[#616161] dark:text-zinc-400 truncate">
                        {formik.values.headline || "Professional Headline"}
                      </p>
                    </div>
                  </div>

                  {selectedTier && (
                    <div className="flex items-center gap-1.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-[11.5px] font-semibold text-[#303030] dark:text-zinc-200">
                        {selectedTier.name}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800 space-y-1.5 text-[12px] text-[#616161]">
                    <div className="flex items-center justify-between">
                      <span>Email:</span>
                      <span className="text-[#303030] dark:text-zinc-200 font-medium truncate max-w-[150px]">
                        {formik.values.email || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Location:</span>
                      <span className="text-[#303030] dark:text-zinc-200 font-medium truncate max-w-[150px]">
                        {formik.values.location || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Skills added:</span>
                      <span className="text-[#303030] dark:text-zinc-200 font-medium">
                        {formik.values.skills.length}
                      </span>
                    </div>
                  </div>
                </div>
              </PolarisCard>

              {/* Onboarding Guidance Tip */}
              <div className="rounded-[12px] border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-4">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-[13px] font-semibold text-amber-800 dark:text-amber-300">
                      Directory Best Practice
                    </h4>
                    <p className="text-[12px] text-amber-700 dark:text-amber-400 mt-1 leading-[17px]">
                      Complete profiles with verified emails and skill levels
                      receive up to 4x higher connection rates across community
                      hubs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Save Action Bar */}
          <FloatingSavePanel
            hasChanged={isFormModified}
            saved={false}
            isSaving={loading}
            onSave={() => formik.handleSubmit()}
            onReset={handleReset}
            title={isEdit ? "Unsaved member updates" : "New member draft"}
            description="You have unsaved changes to this member profile."
            buttonText={isEdit ? "Save Changes" : "Create Member"}
          />
        </form>
      </div>
    </FormikProvider>
  );
}

export default MemberCreationForm;
