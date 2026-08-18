"use client";

import React from "react";
import Link from "next/link";
import { Target, Eye, Heart, DollarSign } from "lucide-react";
import { AdminOpportunity } from "@/graphql/actions/opportunities";
import { OpportunityActions } from "./opportunity-actions";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  AdminTableDate,
} from "@/components/shared/admin-table/admin-table";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getOpportunityTableColumns = (
  refetch?: () => void,
): AdminTableColumn<AdminOpportunity>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "opportunity",
    header: "Opportunity",
    cell: (row) => (
      <div className="flex flex-col min-w-[220px]">
        <Link
          href={`/opportunities/${row.id}/manage`}
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
    key: "category",
    header: "Category",
    cell: (row) => (
      <span className="text-[11px] font-medium text-foreground bg-muted/60 border border-border/50 px-2 py-0.5 rounded-md whitespace-nowrap">
        {row.category?.replace(/_/g, " ") || "Opportunity"}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <AdminStatusBadge status={row.status} />,
  },
  {
    key: "engagement",
    header: "Engagement",
    cell: (row) => (
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          <span>{row.viewsCount || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="h-3 w-3" />
          <span>{row.interestedCount || 0}</span>
        </div>
      </div>
    ),
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
    cell: (row) => <OpportunityActions opportunity={row} refetch={refetch} />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface OpportunitiesListProps {
  opportunities: AdminOpportunity[];
  refetch?: () => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function OpportunitiesList({
  opportunities,
  refetch,
  visibleColumns,
  offset = 0,
}: OpportunitiesListProps) {
  const baseColumns = React.useMemo(
    () => getOpportunityTableColumns(refetch),
    [refetch],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<AdminOpportunity>
        columns={activeColumns}
        data={opportunities}
        keyExtractor={(o) => o.id}
        emptyIcon={Target}
        emptyTitle="No opportunities found"
        emptyDescription="Try adjusting your search or filter criteria."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default OpportunitiesList;
