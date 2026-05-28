"use client";

import React from "react";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function UserDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-30 bg-background/70 backdrop-blur-xl border-b border-border/60 px-6 py-3">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-4">
              <div className="sticky top-4 space-y-4">
                <Card className="overflow-hidden border-border/60 shadow-sm">
                  <Skeleton className="h-32 w-full rounded-none" />
                  <CardContent className="relative px-5 pb-5">
                    <div className="flex flex-col items-center -mt-14 space-y-4">
                      <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
                      <div className="space-y-2 w-full flex flex-col items-center">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4 mt-2 rounded-full" />
                      </div>
                    </div>
                    <div className="mt-6 space-y-3 pt-4 border-t border-border/50">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/60 shadow-sm">
                  <CardContent className="p-4 space-y-4">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-4/5" />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="lg:col-span-8">
              <div className="flex gap-4 border-b border-border/60 mb-6 pb-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="space-y-6">
                <Card className="border-border/60 shadow-sm">
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
                <Card className="border-border/60 shadow-sm">
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-40 mb-4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-32 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmptyContentSection({ message }: { message: string }) {
  return (
    <div className="p-12 border border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center text-center bg-muted/20">
      <div className="h-12 w-12 rounded-2xl bg-background shadow-sm border border-border/60 flex items-center justify-center mb-4">
        <UserIcon className="h-5 w-5 text-muted-foreground/60" />
      </div>
      <p className="text-foreground font-semibold text-sm">{message}</p>
    </div>
  );
}

export function ErrorState({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto h-24 w-24 rounded-3xl bg-red-50 border-8 border-red-50/50 flex items-center justify-center mb-6">
          <ArrowLeft className="h-10 w-10 text-red-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Failed to Load Profile
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We couldn't retrieve the details for this member. They might have been
            deleted or there was a network error.
          </p>
        </div>
        <Button
          onClick={onBack}
          variant="outline"
          className="gap-2 font-semibold px-6 py-5 h-auto rounded-xl border-border/60 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Button>
      </div>
    </div>
  );
}
