"use client";

import React from "react";
import { AdminTable, AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Zap } from "lucide-react";
import { renderModuleIcon } from "@/components/subscription/utils";
import { PointRule, useTogglePointRule } from "@/graphql/actions";
import { toast } from "sonner";

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
      toast.success("Rule status updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleToggleActive = async (id: string) => {
    await togglePointRule({
      variables: { id },
    });
  };

  const getModuleInfo = (moduleId: string) => {
    return modules.find((m) => m.id === moduleId);
  };

  const columns = [
    {
      key: "module",
      header: "Origin Module",
      cell: (rule: PointRule) => {
        const moduleInfo = getModuleInfo(rule.module);
        return (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
              {renderModuleIcon(
                moduleInfo?.icon || "Settings",
                "h-4 w-4 text-zinc-900 dark:text-zinc-100",
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {moduleInfo?.name || rule.module}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-tighter font-bold">
                Level {rule.trigger === "FIRST_TIME" ? "One-Off" : "Recurring"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "action",
      header: "Trigger Event",
      cell: (rule: PointRule) => (
        <div className="flex items-center gap-2">
           <Zap className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 opacity-70" />
           <span className="text-sm font-medium text-foreground capitalize">
             {rule.action.replace(/_/g, " ").toLowerCase()}
           </span>
        </div>
      ),
    },
    {
      key: "points",
      header: "Yield",
      cell: (rule: PointRule) => (
        <div className="flex items-center gap-1.5">
           <span className="font-mono text-[13px] font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 shadow-sm">
             +{rule.points.toLocaleString()}
           </span>
           <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">PTS</span>
        </div>
      ),
    },
    {
      key: "dailyCap",
      header: "Daily",
      cell: (rule: PointRule) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-foreground">
            {rule.dailyCap ? `${rule.dailyCap}x` : "∞"}
          </span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Limit</span>
        </div>
      ),
    },
    {
      key: "weeklyCap",
      header: "Weekly",
      cell: (rule: PointRule) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-foreground">
            {rule.weeklyCap ? `${rule.weeklyCap}x` : "∞"}
          </span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Limit</span>
        </div>
      ),
    },
    {
      key: "monthlyCap",
      header: "Monthly",
      cell: (rule: PointRule) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-foreground">
            {rule.monthlyCap ? `${rule.monthlyCap}x` : "∞"}
          </span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Limit</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (rule: PointRule) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={rule.isActive}
            onCheckedChange={() => handleToggleActive(rule.id)}
            disabled={toggling}
            className="scale-90 data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
          />
          <AdminStatusBadge status={rule.isActive ? "APPROVED" : "PENDING"}>
             {rule.isActive ? "Active" : "Disabled"}
          </AdminStatusBadge>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[50px]",
      cell: (rule: PointRule) => (
        <div className="flex justify-end pr-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted transition-all rounded-lg"
            onClick={() => onEdit(rule)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={rules || []}
      loading={isLoading}
      keyExtractor={(rule) => rule.id}
      emptyTitle="No scoring rules found"
      emptyDescription="Create a reward rule to start incentivizing engagement across the ecosystem."
    />
  );
}
