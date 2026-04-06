"use client";
import { Globe2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getThricoDomain } from "@/graphql/actions/domain";
import DomainChange from "./domain-change";
import { cn } from "@/lib/utils";

export const ThricoDomain = () => {
  const { data, loading } = getThricoDomain();

  if (loading) {
    return <Skeleton className="h-20 rounded-lg border border-slate-200/60 bg-white" />;
  }

  const domain = data?.getThricoDomain?.domain;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-slate-200/60 bg-white transition-all duration-200 hover:bg-slate-50/30">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
          <Globe2 className="h-5 w-5 text-slate-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-semibold text-slate-900 leading-none tracking-tight">
              https://{domain}.thrico.community
            </p>
            <span className="inline-flex items-center gap-1.2 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              System Edge
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">Default subdomain provided by Thrico</p>
        </div>
      </div>
      <div>
        <DomainChange />
      </div>
    </div>
  );
};
