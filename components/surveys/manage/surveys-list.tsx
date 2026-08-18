"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ClipboardList } from "lucide-react";
import { Survey } from "@/graphql/surveys/survey-queries";
import { SurveyActions } from "./survey-actions";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  AdminTableDate,
} from "@/components/shared/admin-table/admin-table";
import { useModuleStore } from "@/store/useModuleStore";

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
