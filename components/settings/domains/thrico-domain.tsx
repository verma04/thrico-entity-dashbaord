"use client";
import { Globe2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getThricoDomain } from "@/graphql/actions/domain";
import DomainChange from "./domain-change";
import { cn } from "@/lib/utils";

export const ThricoDomain = () => {
  const { data, loading } = getThricoDomain();

  if (loading) {
    return <Skeleton className="h-20 rounded-lg border border-border/50 bg-card" />;
  }

  const domain = data?.getThricoDomain?.domain;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border/50 bg-card transition-all duration-200 hover:bg-muted/30">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-md bg-muted border border-border/50 flex items-center justify-center shrink-0">
          <Globe2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-semibold text-foreground leading-none tracking-tight">
              https://{domain}.thrico.community
            </p>
            <span className="inline-flex items-center gap-1.2 px-1.5 py-0.5 rounded bg-muted border border-border/50 text-[10px] font-bold text-foreground uppercase tracking-widest">
              System Edge
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">Default subdomain provided by Thrico</p>
        </div>
      </div>
      <div>
        <DomainChange />
      </div>
    </div>
  );
};
