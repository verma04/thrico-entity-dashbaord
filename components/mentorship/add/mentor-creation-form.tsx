"use client";

import { useState } from "react";
import { FormikProvider, useFormik } from "formik";
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
  User,
  Search,
  Check,
  X,
  Loader2,
  GraduationCap,
  Sparkles,
  Link as LinkIcon,
  Globe,
  CheckCircle2,
  Layout,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useSearchUserByName } from "@/graphql/actions/mentorship/mentorship-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@apollo/client";
import { GET_ALL_MENTOR_CATEGORY } from "@/graphql/quries/mentorship/category";
import { GET_ALL_MENTOR_SKILLS } from "@/graphql/quries/mentorship/skills";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useModuleStore } from "@/store/useModuleStore";
import { notify } from "@/lib/notify";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";

export function MentorCreationForm({
  loading,
  onFinish,
  onCancel,
  submitError,
  onDismissError,
}: any) {
  const moduleName = useModuleStore((state) => state.mentorshipModuleName);
  const singularName = useModuleStore((state) => state.mentorshipSingularName);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchUser, { data: searchData, loading: searching }] =
    useSearchUserByName();

  const { data: categoriesData } = useQuery(GET_ALL_MENTOR_CATEGORY);
  const { data: skillsData } = useQuery(GET_ALL_MENTOR_SKILLS);

  const mentorSchema = Yup.object({
    displayName: Yup.string()
      .required("Display name is required")
      .max(100, "Max 100 characters"),
    category: Yup.string().required("Category is required"),
    description: Yup.string().max(1000, "Max 1000 characters"),
    intro: Yup.string()
      .required("Intro is required")
      .max(100, "Max 100 characters"),
    about: Yup.string()
      .required("About is required")
      .max(500, "Max 500 characters"),
    featuredArticle: Yup.string().url("Must be a valid URL"),
    introVideo: Yup.string().url("Must be a valid URL"),
    whyDoWantBecomeMentor: Yup.string().max(1000, "Max 1000 characters"),
    greatestAchievement: Yup.string()
      .required("Greatest achievement is required")
      .max(500, "Max 500 characters"),
    agreement: Yup.boolean().oneOf([true], "You must agree to the terms"),
    skills: Yup.array()
      .of(Yup.string())
      .min(1, "At least one skill is required"),
    isTopMentor: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      displayName: "",
      category: "",
      description: "",
      intro: "",
      about: "",
      featuredArticle: "",
      introVideo: "",
      whyDoWantBecomeMentor: "",
      greatestAchievement: "",
      skills: [],
      agreement: false,
      isTopMentor: false,
    },
    validationSchema: mentorSchema,
    onSubmit: (values) => {
      if (!selectedUser) {
        notify.error("Please select a user first");
        return;
      }
      onFinish({
        ...values,
        userId: selectedUser?.id,
      });
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length >= 2) {
      searchUser({ variables: { name: value } });
    }
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    formik.setFieldValue(
      "displayName",
      `${user?.user?.firstName} ${user?.user?.lastName}`,
    );
    setSearchQuery("");
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (Object.keys(formik.errors).length > 0) {
      toast.error("Please review and fix the highlighted form errors.");
    }
    formik.handleSubmit();
  };

  const categories = categoriesData?.getMentorCategories || [];
  const availableSkills = skillsData?.getMentorSkills || [];

  return (
    <FormikProvider value={formik}>
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Profile Card */}
            <PolarisSidebarCard title={`${singularName} Preview`} badge="Live Profile" icon={Sparkles}>
              <div className="flex flex-col items-center text-center p-4 bg-zinc-50/60 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                {/* Avatar */}
                <div className="h-20 w-20 rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-700 shadow-md mb-3">
                  {selectedUser?.user?.avatar ? (
                    <Image
                      src={`https://cdn.thrico.network/${selectedUser.user.avatar}`}
                      alt="Avatar"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-9 w-9 text-zinc-400" />
                  )}
                </div>

                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-full">
                  {formik.values.displayName || `New ${singularName}`}
                </h3>
                <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5 truncate max-w-full">
                  {formik.values.intro || "One-liner intro"}
                </p>
                {formik.values.isTopMentor && (
                  <Badge className="mt-2.5 bg-amber-400 text-amber-900 border-none text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Top {singularName}
                  </Badge>
                )}
              </div>

              {/* Summary rows */}
              <div className="space-y-1.5 pt-1">
                <PolarisSummaryRow
                  label="Category"
                  value={
                    categories.find((c: any) => c.id === formik.values.category)?.title ||
                    "Not selected"
                  }
                />
                <PolarisSummaryRow
                  label="Skills"
                  value={
                    formik.values.skills.length > 0
                      ? `${formik.values.skills.length} Added`
                      : "None"
                  }
                />
                <PolarisSummaryRow
                  label="User"
                  value={
                    selectedUser
                      ? `${selectedUser.user?.firstName} ${selectedUser.user?.lastName}`
                      : "Not selected"
                  }
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Direct Onboarding Notice */}
            <PolarisSidebarCard title="Direct Onboarding" icon={CheckCircle2}>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2 leading-relaxed">
                <p>
                  This action bypasses the standard application workflow.{" "}
                  <strong>{singularName}s</strong> added here are immediately
                  active and accessible by community members.
                </p>
              </div>
            </PolarisSidebarCard>

            {/* Tip */}
            <PolarisTipCard title={`${singularName} Onboarding Tip`}>
              Assigning accurate categories and skills upfront ensures better
              discovery, matching, and member trust signals for the{" "}
              {singularName.toLowerCase()}.
            </PolarisTipCard>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Server error */}
          {submitError && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Onboarding Failed</AlertTitle>
              <AlertDescription>
                {submitError}
                {onDismissError && (
                  <button
                    type="button"
                    onClick={onDismissError}
                    className="ml-2 underline text-xs"
                  >
                    Dismiss
                  </button>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* ── Step 1: User Selection ─────────────────────────────── */}
          <PolarisFormCard
            step={1}
            title="Find & Select User"
            description={`Search and select an existing community member to onboard as a ${singularName.toLowerCase()}.`}
            badge="Required"
          >
            {!selectedUser ? (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    placeholder="Search users by name..."
                    className="h-10 pl-9 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  {searching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {searchData?.searchUserByName?.map((user: any) => (
                    <div
                      key={user?.id}
                      className="group flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
                          {user?.user?.avatar ? (
                            <Image
                              src={`https://cdn.thrico.network/${user?.user?.avatar}`}
                              alt="Avatar"
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <User className="h-5 w-5 text-zinc-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                            {user?.user?.firstName} {user?.user?.lastName}
                          </p>
                          {user?.user?.profile?.headline && (
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                              {user.user.profile.headline}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="h-7 w-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 bg-primary text-primary-foreground transition-all">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  ))}

                  {searchQuery.length >= 2 &&
                    searchData?.searchUserByName?.length === 0 && (
                      <div className="text-center py-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                        <User className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                        <p className="text-xs text-zinc-500 font-medium">
                          No users found matching &quot;{searchQuery}&quot;
                        </p>
                      </div>
                    )}

                  {!searchQuery && (
                    <div className="text-center py-8">
                      <Sparkles className="h-8 w-8 text-zinc-200 dark:text-zinc-700 mx-auto mb-2" />
                      <p className="text-xs text-zinc-400 font-medium">
                        Start typing a name to find a{" "}
                        {singularName.toLowerCase()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Selected user chip */
              <div className="flex items-center justify-between p-3 rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
                    {selectedUser?.user?.avatar ? (
                      <Image
                        src={`https://cdn.thrico.network/${selectedUser.user.avatar}`}
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <User className="h-5 w-5 text-zinc-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {selectedUser.user?.firstName}{" "}
                        {selectedUser.user?.lastName}
                      </p>
                      <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-primary-foreground stroke-[3px]" />
                      </div>
                    </div>
                    {selectedUser.user?.profile?.headline && (
                      <p className="text-[11px] text-zinc-500 font-medium">
                        {selectedUser.user.profile.headline}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg text-xs h-8"
                  onClick={() => {
                    setSelectedUser(null);
                    formik.resetForm();
                  }}
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Change
                </Button>
              </div>
            )}
          </PolarisFormCard>

          {/* ── Step 2: Mentor Profile Details ─────────────────────── */}
          <PolarisFormCard
            step={2}
            title={`${moduleName} Details`}
            description={`Define the ${singularName.toLowerCase()}'s profile, credentials, and mentorship settings.`}
            badge="Profile"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Display Name */}
              <div className="space-y-1.5">
                <Label htmlFor="displayName" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Public Display Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="displayName"
                  name="displayName"
                  placeholder={`e.g. ${singularName} Jane Doe`}
                  value={formik.values.displayName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                />
                {formik.touched.displayName && formik.errors.displayName && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.displayName as string}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {singularName} Category <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={formik.values.category}
                  onValueChange={(value) =>
                    formik.setFieldValue("category", value)
                  }
                >
                  <SelectTrigger className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id} className="text-xs">
                        {cat.title}
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

            {/* One-liner Intro & Greatest Achievement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="intro" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  One-liner Intro <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="intro"
                  name="intro"
                  placeholder="e.g. Passionate about helping developers grow"
                  value={formik.values.intro}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                />
                {formik.touched.intro && formik.errors.intro && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.intro as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="greatestAchievement" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Greatest Achievement <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="greatestAchievement"
                  name="greatestAchievement"
                  placeholder="e.g. Scaled a product to 1M users"
                  value={formik.values.greatestAchievement}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                />
                {formik.touched.greatestAchievement &&
                  formik.errors.greatestAchievement && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {formik.errors.greatestAchievement as string}
                    </p>
                  )}
              </div>
            </div>

            {/* About & Motivation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="about" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  About Me <span className="text-rose-500">*</span>
                </Label>
                <Textarea
                  id="about"
                  name="about"
                  placeholder="Tell us about yourself..."
                  value={formik.values.about}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="min-h-[100px] bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-medium resize-none shadow-none"
                />
                {formik.touched.about && formik.errors.about && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.about as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="whyDoWantBecomeMentor" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Motivation for {moduleName}
                </Label>
                <Textarea
                  id="whyDoWantBecomeMentor"
                  name="whyDoWantBecomeMentor"
                  placeholder={`Why do you want to become a ${singularName.toLowerCase()}?`}
                  value={formik.values.whyDoWantBecomeMentor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="min-h-[100px] bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-medium resize-none shadow-none"
                />
              </div>
            </div>

            {/* Description / Bio Extras */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Description / Bio Extras
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Any additional details you'd like to share..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="min-h-[80px] bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-medium resize-none shadow-none"
              />
            </div>

            {/* Top Mentor Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="space-y-0.5">
                <Label htmlFor="isTopMentor" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2 cursor-pointer">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Mark as Top {singularName}
                </Label>
                <p className="text-[10px] text-zinc-500">
                  Feature this {singularName.toLowerCase()} at the top of listings
                </p>
              </div>
              <Checkbox
                id="isTopMentor"
                checked={formik.values.isTopMentor}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("isTopMentor", checked)
                }
                className="h-5 w-5 rounded-md"
              />
            </div>
          </PolarisFormCard>

          {/* ── Step 3: Skills & Expertise ─────────────────────────── */}
          <PolarisFormCard
            step={3}
            title="Expertise & Skills"
            description={`Select the ${singularName.toLowerCase()}'s core competencies.`}
            badge="Required"
          >
            <div className="space-y-3">
              {/* Selected skills chips */}
              <div className="flex flex-wrap gap-2 p-3 min-h-[48px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                {formik.values.skills.length === 0 && (
                  <span className="text-xs text-zinc-400 font-medium py-1 pl-1 italic">
                    No skills selected…
                  </span>
                )}
                {formik.values.skills.map((skill: string) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="h-7 pl-3 pr-2 bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[10px] font-bold flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => {
                        formik.setFieldValue(
                          "skills",
                          formik.values.skills.filter(
                            (s: string) => s !== skill,
                          ),
                        );
                      }}
                      className="hover:text-rose-500 rounded-sm p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <div className="ml-auto">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-[10px] font-bold"
                      >
                        <Search className="h-3.5 w-3.5 mr-1" />
                        Add
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0 rounded-xl shadow-xl" align="end">
                      <Command>
                        <CommandInput placeholder="Search or add skill..." className="h-9 text-xs" />
                        <CommandList className="max-h-[260px]">
                          <CommandEmpty>
                            <button
                              type="button"
                              className="w-full text-left p-3 text-xs font-bold text-primary hover:bg-primary/5"
                              onClick={() => {
                                const input = document.querySelector(
                                  "[cmdk-input]",
                                ) as HTMLInputElement;
                                const val = input?.value;
                                if (val && !formik.values.skills.includes(val)) {
                                  formik.setFieldValue("skills", [
                                    ...formik.values.skills,
                                    val,
                                  ]);
                                }
                              }}
                            >
                              + Add custom skill
                            </button>
                          </CommandEmpty>
                          <CommandGroup heading="Available Skills">
                            {availableSkills.map((skill: any) => (
                              <CommandItem
                                key={skill.id}
                                onSelect={() => {
                                  if (!formik.values.skills.includes(skill.title)) {
                                    formik.setFieldValue("skills", [
                                      ...formik.values.skills,
                                      skill.title,
                                    ]);
                                  }
                                }}
                                className="text-xs font-semibold cursor-pointer"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-3.5 w-3.5",
                                    formik.values.skills.includes(skill.title)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {skill.title}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {formik.touched.skills && formik.errors.skills && (
                <p className="text-[11px] text-rose-500 font-medium">
                  {formik.errors.skills as string}
                </p>
              )}
            </div>
          </PolarisFormCard>

          {/* ── Step 4: External Links ─────────────────────────────── */}
          <PolarisFormCard
            step={4}
            title="External Links"
            description="Optionally attach a featured article or intro video to enrich the profile."
            badge="Optional"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="featuredArticle" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <LinkIcon className="h-3 w-3 text-zinc-500" />
                  Featured Article URL
                </Label>
                <Input
                  id="featuredArticle"
                  name="featuredArticle"
                  placeholder="https://medium.com/@username/article"
                  value={formik.values.featuredArticle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                />
                {formik.touched.featuredArticle && formik.errors.featuredArticle && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.featuredArticle as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="introVideo" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Globe className="h-3 w-3 text-zinc-500" />
                  Intro Video URL
                </Label>
                <Input
                  id="introVideo"
                  name="introVideo"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formik.values.introVideo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                />
                {formik.touched.introVideo && formik.errors.introVideo && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.introVideo as string}
                  </p>
                )}
              </div>
            </div>
          </PolarisFormCard>

          {/* ── Step 5: Onboarding Agreement ───────────────────────── */}
          <PolarisFormCard
            step={5}
            title="Onboarding Agreement"
            description="Confirm that the user has agreed to be onboarded and all information is accurate."
            badge="Required"
          >
            <div className="flex items-start gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <Checkbox
                id="agreement"
                checked={formik.values.agreement}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("agreement", checked)
                }
                className="mt-0.5 h-5 w-5 rounded-md"
              />
              <div className="space-y-1">
                <Label
                  htmlFor="agreement"
                  className="text-xs font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer"
                >
                  Confirm Onboarding Agreement
                </Label>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                  By checking this box, you confirm that this user has agreed to
                  be a {singularName.toLowerCase()} and the information provided
                  is accurate. The {singularName.toLowerCase()} profile will be
                  automatically approved.
                </p>
              </div>
            </div>
            {formik.touched.agreement && formik.errors.agreement && (
              <p className="text-[11px] text-rose-500 font-medium">
                {formik.errors.agreement as string}
              </p>
            )}
          </PolarisFormCard>

          {/* Floating Save Panel */}
          <FloatingSavePanel
            hasChanged={formik.dirty && !!selectedUser}
            saved={false}
            isSaving={loading}
            onSave={handleSubmit}
            onReset={() => {
              formik.resetForm();
              setSelectedUser(null);
              if (onCancel) onCancel();
            }}
            title={`Confirm ${singularName} Onboarding`}
            description={
              selectedUser
                ? `Ready to onboard ${selectedUser?.user?.firstName}`
                : "Please select a user to continue"
            }
            buttonText="Confirm Onboarding"
          />
        </form>
      </PolarisFormLayout>
    </FormikProvider>
  );
}
