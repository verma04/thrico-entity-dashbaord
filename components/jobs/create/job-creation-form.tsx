"use client";

import React from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Globe,
  GraduationCap,
  Sparkles,
  Trash2,
  CheckCircle2,
  Building,
  Laptop,
  Layers,
} from "lucide-react";
import { CompanyAutocompleteSelect } from "./company-auto-complete";
import { JobTitleAutocomplete } from "./job-title-auto-complete";
import { SkillsAutocomplete } from "./skills-auto-complete";
import GooglePlacesInput from "@/components/layout/google-place-input";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { cn } from "@/lib/utils";
import { useModuleStore } from "@/store/useModuleStore";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";

interface ListingCreationFormProps {
  initialValues?: Record<string, any>;
  loading?: boolean;
  onFinish: (values: any) => void;
  onCancel?: () => void;
}

const jobSchema = Yup.object().shape({
  title: Yup.string().required("Job title is required"),
  company: Yup.mixed().required("Company name is required"),
  location: Yup.object().nullable().required("Location is required"),
  salary: Yup.string(),
  jobType: Yup.string().required("Job type is required"),
  workplaceType: Yup.string().required("Work arrangement is required"),
  experienceLevel: Yup.string().required("Experience level is required"),
  description: Yup.string()
    .required("Job description is required")
    .min(30, "Description must be at least 30 characters"),
  requirements: Yup.array().of(
    Yup.string().required("Requirement cannot be empty"),
  ),
  responsibilities: Yup.array().of(
    Yup.string().required("Responsibility cannot be empty"),
  ),
  benefits: Yup.array().of(Yup.string().required("Benefit cannot be empty")),
  skills: Yup.array().of(Yup.string().required("Skill cannot be empty")),
});

