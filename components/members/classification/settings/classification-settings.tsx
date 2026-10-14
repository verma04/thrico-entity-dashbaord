"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Briefcase,
  GraduationCap,
  Award,
  Share2,
  Link as LinkIcon,
  Layers,
  Building2,
  Heart,
  Sparkles,
  XCircle,
  Eye,
  User,
  Check,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  useGetClassificationSetting,
  useUpdateClassificationSetting,
} from "@/graphql/actions/classification/classification-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProfileVisibilityFormValues {
  allowProfileExperience: boolean;
  allowProfileEducation: boolean;
  allowProfileSkills: boolean;
  allowProfileSocialConnect: boolean;
  allowProfileSocialLinks: boolean;
  allowProfileFunctions: boolean;
  allowProfileIndustries: boolean;
  allowProfileInterests: boolean;
}

const validationSchema = Yup.object().shape({
  allowProfileExperience: Yup.boolean().required(),
  allowProfileEducation: Yup.boolean().required(),
  allowProfileSkills: Yup.boolean().required(),
  allowProfileSocialConnect: Yup.boolean().required(),
  allowProfileSocialLinks: Yup.boolean().required(),
  allowProfileFunctions: Yup.boolean().required(),
  allowProfileIndustries: Yup.boolean().required(),
  allowProfileInterests: Yup.boolean().required(),
});

interface SectionToggleItemProps {
  id: keyof ProfileVisibilityFormValues;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function SectionToggleItem({
  id,
  title,
  description,
  icon: Icon,
  iconColor,
  checked,
  onChange,
}: SectionToggleItemProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 p-3 rounded-lg border transition-colors",
        checked
          ? "border-border/60 bg-muted/10 hover:bg-muted/20"
          : "border-border/40 bg-muted/5 opacity-70 hover:opacity-100"
      )}
    >
      <div className="space-y-0.5 min-w-0 pr-2">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4 shrink-0", iconColor)} />
          <label
            htmlFor={id}
            className="text-xs font-semibold text-foreground cursor-pointer"
          >
            {title}
          </label>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] px-1.5 py-0 h-4 font-normal",
              checked
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
            )}
          >
            {checked ? "Visible" : "Hidden"}
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug">
          {description}
        </p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="shrink-0 mt-0.5"
      />
    </div>
  );
}

