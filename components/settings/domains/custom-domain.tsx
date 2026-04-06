"use client";
import { Globe2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCustomDomain } from "@/graphql/actions/domain";
import { cn } from "@/lib/utils";

export const CustomDomain = () => {
  const router = useRouter();
  const { data } = getCustomDomain();

  if (!data?.getCustomDomain?.id) {
    return null;
  }

  const domain = data.getCustomDomain;
  const isVerified = domain.isVerified;

  return (
    <div
      onClick={() => router.push(`/settings/domains/${domain.id}`)}
      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-slate-200/60 bg-white cursor-pointer transition-all duration-200 hover:bg-slate-50/50"
    >
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
          <Globe2 className="h-5 w-5 text-slate-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-semibold text-slate-900 leading-none tracking-tight">
              {domain.domain}
            </p>
            {isVerified ? (
              <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                <span className="h-1 w-1 rounded-full bg-amber-500 animate-pulse" />
                Incomplete
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">Custom Domain</p>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <div className="h-7 w-7 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all">
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};
