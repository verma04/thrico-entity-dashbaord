"use client";

import React from "react";
import { Terminal, ArrowUpRight, ShieldCheck, Code2, Webhook } from "lucide-react";
import { IntegrationCard } from "./integration-card";
import { CtaButton } from "@/components/ui/cta-button";
import Link from "next/link";

export const DeveloperApiCard = () => {
  return (
    <IntegrationCard
      title="MCP & Webhooks"
      category="Developer Tools"
      badge="Custom API"
      description="Connect AI agents via Model Context Protocol or configure secure event triggers and webhooks."
      icon={Terminal}
      iconBgColor="bg-slate-900 text-slate-100 dark:bg-slate-800"
      isConnected={true}
      customAction={
        <Link href="/settings/mcp">
          <CtaButton
            variant="outline"
            size="sm"
            className="h-7 text-xs px-2.5 gap-1 hover:bg-muted font-medium"
          >
            Manage Keys
            <ArrowUpRight className="h-3 w-3 opacity-60" />
          </CtaButton>
        </Link>
      }
    >
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 bg-background/70 rounded-lg border border-border/40 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <div className="space-y-0.5">
              <p className="font-semibold text-foreground text-[11.5px]">Model Context Protocol Server</p>
              <p className="text-[10.5px] text-muted-foreground">Secure SSE endpoint with token authentication active.</p>
            </div>
          </div>
          <Link href="/settings/mcp" className="shrink-0">
            <span className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1">
              Configure &rarr;
            </span>
          </Link>
        </div>
      </div>
    </IntegrationCard>
  );
};
