"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import moment from "moment";

interface MatchWinActivityLogProps {
  playsData: any;
}

export const MatchWinActivityLog = ({
  playsData,
}: MatchWinActivityLogProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">User</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="text-right pr-6">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {playsData?.getMatchWinPlays?.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell className="pl-6 font-medium">
                  {p.user?.firstName} {p.user?.lastName}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      p.prizeType === "NOTHING" ? "secondary" : "default"
                    }
                  >
                    {p.prizeType}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold">{p.prizeValue} TC</TableCell>
                <TableCell className="text-right pr-6 text-xs text-slate-500">
                  {moment(p.playedAt).fromNow()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
