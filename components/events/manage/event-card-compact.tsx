"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import moment from "moment";
import {
  MapPin,
  Users,
  Clock,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { Event } from "@/graphql/actions/events";
import { EventActions } from "./event-actions";
import { cn } from "@/lib/utils";

interface EventCardCompactProps {
  event: Event;
}

const TYPE_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; bar: string }
> = {
  ONLINE: {
    label: "Online",
    bg: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
    text: "text-cyan-700 dark:text-cyan-300",
    border: "border-cyan-500/30",
    bar: "#06b6d4",
  },
  VIRTUAL: {
    label: "Online",
    bg: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
    text: "text-cyan-700 dark:text-cyan-300",
    border: "border-cyan-500/30",
    bar: "#06b6d4",
  },
  OFFLINE: {
    label: "In-Person",
    bg: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-500/30",
    bar: "#8b5cf6",
  },
  IN_PERSON: {
    label: "In-Person",
    bg: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-500/30",
    bar: "#8b5cf6",
  },
  HYBRID: {
    label: "Hybrid",
    bg: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-500/30",
    bar: "#f59e0b",
  },
};

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  APPROVED: {
    label: "Approved",
    bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  PENDING: {
    label: "Pending",
    bg: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  DISABLED: {
    label: "Disabled",
    bg: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  PAUSED: {
    label: "Paused",
    bg: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
    text: "text-slate-700 dark:text-slate-300",
    dot: "bg-slate-400",
  },
};

export function EventCardCompact({ event }: EventCardCompactProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  const startDate = event.startDate ? moment(event.startDate) : null;
  const isUpcoming = startDate ? startDate.isAfter(moment()) : false;

  const normalizedType = event.type?.toUpperCase() || "OFFLINE";
  const typeInfo = TYPE_CONFIG[normalizedType] || {
    label: event.type || "Event",
    bg: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
    border: "border-border",
    bar: "#6366f1",
  };

  const statusInfo = STATUS_CONFIG[event.status?.toUpperCase()] || {
    label: event.status || "Unknown",
    bg: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  };

  const coverUrl =
    !imgError && event.cover
      ? event.cover.startsWith("http")
        ? event.cover
        : `https://cdn.thrico.network/${event.cover}`
      : null;

  return (
    <div
      onClick={() => router.push(`/events/${event.id}`)}
      className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
    >
      {/* Classification-card style top color bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{ backgroundColor: typeInfo.bar }}
      />

      {/* ── Top Area (Image or Header Tags) ─────────────────────────────── */}
      {coverUrl ? (
        <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-muted">
          <Image
            src={coverUrl}
            alt={event.title || "Event cover"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Floating Date Badge (Top-Left) */}
          {startDate && (
            <div className="absolute top-2.5 left-2.5 bg-card/95 backdrop-blur-md border border-border/50 rounded-lg px-2 py-1 text-center shadow-xs leading-none">
              <div className="text-[8px] font-black uppercase tracking-wider text-primary">
                {startDate.format("MMM")}
              </div>
              <div className="text-xs font-black text-foreground mt-0.5">
                {startDate.format("DD")}
              </div>
            </div>
          )}

          {/* Action button (Top-Right) */}
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-background/80 hover:bg-background backdrop-blur-md rounded-md shadow-xs transition-colors">
              <EventActions event={event} />
            </div>
          </div>

          {/* Type & Status pills on bottom of image */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight backdrop-blur-md border shadow-2xs",
                typeInfo.bg,
              )}
            >
              {typeInfo.label}
            </span>

            <span
              className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold backdrop-blur-md bg-black/50 text-white border border-white/10 shadow-2xs",
              )}
            >
              <span
                className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dot)}
              />
              {statusInfo.label}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 pb-0 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {startDate && (
              <div className="bg-card border border-border/60 rounded-md px-2 py-0.5 flex items-center gap-1 shadow-2xs">
                <span className="text-[9px] font-black uppercase tracking-wider text-primary">
                  {startDate.format("MMM DD")}
                </span>
              </div>
            )}

            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight border",
                typeInfo.bg,
              )}
            >
              {typeInfo.label}
            </span>

            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground border border-border">
              <span
                className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dot)}
              />
              {statusInfo.label}
            </span>
          </div>

          <div className="bg-background/80 hover:bg-background rounded-md transition-colors shrink-0">
            <EventActions event={event} />
          </div>
        </div>
      )}

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Event Title */}
          <h3
            className="text-xs sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors"
            title={event.title}
          >
            {event.title}
          </h3>

          {/* Date & Time */}
          {startDate && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
              <Clock className="h-3 w-3 shrink-0 text-muted-foreground/70" />
              <span className="truncate">
                {startDate.format("ddd, MMM D")}
                {event.startTime ? ` • ${event.startTime}` : ""}
              </span>
            </div>
          )}

          {/* Location / Mode */}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
            {normalizedType === "ONLINE" || normalizedType === "VIRTUAL" ? (
              <Globe className="h-3 w-3 shrink-0 text-cyan-600 dark:text-cyan-400" />
            ) : (
              <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/70" />
            )}
            <span className="truncate">
              {event.location?.name ||
                (normalizedType === "ONLINE" || normalizedType === "VIRTUAL"
                  ? "Virtual Event"
                  : "Location TBD")}
            </span>
          </div>
        </div>

        {/* ── Card Footer ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1 text-foreground/80 font-medium">
            <Users className="h-3 w-3 text-muted-foreground shrink-0" />
            <span>{event.numberOfAttendees || 0}</span>
            <span className="text-[10px] text-muted-foreground font-normal">
              attending
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {event.verification?.isVerified && (
              <span
                className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400"
                title="Verified Event"
              >
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                Verified
              </span>
            )}

            {isUpcoming && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Upcoming
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCardCompact;