export function JobCreationForm({
  initialValues,
  loading,
  onFinish,
  onCancel,
}: ListingCreationFormProps) {
  const moduleName = useModuleStore((state) => state.jobModuleName);
  const singularName = useModuleStore((state) => state.jobSingularName);

  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || "",
      company: initialValues?.company || "",
      location: initialValues?.location || "",
      salary: initialValues?.salary || "",
      jobType: initialValues?.jobType || "FULL-TIME",
      workplaceType: initialValues?.workplaceType || "REMOTE",
      experienceLevel: initialValues?.experienceLevel || "MID-LEVEL",
      description: initialValues?.description || "",
      requirements: initialValues?.requirements || [""],
      responsibilities: initialValues?.responsibilities || [""],
      benefits: initialValues?.benefits || [""],
      skills: initialValues?.skills || [""],
    },
    validationSchema: jobSchema,
    onSubmit: (values) => {
      onFinish(values);
    },
  });

  const handleAddListItem = (fieldName: string) => {
    const currentList = formik.values[
      fieldName as keyof typeof formik.values
    ] as string[];
    formik.setFieldValue(fieldName, [...currentList, ""]);
  };

  const handleRemoveListItem = (fieldName: string, index: number) => {
    const currentList = formik.values[
      fieldName as keyof typeof formik.values
    ] as string[];
    if (currentList.length > 1) {
      const newList = currentList.filter((_, i) => i !== index);
      formik.setFieldValue(fieldName, newList);
    }
  };

  const handleListChange = (
    fieldName: string,
    index: number,
    value: string,
  ) => {
    const currentList = formik.values[
      fieldName as keyof typeof formik.values
    ] as string[];
    const newList = [...currentList];
    newList[index] = value;
    formik.setFieldValue(fieldName, newList);
  };

  const formatLocationName = (loc: any) => {
    if (!loc) return "Location not set";
    if (typeof loc === "string") return loc;
    return loc.name || loc.address || "Location not set";
  };

  const getCompanyName = () => {
    if (!formik.values.company) return "Hiring Company";
    if (typeof formik.values.company === "string") return formik.values.company;
    return formik.values.company.name || "Hiring Company";
  };

  const renderListBuilder = (
    fieldName: string,
    label: string,
    placeholder: string,
    Icon: React.ElementType,
  ) => {
    const list = formik.values[fieldName as keyof typeof formik.values] as string[];
    return (
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {label}
            </Label>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {list.filter((i) => i.trim()).length}
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddListItem(fieldName)}
            className="h-7 px-2.5 text-xs font-semibold border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Item
          </Button>
        </div>

        <div className="space-y-2">
          {list.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder={placeholder}
                value={item}
                onChange={(e) =>
                  handleListChange(fieldName, index, e.target.value)
                }
                onBlur={formik.handleBlur}
                name={`${fieldName}[${index}]`}
                className="h-9 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-medium"
              />
              {list.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveListItem(fieldName, index)}
                  className="h-8 w-8 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <FormikProvider value={formik}>
      <PolarisFormLayout
        sidebar={
          <div className="space-y-6">
            {/* Live Role Preview Card */}
            <PolarisSidebarCard title={`${singularName} Preview`} badge="Live Preview" icon={Sparkles}>
              <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-4 space-y-4 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center border border-zinc-800 dark:border-zinc-200 shrink-0 overflow-hidden shadow-xs">
                    {typeof formik.values.company === "object" && formik.values.company?.logo ? (
                      <Avatar className="h-full w-full rounded-none">
                        <AvatarImage
                          src={`https://cdn.thrico.network/${formik.values.company.logo}`}
                          alt={getCompanyName()}
                        />
                        <AvatarFallback className="bg-transparent text-white dark:text-zinc-900 font-bold text-xs">
                          {getCompanyName().charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Briefcase className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                      {formik.values.title || `${singularName} Role Title`}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5 truncate">
                      <Building className="h-3 w-3 shrink-0" />
                      {getCompanyName()}
                    </p>
                  </div>
                </div>

                {/* Metadata Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Badge
                    variant="outline"
                    className="bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 text-[10px] font-semibold"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    {formatLocationName(formik.values.location)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-none text-[10px] font-bold"
                  >
                    {formik.values.workplaceType}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 text-[10px] font-semibold"
                  >
                    {formik.values.jobType}
                  </Badge>
                  {formik.values.salary && (
                    <Badge
                      variant="outline"
                      className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 text-[10px] font-semibold"
                    >
                      <DollarSign className="h-3 w-3 mr-0.5" />
                      {formik.values.salary}
                    </Badge>
                  )}
                </div>

                {/* Description Snippet */}
                <div className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  {formik.values.description || "Role overview and expectations will appear here..."}
                </div>

                {/* Skills tags preview */}
                {formik.values.skills.some((s: string) => s.trim()) && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Core Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {formik.values.skills
                        .filter((s: string) => s.trim())
                        .slice(0, 4)
                        .map((skill: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Structured Configuration Breakdown */}
              <div className="space-y-1.5 pt-2">
                <PolarisSummaryRow
                  label="Role Title"
                  value={
                    <span className="truncate max-w-[150px] inline-block font-semibold">
                      {formik.values.title || "Not set"}
                    </span>
                  }
                />
                <PolarisSummaryRow
                  label="Hiring Company"
                  value={
                    <span className="truncate max-w-[150px] inline-block">
                      {getCompanyName()}
                    </span>
                  }
                />
                <PolarisSummaryRow
                  label="Arrangement"
                  value={formik.values.workplaceType}
                />
                <PolarisSummaryRow
                  label="Engagement"
                  value={formik.values.jobType}
                />
                <PolarisSummaryRow
                  label="Seniority"
                  value={formik.values.experienceLevel}
                />
                <PolarisSummaryRow
                  label="Compensation"
                  value={formik.values.salary || "Undisclosed"}
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Role Strategy Tip */}
            <PolarisTipCard title={`${singularName} Posting Advice`}>
              Clear compensation brackets and explicit skill tags attract 3.5× more qualified applicants from within your member ecosystem.
            </PolarisTipCard>
          </div>
        }
      >
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Step 1: Role Overview & Organization */}
          <PolarisFormCard
            step={1}
            title={`Core ${singularName} Details & Organization`}
            description={`Specify the role title, hiring company entity, geographic location, and compensation parameters.`}
            badge="Required"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {singularName} Title <span className="text-rose-500">*</span>
                </Label>
                <JobTitleAutocomplete
                  value={formik.values.title}
                  onChange={(val) => formik.setFieldValue("title", val)}
                  onBlur={formik.handleBlur}
                  placeholder="e.g., Senior Full-Stack Engineer"
                  error={!!(formik.touched.title && formik.errors.title)}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.title as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="company" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Hiring Company <span className="text-rose-500">*</span>
                </Label>
                <CompanyAutocompleteSelect
                  onChange={(value) =>
                    formik.setFieldValue("company", value)
                  }
                />
                {formik.touched.company && formik.errors.company && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.company as string}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Location / Region <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 z-10" />
                  <GooglePlacesInput
                    id="location"
                    name="location"
                    onBlur={formik.handleBlur}
                    placeholder="Search city, country or remote..."
                    className="h-10 pl-9 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                    initialValue={
                      typeof formik.values.location === "object"
                        ? formik.values.location
                        : formik.values.location
                          ? {
                              name: formik.values.location,
                              address: formik.values.location,
                              latitude: 0,
                              longitude: 0,
                            }
                          : null
                    }
                    onChange={(loc) =>
                      formik.setFieldValue("location", loc)
                    }
                  />
                </div>
                {formik.touched.location && formik.errors.location && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.location as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="salary" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Salary / Compensation Range
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="salary"
                    name="salary"
                    placeholder="e.g., $120,000 - $150,000 / yr"
                    className="h-10 pl-9 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                    value={formik.values.salary}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Label htmlFor="description" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Role Description <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the opportunity, impact, team structure, and day-to-day workflow..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="min-h-[120px] bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-medium resize-none shadow-none"
              />
              <div className="flex items-center justify-between">
                {formik.touched.description && formik.errors.description ? (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.description as string}
                  </p>
                ) : <span />}
                <p className="text-[10px] text-zinc-400 font-medium">
                  {formik.values.description.length} characters (min 30)
                </p>
              </div>
            </div>
          </PolarisFormCard>

          {/* Step 2: Employment Terms & Engagement */}
          <PolarisFormCard
            step={2}
            title="Employment Terms & Workplace Arrangement"
            description="Configure work location flexibility, commitment type, and required experience level."
            badge="Structure"
          >
            {/* Workplace Arrangement Selectable Tiles */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Workplace Arrangement <span className="text-rose-500">*</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    value: "ON-SITE",
                    label: "On-site",
                    icon: Building,
                    desc: "Full-time physical office presence",
                  },
                  {
                    value: "HYBRID",
                    label: "Hybrid",
                    icon: Layers,
                    desc: "Flexible split office & remote",
                  },
                  {
                    value: "REMOTE",
                    label: "Remote",
                    icon: Laptop,
                    desc: "100% location independent",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = formik.values.workplaceType === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => formik.setFieldValue("workplaceType", item.value)}
                      className={cn(
                        "relative flex flex-col items-start p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                        isSelected
                          ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900/[0.04] dark:bg-zinc-100/10 ring-2 ring-zinc-900/20 dark:ring-zinc-100/20 shadow-xs"
                          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-zinc-300 dark:hover:border-zinc-700",
                      )}
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center mb-2.5 border transition-colors",
                          isSelected
                            ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                            : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {item.label}
                      </span>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Engagement Type & Experience Level Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="space-y-1.5">
                <Label htmlFor="jobType" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Engagement Type <span className="text-rose-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => formik.setFieldValue("jobType", value)}
                  value={formik.values.jobType}
                >
                  <SelectTrigger
                    id="jobType"
                    className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                  >
                    <SelectValue placeholder="Select engagement type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL-TIME">Full-time</SelectItem>
                    <SelectItem value="PART-TIME">Part-time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="experienceLevel" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Seniority / Experience Level <span className="text-rose-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    formik.setFieldValue("experienceLevel", value)
                  }
                  value={formik.values.experienceLevel}
                >
                  <SelectTrigger
                    id="experienceLevel"
                    className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                  >
                    <SelectValue placeholder="Select seniority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENTRY-LEVEL">Entry-level (0-2 yrs)</SelectItem>
                    <SelectItem value="MID-LEVEL">Mid-level (3-5 yrs)</SelectItem>
                    <SelectItem value="SENIOR">Senior (5-8 yrs)</SelectItem>
                    <SelectItem value="LEAD">Lead / Manager (8+ yrs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PolarisFormCard>

          {/* Step 3: Skills, Requirements & Perks */}
          <PolarisFormCard
            step={3}
            title="Competencies, Requirements & Perks"
            description="Detail required skill taxonomy, candidate qualifications, and benefits package."
            badge="Qualifications"
          >
            {/* Skills Autocomplete */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                  <Briefcase className="h-3.5 w-3.5" />
                </div>
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Required Skill Stack
                </Label>
              </div>
              <SkillsAutocomplete
                value={formik.values.skills}
                onChange={(val) => formik.setFieldValue("skills", val)}
              />
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              {renderListBuilder(
                "requirements",
                "Qualifications & Requirements",
                "e.g., 5+ years building scalable React applications",
                GraduationCap,
              )}
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              {renderListBuilder(
                "responsibilities",
                "Key Responsibilities & Deliverables",
                "e.g., Architect frontend design systems and mentor junior peers",
                CheckCircle2,
              )}
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              {renderListBuilder(
                "benefits",
                "Benefits, Perks & Allowances",
                "e.g., Competitive equity grant, annual wellness stipend",
                DollarSign,
              )}
            </div>
          </PolarisFormCard>

          {/* Floating Save Action Bar */}
          <FloatingSavePanel
            hasChanged={formik.dirty}
            saved={false}
            isSaving={loading}
            onSave={() => formik.handleSubmit()}
            onReset={() => {
              formik.resetForm();
              if (onCancel) onCancel();
              else window.history.back();
            }}
            title={`Publish ${singularName}`}
            description="You have pending changes to this job listing configuration."
            buttonText={`Publish ${singularName}`}
          />
        </form>
      </PolarisFormLayout>
    </FormikProvider>
  );
}
