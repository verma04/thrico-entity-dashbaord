import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { GamificationActivityLogEntry } from "@/graphql/actions/gamification/gamification-quiries";
import { History } from "lucide-react";

interface ActivityLogTableProps {
  logs: GamificationActivityLogEntry[];
  isLoading: boolean;
}

export function ActivityLogTable({ logs, isLoading }: ActivityLogTableProps) {
  const columns: ColumnDef<GamificationActivityLogEntry>[] = [
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-white shadow-sm shrink-0">
              <AvatarImage
                src={`https://cdn.thrico.network/${user.avatar}`}
                alt={user.firstName}
              />
              <AvatarFallback className="text-[10px] bg-primary/5 text-primary">
                {user.firstName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground leading-tight">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                ID: {user.id.substring(0, 8)}...
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Activity Type",
      cell: ({ row }) => (
        <span className="text-xs font-medium text-foreground capitalize">
          {row.original.type.replace(/_/g, " ").toLowerCase()}
        </span>
      ),
    },
    {
      accessorKey: "points",
      header: "Points",
      cell: ({ row }) => {
        const points = row.original.points;
        const isPositive = points > 0;
        return (
          <span
            className={`font-mono text-sm font-bold ${
              isPositive ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {points}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {format(new Date(row.original.createdAt), "MMM d, yyyy · hh:mm a")}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={logs}
      isLoading={isLoading}
      skeletonCount={8}
      rowClassName="h-16"
    />
  );
}
