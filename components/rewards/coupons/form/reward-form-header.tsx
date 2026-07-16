import React from "react";
import Link from "next/link";
import { ChevronLeft, Sparkles, Ticket, ChevronRight } from "lucide-react";
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
  icon: Icon = Sparkles,
}: RewardFormHeaderProps) {
  return (
    <div className="sticky top-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={backUrl}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="h-4 w-px bg-border/50" />
          <div>
            <div className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 text-amber-500" />
              <h1 className="text-sm font-bold tracking-tight">{title}</h1>
            </div>
            {subtitle && (
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
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
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b px-6 py-4">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
              <Ticket className="h-5 w-5 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb}>
                <span>{crumb}</span>
                {idx < breadcrumbs.length - 1 && (
                  <ChevronRight className="h-3 w-3" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex gap-3">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
