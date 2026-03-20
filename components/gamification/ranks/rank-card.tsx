import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Rank, useToggleRank } from "@/graphql/actions";

interface RankCardProps {
  rank: Rank;
  index: number;
  totalRanks: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onEdit: (rank: Rank) => void;
  refetch: () => void;
}

export function RankCard({
  rank,
  index,
  totalRanks,
  onMoveUp,
  onMoveDown,
  onEdit,
  refetch,
}: RankCardProps) {
  const [toggleRank, { loading: toggling }] = useToggleRank({
    onCompleted: () => refetch(),
  });

  const handleToggle = async () => {
    try {
      await toggleRank({ variables: { id: rank?.id } });
    } catch (err) {
      console.error("Failed to toggle rank:", err);
    }
  };
  return (
    <div
      className={cn(
        "group flex items-center gap-6 p-6 border border-slate-200/60 bg-white rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100/80 hover:-translate-y-0.5",
        !rank?.isActive && "opacity-60 bg-slate-50 border-dashed"
      )}
    >
      <div className="flex flex-col gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-lg transition-colors hover:bg-slate-100",
            index === 0 && "opacity-20 pointer-events-none"
          )}
          onClick={() => onMoveUp(index)}
        >
          <ArrowUp className="h-4 w-4 text-slate-500" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-lg transition-colors hover:bg-slate-100",
            index === totalRanks - 1 && "opacity-20 pointer-events-none"
          )}
          onClick={() => onMoveDown(index)}
        >
          <ArrowDown className="h-4 w-4 text-slate-500" />
        </Button>
      </div>

      <div
        className="flex items-center justify-center w-16 h-16 text-3xl rounded-2xl shadow-sm border"
        style={{
          backgroundColor: `${rank?.color}10`,
          borderColor: `${rank?.color}25`,
          color: rank?.color
        }}
      >
        <span className="drop-shadow-sm">{rank?.icon}</span>
      </div>

      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-900 text-lg tracking-tight">
            {rank?.name}
          </span>
          <Badge
            variant="outline"
            className="rounded-lg font-bold text-[10px] uppercase tracking-wider py-1 border-slate-200/60 bg-slate-50/50"
            style={{ borderColor: `${rank?.color}40`, color: rank?.color }}
          >
            Tier {index + 1}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/40">
            <span className="h-1 w-1 rounded-full bg-slate-400" />
            {rank?.minPoints?.toLocaleString()} - {rank?.maxPoints?.toLocaleString()} points
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {rank?.isActive ? "Live" : "Inactive"}
          </span>
          <Switch
            checked={rank?.isActive}
            onCheckedChange={handleToggle}
            disabled={toggling}
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>
        <div className="h-10 w-px bg-slate-100" />
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100"
          onClick={() => onEdit(rank)}
        >
          <Pencil className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
