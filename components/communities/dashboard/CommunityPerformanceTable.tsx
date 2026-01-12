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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CommunityPerformanceData {
  key: string;
  name: string;
  slug: string;
  members: number;
  activePercentage: number;
  lastActivity: string;
}

interface CommunityPerformanceTableProps {
  data: CommunityPerformanceData[];
  getActivityColor: (percentage: number) => string;
}

export const CommunityPerformanceTable: React.FC<
  CommunityPerformanceTableProps
> = ({ data, getActivityColor }) => {
  return (
    <Card className="md:col-span-8 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Community Performance</CardTitle>
          <CardDescription>
            Detailed metrics for your communities
          </CardDescription>
        </div>
        <Button variant="outline" size="sm">
          Export Data
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Community Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Active %</TableHead>
                <TableHead>Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((record) => (
                <TableRow key={record.key}>
                  <TableCell className="font-medium">
                    <a
                      href="#"
                      className="text-primary hover:underline hover:text-primary/80"
                    >
                      {record.name}
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {record.slug}
                  </TableCell>
                  <TableCell>{record.members.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden w-24">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${record.activePercentage}%`,
                            backgroundColor: getActivityColor(
                              record.activePercentage
                            ),
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground w-8 text-right">
                        {record.activePercentage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {record.lastActivity}
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
