import React from "react";
import Link from "next/link";
import { History, Clock, ArrowRight, Ticket, ShoppingBag, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileHoverCard, UserProfileHoverData } from "@/components/shared/user-profile-hover-card";
import moment from "moment";

interface RecentRedemptionsProps {
  redemptions: any[];
  redemptionsLoading: boolean;
}

export const RecentRedemptions = ({ redemptions, redemptionsLoading }: RecentRedemptionsProps) => {
  return (
    <section className="lg:col-span-4 space-y-4">
      <DashboardSectionHeading
        title="Recent Activity"
        titleClassName="normal-case tracking-normal text-sm text-foreground"
      />
      <div className="p-5 rounded-[20px] bg-white dark:bg-card border border-border shadow-sm">
        <div className="space-y-1">
          {redemptionsLoading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3 p-2.5 rounded-lg animate-pulse">
                <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2.5 w-32" />
                </div>
              </div>
            ))
          ) : redemptions.length > 0 ? (
            redemptions.map((act: any, i: number) => {
              const hoverUser: UserProfileHoverData = {
                id: act.user?.id,
                firstName: act.user?.firstName,
                lastName: act.user?.lastName,
                avatar: act.user?.avatar,
              };

              const isStore = act.reward?.rewardType === "STORE" || act.metadata?.provider === "SHOPIFY";
              const isGiftCard = act.reward?.rewardType === "GIFT_CARD" || act.metadata?.provider === "GIFT_CARD";

              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/60 transition-colors group/item cursor-default"
                >
                  <UserProfileHoverCard user={hoverUser}>
                    <div className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                      <Avatar className="h-8 w-8 border border-border shrink-0 group-hover/item:border-indigo-200 transition-colors">
                        <AvatarImage
                          src={
                            act.user?.avatar
                              ? `https://cdn.thrico.network/${act.user.avatar}`
                              : ""
                          }
                          alt={act.user?.firstName}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-[10px] bg-muted text-muted-foreground font-semibold group-hover/item:bg-indigo-50 group-hover/item:text-indigo-600 transition-colors">
                          {act.user?.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[12px] font-semibold text-foreground truncate leading-none hover:underline">
                            {act.user?.firstName} {act.user?.lastName}
                          </p>
                          {isGiftCard ? (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold">
                              Gift Card
                            </span>
                          ) : isStore ? (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold">
                              Store
                            </span>
                          ) : (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                              Voucher
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate leading-none mt-1">
                          {act.reward?.title}
                        </p>
                      </div>
                    </div>
                  </UserProfileHoverCard>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70 font-medium shrink-0">
                    <Clock className="h-3 w-3" />
                    {moment(act.createdAt).fromNow(true)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center space-y-3">
              <div className="h-12 w-12 bg-muted rounded-2xl flex items-center justify-center mx-auto border border-border">
                <History className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  No activity yet
                </p>
                <p className="text-[11px] text-muted-foreground/60 max-w-[150px] mx-auto leading-relaxed">
                  Activity appears when members start redeeming
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Link href="/gamification/rewards/redemptions">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 rounded-lg cursor-pointer text-xs font-semibold"
            >
              View full history
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