export default function ClassificationProfileSettings() {
  const { data, loading } = useGetClassificationSetting();
  const [updateSettings, { loading: isSaving }] = useUpdateClassificationSetting();
  const [justSaved, setJustSaved] = useState(false);

  const initialValues: ProfileVisibilityFormValues = {
    allowProfileExperience:
      data?.getClassificationSetting?.allowProfileExperience ?? true,
    allowProfileEducation:
      data?.getClassificationSetting?.allowProfileEducation ?? true,
    allowProfileSkills: data?.getClassificationSetting?.allowProfileSkills ?? true,
    allowProfileSocialConnect:
      data?.getClassificationSetting?.allowProfileSocialConnect ?? true,
    allowProfileSocialLinks:
      data?.getClassificationSetting?.allowProfileSocialLinks ?? true,
    allowProfileFunctions:
      data?.getClassificationSetting?.allowProfileFunctions ?? true,
    allowProfileIndustries:
      data?.getClassificationSetting?.allowProfileIndustries ?? true,
    allowProfileInterests:
      data?.getClassificationSetting?.allowProfileInterests ?? true,
  };

  const formik = useFormik<ProfileVisibilityFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        await updateSettings({
          variables: {
            input: {
              allowProfileExperience: values.allowProfileExperience,
              allowProfileEducation: values.allowProfileEducation,
              allowProfileSkills: values.allowProfileSkills,
              allowProfileSocialConnect: values.allowProfileSocialConnect,
              allowProfileSocialLinks: values.allowProfileSocialLinks,
              allowProfileFunctions: values.allowProfileFunctions,
              allowProfileIndustries: values.allowProfileIndustries,
              allowProfileInterests: values.allowProfileInterests,
            },
          },
        });
        resetForm({ values });
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 3000);
        toast.success("Profile section visibility settings updated successfully.");
      } catch (err: unknown) {
        toast.error((err as Error).message || "Failed to update profile settings.");
      }
    },
  });

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-44 w-full rounded-xl" />
      </div>
    );
  }

  const enabledCount = Object.values(formik.values).filter(Boolean).length;
  const totalCount = Object.keys(formik.values).length;

  return (
    <div className="w-full">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Profile Mockup Preview Card */}
            <PolarisSidebarCard
              title="Live Profile Preview"
              badge="User Perspective"
              icon={Eye}
            >
              <div className="space-y-3">
                <p className="text-[11.5px] text-muted-foreground leading-snug">
                  Real-time preview of sections visible on member profile pages (
                  <span className="font-mono text-[10.5px]">/dashboard/profile</span>).
                </p>

                {/* Mock Member Profile Card */}
                <div className="rounded-lg border border-border/80 bg-background p-3 shadow-2xs space-y-2.5">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-border/50">
                    <div className="h-9 w-9 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">
                        Sarah Jenkins
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        Product Designer • San Francisco
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Section Chips */}
                  <div className="space-y-1.5">
                    <div
                      className={cn(
                        "flex items-center justify-between text-[11px] p-1.5 rounded-md transition-all",
                        formik.values.allowProfileExperience
                          ? "bg-muted/40 text-foreground"
                          : "opacity-35 line-through text-muted-foreground bg-muted/10"
                      )}
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <Briefcase className="h-3 w-3 text-sky-500" />
                        Experience (Companies)
                      </span>
                      {formik.values.allowProfileExperience ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>

                    <div
                      className={cn(
                        "flex items-center justify-between text-[11px] p-1.5 rounded-md transition-all",
                        formik.values.allowProfileEducation
                          ? "bg-muted/40 text-foreground"
                          : "opacity-35 line-through text-muted-foreground bg-muted/10"
                      )}
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <GraduationCap className="h-3 w-3 text-indigo-500" />
                        Education (Colleges)
                      </span>
                      {formik.values.allowProfileEducation ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>

                    <div
                      className={cn(
                        "flex items-center justify-between text-[11px] p-1.5 rounded-md transition-all",
                        formik.values.allowProfileSkills
                          ? "bg-muted/40 text-foreground"
                          : "opacity-35 line-through text-muted-foreground bg-muted/10"
                      )}
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <Award className="h-3 w-3 text-amber-500" />
                        Skills & Badges
                      </span>
                      {formik.values.allowProfileSkills ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>

                    <div
                      className={cn(
                        "flex items-center justify-between text-[11px] p-1.5 rounded-md transition-all",
                        formik.values.allowProfileSocialConnect
                          ? "bg-muted/40 text-foreground"
                          : "opacity-35 line-through text-muted-foreground bg-muted/10"
                      )}
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <Share2 className="h-3 w-3 text-pink-500" />
                        Social Connect (OAuth)
                      </span>
                      {formik.values.allowProfileSocialConnect ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>

                    <div
                      className={cn(
                        "flex items-center justify-between text-[11px] p-1.5 rounded-md transition-all",
                        formik.values.allowProfileSocialLinks
                          ? "bg-muted/40 text-foreground"
                          : "opacity-35 line-through text-muted-foreground bg-muted/10"
                      )}
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <LinkIcon className="h-3 w-3 text-cyan-500" />
                        Social & Portfolio Links
                      </span>
                      {formik.values.allowProfileSocialLinks ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>

                    <div
                      className={cn(
                        "flex items-center justify-between text-[11px] p-1.5 rounded-md transition-all",
                        formik.values.allowProfileFunctions ||
                          formik.values.allowProfileIndustries ||
                          formik.values.allowProfileInterests
                          ? "bg-muted/40 text-foreground"
                          : "opacity-35 line-through text-muted-foreground bg-muted/10"
                      )}
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <Layers className="h-3 w-3 text-violet-500" />
                        Taxonomy (Functions/Industries)
                      </span>
                      {formik.values.allowProfileFunctions ||
                      formik.values.allowProfileIndustries ||
                      formik.values.allowProfileInterests ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </PolarisSidebarCard>

            {/* Visibility Metrics Card */}
            <PolarisSidebarCard
              title="Visibility Summary"
              badge="Configuration"
              icon={Sparkles}
            >
              <div className="space-y-1">
                <PolarisSummaryRow
                  label="Visible Sections"
                  value={`${enabledCount} of ${totalCount}`}
                  status={enabledCount > 0 ? "success" : "warning"}
                />
                <PolarisSummaryRow
                  label="Hidden Sections"
                  value={`${totalCount - enabledCount} sections`}
                  status={totalCount - enabledCount > 0 ? "warning" : "default"}
                />
                <PolarisSummaryRow
                  label="Status"
                  value={formik.dirty ? "Modified" : "Saved"}
                  status={formik.dirty ? "warning" : "success"}
                />
              </div>
            </PolarisSidebarCard>

            {/* Tip Card */}
            <PolarisTipCard
              title="Organization Privacy Control"
              description="Disabling profile sections prevents users from viewing or submitting these attributes across their personal dashboard overview and public member directory cards."
            />
          </div>
        }
      >
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Card 1: Professional Background */}
          <PolarisFormCard
            step={1}
            icon={Briefcase}
            title="Professional Background & Experience"
            description="Manage visibility for work history, university degrees, and verified member competencies."
            badge="Resume Data"
            badgeVariant="indigo"
          >
            <div className="space-y-2.5">
              <SectionToggleItem
                id="allowProfileExperience"
                title="Experience (Companies & Work History)"
                description="Controls the display of current and past employer records, job titles, and employment tenures on member profiles."
                icon={Briefcase}
                iconColor="text-sky-500"
                checked={formik.values.allowProfileExperience}
                onChange={(checked) =>
                  formik.setFieldValue("allowProfileExperience", checked)
                }
              />

              <SectionToggleItem
                id="allowProfileEducation"
                title="Education (Colleges & Degrees)"
                description="Controls the display of universities, college degrees, fields of study, and graduation years on member profiles."
                icon={GraduationCap}
                iconColor="text-indigo-500"
                checked={formik.values.allowProfileEducation}
                onChange={(checked) =>
                  formik.setFieldValue("allowProfileEducation", checked)
                }
              />

              <SectionToggleItem
                id="allowProfileSkills"
                title="Skills & Endorsements"
                description="Controls member skills tag lists, technical expertise chips, and community peer endorsements on member profiles."
                icon={Award}
                iconColor="text-amber-500"
                checked={formik.values.allowProfileSkills}
                onChange={(checked) =>
                  formik.setFieldValue("allowProfileSkills", checked)
                }
              />
            </div>
          </PolarisFormCard>

          {/* Card 2: Social & Connectivity */}
          <PolarisFormCard
            step={2}
            icon={Share2}
            title="Social & External Connectivity"
            description="Configure whether members can link external OAuth accounts and display public portfolio links."
            badge="Connections"
            badgeVariant="emerald"
          >
            <div className="space-y-2.5">
              <SectionToggleItem
                id="allowProfileSocialConnect"
                title="Social Connect (OAuth Accounts)"
                description="Controls connected social service accounts (LinkedIn, GitHub, Twitter/X, Dribbble) and account synchronization cards."
                icon={Share2}
                iconColor="text-pink-500"
                checked={formik.values.allowProfileSocialConnect}
                onChange={(checked) =>
                  formik.setFieldValue("allowProfileSocialConnect", checked)
                }
              />

              <SectionToggleItem
                id="allowProfileSocialLinks"
                title="Social & Portfolio Links"
                description="Controls custom website URLs, portfolio links, and external social media anchors shown on user profiles."
                icon={LinkIcon}
                iconColor="text-cyan-500"
                checked={formik.values.allowProfileSocialLinks}
                onChange={(checked) =>
                  formik.setFieldValue("allowProfileSocialLinks", checked)
                }
              />
            </div>
          </PolarisFormCard>

          {/* Card 3: Taxonomy & Classification Tags */}
          <PolarisFormCard
            step={3}
            icon={Layers}
            title="Classification & Taxonomy Tags"
            description="Control the visibility of member category tags used for directory filtering and peer matching."
            badge="Taxonomy"
          >
            <div className="space-y-2.5">
              <SectionToggleItem
                id="allowProfileFunctions"
                title="Job Functions"
                description="Controls specialized job function and department classification badges on member profiles."
                icon={Briefcase}
                iconColor="text-violet-500"
                checked={formik.values.allowProfileFunctions}
                onChange={(checked) =>
                  formik.setFieldValue("allowProfileFunctions", checked)
                }
              />

              <SectionToggleItem
                id="allowProfileIndustries"
                title="Industries"
                description="Controls domain sector and industry classification tags displayed on member profiles."
                icon={Building2}
                iconColor="text-blue-500"
                checked={formik.values.allowProfileIndustries}
                onChange={(checked) =>
                  formik.setFieldValue("allowProfileIndustries", checked)
                }
              />

              <SectionToggleItem
                id="allowProfileInterests"
                title="Interests & Passions"
                description="Controls personal hobbies, topical interests, and discussion interest tags on member profiles."
                icon={Heart}
                iconColor="text-rose-500"
                checked={formik.values.allowProfileInterests}
                onChange={(checked) =>
                  formik.setFieldValue("allowProfileInterests", checked)
                }
              />
            </div>
          </PolarisFormCard>
        </form>
      </PolarisFormLayout>

      {/* Floating Save Dock */}
      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={justSaved}
        isSaving={isSaving}
        onSave={formik.handleSubmit}
        onReset={() => formik.resetForm()}
        title="Unsaved visibility settings"
        saveButtonText="Save Changes"
        discardButtonText="Discard"
      />
    </div>
  );
}
