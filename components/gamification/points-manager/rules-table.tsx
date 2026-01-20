"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil } from "lucide-react";
import { renderModuleIcon } from "@/components/subscription/utils";
import { PointRule, useTogglePointRule } from "@/graphql/actions";

interface RulesTableProps {
  rules: PointRule[];
  selectedModule: string | "ALL";
  modules: { id: string; name: string; icon: string }[];
  onEdit: (rule: PointRule) => void;
  refetchRules: () => void;
  refetchStats: () => void;
  isLoading?: boolean;
}

export function RulesTable({
  rules,
  selectedModule,
  modules,
  onEdit,
  isLoading,
  refetchRules,
  refetchStats,
}: RulesTableProps) {
  const [togglePointRule, { loading: toggling }] = useTogglePointRule({
    onCompleted: () => {
      refetchRules();
      refetchStats();
    },
  });

  const handleToggleActive = async (id: string) => {
    try {
      await togglePointRule({
        variables: { id },
      });
    } catch (error) {
      console.error("Error toggling point rule active status:", error);
    }
  };

  const getModuleInfo = (moduleId: string) => {
    return modules.find((m) => m.id === moduleId);
  };

  const columns: ColumnDef<PointRule>[] = [
    {
      accessorKey: "module",
      header: "Module",
      cell: ({ row }) => {
        const moduleInfo = getModuleInfo(row.original.module);
        return (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
              {renderModuleIcon(
                moduleInfo?.icon || "Settings",
                "h-4 w-4 text-primary",
              )}
            </div>
            <span className="text-sm font-medium text-foreground">
              {moduleInfo?.name || row.original.module}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <span className="font-bold text-foreground capitalize">
          {row.original.action.replace(/_/g, " ").toLowerCase()}
        </span>
      ),
    },
    {
      accessorKey: "trigger",
      header: "Type",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.trigger === "FIRST_TIME" ? "default" : "outline"
          }
          className="text-[10px] uppercase font-bold"
        >
          {row.original.trigger === "FIRST_TIME" ? "First Time" : "Recurring"}
        </Badge>
      ),
    },
    {
      accessorKey: "points",
      header: () => <div className="text-center">Points</div>,
      cell: ({ row }) => (
        <div className="text-center font-bold text-primary font-mono">
          +{row.original.points}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Switch
          checked={row.original.isActive}
          onCheckedChange={() => handleToggleActive(row.original.id)}
          disabled={toggling}
          className="scale-90"
        />
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rules}
      isLoading={isLoading}
      skeletonCount={6}
      rowClassName="h-16"
    />
  );
}
