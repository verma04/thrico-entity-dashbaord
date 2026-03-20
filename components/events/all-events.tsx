"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Calendar,
  MapPin,
  Users,
  LayoutGrid,
  List,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { Event } from "@/graphql/actions/events";
import EventCard from "./event-card";

function getTypeStyles(type: string) {
  switch (type) {
    case "ONLINE":
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

export default function AllEvents({
  data,
  loading,
  viewMode = "grid",
}: {
  data: Event[] | undefined;
  loading?: boolean;
  viewMode?: "grid" | "list";
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="h-20 w-20 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-4">
            <Calendar className="h-10 w-10 text-violet-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No events found</h3>
          <p className="text-muted-foreground text-sm text-center max-w-md">
            No events match your current filters. Try adjusting your search or
            create a new event.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    );
  }

  // List/Table view
  return (
    <Card className="border-none shadow-sm ring-1 ring-border/50">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[300px]">Event Details</TableHead>
                <TableHead className="w-[200px]">Location</TableHead>
                <TableHead className="w-[150px]">Event Date</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead className="w-[100px] text-right">
                  Attendees
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((event) => (
                <TableRow
                  key={event.id}
                  className="hover:bg-muted/50 cursor-pointer"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-14 w-14 rounded-md">
                        <AvatarImage
                          src={
                            event.cover
                              ? `https://cdn.thrico.network/${event.cover}`
                              : "https://cdn.thrico.network/defaultEventCover.png"
                          }
                          alt={event.title}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-md">
                          <Calendar className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-tight">
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize mt-1">
                          {event.type?.toLowerCase()} •{" "}
                          {moment(event.startDate).format("MMM DD, YYYY")}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {event.location?.name || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium">
                        {moment(event.startDate).format("MMM DD, YYYY")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {event.startTime}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getTypeStyles(event.type)}
                    >
                      {event.type?.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusStyles(event.status)}
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        event.verification?.isVerified
                          ? "bg-blue-500/5 text-blue-600 border-blue-500/20"
                          : "bg-gray-500/5 text-gray-600 border-gray-500/20"
                      }
                    >
                      {event.verification?.isVerified
                        ? "Verified"
                        : "Unverified"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {event.numberOfAttendees || 0}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
