"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useJobApplicants } from "@/graphql/actions/jobs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function JobApplicantsPage() {
  const pathname = usePathname();
  const id = pathname?.split("/")[2];
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, loading } = useJobApplicants(id, page, limit, {
    skip: !id,
  });

  const applicants = data?.getJobApplicants?.data || [];
  const total = data?.getJobApplicants?.total || 0;
  const totalPages = data?.getJobApplicants?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Applicants</h2>
          <p className="text-sm text-muted-foreground">
            {total} total application{total !== 1 ? "s" : ""} received
          </p>
        </div>
        <Badge
          variant="secondary"
          className="gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold"
        >
          <Users className="h-3.5 w-3.5" />
          {total}
        </Badge>
      </div>

      <Card className="border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            All Applicants
          </CardTitle>
          <CardDescription>
            People who have applied for this position
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : applicants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-5 rounded-2xl bg-muted/50 mb-5 ring-1 ring-border/30">
                <Users className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-semibold mb-1">No applicants yet</p>
              <p className="text-xs text-muted-foreground max-w-[280px]">
                Applications will appear here once candidates start applying for
                this position.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Name
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Phone
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Applied
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                      Resume
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicants.map((applicant: any) => (
                    <TableRow
                      key={applicant.id}
                      className="border-border/30 hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-border/40">
                            <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                              {applicant.fullName
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">
                            {applicant.fullName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {applicant.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {applicant.phone || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {applicant.createdAt
                          ? new Date(applicant.createdAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {applicant.resume ? (
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={applicant.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-primary hover:text-primary/80"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
                  <p className="text-xs text-muted-foreground font-medium">
                    Page{" "}
                    <span className="text-foreground font-semibold">
                      {page}
                    </span>{" "}
                    of{" "}
                    <span className="text-foreground font-semibold">
                      {totalPages}
                    </span>
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="h-8 w-8 p-0 rounded-lg"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="px-3 py-1 rounded-lg bg-muted/50 text-xs font-semibold tabular-nums">
                      {page}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="h-8 w-8 p-0 rounded-lg"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
