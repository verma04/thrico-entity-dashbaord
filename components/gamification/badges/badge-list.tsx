import React from "react";
import { Award, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { renderModuleIcon } from "@/components/subscription/utils";
import { Badge, useToggleBadge } from "@/graphql/actions";
import { ConfirmDialog } from "@/components/pages/confirm-dialog";

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
    onCompleted: () => {
      refetchBadges();
    },
  });

  const handleToggleActive = async (id: string) => {
    try {
      await toggleBadge({
        variables: { id },
      });
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
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-12 ml-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  if (badges.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            No badges found. Create your first badge!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Badges</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Badge</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Criteria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {badges.map((badge) => {
              const moduleInfo = getModuleInfo(badge.module);
              return (
                <TableRow key={badge.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <div className="font-medium">{badge.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {badge.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {moduleInfo ? (
                      <span className="flex items-center gap-2">
                        {renderModuleIcon(moduleInfo.icon || "Settings")}
                        {moduleInfo.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Global</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <UIBadge variant="outline">{badge.type}</UIBadge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {badge.type === "ACTION" ? (
                        <span>
                          {badge.condition?.action || badge.action}{" "}
                          <span className="text-muted-foreground">
                            ({badge.condition?.count || badge.targetValue})
                          </span>
                        </span>
                      ) : (
                        <span>
                          {badge.condition?.pointsRequired || badge.targetValue}{" "}
                          points
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={badge.isActive}
                      onCheckedChange={() => handleToggleActive(badge.id)}
                      disabled={toggling}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(badge)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
