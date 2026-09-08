"use client";

import React from "react";
import {
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  Lock,
  ExternalLink,
} from "lucide-react";
import {
  PolarisSidebarCard,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { Customer360ApiKey, Customer360ApiKeyModule } from "@/graphql/actions/customer-360-api-key";

interface Customer360SidebarProps {
  apiKey: Customer360ApiKey | null;
  modules: Customer360ApiKeyModule[];
}

export function Customer360Sidebar({ apiKey, modules }: Customer360SidebarProps) {
  const enabledModulesCount = modules.filter((m) => m.enabled).length;
  const isKeyActive = apiKey?.isActive ?? false;

  return (
    <div className="space-y-4">
      {/* Telemetry Overview */}
      <PolarisSidebarCard
        title="Telemetry & Gateways"
        badge={isKeyActive ? "Live" : "Inactive"}
        icon={Activity}
      >
        <div className="space-y-3">
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs py-1 border-b border-[#e1e3e5] dark:border-zinc-800">
              <span className="flex items-center gap-1.5 text-[#616161] dark:text-zinc-400 font-medium">
                <KeyRound className="h-3.5 w-3.5" />
                Key Provisioning
              </span>
              <span
                className={
                  apiKey
                    ? "text-emerald-600 font-semibold text-[11px]"
                    : "text-zinc-400 text-[11px]"
                }
              >
                {apiKey ? "Provisioned" : "None"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-b border-[#e1e3e5] dark:border-zinc-800">
              <span className="flex items-center gap-1.5 text-[#616161] dark:text-zinc-400 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                Access State
              </span>
              <span
                className={
                  isKeyActive
                    ? "text-emerald-600 font-semibold text-[11px]"
                    : "text-amber-600 font-semibold text-[11px]"
                }
              >
                {isKeyActive ? "Authorized" : "Suspended"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-b border-[#e1e3e5] dark:border-zinc-800">
              <span className="flex items-center gap-1.5 text-[#616161] dark:text-zinc-400 font-medium">
                <Layers className="h-3.5 w-3.5" />
                Active Scopes
              </span>
              <span className="text-foreground font-semibold text-[11px]">
                {enabledModulesCount} / {modules.length} Modules
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <span className="flex items-center gap-1.5 text-[#616161] dark:text-zinc-400 font-medium">
                <Lock className="h-3.5 w-3.5" />
                Encryption
              </span>
              <span className="text-zinc-500 font-medium text-[11px]">
                SHA-256 + HMAC
              </span>
            </div>
          </div>
        </div>
      </PolarisSidebarCard>

      {/* Security Guidance */}
      <PolarisTipCard title="Audience Intelligence API">
        The Customer 360 gateway gives authorized clients a 360-degree aggregated profile of member activity, event attendance, discussion participation, and survey submissions.
      </PolarisTipCard>
    </div>
  );
}
