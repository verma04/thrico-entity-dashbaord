"use client";

import React from "react";
import Link from "next/link";
import {
  Coins,
  Package,
  Pencil,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { CouponActions } from "./coupon-actions";
import { getMechanismBadge } from "../utils";
import { AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CouponCardCompactProps {
  reward: any;
  onOpenUploadForReward?: (rewardId: string) => void;
  onManageVouchers?: (rewardId: string) => void;
}

export function CouponCardCompact({
  reward,
}: CouponCardCompactProps) {
  const provider = (reward.metadata?.provider || reward.provider || "").toUpperCase();
  const rewardType = (reward.rewardType || reward.rewardPillar || reward.pillar || "").toUpperCase();
  const mechanisms = Array.isArray(reward.rewardMechanism)
    ? reward.rewardMechanism
    : [reward.rewardMechanism || "COUPON"];

  let mechType = reward.mechanism?.type || mechanisms[0] || "COUPON";
  if (!mechType || mechType === "INTERNAL" || mechType === "INTERNAL_VOUCHER" || mechType === "MANUAL_COUPON") {
    if (rewardType === "STORE" || rewardType === "SHOPIFY" || provider === "SHOPIFY" || provider === "STORE") {
      mechType = "STORE_DISCOUNT";
    } else if (rewardType === "GIFT_CARD" || rewardType === "DIGITAL_GIFT_CARD" || provider === "THRICO" || provider === "XOXODAY" || provider === "GIFT_CARD") {
      mechType = "DIGITAL_GIFT_CARD";
    } else {
      mechType = "COUPON";
    }
  }

  const primaryMech = getMechanismBadge(mechType);
  const MechIcon = primaryMech.icon;

  const coverUrl = reward.image
    ? reward.image.startsWith("http")
      ? reward.image
      : `https://cdn.thrico.network/${reward.image}`
    : null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group">
      {/* Top status accent bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{ backgroundColor: reward.isActive ? "#10b981" : "#f43f5e" }}
      />

      {/* ── Optional Cover Image Container ───────────────────────────────── */}
      {coverUrl ? (
        <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-muted/30 border-b border-border/40 shrink-0">
          <img
            src={coverUrl}
            alt={reward.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* Top floating badges */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white shadow-2xs",
                reward.isActive ? "bg-emerald-600" : "bg-rose-600"
              )}
            >
              {reward.isActive ? "Active" : "Inactive"}
            </span>

            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-xs text-white border border-white/20">
              <MechIcon className="h-2.5 w-2.5" />
              {primaryMech.label}
            </span>

            {(reward.eligibility?.memberEligibility || reward.memberEligibility) && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-black/60 backdrop-blur-xs text-white border border-white/20">
                {(reward.eligibility?.memberEligibility || reward.memberEligibility).replace(/_/g, " ")}
              </span>
            )}
          </div>

          {/* Top Right Action Menu */}
          <div className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 backdrop-blur-xs rounded-md transition-colors text-white">
            <CouponActions reward={reward} />
          </div>

          {/* Bottom Left Cost on Image */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white font-mono text-xs font-bold border border-white/10">
            <Coins className="h-3 w-3 text-amber-400" />
            <span>{reward.tcCost ?? 0} PTS</span>
          </div>
        </div>
      ) : (
        /* ── Clean Header (when no image exists) ────────────────────────── */
        <div className="p-3 pb-0 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              <MechIcon className="h-2.5 w-2.5" />
              {primaryMech.label}
            </span>

            <AdminStatusBadge status={reward.isActive ? "APPROVED" : "DISABLED"}>
              {reward.isActive ? "Active" : "Inactive"}
            </AdminStatusBadge>

            {(reward.eligibility?.memberEligibility || reward.memberEligibility) && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted text-muted-foreground border border-border">
                {(reward.eligibility?.memberEligibility || reward.memberEligibility).replace(/_/g, " ")}
              </span>
            )}
          </div>

          <div className="bg-background/80 hover:bg-background rounded-md transition-colors shrink-0">
            <CouponActions reward={reward} />
          </div>
        </div>
      )}

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {!coverUrl && (
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-600 dark:text-amber-500">
              <Coins className="h-3.5 w-3.5" />
              <span>{reward.tcCost ?? 0} PTS</span>
            </div>
          )}

          <h3
            className="text-xs sm:text-sm font-semibold text-foreground leading-snug truncate group-hover:text-primary transition-colors"
            title={reward.title}
          >
            {reward.title}
          </h3>

          {reward.description && (
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
              {reward.description}
            </p>
          )}

          {/* Limits & Redeemed metrics */}
          <div className="flex items-center justify-between pt-1 border-t border-border/30 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <Package className="h-3 w-3 text-muted-foreground/70" />
              <span>
                {reward.inventoryRequired
                  ? `${reward.remainingVouchers ?? reward.inventoryCount ?? 0} in stock`
                  : "On-Demand"}
              </span>
            </div>

            <div className="font-semibold text-foreground font-mono">
              {reward.redeemedCount ?? 0} redeemed
            </div>
          </div>
        </div>

        {/* ── Card Footer: Clean Edit Action ─────────────────────────────── */}
        <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-7 w-full text-[11px] font-semibold gap-1.5 px-2.5 border-border/80 bg-card hover:bg-muted"
          >
            <Link href={`/gamification/rewards/coupons/${reward.id}/edit`}>
              <Pencil className="h-3 w-3 text-muted-foreground" />
              <span>Edit Reward</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CouponCardCompact;
