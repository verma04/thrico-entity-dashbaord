"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Save,
  Settings,
  Settings2,
  CheckCircle,
  PauseCircle,
  Loader2,
  RotateCcw,
  Globe,
  CheckCircle2,
  Clock,
  Lock,
  Users,
  Layers,
  Calendar,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  editPolls,
  deletePoll,
  changePollStatus,
  getPollByIdForUser,
} from "@/graphql/actions/polls";
import { useModuleStore } from "@/store/useModuleStore";
import { toast } from "sonner";
import { ReusableDangerZone } from "@/components/shared/reusable-danger-zone";
import { PolarisInput, PolarisLabel } from "@/components/gamification/shared/polaris-form-ui";
import moment from "moment";

const visibilityOptions = [
  {
    value: "ALWAYS",
    label: "Always Public",
    desc: "Results are continuously live and visible to all members.",
    icon: Globe,
  },
  {
    value: "AFTER_VOTE",
    label: "After Voting",
    desc: "Members unlock vote results immediately after submitting a ballot.",
    icon: CheckCircle2,
  },
  {
    value: "AFTER_END",
    label: "After Poll Deadline",
    desc: "Results stay hidden until the voting deadline officially expires.",
    icon: Clock,
  },
  {
    value: "ADMIN",
    label: "Administrators Only",
    desc: "Results are confidential and visible only to authorized moderators.",
    icon: Lock,
  },
];

