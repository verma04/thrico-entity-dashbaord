import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { GamificationActivityLogEntry } from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityLogTableProps {
  logs: GamificationActivityLogEntry[];
  isLoading: boolean;
}

export function ActivityLogTable({ logs, isLoading }: ActivityLogTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No activity logs found.
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow
                key={log.id}
                className="group hover:bg-muted/50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                      <AvatarImage
                        src={`https://cdn.thrico.network/${log.user.avatar}`}
                      />
                      <AvatarFallback>
                        {log.user.firstName[0]}
                        {log.user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {log.user.firstName} {log.user.lastName}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {log.user.id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-medium">
                    {log.type.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-bold font-mono ${log.points >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {log.points >= 0 ? "+" : ""}
                    {log.points}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(log.createdAt), "MMM d, yyyy • HH:mm")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
