import React from "react";
import Link from "next/link";
import { ChevronLeft, Ticket, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RewardFormHeaderProps {
  title: string;
  subtitle?: string;
  backUrl: string;
  icon?: any;
}

export function RewardFormHeader({
  title,
  subtitle,
  backUrl,
  icon: Icon = Ticket,
}: RewardFormHeaderProps) {
  return (
    <div className="sticky top-0 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={backUrl}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
          <div>
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-[#008060]" />
              <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RewardStudioHeader({
  title,
  breadcrumbs,
  onCancel,
}: {
  title: string;
  breadcrumbs: string[];
  onCancel: () => void;
}) {
  return (
    <div className="sticky top-0 z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border-b border-zinc-200/80 dark:border-zinc-800 px-4 sm:px-6 md:px-8 py-4">
      <div className="max-w-[1040px] mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-[#008060]/10 ring-1 ring-[#008060]/20 text-[#008060]">
              <Ticket className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 ml-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb}>
                <span className={idx === breadcrumbs.length - 1 ? "font-semibold text-zinc-900 dark:text-zinc-200" : ""}>
                  {crumb}
                </span>
                {idx < breadcrumbs.length - 1 && (
                  <ChevronRight className="h-3 w-3 text-zinc-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="border-zinc-200 dark:border-zinc-700 text-xs font-semibold rounded-lg"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
