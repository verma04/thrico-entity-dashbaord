"use client";

import React from "react";
import { useGetAllReferrals } from "@/graphql/actions";
import {
  AdminTable,
  AdminTableColumn,
} from "@/components/shared/admin-table/admin-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { safeLocaleDateString } from "@/lib/date-utils";
import { Badge } from "@/components/ui/badge";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

function ReferralsPage() {
  const { data, loading } = useGetAllReferrals({ limit: 100, offset: 0 });
  const referrals = data?.getAllReferrals?.data || [];

  const columns: AdminTableColumn<any>[] = [
    {
      key: "relationship",
      header: "Relationship",
      cell: (row) => {
        const referrer = row.referrer?.user;
        const referee = row.referee?.user;
        return (
          <div className="flex items-center gap-4 py-1">
            <div className="flex items-center gap-2.5 min-w-[180px]">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`${process.env.NEXT_PUBLIC_CDN_URL}/${referrer?.avatar}`} />
                <AvatarFallback className="text-[10px]">{referrer?.firstName?.[0]}{referrer?.lastName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">{referrer?.firstName} {referrer?.lastName}</span>
                <span className="text-[10px] text-muted-foreground">Referrer</span>
              </div>
            </div>

            <div className="flex flex-col items-center px-2">
              <div className="h-px w-8 bg-border relative">
                <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-border" />
              </div>
            </div>

            <div className="flex items-center gap-2.5 min-w-[180px]">
              <Avatar className="h-8 w-8 border border-primary/10">
                <AvatarImage src={`${process.env.NEXT_PUBLIC_CDN_URL}/${referee?.avatar}`} />
                <AvatarFallback className="text-[10px]">{referee?.firstName?.[0]}{referee?.lastName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">{referee?.firstName} {referee?.lastName}</span>
                <span className="text-[10px] text-muted-foreground">Referee</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "details",
      header: "Details",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Joined {safeLocaleDateString(row.referee?.user?.createdAt)}</span>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={row.referee?.isApproved ? "bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px] py-0" : "bg-amber-50 text-amber-700 border-amber-100 text-[10px] py-0"}
            >
              {row.referee?.isApproved ? "Approved" : "Pending"}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      key: "stats",
      header: "Referrer Stats",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Total:</span>
          <Badge variant="secondary" className="text-[10px] font-mono">{row.referrer?.referralsCount || 0}</Badge>
        </div>
      ),
    },
  ];

  const router = useRouter();
  const { data: subData, loading: subLoading } = useCheckMemberSubscription();
  const hasReachedLimit = subData?.checkMemberSubscription?.hasReachedLimit;
  const message = subData?.checkMemberSubscription?.message;

  if (subLoading || loading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (hasReachedLimit) {
    return (
      <div className="flex h-[400px] items-center justify-center bg-card rounded-xl border border-border p-6 mt-6">
        <div className="max-w-md w-full bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto" />
          <h2 className="text-xl font-bold text-amber-900">Feature Locked</h2>
          <p className="text-amber-700 font-medium">
            {message || "You have reached your subscription limit. Please upgrade your subscription to view referrals."}
          </p>
          <div className="pt-4">
            <button
              className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-white border border-amber-200 text-amber-900 hover:bg-amber-100 h-10 py-2 px-4 w-full"
              onClick={() => router.push("/settings/billing")}
            >
              Upgrade Subscription
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Referral Network
        </h1>
        <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
          The Referral Network provides a comprehensive view of the invitation
          connections within the ecosystem. Monitor who is actively referring
          new members and track the approval status of invited users.
        </p>
      </div>

      <AdminTable
        columns={columns}
        data={referrals}
        loading={loading}
        keyExtractor={(row, index) =>
          `${row.referrer?.user?.email}-${row?.referee?.user?.email}-${index}`
        }
        pageSize={12}
        emptyTitle="No referrals found"
        emptyDescription="The referral network is currently empty. Connections will appear here as members invite others."
      />
    </div>
  );
}

export default withModulePermission(ReferralsPage, "NETWORK", "canRead");
