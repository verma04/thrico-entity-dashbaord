"use client";

import React from "react";
import { Zap, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CtaButton } from "@/components/ui/cta-button";
import { ImpactRuleCard, ImpactRuleNode } from "./impact-rule-card";

interface ImpactRulesGridProps {
  rules: ImpactRuleNode[];
  onToggle: (id: string, currentEnabled: boolean) => void;
  isToggling?: boolean;
  search?: string;
}

export function ImpactRulesGrid({
  rules,
  onToggle,
  isToggling,
  search,
}: ImpactRulesGridProps) {
  if (!rules || rules.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <Zap className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            {search ? "No rules match your search" : "No rules configured yet"}
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {search
              ? "Try adjusting your search query or filters to find what you're looking for."
              : "Create scoring rules to automatically allocate impact points when members interact across your community."}
          </p>
          {!search && (
            <div className="mt-4">
              <Link href="/gamification/impact-score/rules/create">
                <CtaButton size="sm">
                  <Plus className="h-3.5 w-3.5" />
                  Create First Rule
                </CtaButton>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {rules.map((rule) => (
        <ImpactRuleCard
          key={rule.id}
          rule={rule}
          onToggle={onToggle}
          isToggling={isToggling}
        />
      ))}
    </div>
  );
}

export default ImpactRulesGrid;
