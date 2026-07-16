import React from "react";
import { Eye, Ticket, Zap, Sparkles, ArrowRight, Sparkle, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RewardPreviewSidebarProps {
  formik: any;
  showStrategy?: boolean;
}

export function RewardPreviewSidebar({ formik, showStrategy = false }: RewardPreviewSidebarProps) {
  return (
    <div className="relative">
      <div className="sticky top-28 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Live Preview
            </span>
          </div>
          <Eye className="h-3.5 w-3.5 text-muted-foreground opacity-20" />
        </div>

        {/* Phone-style preview */}
        <div className="relative aspect-[3/4] w-full max-w-[340px] mx-auto group">
          <div className="absolute inset-0 bg-amber-500/10 blur-[60px] rounded-full group-hover:bg-amber-500/20 transition-all duration-700" />

          <div className="relative h-full w-full bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl border border-white/40 dark:border-white/5 overflow-hidden flex flex-col p-2">
            <div className="flex-1 rounded-[24px] bg-[#f8f9ff] dark:bg-black/40 overflow-hidden flex flex-col">
              {/* Header Image */}
              <div className="h-[200px] w-full bg-muted relative">
                {formik.values.image ? (
                  <img
                    src={formik.values.image.startsWith("http") ? formik.values.image : `https://cdn.thrico.network/${formik?.values?.image}`}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/10">
                    <Ticket className="h-8 w-8 text-indigo-400 opacity-20" />
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-2">
                      No Image
                    </p>
                  </div>
                )}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-black/80 dark:bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20">
                    <Zap className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-[12px] font-bold text-white dark:text-black leading-none">
                      {formik.values.tcCost || 0} Points
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col h-full">
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-500">
                        {formik.values.rewardMechanism
                          ? String(formik.values.rewardMechanism).replace(/_/g, " ")
                          : "COUPON"}
                      </span>
                      {["SCRATCH_CARD", "SPIN_WHEEL", "MATCH_AND_WIN"].includes(
                        String(formik.values.rewardMechanism),
                      ) && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-[8px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-tighter">
                          <Sparkle className="h-2 w-2 fill-current" />
                          Interactive
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-foreground leading-tight line-clamp-2">
                      {formik.values.title || "Your Reward Title"}
                    </h3>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                    {formik.values.description || "Description will appear here."}
                  </p>

                  <div className="flex items-center gap-4 py-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                        Expires
                      </span>
                      <span className="text-[10px] font-bold">
                        {formik.values.validityDays} Days
                      </span>
                    </div>
                    <div className="h-4 w-px bg-border/40" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                        Supply
                      </span>
                      <span className="text-[10px] font-bold">
                        {formik.values.totalUsageLimit || "∞"} Units
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <Button disabled className="w-full h-11 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 group/btn shadow-lg shadow-indigo-500/20">
                    Redeem Now
                    <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showStrategy && (
          <Card className="border-none shadow-sm ring-1 ring-border/50">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Reward Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    Interactive rewards (Spin Wheel) double conversion rates.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    Setting a minimum account age reduces reward farming.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    Banner images should be 16:9 for consistent display.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
