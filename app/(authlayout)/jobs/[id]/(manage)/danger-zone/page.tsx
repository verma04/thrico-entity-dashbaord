"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetJobById, useChangeJobStatus } from "@/graphql/actions/jobs";
import { toast } from "sonner";
import { Users, Eye, Loader2 } from "lucide-react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";
import { ReusableDangerZone } from "@/components/shared/reusable-danger-zone";

function JobDangerZonePage() {
  const singularName = useModuleStore((state) => state.jobSingularName) || "Job";
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { data, loading } = useGetJobById({
    variables: { id },
    skip: !id,
  });

  const [changeStatus, { loading: disabling }] = useChangeJobStatus({
    onCompleted: () => {
      toast.success(`The ${singularName.toLowerCase()} has been permanently disabled.`);
      router.push("/jobs/all");
    },
    onError: (err: any) => {
      toast.error(err.message || `Failed to disable ${singularName.toLowerCase()}`);
    },
  });

  const job = data?.getJobById;

  const handleDisable = () => {
    changeStatus({
      variables: {
        input: {
          jobId: id,
          action: "DISABLE",
          reason: "Permanently disabled from Danger Zone",
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading {singularName.toLowerCase()} details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <ReusableDangerZone
        entityName={singularName}
        entityTitle={job?.title || "Untitled Job"}
        impactMetrics={[
          {
            label: "Total Applicants",
            value: job?.numberOfApplicant ?? 0,
            icon: Users,
          },
          {
            label: "Page Impressions",
            value: job?.numberOfViews ?? 0,
            icon: Eye,
          },
        ]}
        onDelete={handleDisable}
        loading={disabling}
        deleteButtonLabel={`Hold 2s to Disable ${singularName}`}
        deleteDoneLabel={`Disabled`}
        holdTime={2000}
        requireTypeMatch={false}
      />
    </div>
  );
}

export default withModulePermission(JobDangerZonePage, "JOBS", "canDelete");
