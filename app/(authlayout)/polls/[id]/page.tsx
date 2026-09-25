"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPollByIdForUser, editPolls } from "@/graphql/actions/polls";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import {
  MessageSquare,
  ArrowLeft,
  Users,
  Layers,
  Sparkles,
  Clock,
  Globe,
  Trophy,
  BarChart3,
  Calendar,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Lock,
  RotateCcw,
  Save,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInput,
  PolarisTextarea,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";
import Link from "next/link";
import moment from "moment";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";
import { cn } from "@/lib/utils";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";

const pollSchema = Yup.object().shape({
  title: Yup.string()
    .required("Please enter a title")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  question: Yup.string()
    .required("Please enter a poll question")
    .min(5, "Question must be at least 5 characters")
    .max(200, "Question must be less than 200 characters"),
  options: Yup.array()
    .of(
      Yup.object().shape({
        option: Yup.string()
          .required("Option cannot be empty")
          .min(1, "Option cannot be empty")
          .max(100, "Option must be less than 100 characters"),
        id: Yup.string().optional(),
      })
    )
    .min(2, "At least 2 options are required")
    .max(10, "Maximum 10 options allowed"),
  endDate: Yup.string().nullable().optional(),
});

const visibilityOptions = [
  {
    value: "ALWAYS",
    label: "Always Public",
    desc: "Results are live and visible to everyone at all times",
    icon: Globe,
  },
  {
    value: "AFTER_VOTE",
    label: "After Voting",
    desc: "Members unlock results immediately after casting their ballot",
    icon: CheckCircle2,
  },
  {
    value: "AFTER_END",
    label: "After Deadline",
    desc: "Results stay hidden until poll deadline officially closes",
    icon: Clock,
  },
  {
    value: "ADMIN",
    label: "Only Admins",
    desc: "Confidential results restricted strictly to moderators",
    icon: Lock,
  },
];

