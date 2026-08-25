"use client";

import React from "react";
import Link from "next/link";
import { Layers, Calendar, Users, Eye } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { Card, CardContent } from "@/components/ui/card";

interface TopEventItem {
  id?: string;
  name?: string;
  title?: string;
  attendees?: number;
  views?: number;
}

interface TopEventsCardProps {
  loading: boolean;
  moduleName?: string;
  events: TopEventItem[];
}

export function TopEventsCard({
  loading,
  moduleName = "Events",
  events,
}: TopEventsCardProps) {
  return (
    <section className="space-y-3 flex flex-col h-full">
      <DashboardSectionHeading
        title={`Top Performing ${moduleName}`}
        icon={<Layers className="h-3.5 w-3.5 text-muted-foreground" />}
        rightElement={
          <Link href="/events/all">
            <span className="text-xs text-primary font-medium hover:underline cursor-pointer">
              View all
            </span>
          </Link>
        }
      />
      <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-sm rounded-xl overflow-hidden flex-1">
        <CardContent className="p-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 rounded-lg bg-muted/50 border border-border animate-pulse"
                />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Calendar className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-xs font-medium">No event performance data recorded.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((item, idx) => {
                const maxAttendees = events[0]?.attendees || 1;
                const barWidth = Math.round(
                  ((item.attendees || 0) / maxAttendees) * 100
                );

                return (
                  <div
                    key={item.id || idx}
                    className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/40 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-muted/60 border border-border flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:border-primary/50 group-hover:text-primary transition-colors shrink-0 mr-3">
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {item.name || item.title || "Community Assembly"}
                        </span>
                        <div className="flex items-center gap-3 text-muted-foreground shrink-0 ml-2">
                          <span className="flex items-center gap-1 text-[11px] font-medium tabular-nums text-foreground/80">
                            <Users size={11} className="text-indigo-500" />
                            {(item.attendees || 0).toLocaleString()} attendees
                          </span>
                          {item.views !== undefined && (
                            <span className="flex items-center gap-1 text-[10px] font-medium tabular-nums px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                              <Eye size={10} />
                              {(item.views || 0).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
