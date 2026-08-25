"use client";

import React from "react";
import { Layers, Ticket, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ManualCouponType } from "@/graphql/actions/rewards/manual";

interface ManualArchitectureSimulatorProps {
  selectedType: ManualCouponType;
  onSelectType: (type: ManualCouponType) => void;
  onSimulateAssignment: () => void;
}

export const ManualArchitectureSimulator: React.FC<ManualArchitectureSimulatorProps> = ({
  selectedType,
  onSelectType,
  onSimulateAssignment,
}) => {
  return (
    <Card className="border-border/70 shadow-xs h-full flex flex-col justify-between">
      <CardHeader className="p-3.5 pb-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-emerald-600" />
            Emission Architecture
          </span>
          <Badge variant="outline" className="text-[9px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 py-0 h-4">
            Config Mode
          </Badge>
        </div>
        <CardDescription className="text-[11px]">
          Choose how codes and inventory are dispensed to winners.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-3.5 pt-0 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div
            onClick={() => onSelectType(ManualCouponType.ONE_TO_ONE)}
            className={cn(
              "p-2.5 rounded-lg border transition-all cursor-pointer space-y-1",
              selectedType === ManualCouponType.ONE_TO_ONE
                ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/40 ring-1 ring-emerald-500/20"
                : "border-border/70 bg-card hover:bg-muted/40"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Ticket className="h-3.5 w-3.5 text-emerald-600" />
                ONE_TO_ONE (Unique Voucher Pool)
              </span>
              <Badge variant="secondary" className="text-[9px] h-4 px-1.5">
                Batch CSV
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground leading-snug">
              Each member gets a distinct, non-reusable code from a pre-ingested batch pool.
            </p>
          </div>

          <div
            onClick={() => onSelectType(ManualCouponType.ONE_TO_MANY)}
            className={cn(
              "p-2.5 rounded-lg border transition-all cursor-pointer space-y-1",
              selectedType === ManualCouponType.ONE_TO_MANY
                ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/40 ring-1 ring-emerald-500/20"
                : "border-border/70 bg-card hover:bg-muted/40"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-blue-600" />
                ONE_TO_MANY (Shared Campaign Code)
              </span>
              <Badge variant="secondary" className="text-[9px] h-4 px-1.5">
                Static Promo
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground leading-snug">
              Single promotional string with global inventory quota & per-user usage limits.
            </p>
          </div>
        </div>

        <Button
          onClick={onSimulateAssignment}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 font-medium text-xs h-8 shadow-2xs mt-2 cursor-pointer"
        >
          <Zap className="h-3.5 w-3.5" />
          Simulate Win & Assign Voucher
        </Button>
      </CardContent>
    </Card>
  );
};
