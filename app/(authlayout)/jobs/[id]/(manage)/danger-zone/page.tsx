"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetJobById, useChangeJobStatus } from "@/graphql/actions/jobs";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { AlertTriangle, Users, Eye, Loader2, Ban } from "lucide-react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

function JobDangerZonePage() {
  const singularName = useModuleStore((state) => state.jobSingularName);
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { toast } = useToast();

  const { data, loading } = useGetJobById({
    variables: { id },
    skip: !id,
  });

  const [changeStatus, { loading: disabling }] = useChangeJobStatus({
    onCompleted: () => {
      toast({
        title: `${singularName} Disabled`,
        description: `The ${singularName.toLowerCase()} has been permanently disabled.`,
      });
      router.push("/jobs/all");
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || `Failed to disable ${singularName.toLowerCase()}`,
        variant: "destructive",
      });
    },
  });

  const job = data?.getJobById;

  const handleDisable = () => {
    changeStatus({
      variables: {
        input: {
          jobId: id,
          action: "DISABLE",
          reason: "Disabled from danger zone",
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">Loading {singularName.toLowerCase()} details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-red-600 flex items-center gap-2">
          <div className="p-2 rounded-xl bg-red-100 ring-1 ring-red-200">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          Danger Zone
        </h2>
        <p className="text-muted-foreground mt-2 pl-12">
          These actions are destructive and cannot be undone. Please proceed
          with caution.
        </p>
      </div>

      {/* Disable Job Card */}
      <Card className="border-none shadow-lg shadow-black/[0.03] ring-1 ring-red-200 overflow-hidden bg-gradient-to-br from-red-50/50 to-white dark:to-card">
        <CardHeader className="pb-6 border-b border-red-100">
          <CardTitle className="text-red-700 text-lg flex items-center gap-2">
            Disable {singularName} Listing
          </CardTitle>
          <CardDescription className="text-base text-foreground/80 mt-1">
            Permanently disable <strong className="font-semibold">&ldquo;{job?.title}&rdquo;</strong> and hide it from all listings.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground font-medium">
              Disabling this {singularName.toLowerCase()} will affect all associated data, including:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col p-4 bg-card dark:bg-muted/50 rounded-xl border border-red-100 shadow-sm">
                <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Users className="h-3.5 w-3.5 text-red-500" /> Applicants
                </span>
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {job?.numberOfApplicant ?? 0}
                </span>
              </div>
              <div className="flex flex-col p-4 bg-card dark:bg-muted/50 rounded-xl border border-red-100 shadow-sm">
                <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Eye className="h-3.5 w-3.5 text-red-500" /> Views
                </span>
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {job?.numberOfViews ?? 0}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-red-50/50 pt-6 flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="font-semibold px-6 rounded-xl gap-2 shadow-sm">
                <Ban className="h-4 w-4" />
                Disable {singularName}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-red-200 max-w-md rounded-2xl shadow-xl shadow-red-900/10">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-600 flex items-center gap-2 text-xl">
                  <AlertTriangle className="h-5 w-5" />
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base pt-2 text-foreground/80">
                  This will permanently disable{" "}
                  <strong className="font-semibold text-foreground">
                    &ldquo;{job?.title}&rdquo;
                  </strong>
                  , removing it from all {singularName.toLowerCase()} listings. Applicant data will be
                  retained but the listing will no longer be accessible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6 gap-2">
                <AlertDialogCancel
                  disabled={disabling}
                  className="font-medium rounded-xl border-border"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleDisable();
                  }}
                  disabled={disabling}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2 rounded-xl shadow-sm"
                >
                  {disabling ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Disabling...
                    </>
                  ) : (
                    `Yes, Disable ${singularName}`
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}

export default withModulePermission(JobDangerZonePage, "JOBS", "canDelete");
