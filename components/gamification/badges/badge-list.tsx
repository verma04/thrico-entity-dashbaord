import React from "react";
import { Award, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { renderModuleIcon } from "@/components/subscription/utils";
import { Badge, useToggleBadge } from "@/graphql/actions";

interface BadgeListProps {
  badges: Badge[];
  modules: { id: string; name: string; icon: string }[];
  onEdit: (badge: Badge) => void;
  refetchBadges: () => void;
  isLoading?: boolean;
}

export function BadgeList({
  badges,
  modules,
  onEdit,
  isLoading,
  refetchBadges,
}: BadgeListProps) {
  const [toggleBadge, { loading: toggling }] = useToggleBadge({
    onCompleted: () => refetchBadges(),
  });

  const handleToggleActive = async (id: string) => {
    try {
      await toggleBadge({ variables: { id } });
    } catch (error) {
      console.error("Error toggling badge status:", error);
    }
  };

  const getModuleInfo = (moduleId?: string) => {
    if (!moduleId) return null;
    return modules.find((m) => m.id === moduleId);
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="h-11 text-xs font-semibold">Badge</TableHead>
              <TableHead className="h-11 text-xs font-semibold">Module</TableHead>
              <TableHead className="h-11 text-xs font-semibold">Type</TableHead>
              <TableHead className="h-11 text-xs font-semibold">Criteria</TableHead>
              <TableHead className="h-11 text-xs font-semibold">Status</TableHead>
              <TableHead className="h-11 text-xs font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="h-16">
                <TableCell><div className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-lg" /><Skeleton className="h-4 w-28" /></div></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-5 w-14 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-10 rounded-full" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-border bg-muted/30">
        <Award className="h-8 w-8 text-muted-foreground/30 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">No badges yet</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Create your first badge to reward members</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="h-11 text-xs font-semibold">Badge</TableHead>
            <TableHead className="h-11 text-xs font-semibold">Module</TableHead>
            <TableHead className="h-11 text-xs font-semibold">Type</TableHead>
            <TableHead className="h-11 text-xs font-semibold">Criteria</TableHead>
            <TableHead className="h-11 text-xs font-semibold">Status</TableHead>
            <TableHead className="h-11 text-xs font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {badges.map((badge) => {
            const moduleInfo = getModuleInfo(badge.module);
            return (
              <TableRow key={badge.id} className="group h-16">
                {/* Badge */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted border border-border flex items-center justify-center text-lg shrink-0">
                      {badge.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{badge.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 max-w-[180px]">{badge.description}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Module */}
                <TableCell>
                  {moduleInfo ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-muted border border-border rounded-md w-fit text-xs font-medium text-foreground">
                      {renderModuleIcon(moduleInfo.icon || "Settings")}
                      {moduleInfo.name}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-100 rounded-md w-fit text-xs font-medium text-blue-700">
                      Global
                    </div>
                  )}
                </TableCell>

                {/* Type */}
                <TableCell>
                  <UIBadge variant="outline" className="text-[10px] font-medium capitalize">
                    {badge.type === "ACTION" ? "Action" : "Points"}
                  </UIBadge>
                </TableCell>

                {/* Criteria */}
                <TableCell>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md border border-border">
                    {badge.type === "ACTION" ? (
                      <>
                        {(badge.condition?.action || badge.action || "").replace(/_/g, " ")}
                        {" × "}
                        {badge.condition?.count || badge.targetValue}
                      </>
                    ) : (
                      <>{(badge.condition?.pointsRequired || badge.targetValue)?.toLocaleString()} pts</>
                    )}
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Switch
                    checked={badge.isActive}
                    onCheckedChange={() => handleToggleActive(badge.id)}
                    disabled={toggling}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onEdit(badge)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
