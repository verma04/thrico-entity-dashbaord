"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, UserPlus, Pencil, Search } from "lucide-react";

const initialAttendees = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    ticketType: "Regular",
    status: "confirmed",
    checkedIn: true,
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    ticketType: "VIP",
    status: "confirmed",
    checkedIn: false,
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    ticketType: "Regular",
    status: "confirmed",
    checkedIn: true,
  },
  {
    id: "4",
    name: "Sarah Davis",
    email: "sarah.davis@example.com",
    ticketType: "Student",
    status: "confirmed",
    checkedIn: false,
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@example.com",
    ticketType: "Regular",
    status: "waitlisted",
    checkedIn: false,
  },
  {
    id: "6",
    name: "Jennifer Lee",
    email: "jennifer.lee@example.com",
    ticketType: "Early Bird",
    status: "confirmed",
    checkedIn: true,
  },
  {
    id: "7",
    name: "Robert Taylor",
    email: "robert.taylor@example.com",
    ticketType: "VIP",
    status: "confirmed",
    checkedIn: false,
  },
];

function EventAttendees() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAttendees = initialAttendees.filter((attendee) => {
    const matchFilter =
      filter === "all"
        ? true
        : filter === "checked-in"
        ? attendee.checkedIn
        : filter === "vip"
        ? attendee.ticketType === "VIP"
        : attendee.status === filter;

    const matchSearch =
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Attendees</h2>
        <div className="flex gap-2">
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Attendee
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <CardHeader className="bg-muted/30">
          <CardTitle>Attendee Management</CardTitle>
          <CardDescription>
            Manage and track all event attendees
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search attendees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter attendees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Attendees</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="waitlisted">Waitlisted</SelectItem>
                <SelectItem value="checked-in">Checked In</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ticket Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell className="font-medium">
                      {attendee.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {attendee.email}
                    </TableCell>
                    <TableCell>{attendee.ticketType}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant="outline"
                          className={
                            attendee.status === "confirmed"
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                          }
                        >
                          {attendee.status.charAt(0).toUpperCase() +
                            attendee.status.slice(1)}
                        </Badge>
                        {attendee.checkedIn && (
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-600 border-blue-500/20"
                          >
                            Checked In
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EventAttendees;
