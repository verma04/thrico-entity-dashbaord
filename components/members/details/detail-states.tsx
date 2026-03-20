"use client";

import React from "react";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function UserDetailsSkeleton() {
  return (
    <div className="min-h-screen space-y-8 pb-12">
      <div className="h-16 border-b bg-background/50 flex items-center px-4">
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-8 space-y-8">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function EmptyContentSection({ message }: { message: string }) {
  return (
    <div className="p-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center bg-muted/20">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <UserIcon className="h-6 w-6 text-muted-foreground/40" />
      </div>
      <p className="text-muted-foreground font-bold text-sm">{message}</p>
    </div>
  );
}

export function ErrorState({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <ArrowLeft className="h-10 w-10 text-red-600" />
      </div>
      <h2 className="text-3xl font-black mb-2 tracking-tight">Failed to Load Profile</h2>
      <p className="text-muted-foreground font-bold mb-8 text-center max-w-md">
        We couldn't retrieve the details for this member. They might have been
        deleted or there was a network error.
      </p>
      <Button onClick={onBack} variant="outline" className="gap-2 font-bold px-8 py-6 h-auto">
        <ArrowLeft className="h-5 w-5" /> Go Back
      </Button>
    </div>
  );
}
