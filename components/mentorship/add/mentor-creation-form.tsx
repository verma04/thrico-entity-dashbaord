"use client";

import React, { useState } from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Sparkles,
  Link as LinkIcon,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useSearchUserByName } from "@/graphql/actions/mentorship/mentorship-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@apollo/client";
import { GET_ALL_MENTOR_CATEGORY } from "@/graphql/quries/mentorship/category";
import { GET_ALL_MENTOR_SKILLS } from "@/graphql/quries/mentorship/skills";
import {
  PolarisCard,
  PolarisInput,
  PolarisTextarea,
  PolarisLabel,
  PolarisSelect,
  PolarisMultiSelect,
  PolarisCombobox,
} from "@/components/ui/platform/polaris-primitives";
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
            <PolarisSidebarCard
              title={`${singularName} Preview`}
              badge="Live Profile"
              icon={Sparkles}
            >
              <div className="flex flex-col items-center text-center p-3.5 bg-[#f6f6f7]/60 dark:bg-zinc-900/60 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800">
                {/* Avatar */}
                <div className="h-20 w-20 rounded-full bg-[#e1e3e5] dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-700 shadow-xs mb-3">
                  {selectedUser?.user?.avatar ? (
                    <Image
                      src={`https://cdn.thrico.network/${selectedUser.user.avatar}`}
                      alt="Avatar"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-9 w-9 text-[#8c9196]" />
                  )}
                </div>

                <h3 className="text-[14px] font-semibold text-[#303030] dark:text-zinc-100 truncate max-w-full">
                  {formik.values.displayName || `New ${singularName}`}
                </h3>
                <p className="text-[12px] font-medium text-[#616161] dark:text-zinc-400 mt-0.5 truncate max-w-full">
                  {formik.values.intro || "One-liner intro"}
                </p>
                {formik.values.isTopMentor && (
                  <Badge className="mt-2.5 bg-amber-400 text-amber-950 border-none text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 rounded-[4px]">
                    <Sparkles className="h-3 w-3" />
                    Top {singularName}
                  </Badge>
                )}
              </div>

              {/* Summary rows */}
              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Category"
                  value={
                    categories.find(
                      (c: any) => c.id === formik.values.category,
                    )?.title || "Not selected"
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
              <div className="text-[12.5px] text-[#616161] dark:text-zinc-400 space-y-2 leading-[18px]">
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
            <Alert variant="destructive" className="rounded-[8px]">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Onboarding Failed</AlertTitle>
              <AlertDescription>
                {submitError}
                {onDismissError && (
                  <button
                    type="button"
                    onClick={onDismissError}
                    className="ml-2 underline text-xs cursor-pointer"
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
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#616161]" />
                  <Input
                    placeholder="Search users by name..."
                    className="h-[40px] pl-9 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] text-[#303030] dark:text-zinc-100 rounded-[8px]"
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
                      className="group flex items-center justify-between p-3 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900 hover:border-[#aeb4b9] hover:bg-[#f6f6f7] transition-all cursor-pointer"
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-[#e1e3e5] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 shrink-0">
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
                              <User className="h-5 w-5 text-[#8c9196]" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[13.5px] font-semibold text-[#303030] dark:text-zinc-100 transition-colors">
                            {user?.user?.firstName} {user?.user?.lastName}
                          </p>
                          {user?.user?.profile?.headline && (
                            <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 font-medium">
                              {user.user.profile.headline}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="h-7 w-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 bg-[#303030] text-white transition-all">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  ))}

                  {searchQuery.length >= 2 &&
                    searchData?.searchUserByName?.length === 0 && (
                      <div className="text-center py-8 bg-[#f6f6f7]/40 dark:bg-zinc-900/50 rounded-[8px] border border-dashed border-[#d2d5d9] dark:border-zinc-800">
                        <User className="h-8 w-8 text-[#8c9196] mx-auto mb-2" />
                        <p className="text-[12px] text-[#616161] font-medium">
                          No users found matching &quot;{searchQuery}&quot;
                        </p>
                      </div>
                    )}

                  {!searchQuery && (
                    <div className="text-center py-8">
                      <Sparkles className="h-8 w-8 text-[#d2d5d9] dark:text-zinc-700 mx-auto mb-2" />
                      <p className="text-[12px] text-[#616161] font-medium">
                        Start typing a name to find a{" "}
                        {singularName.toLowerCase()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Selected user chip */
              <div className="flex items-center justify-between p-3 rounded-[8px] border border-[#aeb4b9] bg-[#f6f6f7] dark:bg-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-[#e1e3e5] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 shrink-0">
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
                        <User className="h-5 w-5 text-[#8c9196]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[13.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        {selectedUser.user?.firstName}{" "}
                        {selectedUser.user?.lastName}
                      </p>
                      <div className="h-4 w-4 rounded-full bg-[#303030] dark:bg-zinc-100 flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-white dark:text-zinc-900 stroke-[3px]" />
                      </div>
                    </div>
                    {selectedUser.user?.profile?.headline && (
                      <p className="text-[11.5px] text-[#616161] font-medium">
                        {selectedUser.user.profile.headline}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-[#616161] hover:text-[#d72c0d] hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-[6px] text-xs h-8 cursor-pointer"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Display Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="displayName"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                >
                  Public Display Name{" "}
                  <span className="text-[#d72c0d] ml-0.5">*</span>
                </label>
                <Input
                  id="displayName"
                  name="displayName"
                  placeholder={`e.g. ${singularName} Jane Doe`}
                  value={formik.values.displayName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
                />
                {formik.touched.displayName && formik.errors.displayName && (
                  <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                    {formik.errors.displayName as string}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
                  {singularName} Category{" "}
                  <span className="text-[#d72c0d] ml-0.5">*</span>
                </label>
                <Select
                  value={formik.values.category}
                  onValueChange={(value) =>
                    formik.setFieldValue("category", value)
                  }
                >
                  <SelectTrigger className="h-[40px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] text-[#303030] dark:text-zinc-100 rounded-[8px]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id}
                        className="text-[13px]"
                      >
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.category && formik.errors.category && (
                  <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                    {formik.errors.category as string}
                  </p>
                )}
              </div>
            </div>

            {/* One-liner Intro & Greatest Achievement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="intro"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                >
                  One-liner Intro{" "}
                  <span className="text-[#d72c0d] ml-0.5">*</span>
                </label>
                <Input
                  id="intro"
                  name="intro"
                  placeholder="e.g. Passionate about helping developers grow"
                  value={formik.values.intro}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
                />
                {formik.touched.intro && formik.errors.intro && (
                  <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                    {formik.errors.intro as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="greatestAchievement"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                >
                  Greatest Achievement{" "}
                  <span className="text-[#d72c0d] ml-0.5">*</span>
                </label>
                <Input
                  id="greatestAchievement"
                  name="greatestAchievement"
                  placeholder="e.g. Scaled a product to 1M users"
                  value={formik.values.greatestAchievement}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
                />
                {formik.touched.greatestAchievement &&
                  formik.errors.greatestAchievement && (
                    <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                      {formik.errors.greatestAchievement as string}
                    </p>
                  )}
              </div>
            </div>

            {/* About & Motivation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="about"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                >
                  About Me <span className="text-[#d72c0d] ml-0.5">*</span>
                </label>
                <Textarea
                  id="about"
                  name="about"
                  placeholder="Tell us about yourself..."
                  value={formik.values.about}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="min-h-[100px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] text-[#303030] dark:text-zinc-100 rounded-[8px] p-3 resize-none shadow-none"
                />
                {formik.touched.about && formik.errors.about && (
                  <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                    {formik.errors.about as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="whyDoWantBecomeMentor"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                >
                  Motivation for {moduleName}
                </label>
                <Textarea
                  id="whyDoWantBecomeMentor"
                  name="whyDoWantBecomeMentor"
                  placeholder={`Why do you want to become a ${singularName.toLowerCase()}?`}
                  value={formik.values.whyDoWantBecomeMentor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="min-h-[100px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] text-[#303030] dark:text-zinc-100 rounded-[8px] p-3 resize-none shadow-none"
                />
              </div>
            </div>

            {/* Description / Bio Extras */}
            <div className="space-y-1.5 pt-2">
              <label
                htmlFor="description"
                className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
              >
                Description / Bio Extras
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Any additional details you'd like to share..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="min-h-[80px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] text-[#303030] dark:text-zinc-100 rounded-[8px] p-3 resize-none shadow-none"
              />
            </div>

            {/* Top Mentor Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 mt-2">
              <div className="space-y-0.5">
                <label
                  htmlFor="isTopMentor"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Mark as Top {singularName}
                </label>
                <p className="text-[11.5px] text-[#616161]">
                  Feature this {singularName.toLowerCase()} at the top of
                  listings
                </p>
              </div>
              <Checkbox
                id="isTopMentor"
                checked={formik.values.isTopMentor}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("isTopMentor", checked)
                }
                className="h-5 w-5 rounded-[4px]"
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
            <PolarisMultiSelect
              id="skills"
              placeholder="Select skills..."
              searchPlaceholder="Search available skills..."
              values={formik.values.skills}
              onChange={(vals) => formik.setFieldValue("skills", vals)}
              options={availableSkills.map((skill: any) => ({
                value: skill.title || skill.name || skill.id,
                label: skill.title || skill.name,
              }))}
              error={
                formik.touched.skills && formik.errors.skills
                  ? String(formik.errors.skills)
                  : null
              }
            />
          </PolarisFormCard>

          {/* ── Step 4: External Links ─────────────────────────────── */}
          <PolarisFormCard
            step={4}
            title="External Links"
            description="Optionally attach a featured article or intro video to enrich the profile."
            badge="Optional"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="featuredArticle"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none flex items-center gap-1.5"
                >
                  <LinkIcon className="h-3 w-3 text-[#616161]" />
                  Featured Article URL
                </label>
                <Input
                  id="featuredArticle"
                  name="featuredArticle"
                  placeholder="https://medium.com/@username/article"
                  value={formik.values.featuredArticle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
                />
                {formik.touched.featuredArticle &&
                  formik.errors.featuredArticle && (
                    <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                      {formik.errors.featuredArticle as string}
                    </p>
                  )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="introVideo"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none flex items-center gap-1.5"
                >
                  <Globe className="h-3 w-3 text-[#616161]" />
                  Intro Video URL
                </label>
                <Input
                  id="introVideo"
                  name="introVideo"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formik.values.introVideo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
                />
                {formik.touched.introVideo && formik.errors.introVideo && (
                  <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
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
            <div className="flex items-start gap-4 p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40">
              <Checkbox
                id="agreement"
                checked={formik.values.agreement}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("agreement", checked)
                }
                className="mt-0.5 h-5 w-5 rounded-[4px]"
              />
              <div className="space-y-1">
                <label
                  htmlFor="agreement"
                  className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100 cursor-pointer block"
                >
                  Confirm Onboarding Agreement
                </label>
                <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 font-medium leading-[16px]">
                  By checking this box, you confirm that this user has agreed to
                  be a {singularName.toLowerCase()} and the information
                  provided is accurate. The {singularName.toLowerCase()} profile
                  will be automatically approved.
                </p>
              </div>
            </div>
            {formik.touched.agreement && formik.errors.agreement && (
              <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
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
