"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Check, Sparkles, Clock, X, ArrowRight } from "lucide-react";
import moment from "moment";
import { useCheckEntitySubscription } from "@/graphql/actions";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TrialBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data } = useCheckEntitySubscription();
  const subscription = data?.checkEntitySubscription;

  const calculateRemainingTime = () => {
    if (!subscription?.endDate || isNaN(new Date(subscription?.endDate).getTime())) {
      return "N/A days remaining";
    }

    const diffMs = new Date(subscription.endDate).getTime() - new Date().getTime();
    if (diffMs <= 0) return "0 hours remaining";

    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < 24) {
      const hours = Math.ceil(diffHours);
      return `${hours} hour${hours === 1 ? "" : "s"} remaining`;
    }

    const diffDays = Math.ceil(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? "" : "s"} remaining`;
  };

  const remainingText = calculateRemainingTime();

  const items = [
    "Unlimited team members",
    "All features unlocked",
    "Priority 24/7 support",
  ];

  if (subscription?.subscriptionType !== "trial" || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
        className="fixed bottom-6 right-6 z-100 w-full max-w-[340px]"
      >
        <div 
          className={cn(
            "relative overflow-hidden rounded-2xl border border-border bg-background/80 backdrop-blur-xl shadow-2xl transition-all duration-300",
            isExpanded ? "ring-1 ring-primary/20" : "hover:border-primary/30"
          )}
        >
          {/* Accent Line */}
          <div className="absolute top-0 right-0 w-1 h-full bg-primary/80" />

          {/* Header */}
          <div className="p-4 flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Clock className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Free Trial</span>
                <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              </div>
              <h3 className="text-[13.5px] font-semibold text-foreground tracking-tight leading-none mb-1">
                {remainingText}
              </h3>
              <p className="text-[11.5px] text-muted-foreground line-clamp-1">
                Ends {moment(subscription?.endDate).format("MMM DD, YYYY")}
              </p>
            </div>

            <button 
              onClick={() => setIsDismissed(true)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground/40 hover:text-foreground hover:bg-accent transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Core Action */}
          <div className="px-4 pb-4 flex items-center gap-2">
            <Link href="/settings/subscription" className="flex-1">
              <Button 
                size="sm" 
                className="w-full h-8 px-3 text-[12px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-sm shadow-primary/20 rounded-lg group"
              >
                Upgrade Plan
                <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "h-8 px-3 text-[11px] font-medium rounded-lg border border-border hover:bg-accent transition-all shrink-0",
                isExpanded && "bg-accent text-foreground"
              )}
            >
              {isExpanded ? "Close" : "Features"}
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
                <div className="p-4 space-y-4">
                  <div className="space-y-2.5">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <div className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/10">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-[12px] text-foreground/80 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-2.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-700/80 leading-relaxed font-medium">
                      Lock in early-bird pricing before your trial expires. Your growth is our priority.
                    </p>
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
