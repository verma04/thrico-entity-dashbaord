"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { 
  Video, 
  Search, 
  ChevronDown, 
  Filter, 
  VideoIcon
} from "lucide-react";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export default function MomentsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/moments/all?${params.toString()}`);
  };

  return (
    <EcosystemWrapper>
      {/* Premium Header */}
      <EcosystemHeader 
        title="Moments"
        badgeText="Content Ecosystem"
        description="Curate and oversee immersive video content captured by your community members."
        icon={VideoIcon}
        actions={
          <Button className="font-semibold text-xs px-6 h-10 rounded-lg shadow-sm gap-2">
            <Plus className="h-4 w-4" />
            Upload Moment
          </Button>
        }
      />

      {/* Action Bar */}
      <EcosystemActionBar showLiveIndicator={false}>
        <div className="relative w-full md:w-[450px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <Input 
            placeholder="Search by caption, owner or ID..."
            value={searchQuery}
            onChange={(e) => updateFilters({ q: e.target.value })}
            className="h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus-visible:ring-4 focus-visible:ring-indigo-500/5 transition-all font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-4 pr-4 ml-auto">
           <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 shadow-sm">
              <Filter className="h-4 w-4" />
           </Button>
           <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Moments
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 bg-transparent border-none shadow-none ring-0">
        {children}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
