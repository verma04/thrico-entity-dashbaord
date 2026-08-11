"use client";

import { useEffect, useState } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikProvider,
  useFormik,
} from "formik";
import * as Yup from "yup";
import Image from "next/image";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import {
  Camera,
  Info,
  User,
  ChevronRight,
  Save,
  Calendar as CalendarIcon,
  Mail,
  Phone,
  Layout,
  Plus,
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
import { Check, ChevronsUpDown, X } from "lucide-react";
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

export function MemberCreationForm({
  initialValues,
  loading,
  onFinish,
  onCancel,
  isEdit = false,
  serverError,
}: any) {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialValues?.avatar || null,
  );

  useEffect(() => {
    if (initialValues?.avatar) {
      setImageUrl(initialValues.avatar);
    }
  }, [initialValues?.avatar]);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isIndustryPopoverOpen, setIsIndustryPopoverOpen] = useState(false);
  const [isJobFunctionPopoverOpen, setIsJobFunctionPopoverOpen] =
    useState(false);
  const [isSkillPopoverOpen, setIsSkillPopoverOpen] = useState(false);
  const [isInterestPopoverOpen, setIsInterestPopoverOpen] = useState(false);
  const [isTierPopoverOpen, setIsTierPopoverOpen] = useState(false);

  const { data: industryData, loading: loadingIndustries } = useGetIndustries();
  const industries = industryData?.getIndustries || [];

  const { data: jobFunctionData, loading: loadingJobFunctions } =
    useGetFunctions();
  const jobFunctions = jobFunctionData?.getFunctions || [];

  const { data: skillData, loading: loadingSkills } = useGetSkills();
  const skills = skillData?.getSkills || [];

  const { data: interestData, loading: loadingInterests } = useGetInterests();
  const interests = interestData?.getInterests || [];

  const { data: tiersData, loading: loadingTiers } =
    useQuery(GET_MEMBERSHIP_TIERS);
  const membershipTiers = tiersData?.getMembershipTiers || [];

  const memberSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .max(50, "Max 50 characters"),
    lastName: Yup.string()
      .required("Last name is required")
      .max(50, "Max 50 characters"),
    email: Yup.string().email("Invalid email").required("Email is required"),
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

    // Log validation errors for debugging
    if (Object.keys(formik.errors).length > 0) {
      console.log("Form validation errors:", formik.errors);
      toast({
        title: "Validation Error",
        description: "Please check the form for errors.",
        variant: "destructive",
      });
    }

    formik.handleSubmit();
  };

  return (
    <FormikProvider value={formik}>
      <>
        {/* Main Content Area - Scrollable */}
        <div>
          <div className="max-w-5xl mx-auto px-6 ">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {serverError && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Personal Info */}
                  <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-primary" />
                        <CardTitle className="text-lg font-bold text-foreground">
                          Personal Information
                        </CardTitle>
                      </div>
                      <CardDescription className="text-muted-foreground font-medium">
                        {isEdit
                          ? "Update identity details of the member"
                          : "Basic identity details of the new member"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="firstName"
                            className="text-sm font-bold text-foreground"
                          >
                            First Name <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="John"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.firstName &&
                            formik.errors.firstName && (
                              <p className="text-xs font-semibold text-rose-500">
                                {formik.errors.firstName as string}
                              </p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="lastName"
                            className="text-sm font-bold text-foreground"
                          >
                            Last Name <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Doe"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.lastName &&
                            formik.errors.lastName && (
                              <p className="text-xs font-semibold text-rose-500">
                                {formik.errors.lastName as string}
                              </p>
                            )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-sm font-bold text-foreground"
                          >
                            Email Address{" "}
                            <span className="text-rose-500">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="john.doe@example.com"
                              className="pl-10"
                              value={formik.values.email}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                          {formik.touched.email && formik.errors.email && (
                            <p className="text-xs font-semibold text-rose-500">
                              {formik.errors.email as string}
                            </p>
                          )}
                        </div>

                        {/* Mobile */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="text-sm font-bold text-foreground"
                          >
                            Mobile
                          </Label>
                          <div className="relative">
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              placeholder="+1 (555) 000-0000"
                              className="pl-10"
                              value={formik.values.phone}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                          {formik.touched.phone && formik.errors.phone && (
                            <p className="text-xs font-semibold text-rose-500">
                              {formik.errors.phone as string}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Gender */}
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-foreground">
                            Gender
                          </Label>
                          <Select
                            value={formik.values.gender}
                            onValueChange={(value) =>
                              handleInputChange("gender", value)
                            }
                          >
                            <SelectTrigger className="w-full ">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border">
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                              <SelectItem value="Prefer not to say">
                                Prefer not to say
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {formik.touched.gender && formik.errors.gender && (
                            <p className="text-xs font-semibold text-rose-500">
                              {formik.errors.gender as string}
                            </p>
                          )}
                        </div>

                        {/* Language */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="language"
                            className="text-sm font-bold text-foreground"
                          >
                            Language
                          </Label>
                          <Input
                            id="language"
                            name="language"
                            placeholder="e.g. English, Spanish"
                            value={formik.values.language}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.language &&
                            formik.errors.language && (
                              <p className="text-xs font-semibold text-rose-500">
                                {formik.errors.language as string}
                              </p>
                            )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Location */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="location"
                            className="text-sm font-bold text-foreground"
                          >
                            Location
                          </Label>
                          <Input
                            id="location"
                            name="location"
                            placeholder="City, Country"
                            value={formik.values.location}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.location &&
                            formik.errors.location && (
                              <p className="text-xs font-semibold text-rose-500">
                                {formik.errors.location as string}
                              </p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-foreground">
                            Date of Birth
                          </Label>
                          <Popover
                            open={isCalendarOpen}
                            onOpenChange={setIsCalendarOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !formik.values.dob && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                {formik.values.dob ? (
                                  format(formik.values.dob, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                                defaultMonth={
                                  formik.values.dob || new Date(2000, 0, 1)
                                }
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      {/* Headline */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="headline"
                          className="text-sm font-bold text-foreground"
                        >
                          Headline
                        </Label>
                        <Input
                          id="headline"
                          name="headline"
                          placeholder="e.g. Senior Software Engineer at Tech Corp"
                          value={formik.values.headline}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                          A short summary of their current role or expertise
                        </p>
                      </div>

                      {/* About / Bio */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="about"
                          className="text-sm font-bold text-foreground"
                        >
                          About User
                        </Label>
                        <Textarea
                          id="about"
                          name="about"
                          placeholder="Tell us more about the member..."
                          className="min-h-[120px] resize-none"
                          value={formik.values.about}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Professional Info */}
                  <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Layout className="h-4 w-4 text-primary" />
                        <CardTitle className="text-lg font-bold text-foreground">
                          Professional Information
                        </CardTitle>
                      </div>
                      <CardDescription className="text-muted-foreground font-medium">
                        Work related details and industry classification
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-6">
                      {/* Industries */}
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-foreground">
                          Industries
                        </Label>
                        <Popover
                          open={isIndustryPopoverOpen}
                          onOpenChange={setIsIndustryPopoverOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={isIndustryPopoverOpen}
                              className="w-full justify-between font-normal"
                            >
                              <div className="flex flex-wrap gap-1.5">
                                {formik.values.industryIds.length > 0 ? (
                                  formik.values.industryIds.map(
                                    (id: string) => {
                                      const industry = industries.find(
                                        (i) => i.id === id,
                                      );
                                      return (
                                        <Badge
                                          key={id}
                                          variant="secondary"
                                          className=" flex items-center gap-1"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const next =
                                              formik.values.industryIds.filter(
                                                (iid: string) => iid !== id,
                                              );
                                            formik.setFieldValue(
                                              "industryIds",
                                              next,
                                            );
                                          }}
                                        >
                                          {industry?.title}
                                          <X className="h-3 w-3" />
                                        </Badge>
                                      );
                                    },
                                  )
                                ) : (
                                  <span className="text-muted-foreground">
                                    Select industries...
                                  </span>
                                )}
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command className="border-none">
                              <CommandInput
                                placeholder="Search industries..."
                                className="h-11 border-none focus:ring-0"
                              />
                              <CommandList className="max-h-[300px]">
                                <CommandEmpty>No industry found.</CommandEmpty>
                                <CommandGroup>
                                  {industries.map((industry) => (
                                    <CommandItem
                                      key={industry.id}
                                      value={industry.title}
                                      onSelect={() => {
                                        const current =
                                          formik.values.industryIds;
                                        const next = current.includes(
                                          industry.id,
                                        )
                                          ? current.filter(
                                              (id: string) =>
                                                id !== industry.id,
                                            )
                                          : [...current, industry.id];
                                        formik.setFieldValue(
                                          "industryIds",
                                          next,
                                        );
                                      }}
                                      className="flex items-center justify-between cursor-pointer"
                                    >
                                      <div className="flex items-center gap-2">
                                        <div
                                          className={cn(
                                            "h-4 w-4 rounded border border-border flex items-center justify-center transition-all",
                                            formik.values.industryIds.includes(
                                              industry.id,
                                            )
                                              ? "bg-primary border-primary"
                                              : "bg-card",
                                          )}
                                        >
                                          {formik.values.industryIds.includes(
                                            industry.id,
                                          ) && (
                                            <Check className="h-3 w-3 text-white" />
                                          )}
                                        </div>
                                        <span className="text-sm font-semibold text-foreground">
                                          {industry.title}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                          Select one or more industries the member belongs to
                        </p>
                      </div>

                      {/* Membership Tier */}
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-foreground">
                          Membership Tier
                        </Label>
                        <Popover
                          open={isTierPopoverOpen}
                          onOpenChange={setIsTierPopoverOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={isTierPopoverOpen}
                              className="w-full justify-between font-normal"
                            >
                              <div className="flex flex-wrap gap-1.5">
                                {formik.values.membershipTierId ? (
                                  <Badge
                                    variant="secondary"
                                    className=" flex items-center gap-1"
                                  >
                                    {
                                      membershipTiers.find(
                                        (t: any) =>
                                          t.id ===
                                          formik.values.membershipTierId,
                                      )?.name
                                    }
                                  </Badge>
                                ) : (
                                  <span className="text-muted-foreground">
                                    Select membership tier...
                                  </span>
                                )}
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command className="border-none">
                              <CommandInput
                                placeholder="Search tiers..."
                                className="h-11 border-none focus:ring-0"
                              />
                              <CommandList className="max-h-[300px]">
                                <CommandEmpty>No tier found.</CommandEmpty>
                                <CommandGroup>
                                  <CommandItem
                                    key="none"
                                    value="none"
                                    onSelect={() => {
                                      formik.setFieldValue(
                                        "membershipTierId",
                                        null,
                                      );
                                      setIsTierPopoverOpen(false);
                                    }}
                                    className="flex items-center justify-between cursor-pointer"
                                  >
                                    <span className="text-sm font-semibold text-muted-foreground">
                                      None
                                    </span>
                                  </CommandItem>
                                  {membershipTiers.map((tier: any) => (
                                    <CommandItem
                                      key={tier.id}
                                      value={tier.name}
                                      onSelect={() => {
                                        formik.setFieldValue(
                                          "membershipTierId",
                                          tier.id,
                                        );
                                        setIsTierPopoverOpen(false);
                                      }}
                                      className="flex items-center justify-between cursor-pointer"
                                    >
                                      <div className="flex items-center gap-2">
                                        <div
                                          className={cn(
                                            "h-4 w-4 rounded border border-border flex items-center justify-center transition-all",
                                            formik.values.membershipTierId ===
                                              tier.id
                                              ? "bg-primary border-primary"
                                              : "bg-card",
                                          )}
                                        >
                                          {formik.values.membershipTierId ===
                                            tier.id && (
                                            <Check className="h-3 w-3 text-white" />
                                          )}
                                        </div>
                                        <span className="text-sm font-semibold text-foreground">
                                          {tier.name}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                          Select the membership tier for this user
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-foreground">
                          Job Functions
                        </Label>
                        <Popover
                          open={isJobFunctionPopoverOpen}
                          onOpenChange={setIsJobFunctionPopoverOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={isJobFunctionPopoverOpen}
                              className="w-full justify-between font-normal"
                            >
                              <div className="flex flex-wrap gap-1.5">
                                {formik.values.jobFunctionIds.length > 0 ? (
                                  formik.values.jobFunctionIds.map(
                                    (id: string) => {
                                      const jf = jobFunctions.find(
                                        (item) => item.id === id,
                                      );
                                      return (
                                        <Badge
                                          key={id}
                                          variant="secondary"
                                          className=" flex items-center gap-1"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const next =
                                              formik.values.jobFunctionIds.filter(
                                                (iid: string) => iid !== id,
                                              );
                                            formik.setFieldValue(
                                              "jobFunctionIds",
                                              next,
                                            );
                                          }}
                                        >
                                          {jf?.title}
                                          <X className="h-3 w-3" />
                                        </Badge>
                                      );
                                    },
                                  )
                                ) : (
                                  <span className="text-muted-foreground">
                                    Select job functions...
                                  </span>
                                )}
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command className="border-none">
                              <CommandInput
                                placeholder="Search job functions..."
                                className="h-11 border-none focus:ring-0"
                              />
                              <CommandList className="max-h-[300px]">
                                <CommandEmpty>
                                  No job functions found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {jobFunctions.map((jf) => (
                                    <CommandItem
                                      key={jf.id}
                                      value={jf.title}
                                      onSelect={() => {
                                        const current =
                                          formik.values.jobFunctionIds;
                                        const next = current.includes(jf.id)
                                          ? current.filter(
                                              (id: string) => id !== jf.id,
                                            )
                                          : [...current, jf.id];
                                        formik.setFieldValue(
                                          "jobFunctionIds",
                                          next,
                                        );
                                      }}
                                      className="flex items-center justify-between cursor-pointer"
                                    >
                                      <div className="flex items-center gap-2">
                                        <div
                                          className={cn(
                                            "h-4 w-4 rounded border border-border flex items-center justify-center transition-all",
                                            formik.values.jobFunctionIds.includes(
                                              jf.id,
                                            )
                                              ? "bg-primary border-primary"
                                              : "bg-card",
                                          )}
                                        >
                                          {formik.values.jobFunctionIds.includes(
                                            jf.id,
                                          ) && (
                                            <Check className="h-3 w-3 text-white" />
                                          )}
                                        </div>
                                        <span className="text-sm font-semibold text-foreground">
                                          {jf.title}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                          Select one or more job functions that fit the member
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-foreground">
                          Interests
                        </Label>
                        <Popover
                          open={isInterestPopoverOpen}
                          onOpenChange={setIsInterestPopoverOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={isInterestPopoverOpen}
                              className="w-full justify-between font-normal"
                            >
                              <div className="flex flex-wrap gap-1.5">
                                {formik.values.interestIds.length > 0 ? (
                                  formik.values.interestIds.map(
                                    (id: string) => {
                                      const interest = interests.find(
                                        (item) => item.id === id,
                                      );
                                      return (
                                        <Badge
                                          key={id}
                                          variant="secondary"
                                          className=" flex items-center gap-1"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const next =
                                              formik.values.interestIds.filter(
                                                (iid: string) => iid !== id,
                                              );
                                            formik.setFieldValue(
                                              "interestIds",
                                              next,
                                            );
                                          }}
                                        >
                                          {interest?.title}
                                          <X className="h-3 w-3" />
                                        </Badge>
                                      );
                                    },
                                  )
                                ) : (
                                  <span className="text-muted-foreground">
                                    Select interests...
                                  </span>
                                )}
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command className="border-none">
                              <CommandInput
                                placeholder="Search interests..."
                                className="h-11 border-none focus:ring-0"
                              />
                              <CommandList className="max-h-[300px]">
                                <CommandEmpty>No interests found.</CommandEmpty>
                                <CommandGroup>
                                  {interests.map((interest) => (
                                    <CommandItem
                                      key={interest.id}
                                      value={interest.title}
                                      onSelect={() => {
                                        const current =
                                          formik.values.interestIds;
                                        const next = current.includes(
                                          interest.id,
                                        )
                                          ? current.filter(
                                              (id: string) =>
                                                id !== interest.id,
                                            )
                                          : [...current, interest.id];
                                        formik.setFieldValue(
                                          "interestIds",
                                          next,
                                        );
                                      }}
                                      className="flex items-center justify-between cursor-pointer"
                                    >
                                      <div className="flex items-center gap-2">
                                        <div
                                          className={cn(
                                            "h-4 w-4 rounded border border-border flex items-center justify-center transition-all",
                                            formik.values.interestIds.includes(
                                              interest.id,
                                            )
                                              ? "bg-primary border-primary"
                                              : "bg-card",
                                          )}
                                        >
                                          {formik.values.interestIds.includes(
                                            interest.id,
                                          ) && (
                                            <Check className="h-3 w-3 text-white" />
                                          )}
                                        </div>
                                        <span className="text-sm font-semibold text-foreground">
                                          {interest.title}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                          Select one or more interests that fit the member
                        </p>
                      </div>

                      <DetailedSkillsSection entitySkills={skills} />
                    </CardContent>
                  </Card>
                </form>
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                  <Card className="border-none shadow-md shadow-indigo-600/5 ring-1 ring-border/50 overflow-hidden bg-card">
                    <div className="h-24 bg-linear-to-br from-indigo-600 to-violet-700" />
                    <div className="px-6 pb-8 -mt-12 text-center">
                      <div className="inline-flex p-1 bg-card  shadow-lg mb-4 group relative cursor-pointer">
                        <div className="h-24 w-24 bg-muted flex items-center justify-center overflow-hidden">
                          {imageUrl ? (
                            <Image
                              src={`https://cdn.thrico.network/${imageUrl}`}
                              alt="Avatar"
                              width={96}
                              height={96}
                              className="h-full w-full object-cover transition-transform group-hover:scale-110"
                            />
                          ) : (
                            <User className="h-10 w-10 text-muted-foreground" />
                          )}
                        </div>

                        <div className="absolute inset-1 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <Camera className="h-5 w-5 text-white" />
                        </div>

                        <div className="absolute -bottom-1 -right-1">
                          <ImageUploadWithCrop
                            currentImage={imageUrl || ""}
                            onImageUpdate={setImageUrl}
                            label=""
                            aspectRatio={1}
                            className="p-0"
                            dropzoneClassName="h-8 w-8 rounded-full bg-card shadow-md border-border flex items-center justify-center p-0"
                            previewClassName="hidden"
                          >
                            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-1 ring-indigo-100">
                              <Plus className="h-4 w-4" />
                            </div>
                          </ImageUploadWithCrop>
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-foreground leading-tight">
                        {formik.values.firstName || formik.values.lastName
                          ? `${formik.values.firstName} ${formik.values.lastName}`
                          : "New Member Preview"}
                      </h3>
                      <p className="text-sm font-semibold text-primary mt-1">
                        {formik.values.headline || "Professional Headline"}
                      </p>

                      <div className="mt-6 pt-6 border-t border-border flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-left">
                          <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <span className="text-xs font-semibold text-muted-foreground truncate max-w-[200px]">
                            {formik.values.email || "No email provided"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-none shadow-sm ring-1 ring-border/50 rounded-2xl bg-card">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold text-foreground uppercase tracking-widest">
                          Automated Invitation
                        </h4>
                        <p className="text-[12px] text-muted-foreground font-medium leading-relaxed">
                          An invitation email will be sent automatically to the
                          provided address using your configured domain. You can
                          monitor its delivery status in the{" "}
                          <Link
                            href="/email"
                            className="text-primary hover:text-indigo-800 hover:underline transition-all font-semibold"
                          >
                            Email Dashboard
                          </Link>
                          .
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

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
          title={isEdit ? "Unsaved Profile Changes" : "Unsaved Member Data"}
          description={
            isEdit
              ? "You have unsaved changes in the profile."
              : "You have unfilled form data."
          }
          buttonText={isEdit ? "Update Profile" : "Save Member"}
        />
      </>
    </FormikProvider>
  );
}
