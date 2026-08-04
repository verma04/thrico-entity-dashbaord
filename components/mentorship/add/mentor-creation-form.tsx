"use client";

import { useState, useMemo } from "react";
import { FormikProvider, useFormik } from "formik";
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
import { Badge } from "@/components/ui/badge";
import { notify } from "@/lib/notify";
import {
  User,
  ChevronRight,
  Search,
  CheckCircle2,
  Check,
  ChevronDown,
  X,
  Loader2,
  GraduationCap,
  Sparkles,
  Link as LinkIcon,
  MapPin,
  Clock,
  Layout,
  Globe,
  AlertTriangle,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  const categories = categoriesData?.getMentorCategories || [];
  const availableSkills = skillsData?.getMentorSkills || [];

  return (
    <FormikProvider value={formik}>
      <div className="flex flex-col h-full bg-slate-50/50 overflow-hidden">
        {/* Header section - Sticky */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
          <div className="max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 rounded-xl bg-indigo-600/10 ring-1 ring-indigo-600/20">
                  <GraduationCap className="h-5 w-5 text-indigo-600" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  Onboard {singularName}
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 ml-1">
                <span>{moduleName}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-indigo-600">Add {singularName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-10">
            {/* Error Banner */}
            {submitError && (
              <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-rose-50 border border-rose-200 ring-1 ring-rose-100">
                  <div className="shrink-0 mt-0.5">
                    <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-rose-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-rose-900 uppercase tracking-wide mb-1">
                      Onboarding Failed
                    </h4>
                    <p className="text-sm font-medium text-rose-700 leading-relaxed">
                      {submitError}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onDismissError}
                    className="shrink-0 p-1.5 rounded-lg hover:bg-rose-100 text-rose-400 hover:text-rose-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-8">
                {/* Step 1: User Selection */}
                {!selectedUser ? (
                  <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden rounded-2xl bg-white transition-all duration-300">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Search className="h-4 w-4 text-indigo-600" />
                        <CardTitle className="text-lg font-bold text-slate-800">
                          Step 1: Find User
                        </CardTitle>
                      </div>
                      <CardDescription className="text-slate-500 font-medium">
                        Search and select a user to onboard as a{" "}
                        {singularName.toLowerCase()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-6">
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          placeholder="Search users by name..."
                          className="h-12 pl-11 rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-500/5 transition-all text-lg"
                          value={searchQuery}
                          onChange={handleSearch}
                        />
                        {searching && (
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                            <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        {searchData?.searchUserByName?.map((user: any) => (
                          <div
                            key={user?.id}
                            className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all cursor-pointer"
                            onClick={() => handleSelectUser(user)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                {user?.user?.avatar ? (
                                  <Image
                                    src={`https://cdn.thrico.network/${user?.user?.avatar}`}
                                    alt="Avatar"
                                    width={56}
                                    height={56}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center">
                                    <User className="h-6 w-6 text-slate-300" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  {user?.user?.firstName} {user?.user?.lastName}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] h-5 bg-slate-50 text-slate-500 border-slate-200 uppercase font-bold tracking-wider"
                                  >
                                    {user?.status}
                                  </Badge>
                                  {user?.user?.profile?.headline && (
                                    <>
                                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                                      <span className="text-xs text-slate-500 font-medium">
                                        {user?.user?.profile.headline}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="h-10 w-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 bg-indigo-600 text-white transition-all transform group-hover:scale-110 shadow-lg shadow-indigo-200">
                              <Check className="h-5 w-5" />
                            </div>
                          </div>
                        ))}
                        {searchQuery.length >= 2 &&
                          searchData?.searchUserByName?.length === 0 && (
                            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                              <User className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                              <p className="text-slate-500 font-medium">
                                No users found matching "{searchQuery}"
                              </p>
                            </div>
                          )}
                        {!searchQuery && !selectedUser && (
                          <div className="text-center py-10">
                            <Sparkles className="h-10 w-10 text-indigo-100 mx-auto mb-3" />
                            <p className="text-slate-400 font-medium text-sm">
                              Start typing a name to find a potential{" "}
                              {singularName.toLowerCase()}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    {/* User Profile Hooked */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-violet-500 rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
                      <div className="relative flex items-center justify-between p-6 bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-5">
                          <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-xl rotate-[-2deg] group-hover:rotate-0 transition-transform">
                            {selectedUser?.user?.avatar ? (
                              <Image
                                src={`https://cdn.thrico.network/${selectedUser?.user?.avatar}`}
                                alt="Avatar"
                                width={80}
                                height={80}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <User className="h-8 w-8 text-slate-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                                {selectedUser?.user?.firstName}{" "}
                                {selectedUser?.user?.lastName}
                              </h2>
                              <div className="h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center">
                                <Check className="h-3 w-3 text-white stroke-[3px]" />
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                              {selectedUser?.user?.profile?.headline && (
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
                                  <Layout className="h-3.5 w-3.5" />
                                  <span>
                                    {selectedUser?.user?.profile.headline}
                                  </span>
                                </div>
                              )}
                              {selectedUser?.user?.profile?.currentPosition && (
                                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                                  <span>
                                    {
                                      selectedUser?.user?.profile
                                        .currentPosition
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl"
                          onClick={() => {
                            setSelectedUser(null);
                            formik.resetForm();
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Change User
                        </Button>
                      </div>
                    </div>

                    {/* Mentorship Settings */}
                    <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden rounded-2xl bg-white">
                      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <GraduationCap className="h-4 w-4 text-indigo-600" />
                          <CardTitle className="text-lg font-bold text-slate-800">
                            {moduleName} Details
                          </CardTitle>
                        </div>
                        <CardDescription className="text-slate-500 font-medium">
                          Define the {singularName.toLowerCase()}'s profile and
                          credentials
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Display Name */}
                          <div className="space-y-2.5">
                            <Label
                              htmlFor="displayName"
                              className="text-sm font-bold text-slate-700 flex items-center gap-2"
                            >
                              Public Display Name{" "}
                              <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                              id="displayName"
                              name="displayName"
                              placeholder={`e.g. ${singularName} John Doe`}
                              className="h-11 rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                              value={formik.values.displayName}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.displayName &&
                              formik.errors.displayName && (
                                <p className="text-xs font-semibold text-rose-500 ml-1">
                                  {formik.errors.displayName as string}
                                </p>
                              )}
                          </div>

                          {/* Category */}
                          <div className="space-y-2.5">
                            <Label
                              htmlFor="category"
                              className="text-sm font-bold text-slate-700 flex items-center gap-2"
                            >
                              {singularName} Category{" "}
                              <span className="text-rose-500">*</span>
                            </Label>
                            <Select
                              value={formik.values.category}
                              onValueChange={(value) =>
                                formik.setFieldValue("category", value)
                              }
                            >
                              <SelectTrigger className="h-11 rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-200 shadow-xl overflow-hidden">
                                {categories.map((cat: any) => (
                                  <SelectItem
                                    key={cat.id}
                                    value={cat.id}
                                    className="py-2.5"
                                  >
                                    {cat.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formik.touched.category &&
                              formik.errors.category && (
                                <p className="text-xs font-semibold text-rose-500 ml-1">
                                  {formik.errors.category as string}
                                </p>
                              )}
                          </div>
                        </div>

                        {/* Top Mentor Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-xl border border-indigo-100 bg-indigo-50/30">
                          <div className="space-y-0.5">
                            <Label
                              htmlFor="isTopMentor"
                              className="text-sm font-bold text-slate-700 flex items-center gap-2"
                            >
                              <Sparkles className="h-4 w-4 text-indigo-500" />
                              Mark as Top {singularName}
                            </Label>
                            <p className="text-[10px] font-medium text-slate-500">
                              Feature this {singularName.toLowerCase()} at the
                              top of listings
                            </p>
                          </div>
                          <Checkbox
                            id="isTopMentor"
                            checked={formik.values.isTopMentor}
                            onCheckedChange={(checked) =>
                              formik.setFieldValue("isTopMentor", checked)
                            }
                            className="h-5 w-5 rounded-md border-indigo-300 data-[state=checked]:bg-indigo-600"
                          />
                        </div>

                        {/* Skills */}
                        <div className="space-y-3">
                          <Label className="text-sm font-bold text-slate-700">
                            Expertise & Skills{" "}
                            <span className="text-rose-500">*</span>
                          </Label>
                          <div className="relative group/skills">
                            <div className="flex flex-wrap gap-2 p-3 min-h-[50px] bg-white rounded-xl ring-1 ring-slate-200 group-focus-within/skills:ring-2 group-focus-within/skills:ring-indigo-500/20 transition-all">
                              {formik.values.skills.length === 0 && (
                                <span className="text-slate-400 text-sm font-medium py-1.5 pl-1 italic">
                                  No skills selected...
                                </span>
                              )}
                              {formik.values.skills.map((skill: string) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="h-8 pl-3 pr-2 bg-indigo-50 text-indigo-700 border-indigo-100 rounded-lg flex items-center gap-1.5 group/badge font-bold"
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
                                    className="hover:bg-indigo-200 rounded-sm p-0.5 transition-colors"
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
                                      className="h-8 w-8 p-0 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white shadow-md shadow-indigo-200"
                                    >
                                      <Search className="h-4 w-4" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-[300px] p-0 rounded-2xl shadow-2xl border-slate-100"
                                    align="end"
                                  >
                                    <Command>
                                      <CommandInput placeholder="Search or add skill..." />
                                      <CommandList className="max-h-[300px]">
                                        <CommandEmpty>
                                          <button
                                            type="button"
                                            className="w-full text-left p-4 text-sm font-bold text-indigo-600 hover:bg-indigo-50"
                                            onClick={() => {
                                              const input =
                                                document.querySelector(
                                                  "[cmdk-input]",
                                                ) as HTMLInputElement;
                                              const val = input.value;
                                              if (
                                                val &&
                                                !formik.values.skills.includes(
                                                  val,
                                                )
                                              ) {
                                                formik.setFieldValue("skills", [
                                                  ...formik.values.skills,
                                                  val,
                                                ]);
                                              }
                                            }}
                                          >
                                            + Add "New Skill"
                                          </button>
                                        </CommandEmpty>
                                        <CommandGroup heading="Available Skills">
                                          {availableSkills.map((skill: any) => (
                                            <CommandItem
                                              key={skill.id}
                                              onSelect={() => {
                                                if (
                                                  !formik.values.skills.includes(
                                                    skill.title,
                                                  )
                                                ) {
                                                  formik.setFieldValue(
                                                    "skills",
                                                    [
                                                      ...formik.values.skills,
                                                      skill.title,
                                                    ],
                                                  );
                                                }
                                              }}
                                              className="py-2.5 px-4 cursor-pointer"
                                            >
                                              <Check
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  formik.values.skills.includes(
                                                    skill.title,
                                                  )
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                                )}
                                              />
                                              <span className="font-semibold text-slate-700">
                                                {skill.title}
                                              </span>
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
                              <p className="text-xs font-semibold text-rose-500 mt-2">
                                {formik.errors.skills as string}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Description & Intro */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2.5">
                            <Label
                              htmlFor="intro"
                              className="text-sm font-bold text-slate-700 flex items-center gap-2"
                            >
                              One-liner Intro{" "}
                              <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                              id="intro"
                              name="intro"
                              placeholder="e.g. Passionate about helping developers grow"
                              className="h-11 rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                              value={formik.values.intro}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.intro && formik.errors.intro && (
                              <p className="text-xs font-semibold text-rose-500 ml-1">
                                {formik.errors.intro as string}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2.5">
                            <Label
                              htmlFor="greatestAchievement"
                              className="text-sm font-bold text-slate-700 flex items-center gap-2"
                            >
                              Greatest Achievement{" "}
                              <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                              id="greatestAchievement"
                              name="greatestAchievement"
                              placeholder="e.g. Scaled a product to 1M users"
                              className="h-11 rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                              value={formik.values.greatestAchievement}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.greatestAchievement &&
                              formik.errors.greatestAchievement && (
                                <p className="text-xs font-semibold text-rose-500 ml-1">
                                  {formik.errors.greatestAchievement as string}
                                </p>
                              )}
                          </div>
                        </div>

                        {/* About & Why */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2.5">
                            <Label
                              htmlFor="about"
                              className="text-sm font-bold text-slate-700"
                            >
                              About Me <span className="text-rose-500">*</span>
                            </Label>
                            <Textarea
                              id="about"
                              name="about"
                              placeholder="Tell us about yourself..."
                              className="min-h-[120px] rounded-2xl border-slate-200 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none p-4 font-medium"
                              value={formik.values.about}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.about && formik.errors.about && (
                              <p className="text-xs font-semibold text-rose-500 ml-1">
                                {formik.errors.about as string}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2.5">
                            <Label
                              htmlFor="whyDoWantBecomeMentor"
                              className="text-sm font-bold text-slate-700"
                            >
                              Motivation for {moduleName}
                            </Label>
                            <Textarea
                              id="whyDoWantBecomeMentor"
                              name="whyDoWantBecomeMentor"
                              placeholder={`Why do you want to become a ${singularName.toLowerCase()}?`}
                              className="min-h-[120px] rounded-2xl border-slate-200 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none p-4 font-medium"
                              value={formik.values.whyDoWantBecomeMentor}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2.5">
                          <Label
                            htmlFor="description"
                            className="text-sm font-bold text-slate-700"
                          >
                            Description / Bio Extras
                          </Label>
                          <Textarea
                            id="description"
                            name="description"
                            placeholder="Any additional details you'd like to share..."
                            className="min-h-[100px] rounded-2xl border-slate-200 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none p-4 font-medium"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </div>

                        {/* External Links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2.5">
                            <Label
                              htmlFor="featuredArticle"
                              className="text-sm font-bold text-slate-700 flex items-center gap-2"
                            >
                              <LinkIcon className="h-3.5 w-3.5 text-indigo-500" />
                              Featured Article URL
                            </Label>
                            <Input
                              id="featuredArticle"
                              name="featuredArticle"
                              placeholder="https://medium.com/@username/article"
                              className="h-11 rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                              value={formik.values.featuredArticle}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.featuredArticle &&
                              formik.errors.featuredArticle && (
                                <p className="text-xs font-semibold text-rose-500 ml-1">
                                  {formik.errors.featuredArticle as string}
                                </p>
                              )}
                          </div>

                          <div className="space-y-2.5">
                            <Label
                              htmlFor="introVideo"
                              className="text-sm font-bold text-slate-700 flex items-center gap-2"
                            >
                              <Globe className="h-3.5 w-3.5 text-indigo-500" />
                              Intro Video URL
                            </Label>
                            <Input
                              id="introVideo"
                              name="introVideo"
                              placeholder="https://youtube.com/watch?v=..."
                              className="h-11 rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                              value={formik.values.introVideo}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.introVideo &&
                              formik.errors.introVideo && (
                                <p className="text-xs font-semibold text-rose-500 ml-1">
                                  {formik.errors.introVideo as string}
                                </p>
                              )}
                          </div>
                        </div>

                        {/* Agreement */}
                        <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                          <Checkbox
                            id="agreement"
                            checked={formik.values.agreement}
                            onCheckedChange={(checked) =>
                              formik.setFieldValue("agreement", checked)
                            }
                            className="mt-1 h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-indigo-600"
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor="agreement"
                              className="text-sm font-bold text-slate-900 cursor-pointer"
                            >
                              Confirm Onboarding Agreement
                            </Label>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed">
                              By checking this box, you confirm that this user
                              has agreed to be a {singularName.toLowerCase()}{" "}
                              and the information provided is accurate. The{" "}
                              {singularName.toLowerCase()} profile will be
                              automatically approved.
                            </p>
                          </div>
                        </div>
                        {formik.touched.agreement &&
                          formik.errors.agreement && (
                            <p className="text-xs font-semibold text-rose-500">
                              {formik.errors.agreement as string}
                            </p>
                          )}
                      </CardContent>
                    </Card>
                  </form>
                )}
              </div>

              {/* Sidebar Preview */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                  <div className="relative group h-fit">
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 to-violet-500/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Card className="relative border-none shadow-xl shadow-indigo-600/5 ring-1 ring-slate-200 rounded-[2.5rem] overflow-hidden bg-white group/preview">
                      <div className="h-32 bg-linear-to-br from-slate-900 to-slate-800 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse" />
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-500 rounded-full -ml-12 -mb-12 blur-3xl" />
                        </div>
                        {/* Decorative Badge */}
                        <div className="absolute top-4 right-4 flex gap-2">
                          <div className="h-8 w-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                            <Sparkles className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </div>

                      <div className="px-8 pb-10 -mt-16 text-center relative">
                        <div className="inline-flex p-1.5 bg-white rounded-[2rem] shadow-2xl mb-5 group/avatar relative">
                          <div className="h-28 w-28 rounded-[1.75rem] bg-indigo-50 flex items-center justify-center overflow-hidden border-2 border-slate-50 relative group-hover/avatar:shadow-inner transition-all">
                            {selectedUser?.user?.avatar ? (
                              <Image
                                src={`https://cdn.thrico.network/${selectedUser?.user?.avatar}`}
                                alt="Avatar"
                                width={112}
                                height={112}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                              />
                            ) : (
                              <User className="h-10 w-10 text-indigo-200" />
                            )}
                          </div>

                          {/* Online status indicator if selected */}
                          {selectedUser && (
                            <div
                              className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-emerald-500 border-4 border-white shadow-sm"
                              title="Online"
                            />
                          )}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="text-2xl font-black text-slate-900 leading-tight">
                              {formik.values.displayName || "Mentor Name"}
                            </h3>
                            {formik.values.intro && (
                              <p className="text-xs font-bold text-slate-500 mt-1 line-clamp-1">
                                {formik.values.intro}
                              </p>
                            )}
                            <div className="flex items-center justify-center gap-1.5 mt-2">
                              <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-full px-4 h-7 text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-indigo-100">
                                {categories.find(
                                  (c: any) => c.id === formik.values.category,
                                )?.title || "Mentorship"}
                              </Badge>
                              {formik.values.isTopMentor && (
                                <Badge className="bg-amber-400 hover:bg-amber-500 text-amber-900 border-none rounded-full px-3 h-7 text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-amber-100 flex items-center gap-1">
                                  <Sparkles className="h-3 w-3" />
                                  Top
                                </Badge>
                              )}
                              <span className="text-xs font-bold text-slate-400">
                                &
                              </span>
                              <div className="flex items-center gap-1 text-xs font-black text-emerald-600 uppercase tracking-tight">
                                <CheckCircle2 className="h-3 w-3" />
                                Verified
                              </div>
                            </div>
                          </div>

                          <div className="pt-6 border-t border-slate-50 flex flex-col gap-4 text-left">
                            <div className="space-y-3">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                                Top Expertise
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {formik.values.skills.length > 0 ? (
                                  formik.values.skills
                                    .slice(0, 3)
                                    .map((skill: string) => (
                                      <div
                                        key={skill}
                                        className="px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border border-slate-100"
                                      >
                                        {skill}
                                      </div>
                                    ))
                                ) : (
                                  <div className="text-xs italic text-slate-400 font-medium px-1">
                                    Select skills to preview
                                  </div>
                                )}
                                {formik.values.skills.length > 3 && (
                                  <div className="px-2 py-1.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-400 border border-slate-100 italic">
                                    +{formik.values.skills.length - 3} more
                                  </div>
                                )}
                              </div>
                            </div>

                            {selectedUser && (
                              <div className="pt-2 flex flex-col gap-2">
                                {selectedUser?.user?.profile
                                  ?.currentPosition && (
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                      <Layout className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 truncate">
                                      {
                                        selectedUser?.user?.profile
                                          .currentPosition
                                      }
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
                                    <Globe className="h-4 w-4" />
                                  </div>
                                  <span className="text-xs font-bold text-slate-600 truncate">
                                    Global Visibility
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Informational Card */}
                  <div className="p-6 rounded-[2rem] bg-indigo-600 text-white shadow-xl shadow-indigo-200 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="relative z-10 flex gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
                        <Sparkles className="h-5 w-5 text-indigo-100" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black uppercase tracking-tight">
                          Direct Onboarding
                        </h4>
                        <p className="text-[11px] text-indigo-50/80 font-medium leading-relaxed">
                          This action bypasses the standard application
                          workflow. Mentors added here are immediately active
                          and accessible by community members.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
          title="Mentor Configuration"
          description={
            selectedUser
              ? `Ready to onboard ${selectedUser?.user?.firstName}`
              : "Please select a user to continue"
          }
          buttonText="Confirm Onboarding"
        />
      </div>
    </FormikProvider>
  );
}
