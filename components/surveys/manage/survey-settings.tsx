"use client";

import React from "react";
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
} from "@/graphql/surveys/survey-mutations";
import { Trash2, AlertTriangle, Globe, Archive } from "lucide-react";
import { toast } from "sonner";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";

interface SurveySettingsProps {
  surveyId: string;
}

export function SurveySettings({ surveyId }: SurveySettingsProps) {
  const router = useRouter();

  const { data, loading, refetch } = useGetSurvey({
    variables: { getSurveyId: surveyId },
    skip: !surveyId,
  });

  const survey = data?.getSurvey;

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
    <div className="space-y-8 max-w-4xl">
      {/* Publication Status Card */}
      <Card className="border border-border shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Publication Status
          </CardTitle>
          <CardDescription>
            Control the visibility of this survey. Published surveys can accept
            responses from eligible members.
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
                  ? "Survey is live and accessible to participants."
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
                onClick={() => draftSurvey({ variables: { id: surveyId } })}
                disabled={drafting}
              >
                <Archive className="h-4 w-4" />
                {drafting ? "Updating..." : "Revert to Draft"}
              </Button>
            ) : (
              <Button
                size="sm"
                className="gap-2"
                onClick={() => publishSurvey({ variables: { id: surveyId } })}
                disabled={publishing}
              >
                <Globe className="h-4 w-4" />
                {publishing ? "Publishing..." : "Publish Survey"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}
