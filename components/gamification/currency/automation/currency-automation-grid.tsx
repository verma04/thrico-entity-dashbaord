"use client";

import React from "react";
import {
  CurrencyAutomationRule,
  CurrencyRuleTrigger,
} from "@/graphql/gamification-automation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Coins,
  ArrowRightLeft,
  Gift,
  Award,
  Sparkles,
  Pencil,
  Trash2,
  Copy,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrencyAutomationGridProps {
  rules: CurrencyAutomationRule[];
  onToggleStatus: (id: string, active: boolean) => Promise<void>;
  onEdit: (rule: CurrencyAutomationRule) => void;
  onDuplicate: (rule: CurrencyAutomationRule) => void;
  onDelete: (rule: CurrencyAutomationRule) => void;
  loading?: boolean;
}

export const CurrencyAutomationGrid: React.FC<CurrencyAutomationGridProps> = ({
  rules,
  onToggleStatus,
  onEdit,
  onDuplicate,
  onDelete,
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

  const getTriggerMeta = (trigger: CurrencyRuleTrigger) => {
    switch (trigger) {
      case "EC_EARNED":
        return { label: "EC Earned", icon: Coins, color: "text-amber-500" };
      case "TC_COINS_EARNED":
        return { label: "TC Coins Earned", icon: Coins, color: "text-yellow-500" };
      case "CURRENCY_THRESHOLD_REACHED":
        return {
          label: "Balance Milestone",
          icon: Sparkles,
          color: "text-indigo-500",
        };
      case "CURRENCY_CONVERTED":
        return {
          label: "Currency Converted",
          icon: ArrowRightLeft,
          color: "text-sky-500",
        };
      case "REDEMPTION_COMPLETED":
        return {
          label: "Redemption Completed",
          icon: Gift,
          color: "text-emerald-500",
        };
      case "DAILY_CONVERSION_CAP_REACHED":
        return {
          label: "Daily Cap Hit",
          icon: ArrowRightLeft,
          color: "text-rose-500",
        };
      default:
        return { label: trigger, icon: Zap, color: "text-primary" };
    }
  };

  if (rules.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
          <Coins className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-foreground">
          No Currency Automation Rules
        </h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Set up automatic tier assignment, email triggers, or bonus TC Coins
          when users earn or convert currency.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rules.map((rule) => {
        const triggerMeta = getTriggerMeta(rule.trigger);
        const TriggerIcon = triggerMeta.icon;

        return (
          <Card
            key={rule.id}
            className="flex flex-col justify-between border-border bg-card hover:border-primary/40 transition-all shadow-2xs group"
          >
            <CardHeader className="p-4 pb-3 space-y-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="gap-1 text-[10px] font-semibold"
                >
                  <TriggerIcon className={cn("w-3 h-3", triggerMeta.color)} />
                  {triggerMeta.label}
                </Badge>

                <div className="flex items-center gap-1.5">
                  <Switch
                    checked={rule.isActive}
                    disabled={togglingId === rule.id}
                    onCheckedChange={() =>
                      handleToggle(rule.id, rule.isActive)
                    }
                    className="scale-85 data-[state=checked]:bg-emerald-600"
                  />
                  <span
                    className={cn(
                      "text-[10px] font-bold select-none",
                      rule.isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground"
                    )}
                  >
                    {rule.isActive ? "Active" : "Paused"}
                  </span>
                </div>
              </div>

              <div>
                <h4
                  onClick={() => onEdit(rule)}
                  className="text-xs font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer line-clamp-1"
                >
                  {rule.name}
                </h4>
                {rule.description && (
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                    {rule.description}
                  </p>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-2">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Action Pipeline ({rule.actions?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1">
                {(rule.actions || []).map((act, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-[9px] px-1.5 py-0 font-medium"
                  >
                    {act.type.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="p-3 border-t border-border/60 bg-muted/20 flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground">
                Priority #{rule.priority || 1}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDuplicate(rule)}
                  className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(rule)}
                  className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(rule)}
                  className="h-7 w-7 text-muted-foreground hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
