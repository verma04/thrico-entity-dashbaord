"use client";

import React, { useState } from "react";
import { useGetUserReferrals } from "@/graphql/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Network } from "lucide-react";
import { safeLocaleDateString } from "@/lib/date-utils";

export function ReferralsTab({ userId }: { userId: string }) {
  const [offset, setOffset] = useState(0);
  const limit = 12; // 3 columns looks better with multiples of 3 or 4

  const { data, loading, error } = useGetUserReferrals({
    userId,
    limit,
    offset,
  });

  const referralsData = data?.getUserReferrals;
  const referrals = referralsData?.data || [];
  const totalCount = referralsData?.totalCount || 0;
  const hasNextPage = referralsData?.hasNextPage || false;

  if (loading && offset === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-red-500">
          <p className="font-semibold">Error loading referrals</p>
          <p className="text-sm mt-1">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (referrals.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center flex flex-col items-center justify-center">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Network className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-foreground">
            No Referrals Found
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            This user hasn't referred anyone yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Total Referrals:{" "}
          <span className="text-foreground font-semibold">{totalCount}</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {referrals.map((referral: any, index: number) => {
          const user = referral.user;
          const firstName = user?.firstName || "Unknown";
          const lastName = user?.lastName || "User";
          const initials =
            `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

          return (
            <Card
              key={user?.id || index}
              className="overflow-hidden hover:shadow-md transition-shadow border-border"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/10">
                  {user?.avatar && (
                    <AvatarImage
                      src={`https://cdn.thrioc.network/${user?.avatar}`}
                      alt={`${firstName} ${lastName}`}
                    />
                  )}
                  <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate text-foreground">
                    {firstName} {lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    Location: {user?.location?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    Joined at:{" "}
                    {user?.createdAt
                      ? safeLocaleDateString(user.createdAt)
                      : "Unknown"}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {(hasNextPage || offset > 0) && (
        <div className="flex justify-between items-center pt-2 border-t border-border mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground font-medium">
            Showing {offset + 1}-{Math.min(offset + limit, totalCount)} of{" "}
            {totalCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOffset(offset + limit)}
            disabled={!hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