function PollGeneralInfo() {
  const singularName =
    useModuleStore((state) => state.pollSingularName) || "Poll";
  const moduleName =
    useModuleStore((state) => state.pollModuleName) || "Polls";
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [resultVisibility, setResultVisibility] = useState("ALWAYS");

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

  const [updatePoll, { loading: updating }] = editPolls({
    onCompleted: () => {
      toast.success(`${singularName} updated successfully`);
      if (refetch) refetch();
    },
    onError: (err: any) => {
      toast.error(
        err.message || `Failed to update ${singularName.toLowerCase()}`
      );
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      question: "",
      endDate: "",
      options: [
        { option: "", id: "1" },
        { option: "", id: "2" },
      ],
    },
    validationSchema: pollSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload: any = {
        id,
        title: values.title,
        question: values.question,
        resultVisibility,
        options: values.options.map((opt) => ({
          option: opt.option,
          id: opt.id,
        })),
      };

      if (values.endDate) {
        payload.endDate = new Date(values.endDate).toISOString();
      }

      updatePoll({
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
        options:
          poll.options && poll.options.length > 0
            ? poll.options.map((opt: any) => ({
                option: opt.text || "",
                id: opt.id || "",
              }))
            : [
                { option: "", id: "1" },
                { option: "", id: "2" },
              ],
      });
    }
  }, [poll]);

  if (fetchingPoll) {
    return <PolarisFormSkeleton showHeader={false} />;
  }

  if (!poll) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-border/80 rounded-xl bg-card space-y-4 shadow-2xs">
        <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs">
          <MessageSquare className="h-7 w-7" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-bold text-foreground">
            {singularName} Not Found
          </h3>
          <p className="text-xs text-muted-foreground">
            This {singularName.toLowerCase()} may have been deleted or the link is invalid.
          </p>
        </div>
        <Link href="/polls/all">
          <Button
            variant="outline"
            className="gap-2 text-xs font-semibold h-8 rounded-lg shadow-2xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to {moduleName}
          </Button>
        </Link>
      </div>
    );
  }

  const isExpired = poll.endDate && moment(poll.endDate).isBefore(moment());
  const isPollActive = poll.status === "APPROVED" || poll.status === "ACTIVE";

  // Calculate highest vote option
  const totalVotes = poll.totalVotes || 0;
  const sortedOptions = [...(poll.options || [])].sort(
    (a: any, b: any) => (b.votes || 0) - (a.votes || 0)
  );
  const leadingOption = sortedOptions[0];
  const leadingPercent =
    totalVotes > 0 && leadingOption
      ? Math.round(((leadingOption.votes || 0) / totalVotes) * 100)
      : 0;

  const moveOption = (index: number, direction: "up" | "down") => {
    const newOptions = [...formik.values.options];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newOptions.length) {
      const [movedOption] = newOptions.splice(index, 1);
      newOptions.splice(targetIndex, 0, movedOption);
      formik.setFieldValue("options", newOptions);
    }
  };

  const getVisibilityLabel = () => {
    return (
      visibilityOptions.find((v) => v.value === resultVisibility)?.label ||
      resultVisibility.replace(/_/g, " ")
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* ── Top Telemetry Scorecards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Schedule
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950/50 rounded">
              Timeline
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
              {poll.endDate
                ? moment(poll.endDate).format("MMM D, YYYY")
                : "No deadline"}
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-0.5 truncate">
            {poll.endDate
              ? isExpired
                ? `Expired ${moment(poll.endDate).fromNow()}`
                : `Closes ${moment(poll.endDate).fromNow()}`
              : "Open indefinitely"}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Visibility
            </span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold px-1.5 py-0.2 bg-purple-50 dark:bg-purple-950/50 rounded">
              Policy
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
              {getVisibilityLabel()}
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-0.5 truncate">
            {resultVisibility === "AFTER_VOTE"
              ? "Unlocked upon ballot submission"
              : resultVisibility === "AFTER_END"
                ? "Private until closing deadline"
                : resultVisibility === "ADMIN"
                  ? "Managers & moderators only"
                  : "Live public tally for all"}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Turnout
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-1.5 py-0.2 bg-emerald-50 dark:bg-emerald-950/50 rounded">
              Ballots
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {totalVotes.toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              votes cast
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-0.5 truncate">
            {totalVotes > 0 && leadingOption
              ? `Top: "${leadingOption.text}" (${leadingPercent}%)`
              : `${poll.options?.length || 0} answer choices available`}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Publication
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold px-1.5 py-0.2 bg-amber-50 dark:bg-amber-950/50 rounded">
              Status
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              {isExpired ? "Closed" : poll.status || "Active"}
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-0.5 truncate">
            {isExpired
              ? "Voting period has ended"
              : poll.status === "DISABLED"
                ? "Temporarily paused"
                : "Active & accepting member votes"}
          </p>
        </div>
      </div>

      {/* ── Real-Time Vote Distribution Scorecard ────────────────────── */}
      {poll.options && poll.options.length > 0 && (
        <div className="bg-card rounded-xl border border-border/60 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Current Ballot Standings
                </h3>
                <Badge variant="outline" className="text-[10px] font-semibold">
                  {totalVotes} Total Ballot{totalVotes === 1 ? "" : "s"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time vote distribution across all {poll.options.length} configured choices.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/polls/${id}/results`)}
              className="h-8 gap-1.5 text-xs font-semibold rounded-lg shadow-2xs border-border/60 hover:bg-muted"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Full Analytics
              <ArrowRight className="h-3 w-3 ml-0.5 text-muted-foreground" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {poll.options.map((option: any, index: number) => {
              const optVotes = option.votes || 0;
              const pct =
                totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
              const isLeader =
                leadingOption?.id === option.id && totalVotes > 0;

              return (
                <div
                  key={option.id || index}
                  className={cn(
                    "p-3.5 rounded-xl border transition-all duration-200 space-y-2",
                    isLeader
                      ? "bg-primary/[0.03] border-primary/30 shadow-2xs"
                      : "bg-muted/20 border-border/50 hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-xs font-semibold text-foreground truncate">
                        {option.text}
                      </span>
                      {isLeader && (
                        <Badge className="h-4.5 px-1.5 gap-1 rounded-md text-[9.5px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                          <Trophy className="h-2.5 w-2.5" />
                          Leader
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-right">
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {optVotes} vote{optVotes === 1 ? "" : "s"}
                      </span>
                      <span className="text-xs font-bold font-mono text-foreground min-w-[32px]">
                        {pct}%
                      </span>
                    </div>
                  </div>

                  <Progress
                    value={pct}
                    className={cn(
                      "h-1.5 rounded-full bg-muted/60",
                      isLeader
                        ? "[&>div]:bg-primary"
                        : "[&>div]:bg-muted-foreground/40"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Poll Specifications Form (Polaris Standard) ────────────────── */}
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <PolarisFormLayout
            sidebar={
              <div className="space-y-4">
                {/* Live Poll Preview Card */}
                <PolarisSidebarCard
                  title={`${singularName} Preview`}
                  badge="Live Ballot"
                  icon={Sparkles}
                >
                  <div className="rounded-[8px] border border-border/60 bg-muted/30 p-3.5 space-y-3 shadow-2xs">
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                        {formik.values.title || `Untitled ${singularName}`}
                      </span>
                      <h4 className="font-semibold text-xs text-foreground mt-0.5 leading-snug">
                        {formik.values.question ||
                          "Inquiry question will appear here..."}
                      </h4>
                    </div>

                    {/* Options list preview */}
                    <div className="space-y-1.5 pt-2 border-t border-border/40">
                      {formik.values.options.map((opt, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 rounded-lg border border-border/60 bg-card shadow-2xs"
                        >
                          <div className="h-4.5 w-4.5 rounded-[4px] bg-muted border border-border/60 flex items-center justify-center shrink-0">
                            <span className="text-[9.5px] font-bold text-foreground">
                              {String.fromCharCode(65 + i)}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-foreground truncate flex-1">
                            {opt.option || `Choice ${i + 1}`}
                          </span>
                          <div className="h-3 w-3 rounded-full border border-border shrink-0" />
                        </div>
                      ))}
                    </div>

                    {/* Visibility & Deadline chip */}
                    <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10.5px] text-muted-foreground">
                      <span>Result Policy:</span>
                      <span className="font-semibold text-foreground">
                        {getVisibilityLabel()}
                      </span>
                    </div>

                    {formik.values.endDate && (
                      <div className="flex items-center justify-between text-[10.5px] text-muted-foreground">
                        <span>Closes:</span>
                        <span className="font-semibold text-foreground">
                          {moment(formik.values.endDate).format("MMM D, YYYY")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-border/40">
                    <PolarisSummaryRow
                      label="Poll Title"
                      value={
                        <span className="truncate max-w-[140px] inline-block font-semibold">
                          {formik.values.title || "Not set"}
                        </span>
                      }
                    />
                    <PolarisSummaryRow
                      label="Choices Count"
                      value={`${formik.values.options.length} options`}
                    />
                    <PolarisSummaryRow
                      label="Result Access"
                      value={getVisibilityLabel()}
                      isLast
                    />
                  </div>
                </PolarisSidebarCard>

                {/* Strategy Tip Card */}
                <PolarisTipCard title={`${singularName} Strategy Tip`}>
                  Polls with 3-4 succinct choices and "After Voting" visibility
                  yield 65% higher voter turnout by keeping initial feedback
                  unbiased.
                </PolarisTipCard>
              </div>
            }
          >
            <div className="space-y-4">
              {/* Step 1: Identity & Question */}
              <PolarisFormCard
                step={1}
                title={`Core ${singularName} Identity & Prompt`}
                description="Specify the subject headline and the main inquiry for your community members."
                badge="Required"
              >
                <PolarisInput
                  id="poll-title"
                  name="title"
                  label={`${singularName} Topic / Headline`}
                  required
                  placeholder="e.g. Weekly Community Feedback Poll"
                  maxLength={100}
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.title && formik.errors.title
                      ? String(formik.errors.title)
                      : undefined
                  }
                />

                <div className="pt-2 border-t border-border/40">
                  <PolarisTextarea
                    id="poll-question"
                    name="question"
                    label="Inquiry Question / Prompt"
                    required
                    rows={3}
                    placeholder="State the exact question or decision members should vote on..."
                    maxLength={200}
                    value={formik.values.question}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText={`${formik.values.question.length} / 200 characters`}
                    error={
                      formik.touched.question && formik.errors.question
                        ? String(formik.errors.question)
                        : undefined
                    }
                  />
                </div>
              </PolarisFormCard>

              {/* Step 2: Answer Choices */}
              <PolarisFormCard
                step={2}
                title="Answer Choices & Voting Options"
                description="Provide between 2 and 10 mutually exclusive ballot options for voters."
                badge="Choices"
              >
                <FieldArray
                  name="options"
                  render={(arrayHelpers) => (
                    <div className="space-y-2">
                      {formik.values.options.map((option, index) => (
                        <div
                          key={index}
                          className="group flex items-center gap-2 p-2 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/30 transition-colors"
                        >
                          <div className="h-6 w-6 rounded-md bg-foreground text-background flex items-center justify-center shrink-0">
                            <span className="text-[11px] font-bold">
                              {String.fromCharCode(65 + index)}
                            </span>
                          </div>

                          <input
                            type="text"
                            name={`options[${index}].option`}
                            value={option.option}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder={`Choice ${index + 1}...`}
                            maxLength={100}
                            className="flex-1 bg-transparent border-0 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-hidden"
                          />

                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={index === 0}
                              onClick={() => moveOption(index, "up")}
                              className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md disabled:opacity-30"
                              title="Move up"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={index === formik.values.options.length - 1}
                              onClick={() => moveOption(index, "down")}
                              className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md disabled:opacity-30"
                              title="Move down"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={formik.values.options.length <= 2}
                              onClick={() => arrayHelpers.remove(index)}
                              className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-md disabled:opacity-30"
                              title="Delete option"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {formik.values.options.length < 10 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            arrayHelpers.push({
                              option: "",
                              id: String(formik.values.options.length + 1),
                            })
                          }
                          className="w-full mt-2 h-8 text-xs font-semibold gap-1.5 border-dashed border-border/80 hover:bg-muted"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Option Choice ({formik.values.options.length}/10)
                        </Button>
                      )}
                    </div>
                  )}
                />
              </PolarisFormCard>

              {/* Step 3: Visibility & Scheduling */}
              <PolarisFormCard
                step={3}
                title="Visibility Rules & Deadline Scheduling"
                description="Determine who can inspect real-time vote metrics and configure an optional closing date."
                badge="Settings"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <PolarisLabel required>Result Visibility Policy</PolarisLabel>
                    <RadioGroup
                      value={resultVisibility}
                      onValueChange={setResultVisibility}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1"
                    >
                      {visibilityOptions.map((opt) => (
                        <label
                          key={opt.value}
                          htmlFor={`vis-${opt.value}`}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                            resultVisibility === opt.value
                              ? "bg-primary/[0.04] border-primary shadow-2xs"
                              : "bg-card border-border/60 hover:bg-muted/30"
                          )}
                        >
                          <RadioGroupItem
                            id={`vis-${opt.value}`}
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
                  </div>

                  <div className="pt-3 border-t border-border/40">
                    <PolarisInput
                      id="poll-endDate"
                      name="endDate"
                      type="date"
                      label="Closing Deadline (Optional)"
                      value={formik.values.endDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      helperText="Leave empty to allow voting indefinitely until manually closed."
                    />
                  </div>
                </div>
              </PolarisFormCard>
            </div>
          </PolarisFormLayout>

          <FloatingSavePanel
            hasChanged={formik.dirty}
            saved={!formik.dirty}
            isSaving={updating}
            onSave={() => formik.handleSubmit()}
            onReset={() => formik.resetForm()}
            saveButtonText="Save Changes"
          />
        </form>
      </FormikProvider>
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(PollGeneralInfo, "POLLS", "canRead"),
  "polls"
);
