import { Badge as UiBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "../ts-types";

interface BadgeCardProps {
  badge: Badge;
  onEdit: (badge: Badge) => void;
  onDelete: (id: string) => void;
}

export function BadgeCard({ badge, onEdit, onDelete }: BadgeCardProps) {
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
              {badge?.type === "ACTION" && badge?.criteria?.count && (
                <span className="text-xs text-muted-foreground">
                  {badge?.criteria?.action} × {badge?.criteria?.count}
                </span>
              )}
              {badge?.type === "POINTS" && badge?.criteria?.pointsRequired && (
                <span className="text-xs text-muted-foreground">
                  {badge?.criteria?.pointsRequired?.toLocaleString()} pts
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(badge)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={() => onDelete(badge?.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
