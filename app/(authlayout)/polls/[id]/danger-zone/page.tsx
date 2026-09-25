"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  Loader2,
  Users,
  Layers,
  Calendar,
  BarChart3,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  changePollStatus,
  deletePoll,
  getPollByIdForUser,
} from "@/graphql/actions/polls";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";
import { ReusableDangerZone } from "@/components/shared/reusable-danger-zone";

function PollDangerZonePage() {
  const moduleName =
    useModuleStore((state) => state.pollModuleName) || "Polls";
  const singularName =
    useModuleStore((state) => state.pollSingularName) || "Poll";
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    data,
    loading: fetchingPoll,
    refetch,
  } = getPollByIdForUser({
    variables: {
      input: { pollId: id },
    },
    skip: !id,
  });

  const poll = data?.getPollByIdForUser;

  const [removePoll, { loading: deleting }] = deletePoll({
    onCompleted: () => {
      toast.success(`${singularName} deleted permanently`);
      router.push("/polls/all");
    },
    onError: (err: any) => {
      toast.error(
        err?.message || `Failed to delete ${singularName.toLowerCase()}`
      );
    },
  });

  const [changeStatus, { loading: changingStatus }] = changePollStatus({
    onCompleted: () => {
      toast.success(`${singularName} status updated`);
      if (refetch) refetch();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update status");
    },
  });

  if (fetchingPoll) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-xs">
            Loading {singularName.toLowerCase()} safety parameters…
          </p>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="bg-card border border-border/80 rounded-xl p-12 text-center max-w-lg mx-auto shadow-2xs">
        <AlertTriangle className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-60" />
        <h3 className="text-base font-semibold">{singularName} Not Found</h3>
        <p className="text-xs text-muted-foreground mt-1">
          This {singularName.toLowerCase()} could not be loaded or was previously removed.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 h-8 text-xs font-semibold"
          onClick={() => router.push("/polls/all")}
        >
          Back to {moduleName}
        </Button>
      </div>
    );
  }

  const isPollDisabled = poll.status === "DISABLED";

  const handleToggleDisable = () => {
    changeStatus({
      variables: {
        input: {
          pollId: id,
          action: isPollDisabled ? "ENABLE" : "DISABLE",
          reason: isPollDisabled
            ? "Re-enabled from danger zone"
            : "Temporarily disabled from danger zone",
        },
      },
    });
  };

  const handleDelete = () => {
    removePoll({
      variables: {
        input: {
          pollId: id,
        },
      },
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* ── Soft Disable Alternative Card ─────────────────────────────── */}
      <Card className="border-amber-200/60 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 shadow-2xs overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-foreground">
                  {isPollDisabled
                    ? `Re-enable ${singularName}`
                    : `Pause Voting / Disable ${singularName}`}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  {isPollDisabled
                    ? `Restore voting access and make this ${singularName.toLowerCase()} active again.`
                    : `Temporarily lock voting while preserving all existing ballots and analytics.`}
                </CardDescription>
              </div>
            </div>

            <Badge
              variant="outline"
              className="text-[10px] uppercase font-semibold border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400"
            >
              {poll?.status || "ACTIVE"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between pt-2 border-t border-amber-200/40 dark:border-amber-900/30">
            <p className="text-xs text-muted-foreground">
              {isPollDisabled
                ? "This poll is currently disabled and not accepting new votes."
                : "Prefer pausing instead of permanent destruction? Disable voting temporarily."}
            </p>
            <Button
              variant="outline"
              size="sm"
              disabled={changingStatus}
              onClick={handleToggleDisable}
              className="h-8 text-xs font-semibold border-amber-300 hover:bg-amber-100/60 dark:border-amber-800 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300"
            >
              {changingStatus ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : isPollDisabled ? (
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 mr-1.5" />
              )}
              {isPollDisabled ? "Enable Poll" : "Pause Poll"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Permanent Destruction (Reusable Danger Zone) ───────────────── */}
      <ReusableDangerZone
        entityName={singularName}
        entityTitle={poll.title || poll.question || `${singularName} #${id}`}
        entityId={id}
        onDelete={handleDelete}
        loading={deleting}
        holdTime={2000}
        requireTypeMatch={true}
        warningDescription={`Permanently delete "${poll.title || poll.question}". This will purge all ${poll.totalVotes || 0} cast ballots, erase answer choice statistics, and delete this poll from the community feed.`}
        impactMetrics={[
          {
            label: "Total Votes Cast",
            value: poll.totalVotes || 0,
            icon: Users,
            description: "All voter ballots permanently destroyed",
          },
          {
            label: "Answer Choices",
            value: poll.options?.length || 0,
            icon: Layers,
            description: "All voting options and options count erased",
          },
          {
            label: "Poll Schedule",
            value: poll.endDate ? "Active" : "Indefinite",
            icon: Calendar,
            description: "Lifecycle records erased",
          },
          {
            label: "Analytics Records",
            value: poll.resultVisibility || "Public",
            icon: BarChart3,
            description: "Visibility settings and result charts removed",
          },
        ]}
      />
    </div>
  );
}

export default withModulePermission(PollDangerZonePage, "POLLS", "canDelete");
