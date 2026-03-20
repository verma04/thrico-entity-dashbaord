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
  Users, 
  Calendar, 
  Search, 
  ChevronRight,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Building2
} from "lucide-react";
import moment from "moment";
import { getStatusTag, getVerificationTag } from "./utils";
import Actions from "./action";
import type { Job } from "./ts-types";
import { cn } from "@/lib/utils";

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
      <div className="rounded-4xl border border-slate-200/60 bg-white shadow-xl shadow-slate-200/30 overflow-hidden transition-all duration-500">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b-slate-100 h-14">
              <TableHead className="px-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Position & Context</TableHead>
              <TableHead className="px-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Corporate Details</TableHead>
              <TableHead className="px-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Status & Trusted</TableHead>
              <TableHead className="px-6 font-black uppercase text-[10px] tracking-widest text-slate-400 text-center">Engagement</TableHead>
              <TableHead className="px-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Registry Date</TableHead>
              <TableHead className="px-6 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((record) => (
                <TableRow 
                  key={record.id} 
                  className="group hover:bg-slate-50/80 transition-all duration-300 border-b-slate-50 last:border-0"
                >
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative group/avatar">
                        <Avatar className="h-14 w-14 rounded-2xl border border-white shadow-sm transition-transform group-hover/avatar:scale-105 duration-300 ring-2 ring-slate-50">
                          <AvatarImage
                            src={record.company?.logo ? `https://cdn.thrico.network/${record.company.logo}` : ""}
                            alt={record.company?.name || "Job Title"}
                            className="object-cover"
                          />
                          <AvatarFallback className="rounded-2xl bg-indigo-50 text-indigo-600 font-black text-sm uppercase">
                            {record.title?.substring(0, 2) || "JB"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col gap-0.5">
                         <div className="flex items-center gap-2">
                           <p className="font-extrabold text-slate-900 leading-tight tracking-tight text-sm group-hover:text-indigo-600 transition-colors">
                            {record.title}
                           </p>
                           <span className="bg-indigo-50/50 text-indigo-600 border border-indigo-100 text-[9px] font-black uppercase px-2 py-0.5 rounded-lg tracking-tighter">
                             {record.jobType}
                           </span>
                         </div>
                         <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                            <MapPin className="h-3 w-3 text-indigo-400" />
                            <span>{record.location}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-200 mx-1" />
                            <span className="text-indigo-500 font-black">{record.workplaceType} Environment</span>
                         </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs uppercase tracking-tight">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          <span>{record.company?.name}</span>
                       </div>
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-5">
                          Enterprise Entity
                       </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                       <div className="scale-90 origin-left">
                          {getStatusTag(record.status)}
                       </div>
                       <div className="scale-90 origin-left">
                          {getVerificationTag(record.verification?.isVerified || false)}
                       </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex flex-col items-center">
                       <div className="h-9 w-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-800 text-sm shadow-sm group-hover:bg-white group-hover:border-indigo-100 transition-all duration-300">
                           {record.numberOfApplicant || 0}
                       </div>
                       <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1.5">Applicants</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex flex-col">
                       <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                          <Calendar className="h-4 w-4 text-indigo-500" />
                          <span>{moment(record.createdAt).format("MMM DD, YYYY")}</span>
                       </div>
                       <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1 pl-5">
                          Registry Entry
                       </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 text-right">
                    <div className="flex justify-end pr-2">
                       <Actions {...record} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-72 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-5 text-slate-400">
                    <div className="p-6 bg-slate-50 rounded-full ring-8 ring-slate-50/50">
                       <Briefcase className="h-10 w-10 text-slate-300" />
                    </div>
                    <div>
                      <p className="font-black uppercase text-xs tracking-widest text-slate-600 mb-1.5">
                        No Opportunities Identified
                      </p>
                      <p className="text-sm font-medium text-slate-400">
                        Try expanding your filter parameters or search criteria.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Premium Pagination */}
      {data && data.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 py-2">
          <div className="flex items-center gap-3">
             <div className="flex -space-x-2">
               {[...Array(Math.min(data.length, 3))].map((_, i) => (
                 <div key={i} className="h-9 w-9 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 z-[10-i] shadow-sm">
                   {i + 1}
                 </div>
               ))}
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">
               Ecosystem Page <span className="text-indigo-600 mx-1">{currentPage}</span> of {totalPages}
             </p>
          </div>

          <div className="flex items-center gap-3">
             <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-11 px-6 rounded-2xl border-slate-200 hover:bg-slate-50 font-black text-xs shadow-sm transition-all active:scale-95 disabled:opacity-30"
              >
                Previous
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-11 px-6 rounded-2xl bg-slate-900 hover:bg-black font-black text-xs shadow-sm transition-all active:scale-95 disabled:opacity-30"
              >
                Next
              </Button>
          </div>
        </div>
      )}
    </div>
  );
}
