import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LeaderboardEntry } from "@/graphql/actions";
import { Medal, Award } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

export function LeaderboardTable({
  entries,
  isLoading,
}: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return (
          <span className="text-lg font-bold text-muted-foreground w-6 text-center">
            {rank}
          </span>
        );
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/5 border-yellow-500/10";
      case 2:
        return "bg-gray-500/5 border-gray-500/10";
      case 3:
        return "bg-amber-500/5 border-amber-500/10";
      default:
        return "";
    }
  };

  const columns: ColumnDef<LeaderboardEntry>[] = [
    {
      accessorKey: "rank",
      header: () => <div className="text-center">Rank</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          {getRankIcon(row.original.rank)}
        </div>
      ),
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.original?.user;
        return (
          <Link
            href={`/members/${user?.id}`}
            className="flex items-center gap-3 hover:underline underline-offset-4 decoration-primary/30"
          >
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage
                src={`https://cdn.thrico.network/${user?.avatar}`}
                alt={user?.firstName}
              />
              <AvatarFallback className="bg-primary/5 text-primary text-xs">
                {user?.firstName?.substring(0, 2)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-foreground">
              {user?.firstName} {user?.lastName}
            </span>
          </Link>
        );
      },
    },
    {
      id: "currentRank",
      header: "Current Rank",
      cell: ({ row }) => {
        const entry = row.original;
        return (
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shadow-sm border transition-transform duration-300 group-hover:scale-110"
              style={{
                backgroundColor: `${entry?.currentRank?.color}15`,
                borderColor: `${entry?.currentRank?.color}30`,
              }}
            >
              <span
                className="text-xl"
                role="img"
                aria-label={entry?.currentRank?.name}
              >
                {entry?.currentRank?.icon || "⭐"}
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="text-sm font-bold tracking-tight uppercase"
                style={{ color: entry?.currentRank?.color }}
              >
                {entry?.currentRank?.name}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-none">
                Tier Status
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "badgesCount",
      header: () => <div className="text-right">Badges</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1.5 text-right font-mono text-muted-foreground">
          <Award className="h-4 w-4 text-purple-500" />
          {row.original?.badgesCount}
        </div>
      ),
    },
    {
      accessorKey: "totalPoints",
      header: () => <div className="text-right">Total Points</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Badge
            variant="secondary"
            className="font-mono text-sm bg-primary/5 text-primary border-primary/10"
          >
            {row.original?.totalPoints.toLocaleString()} pts
          </Badge>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={entries}
      isLoading={isLoading}
      rowClassName={(row) => getRankBg(row.rank)}
    />
  );
}
