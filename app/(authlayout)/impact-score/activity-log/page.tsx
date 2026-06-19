"use client";

import React from "react";
import { Activity, Zap } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemCard } from "@/components/layout/ecosystem/ecosystem-analytics";

export default function ImpactActivityLogPage() {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Activity Log"
        description="Real-time stream of points awarded and deducted by the engine."
        badgeText="Monitoring"
        icon={Activity}
      />
      <EcosystemContainer className="p-6 lg:p-8">
        <div className="max-w-4xl">
          <EcosystemCard
            title="User Activity Stream"
            description="Live view of impact score events across your community."
            icon={Zap}
          >
            <div className="mt-6 py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-zinc-100 rounded-xl bg-zinc-50/50">
              <Activity className="h-8 w-8 text-zinc-300 mb-3" />
              <p className="text-sm font-semibold text-zinc-700">No activity yet</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                User impact events will be displayed here once actions are tracked.
              </p>
            </div>
          </EcosystemCard>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
