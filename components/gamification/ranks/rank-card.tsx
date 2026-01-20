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
        "flex items-center gap-4 p-4 border rounded-lg transition-all",
        !rank?.isActive && "opacity-50 bg-muted",
      )}
    >
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          disabled={index === 0}
          onClick={() => onMoveUp(index)}
        >
          <ArrowUp className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          disabled={index === totalRanks - 1}
          onClick={() => onMoveDown(index)}
        >
          <ArrowDown className="h-3 w-3" />
        </Button>
      </div>

      <div
        className="flex items-center justify-center w-12 h-12 text-2xl rounded-lg"
        style={{
          backgroundColor: `${rank?.color}20`,
          border: `1px solid ${rank?.color}40`,
        }}
      >
        {rank?.icon}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{rank?.name}</span>
          <Badge
            variant="outline"
            className="text-xs"
            style={{ borderColor: rank?.color, color: rank?.color }}
          >
            Level {index + 1}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {rank?.minPoints?.toLocaleString()} -{" "}
          {rank?.maxPoints?.toLocaleString()} points
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={rank?.isActive}
          onCheckedChange={handleToggle}
          disabled={toggling}
        />
        <Button variant="ghost" size="icon" onClick={() => onEdit(rank)}>
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
