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
import { Loader2, Calendar, MapPin, Users } from "lucide-react";
import moment from "moment";
import { Event } from "@/graphql/actions/events";

export default function AllEvents({
  data,
  loading,
}: {
  data: Event[] | undefined;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            No events found matching your criteria
          </p>
        </CardContent>
      </Card>
    );
  }

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
                <TableRow key={event.id} className="hover:bg-muted/50">
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
                      className={
                        event.type === "ONLINE"
                          ? "bg-blue-500/5 text-blue-600 border-blue-500/20"
                          : event.type === "HYBRID"
                          ? "bg-purple-500/5 text-purple-600 border-purple-500/20"
                          : "bg-green-500/5 text-green-600 border-green-500/20"
                      }
                    >
                      {event.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        event.status === "APPROVED"
                          ? "bg-green-500/5 text-green-600 border-green-500/20"
                          : event.status === "PENDING"
                          ? "bg-orange-500/5 text-orange-600 border-orange-500/20"
                          : event.status === "REJECTED"
                          ? "bg-red-500/5 text-red-600 border-red-500/20"
                          : "bg-gray-500/5 text-gray-600 border-gray-500/20"
                      }
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
