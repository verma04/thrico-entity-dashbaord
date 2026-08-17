"use client";

import React from "react";
import Link from "next/link";
import { Users, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface CommerceCustomer {
  id: string;
  shopifyCustomerId?: string;
  wooCustomerId?: string;
  email?: string | null;
  status?: string | null;
  createdAt?: string | null;
  lastSyncedAt?: string | null;
}

interface CommerceCustomersFeedProps {
  customers: CommerceCustomer[];
  loading?: boolean;
  viewAllHref: string;
}

export function CommerceCustomersFeed({
  customers = [],
  loading = false,
  viewAllHref,
}: CommerceCustomersFeedProps) {
  const displayCustomers = customers.slice(0, 6);

  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm flex flex-col h-full">
      {loading ? (
        <div className="divide-y divide-border/40 p-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="h-3.5 w-24 rounded bg-muted animate-pulse" />
                <div className="h-2.5 w-32 rounded bg-muted animate-pulse" />
              </div>
              <div className="h-4 w-12 rounded bg-muted animate-pulse shrink-0" />
            </div>
          ))}
        </div>
      ) : displayCustomers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground/50 flex-1">
          <Users className="h-8 w-8 mb-2 opacity-30" />
          <p className="text-xs font-semibold text-foreground/70">No synced customers</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[200px]">
            Sync your store to automatically import and link customer profiles.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/40 flex-1">
          {displayCustomers.map((cust, idx) => {
            const customerId = cust.shopifyCustomerId || cust.wooCustomerId || cust.id?.slice(0, 8);
            const email = cust.email || `Customer #${customerId}`;
            const initials = email.substring(0, 2).toUpperCase();

            const timeAgo = (() => {
              try {
                const date = cust.lastSyncedAt || cust.createdAt;
                return date
                  ? formatDistanceToNow(new Date(date), { addSuffix: true })
                  : "";
              } catch {
                return "";
              }
            })();

            return (
              <div
                key={cust.id || idx}
                className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Avatar className="h-7 w-7 border border-border/50 shadow-2xs shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-bold uppercase">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {email}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-muted-foreground/70 font-mono">
                        ID: {customerId}
                      </span>
                      {timeAgo && (
                        <>
                          <span className="text-[10px] text-muted-foreground/40">·</span>
                          <span className="text-[10px] text-muted-foreground/60">
                            {timeAgo}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0",
                  )}
                >
                  <CheckCircle2 className="h-2.5 w-2.5 mr-0.5 inline" />
                  Synced
                </Badge>
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
            View all customers
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
