"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetUserDetailsById } from "@/graphql/actions";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Internal Components
import { UserInfoCard } from "@/components/members/details/user-info-card";
import { ProfileTab } from "@/components/members/details/profile-tab";
import { StatsTab } from "@/components/members/details/stats-tab";
import { GamificationTab } from "@/components/members/details/gamification-tab";
import {
  UserDetailsSkeleton,
  ErrorState,
} from "@/components/members/details/detail-states";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, loading, error } = useGetUserDetailsById({
    variables: { input: { id } },
    skip: !id,
  });

  const member = data?.getUserDetailsById;
  const user = member?.user;

  if (loading) return <UserDetailsSkeleton />;
  if (error || !member) return <ErrorState onBack={() => router.back()} />;

  return (
    <div className="min-h-screen bg-background/50">
      {/* Top Navigation */}
      <div className="sticky top-14 z-30 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-sm font-black text-muted-foreground uppercase tracking-widest">
                Member Profile
              </h1>
              <p className="font-black text-xl truncate max-w-[200px] sm:max-w-none">
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-2 font-bold"
            >
              <MessageSquare className="h-4 w-4" /> Message
            </Button>
            <Button size="sm" className="gap-2 font-bold px-6">
              Edit Account
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Profile Card & Quick Info */}
          <div className="lg:col-span-4">
            <UserInfoCard member={member} />
          </div>

          {/* Right Column: Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <Tabs defaultValue="profile" className="w-full">
              <div className="mb-6 overflow-x-auto">
                <TabsList className="bg-muted/50 p-1 h-12 w-full lg:w-auto flex lg:inline-flex justify-start lg:justify-center border border-border/40">
                  <TabsTrigger
                    value="profile"
                    className="px-6 font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all focus-within:z-10 h-full"
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="px-6 font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all focus-within:z-10 h-full"
                  >
                    Activity Stats
                  </TabsTrigger>
                  <TabsTrigger
                    value="gamification"
                    className="px-6 font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all focus-within:z-10 h-full"
                  >
                    Gamification
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="profile"
                className="mt-0 border-none p-0 outline-none"
              >
                <ProfileTab member={member} />
              </TabsContent>

              <TabsContent
                value="stats"
                className="mt-0 border-none p-0 outline-none"
              >
                <StatsTab userId={user?.id} />
              </TabsContent>

              <TabsContent
                value="gamification"
                className="mt-0 border-none p-0 outline-none"
              >
                <GamificationTab userId={user?.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
