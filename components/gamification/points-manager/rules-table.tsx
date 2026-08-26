"use client";

import React from "react";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableItem,
  AdminTableTag,
  AdminTableMetric,
} from "@/components/shared/admin-table/admin-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Pencil,
  Zap,
  Bell,
  Mail,
  MoreHorizontal,
  Copy,
  Power,
  Sparkles,
  Repeat,
} from "lucide-react";
import { renderModuleIcon } from "@/components/subscription/utils";
import { PointRule, useTogglePointRule } from "@/graphql/actions";
import { toast } from "sonner";
import { PointRuleNotificationModal } from "./point-rule-notification-modal";

interface RulesTableProps {
  rules: PointRule[];
  selectedModule: string | "ALL";
  modules: { id: string; name: string; icon: string; type?: "MODULE" | "INTEGRATION" }[];
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
  const [notificationModalRule, setNotificationModalRule] =
    React.useState<PointRule | null>(null);

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
    return modules.find(
      (m) =>
        m.id?.toLowerCase() === moduleId?.toLowerCase() ||
        (m as any).uuid?.toLowerCase() === moduleId?.toLowerCase() ||
        (m as any).slug?.toLowerCase() === moduleId?.toLowerCase(),
    );
  };

  const columns = [
    {
      key: "module",
      header: "Origin Module",
      cell: (rule: PointRule) => {
        const moduleInfo = getModuleInfo(rule.module);
        return (
          <AdminTableItem
            icon={renderModuleIcon(
              moduleInfo?.icon || "Settings",
              "h-3.5 w-3.5 text-foreground",
            )}
            title={moduleInfo?.name || rule.module}
            subtitle={
              rule.trigger === "FIRST_TIME" ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  <Sparkles className="h-2.5 w-2.5" /> One-Time Milestone
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-600 dark:text-sky-400">
                  <Repeat className="h-2.5 w-2.5" /> Recurring Rule
                </span>
              )
            }
          />
        );
      },
    },
    {
      key: "cadence",
      header: "Cadence",
      cell: (rule: PointRule) => {
        const isFirstTime = rule.trigger === "FIRST_TIME";
        return isFirstTime ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 whitespace-nowrap shadow-2xs">
            <Sparkles className="h-2.5 w-2.5 text-amber-500 fill-amber-500/20" />
            One-Time
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 whitespace-nowrap shadow-2xs">
            <Repeat className="h-2.5 w-2.5 text-sky-500" />
            Recurring
          </span>
        );
      },
    },
    {
      key: "source",
      header: "Source",
      cell: (rule: PointRule) => {
        const moduleInfo = getModuleInfo(rule.module);
        const source = rule.source || moduleInfo?.type || "MODULE";
        const isIntegration = source === "INTEGRATION";
        return (
          <AdminTableTag variant={isIntegration ? "purple" : "indigo"}>
            {isIntegration ? "Integration" : "Module"}
          </AdminTableTag>
        );
      },
    },
    {
      key: "action",
      header: "Trigger Event",
      className: "min-w-[180px] max-w-[300px]",
      cell: (rule: PointRule) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground capitalize">
            <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="truncate">
              {rule.action.replace(/_/g, " ").toLowerCase()}
            </span>
          </div>
          {rule.description ? (
            <p
              className="text-[11px] text-muted-foreground line-clamp-1 pl-5"
              title={rule.description}
            >
              {rule.description}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      key: "points",
      header: "Yield",
      cell: (rule: PointRule) => (
        <AdminTableMetric
          value={`+${rule.points.toLocaleString()}`}
          unit="PTS"
          variant="indigo"
        />
      ),
    },
    {
      key: "eligibility",
      header: "Eligibility",
      cell: (rule: PointRule) => (
        <AdminTableTag variant="zinc">
          {rule.memberEligibility || "ALL"}
        </AdminTableTag>
      ),
    },
    {
      key: "dailyCap",
      header: "Daily",
      cell: (rule: PointRule) => {
        if (rule.trigger === "FIRST_TIME") {
          return (
            <span className="text-[12px] text-muted-foreground font-medium">
              —
            </span>
          );
        }
        return (
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-foreground">
              {rule.dailyCap ? `${rule.dailyCap}x` : "∞"}
            </span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">
              Limit
            </span>
          </div>
        );
      },
    },
    {
      key: "weeklyCap",
      header: "Weekly",
      cell: (rule: PointRule) => {
        if (rule.trigger === "FIRST_TIME") {
          return (
            <span className="text-[12px] text-muted-foreground font-medium">
              —
            </span>
          );
        }
        return (
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-foreground">
              {rule.weeklyCap ? `${rule.weeklyCap}x` : "∞"}
            </span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">
              Limit
            </span>
          </div>
        );
      },
    },
    {
      key: "monthlyCap",
      header: "Monthly",
      cell: (rule: PointRule) => {
        if (rule.trigger === "FIRST_TIME") {
          return (
            <span className="text-[12px] text-muted-foreground font-medium">
              —
            </span>
          );
        }
        return (
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-foreground">
              {rule.monthlyCap ? `${rule.monthlyCap}x` : "∞"}
            </span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">
              Limit
            </span>
          </div>
        );
      },
    },
    {
      key: "notifications",
      header: "Alerts",
      cell: (rule: PointRule) => {
        const hasPush = rule.allowPushNotification !== false;
        const hasEmail = rule.allowEmailNotification !== false;

        return (
          <div className="flex items-center gap-1.5">
            <div
              title={hasPush ? "Push Notification Enabled" : "Push Notification Muted"}
              className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors",
                hasPush
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700"
                  : "bg-transparent text-zinc-400 dark:text-zinc-600 border-transparent opacity-40",
              )}
            >
              <Bell className="h-3 w-3" />
              <span>Push</span>
            </div>
            <div
              title={hasEmail ? "Email Notification Enabled" : "Email Notification Muted"}
              className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors",
                hasEmail
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700"
                  : "bg-transparent text-zinc-400 dark:text-zinc-600 border-transparent opacity-40",
              )}
            >
              <Mail className="h-3 w-3" />
              <span>Email</span>
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (rule: PointRule) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={rule.isActive}
            onCheckedChange={() => handleToggleActive(rule.id)}
            disabled={toggling}
            className="scale-75 data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
          />
          <AdminStatusBadge status={rule.isActive ? "APPROVED" : "DISABLED"}>
            {rule.isActive ? "Active" : "Disabled"}
          </AdminStatusBadge>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Action",
      headerClassName: "w-12 text-right",
      className: "text-right",
      cell: (rule: PointRule) => (
        <div className="flex justify-end items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
                <span className="sr-only">Open actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-xs font-semibold text-foreground border-b border-border/50 truncate capitalize">
                {rule.action.replace(/_/g, " ").toLowerCase()}
              </div>
              <DropdownMenuItem
                className="cursor-pointer text-xs py-1.5"
                onClick={() => onEdit(rule)}
              >
                <Pencil className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span>Edit Rule</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-xs py-1.5"
                onClick={() => setNotificationModalRule(rule)}
              >
                <Bell className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span>Edit Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-xs py-1.5"
                onClick={() => handleToggleActive(rule.id)}
              >
                <Power
                  className={cn(
                    "h-3.5 w-3.5 mr-2",
                    rule.isActive ? "text-amber-500" : "text-emerald-500",
                  )}
                />
                <span>{rule.isActive ? "Disable Rule" : "Activate Rule"}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-xs py-1.5"
                onClick={() => {
                  navigator.clipboard.writeText(rule.id);
                  toast.success("Rule ID copied to clipboard");
                }}
              >
                <Copy className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span>Copy Rule ID</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminTable
        columns={columns}
        data={rules || []}
        loading={isLoading}
        keyExtractor={(rule) => rule.id}
        emptyTitle="No scoring rules found"
        emptyDescription="Create a reward rule to start incentivizing engagement across the ecosystem."
        size="sm"
      />

      <PointRuleNotificationModal
        rule={notificationModalRule}
        open={!!notificationModalRule}
        onOpenChange={(open) => !open && setNotificationModalRule(null)}
        onSuccess={() => {
          refetchRules();
          refetchStats();
        }}
      />
    </>
  );
}
