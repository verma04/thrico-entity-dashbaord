"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  ArrowLeft,
  Camera,
  Info,
  User,
  Calendar as CalendarIcon,
  Mail,
  Phone,
  MapPin,
  Globe,
  ShieldCheck,
  Check,
  ChevronsUpDown,
  X,
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
} from "@/components/ui/platform/polaris-primitives";
import { useGetIndustries } from "@/graphql/quries/industries/industry-queries";
import { useGetSkills } from "@/graphql/quries/skills/skill-queries";
import { useGetFunctions } from "@/graphql/quries/functions/function-queries";
import { useGetInterests } from "@/graphql/quries/interests/interest-queries";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
    initialValues?.avatar || null
  );

  useEffect(() => {
    if (initialValues?.avatar) {
      setImageUrl(initialValues.avatar);
    }
  }, [initialValues?.avatar]);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isIndustryPopoverOpen, setIsIndustryPopoverOpen] = useState(false);
  const [isJobFunctionPopoverOpen, setIsJobFunctionPopoverOpen] = useState(false);
  const [isInterestPopoverOpen, setIsInterestPopoverOpen] = useState(false);
  const [isTierPopoverOpen, setIsTierPopoverOpen] = useState(false);

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
    email: Yup.string().email("Invalid email address").required("Email is required"),
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
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      headline: "",
      about: "",
      dob: null,
      industryIds: [],
      jobFunctionIds: [],
      skillIds: [],
      skills: [],
      interestIds: [],
      membershipTierId: null,
      gender: "",
      language: "",
      location: "",
      ...(initialValues || {}),
    },
    enableReinitialize: true,
    validationSchema: memberSchema,
    onSubmit: (values) => {
      if (onFinish) {
        onFinish({ ...values, avatar: imageUrl });
      }
    },
  });

  const isDirty = formik.dirty || imageUrl !== (initialValues?.avatar || null);

  const handleInputChange = (field: string, value: any) => {
    formik.setFieldValue(field, value);
  };

  const handleBack = () => {
    if (onCancel) {
      onCancel();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  const handleSaveAttempt = (e?: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (Object.keys(formik.errors).length > 0) {
      const firstErrorKey = Object.keys(formik.errors)[0];
      toast.error("Please review highlighted errors in the form", {
        description: String(formik.errors[firstErrorKey as keyof typeof formik.errors]),
      });

      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
    }

    formik.handleSubmit();
  };

  const handleDiscard = () => {
    formik.resetForm();
    setImageUrl(initialValues?.avatar || null);
    toast.info("Unsaved changes discarded");
  };

  const selectedTier = useMemo(() => {
    return membershipTiers.find((t: any) => t.id === formik.values.membershipTierId);
  }, [membershipTiers, formik.values.membershipTierId]);

  return (
    <FormikProvider value={formik}>
      <div
        className={cn(
          "min-h-screen bg-[#f6f6f7] dark:bg-zinc-950 text-[#303030] dark:text-zinc-100 px-4 sm:px-8 md:px-10 py-6 sm:py-8 pb-28 sm:pb-32 font-sans antialiased",
          className
        )}
      >
        <div className="max-w-[1280px] mx-auto space-y-4">
          {/* ── Page Header: Back arrow + Title (when standalone) ── */}
          {showHeader && (
            <header className="flex items-center gap-2.5 h-[48px] mb-4">
              <button
                type="button"
                onClick={handleBack}
                className="h-9 w-9 rounded-[8px] flex items-center justify-center text-[#616161] hover:text-[#303030] dark:text-zinc-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 stroke-[2.2]" />
              </button>
              <h1 className="text-[20px] font-semibold text-[#303030] dark:text-zinc-100 leading-[28px] tracking-tight">
                {pageTitle}
              </h1>
            </header>
          )}

          {/* ── Form Grid (8 Cols Main + 4 Cols Sidebar) ── */}
          <form onSubmit={handleSaveAttempt}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* ── Main Column (8 Cols) ── */}
              <div className="lg:col-span-8 space-y-4 min-w-0">
                {serverError && (
                  <Alert variant="destructive" className="rounded-xl">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Submission Error</AlertTitle>
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                )}

                {/* Card 1: Personal Identity & Contact */}
                <PolarisCard
                  title="Personal Identity & Contact"
                  description="Core personal details and contact channels for the new community member."
                >
                  {/* First & Last Name */}
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
                      error={formik.touched.firstName && formik.errors.firstName ? String(formik.errors.firstName) : null}
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
                      error={formik.touched.lastName && formik.errors.lastName ? String(formik.errors.lastName) : null}
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
                      error={formik.touched.email && formik.errors.email ? String(formik.errors.email) : null}
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
                    {/* Gender */}
                    <div className="w-full space-y-1.5">
                      <div className="flex items-center justify-between gap-2 mb-[6px]">
                        <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none">
                          Gender
                        </label>
                      </div>
                      <div className="relative">
                        <select
                          value={formik.values.gender || ""}
                          onChange={(e) => handleInputChange("gender", e.target.value)}
                          className="w-full h-[40px] pl-3 pr-9 text-[14px] text-[#303030] dark:text-zinc-100 bg-white dark:bg-zinc-900 border border-[#aeb4b9] dark:border-zinc-700 rounded-[8px] appearance-none cursor-pointer transition-all duration-150 outline-none hover:border-[#8c9196] dark:hover:border-zinc-600 focus:border-[#005bd3] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#005bd3] dark:focus:ring-blue-500"
                        >
                          <option value="" disabled>Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-Binary">Non-Binary</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#616161] dark:text-zinc-400">
                          <ChevronsUpDown className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

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
                    <div className="w-full space-y-1.5">
                      <div className="flex items-center justify-between gap-2 mb-[6px]">
                        <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none">
                          Date of Birth
                        </label>
                      </div>
                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className={cn(
                              "w-full h-[40px] px-3 text-[14px] bg-white dark:bg-zinc-900 border border-[#aeb4b9] dark:border-zinc-700 rounded-[8px] flex items-center gap-2 transition-all duration-150 outline-none hover:border-[#8c9196] dark:hover:border-zinc-600 focus:border-[#005bd3] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#005bd3] dark:focus:ring-blue-500 cursor-pointer",
                              formik.values.dob ? "text-[#303030] dark:text-zinc-100" : "text-[#8c9196] dark:text-zinc-500"
                            )}
                          >
                            <CalendarIcon className="h-4 w-4 text-[#616161] dark:text-zinc-400" />
                            {formik.values.dob ? format(formik.values.dob, "PPP") : "Pick birth date"}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formik.values.dob}
                            onSelect={(date) => {
                              handleInputChange("dob", date);
                              setIsCalendarOpen(false);
                            }}
                            initialFocus
                            captionLayout="dropdown"
                            fromYear={1930}
                            toYear={new Date().getFullYear()}
                            defaultMonth={formik.values.dob || new Date(2000, 0, 1)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
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
                  {/* Membership Tier */}
                  <div className="w-full space-y-1.5">
                    <div className="flex items-center justify-between gap-2 mb-[6px]">
                      <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none">
                        Membership Tier
                      </label>
                    </div>
                    <Popover open={isTierPopoverOpen} onOpenChange={setIsTierPopoverOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-full h-[40px] px-3 text-[14px] bg-white dark:bg-zinc-900 border border-[#aeb4b9] dark:border-zinc-700 rounded-[8px] flex items-center justify-between transition-all duration-150 outline-none hover:border-[#8c9196] dark:hover:border-zinc-600 focus:border-[#005bd3] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#005bd3] dark:focus:ring-blue-500 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-[#616161] dark:text-zinc-400" />
                            {selectedTier ? (
                              <span className="font-medium text-[#303030] dark:text-zinc-100">
                                {selectedTier.name}
                              </span>
                            ) : (
                              <span className="text-[#8c9196] dark:text-zinc-500">Select membership tier...</span>
                            )}
                          </div>
                          <ChevronsUpDown className="h-4 w-4 text-[#616161] dark:text-zinc-400" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command className="border-none">
                          <CommandInput placeholder="Search membership tiers..." className="h-10 text-[13px]" />
                          <CommandList className="max-h-[220px]">
                            <CommandEmpty>No tier found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                onSelect={() => {
                                  formik.setFieldValue("membershipTierId", null);
                                  setIsTierPopoverOpen(false);
                                }}
                                className="text-[13px] font-medium cursor-pointer"
                              >
                                <span className="text-[#8c9196]">None (General Member)</span>
                              </CommandItem>
                              {membershipTiers.map((tier: any) => (
                                <CommandItem
                                  key={tier.id}
                                  value={tier.name}
                                  onSelect={() => {
                                    formik.setFieldValue("membershipTierId", tier.id);
                                    setIsTierPopoverOpen(false);
                                  }}
                                  className="flex items-center justify-between text-[13px] font-medium cursor-pointer"
                                >
                                  <div className="flex items-center gap-2">
                                    {formik.values.membershipTierId === tier.id && (
                                      <Check className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />
                                    )}
                                    <span>{tier.name}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Industries */}
                  <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                    <div className="w-full space-y-1.5">
                      <div className="flex items-center justify-between gap-2 mb-[6px]">
                        <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none">
                          Industry Sectors
                        </label>
                      </div>
                      <Popover open={isIndustryPopoverOpen} onOpenChange={setIsIndustryPopoverOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="w-full min-h-[40px] h-auto py-2 px-3 text-[14px] bg-white dark:bg-zinc-900 border border-[#aeb4b9] dark:border-zinc-700 rounded-[8px] flex items-center justify-between transition-all duration-150 outline-none hover:border-[#8c9196] dark:hover:border-zinc-600 focus:border-[#005bd3] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#005bd3] dark:focus:ring-blue-500 cursor-pointer"
                          >
                            <div className="flex flex-wrap gap-1.5">
                              {formik.values.industryIds.length > 0 ? (
                                formik.values.industryIds.map((id: string) => {
                                  const industry = industries.find((i: any) => i.id === id);
                                  return (
                                    <Badge
                                      key={id}
                                      variant="secondary"
                                      className="bg-[#e4e5e7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 text-[11px] font-medium px-2 py-0.5 flex items-center gap-1 rounded-[6px]"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        formik.setFieldValue(
                                          "industryIds",
                                          formik.values.industryIds.filter((iid: string) => iid !== id)
                                        );
                                      }}
                                    >
                                      {industry?.title || id}
                                      <X className="h-2.5 w-2.5 cursor-pointer hover:text-[#d72c0d]" />
                                    </Badge>
                                  );
                                })
                              ) : (
                                <span className="text-[#8c9196] dark:text-zinc-500">Select one or more industries...</span>
                              )}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 text-[#616161] dark:text-zinc-400 shrink-0" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                          <Command className="border-none">
                            <CommandInput placeholder="Search industries..." className="h-10 text-[13px]" />
                            <CommandList className="max-h-[220px]">
                              <CommandEmpty>No industry found.</CommandEmpty>
                              <CommandGroup>
                                {industries.map((industry: any) => {
                                  const isSelected = formik.values.industryIds.includes(industry.id);
                                  return (
                                    <CommandItem
                                      key={industry.id}
                                      value={industry.title}
                                      onSelect={() => {
                                        const current = formik.values.industryIds;
                                        formik.setFieldValue(
                                          "industryIds",
                                          isSelected
                                            ? current.filter((id: string) => id !== industry.id)
                                            : [...current, industry.id]
                                        );
                                      }}
                                      className="flex items-center justify-between text-[13px] font-medium cursor-pointer"
                                    >
                                      <span>{industry.title}</span>
                                      {isSelected && <Check className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />}
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Job Functions */}
                  <div className="w-full space-y-1.5">
                    <div className="flex items-center justify-between gap-2 mb-[6px]">
                      <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none">
                        Job Functions & Domains
                      </label>
                    </div>
                    <Popover open={isJobFunctionPopoverOpen} onOpenChange={setIsJobFunctionPopoverOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-full min-h-[40px] h-auto py-2 px-3 text-[14px] bg-white dark:bg-zinc-900 border border-[#aeb4b9] dark:border-zinc-700 rounded-[8px] flex items-center justify-between transition-all duration-150 outline-none hover:border-[#8c9196] dark:hover:border-zinc-600 focus:border-[#005bd3] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#005bd3] dark:focus:ring-blue-500 cursor-pointer"
                        >
                          <div className="flex flex-wrap gap-1.5">
                            {formik.values.jobFunctionIds.length > 0 ? (
                              formik.values.jobFunctionIds.map((id: string) => {
                                const jf = jobFunctions.find((item: any) => item.id === id);
                                return (
                                  <Badge
                                    key={id}
                                    variant="secondary"
                                    className="bg-[#e4e5e7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 text-[11px] font-medium px-2 py-0.5 flex items-center gap-1 rounded-[6px]"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      formik.setFieldValue(
                                        "jobFunctionIds",
                                        formik.values.jobFunctionIds.filter((iid: string) => iid !== id)
                                      );
                                    }}
                                  >
                                    {jf?.title || id}
                                    <X className="h-2.5 w-2.5 cursor-pointer hover:text-[#d72c0d]" />
                                  </Badge>
                                );
                              })
                            ) : (
                              <span className="text-[#8c9196] dark:text-zinc-500">Select job functions...</span>
                            )}
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 text-[#616161] dark:text-zinc-400 shrink-0" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command className="border-none">
                          <CommandInput placeholder="Search job functions..." className="h-10 text-[13px]" />
                          <CommandList className="max-h-[220px]">
                            <CommandEmpty>No job functions found.</CommandEmpty>
                            <CommandGroup>
                              {jobFunctions.map((jf: any) => {
                                const isSelected = formik.values.jobFunctionIds.includes(jf.id);
                                return (
                                  <CommandItem
                                    key={jf.id}
                                    value={jf.title}
                                    onSelect={() => {
                                      const current = formik.values.jobFunctionIds;
                                      formik.setFieldValue(
                                        "jobFunctionIds",
                                        isSelected
                                          ? current.filter((id: string) => id !== jf.id)
                                          : [...current, jf.id]
                                      );
                                    }}
                                    className="flex items-center justify-between text-[13px] font-medium cursor-pointer"
                                  >
                                    <span>{jf.title}</span>
                                    {isSelected && <Check className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Community Interests */}
                  <div className="w-full space-y-1.5">
                    <div className="flex items-center justify-between gap-2 mb-[6px]">
                      <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none">
                        Community Topic Interests
                      </label>
                    </div>
                    <Popover open={isInterestPopoverOpen} onOpenChange={setIsInterestPopoverOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-full min-h-[40px] h-auto py-2 px-3 text-[14px] bg-white dark:bg-zinc-900 border border-[#aeb4b9] dark:border-zinc-700 rounded-[8px] flex items-center justify-between transition-all duration-150 outline-none hover:border-[#8c9196] dark:hover:border-zinc-600 focus:border-[#005bd3] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#005bd3] dark:focus:ring-blue-500 cursor-pointer"
                        >
                          <div className="flex flex-wrap gap-1.5">
                            {formik.values.interestIds.length > 0 ? (
                              formik.values.interestIds.map((id: string) => {
                                const interest = interests.find((item: any) => item.id === id);
                                return (
                                  <Badge
                                    key={id}
                                    variant="secondary"
                                    className="bg-[#e4e5e7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 text-[11px] font-medium px-2 py-0.5 flex items-center gap-1 rounded-[6px]"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      formik.setFieldValue(
                                        "interestIds",
                                        formik.values.interestIds.filter((iid: string) => iid !== id)
                                      );
                                    }}
                                  >
                                    {interest?.title || id}
                                    <X className="h-2.5 w-2.5 cursor-pointer hover:text-[#d72c0d]" />
                                  </Badge>
                                );
                              })
                            ) : (
                              <span className="text-[#8c9196] dark:text-zinc-500">Select interest tags...</span>
                            )}
                          </div>
                          <ChevronsUpDown className="ml-2 h-4 w-4 text-[#616161] dark:text-zinc-400 shrink-0" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command className="border-none">
                          <CommandInput placeholder="Search interest tags..." className="h-10 text-[13px]" />
                          <CommandList className="max-h-[220px]">
                            <CommandEmpty>No interests found.</CommandEmpty>
                            <CommandGroup>
                              {interests.map((interest: any) => {
                                const isSelected = formik.values.interestIds.includes(interest.id);
                                return (
                                  <CommandItem
                                    key={interest.id}
                                    value={interest.title}
                                    onSelect={() => {
                                      const current = formik.values.interestIds;
                                      formik.setFieldValue(
                                        "interestIds",
                                        isSelected
                                          ? current.filter((id: string) => id !== interest.id)
                                          : [...current, interest.id]
                                      );
                                    }}
                                    className="flex items-center justify-between text-[13px] font-medium cursor-pointer"
                                  >
                                    <span>{interest.title}</span>
                                    {isSelected && <Check className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </PolarisCard>

                {/* Card 3: Skills & Expertise Matrix */}
                <PolarisCard
                  title="Skills & Expertise"
                  description="Detail the member's technical and domain competencies for mentorship and matching."
                >
                  <DetailedSkillsSection entitySkills={skills} />
                </PolarisCard>
              </div>

              {/* ── Sidebar Column (4 Cols) ── */}
              <div className="lg:col-span-4 space-y-4">
                <div className="sticky top-6 space-y-4">
                  {/* Live Member Preview Card */}
                  <PolarisCard title="Member Preview">
                    <div className="flex flex-col items-center text-center p-4 bg-[#f6f6f7] dark:bg-zinc-900/60 rounded-xl border border-[#e1e3e5] dark:border-zinc-800">
                      {/* Avatar with Camera Overlay */}
                      <div className="relative group mb-3">
                        <div className="h-20 w-20 rounded-2xl bg-[#e4e5e7] dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-700 shadow-md">
                          {imageUrl ? (
                            <Image
                              src={
                                imageUrl.startsWith("http") || imageUrl.startsWith("data:")
                                  ? imageUrl
                                  : `https://cdn.thrico.network/${imageUrl}`
                              }
                              alt="Avatar"
                              width={80}
                              height={80}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <User className="h-9 w-9 text-[#8c9196]" />
                          )}
                        </div>

                        <div className="absolute -bottom-1.5 -right-1.5">
                          <ImageUploadWithCrop
                            currentImage={imageUrl || ""}
                            onImageUpdate={setImageUrl}
                            label=""
                            aspectRatio={1}
                            className="p-0"
                            dropzoneClassName="h-7 w-7 rounded-full bg-[#303030] dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-md p-0 border border-white dark:border-zinc-800 cursor-pointer"
                            previewClassName="hidden"
                          >
                            <Camera className="h-3.5 w-3.5" />
                          </ImageUploadWithCrop>
                        </div>
                      </div>

                      <h3 className="text-[14px] font-semibold text-[#303030] dark:text-zinc-100 truncate max-w-full">
                        {formik.values.firstName || formik.values.lastName
                          ? `${formik.values.firstName} ${formik.values.lastName}`.trim()
                          : "New Member"}
                      </h3>
                      <p className="text-[12px] font-medium text-[#616161] dark:text-zinc-400 mt-0.5 truncate max-w-full">
                        {formik.values.headline || "Professional Headline"}
                      </p>

                      {selectedTier && (
                        <Badge
                          variant="outline"
                          className="mt-2.5 bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 border-none text-[11px] font-medium px-2 py-0.5 rounded-[6px]"
                        >
                          {selectedTier.name}
                        </Badge>
                      )}
                    </div>

                    {/* Summary Rows */}
                    <div className="space-y-2 mt-4">
                      {[
                        { label: "Email", value: formik.values.email || "Not specified" },
                        { label: "Phone", value: formik.values.phone || "Not specified" },
                        { label: "Location", value: formik.values.location || "Not specified" },
                        { label: "Industries", value: formik.values.industryIds.length > 0 ? `${formik.values.industryIds.length} Selected` : "None" },
                        { label: "Skills", value: formik.values.skills && formik.values.skills.length > 0 ? `${formik.values.skills.length} Added` : "None" },
                      ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between py-1 text-[12.5px]">
                          <span className="text-[#616161] dark:text-zinc-400 font-medium">{row.label}</span>
                          <span className="text-[#303030] dark:text-zinc-200 font-medium truncate max-w-[150px] text-right">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </PolarisCard>

                  {/* Welcome Delivery Card */}
                  <PolarisCard>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-[#616161] dark:text-zinc-400" />
                      <h3 className="text-[14px] font-semibold text-[#303030] dark:text-zinc-100 leading-[20px]">
                        Welcome Delivery
                      </h3>
                    </div>
                    <div className="text-[12.5px] text-[#616161] dark:text-zinc-400 space-y-2 leading-[18px]">
                      <p>
                        An automatic invitation email will be dispatched to{" "}
                        <strong className="text-[#303030] dark:text-zinc-200">{formik.values.email || "the member's email"}</strong> with secure onboarding credentials.
                      </p>
                      <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                        <Link
                          href="/email"
                          className="text-[12px] font-medium text-[#005bd3] dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          Configure Email Templates →
                        </Link>
                      </div>
                    </div>
                  </PolarisCard>

                  {/* Tip Card */}
                  <div className="rounded-[12px] border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-[13px] font-semibold text-amber-800 dark:text-amber-300 leading-[18px]">
                          Member Onboarding Tip
                        </h4>
                        <p className="text-[12.5px] text-amber-700 dark:text-amber-400 mt-1 leading-[18px]">
                          Assigning accurate industries and membership tiers upfront unlocks personalized content feeds, private discussion channels, and targeted gamification rewards.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* ── Floating Save Panel ── */}
        <FloatingSavePanel
          hasChanged={isDirty}
          saved={false}
          isSaving={loading}
          onSave={() => handleSaveAttempt()}
          onReset={handleDiscard}
          title={isEdit ? "Unsaved member edits" : "Unsaved member"}
          description="You have modified the member profile information."
          buttonText={isEdit ? "Save member" : "Create member"}
          discardButtonText="Discard"
        />
      </div>
    </FormikProvider>
  );
}

export default MemberCreationForm;
