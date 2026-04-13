"use client";

import React, { useState } from "react";
import { useGetGamificationActivityLog } from "@/graphql/actions";
import { ActivityLogTable } from "./activity-log-table";
import { Button } from "@/components/ui/button";
import { History, RotateCcw, Activity } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

export function ActivityLogManager() {
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 50;

  const { data, loading, error, refetch } = useGetGamificationActivityLog({
    variables: {
      input: { limit, offset },
    },
    fetchPolicy: "network-only",
  });

  const logs = data?.getGamificationActivityLog || [];
  
  const filteredLogs = logs.filter(log => 
    log.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
    log.user.lastName.toLowerCase().includes(search.toLowerCase()) ||
    log.type.toLowerCase().includes(search.toLowerCase())
  );

  if (error) {
    return (
      <EcosystemWrapper>
        <EcosystemHeader
          title="Activity Log"
          badgeText="Audit"
          description="Track all point emissions, badge awards, and rank changes."
          icon={History}
        />
        <EcosystemContainer className="p-12">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shadow-sm">
              <History className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Audit Log Unavailable
              </p>
              <p className="text-xs text-muted-foreground mt-1 px-4 leading-relaxed">
                {error.message}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl px-6">
              Retry Connection
            </Button>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Activity Log"
        badgeText="Gamification Audit"
        description="A complete immutable trail of all point awards, badge grants, and rank transitions across the entity."
        icon={History}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
           <EcosystemActionBar.Item grow className="max-w-xs">
              <EcosystemActionBar.Search 
                value={search}
                onChange={setSearch}
                placeholder="Search audit trail..."
              />
           </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
             <div className="flex items-center gap-3 px-1">
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]"> Live Audit Stream Active</span>
             </div>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="h-9 w-9 border-border rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <RotateCcw
                className={cn(loading && "animate-spin")}
                size={14}
              />
            </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Status active={filteredLogs.length > 0}>
             {filteredLogs.length} Events Logged
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-6">
        <div className="px-6 py-2">
           <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/50">
             <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border border-zinc-200">
               <Activity className="h-4 w-4 text-zinc-500" />
             </div>
             <p className="text-[12px] text-zinc-600 leading-relaxed font-medium">
               The gamification audit log provides real-time visibility into member progress. All point fluctuations and achievement unlocks are recorded here for administrative review and parity verification.
             </p>
           </div>
        </div>

        <div className="px-6">
          <ActivityLogTable logs={filteredLogs} isLoading={loading} />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
