"use client";

import React from "react";
import {
  Interest,
  useGetUsersByInterestNeo4j,
} from "@/graphql/quries/interests/interest-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function InterestUsersSheet({
  interest,
  open,
  onOpenChange,
}: {
  interest: Interest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data, loading } = useGetUsersByInterestNeo4j({
    variables: { interestId: interest?.id || "", limit: 50 },
    skip: !interest,
  });

  const users = data?.getUsersByInterestNeo4j?.data || [];
  const totalCount = data?.getUsersByInterestNeo4j?.totalCount || 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" />
            {interest?.title} Users
          </SheetTitle>
          <SheetDescription>
            {loading
              ? "Loading..."
              : `Found ${totalCount} users with this interest`}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
          ) : users.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p>No users found for this interest.</p>
            </div>
          ) : (
            users.map((user) => (
              <UserProfileHoverCard
                key={user.id}
                user={{ ...user, id: user.globalUserId }}
              >
                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border cursor-pointer">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage
                      src={
                        user.avatar
                          ? `https://cdn.thrico.network/${user.avatar}`
                          : ""
                      }
                      alt={user.firstName || ""}
                    />
                    <AvatarFallback className="bg-indigo-50 text-indigo-600 font-semibold">
                      {user.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    {user.headline && (
                      <p className="text-xs text-muted-foreground truncate">
                        {user.headline}
                      </p>
                    )}
                  </div>
                </div>
              </UserProfileHoverCard>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
