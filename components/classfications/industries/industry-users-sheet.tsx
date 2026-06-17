"use client";

import React from "react";
import {
  Industry,
  useGetUsersByIndustryNeo4j,
} from "@/graphql/quries/industries/industry-queries";
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

export function IndustryUsersSheet({
  industry,
  open,
  onOpenChange,
}: {
  industry: Industry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data, loading } = useGetUsersByIndustryNeo4j({
    variables: { industryId: industry?.id || "", limit: 50 },
    skip: !industry,
  });

  const users = data?.getUsersByIndustryNeo4j?.data || [];
  const totalCount = data?.getUsersByIndustryNeo4j?.totalCount || 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" />
            {industry?.title} Users
          </SheetTitle>
          <SheetDescription>
            {loading
              ? "Loading..."
              : `Found ${totalCount} users in this industry`}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
          ) : users.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
              <p>No users found for this industry.</p>
            </div>
          ) : (
            users.map((user) => (
              <UserProfileHoverCard
                key={user.id}
                user={{ ...user, id: user.id }}
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
                    <p className="font-semibold text-sm text-foreground truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    {user.headline && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
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
