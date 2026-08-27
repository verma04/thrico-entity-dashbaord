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
import { Button } from "@/components/ui/button";
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
  usePublishSurvey,
  useDraftSurvey,
  useUpdateFormSettings,
} from "@/graphql/surveys/survey-mutations";
import {
  Trash2,
  AlertTriangle,
  Globe,
  Archive,
  Palette,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import Settings from "@/components/feedback-form/settings";
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

  const updateFormSetting = (
    key: keyof FormSettings | "previewType",
    value: any,
  ) => {
    if (key === "previewType") {
      setPreviewType(value);
    } else {
      setFormSettings((prev) => ({ ...prev, [key]: value }));
    }
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
      toast.success("Form appearance & configuration saved!");
      setTimeout(() => setSavedSettings(false), 3000);
    } catch (err: any) {
      toast.error(err.message || "Failed to update form settings");
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
        toast.info("Settings reverted");
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

  const [publishSurvey, { loading: publishing }] = usePublishSurvey({
    onCompleted: () => {
      toast.success("Survey published successfully");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to publish survey");
    },
  });

  const [draftSurvey, { loading: drafting }] = useDraftSurvey({
    onCompleted: () => {
      toast.success("Survey reverted to draft");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to revert survey to draft");
    },
  });

  if (loading) {
    return <PolarisFormSkeleton showHeader={false} />;
  }

  const isPublished = survey?.status === "PUBLISHED";

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Publication Status Card */}
      <Card className="border border-border shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Publication Status
          </CardTitle>
          <CardDescription>
            Control the visibility of this survey. Published surveys can accept
            responses from eligible participants.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${
                isPublished ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            <div>
              <p className="text-sm font-medium">
                {isPublished ? "Published" : "Draft"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isPublished
                  ? "Survey is live and accessible to eligible participants."
                  : "Survey is hidden from public participant views."}
              </p>
            </div>
          </div>

          <div>
            {isPublished ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => draftSurvey({ variables: { draftSurveyId: surveyId } })}
                disabled={drafting}
              >
                <Archive className="h-4 w-4" />
                {drafting ? "Updating..." : "Revert to Draft"}
              </Button>
            ) : (
              <Button
                size="sm"
                className="gap-2"
                onClick={() => publishSurvey({ variables: { publishSurveyId: surveyId } })}
                disabled={publishing}
              >
                <Globe className="h-4 w-4" />
                {publishing ? "Publishing..." : "Publish Survey"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Configuration & Appearance Settings */}
      <Settings
        formSettings={formSettings}
        updateFormSetting={updateFormSetting}
        previewType={previewType}
      />

      {/* Danger Zone Card */}
      <Card className="border border-destructive/30 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-destructive">
            Danger Zone
          </CardTitle>
          <CardDescription>
            Destructive actions cannot be undone. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Deleting this survey will permanently remove all associated
              questions, responses, submissions, and analytics data.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end pt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
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
        </CardContent>
      </Card>

      {/* Non-blocking Floating Save Panel for Form Settings */}
      <FloatingSavePanel
        hasChanged={hasChanged}
        saved={savedSettings}
        isSaving={isSavingSettings}
        title="Unsaved Form Settings"
        saveButtonText="Save Settings"
        discardButtonText="Discard"
        onSave={handleSaveSettings}
        onReset={handleResetSettings}
      />
    </div>
  );
}
