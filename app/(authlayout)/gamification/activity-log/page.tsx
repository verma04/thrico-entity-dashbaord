import React from "react";
import { ActivityLogManager } from "@/components/gamification/activity-log/activity-log-manager";
import { History } from "lucide-react";

export default function ActivityLogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <History className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Log</h1>
          <p className="text-sm text-muted-foreground">
            Track gamification events and point distributions across the
            platform.
          </p>
        </div>
      </div>

      <ActivityLogManager />
    </div>
  );
}
