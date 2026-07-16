"use client";

import React from "react";
import Image from "next/image";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Event } from "@/graphql/actions/events";
import moment from "moment";
import { useRouter } from "next/navigation";

function getTypeStyles(type: string) {
  const normalizedType = type?.toUpperCase();
  switch (normalizedType) {
    case "ONLINE":
    case "VIRTUAL":
      return "bg-cyan-500/10 text-cyan-600 border-cyan-500/20";
    case "HYBRID":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    default:
      return "bg-violet-500/10 text-violet-600 border-violet-500/20";
  }
}

function getStatusStyles(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "PENDING":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "REJECTED":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
  }
}

export default function EventCard({ event }: { event: Event }) {
  const router = useRouter();

  const startDate = event.startDate ? moment(event.startDate) : null;
  const isUpcoming = startDate ? startDate.isAfter(moment()) : false;

  return (
    <Card
      className="group overflow-hidden border-none shadow-sm ring-1 ring-border/50 hover:shadow-xl hover:ring-primary/20 transition-all duration-300 cursor-pointer hover:-translate-y-1"
      onClick={() => router.push(`/events/${event.id}`)}
    >
      {/* Cover Image with Date Badge */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={
            event.cover
              ? `https://cdn.thrico.network/${event.cover}`
              : "https://cdn.thrico.network/defaultEventCover.png"
          }
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Date badge */}
        {startDate && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg">
            <div className="text-xs font-bold text-primary uppercase leading-tight">
              {startDate.format("MMM")}
            </div>
            <div className="text-xl font-black text-foreground leading-tight">
              {startDate.format("DD")}
            </div>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant="outline"
            className={`backdrop-blur-sm text-[11px] font-semibold ${getStatusStyles(event.status)}`}
          >
            {event.status}
          </Badge>
        </div>

        {/* Bottom info on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <Badge
            variant="outline"
            className={`backdrop-blur-sm text-[11px] font-semibold ${getTypeStyles(event.type)}`}
          >
            {event.type?.replace("_", " ")}
          </Badge>
          {event.verification?.isVerified && (
            <Badge
              variant="outline"
              className="bg-blue-500/20 text-blue-100 border-blue-400/30 backdrop-blur-sm text-[10px]"
            >
              ✓ Verified
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
        </div>

        {/* Meta info */}
        <div className="space-y-1.5">
          {startDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {startDate.format("ddd, MMM DD, YYYY")}
                {event.startTime ? ` • ${event.startTime}` : ""}
              </span>
            </div>
          )}
          {event.location?.name && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{event.location.name}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span className="font-semibold text-foreground">
              {event.numberOfAttendees || 0}
            </span>
            <span>attendees</span>
          </div>
          {isUpcoming && (
            <Badge
              variant="outline"
              className="bg-emerald-500/5 text-emerald-600 border-emerald-500/20 text-[10px]"
            >
              Upcoming
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