function PollSettingsPage() {
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
  const [resultVisibility, setResultVisibility] = useState("ALWAYS");

  const [edit, { loading: updating }] = editPolls({
    onCompleted: () => {
      toast.success(`${singularName} settings updated successfully`);
      if (refetch) refetch();
    },
    onError: (err: any) => {
      toast.error(
        err.message || `Failed to update ${singularName.toLowerCase()}`
      );
    },
  });

  const [changeStatus, { loading: updatingStatus }] = changePollStatus({
    onCompleted: () => {
      toast.success(`${singularName} status updated`);
      if (refetch) refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update status");
    },
  });

  const [removePoll, { loading: deleting }] = deletePoll({
    onCompleted: () => {
      toast.success(`${singularName} deleted permanently`);
      router.push("/polls/all");
    },
    onError: (err: any) => {
      toast.error(
        err.message || `Failed to delete ${singularName.toLowerCase()}`
      );
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      question: "",
      endDate: "",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Title is required"),
      question: Yup.string().required("Question is required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload: any = {
        id,
        title: values.title,
        question: values.question,
        resultVisibility,
        options: (poll?.options || []).map((opt: any) => ({
          option: opt.text,
          id: opt.id,
        })),
      };

      if (values.endDate) {
        payload.endDate = new Date(values.endDate).toISOString();
      }

      edit({
        variables: {
          input: payload,
        },
      });
    },
  });

  useEffect(() => {
    if (poll) {
      setResultVisibility(poll.resultVisibility || "ALWAYS");
      formik.setValues({
        title: poll.title || "",
        question: poll.question || "",
        endDate: poll.endDate
          ? moment(poll.endDate).format("YYYY-MM-DD")
          : "",
      });
    }
  }, [poll]);

  const handleStatusAction = (action: "ENABLE" | "DISABLE") => {
    changeStatus({
      variables: {
        input: {
          pollId: id,
          action,
          reason: `Status changed to ${action} from settings`,
        },
      },
    });
  };

  const handleDelete = () => {
    removePoll({
      variables: {
        input: { pollId: id },
      },
    });
  };

  if (fetchingPoll) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-xs">Loading {singularName.toLowerCase()} settings…</p>
        </div>
      </div>
    );
  }

  const isPollDisabled = poll?.status === "DISABLED";
  const isPollActive = poll?.status === "APPROVED" || poll?.status === "ACTIVE";

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500 pb-12">
      {/* ── Top Header Strip ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/60 rounded-xl p-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              {singularName} Display &amp; Configuration
            </h2>
            <Badge variant="secondary" className="text-[10px] font-semibold">
              Preferences
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage voting availability, result access policies, and safety parameters.
          </p>
        </div>

        <Button
          onClick={() => formik.handleSubmit()}
          disabled={updating || !formik.dirty}
          className="h-8 gap-1.5 text-xs font-semibold rounded-lg shadow-2xs"
        >
          {updating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Save Settings
        </Button>
      </div>

      {/* ── Status Management Card ─────────────────────────────────────── */}
      <Card className="border border-border/60 bg-card shadow-2xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Settings2 className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-foreground">
                  Status &amp; Voting State
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Control whether members can currently cast ballots on this {singularName.toLowerCase()}.
                </CardDescription>
              </div>
            </div>

            <Badge
              variant={isPollActive ? "default" : "secondary"}
              className="rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase"
            >
              {poll?.status || "ACTIVE"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {isPollDisabled
                ? "This poll is currently paused and cannot accept new member submissions."
                : "This poll is currently active and accepting voter ballots on the community portal."}
            </p>

            {isPollDisabled ? (
              <Button
                variant="outline"
                size="sm"
                disabled={updatingStatus}
                onClick={() => handleStatusAction("ENABLE")}
                className="gap-2 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50 h-8 text-xs font-semibold"
              >
                {updatingStatus ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckCircle className="h-3.5 w-3.5" />
                )}
                Enable &amp; Reopen Voting
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled={updatingStatus}
                onClick={() => handleStatusAction("DISABLE")}
                className="gap-2 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50 h-8 text-xs font-semibold"
              >
                {updatingStatus ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <PauseCircle className="h-3.5 w-3.5" />
                )}
                Pause Voting
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Result Visibility Policy Card ──────────────────────────────── */}
      <Card className="border border-border/60 bg-card shadow-2xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-sm font-semibold text-foreground">
            Result Visibility &amp; Access Controls
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Configure who can inspect real-time voting percentages and individual choices.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <RadioGroup
            value={resultVisibility}
            onValueChange={setResultVisibility}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {visibilityOptions.map((opt) => (
              <label
                key={opt.value}
                htmlFor={`settings-vis-${opt.value}`}
                className={cn(
                  "flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all",
                  resultVisibility === opt.value
                    ? "bg-primary/[0.04] border-primary shadow-2xs"
                    : "bg-muted/10 border-border/60 hover:bg-muted/30"
                )}
              >
                <RadioGroupItem
                  id={`settings-vis-${opt.value}`}
                  value={opt.value}
                  className="mt-0.5 shrink-0"
                />
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <opt.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs font-semibold text-foreground">
                      {opt.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {opt.desc}
                  </p>
                </div>
              </label>
            ))}
          </RadioGroup>

          <div className="pt-3 border-t border-border/40">
            <PolarisInput
              id="settings-endDate"
              name="endDate"
              type="date"
              label="Voting Deadline (Optional)"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText="After this date, poll will transition to Closed state automatically."
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Danger Zone Section ────────────────────────────────────────── */}
      <div className="pt-4 border-t border-border/60 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-destructive flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" />
            Destructive Actions
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Irreversible operations regarding this {singularName.toLowerCase()} and its ballot records.
          </p>
        </div>

        <ReusableDangerZone
          entityName={singularName}
          entityTitle={poll?.title || poll?.question || `${singularName} #${id}`}
          entityId={id}
          onDelete={handleDelete}
          loading={deleting}
          holdTime={2000}
          requireTypeMatch={true}
          warningDescription={`Permanently delete "${poll?.title || poll?.question}". This will purge all ${poll?.totalVotes || 0} cast ballots, erase answer choice statistics, and delete this poll from the community feed.`}
          impactMetrics={[
            {
              label: "Total Votes Cast",
              value: poll?.totalVotes || 0,
              icon: Users,
              description: "All voter ballots permanently destroyed",
            },
            {
              label: "Answer Choices",
              value: poll?.options?.length || 0,
              icon: Layers,
              description: "All voting options and options count erased",
            },
            {
              label: "Poll Schedule",
              value: poll?.endDate ? "Active" : "Indefinite",
              icon: Calendar,
              description: "Lifecycle records erased",
            },
            {
              label: "Analytics Records",
              value: poll?.resultVisibility || "Public",
              icon: BarChart3,
              description: "Visibility settings and result charts removed",
            },
          ]}
        />
      </div>
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(PollSettingsPage, "POLLS", "canEdit"),
  "polls"
);
