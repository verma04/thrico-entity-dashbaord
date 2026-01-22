import React from "react";
import { Users } from "lucide-react";

export function MentorshipHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Mentorship Management</h1>
        </div>
        <p className="text-muted-foreground">
          Manage platform mentors and user requests
        </p>
      </div>
    </div>
  );
}
