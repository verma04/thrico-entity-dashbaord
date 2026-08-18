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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  LayoutGrid,
  List as ListIcon,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function JobApplicantsPage() {
  const pathname = usePathname();
  const id = pathname?.split("/")[2];
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"grid" | "list">("list");
  const limit = 12;

  const { data, loading } = useJobApplicants(id, page, limit, {
    skip: !id,
  });

  const applicants = data?.getJobApplicants?.data || [];
  const total = data?.getJobApplicants?.total || 0;
  const totalPages = data?.getJobApplicants?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-sm border border-border/70 rounded-xl p-4 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
            Applicants
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {total} total application{total !== 1 ? "s" : ""} received for this position.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Grid / List */}
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "grid" | "list")}
            className="bg-muted p-0.5 rounded-lg border border-border shrink-0"
          >
            <TabsList className="bg-transparent border-none h-auto p-0 gap-0.5">
              <TabsTrigger
                value="grid"
                className="h-7 px-2.5 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium gap-1"
              >
                <LayoutGrid className="h-3 w-3" />
                Grid
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="h-7 px-2.5 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium gap-1"
              >
                <ListIcon className="h-3 w-3" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Badge
            variant="secondary"
            className="gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold"
          >
            <Users className="h-3.5 w-3.5" />
            {total}
          </Badge>
        </div>
      </div>

      <Card className="border border-border/70 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
          <CardTitle className="text-sm font-semibold">
            All Candidates
          </CardTitle>
          <CardDescription className="text-xs">
            Review submissions and attached resumes for this listing.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
            </div>
          ) : applicants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 rounded-xl bg-muted/50 mb-3 ring-1 ring-border/30">
                <Users className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="text-xs font-semibold text-foreground mb-0.5">No applicants yet</p>
              <p className="text-xs text-muted-foreground max-w-[280px]">
                Applications will appear here once candidates start applying.
              </p>
            </div>
          ) : view === "grid" ? (
            /* ─── GRID VIEW ─────────────────────────────────────────────── */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {applicants.map((applicant: any) => {
                const initials = applicant.fullName
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase() || "A";

                return (
                  <div
                    key={applicant.id}
                    className="bg-card border border-border/80 hover:border-border rounded-xl p-3.5 shadow-sm flex flex-col justify-between gap-3 group transition-all"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <Avatar className="h-10 w-10 rounded-lg border border-border/60">
                          <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>

                        {applicant.createdAt && (
                          <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                            <Calendar className="h-2.5 w-2.5 shrink-0" />
                            {new Date(applicant.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-foreground truncate">
                          {applicant.fullName || "Candidate"}
                        </h4>
                        <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{applicant.email || "—"}</span>
                        </p>
                        {applicant.phone && (
                          <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3 shrink-0" />
                            <span className="truncate">{applicant.phone}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                      {applicant.resume ? (
                        <Button variant="outline" size="sm" className="h-7 text-[11px] w-full gap-1" asChild>
                          <a
                            href={applicant.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="h-3 w-3" />
                            View Resume
                            <ExternalLink className="h-2.5 w-2.5 ml-auto opacity-70" />
                          </a>
                        </Button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic w-full text-center">
                          No Resume Attached
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ─── LIST VIEW ─────────────────────────────────────────────── */
            <div className="border border-border/80 rounded-xl overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs">Candidate</TableHead>
                    <TableHead className="text-xs">Email</TableHead>
                    <TableHead className="text-xs">Phone</TableHead>
                    <TableHead className="text-xs">Applied Date</TableHead>
                    <TableHead className="text-right text-xs">Resume</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicants.map((applicant: any) => {
                    const initials = applicant.fullName
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase() || "A";

                    return (
                      <TableRow key={applicant.id}>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-7 w-7 rounded-md border border-border/60">
                              <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-semibold text-foreground truncate">
                              {applicant.fullName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs py-3">
                          {applicant.email}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs py-3">
                          {applicant.phone || "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs py-3">
                          {applicant.createdAt
                            ? new Date(applicant.createdAt).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right py-3">
                          {applicant.resume ? (
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 text-primary hover:text-primary/80" asChild>
                              <a
                                href={applicant.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              —
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

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
                  className="h-7 w-7 p-0 rounded-md"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <div className="px-2.5 py-0.5 rounded-md bg-muted/60 text-xs font-semibold tabular-nums">
                  {page}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="h-7 w-7 p-0 rounded-md"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

