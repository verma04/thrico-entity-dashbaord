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
  RotateCcw,
  Upload,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import moment from "moment";
import { cn } from "@/lib/utils";

export default function JobApplicantsPage() {
  const pathname = usePathname();
  const id = pathname?.split("/")[2];
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"grid" | "list">("list");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const limit = 12;

  const { data, loading, refetch } = useJobApplicants(id, page, limit, {
    skip: !id,
  });

  const applicants = data?.getJobApplicants?.data || [];
  const total = data?.getJobApplicants?.total || 0;
  const totalPages = data?.getJobApplicants?.totalPages || 1;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (refetch) {
        await refetch();
      }
      toast.success("Applicants roster updated");
    } catch {
      toast.error("Failed to refresh applicants");
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const handleExportApplicants = () => {
    if (applicants.length === 0) {
      toast.error("No applicants to export");
      return;
    }

    const csv = buildCsv(applicants, [
      { header: "Applicant ID", getValue: (a: any) => a.id },
      { header: "Full Name", getValue: (a: any) => a.fullName || "" },
      { header: "Email", getValue: (a: any) => a.email || "" },
      { header: "Phone", getValue: (a: any) => a.phone || "" },
      { header: "Resume URL", getValue: (a: any) => a.resume || "" },
      {
        header: "Application Date",
        getValue: (a: any) =>
          a.createdAt
            ? moment(a.createdAt).format("YYYY-MM-DD HH:mm:ss")
            : "",
      },
    ]);

    downloadCsv(csv, `job-applicants-${moment().format("YYYY-MM-DD")}`);
    toast.success(`Exported ${applicants.length} applicant records`);
  };

  const withResumeCount = applicants.filter((a: any) => !!a.resume).length;

  return (
    <div className="space-y-6">
      {/* ── Subheader Action Bar ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/60 rounded-xl p-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              Candidate Roster & Submissions
            </h2>
            <Badge variant="secondary" className="text-[10px] font-semibold">
              {total} Candidates
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review submissions, applicant contact details, and attached portfolios for this listing.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* View Mode Toggle: Grid / List */}
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "grid" | "list")}
            className="bg-muted p-0.5 rounded-lg border border-border shrink-0"
          >
            <TabsList className="bg-transparent border-none h-auto p-0 gap-0.5">
              <TabsTrigger
                value="grid"
                className="h-7 px-2.5 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-2xs data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium gap-1"
              >
                <LayoutGrid className="h-3 w-3" />
                Grid
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="h-7 px-2.5 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-2xs data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium gap-1"
              >
                <ListIcon className="h-3 w-3" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="h-8 w-8 rounded-lg border-border/60 text-muted-foreground hover:text-foreground shadow-2xs"
            title="Refresh applicants"
          >
            <RotateCcw
              className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-primary")}
            />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportApplicants}
            className="h-8 text-xs font-medium gap-1.5 border-border/60 rounded-lg shadow-2xs hover:bg-muted"
          >
            <Upload className="h-3.5 w-3.5 text-muted-foreground" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* ── KPI Telemetry Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="border-border/60 bg-card shadow-2xs rounded-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Submissions
              </p>
              <p className="text-xl font-bold text-foreground mt-0.5">{total}</p>
            </div>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <Users className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-2xs rounded-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Resumes Attached
              </p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {withResumeCount}
              </p>
            </div>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
              <FileText className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card shadow-2xs rounded-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Current Page
              </p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                {page} <span className="text-xs text-muted-foreground font-normal">of {totalPages}</span>
              </p>
            </div>
            <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
              <Sparkles className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Candidates Container ────────────────────────────────────── */}
      <Card className="border border-border/60 shadow-2xs rounded-xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
          <CardTitle className="text-sm font-semibold text-foreground">
            All Candidates
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Review submissions, portfolio documents, and candidate profiles.
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
                    className="bg-card border border-border/80 hover:border-primary/40 rounded-xl p-3.5 shadow-2xs hover:shadow-md flex flex-col justify-between gap-3 group transition-all"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <Avatar className="h-10 w-10 rounded-lg border border-border/60">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>

                        {applicant.createdAt && (
                          <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 font-mono">
                            <Calendar className="h-2.5 w-2.5 shrink-0" />
                            {new Date(applicant.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
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
                        <Button variant="outline" size="sm" className="h-7 text-[11px] w-full gap-1 shadow-2xs font-semibold" asChild>
                          <a
                            href={applicant.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="h-3 w-3 text-primary" />
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
            <div className="border border-border/80 rounded-xl overflow-hidden bg-card shadow-2xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-semibold">Candidate</TableHead>
                    <TableHead className="text-xs font-semibold">Email</TableHead>
                    <TableHead className="text-xs font-semibold">Phone</TableHead>
                    <TableHead className="text-xs font-semibold">Applied Date</TableHead>
                    <TableHead className="text-right text-xs font-semibold">Resume</TableHead>
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
                      <TableRow key={applicant.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8 rounded-lg border border-border/60">
                              <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-semibold text-foreground">
                              {applicant.fullName || "Candidate"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {applicant.email || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {applicant.phone || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {applicant.createdAt
                            ? new Date(applicant.createdAt).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          {applicant.resume ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs gap-1 shadow-2xs font-semibold"
                              asChild
                            >
                              <a
                                href={applicant.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FileText className="h-3 w-3 text-primary" />
                                Resume
                                <ExternalLink className="h-2.5 w-2.5 ml-0.5 opacity-70" />
                              </a>
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground/60 italic">
                              None
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
            <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-4">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="h-7 w-7 p-0 rounded-lg shadow-2xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="h-7 w-7 p-0 rounded-lg shadow-2xs"
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
