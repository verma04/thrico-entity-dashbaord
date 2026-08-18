"use client";

import React from "react";
import { Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PointRule } from "@/graphql/actions";
import { PointRuleCardCompact } from "./point-rule-card-compact";

interface PointRulesGridProps {
  rules: PointRule[];
  modules: { id: string; name: string; icon: string; type?: "MODULE" | "INTEGRATION" }[];
  onEdit: (rule: PointRule) => void;
  onOpenNotifications: (rule: PointRule) => void;
  onToggleActive: (id: string) => void;
  toggling?: boolean;
}

export function PointRulesGrid({
  rules,
  modules,
  onEdit,
  onOpenNotifications,
  onToggleActive,
  toggling,
}: PointRulesGridProps) {
  if (!rules || rules.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <Coins className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No scoring rules found
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Create a reward rule to start incentivizing engagement and activities across the ecosystem.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {rules.map((rule) => (
        <PointRuleCardCompact
          key={rule.id}
          rule={rule}
          modules={modules}
          onEdit={onEdit}
          onOpenNotifications={onOpenNotifications}
          onToggleActive={onToggleActive}
          toggling={toggling}
        />
      ))}
    </div>
  );
}

export default PointRulesGrid;
