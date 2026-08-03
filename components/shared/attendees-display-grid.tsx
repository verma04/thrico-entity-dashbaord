"use client";

import React from "react";
import { getMediaUrl } from "@/utils/utils";

export interface Attendee {
  id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface AttendeesDisplayGridProps {
  attendees: Attendee[];
  maxDisplay?: number;
  className?: string;
}

export function AttendeesDisplayGrid({
  attendees,
  maxDisplay = 20,
  className = "",
}: AttendeesDisplayGridProps) {
  if (!attendees || attendees.length === 0) return null;

  const displayed = attendees.slice(0, maxDisplay);
  const remaining = attendees.length - maxDisplay;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {displayed.map((attendee) => {
        const avatarSrc = attendee.avatar
          ? attendee.avatar.startsWith("http")
            ? attendee.avatar
            : (getMediaUrl(attendee.avatar) || "")
          : null;

        const fullName = [attendee.firstName, attendee.lastName]
          .filter(Boolean)
          .join(" ") || "Anonymous";

        const initial = attendee.firstName?.charAt(0)?.toUpperCase() || "?";

        return (
          <div
            key={attendee.id}
            className="flex items-center gap-2.5 p-2 rounded-md bg-muted/40 hover:bg-muted/70 transition-colors"
          >
            {avatarSrc ? (
              <div className="relative w-8 h-8 shrink-0 overflow-hidden rounded-full bg-muted">
                <img
                  src={avatarSrc}
                  alt={fullName}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-8 h-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                {initial}
              </div>
            )}
            <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
              {fullName}
            </span>
          </div>
        );
      })}
      {remaining > 0 && (
        <div className="flex items-center justify-center px-4 py-2 rounded-md border border-dashed border-border/60 bg-muted/20 text-sm font-medium text-muted-foreground">
          +{remaining} more
        </div>
      )}
    </div>
  );
}
