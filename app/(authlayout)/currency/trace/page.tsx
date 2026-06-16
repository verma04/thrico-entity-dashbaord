"use client";

import { QuickAuditTrace } from "@/components/settings/currency/quick-audit-trace";
import { Activity } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useModuleStore } from "@/store/useModuleStore";

export default function QuickTracePage() {
  const currencyModuleName = useModuleStore((state) => state.currencyModuleName);
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Quick Trace"
        badgeText={currencyModuleName}
        description={`A snapshot of recent ${currencyModuleName.toLowerCase()} movements and conversions.`}
        icon={Activity}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">Live feed</span>
          </div>
        </EcosystemActionBar.Group>
        <EcosystemActionBar.Group align="right">
          <Link href="/currency/audit-log">
            <Button variant="outline" size="sm" className="gap-2">
              Full audit log
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 max-w-3xl">
        <QuickAuditTrace />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
