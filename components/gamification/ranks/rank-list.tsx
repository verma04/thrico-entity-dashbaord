"use client";

import React from "react";
import {
  AdminTable,
  AdminStatusBadge,
} from "@/components/shared/admin-table/admin-table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, ArrowUp, ArrowDown, Crown, TrendingUp } from "lucide-react";
import { Rank, useToggleRank } from "@/graphql/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RankListProps {
  ranks: Rank[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onEdit: (rank: Rank) => void;
  refetch: () => void;
  isLoading?: boolean;
}

export function RankList({
  ranks,
  onMoveUp,
  onMoveDown,
  onEdit,
  refetch,
  isLoading,
}: RankListProps) {
  const [toggleRank, { loading: toggling }] = useToggleRank({
    onCompleted: () => {
      refetch();
      toast.success("Rank status updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const sortedRanks = [...ranks].sort((a, b) => a.order - b.order);

  const handleToggle = async (id: string) => {
    await toggleRank({ variables: { id } });
  };

  const columns = [
    {
      key: "order",
      header: "Hierarchy",
      headerClassName: "w-[80px]",
      cell: (rank: Rank, index: number) => (
        <div className="flex flex-col gap-0.5 items-center">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 rounded text-muted-foreground hover:text-foreground hover:bg-muted",
              index === 0 && "opacity-20 pointer-events-none",
            )}
            onClick={() => onMoveUp(index)}
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 rounded text-muted-foreground hover:text-foreground hover:bg-muted",
              index === sortedRanks.length - 1 &&
                "opacity-20 pointer-events-none",
            )}
            onClick={() => onMoveDown(index)}
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
    {
      key: "rank",
      header: "Rank Identity",
      cell: (rank: Rank, index: number) => (
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 text-xl flex items-center justify-center rounded-xl border shadow-sm shrink-0"
            style={{
              backgroundColor: `${rank.color}12`,
              borderColor: `${rank.color}25`,
            }}
          >
            <span>{rank.icon}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">
              {rank.name}
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-muted rounded border border-border"
                style={{ color: rank.color, borderColor: `${rank.color}30` }}
              >
                Tier {index + 1}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "range",
      header: "Point Threshold",
      cell: (rank: Rank) => (
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-muted flex items-center justify-center">
            <TrendingUp className="h-2.5 w-2.5 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[12px] font-bold text-foreground">
            <span>{rank?.minPoints?.toLocaleString()}</span>
            <span className="text-muted-foreground opacity-40">—</span>
            <span>{rank?.maxPoints?.toLocaleString()}</span>
            <span className="text-[9px] text-zinc-400 font-black tracking-tighter uppercase">
              PTS
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Participation",
      cell: (rank: Rank) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={rank.isActive}
            onCheckedChange={() => handleToggle(rank.id)}
            disabled={toggling}
            className="scale-90 data-[state=checked]:bg-emerald-500"
          />
          <AdminStatusBadge status={rank.isActive ? "APPROVED" : "PENDING"}>
            {rank.isActive ? "Unlocked" : "Hidden"}
          </AdminStatusBadge>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[50px]",
      cell: (rank: Rank) => (
        <div className="flex justify-end pr-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground transition-all rounded-lg"
            onClick={() => onEdit(rank)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={sortedRanks || []}
      loading={isLoading}
      keyExtractor={(rank) => rank.id}
      emptyTitle="No levels defined"
      emptyDescription="Create community ranks to provide clear progression paths for your members."
    />
  );
}
