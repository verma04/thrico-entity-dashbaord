"use client";

import React from "react";
import Link from "next/link";
import { History, Clock, ArrowRight, Ticket, ShoppingBag, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileHoverCard, UserProfileHoverData } from "@/components/shared/user-profile-hover-card";
import moment from "moment";
import { cn } from "@/lib/utils";

interface RecentRedemptionsProps {
  redemptions?: any[];
  redemptionsLoading?: boolean;
  loading?: boolean;
}

export const RecentRedemptions = ({
  redemptions,
  redemptionsLoading,
  loading,
}: RecentRedemptionsProps = {}) => {
  const isLoading = redemptionsLoading ?? loading ?? false;
  const displayRedemptions = redemptions && redemptions.length > 0
    ? redemptions
    : [
        {
          user: { firstName: "Aarav", lastName: "Sharma", avatar: "" },
          reward: { title: "20% Off Storewide" },
          rewardType: "STORE",
          createdAt: new Date().toISOString(),
        },
        {
          user: { firstName: "Priya", lastName: "Patel", avatar: "" },
          reward: { title: "₹500 Amazon Gift Card" },
          rewardType: "GIFT_CARD",
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
        {
          user: { firstName: "Rohan", lastName: "Verma", avatar: "" },
          reward: { title: "VIP Community Pass" },
          rewardType: "MANUAL",
          createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        },
        {
          user: { firstName: "Sneha", lastName: "Nair", avatar: "" },
          reward: { title: "Free Express Shipping" },
          rewardType: "STORE",
          createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        },
      ];

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40 px-4 sm:px-6 pt-4 sm:pt-5">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <History className="h-3.5 w-3.5 text-primary" />
            Live Redemption Feed
          </span>
          <p className="text-[11px] text-muted-foreground">
            Latest member claims across all reward mechanisms
          </p>
        </div>

        <Link href="/gamification/rewards/redemptions">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-primary font-bold h-7 px-2 rounded-lg hover:bg-muted"
          >
            View all <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="flex-1 p-0 divide-y divide-border/50">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 sm:px-6 py-3 animate-pulse">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2.5 w-36" />
              </div>
              <Skeleton className="h-3 w-12" />
            </div>
          ))
        ) : (
          displayRedemptions.slice(0, 5).map((act: any, i: number) => {
            const hoverUser: UserProfileHoverData = {
              id: act.user?.id || `user-${i}`,
              firstName: act.user?.firstName || "Member",
              lastName: act.user?.lastName || "",
              avatar: act.user?.avatar,
            };

            const isStore = act.rewardType === "STORE" || act.reward?.rewardType === "STORE" || act.metadata?.provider === "SHOPIFY";
            const isGiftCard = act.rewardType === "GIFT_CARD" || act.reward?.rewardType === "GIFT_CARD" || act.metadata?.provider === "GIFT_CARD";

            return (
              <div
                key={i}
                className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 hover:bg-muted/30 transition-colors"
              >
                <UserProfileHoverCard user={hoverUser}>
                  <div className="flex items-center gap-3 cursor-pointer min-w-0 flex-1">
                    <Avatar className="h-8 w-8 border border-border/70 shrink-0">
                      <AvatarImage
                        src={
                          act.user?.avatar
                            ? `https://cdn.thrico.network/${act.user.avatar}`
                            : ""
                        }
                        alt={act.user?.firstName}
                      />
                      <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">
                        {act.user?.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-foreground truncate hover:text-primary transition-colors">
                          {act.user?.firstName} {act.user?.lastName}
                        </span>
                        {isGiftCard ? (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
                            Gift Card
                          </span>
                        ) : isStore ? (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                            Store Code
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                            Voucher
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                        {act.reward?.title || "Exclusive Reward"}
                      </p>
                    </div>
                  </div>
                </UserProfileHoverCard>

                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium shrink-0">
                  <Clock className="h-3 w-3" />
                  {moment(act.createdAt).fromNow(true)}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
