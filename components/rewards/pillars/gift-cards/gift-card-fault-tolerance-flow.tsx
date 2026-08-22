"use client";

import React from "react";
import { ShieldCheck, RefreshCcw, CheckCircle2, AlertTriangle, KeyRound, ArrowRight } from "lucide-react";

export const GiftCardFaultToleranceFlow: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* 2-Phase Reservation vs Rollback Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Success Path */}
        <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
            <h5 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
              Primary Flow: Success & Instant Delivery
            </h5>
          </div>
          <div className="space-y-1 text-[11px] text-emerald-900/90 dark:text-emerald-300/90 font-mono bg-background/60 p-2.5 rounded-lg border border-emerald-200/40 dark:border-emerald-900/40">
            <div>1. Member Wins ₹500 Card</div>
            <div>2. Reserve ₹500 + ₹25 Fee (₹525)</div>
            <div>3. Provider API returns code & PIN</div>
            <div>4. Deduct ₹525 from Wallet (₹50k → ₹49,475)</div>
            <div className="text-emerald-700 dark:text-emerald-300 font-bold">5. Status: DELIVERED</div>
          </div>
        </div>

        {/* Failure & Auto-Release Path */}
        <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-amber-600 text-white flex items-center justify-center">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
            <h5 className="text-xs font-bold text-amber-950 dark:text-amber-200">
              Fault Tolerance: Auto-Release on Failure
            </h5>
          </div>
          <div className="space-y-1 text-[11px] text-amber-900/90 dark:text-amber-300/90 font-mono bg-background/60 p-2.5 rounded-lg border border-amber-200/40 dark:border-amber-900/40">
            <div>1. Member Wins ₹500 Card</div>
            <div>2. Reserve ₹525 (Funds Frozen)</div>
            <div>3. Provider times out or returns 500</div>
            <div>4. Exponential backoff retry fails</div>
            <div className="text-amber-700 dark:text-amber-300 font-bold">5. RELEASE RESERVATION (₹0 Lost)</div>
          </div>
        </div>
      </div>

      {/* Idempotency Key Card */}
      <div className="p-3.5 rounded-xl border border-violet-200/70 dark:border-violet-900/60 bg-violet-50/40 dark:bg-violet-950/20 flex items-start gap-3">
        <div className="h-7 w-7 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          <KeyRound className="h-3.5 w-3.5" />
        </div>
        <div className="space-y-1 text-xs text-violet-950 dark:text-violet-200">
          <span className="font-bold block">Idempotency Key Protection: `Reward_ID + User_ID + Play_ID`</span>
          <p className="text-violet-900/80 dark:text-violet-300 text-[11px] leading-relaxed">
            Every transaction generates a unique deterministic reference (e.g. <code>TXN-AMZ-USR829-SPIN42</code>). If a network timeout occurs and Thrico retries the request, the engine detects the existing reference and returns the already-purchased gift card rather than double-billing your reward wallet.
          </p>
        </div>
      </div>
    </div>
  );
};
