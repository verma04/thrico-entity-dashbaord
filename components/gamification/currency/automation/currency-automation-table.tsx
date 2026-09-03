"use client";

import React from "react";
import {
  AdminTable,
  AdminTableColumn,
  AdminTableTag,
  AdminStatusBadge,
} from "@/components/shared/admin-table/admin-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  CurrencyAutomationRule,
  CurrencyRuleTrigger,
  AnyGamificationActionType,
} from "@/graphql/gamification-automation";
import {
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Coins,
  ArrowRightLeft,
  Gift,
  Award,
  Mail,
  Bell,
  Users,
  Tag,
  Medal,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrencyAutomationTableProps {
  rules: CurrencyAutomationRule[];
  onToggleStatus: (id: string, active: boolean) => Promise<void>;
  onEdit: (rule: CurrencyAutomationRule) => void;
  onDuplicate: (rule: CurrencyAutomationRule) => void;
  onDelete: (rule: CurrencyAutomationRule) => void;
  onMovePriority?: (index: number, direction: "up" | "down") => void;
  loading?: boolean;
}

export const CurrencyAutomationTable: React.FC<
  CurrencyAutomationTableProps
> = ({
  rules,
  onToggleStatus,
  onEdit,
  onDuplicate,
  onDelete,
  onMovePriority,
  loading = false,
}) => {
  const [togglingId, setTogglingId] = React.useState<string | null>(null);

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id);
    try {
      await onToggleStatus(id, !current);
    } finally {
      setTogglingId(null);
    }
  };

  const getTriggerTag = (trigger: CurrencyRuleTrigger) => {
    switch (trigger) {
      case "EC_EARNED":
        return {
          label: "EC Earned",
          icon: Coins,
          variant: "yellow" as const,
        };
      case "TC_COINS_EARNED":
        return {
          label: "TC Coins Earned",
          icon: Coins,
          variant: "amber" as const,
        };
      case "CURRENCY_THRESHOLD_REACHED":
        return {
          label: "Balance Milestone",
          icon: Sparkles,
          variant: "indigo" as const,
        };
      case "CURRENCY_CONVERTED":
        return {
          label: "Currency Converted",
          icon: ArrowRightLeft,
          variant: "sky" as const,
        };
      case "REDEMPTION_COMPLETED":
        return {
          label: "Redemption Completed",
          icon: Gift,
          variant: "emerald" as const,
        };
      case "DAILY_CONVERSION_CAP_REACHED":
        return {
          label: "Daily Cap Hit",
          icon: ArrowRightLeft,
          variant: "rose" as const,
        };
      default:
        return {
          label: trigger,
          icon: Coins,
          variant: "default" as const,
        };
    }
  };

  const renderActionBadge = (type: AnyGamificationActionType, idx: number) => {
    switch (type) {
      case "AWARD_CURRENCY":
        return (
          <Badge
            key={idx}
            variant="outline"
            className="text-[10px] bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20 gap-1 font-semibold"
          >
            <Coins className="w-2.5 h-2.5 text-yellow-600" />
            Currency
          </Badge>
        );
      case "ASSIGN_MEMBERSHIP_TIER":
        return (
          <Badge
            key={idx}
            variant="outline"
            className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1 font-semibold"
          >
            <Award className="w-2.5 h-2.5 text-amber-500" />
            Tier
          </Badge>
        );
      case "EMAIL":
        return (
          <Badge
            key={idx}
            variant="outline"
            className="text-[10px] bg-violet-500/10 text-violet-600 border-violet-500/20 gap-1 font-semibold"
          >
            <Mail className="w-2.5 h-2.5 text-violet-500" />
            Email
          </Badge>
        );
      case "NOTIFICATION":
        return (
          <Badge
            key={idx}
            variant="outline"
            className="text-[10px] bg-sky-500/10 text-sky-600 border-sky-500/20 gap-1 font-semibold"
          >
            <Bell className="w-2.5 h-2.5 text-sky-500" />
            Push
          </Badge>
        );
      case "COMMUNITY_JOIN":
        return (
          <Badge
            key={idx}
            variant="outline"
            className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/20 gap-1 font-semibold"
          >
            <Users className="w-2.5 h-2.5 text-blue-500" />
            Circle
          </Badge>
        );
      case "ADD_MEMBER_TAG":
        return (
          <Badge
            key={idx}
            variant="outline"
            className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1 font-semibold"
          >
            <Tag className="w-2.5 h-2.5 text-emerald-500" />
            Tag
          </Badge>
        );
      case "AWARD_POINTS":
        return (
          <Badge
            key={idx}
            variant="outline"
            className="text-[10px] bg-orange-500/10 text-orange-600 border-orange-500/20 gap-1 font-semibold"
          >
            <Coins className="w-2.5 h-2.5 text-orange-500" />
            Points
          </Badge>
        );
      case "AWARD_BADGE":
        return (
          <Badge
            key={idx}
            variant="outline"
            className="text-[10px] bg-rose-500/10 text-rose-600 border-rose-500/20 gap-1 font-semibold"
          >
            <Medal className="w-2.5 h-2.5 text-rose-500" />
            Badge
          </Badge>
        );
      default:
        return (
          <Badge key={idx} variant="outline" className="text-[10px]">
            {type}
          </Badge>
        );
    }
  };

  const columns: AdminTableColumn<CurrencyAutomationRule>[] = [
    {
      key: "priority",
      header: "Priority",
      className: "w-[80px]",
      cell: (row, idx) => (
        <div className="flex items-center gap-1">
          <span className="font-mono text-xs text-muted-foreground w-4 text-center">
            {idx + 1}
          </span>
          {onMovePriority && (
            <div className="flex flex-col">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => onMovePriority(idx, "up")}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer p-0.5"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                disabled={idx === rules.length - 1}
                onClick={() => onMovePriority(idx, "down")}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer p-0.5"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Rule Name & Details",
      className: "min-w-[240px]",
      cell: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-foreground hover:text-primary transition-colors cursor-pointer" onClick={() => onEdit(row)}>
              {row.name}
            </span>
          </div>
          {row.description && (
            <p className="text-[11px] text-muted-foreground line-clamp-1">
              {row.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "trigger",
      header: "Trigger Event",
      className: "min-w-[170px]",
      cell: (row) => {
        const t = getTriggerTag(row.trigger);
        const Icon = t.icon;
        return (
          <AdminTableTag variant={t.variant as any}>
            <Icon className="w-3 h-3 mr-1" />
            {t.label}
          </AdminTableTag>
        );
      },
    },
    {
      key: "actions",
      header: "Action Pipeline",
      className: "min-w-[220px]",
      cell: (row) => (
        <div className="flex flex-wrap items-center gap-1.5 py-1">
          {(row.actions || []).map((act, i) =>
            renderActionBadge(act.type, i)
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "w-[110px]",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.isActive}
            disabled={togglingId === row.id}
            onCheckedChange={() => handleToggle(row.id, row.isActive)}
            className="data-[state=checked]:bg-emerald-600"
          />
          <span
            className={cn(
              "text-xs font-semibold select-none",
              row.isActive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground"
            )}
          >
            {row.isActive ? "Active" : "Paused"}
          </span>
        </div>
      ),
    },
    {
      key: "actions-menu",
      header: "",
      className: "w-[50px] text-right",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 text-xs">
            <DropdownMenuItem
              onClick={() => onEdit(row)}
              className="cursor-pointer gap-2"
            >
              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
              Edit Rule
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDuplicate(row)}
              className="cursor-pointer gap-2"
            >
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              Duplicate Rule
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(row)}
              className="cursor-pointer gap-2 text-rose-600 focus:text-rose-600"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Rule
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AdminTable
      data={rules}
      columns={columns}
      keyExtractor={(row) => row.id}
      loading={loading}
      emptyTitle="No Currency Automation Rules Found"
      emptyDescription="Create automated actions triggered by EC/TC earnings, currency conversions, wallet balance milestones, or reward redemptions."
    />
  );
};
