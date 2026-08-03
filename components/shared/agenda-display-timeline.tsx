"use client";

import React from "react";
import { Clock, MapPin, Video, Users } from "lucide-react";

export interface AgendaSpeaker {
  id: string;
  name: string;
  avatar?: string;
}

export interface AgendaVenue {
  name: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface AgendaSession {
  id: string;
  title: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  isPinned?: boolean;
  videoSteam?: string;
  venue?: AgendaVenue;
  speakers?: AgendaSpeaker[];
}

interface AgendaDisplayTimelineProps {
  sessions: AgendaSession[];
  className?: string;
}

export function AgendaDisplayTimeline({
  sessions,
  className = "",
}: AgendaDisplayTimelineProps) {
  if (!sessions || sessions.length === 0) return null;

  return (
    <div className={`relative border-l-2 border-primary/20 ml-3 pl-6 space-y-6 pt-2 pb-2 ${className}`}>
      {sessions.map((session) => (
        <div key={session.id} className="relative">
          {/* Timeline dot */}
          <div className="absolute -left-[31px] mt-1.5 h-4 w-4 rounded-full bg-primary border-4 border-card shadow-sm" />

          <div className="group relative border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md hover:border-primary/30 transition-all p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg leading-tight text-foreground">
                    {session.title}
                  </h3>
                  {session.isPinned && (
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                      Pinned
                    </span>
                  )}
                </div>
                {(session.date || session.startTime) && (
                  <div className="flex items-center text-sm text-muted-foreground mt-2 font-medium">
                    <Clock className="w-4 h-4 mr-1.5 text-primary/70" />
                    {session.date}
                    {session.startTime && ` • ${session.startTime}`}
                    {session.endTime && ` - ${session.endTime}`}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-4 text-sm text-muted-foreground">
              {session.venue && (
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-primary/70" />
                  <span>{session.venue.name}</span>
                </div>
              )}

              {session.videoSteam && (
                <div className="flex items-start">
                  <Video className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-primary/70" />
                  <a
                    href={session.videoSteam}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium hover:underline line-clamp-1"
                  >
                    Join Stream
                  </a>
                </div>
              )}

              {session.speakers && session.speakers.length > 0 && (
                <div className="flex items-start mt-4 pt-4 border-t border-border/40">
                  <Users className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-primary/70" />
                  <div className="flex flex-wrap gap-2">
                    {session.speakers.map((speaker) => (
                      <div
                        key={speaker.id}
                        className="flex items-center gap-1.5 bg-muted/60 px-2 py-1 rounded-md border border-border/40"
                      >
                        <span className="font-medium text-xs text-foreground">
                          {speaker.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
