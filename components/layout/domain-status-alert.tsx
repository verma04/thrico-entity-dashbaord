"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ChevronRight, X, ExternalLink, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { getCustomDomain } from "@/graphql/actions/domain";
import { useCheckEntitySubscription } from "@/graphql/actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function DomainStatusAlert() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { data, loading } = getCustomDomain();
  const { data: subData } = useCheckEntitySubscription();

  const domain = data?.getCustomDomain;
  const isTrial = subData?.checkEntitySubscription?.subscriptionType === "trial";

  const shouldShow = useMemo(() => {
    if (loading || !domain || isDismissed) return false;
    return !domain.isVerified;
  }, [loading, domain, isDismissed]);

  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
        className={cn(
          "fixed right-6 z-50 w-full max-w-[340px]",
          isTrial ? "bottom-[120px]" : "bottom-6"
        )}
      >
        <div 
          className={cn(
            "relative overflow-hidden rounded-2xl border border-border bg-background/80 backdrop-blur-xl shadow-2xl transition-all duration-300",
            isExpanded ? "ring-1 ring-amber-500/20" : "hover:border-amber-500/30"
          )}
        >
          {/* Status Bar */}
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/80" />

          {/* Header/Summary */}
          <div className="p-4 flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <ShieldAlert className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Action Required</span>
                <div className="h-1 w-1 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <h3 className="text-[13.5px] font-semibold text-foreground tracking-tight leading-none mb-1">
                Domain Verification
              </h3>
              <p className="text-[11.5px] text-muted-foreground line-clamp-1">
                {domain?.domain} needs setup
              </p>
            </div>

            <button 
              onClick={() => setIsDismissed(true)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground/40 hover:text-foreground hover:bg-accent transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Actions */}
          <div className="px-4 pb-4 flex items-center gap-2">
            <Link href="/settings/domains" className="flex-1">
              <Button 
                size="sm" 
                className="w-full h-8 px-3 text-[12px] font-semibold bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm shadow-amber-500/20 rounded-lg group"
                onClick={() => setIsExpanded(false)}
              >
                Verify Now
                <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "h-8 px-3 text-[11px] font-medium rounded-lg border border-border hover:bg-accent transition-all shrink-0",
                isExpanded && "bg-accent text-foreground"
              )}
            >
              {isExpanded ? "Less" : "Details"}
            </button>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-muted/30 border-t border-border/50"
              >
                <div className="p-4 space-y-3">
                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                    Connecting your custom domain ensures your community members recognize your brand. Setup usually takes less than 5 minutes.
                  </p>
                  
                  <div className="rounded-lg bg-background/50 border border-border/50 p-2.5 flex items-center justify-between group cursor-pointer hover:border-amber-500/30 transition-all">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-amber-500/5 flex items-center justify-center">
                        <ExternalLink className="h-3 w-3 text-amber-600" />
                      </div>
                      <span className="text-[11px] font-medium text-foreground">View DNS Instructions</span>
                    </div>
                    <ChevronRight className="h-3 w-3 text-muted-foreground/30 group-hover:text-amber-500 transition-colors" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
