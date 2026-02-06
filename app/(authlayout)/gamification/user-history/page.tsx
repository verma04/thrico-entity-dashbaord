import React from "react";
import { UserActivityLogManager } from "@/components/gamification/activity-log/user-activity-log-manager";
import { ScrollText } from "lucide-react";

export default function UserHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <ScrollText className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gamification History
          </h1>
          <p className="text-sm text-muted-foreground">
            Detailed view of user actions, points earned, and badges achieved.
          </p>
        </div>
      </div>

      <UserActivityLogManager />
    </div>
  );
}
