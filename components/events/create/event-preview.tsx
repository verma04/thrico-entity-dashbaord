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
  Globe,
} from "lucide-react";
import moment from "moment";
import { cn } from "@/lib/utils";

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
    memberEligibility?: string;
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
    memberEligibility = "ALL",
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

  const getEligibilityLabel = (eligibility?: string) => {
    switch (eligibility) {
      case "OUTSIDE_PLATFORM":
        return "Public Event";
      case "VERIFIED":
        return "Verified Only";
      case "TIERS":
        return "Tier Exclusive";
      case "SPECIFIC_CUSTOMERS":
        return "Invite Only";
      default:
        return "All Members";
    }
  };

  return (
    <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 overflow-hidden shadow-xs">
      {/* Cover Image */}
      <div className="aspect-[3/2] w-full overflow-hidden bg-[#e1e3e5] dark:bg-zinc-800 relative">
        <Image
          src={coverImage || "https://cdn.thrico.network/default_event.png"}
          alt="Event cover"
          width={1536}
          height={1024}
          className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 flex-wrap justify-end">
          <Badge
            variant="secondary"
            className="bg-black/75 text-white backdrop-blur-xs border-none text-[10px] font-semibold px-2 py-0.5 rounded-[4px]"
          >
            {getEventTypeLabel(type)}
          </Badge>
          {memberEligibility && (
            <Badge
              variant="secondary"
              className={cn(
                "backdrop-blur-xs border-none text-[10px] font-semibold px-2 py-0.5 rounded-[4px]",
                memberEligibility === "OUTSIDE_PLATFORM"
                  ? "bg-emerald-600/90 text-white"
                  : memberEligibility === "VERIFIED"
                    ? "bg-blue-600/90 text-white"
                    : memberEligibility === "TIERS"
                      ? "bg-purple-600/90 text-white"
                      : memberEligibility === "SPECIFIC_CUSTOMERS"
                        ? "bg-amber-600/90 text-white"
                        : "bg-zinc-800/80 text-zinc-100",
              )}
            >
              {getEligibilityLabel(memberEligibility)}
            </Badge>
          )}
        </div>
      </div>

      {/* Event Details */}
      <div className="p-3.5 space-y-2.5">
        <div>
          <h3 className="font-semibold text-[14px] text-[#303030] dark:text-zinc-100 truncate">
            {title || "Event Title"}
          </h3>
          {location?.name && (
            <p className="text-[12px] text-[#616161] dark:text-zinc-400 mt-0.5 flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0" />
              {location.name}
            </p>
          )}
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-2 gap-2 py-2 border-y border-[#e1e3e5] dark:border-zinc-800">
          <div className="flex items-center gap-2 p-1.5 rounded-[6px] bg-white dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700">
            <div className="h-6 w-6 rounded-[4px] bg-[#f6f6f7] dark:bg-zinc-700 text-[#616161] dark:text-zinc-300 flex items-center justify-center shrink-0">
              <Calendar className="h-3 w-3" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#616161] font-medium">Start Date</p>
              <p className="text-[11.5px] font-semibold text-[#303030] dark:text-zinc-100 truncate">
                {formatDate(startDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-[6px] bg-white dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700">
            <div className="h-6 w-6 rounded-[4px] bg-[#f6f6f7] dark:bg-zinc-700 text-[#616161] dark:text-zinc-300 flex items-center justify-center shrink-0">
              <Clock className="h-3 w-3" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#616161] font-medium">Time</p>
              <p className="text-[11.5px] font-semibold text-[#303030] dark:text-zinc-100 truncate">
                {formatTime(startTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Description snippet */}
        <div className="text-[11.5px] text-[#616161] dark:text-zinc-400 leading-[16px] line-clamp-3">
          {description ||
            "Event description will be displayed here once entered..."}
        </div>

        {/* Outside Platform Public Warning Callout */}
        {memberEligibility === "OUTSIDE_PLATFORM" && (
          <div className="p-2.5 rounded-[6px] bg-[#221f15] border border-[#584824] text-[#dcd1b3] text-[11px] leading-[15px] space-y-0.5 animate-in fade-in-50">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5A623] shrink-0" />
              Public Event Notice
            </div>
            <p className="text-[10.5px] text-[#dcd1b3]/90">
              Open to non-members outside the platform. Anyone can view and register.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
