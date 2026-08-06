"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Globe, Zap, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useModuleStore } from "@/store/useModuleStore";

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
  const singularName = useModuleStore((state) => state.communitySingularName);

  return (
    <div className="p-10 rounded-[3.5rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col h-full">
        <div className="rounded-3xl border border-slate-100 overflow-hidden bg-slate-50/30">
          <Table>
            <TableHeader className="bg-slate-900 border-none">
              <TableRow className="hover:bg-slate-900 border-none">
                <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] h-14 pl-8">Network Node</TableHead>
                <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] h-14">Slug Identifier</TableHead>
                <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] h-14">Density</TableHead>
                <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] h-14">Engagement Pulse</TableHead>
                <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] h-14 pr-8 text-right">Last Telemetry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((record) => (
                <TableRow key={record.key} className="group border-slate-100 hover:bg-slate-50 transition-colors">
                  <TableCell className="py-6 pl-8">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:text-indigo-600 transition-all">
                           <Globe className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{record.name}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{singularName} Instance</span>
                        </div>
                     </div>
                  </TableCell>
                  <TableCell>
                     <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                        /{record.slug}
                     </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tabular-nums">{record.members.toLocaleString()}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Verified Members</span>
                     </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-32 shadow-inner">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)] relative"
                          style={{
                            width: `${record.activePercentage}%`,
                            backgroundColor: getActivityColor(
                              record.activePercentage
                            ),
                          }}
                        >
                           <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end min-w-[40px]">
                         <span className="text-xs font-black text-slate-900 tabular-nums">
                           {record.activePercentage}%
                         </span>
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Engagement</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                     <div className="flex flex-col items-end">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{record.lastActivity}</span>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500 uppercase tracking-tighter mt-1">
                           <Zap className="h-2.5 w-2.5 fill-current" />
                           Active Stream
                        </div>
                     </div>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                   <TableCell colSpan={5} className="h-40 text-center">
                      <div className="flex flex-col items-center gap-4">
                         <Search className="h-8 w-8 text-slate-200" />
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No telemetry data matching current matrix</p>
                      </div>
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
  );
};
