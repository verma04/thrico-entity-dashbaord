"use client";

import { useEffect, useState, useMemo } from "react";
import {
  FormikProvider,
  useFormik,
} from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Camera,
  Info,
  User,
  Calendar as CalendarIcon,
  Mail,
  Phone,
  Layout,
  Plus,
  MapPin,
  Globe,
  Briefcase,
  Sparkles,
  ShieldCheck,
  Check,
  ChevronsUpDown,
  X,
  Layers,
  TrendingUp,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DetailedSkillsSection,
  skillValidationSchema,
} from "./detailed-skills-section";
import { useQuery } from "@apollo/client";
import { GET_MEMBERSHIP_TIERS } from "@/graphql/membership-tier";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInfoBanner,
} from "@/components/gamification/shared/polaris-form-ui";

export function MemberCreationForm({
  initialValues,
  loading,
  onFinish,
  onCancel,
  isEdit = false,
  serverError,
}: any) {
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
      onFinish({ ...values, avatar: imageUrl });
    },
  });

  const handleInputChange = (field: string, value: any) => {
    formik.setFieldValue(field, value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (Object.keys(formik.errors).length > 0) {
      toast.error("Please review and fix the highlighted form errors.");
    }

    formik.handleSubmit();
  };

  const selectedTier = useMemo(() => {
    return membershipTiers.find((t: any) => t.id === formik.values.membershipTierId);
  }, [membershipTiers, formik.values.membershipTierId]);

  return (
    <FormikProvider value={formik}>
      <PolarisFormLayout
        sidebar={
          <div className="space-y-6">
            {/* Live Profile Card */}
            <PolarisSidebarCard title="Member Preview" badge="Live Profile" icon={Sparkles}>
              <div className="flex flex-col items-center text-center p-4 bg-zinc-50/60 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                {/* Avatar with Camera Overlay */}
                <div className="relative group mb-3">
                  <div className="h-20 w-20 rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-700 shadow-md">
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
                      <User className="h-9 w-9 text-zinc-400" />
                    )}
                  </div>

                  <div className="absolute -bottom-1.5 -right-1.5">
                    <ImageUploadWithCrop
                      currentImage={imageUrl || ""}
                      onImageUpdate={setImageUrl}
                      label=""
                      aspectRatio={1}
                      className="p-0"
                      dropzoneClassName="h-7 w-7 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-md p-0 border border-white dark:border-zinc-800 cursor-pointer"
                      previewClassName="hidden"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </ImageUploadWithCrop>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-full">
                  {formik.values.firstName || formik.values.lastName
                    ? `${formik.values.firstName} ${formik.values.lastName}`.trim()
                    : "New Member"}
                </h3>
                <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5 truncate max-w-full">
                  {formik.values.headline || "Professional Headline"}
                </p>

                {selectedTier && (
                  <Badge
                    variant="outline"
                    className="mt-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-none text-[10px] font-bold px-2 py-0.5"
                  >
                    {selectedTier.name}
                  </Badge>
                )}
              </div>

              {/* Profile Meta Breakdown */}
              <div className="space-y-1.5 pt-1">
                <PolarisSummaryRow
                  label="Email"
                  value={
                    <span className="truncate max-w-[150px] inline-block">
                      {formik.values.email || "Not specified"}
                    </span>
                  }
                />
                <PolarisSummaryRow
                  label="Phone"
                  value={formik.values.phone || "Not specified"}
                />
                <PolarisSummaryRow
                  label="Location"
                  value={formik.values.location || "Not specified"}
                />
                <PolarisSummaryRow
                  label="Industries"
                  value={
                    formik.values.industryIds.length > 0
                      ? `${formik.values.industryIds.length} Selected`
                      : "None"
                  }
                />
                <PolarisSummaryRow
                  label="Skills"
                  value={
                    formik.values.skills && formik.values.skills.length > 0
                      ? `${formik.values.skills.length} Added`
                      : "None"
                  }
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Automated Welcome Invitation Card */}
            <PolarisSidebarCard title="Welcome Delivery" icon={Mail}>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2 leading-relaxed">
                <p>
                  An automatic invitation email will be dispatched to{" "}
                  <strong>{formik.values.email || "the member's email"}</strong> with secure onboarding credentials.
                </p>
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <Link
                    href="/email"
                    className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 hover:underline inline-flex items-center gap-1"
                  >
                    Configure Email Templates →
                  </Link>
                </div>
              </div>
            </PolarisSidebarCard>

            {/* Community Strategy Tip */}
            <PolarisTipCard title="Member Onboarding Tip">
              Assigning accurate industries and membership tiers upfront unlocks personalized content feeds, private discussion channels, and targeted gamification rewards.
            </PolarisTipCard>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {serverError && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Submission Error</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Personal Identity & Contact */}
          <PolarisFormCard
            step={1}
            title="Personal Identity & Contact"
            description="Core personal details and contact channels for the new community member."
            badge="Required"
          >
            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  First Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="e.g. Alex"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.firstName as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Last Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="e.g. Mercer"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.lastName as string}
                  </p>
                )}
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Email Address <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="alex.mercer@company.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-10 pl-9 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.email as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-10 pl-9 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Gender, Language, Location, DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Gender
                </Label>
                <Select
                  value={formik.values.gender || ""}
                  onValueChange={(val) => handleInputChange("gender", val)}
                >
                  <SelectTrigger className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="language" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Preferred Language
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="language"
                    name="language"
                    placeholder="e.g. English, French, Spanish"
                    value={formik.values.language}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-10 pl-9 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Location
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g. San Francisco, CA"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-10 pl-9 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Date of Birth
                </Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-10 justify-start text-left text-xs font-semibold bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800",
                        !formik.values.dob && "text-zinc-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-zinc-400" />
                      {formik.values.dob ? format(formik.values.dob, "PPP") : "Pick birth date"}
                    </Button>
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
            <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Label htmlFor="headline" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Professional Headline
              </Label>
              <Input
                id="headline"
                name="headline"
                placeholder="e.g. Senior Product Architect & Community Advocate"
                value={formik.values.headline}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
              />
            </div>

            {/* About / Bio */}
            <div className="space-y-1.5">
              <Label htmlFor="about" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Member Bio & Summary
              </Label>
              <Textarea
                id="about"
                name="about"
                placeholder="Brief summary about the member's background, journey, and community interests..."
                value={formik.values.about}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="min-h-[90px] bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-medium resize-none shadow-none"
              />
            </div>
          </PolarisFormCard>

          {/* Step 2: Professional Taxonomy & Organization */}
          <PolarisFormCard
            step={2}
            title="Taxonomy & Community Classification"
            description="Assign membership tiers, industry sectors, and functional domain interests."
            badge="Taxonomy"
          >
            {/* Membership Tier */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Membership Tier Assignment
              </Label>
              <Popover open={isTierPopoverOpen} onOpenChange={setIsTierPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full h-10 justify-between text-xs font-semibold bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-zinc-500" />
                      {selectedTier ? (
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">
                          {selectedTier.name}
                        </span>
                      ) : (
                        <span className="text-zinc-400">Select membership tier...</span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-3.5 w-3.5 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command className="border-none">
                    <CommandInput placeholder="Search membership tiers..." className="h-10 text-xs" />
                    <CommandList className="max-h-[220px]">
                      <CommandEmpty>No tier found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => {
                            formik.setFieldValue("membershipTierId", null);
                            setIsTierPopoverOpen(false);
                          }}
                          className="text-xs font-semibold cursor-pointer"
                        >
                          <span className="text-zinc-400">None (General Member)</span>
                        </CommandItem>
                        {membershipTiers.map((tier: any) => (
                          <CommandItem
                            key={tier.id}
                            value={tier.name}
                            onSelect={() => {
                              formik.setFieldValue("membershipTierId", tier.id);
                              setIsTierPopoverOpen(false);
                            }}
                            className="flex items-center justify-between text-xs font-bold cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              {formik.values.membershipTierId === tier.id && (
                                <Check className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />
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

            {/* Industries Combobox */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Industry Sectors
              </Label>
              <Popover open={isIndustryPopoverOpen} onOpenChange={setIsIndustryPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full min-h-10 h-auto py-2 justify-between text-xs bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800"
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {formik.values.industryIds.length > 0 ? (
                        formik.values.industryIds.map((id: string) => {
                          const industry = industries.find((i: any) => i.id === id);
                          return (
                            <Badge
                              key={id}
                              variant="secondary"
                              className="bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[10px] font-bold px-2 py-0.5 flex items-center gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                formik.setFieldValue(
                                  "industryIds",
                                  formik.values.industryIds.filter((iid: string) => iid !== id)
                                );
                              }}
                            >
                              {industry?.title || id}
                              <X className="h-2.5 w-2.5 cursor-pointer hover:text-rose-500" />
                            </Badge>
                          );
                        })
                      ) : (
                        <span className="text-zinc-400 font-normal">Select one or more industries...</span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-3.5 w-3.5 opacity-50 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command className="border-none">
                    <CommandInput placeholder="Search industries..." className="h-10 text-xs" />
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
                              className="flex items-center justify-between text-xs font-semibold cursor-pointer"
                            >
                              <span>{industry.title}</span>
                              {isSelected && <Check className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Job Functions Combobox */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Job Functions & Domains
              </Label>
              <Popover open={isJobFunctionPopoverOpen} onOpenChange={setIsJobFunctionPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full min-h-10 h-auto py-2 justify-between text-xs bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800"
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {formik.values.jobFunctionIds.length > 0 ? (
                        formik.values.jobFunctionIds.map((id: string) => {
                          const jf = jobFunctions.find((item: any) => item.id === id);
                          return (
                            <Badge
                              key={id}
                              variant="secondary"
                              className="bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[10px] font-bold px-2 py-0.5 flex items-center gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                formik.setFieldValue(
                                  "jobFunctionIds",
                                  formik.values.jobFunctionIds.filter((iid: string) => iid !== id)
                                );
                              }}
                            >
                              {jf?.title || id}
                              <X className="h-2.5 w-2.5 cursor-pointer hover:text-rose-500" />
                            </Badge>
                          );
                        })
                      ) : (
                        <span className="text-zinc-400 font-normal">Select job functions...</span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-3.5 w-3.5 opacity-50 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command className="border-none">
                    <CommandInput placeholder="Search job functions..." className="h-10 text-xs" />
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
                              className="flex items-center justify-between text-xs font-semibold cursor-pointer"
                            >
                              <span>{jf.title}</span>
                              {isSelected && <Check className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />}
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
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Community Topic Interests
              </Label>
              <Popover open={isInterestPopoverOpen} onOpenChange={setIsInterestPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full min-h-10 h-auto py-2 justify-between text-xs bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800"
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {formik.values.interestIds.length > 0 ? (
                        formik.values.interestIds.map((id: string) => {
                          const interest = interests.find((item: any) => item.id === id);
                          return (
                            <Badge
                              key={id}
                              variant="secondary"
                              className="bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[10px] font-bold px-2 py-0.5 flex items-center gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                formik.setFieldValue(
                                  "interestIds",
                                  formik.values.interestIds.filter((iid: string) => iid !== id)
                                );
                              }}
                            >
                              {interest?.title || id}
                              <X className="h-2.5 w-2.5 cursor-pointer hover:text-rose-500" />
                            </Badge>
                          );
                        })
                      ) : (
                        <span className="text-zinc-400 font-normal">Select interest tags...</span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-3.5 w-3.5 opacity-50 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command className="border-none">
                    <CommandInput placeholder="Search interest tags..." className="h-10 text-xs" />
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
                              className="flex items-center justify-between text-xs font-semibold cursor-pointer"
                            >
                              <span>{interest.title}</span>
                              {isSelected && <Check className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </PolarisFormCard>

          {/* Step 3: Skills & Expertise Matrix */}
          <PolarisFormCard
            step={3}
            title="Skills & Expertise Matrix"
            description="Detail the member's technical and domain competencies for mentorship and matching."
            badge="Expertise"
          >
            <DetailedSkillsSection entitySkills={skills} />
          </PolarisFormCard>

          {/* Floating Save Action Bar */}
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
            title={isEdit ? "Unsaved Member Edits" : "Unsaved Member Profile"}
            description="You have modified the member profile information."
            buttonText={isEdit ? "Update Member Profile" : "Create Community Member"}
          />
        </form>
      </PolarisFormLayout>
    </FormikProvider>
  );
}
