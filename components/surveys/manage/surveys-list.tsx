"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  ClipboardList,
  Users2,
  ShieldCheck,
  Layers,
  Users,
  UserCheck,
  Globe,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Survey } from "@/graphql/surveys/survey-queries";
import { getThricoDomain, getCustomDomain } from "@/graphql/actions/domain";
import { toast } from "sonner";
import { SurveyActions } from "./survey-actions";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  AdminTableDate,
} from "@/components/shared/admin-table/admin-table";
import { useModuleStore } from "@/store/useModuleStore";

// ─────────────────────────────────────────────────────────────────────────────
// Eligibility Badge Component
// ─────────────────────────────────────────────────────────────────────────────

export function SurveyEligibilityBadge({ survey }: { survey: Survey }) {
  const { data: thricoData } = getThricoDomain();
  const { data: customData } = getCustomDomain();
  const [copied, setCopied] = React.useState(false);

  const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "thrico.community";

  const domainHost =
    customData?.getCustomDomain?.domain ||
    (thricoData?.getThricoDomain?.domain
      ? `${thricoData.getThricoDomain.domain}.${NEXT_PUBLIC_SITE_URL}`
      : "thrico.network");

  const shortCode = survey.shortCode || survey.slug;
  const fullUrl = shortCode
    ? `https://${domainHost}/open-survey/${shortCode}`
    : null;
  const displayUrl = shortCode
    ? `${domainHost}/open-survey/${shortCode}`
    : null;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (fullUrl) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("Short link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const norm = (
    survey.eligibility?.memberEligibility ||
    survey.eligibilityRule?.memberEligibility ||
    (survey as any).memberEligibility ||
    "ALL"
  ).toUpperCase();

  const config: Record<
    string,
    { label: string; icon: React.ElementType; className: string }
  > = {
    ALL: {
      label: "All Members",
      icon: Users2,
      className: "border-border bg-muted/50 text-foreground/80",
    },
    VERIFIED: {
      label: "Verified Only",
      icon: ShieldCheck,
      className:
        "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
    },
    TIERS: {
      label: "Tier Restricted",
      icon: Layers,
      className:
        "border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-400",
    },
    COMMUNITY: {
      label: "Community",
      icon: Users,
      className:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    },
    SPECIFIC_CUSTOMERS: {
      label: "Specific Users",
      icon: UserCheck,
      className:
        "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    },
    OUTSIDE_PLATFORM: {
      label: "Outside Platform",
      icon: Globe,
      className:
        "border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
    },
  };

  const c = config[norm] || config.ALL;
  const Icon = c.icon;
  const isAnonymous = Boolean(
    survey.eligibility?.acceptAnonymousResponse ??
    survey.eligibilityRule?.acceptAnonymousResponse ??
    (survey as any).acceptAnonymousResponse
  );

  return (
    <div className="flex flex-col gap-0.5 min-w-[130px]">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-semibold w-fit",
            c.className,
          )}
        >
          <Icon className="h-3 w-3 shrink-0" />
          <span>{c.label}</span>
        </span>
        {norm === "OUTSIDE_PLATFORM" && isAnonymous && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            Anon OK
          </span>
        )}
      </div>
      {norm === "OUTSIDE_PLATFORM" && shortCode && (
        <div className="flex items-center gap-1 mt-0.5 group">
          <a
            href={fullUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors truncate max-w-[170px] pl-0.5 flex items-center gap-1"
            title={fullUrl || undefined}
          >
            <span className="truncate">{displayUrl}</span>
            <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </a>
          <button
            type="button"
            onClick={handleCopy}
            title="Copy survey link"
            className="h-4 w-4 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors shrink-0 cursor-pointer"
          >
            {copied ? (
              <Check className="h-2.5 w-2.5 text-emerald-500" />
            ) : (
              <Copy className="h-2.5 w-2.5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export function SurveyPreviewTypeBadge({
  previewType,
}: {
  previewType?: string | null;
}) {
  const isMultiStep = previewType?.toUpperCase() === "MULTI_STEP";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-semibold w-fit",
        isMultiStep
          ? "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-400"
          : "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-400",
      )}
    >
      <Layers className="h-3 w-3 shrink-0" />
      <span>{isMultiStep ? "Multi-Step" : "Scroll Long"}</span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getSurveyTableColumns = (
  singularName: string,
  onEditDetails?: (survey: Survey) => void,
  onDelete?: (id: string) => void,
  onPublish?: (id: string) => void,
  onDraft?: (id: string) => void,
  onShare?: (survey: Survey) => void,
  shareSurveyAsFeed?: boolean,
  refetch?: () => void,
): AdminTableColumn<Survey>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "survey",
    header: singularName,
    cell: (row) => (
      <div className="flex flex-col min-w-[220px]">
        <Link
          href={`/surveys/${row.formId || row.id}`}
          className="text-[12px] font-semibold text-foreground leading-tight truncate max-w-[260px] hover:text-primary hover:underline transition-colors"
          title={row.title}
        >
          {row.title}
        </Link>
        <div className="text-[10px] text-muted-foreground line-clamp-1 max-w-[260px] mt-0.5">
          {row.description || "No description provided"}
        </div>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <AdminStatusBadge status={row.status} />,
  },
  {
    key: "eligibility",
    header: "Eligibility",
    cell: (row) => <SurveyEligibilityBadge survey={row} />,
  },
  {
    key: "previewType",
    header: "View Mode",
    cell: (row) => {
      const type = row.form?.previewType || row.previewType || "SCROLL_LONG";
      return <SurveyPreviewTypeBadge previewType={type} />;
    },
  },
  {
    key: "duration",
    header: "Duration",
    cell: (row) => {
      const startDate = row.startDate;
      const endDate = row.endDate;
      return (
        <div className="flex flex-col text-[11px] font-medium text-muted-foreground gap-0.5 whitespace-nowrap">
          <span>
            Start: {startDate ? format(new Date(startDate), "MMM d, yyyy") : "—"}
          </span>
          <span>
            End: {endDate ? format(new Date(endDate), "MMM d, yyyy") : "—"}
          </span>
        </div>
      );
    },
  },
  {
    key: "created",
    header: "Created",
    cell: (row) => <AdminTableDate date={row.createdAt} />,
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "w-10 text-right",
    className: "text-right",
    isFixedRight: true,
    cell: (row) => (
      <SurveyActions
        survey={row}
        onEditDetails={onEditDetails}
        onDelete={onDelete}
        onPublish={onPublish}
        onDraft={onDraft}
        onShare={onShare}
        shareSurveyAsFeed={shareSurveyAsFeed}
        refetch={refetch}
      />
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface SurveysListProps {
  surveys: Survey[];
  onEditDetails?: (survey: Survey) => void;
  onDelete?: (id: string) => void;
  onPublish?: (id: string) => void;
  onDraft?: (id: string) => void;
  onShare?: (survey: Survey) => void;
  shareSurveyAsFeed?: boolean;
  refetch?: () => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function SurveysList({
  surveys,
  onEditDetails,
  onDelete,
  onPublish,
  onDraft,
  onShare,
  shareSurveyAsFeed,
  refetch,
  visibleColumns,
  offset = 0,
}: SurveysListProps) {
  const moduleName = useModuleStore((state) => state.surveyModuleName);
  const singularName = useModuleStore((state) => state.surveySingularName);

  const baseColumns = React.useMemo(
    () =>
      getSurveyTableColumns(
        singularName,
        onEditDetails,
        onDelete,
        onPublish,
        onDraft,
        onShare,
        shareSurveyAsFeed,
        refetch,
      ),
    [
      singularName,
      onEditDetails,
      onDelete,
      onPublish,
      onDraft,
      onShare,
      shareSurveyAsFeed,
      refetch,
    ],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<Survey>
        columns={activeColumns}
        data={surveys}
        keyExtractor={(s) => s.id}
        emptyIcon={ClipboardList}
        emptyTitle={`No ${moduleName.toLowerCase()} found`}
        emptyDescription="Try adjusting your search or filter criteria."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default SurveysList;
