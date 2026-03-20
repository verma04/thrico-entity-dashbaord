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
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

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
      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="rounded-xl border border-border/50 bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-bold text-slate-700 h-14">
                  Badge
                </TableHead>
                <TableHead className="font-bold text-slate-700 h-14">
                  Module
                </TableHead>
                <TableHead className="font-bold text-slate-700 h-14">
                  Type
                </TableHead>
                <TableHead className="font-bold text-slate-700 h-14">
                  Criteria
                </TableHead>
                <TableHead className="font-bold text-slate-700 h-14">
                  Status
                </TableHead>
                <TableHead className="text-right font-bold text-slate-700 h-14">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i} className="h-20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-xl" />
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
        </div>
      </EcosystemContainer>
    );
  }

  if (badges.length === 0) {
    return (
      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="rounded-xl border border-border/50 bg-white shadow-sm p-12 text-center">
          <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
          <p className="text-slate-500 font-medium">
            No badges found. Create your first badge!
          </p>
        </div>
      </EcosystemContainer>
    );
  }

  return (
    <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
      <div className="rounded-xl border border-border/50 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="font-bold text-slate-700 h-14">
                Badge
              </TableHead>
              <TableHead className="font-bold text-slate-700 h-14">
                Module
              </TableHead>
              <TableHead className="font-bold text-slate-700 h-14">
                Type
              </TableHead>
              <TableHead className="font-bold text-slate-700 h-14">
                Criteria
              </TableHead>
              <TableHead className="font-bold text-slate-700 h-14">
                Status
              </TableHead>
              <TableHead className="text-right font-bold text-slate-700 h-14">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {badges.map((badge) => {
              const moduleInfo = getModuleInfo(badge.module);
              return (
                <TableRow key={badge.id} className="h-20 hover:bg-slate-50/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-sm">
                        {badge.icon}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {badge.name}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">
                          {badge.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {moduleInfo ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg w-fit">
                        {renderModuleIcon(moduleInfo.icon || "Settings")}
                        <span className="text-xs font-bold text-slate-700">
                          {moduleInfo.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg w-fit">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        <span className="text-xs font-bold text-indigo-700">
                          Global
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <UIBadge
                      variant="outline"
                      className="rounded-lg font-bold text-[10px] uppercase tracking-wider py-1 border-slate-200"
                    >
                      {badge.type}
                    </UIBadge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                      {badge.type === "ACTION" ? (
                        <div className="flex items-center gap-1.5">
                          <span className="capitalize">
                            {badge.condition?.action ||
                              badge.action?.replace(/_/g, " ")}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-400 font-bold">
                            {badge.condition?.count || badge.targetValue}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-indigo-600">
                            {badge.condition?.pointsRequired ||
                              badge.targetValue}
                          </span>
                          <span className="text-[10px] items-center text-slate-400 uppercase tracking-widest font-bold">
                            pts
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={badge.isActive}
                      onCheckedChange={() => handleToggleActive(badge.id)}
                      disabled={toggling}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
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
      </div>
    </EcosystemContainer>
  );
}
