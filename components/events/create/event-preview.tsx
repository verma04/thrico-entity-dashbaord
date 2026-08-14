"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Laptop,
  RefreshCw,
  Users,
  Eye,
  Star,
} from "lucide-react";
import moment from "moment";

interface EventPreviewProps {
  eventData: {
    title?: string;
    description?: string;
    location?: { name?: string };
    startDate?: any;
    endDate?: any;
    startTime?: any;
    type?: string;
    lastDateOfRegistration?: any;
  };
  coverImage?: string;
}

export function EventPreview({ eventData, coverImage }: EventPreviewProps) {
  const {
    title = "Your Event Title",
    description = "Your event description will appear here...",
    location,
    startDate,
    endDate,
    startTime,
    type = "in_person",
    lastDateOfRegistration,
  } = eventData;

  const formatDate = (date: any) => {
    if (!date) return "Date not set";
    return moment(date).format("MMM DD, YYYY");
  };

  const formatTime = (time: any) => {
    if (!time) return "Time not set";
    return moment(time, ["HH:mm", moment.ISO_8601]).format("hh:mm A");
  };

  const getEventTypeLabel = (eventType: string) => {
    const normalizedType = eventType?.toUpperCase();
    switch (normalizedType) {
      case "IN_PERSON":
        return "In Person";
      case "ONLINE":
      case "VIRTUAL":
        return "Virtual";
      case "HYBRID":
        return "Hybrid";
      default:
        return "In Person";
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-hidden shadow-xs">
      {/* Cover Image */}
      <div className="aspect-[3/2] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 relative">
        <Image
          src={coverImage || "https://cdn.thrico.network/default_event.png"}
          alt="Event cover"
          width={1536}
          height={1024}
          className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <Badge
            variant="secondary"
            className="bg-black/60 text-white backdrop-blur-md border-none text-[10px] font-bold px-2 py-0.5"
          >
            {getEventTypeLabel(type)}
          </Badge>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
            {title || "Event Title"}
          </h3>
          {location?.name && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0" />
              {location.name}
            </p>
          )}
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-2 gap-2 py-2 border-y border-zinc-100 dark:border-zinc-800 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Date & Time
            </span>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs truncate">
              {formatDate(startDate)}
            </p>
            <p className="text-[11px] text-zinc-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(startTime)}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Registration
            </span>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs truncate">
              {lastDateOfRegistration ? formatDate(lastDateOfRegistration) : "Open"}
            </p>
            <p className="text-[11px] text-zinc-500">Deadline</p>
          </div>
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">0</div>
            <p className="text-[10px] text-zinc-400 font-medium">Registered</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">0</div>
            <p className="text-[10px] text-zinc-400 font-medium">Views</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">0</div>
            <p className="text-[10px] text-zinc-400 font-medium">Interested</p>
          </div>
        </div>

        {/* Description snippet */}
        <div className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
          {description || "Event description will appear here..."}
        </div>
      </div>
    </div>
  );
}
