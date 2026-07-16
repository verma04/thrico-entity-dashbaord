"use client";

import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, FileText, Calendar } from "lucide-react";
import { Job, useJobApplicants } from "../../graphql/actions/jobs";
import TableLoading from "../layout/table-loading";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useModuleStore } from "@/store/useModuleStore";

const ITEMS_PER_PAGE = 5;

const ApplicantsDrawer = ({
  job,
  isOpen,
  setIsOpen,
}: {
  job: Job | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const singularName = useModuleStore((state) => state.jobSingularName);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setPage(1);
    }
  }, [isOpen, job?.id]);

  const { data, loading } = useJobApplicants(job?.id || "", page, ITEMS_PER_PAGE, {
    skip: !isOpen || !job,
  });

  const response = data?.getJobApplicants;
  const applicants = response?.data || [];
  const totalPages = response?.totalPages || 1;
  const totalApplicants = response?.total || 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Applicants for {job?.title}</SheetTitle>
          <SheetDescription>
            {job?.company?.name ? `At ${job.company.name} ` : ""}
            ({totalApplicants} total applicants)
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {loading ? (
            <TableLoading />
          ) : applicants.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground border rounded-lg bg-muted/20">
              <p>No applicants found for this {singularName.toLowerCase()}.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 min-h-[300px]">
                {applicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className="p-4 border rounded-xl bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12 border border-border/60">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {applicant.fullName?.substring(0, 2).toUpperCase() || "AP"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold">{applicant.fullName}</h4>
                        <div className="flex flex-col gap-1 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5" />
                            <a
                              href={`mailto:${applicant.email}`}
                              className="hover:underline hover:text-primary transition-colors"
                            >
                              {applicant.email}
                            </a>
                          </div>
                          {applicant.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{applicant.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              Applied on{" "}
                              {moment(applicant.createdAt).format("MMM DD, YYYY")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => window.open(applicant.resume, "_blank")}
                        disabled={!applicant.resume}
                      >
                        <FileText className="w-4 h-4" />
                        View Resume
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pt-4 pb-2 border-t mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      <PaginationItem>
                        <div className="flex items-center px-4 text-sm font-medium">
                          Page {page} of {totalPages}
                        </div>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ApplicantsDrawer;
