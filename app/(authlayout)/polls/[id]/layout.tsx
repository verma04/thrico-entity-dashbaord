"use client";

import React, { useState } from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { usePathname, useRouter } from "next/navigation";
import {
  MessageSquare,
  BarChart3,
  Settings,
  ShieldAlert,
  Activity,
  AlertTriangle,
  RotateCcw,
  Upload,
  Globe,
  Users,
  Calendar,
  Layers,
} from "lucide-react";
import { getPollByIdForUser } from "@/graphql/actions/polls";
import { useModuleStore } from "@/store/useModuleStore";
import {
  ManageItemLayout,
  type ManageTabItem,
} from "@/components/layout/manage-item-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import moment from "moment";
import { buildCsv, downloadCsv } from "@/lib/export-csv";

function PollsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const id = pathname?.split("/")[2];
  const section = pathname
    ?.replace(`/polls/${id}`, "")
    .split("/")
    .filter(Boolean)[0];
  const currentTab = !section ? "general-info" : section;

  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, loading, refetch } = getPollByIdForUser({
    variables: {
      input: { pollId: id },
    },
    skip: !id,
  });

  const moduleName = useModuleStore((state) => state.pollModuleName) || "Polls";
  const singularName = useModuleStore((state) => state.pollSingularName) || "Poll";

  const poll = data?.getPollByIdForUser;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (refetch) {
        await refetch();
      }
      window.dispatchEvent(new CustomEvent("refresh-poll-view"));
      toast.success(`${singularName} refreshed`);
    } catch {
      toast.error("Failed to refresh details");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleExportSummary = () => {
    if (!poll) {
      toast.error("No poll data available to export");
      return;
    }

    const rows = (poll.options || []).map((opt: any, index: number) => ({
      pollId: poll.id || id,
      title: poll.title || "",
      question: poll.question || "",
      visibility: poll.resultVisibility || "ALWAYS",
      totalVotes: poll.totalVotes || 0,
      optionNumber: index + 1,
      optionText: opt.text || "",
      optionVotes: opt.votes || 0,
      voteShare:
        poll.totalVotes && poll.totalVotes > 0
          ? `${Math.round(((opt.votes || 0) / poll.totalVotes) * 100)}%`
          : "0%",
      status: poll.status || "ACTIVE",
      created: poll.createdAt
        ? moment(poll.createdAt).format("YYYY-MM-DD")
        : "N/A",
      deadline: poll.endDate
        ? moment(poll.endDate).format("YYYY-MM-DD")
        : "No deadline",
    }));

    const csv = buildCsv(rows, [
      { header: "Poll ID", getValue: (r: any) => r.pollId },
      { header: "Title", getValue: (r: any) => r.title },
      { header: "Question", getValue: (r: any) => r.question },
      { header: "Result Visibility", getValue: (r: any) => r.visibility },
      { header: "Total Poll Votes", getValue: (r: any) => r.totalVotes },
      { header: "Option #", getValue: (r: any) => r.optionNumber },
      { header: "Option Text", getValue: (r: any) => r.optionText },
      { header: "Option Votes", getValue: (r: any) => r.optionVotes },
      { header: "Vote Share", getValue: (r: any) => r.voteShare },
      { header: "Status", getValue: (r: any) => r.status },
      { header: "Created Date", getValue: (r: any) => r.created },
      { header: "Deadline", getValue: (r: any) => r.deadline },
    ]);

    const filename = `${singularName.toLowerCase()}-${(
      poll.title ||
      poll.question ||
      "summary"
    )
      .toLowerCase()
      .replace(/\s+/g, "-")}-${moment().format("YYYY-MM-DD")}`;
    downloadCsv(csv, filename);
    toast.success(`${singularName} summary exported successfully`);
  };

  const isExpired = poll?.endDate && moment(poll.endDate).isBefore(moment());
  const isLive = poll?.status === "APPROVED" || poll?.status === "ACTIVE";
  const isDraft = poll?.status === "DRAFT";
  const isDisabled = poll?.status === "DISABLED";

  const statusColor = isLive && !isExpired
    ? "bg-emerald-500"
    : isDraft
      ? "bg-amber-500"
      : isDisabled
        ? "bg-red-500"
        : isExpired
          ? "bg-rose-500"
          : "bg-primary";

  const tabItems: ManageTabItem[] = [
    { key: "general-info", label: "General Info", icon: MessageSquare, path: "" },
    {
      key: "results",
      label: "Results",
      icon: BarChart3,
      path: "results",
      count: poll?.totalVotes !== undefined ? poll.totalVotes : undefined,
    },
    { key: "settings", label: "Settings", icon: Settings, path: "settings" },
    {
      key: "reported-items",
      label: "Reported Items",
      icon: ShieldAlert,
      path: "reported-items",
    },
    { key: "audit-log", label: "Audit Log", icon: Activity, path: "audit-log" },
    {
      key: "danger-zone",
      label: "Danger Zone",
      icon: AlertTriangle,
      danger: true,
      path: "danger-zone",
    },
  ];

  const headerBadges = !loading && poll ? (
    <div className="flex items-center gap-2 flex-wrap">
      <Badge
        variant="outline"
        className={cn(
          "px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider rounded-md gap-1.5 border shadow-2xs",
          isLive && !isExpired
            ? "bg-emerald-50/80 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800"
            : isDraft
              ? "bg-amber-50/80 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800"
              : isDisabled
                ? "bg-red-50/80 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200/80 dark:border-red-800"
                : "bg-rose-50/80 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/80 dark:border-rose-800"
        )}
      >
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            isLive && !isExpired
              ? "bg-emerald-500 animate-pulse"
              : isDraft
                ? "bg-amber-500"
                : isDisabled
                  ? "bg-red-500"
                  : "bg-rose-500"
          )}
        />
        {isExpired ? "Closed" : poll.status || "Active"}
      </Badge>

      {poll.resultVisibility && (
        <Badge
          variant="secondary"
          className="px-2 py-0.5 text-[10px] font-medium tracking-wide rounded-md text-muted-foreground border border-border/40 shadow-2xs"
        >
          {poll.resultVisibility.replace(/_/g, " ")}
        </Badge>
      )}

      {poll.options && (
        <Badge
          variant="outline"
          className="px-2 py-0.5 text-[10px] font-medium rounded-md text-foreground/80 bg-background/50 border-border/60"
        >
          {poll.options.length} Choices
        </Badge>
      )}
    </div>
  ) : null;

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg border-border/60 shadow-2xs transition-all"
        onClick={handleRefresh}
        disabled={isRefreshing}
        title="Refresh details"
      >
        <RotateCcw
          className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-primary")}
        />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleExportSummary}
        className="h-8 rounded-lg text-xs gap-1.5 font-medium border-border/60 shadow-2xs hover:bg-muted/70"
      >
        <Upload className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="hidden sm:inline">Export</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(`/polls/${id}/settings`)}
        className="h-8 rounded-lg text-xs gap-1.5 font-medium border-border/60 shadow-2xs hover:bg-muted/70"
      >
        <Settings className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="hidden sm:inline">Settings</span>
      </Button>
    </div>
  );

  const subtitleNode =
    !loading && poll ? (
      <div className="text-xs text-muted-foreground flex items-center gap-2.5 flex-wrap pt-0.5">
        <span className="flex items-center gap-1 font-medium text-foreground/80">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          {poll.endDate
            ? `Closes ${moment(poll.endDate).format("MMM D, YYYY")}`
            : poll.createdAt
              ? `Created ${moment(poll.createdAt).format("MMM D, YYYY")}`
              : "No deadline"}
        </span>

        {poll.resultVisibility && (
          <>
            <span className="text-muted-foreground/40">·</span>
            <span className="flex items-center gap-1 truncate max-w-[250px]">
              <Globe className="h-3 w-3 text-muted-foreground" />
              {poll.resultVisibility.replace(/_/g, " ")} Results
            </span>
          </>
        )}

        {poll.totalVotes !== undefined && (
          <>
            <span className="text-muted-foreground/40">·</span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <strong className="font-semibold text-foreground">
                {poll.totalVotes}
              </strong>{" "}
              votes cast
            </span>
          </>
        )}
      </div>
    ) : null;

  return (
    <ManageItemLayout
      title={poll?.title || poll?.question || `${singularName} Details`}
      loading={loading}
      loadingText={`Loading ${singularName}…`}
      defaultIcon={MessageSquare}
      iconContainerClassName="bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400"
      statusColor={statusColor}
      badges={headerBadges}
      subtitle={subtitleNode}
      headerActions={headerActions}
      closeHref="/polls/all"
      basePath={`/polls/${id}`}
      currentTab={currentTab}
      tabs={tabItems}
      breadcrumbs={[
        { label: moduleName, href: "/polls/all" },
        { label: poll?.title || poll?.question || `${singularName} Details` },
      ]}
    >
      {children}
    </ManageItemLayout>
  );
}

export default withModulePermission(PollsLayout, "POLLS", "canRead");
