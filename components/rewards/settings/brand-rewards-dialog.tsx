"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Gift,
  Percent,
  ShoppingBag,
  Tag,
  Ticket,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { BrandRequest } from "./pending-requests";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BrandReward {
  id: string;
  title: string;
  description: string;
  type: "discount" | "cashback" | "gift" | "voucher" | "freebie";
  value: string;          // e.g. "20% off" | "₹500 cashback"
  expiresAt: string;      // human-readable
  directLink: string;     // URL to the reward page on the brand's site
}

interface BrandRewardsDialogProps {
  open: boolean;
  request: BrandRequest | null;
  rewards: BrandReward[];
  onClose: () => void;
  /** Called with only the selected reward IDs to publish */
  onConfirm: (requestId: string, selectedRewardIds: string[]) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const REWARD_TYPE_META: Record<
  BrandReward["type"],
  { label: string; icon: React.ElementType; color: string }
> = {
  discount: { label: "Discount", icon: Percent,    color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  cashback: { label: "Cashback", icon: ArrowRight,  color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  gift:     { label: "Gift",     icon: Gift,        color: "text-rose-600 bg-rose-50 border-rose-100" },
  voucher:  { label: "Voucher",  icon: Ticket,      color: "text-amber-600 bg-amber-50 border-amber-100" },
  freebie:  { label: "Freebie",  icon: ShoppingBag, color: "text-violet-600 bg-violet-50 border-violet-100" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BrandRewardsDialog({
  open,
  request,
  rewards,
  onClose,
  onConfirm,
}: BrandRewardsDialogProps) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(rewards.map((r) => r.id))
  );

  // Reset selection when dialog opens with a new request
  React.useEffect(() => {
    if (open) setSelected(new Set(rewards.map((r) => r.id)));
  }, [open, rewards]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.size === rewards.length
        ? new Set()
        : new Set(rewards.map((r) => r.id))
    );
  }

  if (!request) return null;

  const allSelected = selected.size === rewards.length;
  const noneSelected = selected.size === 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        {/* ── Header ─────────────────────────────────────────────── */}
        <DialogHeader className="px-6 pt-6 pb-4 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-xl border border-border">
              <AvatarImage src={request.logo} alt={request.name} />
              <AvatarFallback className="text-sm font-semibold bg-muted">
                {request.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold text-foreground leading-none">
                {request.name} — Reward Offers
              </DialogTitle>
              <p className="text-[12px] text-muted-foreground mt-1">
                Select which rewards to publish in your directory when you
                approve this partnership.
              </p>
            </div>
          </div>

          {/* Select all row */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={toggleAll}
              className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
            >
              <Checkbox
                checked={allSelected}
                className="h-3.5 w-3.5"
                aria-label="Select all rewards"
              />
              {allSelected ? "Deselect all" : "Select all"}
            </button>
            <Badge
              variant="outline"
              className="text-[10px] font-semibold bg-primary/5 text-primary border-primary/15"
            >
              {selected.size} / {rewards.length} selected
            </Badge>
          </div>
        </DialogHeader>

        <Separator />

        {/* ── Reward list ─────────────────────────────────────────── */}
        <ScrollArea className="max-h-[360px]">
          <div className="divide-y divide-border">
            {rewards.map((reward) => {
              const meta = REWARD_TYPE_META[reward.type];
              const Icon = meta.icon;
              const isSelected = selected.has(reward.id);

              return (
                <label
                  key={reward.id}
                  htmlFor={`reward-${reward.id}`}
                  className={cn(
                    "flex items-start gap-4 px-6 py-4 cursor-pointer transition-colors select-none",
                    isSelected ? "bg-primary/3" : "hover:bg-muted/30"
                  )}
                >
                  {/* Checkbox */}
                  <Checkbox
                    id={`reward-${reward.id}`}
                    checked={isSelected}
                    onCheckedChange={() => toggle(reward.id)}
                    className="mt-0.5 shrink-0"
                  />

                  {/* Type icon */}
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg border flex items-center justify-center shrink-0",
                      meta.color
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground leading-snug">
                        {reward.title}
                      </p>
                      <span className="text-sm font-semibold text-foreground shrink-0 tabular-nums">
                        {reward.value}
                      </span>
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      {reward.description}
                    </p>
                    <div className="flex items-center gap-3 pt-0.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] uppercase font-semibold tracking-widest",
                          meta.color
                        )}
                      >
                        {meta.label}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        Expires {reward.expiresAt}
                      </span>
                      <a
                        href={reward.directLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-0.5 text-[10px] text-primary hover:underline"
                      >
                        Preview <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </ScrollArea>

        <Separator />

        {/* ── Footer ─────────────────────────────────────────────── */}
        <DialogFooter className="px-6 py-4 flex flex-row items-center justify-between sm:justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            {noneSelected
              ? "Select at least one reward to proceed."
              : `${selected.size} reward${selected.size !== 1 ? "s" : ""} will be published directly in your directory.`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 text-[11px] font-semibold border-border"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={noneSelected}
              onClick={() => onConfirm(request.id, Array.from(selected))}
              className="h-8 text-[11px] font-semibold gap-1.5 bg-foreground text-background hover:bg-foreground/90"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Approve Partnership
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
