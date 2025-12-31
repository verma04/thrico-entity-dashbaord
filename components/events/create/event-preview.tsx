"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Share2,
  Heart,
  Users,
  Eye,
  Star,
} from "lucide-react";
import dayjs from "dayjs";

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
    type = "IN_PERSON",
    lastDateOfRegistration,
  } = eventData;

  const formatDate = (date: any) => {
    if (!date) return "Date not set";
    return dayjs(date).format("MMM DD, YYYY");
  };

  const formatTime = (time: any) => {
    if (!time) return "Time not set";
    return dayjs(time).format("hh:mm A");
  };

  const getEventTypeBadgeClass = (eventType: string) => {
    switch (eventType) {
      case "IN_PERSON":
        return "bg-blue-500/5 text-blue-600 border-blue-500/20";
      case "ONLINE":
        return "bg-green-500/5 text-green-600 border-green-500/20";
      case "HYBRID":
        return "bg-purple-500/5 text-purple-600 border-purple-500/20";
      default:
        return "bg-gray-500/5 text-gray-600 border-gray-500/20";
    }
  };

  const getEventTypeLabel = (eventType: string) => {
    switch (eventType) {
      case "IN_PERSON":
        return "In Person";
      case "ONLINE":
        return "Online";
      case "HYBRID":
        return "Hybrid";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="max-w-[600px] mx-auto border-none shadow-xl ring-1 ring-border/50 overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-[200px] overflow-hidden">
        <Image
          src={coverImage || "https://cdn.thrico.network/defaultEventCover.png"}
          alt="Event cover"
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white/90 hover:bg-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white/90 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Event Content */}
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h3 className="text-2xl font-bold leading-tight">{title}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={getEventTypeBadgeClass(type)}>
                {getEventTypeLabel(type)}
              </Badge>
              {location?.name && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {location.name}
                </span>
              )}
            </div>
          </div>
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Date & Time
            </p>
            <div className="text-sm">
              <p>{formatDate(startDate)}</p>
              {endDate && startDate !== endDate && (
                <p className="text-muted-foreground">- {formatDate(endDate)}</p>
              )}
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatTime(startTime)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">Registration Deadline</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(lastDateOfRegistration)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div className="space-y-2">
          <h4 className="text-base font-semibold">About this event</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1" size="lg">
            Register Now
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>

        {/* Event Stats */}
        <div className="bg-muted/50 p-4 rounded-lg mt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold">0</p>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Users className="h-3 w-3" />
                Registered
              </p>
            </div>
            <div>
              <p className="text-lg font-bold">0</p>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Eye className="h-3 w-3" />
                Views
              </p>
            </div>
            <div>
              <p className="text-lg font-bold">0</p>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Star className="h-3 w-3" />
                Interested
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
