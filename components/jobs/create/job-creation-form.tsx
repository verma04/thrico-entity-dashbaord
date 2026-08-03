"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  X,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Globe,
  GraduationCap,
  ChevronRight,
  Save,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { CompanyAutocompleteSelect } from "./company-auto-complete";
import { JobTitleAutocomplete } from "./job-title-auto-complete";
import { SkillsAutocomplete } from "./skills-auto-complete";
import GooglePlacesInput from "@/components/layout/google-place-input";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { cn } from "@/lib/utils";
import { useModuleStore } from "@/store/useModuleStore";

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
    .min(50, "Description must be at least 50 characters"),
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
      jobType: initialValues?.jobType || "",
      workplaceType: initialValues?.workplaceType || "",
      experienceLevel: initialValues?.experienceLevel || "",
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

  const renderListSection = (
    fieldName: string,
    label: string,
    placeholder: string,
    Icon: React.ElementType,
  ) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <Label className="text-base font-semibold">{label}</Label>
          <Badge variant="secondary" className="ml-1">
            {
              (
                formik.values[
                  fieldName as keyof typeof formik.values
                ] as string[]
              ).length
            }
          </Badge>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAddListItem(fieldName)}
          className="h-8 px-2"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      <div className="space-y-3">
        {(
          formik.values[fieldName as keyof typeof formik.values] as string[]
        ).map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex gap-2">
              <Input
                placeholder={placeholder}
                value={item}
                onChange={(e) =>
                  handleListChange(fieldName, index, e.target.value)
                }
                onBlur={formik.handleBlur}
                name={`${fieldName}[${index}]`}
                className={cn(
                  "flex-1",
                  formik.touched[fieldName as keyof typeof formik.touched] &&
                    (
                      formik.errors[
                        fieldName as keyof typeof formik.errors
                      ] as any
                    )?.[index] &&
                    "border-destructive",
                )}
              />
              {(
                formik.values[
                  fieldName as keyof typeof formik.values
                ] as string[]
              ).length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveListItem(fieldName, index)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {formik.touched[fieldName as keyof typeof formik.touched] &&
              (formik.errors[fieldName as keyof typeof formik.errors] as any)?.[
                index
              ] && (
                <p className="text-xs text-destructive ml-1">
                  {String(
                    (
                      formik.errors[
                        fieldName as keyof typeof formik.errors
                      ] as any
                    )[index],
                  )}
                </p>
              )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden rounded-t-[inherit]">
      {/* Header section - Sticky */}
      {/* Header section - Sticky */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                {initialValues?.title ? `Edit ${singularName} Posting` : `Create ${singularName} Posting`}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
              <span>{moduleName}</span>
              <ChevronRight className="h-3 w-3" />
              <span>
                {initialValues?.title ? "Edit Listing" : "Create New Listing"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <form className="space-y-8">
                {/* Basic Info */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">Basic Information</CardTitle>
                    <CardDescription>
                      Core details about the role and company
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                          {singularName} Title <span className="text-destructive">*</span>
                        </Label>
                        <JobTitleAutocomplete
                          value={formik.values.title}
                          onChange={(val) => formik.setFieldValue("title", val)}
                          onBlur={formik.handleBlur}
                          placeholder="e.g., Senior Frontend Developer"
                          error={
                            !!(formik.touched.title && formik.errors.title)
                          }
                        />
                        {formik.touched.title && formik.errors.title && (
                          <p className="text-xs text-destructive">
                            {String(formik.errors.title)}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="company"
                          className="text-sm font-medium"
                        >
                          Company <span className="text-destructive">*</span>
                        </Label>
                        <CompanyAutocompleteSelect
                          onChange={(value) =>
                            formik.setFieldValue("company", value)
                          }
                        />
                        {formik.touched.company && formik.errors.company && (
                          <p className="text-xs text-destructive">
                            {String(formik.errors.company)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="location"
                          className="text-sm font-medium"
                        >
                          Location <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                          <GooglePlacesInput
                            id="location"
                            name="location"
                            onBlur={formik.handleBlur}
                            placeholder="Remote / City, Country"
                            className={cn(
                              "pl-10",
                              formik.touched.location &&
                                formik.errors.location &&
                                "border-destructive",
                            )}
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
                          <p className="text-xs text-destructive">
                            {String(formik.errors.location)}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salary" className="text-sm font-medium">
                          Salary Range
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="salary"
                            name="salary"
                            placeholder="e.g., $120k - $160k"
                            className="pl-10"
                            value={formik.values.salary}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Employment Details */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">
                      Employment Details
                    </CardTitle>
                    <CardDescription>
                      Select the type of engagement and work environment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="jobType"
                          className="text-sm font-medium"
                        >
                          {singularName} Type <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            formik.setFieldValue("jobType", value)
                          }
                          value={formik.values.jobType}
                        >
                          <SelectTrigger
                            id="jobType"
                            className={cn(
                              formik.touched.jobType &&
                                formik.errors.jobType &&
                                "border-destructive",
                            )}
                          >
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FULL-TIME">Full-time</SelectItem>
                            <SelectItem value="PART-TIME">Part-time</SelectItem>
                            <SelectItem value="CONTRACT">Contract</SelectItem>
                            <SelectItem value="INTERNSHIP">
                              Internship
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {formik.touched.jobType && formik.errors.jobType && (
                          <p className="text-xs text-destructive">
                            {String(formik.errors.jobType)}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="workplaceType"
                          className="text-sm font-medium"
                        >
                          Work Arrangement{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            formik.setFieldValue("workplaceType", value)
                          }
                          value={formik.values.workplaceType}
                        >
                          <SelectTrigger
                            id="workplaceType"
                            className={cn(
                              formik.touched.workplaceType &&
                                formik.errors.workplaceType &&
                                "border-destructive",
                            )}
                          >
                            <SelectValue placeholder="Select arrangement" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ON-SITE">On-site</SelectItem>
                            <SelectItem value="HYBRID">Hybrid</SelectItem>
                            <SelectItem value="REMOTE">Remote</SelectItem>
                          </SelectContent>
                        </Select>
                        {formik.touched.workplaceType &&
                          formik.errors.workplaceType && (
                            <p className="text-xs text-destructive">
                              {String(formik.errors.workplaceType)}
                            </p>
                          )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="experienceLevel"
                          className="text-sm font-medium"
                        >
                          Experience Level{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            formik.setFieldValue("experienceLevel", value)
                          }
                          value={formik.values.experienceLevel}
                        >
                          <SelectTrigger
                            id="experienceLevel"
                            className={cn(
                              formik.touched.experienceLevel &&
                                formik.errors.experienceLevel &&
                                "border-destructive",
                            )}
                          >
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ENTRY-LEVEL">
                              Entry-level
                            </SelectItem>
                            <SelectItem value="MID-LEVEL">Mid-level</SelectItem>
                            <SelectItem value="SENIOR">Senior</SelectItem>
                            <SelectItem value="LEAD">Lead/Manager</SelectItem>
                          </SelectContent>
                        </Select>
                        {formik.touched.experienceLevel &&
                          formik.errors.experienceLevel && (
                            <p className="text-xs text-destructive">
                              {String(formik.errors.experienceLevel)}
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Job Description{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe the role, company culture, and expectations..."
                        className={cn(
                          "min-h-[160px] resize-none",
                          formik.touched.description &&
                            formik.errors.description &&
                            "border-destructive",
                        )}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.description &&
                        formik.errors.description && (
                          <p className="text-xs text-destructive">
                            {String(formik.errors.description)}
                          </p>
                        )}
                      <p className="text-[11px] text-muted-foreground text-right italic">
                        {formik.values.description.length} characters (min 50)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* List Sections */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">
                      Requirements & Benefits
                    </CardTitle>
                    <CardDescription>
                      Detailed lists of what you expect and what you offer
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-10">
                    <div className="grid grid-cols-1 gap-10">
                      {renderListSection(
                        "requirements",
                        "Requirements",
                        "e.g., 5+ years of React experience",
                        GraduationCap,
                      )}
                      <Separator />
                      {renderListSection(
                        "responsibilities",
                        "Key Responsibilities",
                        "e.g., Lead a team of 4 frontend engineers",
                        CheckCircle2,
                      )}
                      <Separator />
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-primary/10">
                            <Briefcase className="h-4 w-4 text-primary" />
                          </div>
                          <Label className="text-base font-semibold">Required Skills</Label>
                          <Badge variant="secondary" className="ml-1">
                            {formik.values.skills.filter((s: string) => s.trim() !== "").length}
                          </Badge>
                        </div>
                        <SkillsAutocomplete
                          value={formik.values.skills}
                          onChange={(val) => formik.setFieldValue("skills", val)}
                        />
                      </div>
                      <Separator />
                      {renderListSection(
                        "benefits",
                        "Benefits & Perks",
                        "e.g., Unlimited PTO, Health Insurance",
                        DollarSign,
                      )}
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Live Preview Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Listing Preview</h3>
                  <Badge
                    variant="outline"
                    className="bg-green-500/5 text-green-600 border-green-500/20"
                  >
                    Live Preview
                  </Badge>
                </div>

                <Card className="border-none shadow-xl ring-1 ring-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
                  <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
                  <CardContent className="pt-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
                        {formik.values.company?.logo ? (
                          <Avatar className="h-full w-full rounded-none">
                            <AvatarImage
                              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${formik.values.company.logo}`}
                              alt={formik.values.company.name}
                            />
                            <AvatarFallback className="bg-transparent">
                              <Briefcase className="h-7 w-7 text-primary" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Briefcase className="h-7 w-7 text-primary" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg leading-tight">
                          {formik.values.title || `${singularName} Position Title`}
                        </h4>
                        <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                          {formik.values.company?.name || "Company Name"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10"
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        {typeof formik.values.location === "object"
                          ? formik.values.location?.name
                          : formik.values.location || "Location"}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-blue-500/5 text-blue-600 border-blue-500/10 hover:bg-blue-500/10"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {formik.values.workplaceType || "Work Type"}
                      </Badge>
                      {formik.values.salary && (
                        <Badge
                          variant="secondary"
                          className="bg-green-500/5 text-green-600 border-green-500/10 hover:bg-green-500/10"
                        >
                          <DollarSign className="h-3 w-3 mr-1" />
                          {formik.values.salary}
                        </Badge>
                      )}
                    </div>

                    <Separator className="opacity-50" />

                    <div className="space-y-4">
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          Description
                        </h5>
                        <p className="text-sm line-clamp-3 text-foreground/80 leading-relaxed">
                          {formik.values.description ||
                            "Describe the role and what makes it unique..."}
                        </p>
                      </div>

                      {formik.values.skills.some((s: string) => s.trim()) && (
                        <div>
                          <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            Skills
                          </h5>
                          <div className="flex flex-wrap gap-1.5">
                            {formik.values.skills
                              .filter((s: string) => s.trim())
                              .map((skill: string, i: number) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  {skill}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <Button className="w-full mt-4" disabled>
                      Apply Now
                    </Button>

                    <p className="text-[10px] text-center text-muted-foreground italic">
                      Preview version - Final layout may vary slightly
                    </p>
                  </CardContent>
                </Card>

                <div className="p-4 rounded-xl bg-muted/30 border border-dashed border-border flex items-start gap-4">
                  <div className="mt-1 p-1 bg-primary/20 rounded-full">
                    <Plus className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Make sure your {singularName.toLowerCase()} description includes key performance
                    indicators and growth opportunities to attract the best
                    talent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
        title={`Unsaved ${singularName} Posting`}
        description="You have unfilled form data."
        buttonText={`Publish ${singularName}`}
      />
    </div>
  );
}
