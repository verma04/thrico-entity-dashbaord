"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PromotedEventItem {
  id: string;
  title: string;
  startDate: string;
  location?: string;
  type?: string;
  attendeesCount?: number;
}

interface FeedPromotedEventsProps {
  loading: boolean;
  events: PromotedEventItem[];
}

export function FeedPromotedEvents({
  loading,
  events,
}: FeedPromotedEventsProps) {
  return (
    <section className="space-y-3">
      <DashboardSectionHeading
        title="Promoted Events & Broadcasts"
        icon={<Calendar className="h-3.5 w-3.5 text-muted-foreground" />}
        rightElement={
          <Link href="/events/all">
            <span className="text-xs text-primary font-medium hover:underline cursor-pointer">
              View all
            </span>
          </Link>
        }
      />
      <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-24 rounded-xl bg-muted/50 border border-border animate-pulse"
                />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Calendar className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-xs font-medium">No live promoted events scheduled</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {events.slice(0, 4).map((evt) => {
                const dateObj = new Date(evt.startDate);
                const month = !isNaN(dateObj.getTime())
                  ? dateObj.toLocaleDateString("en-US", { month: "short" })
                  : "DEC";
                const day = !isNaN(dateObj.getTime())
                  ? dateObj.toLocaleDateString("en-US", { day: "2-digit" })
                  : "01";

                return (
                  <Link
                    key={evt.id}
                    href={`/events/${evt.id}`}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-xs transition-all group"
                  >
                    <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {month}
                      </span>
                      <span className="text-base font-bold leading-none">{day}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {evt.title}
                        </span>
                        {evt.type && (
                          <Badge
                            variant="secondary"
                            className="text-[9px] px-1.5 py-0 h-4 uppercase font-semibold shrink-0"
                          >
                            {evt.type}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {dateObj.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {evt.location && (
                          <span className="flex items-center gap-1 truncate max-w-[120px]">
                            <MapPin size={11} />
                            {evt.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
