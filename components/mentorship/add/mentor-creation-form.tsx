"use client";

import React, { useState } from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useSearchUserByName } from "@/graphql/actions/mentorship/mentorship-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@apollo/client";
import { GET_ALL_MENTOR_CATEGORY } from "@/graphql/quries/mentorship/category";
import { GET_ALL_MENTOR_SKILLS } from "@/graphql/quries/mentorship/skills";
import { PolarisMultiSelect } from "@/components/ui/platform/polaris-primitives";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModuleStore } from "@/store/useModuleStore";
import { notify } from "@/lib/notify";
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
              <div className="flex flex-col items-center text-center p-3 bg-[#f6f6f7]/60 dark:bg-zinc-900/60 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800">
                {/* Avatar */}
                <div className="h-16 w-16 rounded-full bg-[#e1e3e5] dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-700 shadow-2xs mb-2.5">
                  {selectedUser?.user?.avatar ? (
                    <Image
                      src={`https://cdn.thrico.network/${selectedUser.user.avatar}`}
                      alt="Avatar"
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-7 w-7 text-[#8c9196]" />
                  )}
                </div>

                <h3 className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100 truncate max-w-full">
                  {formik.values.displayName || `New ${singularName}`}
                </h3>
                <p className="text-[11px] font-medium text-[#616161] dark:text-zinc-400 mt-0.5 truncate max-w-full">
                  {formik.values.intro || "One-liner intro"}
                </p>
                {formik.values.isTopMentor && (
                  <Badge className="mt-2 bg-amber-400 text-amber-950 border-none text-[9.5px] font-bold px-1.5 py-0.5 flex items-center gap-1 rounded-[3px]">
                    <Sparkles className="h-2.5 w-2.5" />
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
              <div className="text-[11.5px] text-[#616161] dark:text-zinc-400 space-y-1.5 leading-[16px]">
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
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Server error */}
          {submitError && (
            <Alert variant="destructive" className="rounded-[6px]">
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
              <div className="space-y-2.5">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#616161]" />
                  <input
                    placeholder="Search users by name..."
                    className="w-full h-[34px] pl-8 pr-8 bg-white dark:bg-zinc-900 border border-[#aeb4b9] dark:border-zinc-700 text-[12.5px] text-[#303030] dark:text-zinc-100 rounded-[6px] outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3]"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  {searching && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-3.5 w-3.5 text-[#616161] animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  {searchData?.searchUserByName?.map((user: any) => (
                    <div
                      key={user?.id}
                      className="group flex items-center justify-between p-2.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900 hover:border-[#aeb4b9] hover:bg-[#f6f6f7] transition-all cursor-pointer"
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-[#e1e3e5] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 shrink-0">
                          {user?.user?.avatar ? (
                            <Image
                              src={`https://cdn.thrico.network/${user?.user?.avatar}`}
                              alt="Avatar"
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <User className="h-4 w-4 text-[#8c9196]" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 transition-colors">
                            {user?.user?.firstName} {user?.user?.lastName}
                          </p>
                          {user?.user?.profile?.headline && (
                            <p className="text-[11px] text-[#616161] dark:text-zinc-400 font-medium">
                              {user.user.profile.headline}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="h-6 w-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 bg-[#303030] text-white transition-all">
                        <Check className="h-3 w-3" />
                      </div>
                    </div>
                  ))}

                  {searchQuery.length >= 2 &&
                    searchData?.searchUserByName?.length === 0 && (
                      <div className="text-center py-6 bg-[#f6f6f7]/40 dark:bg-zinc-900/50 rounded-[6px] border border-dashed border-[#d2d5d9] dark:border-zinc-800">
                        <User className="h-6 w-6 text-[#8c9196] mx-auto mb-1.5" />
                        <p className="text-[11.5px] text-[#616161] font-medium">
                          No users found matching &quot;{searchQuery}&quot;
                        </p>
                      </div>
                    )}

                  {!searchQuery && (
                    <div className="text-center py-6">
                      <Sparkles className="h-6 w-6 text-[#d2d5d9] dark:text-zinc-700 mx-auto mb-1.5" />
                      <p className="text-[11.5px] text-[#616161] font-medium">
                        Start typing a name to find a{" "}
                        {singularName.toLowerCase()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Selected user chip */
              <div className="flex items-center justify-between p-2.5 rounded-[6px] border border-[#aeb4b9] bg-[#f6f6f7] dark:bg-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-[#e1e3e5] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 shrink-0">
                    {selectedUser?.user?.avatar ? (
                      <Image
                        src={`https://cdn.thrico.network/${selectedUser.user.avatar}`}
                        alt="Avatar"
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <User className="h-4 w-4 text-[#8c9196]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        {selectedUser.user?.firstName}{" "}
                        {selectedUser.user?.lastName}
                      </p>
                      <div className="h-3.5 w-3.5 rounded-full bg-[#303030] dark:bg-zinc-100 flex items-center justify-center">
                        <Check className="h-2 w-2 text-white dark:text-zinc-900 stroke-[3px]" />
                      </div>
                    </div>
                    {selectedUser.user?.profile?.headline && (
                      <p className="text-[11px] text-[#616161] font-medium">
                        {selectedUser.user.profile.headline}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-[#616161] hover:text-[#d72c0d] hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-[4px] text-[11.5px] h-7 px-2 cursor-pointer"
                  onClick={() => {
                    setSelectedUser(null);
                    formik.resetForm();
                  }}
                >
                  <X className="h-3 w-3 mr-1" />
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
              <PolarisInput
                id="displayName"
                name="displayName"
                label="Public Display Name"
                required
                placeholder={`e.g. ${singularName} Jane Doe`}
                value={formik.values.displayName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.displayName && formik.errors.displayName ? String(formik.errors.displayName) : undefined}
              />

              <div className="space-y-1">
                <PolarisLabel required>{singularName} Category</PolarisLabel>
                <Select
                  value={formik.values.category}
                  onValueChange={(value) =>
                    formik.setFieldValue("category", value)
                  }
                >
                  <SelectTrigger className="h-[34px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12.5px] text-[#303030] dark:text-zinc-100 rounded-[6px]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id}
                        className="text-[12.5px]"
                      >
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.category && formik.errors.category && (
                  <p className="text-[12px] text-[#d72c0d] font-normal leading-[16px]">
                    {formik.errors.category as string}
                  </p>
                )}
              </div>
            </div>

            {/* One-liner Intro & Greatest Achievement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisInput
                id="intro"
                name="intro"
                label="One-liner Intro"
                required
                placeholder="e.g. Passionate about helping developers grow"
                value={formik.values.intro}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.intro && formik.errors.intro ? String(formik.errors.intro) : undefined}
              />

              <PolarisInput
                id="greatestAchievement"
                name="greatestAchievement"
                label="Greatest Achievement"
                required
                placeholder="e.g. Scaled a product to 1M users"
                value={formik.values.greatestAchievement}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.greatestAchievement && formik.errors.greatestAchievement ? String(formik.errors.greatestAchievement) : undefined}
              />
            </div>

            {/* About & Motivation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisTextarea
                id="about"
                name="about"
                label="About Me"
                required
                rows={3}
                placeholder="Tell us about yourself..."
                value={formik.values.about}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.about && formik.errors.about ? String(formik.errors.about) : undefined}
              />

              <PolarisTextarea
                id="whyDoWantBecomeMentor"
                name="whyDoWantBecomeMentor"
                label={`Motivation for ${moduleName}`}
                rows={3}
                placeholder={`Why do you want to become a ${singularName.toLowerCase()}?`}
                value={formik.values.whyDoWantBecomeMentor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* Description / Bio Extras */}
            <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisTextarea
                id="description"
                name="description"
                label="Description / Bio Extras"
                rows={2}
                placeholder="Any additional details you'd like to share..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* Top Mentor Toggle */}
            <div className="flex items-center justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 mt-1">
              <div className="space-y-0.5">
                <label
                  htmlFor="isTopMentor"
                  className="text-[12.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[18px] select-none flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  Mark as Top {singularName}
                </label>
                <p className="text-[11px] text-[#616161]">
                  Feature this {singularName.toLowerCase()} at the top of listings
                </p>
              </div>
              <Checkbox
                id="isTopMentor"
                checked={formik.values.isTopMentor}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("isTopMentor", checked)
                }
                className="h-4 w-4 rounded-[3px]"
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
              <PolarisInput
                id="featuredArticle"
                name="featuredArticle"
                label="Featured Article URL"
                placeholder="https://medium.com/@username/article"
                prefix={<LinkIcon className="h-3.5 w-3.5 text-[#616161]" />}
                value={formik.values.featuredArticle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.featuredArticle && formik.errors.featuredArticle ? String(formik.errors.featuredArticle) : undefined}
              />

              <PolarisInput
                id="introVideo"
                name="introVideo"
                label="Intro Video URL"
                placeholder="https://youtube.com/watch?v=..."
                prefix={<Globe className="h-3.5 w-3.5 text-[#616161]" />}
                value={formik.values.introVideo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.introVideo && formik.errors.introVideo ? String(formik.errors.introVideo) : undefined}
              />
            </div>
          </PolarisFormCard>

          {/* ── Step 5: Onboarding Agreement ───────────────────────── */}
          <PolarisFormCard
            step={5}
            title="Onboarding Agreement"
            description="Confirm that the user has agreed to be onboarded and all information is accurate."
            badge="Required"
          >
            <div className="flex items-start gap-3 p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40">
              <Checkbox
                id="agreement"
                checked={formik.values.agreement}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("agreement", checked)
                }
                className="mt-0.5 h-4 w-4 rounded-[3px]"
              />
              <div className="space-y-0.5">
                <label
                  htmlFor="agreement"
                  className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 cursor-pointer block"
                >
                  Confirm Onboarding Agreement
                </label>
                <p className="text-[11px] text-[#616161] dark:text-zinc-400 font-medium leading-[15px]">
                  By checking this box, you confirm that this user has agreed to
                  be a {singularName.toLowerCase()} and the information
                  provided is accurate. The {singularName.toLowerCase()} profile
                  will be automatically approved.
                </p>
              </div>
            </div>
            {formik.touched.agreement && formik.errors.agreement && (
              <p className="text-[12px] text-[#d72c0d] font-normal leading-[16px]">
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
