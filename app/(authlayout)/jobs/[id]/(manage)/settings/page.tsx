"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetJobById, useChangeJobStatus, useUpdateJob } from "@/graphql/actions/jobs";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Settings2, CheckCircle, PauseCircle, Ban } from "lucide-react";
import { JobCreationForm } from "@/components/jobs/create/job-creation-form";
import { cn } from "@/lib/utils";

export default function JobSettingsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { toast } = useToast();

  const { data, loading } = useGetJobById({
    variables: { id },
    skip: !id,
  });

  const [changeStatus, { loading: updatingStatus }] = useChangeJobStatus({
    onCompleted: () => {
      toast({ title: "Success", description: "Job status updated." });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const [updateJob, { loading: updating }] = useUpdateJob({
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Job updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update job",
        variant: "destructive",
      });
    },
  });

  const job = data?.getJobById;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">Loading job details...</p>
        </div>
      </div>
    );
  }

  const handleAction = (action: string) => {
    changeStatus({ variables: { input: { jobId: id, action } } });
  };

  const statusActions = [
    {
      label: "Approve",
      action: "APPROVE",
      icon: CheckCircle,
      variant: "success",
      show: (s: string) => s !== "APPROVED",
    },
    {
      label: "Pause",
      action: "PAUSE",
      icon: PauseCircle,
      variant: "warning",
      show: (s: string) => s === "APPROVED",
    },
    {
      label: "Disable",
      action: "DISABLE",
      icon: Ban,
      variant: "destructive",
      show: (s: string) => s !== "DISABLED",
    },
  ];

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case "success":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300";
      case "warning":
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300";
      case "destructive":
        return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300";
      default:
        return "bg-muted text-muted-foreground border-border hover:bg-muted/80";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Status Management */}
      <Card className="border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 overflow-hidden bg-gradient-to-br from-card to-muted/10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Settings2 className="h-4 w-4 text-primary" />
                </div>
                Status Management
              </CardTitle>
              <CardDescription className="mt-1">
                Change the current publication status of this job.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Current Status
              </span>
              <Badge
                variant={job?.status === "APPROVED" ? "default" : "secondary"}
                className="rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase"
              >
                {job?.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {statusActions
              .filter((a) => a.show(job?.status || ""))
              .map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.action}
                    disabled={updatingStatus}
                    onClick={() => handleAction(action.action)}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                      getVariantStyles(action.variant)
                    )}
                  >
                    {updatingStatus ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                    {action.label}
                  </button>
                );
              })}
          </div>
        </CardContent>
      </Card>
      
      {/* Edit Form Container */}
      <div className="rounded-2xl border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 bg-card overflow-hidden relative">
        <div className="bg-muted/30 px-6 py-4 border-b border-border/40">
          <h3 className="font-semibold text-foreground">Edit Job Details</h3>
          <p className="text-sm text-muted-foreground">Update the information for this job listing.</p>
        </div>
        <div className="p-6">
          <JobCreationForm
            initialValues={{
              title: job?.title || "",
              company: job?.company || "",
              location: job?.location || "",
              salary: job?.salary || "",
              jobType: job?.jobType || "",
              workplaceType: job?.workplaceType || "",
              experienceLevel: job?.experienceLevel || "",
              description: job?.description || "",
              requirements: job?.requirements?.length ? job.requirements : [""],
              responsibilities: job?.responsibilities?.length ? job.responsibilities : [""],
              benefits: job?.benefits?.length ? job.benefits : [""],
              skills: job?.skills?.length ? job.skills : [""],
            }}
            loading={updating}
            onFinish={(values: any) => {
              const jobInput: any = {
                id: job?.id,
                title: values.title,
                description: values.description,
                location: values.location,
                jobType: values.jobType,
                salary: values.salary,
                experienceLevel: values.experienceLevel,
                workplaceType: values.workplaceType,
                applicationDeadline: values.applicationDeadline,
                requirements: values.requirements.filter((r: string) => r.trim() !== ""),
                responsibilities: values.responsibilities.filter((r: string) => r.trim() !== ""),
                benefits: values.benefits.filter((r: string) => r.trim() !== ""),
                skills: values.skills.filter((r: string) => r.trim() !== ""),
              };

              if (values.company?.id) {
                jobInput.company = { id: values.company.id };
              }

              updateJob({
                variables: {
                  input: jobInput,
                },
              });
            }}
            onCancel={() => router.back()}
          />
        </div>
      </div>
    </div>
  );
}
