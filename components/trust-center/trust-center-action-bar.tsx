import React from "react";
import { Clock, RefreshCw, Users, ShieldAlert, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { cn } from "@/lib/utils";

interface TrustCenterActionBarProps {
  nextSyncSeconds: number;
  syncing: boolean;
  role: "member" | "moderator" | "announcements";
  onSync: () => void;
  onRoleChange: (role: "member" | "moderator" | "announcements") => void;
}

export function TrustCenterActionBar({
  nextSyncSeconds,
  syncing,
  role,
  onSync,
  onRoleChange,
}: TrustCenterActionBarProps) {
  const roleTabs = [
    {
      key: "member",
      label: "Member View",
      icon: <Users className="h-4 w-4" />,
      active: role === "member",
    },
    {
      key: "moderator",
      label: "Moderator Workspace",
      icon: <ShieldAlert className="h-4 w-4" />,
      active: role === "moderator",
    },
    {
      key: "announcements",
      label: "Announcements",
      icon: <SlidersHorizontal className="h-4 w-4" />,
      active: role === "announcements",
    },
  ] as const;

  return (
    <EcosystemActionBar shadow="none">
      <div className="flex items-center justify-between w-full">
        {/* Left: status */}
        <div className="flex items-center gap-2 px-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          <span className="text-[11px] font-medium text-muted-foreground">
            Automated Safety Active
          </span>
        </div>

        {/* Right: polling + sync + role toggle */}
        <div className="flex items-center gap-3">
          {/* Polling countdown */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Next sync:{" "}
              <strong className="text-foreground tabular-nums">
                {nextSyncSeconds}s
              </strong>
            </span>
          </div>

          <div className="h-4 w-px bg-border mx-0.5" />

          <Button
            variant="outline"
            size="sm"
            onClick={onSync}
            className="h-9 px-4 rounded-xl border-border font-bold text-[10px] uppercase tracking-widest text-muted-foreground gap-2 hover:bg-muted transition-all shadow-sm"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", syncing && "animate-spin")} />
            Sync
          </Button>

          <div className="h-4 w-px bg-border mx-0.5" />

          {/* Role perspective toggle */}
          <div className="flex items-center gap-0.5 bg-muted p-0.5 rounded-lg border border-border">
            {roleTabs.map((r) => (
              <button
                key={r.key}
                onClick={() => onRoleChange(r.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer",
                  r.active
                    ? "bg-background text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {r.icon}
                <span className="hidden sm:inline">{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </EcosystemActionBar>
  );
}
