"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Gift, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface CommerceOrder {
  id: string;
  shopifyOrderId?: string;
  wooOrderId?: string;
  userId?: string | null;
  user?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    avatar?: string | null;
  } | null;
  totalPrice?: string | null;
  currency?: string | null;
  status: string;
  reward?: {
    pointsEarned?: number | null;
  } | null;
  createdAt?: string | null;
}

interface CommerceOrdersFeedProps {
  orders: CommerceOrder[];
  loading?: boolean;
  viewAllHref: string;
}

export function CommerceOrdersFeed({
  orders = [],
  loading = false,
  viewAllHref,
}: CommerceOrdersFeedProps) {
  const displayOrders = orders.slice(0, 6);

  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm flex flex-col h-full">
      {loading ? (
        <div className="divide-y divide-border/40 p-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
                <div className="h-2.5 w-16 rounded bg-muted animate-pulse" />
              </div>
              <div className="h-3.5 w-14 rounded bg-muted animate-pulse shrink-0" />
            </div>
          ))}
        </div>
      ) : displayOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground/50 flex-1">
          <ShoppingCart className="h-8 w-8 mb-2 opacity-30" />
          <p className="text-xs font-semibold text-foreground/70">No orders synced yet</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[200px]">
            New orders from your store will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/40 flex-1">
          {displayOrders.map((order) => {
            const user = order.user;
            const orderNum = order.shopifyOrderId || order.wooOrderId || order.id?.slice(0, 8);
            const fullName = user
              ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "Shopper"
              : "Guest Shopper";
            const initials = fullName ? fullName.substring(0, 2).toUpperCase() : "SH";
            const price = order.totalPrice ? Number(order.totalPrice).toFixed(2) : "0.00";
            const currency = order.currency || "USD";
            const points = order.reward?.pointsEarned;

            const timeAgo = (() => {
              try {
                return order.createdAt
                  ? formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })
                  : "";
              } catch {
                return "";
              }
            })();

            return (
              <div
                key={order.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {user?.id ? (
                    <UserProfileHoverCard
                      user={{
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        avatar: user.avatar,
                      }}
                    >
                      <Link href={`/members/${user.id}`} className="shrink-0">
                        <Avatar className="h-7 w-7 border border-border/50 shadow-2xs">
                          <AvatarImage
                            src={user.avatar ? `https://cdn.thrico.network/${user.avatar}` : undefined}
                            alt={fullName}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-muted text-muted-foreground text-[9px] font-bold uppercase">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                    </UserProfileHoverCard>
                  ) : (
                    <Avatar className="h-7 w-7 border border-border/50 shadow-2xs shrink-0">
                      <AvatarFallback className="bg-muted text-muted-foreground text-[9px] font-bold uppercase">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        #{orderNum}
                      </span>
                      <span className="text-[10px] text-muted-foreground/40">·</span>
                      <span className="text-[11px] text-muted-foreground truncate max-w-[100px]">
                        {fullName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground/60 shrink-0">
                        {timeAgo}
                      </span>
                      {points != null && points > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded">
                          <Gift className="h-2.5 w-2.5" />
                          +{points} pts
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[12px] font-bold text-foreground tabular-nums">
                    {price} <span className="text-[9px] font-medium text-muted-foreground">{currency}</span>
                  </div>
                  <span
                    className={cn(
                      "inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded mt-0.5",
                      order.status?.toUpperCase() === "PAID" || order.status?.toUpperCase() === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                    )}
                  >
                    {order.status || "Pending"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="p-2.5 bg-muted/20 border-t border-border/40 flex justify-center">
        <Link href={viewAllHref} className="w-full">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs font-semibold text-muted-foreground hover:text-foreground h-7 rounded-lg gap-1 hover:bg-muted"
          >
            View all orders
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
