"use client";

import React from "react";
import { Zap, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UsageHeaderProps {
  onAddCredits: () => void;
  onManagePlan: () => void;
}

export function UsageHeader({ onAddCredits, onManagePlan }: UsageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Usage & Billing
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Monitor your infrastructure resource consumption and limits.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddCredits}
          className="h-9 rounded-lg gap-2 text-xs font-medium border-border"
        >
          <Zap className="h-3.5 w-3.5" />
          Add Credits
        </Button>
        <Button
          size="sm"
          onClick={onManagePlan}
          className="h-9 rounded-lg gap-2 text-xs font-medium"
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
          Manage Plan
        </Button>
      </div>
    </div>
  );
}
