"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const recentMembers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.j@example.com",
    role: "Admin",
    status: "Active",
    joined: "2 mins ago",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    role: "Member",
    status: "Active",
    joined: "15 mins ago",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "m.brown@example.com",
    role: "Moderator",
    status: "Away",
    joined: "1 hour ago",
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma.d@example.com",
    role: "Member",
    status: "Offline",
    joined: "3 hours ago",
    avatar: "/placeholder.svg",
  },
  {
    id: 5,
    name: "James Wilson",
    email: "j.wilson@example.com",
    role: "Contributor",
    status: "Active",
    joined: "5 hours ago",
    avatar: "/placeholder.svg",
  },
];

export const RecentMembersTable = () => {
  return (
    <Card className="md:col-span-12 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Members</CardTitle>
          <CardDescription>Latest joiners to your community</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All Members
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{member.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {member.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : member.status === "Away"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {member.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {member.joined}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
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
  );
};
