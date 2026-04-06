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
        "group flex items-center gap-4 p-4 border border-border bg-card rounded-xl transition-all duration-200 hover:shadow-sm",
        !rank?.isActive && "opacity-55 bg-muted/30",
      )}
    >
      {/* Reorder Controls */}
      <div className="flex flex-col gap-0.5 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground",
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
            "h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground",
            index === totalRanks - 1 && "opacity-20 pointer-events-none",
          )}
          onClick={() => onMoveDown(index)}
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Rank Icon */}
      <div
        className="flex items-center justify-center w-11 h-11 text-xl rounded-xl border shrink-0"
        style={{
          backgroundColor: `${rank?.color}12`,
          borderColor: `${rank?.color}25`,
        }}
      >
        <span>{rank?.icon}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">{rank?.name}</span>
          <Badge
            variant="outline"
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
            style={{ borderColor: `${rank?.color}40`, color: rank?.color }}
          >
            Tier {index + 1}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {rank?.minPoints?.toLocaleString()} – {rank?.maxPoints?.toLocaleString()} pts
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[10px] font-medium text-muted-foreground">
            {rank?.isActive ? "Active" : "Inactive"}
          </span>
          <Switch
            checked={rank?.isActive}
            onCheckedChange={handleToggle}
            disabled={toggling}
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>
        <div className="w-px h-8 bg-border" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onEdit(rank)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
