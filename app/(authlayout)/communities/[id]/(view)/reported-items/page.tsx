"use client";

import React from "react";
import { useParams } from "next/navigation";
import ItemReports from "@/components/reports/item-reports";
import { ReportModule } from "@/graphql/actions";
import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useModuleStore } from "@/store/useModuleStore";

export default function CommunityReportedItemsPage() {
  const singularName = useModuleStore((state) => state.communitySingularName);
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Top Header Strip ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/60 rounded-xl p-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-destructive" />
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              Reported Content &amp; Moderation Flags
            </h2>
            <Badge variant="outline" className="text-[10px] font-semibold text-destructive border-destructive/30 bg-destructive/5">
              Safety Triage
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review user-flagged posts, comments, and members inside this {singularName.toLowerCase()} for policy violations.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/60 shadow-2xs overflow-hidden p-2">
        <ItemReports
          targetId={id}
          moduleName={ReportModule.COMMUNITY}
          permissionModule="COMMUNITIES"
        />
      </div>
    </div>
  );
}
