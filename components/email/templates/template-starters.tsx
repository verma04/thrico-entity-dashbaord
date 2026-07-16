"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FileText, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const STARTERS = [
  { name: "Welcome Email", description: "Greet new members", type: "WELCOME", color: "#4f46e5" },
  { name: "Newsletter", description: "Weekly updates", type: "NEWSLETTER", color: "#10b981" },
  { name: "Event Invite", description: "Invite to events", type: "EVENT", color: "#7c3aed" },
  { name: "Announcement", description: "Share updates", type: "ANNOUNCEMENT", color: "#d97706" },
] as const;

export function TemplateStarters() {
  const router = useRouter();

  return (
    <div className="space-y-3 pt-6 border-t border-border/50">
      <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Start from a template
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {STARTERS.map((s) => (
          <button
            key={s.type}
            onClick={() => router.push(`/email/templates/create?type=${s.type}`)}
            className="group flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:bg-muted/30 hover:border-border transition-all text-left"
          >
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: s.color + "10", border: `1px solid ${s.color}20` }}
            >
              <FileText className="h-3.5 w-3.5" style={{ color: s.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{s.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{s.description}</p>
            </div>
            <ChevronRight className="h-3 w-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
