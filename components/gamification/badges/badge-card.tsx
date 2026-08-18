import { Badge as UiBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

interface BadgeCardProps {
  badge: any;
  onEdit: (badge: any) => void;
  onDelete?: (id: string) => void;
}

export function BadgeCard({ badge, onEdit, onDelete }: BadgeCardProps) {
  const criteria = badge?.condition || badge?.criteria;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all",
        !badge?.isActive && "opacity-50"
      )}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{badge?.icon}</div>
          <div className="flex-1">
            <h3 className="font-semibold">{badge?.name}</h3>
            <p className="text-sm text-muted-foreground">
              {badge?.description}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <UiBadge
                variant={badge?.type === "ACTION" ? "default" : "secondary"}
              >
                {badge?.type === "ACTION" ? "Action" : "Points"}
              </UiBadge>
              {badge?.type === "ACTION" && (criteria?.count || badge?.targetValue) && (
                <span className="text-xs text-muted-foreground">
                  {(criteria?.action || badge?.action || "Action").replace(/_/g, " ")} × {criteria?.count || badge?.targetValue || 1}
                </span>
              )}
              {badge?.type === "POINTS" && (criteria?.pointsRequired || badge?.targetValue) && (
                <span className="text-xs text-muted-foreground">
                  {(criteria?.pointsRequired || badge?.targetValue)?.toLocaleString()} pts
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(badge)}>
              <Pencil className="h-4 w-4" />
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500"
                onClick={() => onDelete(badge?.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
