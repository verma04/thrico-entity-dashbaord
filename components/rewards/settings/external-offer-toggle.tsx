"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ExternalOfferToggleProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

export function ExternalOfferToggle({
  enabled,
  onToggle,
}: ExternalOfferToggleProps) {
  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Description */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-foreground">
                External Offer Fulfillment
              </h2>
              <Badge
                variant="outline"
                className="text-[10px] uppercase tracking-widest font-semibold bg-primary/5 text-primary border-primary/15"
              >
                Beta
              </Badge>
            </div>
            <p className="text-[13px] text-muted-foreground max-w-xl leading-relaxed">
              When enabled, verified brands can send requests to publish their
              coupons directly in your rewards directory.
            </p>
          </div>

          {/* Toggle control */}
          <div className="flex items-center gap-3 bg-muted/40 px-4 py-2.5 rounded-xl border border-border">
            <span
              className={cn(
                "text-[11px] font-semibold uppercase tracking-wider transition-colors",
                enabled ? "text-muted-foreground" : "text-destructive"
              )}
            >
              Off
            </span>
            <Switch
              checked={enabled}
              onCheckedChange={onToggle}
              className="data-[state=checked]:bg-primary"
            />
            <span
              className={cn(
                "text-[11px] font-semibold uppercase tracking-wider transition-colors",
                enabled ? "text-emerald-600" : "text-muted-foreground"
              )}
            >
              On
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
