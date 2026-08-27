"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useGetSurvey,
  GET_SURVEYS,
} from "@/graphql/surveys/survey-queries";
import {
  useDeleteSurvey,
  useUpdateFormSettings,
} from "@/graphql/surveys/survey-mutations";
import {
  Trash2,
  AlertTriangle,
  Sparkles,
  Palette,
  Layout,
  Type,
  CheckCircle2,
  Layers,
  MousePointer,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { FormSettings } from "@/store/ts-types";

interface SurveySettingsProps {
  surveyId: string;
}

const DEFAULT_FORM_SETTINGS: FormSettings = {
  primaryColor: "#667eea",
  secondaryColor: "#764ba2",
  backgroundColor: "#f8f9fa",
  textColor: "#2c3e50",
  buttonColor: "#667eea",
  borderRadius: 8,
  borderWidth: 2,
  borderStyle: "solid",
  borderColor: "#e1e8ed",
  inputBackground: "#ffffff",
  inputBorderColor: "#d9d9d9",
  fontSize: 16,
  fontWeight: "400",
  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
  hoverEffect: "none",
};

export function SurveySettings({ surveyId }: SurveySettingsProps) {
  const router = useRouter();

  const { data, loading, refetch } = useGetSurvey({
    variables: { getSurveyId: surveyId },
    skip: !surveyId,
  });

  const survey = data?.getSurvey;

  // Local state for Form Appearance & Configuration
  const [formSettings, setFormSettings] = useState<FormSettings>(
    DEFAULT_FORM_SETTINGS,
  );
  const [previewType, setPreviewType] = useState<"MULTI_STEP" | "SCROLL_LONG">(
    "SCROLL_LONG",
  );
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);

  // Snapshot tracking for dirty state
  const initialSnapshotRef = useRef<string>("");
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (survey && !isInitializedRef.current) {
      const initialAppearance =
        survey.form?.appearance || survey.appearance || DEFAULT_FORM_SETTINGS;
      const initialPreviewType =
        survey.form?.previewType || survey.previewType || "SCROLL_LONG";

      setFormSettings(initialAppearance);
      setPreviewType(initialPreviewType);

      initialSnapshotRef.current = JSON.stringify({
        formSettings: initialAppearance,
        previewType: initialPreviewType,
      });
      isInitializedRef.current = true;
    }
  }, [survey]);

  const currentSnapshot = JSON.stringify({
    formSettings,
    previewType,
  });

  const hasChanged = Boolean(
    isInitializedRef.current &&
      initialSnapshotRef.current &&
      currentSnapshot !== initialSnapshotRef.current,
  );

  const [updateFormSettingsMutation] = useUpdateFormSettings({
    onError: (err: any) => {
      toast.error(err.message || "Failed to save form settings");
    },
  });

  const updateSetting = (key: keyof FormSettings, value: any) => {
    setFormSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    const targetFormId = survey?.formId || survey?.id || surveyId;
    setIsSavingSettings(true);
    try {
      await updateFormSettingsMutation({
        variables: {
          updateFormSettingsId: targetFormId,
          input: {
            previewType,
            appearance: formSettings,
          },
        },
      });
      initialSnapshotRef.current = currentSnapshot;
      setSavedSettings(true);
      refetch();
      toast.success("Survey settings updated successfully!");
      setTimeout(() => setSavedSettings(false), 3000);
    } catch (err: any) {
      toast.error(err.message || "Failed to update survey settings");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleResetSettings = () => {
    if (initialSnapshotRef.current) {
      try {
        const initialData = JSON.parse(initialSnapshotRef.current);
        setFormSettings(initialData.formSettings);
        setPreviewType(initialData.previewType);
        toast.info("Settings reverted to original state.");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const [deleteSurvey, { loading: deleting }] = useDeleteSurvey({
    refetchQueries: [{ query: GET_SURVEYS }],
    onCompleted: () => {
      toast.success("Survey deleted successfully");
      router.push("/surveys/all");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete survey");
    },
  });

  if (loading) {
    return <PolarisFormSkeleton showHeader={false} />;
  }

  return (
    <div className="w-full pb-16">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Theme & Preview Card */}
            <PolarisSidebarCard
              title="Design & Experience"
              badge="Live Preview"
              icon={Sparkles}
            >
              <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3.5 space-y-3 shadow-2xs">
                {/* Form Card Mini Preview */}
                <div
                  className="p-3 rounded-md border text-center transition-all"
                  style={{
                    backgroundColor: formSettings.backgroundColor,
                    borderColor: formSettings.borderColor,
                    borderRadius: `${formSettings.borderRadius}px`,
                    borderWidth: `${formSettings.borderWidth}px`,
                    borderStyle: formSettings.borderStyle,
                  }}
                >
                  <p
                    className="text-xs font-semibold truncate"
                    style={{
                      color: formSettings.textColor,
                      fontWeight: formSettings.fontWeight,
                    }}
                  >
                    {survey?.title || "Survey Title"}
                  </p>
                  <div
                    className="mt-2 py-1 px-3 text-[11px] font-semibold text-white rounded-md mx-auto w-fit shadow-xs"
                    style={{ backgroundColor: formSettings.buttonColor }}
                  >
                    Submit Response
                  </div>
                </div>

                {/* Status Badges */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>View Mode:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {previewType === "MULTI_STEP"
                        ? "One Step / Page"
                        : "Single Scroll Page"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Font Size:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formSettings.fontSize}px
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Corner Radius:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formSettings.borderRadius}px
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Rows */}
              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Display Mode"
                  value={previewType === "MULTI_STEP" ? "Multi-Step" : "Scroll Long"}
                  highlight={previewType === "MULTI_STEP"}
                />
                <PolarisSummaryRow
                  label="Shadow Depth"
                  value={formSettings.boxShadow === "none" ? "Flat" : "Subtle Elevation"}
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Design Tip */}
            <PolarisTipCard title="Survey Experience Tip">
              <strong>Multi-Step</strong> presentation typically increases
              completion rates for long surveys by focusing the respondent on one
              question at a time.
            </PolarisTipCard>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Section 1: Presentation & Layout Mode */}
          <PolarisFormCard
            step={1}
            title="Form Presentation Mode"
            description="Choose how respondents navigate questions in this survey."
            badge="Layout"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Multi Step Option */}
              <div
                onClick={() => setPreviewType("MULTI_STEP")}
                className={cn(
                  "p-3.5 rounded-[6px] border cursor-pointer transition-all flex flex-col justify-between",
                  previewType === "MULTI_STEP"
                    ? "border-primary bg-primary/5 shadow-2xs ring-1 ring-primary/20"
                    : "border-border bg-card hover:bg-muted/40",
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      Multi-Step Flow
                    </span>
                    {previewType === "MULTI_STEP" && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Displays one question per screen with step transitions. Best
                    for engaging user experiences.
                  </p>
                </div>
              </div>

              {/* Scroll Long Option */}
              <div
                onClick={() => setPreviewType("SCROLL_LONG")}
                className={cn(
                  "p-3.5 rounded-[6px] border cursor-pointer transition-all flex flex-col justify-between",
                  previewType === "SCROLL_LONG"
                    ? "border-primary bg-primary/5 shadow-2xs ring-1 ring-primary/20"
                    : "border-border bg-card hover:bg-muted/40",
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      Continuous Scroll
                    </span>
                    {previewType === "SCROLL_LONG" && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Shows all questions on a single vertical scroll page. Ideal
                    for short questionnaires.
                  </p>
                </div>
              </div>
            </div>
          </PolarisFormCard>

          {/* Section 2: Color Scheme */}
          <PolarisFormCard
            step={2}
            title="Brand Color Palette"
            description="Customize the primary theme, background, and accent colors."
            badge="Palette"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Primary Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formSettings.primaryColor}
                    onChange={(e) => updateSetting("primaryColor", e.target.value)}
                    className="h-9 w-12 p-1 rounded-md border-border cursor-pointer"
                  />
                  <Input
                    value={formSettings.primaryColor}
                    onChange={(e) => updateSetting("primaryColor", e.target.value)}
                    className="h-9 text-xs font-mono flex-1 border-border"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formSettings.secondaryColor}
                    onChange={(e) => updateSetting("secondaryColor", e.target.value)}
                    className="h-9 w-12 p-1 rounded-md border-border cursor-pointer"
                  />
                  <Input
                    value={formSettings.secondaryColor}
                    onChange={(e) => updateSetting("secondaryColor", e.target.value)}
                    className="h-9 text-xs font-mono flex-1 border-border"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Card Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formSettings.backgroundColor}
                    onChange={(e) => updateSetting("backgroundColor", e.target.value)}
                    className="h-9 w-12 p-1 rounded-md border-border cursor-pointer"
                  />
                  <Input
                    value={formSettings.backgroundColor}
                    onChange={(e) => updateSetting("backgroundColor", e.target.value)}
                    className="h-9 text-xs font-mono flex-1 border-border"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Primary Button Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formSettings.buttonColor}
                    onChange={(e) => updateSetting("buttonColor", e.target.value)}
                    className="h-9 w-12 p-1 rounded-md border-border cursor-pointer"
                  />
                  <Input
                    value={formSettings.buttonColor}
                    onChange={(e) => updateSetting("buttonColor", e.target.value)}
                    className="h-9 text-xs font-mono flex-1 border-border"
                  />
                </div>
              </div>
            </div>
          </PolarisFormCard>

          {/* Section 3: Typography & Element Styling */}
          <PolarisFormCard
            step={3}
            title="Typography & Component Styling"
            description="Fine-tune typography scale, corner rounding, and border thickness."
            badge="Styling"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>Base Font Size</span>
                    <span className="font-mono text-muted-foreground">
                      {formSettings.fontSize}px
                    </span>
                  </div>
                  <Slider
                    min={12}
                    max={24}
                    step={1}
                    value={[formSettings.fontSize]}
                    onValueChange={([val]) => updateSetting("fontSize", val)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>Corner Radius</span>
                    <span className="font-mono text-muted-foreground">
                      {formSettings.borderRadius}px
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={24}
                    step={1}
                    value={[formSettings.borderRadius]}
                    onValueChange={([val]) => updateSetting("borderRadius", val)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Border Style</Label>
                  <Select
                    value={formSettings.borderStyle}
                    onValueChange={(v) => updateSetting("borderStyle", v)}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid" className="text-xs">Solid</SelectItem>
                      <SelectItem value="dashed" className="text-xs">Dashed</SelectItem>
                      <SelectItem value="dotted" className="text-xs">Dotted</SelectItem>
                      <SelectItem value="none" className="text-xs">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Input Field Background</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formSettings.inputBackground}
                      onChange={(e) => updateSetting("inputBackground", e.target.value)}
                      className="h-9 w-12 p-1 rounded-md border-border cursor-pointer"
                    />
                    <Input
                      value={formSettings.inputBackground}
                      onChange={(e) => updateSetting("inputBackground", e.target.value)}
                      className="h-9 text-xs font-mono flex-1 border-border"
                    />
                  </div>
                </div>
              </div>
            </div>
          </PolarisFormCard>

          {/* Section 4: Danger Zone */}
          <PolarisFormCard
            step={4}
            title="Danger Zone"
            description="Permanently delete this survey and its collected responses."
            badge="Danger"
          >
            <div className="flex items-center justify-between p-3 rounded-[6px] border border-destructive/30 bg-destructive/5">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-destructive">
                  Delete This Survey
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Once deleted, all questions, submission answers, and analytics are lost forever.
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="h-8 gap-1.5 text-xs font-semibold">
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Survey
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      survey <strong>{survey?.title}</strong> and all of its
                      recorded responses.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      onClick={() => deleteSurvey({ variables: { id: surveyId } })}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Yes, delete survey"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </PolarisFormCard>
        </div>

        {/* Floating Save Panel */}
        <FloatingSavePanel
          hasChanged={hasChanged}
          saved={savedSettings}
          isSaving={isSavingSettings}
          title="Save Survey Settings"
          description="You have unsaved changes to survey design & appearance."
          saveButtonText="Save Settings"
          discardButtonText="Discard"
          onSave={handleSaveSettings}
          onReset={handleResetSettings}
        />
      </PolarisFormLayout>
    </div>
  );
}
