import React from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Ticket, Pencil, Upload, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMechanismBadge } from "./utils";

interface RewardsGalleryTabProps {
  loading: boolean;
  viewMode: "grid" | "list";
  filteredRewards: any[];
  searchQuery: string;
  onOpenUploadForReward: (rewardId: string) => void;
  onManageVouchers: (rewardId: string) => void;
}

export function RewardsGalleryTab({
  loading,
  viewMode,
  filteredRewards,
  searchQuery,
  onOpenUploadForReward,
  onManageVouchers,
}: RewardsGalleryTabProps) {
  if (loading) {
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-6 py-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-4 border border-border animate-pulse"
            >
              <div className="aspect-[4/3] bg-muted rounded-xl mb-4" />
              <div className="space-y-2.5">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="space-y-3 px-6 py-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 bg-card rounded-2xl border border-border animate-pulse"
            >
              <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      );
    }
  }

  if (filteredRewards.length === 0) {
    return (
      <div className="px-6 py-4">
        <div className="py-32 flex flex-col items-center justify-center text-center">
          <div className="h-24 w-24 rounded-[2rem] bg-indigo-50 border-4 border-white shadow-2xl flex items-center justify-center mb-8 rotate-3">
            <Ticket className="h-10 w-10 text-indigo-300" />
          </div>
          <div className="space-y-2 max-w-sm">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
              Offer Nexus Offline
            </h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed font-medium">
              {searchQuery
                ? `The filter query "${searchQuery}" yielded zero results across your reward collection.`
                : "Your economic engine is currently idle. Define your first master reward offer to begin the exchange lifecycle."}
            </p>
          </div>
          <div className="mt-8">
            <Link href="/rewards/coupons/create">
              <Button className="h-11 px-8 rounded-2xl gap-3 font-black uppercase tracking-widest shadow-xl ring-1 ring-black/10">
                <Ticket className="h-5 w-5" /> Initialize Reward
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredRewards.map((reward: any) => {
            const badge = getMechanismBadge(reward.rewardMechanism || "COUPON");
            const BadgeIcon = badge.icon;
            return (
              <div
                key={reward.id}
                className="group relative bg-card rounded-2xl border border-border hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/[0.03] transition-all duration-500 overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-50 border-b border-border/50">
                  {reward.image ? (
                    <img
                      src={
                        reward.image?.startsWith("https://cdn.thrico.network/")
                          ? reward.image
                          : `https://cdn.thrico.network/${reward.image}`
                      }
                      alt={reward.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center opacity-10">
                      <Ticket className="h-12 w-12 mb-2" />
                    </div>
                  )}
                  <div className="absolute top-2.5 left-2.5">
                    <div
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md ring-1 ring-black/5",
                        badge.color,
                      )}
                    >
                      <BadgeIcon className="h-2.5 w-2.5" />
                      {badge.label}
                    </div>
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest border border-white/10 shadow-lg">
                    {reward.inventory ?? "∞"} Unit
                  </div>
                  <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <Link href={`/rewards/coupons/edit/${reward.id}`}>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-10 w-10 rounded-xl shadow-2xl ring-1 ring-black/10 hover:scale-110 transition-transform"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    {reward.inventoryRequired && (
                      <Button
                        onClick={() => onOpenUploadForReward(reward.id)}
                        size="icon"
                        variant="secondary"
                        className="h-10 w-10 rounded-xl shadow-2xl ring-1 ring-black/10 hover:scale-110 transition-transform"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="min-h-[40px]">
                    <h3 className="text-[13px] font-black text-foreground line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                      {reward.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-tight font-medium opacity-70">
                      {reward.description ||
                        "No categorical description defined for this reward nexus."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border/40">
                    <div className="flex items-center gap-1.5">
                      <div className="h-5 w-5 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
                        <Zap className="h-2.5 w-2.5 text-amber-500 fill-current" />
                      </div>
                      <span className="text-[11px] font-black text-foreground tabular-nums">
                        {reward.tcCost || 0} Coins
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-4 w-px bg-border/50" />
                      <button
                        onClick={() => onManageVouchers(reward.id)}
                        className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline underline-offset-4"
                      >
                        {" "}
                        Manage
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/40">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground">
                        Discount:{" "}
                      </span>
                      <span className="text-[11px] font-black text-foreground">
                        {reward.discountType === "Percentage"
                          ? `${reward.discountValue}%`
                          : reward.discountType === "Flat"
                            ? `$${reward.discountValue}`
                            : reward.discountType}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground">
                        Per User Limit:{" "}
                      </span>
                      <span className="text-[11px] font-black text-foreground">
                        {reward.perUserLimit ?? "Unlimited"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRewards.map((reward: any) => {
            const badge = getMechanismBadge(reward.rewardMechanism || "COUPON");
            const BadgeIcon = badge.icon;
            return (
              <div
                key={reward.id}
                className="group flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/[0.02] transition-all duration-300"
              >
                <div className="h-14 w-14 rounded-xl bg-zinc-50 border border-border/60 overflow-hidden shrink-0 shadow-sm ring-1 ring-black/[0.03]">
                  {reward.image ? (
                    <img
                      src={`https://cdn.thrico.network/${reward?.image}`}
                      alt={reward.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center opacity-10">
                      <Ticket className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-black text-foreground truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                      {reward.title}
                    </h3>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest shrink-0",
                        badge.chip,
                      )}
                    >
                      <BadgeIcon className="h-2.5 w-2.5" />
                      {badge.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-tighter">
                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-muted rounded">
                      <Zap className="h-2.5 w-2.5 text-amber-500" />
                      {reward.tcCost || 0} Cost
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-2.5 w-2.5 text-indigo-400" />
                      {reward.validityDays || "No"} Days Validity
                    </span>
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[8px] font-black">
                      STOCK: {reward.inventory ?? "∞"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      Discount:{" "}
                      {reward.discountType === "Percentage"
                        ? `${reward.discountValue}%`
                        : reward.discountType === "Flat"
                          ? `$${reward.discountValue}`
                          : reward.discountType}
                    </span>
                    <span className="flex items-center gap-1.5 border-l border-border pl-4">
                      Limit per User: {reward.perUserLimit ?? "Unlimited"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {reward.inventoryRequired && (
                    <Button
                      onClick={() => onOpenUploadForReward(reward.id)}
                      variant="outline"
                      size="sm"
                      className="h-8 px-4 gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl border-border bg-card"
                    >
                      <Upload className="h-3.5 w-3.5" /> Upload Batch
                    </Button>
                  )}
                  <Button
                    onClick={() => onManageVouchers(reward.id)}
                    variant="outline"
                    size="sm"
                    className="h-8 px-4 gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl border-border bg-card"
                  >
                    <Ticket className="h-3.5 w-3.5" /> Vouchers
                  </Button>
                  <Link href={`/rewards/coupons/edit/${reward.id}`}>
                    <Button
                      size="sm"
                      className="h-8 px-4 gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit Offer
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
