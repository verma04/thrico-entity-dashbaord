"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ChevronRight,
  ExternalLink,
  ChevronLeft,
  Building2,
  Users2
} from "lucide-react";
import moment from "moment";
import { getStatusTag, getVerificationTag } from "./utils";
import Actions from "./action";
import { Job } from "@/graphql/actions/jobs";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Jobs({ data }: { data: Job[] | undefined }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const totalPages = data ? Math.ceil(data.length / pageSize) : 0;
  const paginatedData = data?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[24px] border border-border bg-card shadow-sm transition-all duration-300">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-b-border h-12">
              <TableHead className="px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Job & Location</TableHead>
              <TableHead className="px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Company</TableHead>
              <TableHead className="px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 text-center">Status</TableHead>
              <TableHead className="px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 text-center">Applicants</TableHead>
              <TableHead className="px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Posted</TableHead>
              <TableHead className="px-6 text-right w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="wait">
              {paginatedData && paginatedData.length > 0 ? (
                paginatedData.map((record, idx) => (
                  <motion.tr 
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group border-b border-border/40 last:border-0 hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 rounded-xl border border-border shadow-sm group-hover:scale-105 transition-all duration-300">
                          <AvatarImage
                            src={record.company?.logo ? `https://cdn.thrico.network/${record.company.logo}` : ""}
                            alt={record.company?.name || "Job Title"}
                            className="object-cover"
                          />
                          <AvatarFallback className="rounded-xl bg-primary/5 text-primary font-bold text-xs">
                            {record.title?.substring(0, 2) || "JB"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[13.5px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                              {record.title}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-tighter bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">
                              {record.jobType}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                            <MapPin className="h-3 w-3 opacity-50" />
                            <span>{record.location}</span>
                            <span className="mx-1 opacity-20">•</span>
                            <span>{record.workplaceType}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[12.5px] font-medium text-foreground/80">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground/40" />
                        {record.company?.name}
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="scale-[0.85] origin-center">
                          {getStatusTag(record.status)}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50 border border-border/50 text-[12px] font-bold text-foreground tabular-nums">
                        <Users2 className="h-3 w-3 opacity-40 ml-0.5" />
                        {record.numberOfApplicant || 0}
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[11.5px] font-medium text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 opacity-40" />
                        {moment(record.createdAt).format("MMM DD, YYYY")}
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4 text-right">
                      <Actions {...record} />
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 rounded-2xl bg-muted/50 text-muted-foreground/40">
                        <Briefcase className="h-10 w-10" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[14px] font-semibold text-foreground">No jobs found</p>
                        <p className="text-[12px] text-muted-foreground">Try adjusting your filters or search terms.</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Modern Pagination */}
      {data && data.length > pageSize && (
        <div className="flex items-center justify-between px-2 pt-2">
          <p className="text-[11.5px] font-medium text-muted-foreground pl-2">
            Showing <span className="font-bold text-foreground">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-bold text-foreground">{Math.min(currentPage * pageSize, data.length)}</span> of <span className="font-bold text-foreground">{data.length}</span> jobs
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 rounded-lg border-border hover:bg-muted transition-all disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "h-8 min-w-[32px] px-2 rounded-lg text-[11.5px] font-bold transition-all",
                    currentPage === i + 1 
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 rounded-lg border-border hover:bg-muted transition-all disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
