"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetUserDetailsById } from "@/graphql/actions";
import { ArrowLeft, MessageSquare, Edit3, ChevronRight, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";

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
    <div className="flex flex-col h-full bg-slate-50/50 overflow-hidden">
      {/* Top Navigation - Sticky Header Pattern */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-xl hover:bg-slate-100 h-10 w-10 shrink-0 border border-slate-200 shadow-sm bg-white"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="p-1 rounded-md bg-indigo-600/10 ring-1 ring-indigo-600/20">
                  <UserIcon className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  Member Profile
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 ml-1">
                <span>Members</span>
                <ChevronRight className="h-3 w-3 text-slate-400" />
                <span className="text-indigo-600 font-bold">
                  {user.firstName} {user.lastName}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-2 font-bold h-10 rounded-xl border-slate-200 hover:bg-slate-50 px-4"
            >
              <MessageSquare className="h-4 w-4" /> Message
            </Button>
            <Link href={`/members/${id}/edit`}>
              <Button size="sm" className="gap-2 font-bold h-10 rounded-xl px-6 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all border-none">
                <Edit3 className="h-4 w-4" /> Edit Account
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Profile Card & Quick Info */}
            <div className="lg:col-span-4">
              <div className="sticky top-4">
                <UserInfoCard member={member} />
              </div>
            </div>

            {/* Right Column: Main Content */}
            <div className="lg:col-span-8 space-y-8">
              <Tabs defaultValue="profile" className="w-full">
                <div className="mb-6">
                  <TabsList className="bg-slate-100/80 p-1.5 h-13 w-full lg:w-auto flex lg:inline-flex justify-start lg:justify-center border border-slate-200 rounded-2xl shadow-sm">
                    <TabsTrigger
                      value="profile"
                      className="px-8 font-black text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all h-full rounded-xl"
                    >
                      Profile
                    </TabsTrigger>
                    <TabsTrigger
                      value="stats"
                      className="px-8 font-black text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all h-full rounded-xl"
                    >
                      Activity Stats
                    </TabsTrigger>
                    <TabsTrigger
                      value="gamification"
                      className="px-8 font-black text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all h-full rounded-xl"
                    >
                      Gamification
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                  <TabsContent
                    value="profile"
                    className="mt-0 border-none p-6 outline-none animate-in fade-in-50 duration-300"
                  >
                    <ProfileTab member={member} />
                  </TabsContent>

                  <TabsContent
                    value="stats"
                    className="mt-0 border-none p-6 outline-none animate-in fade-in-50 duration-300"
                  >
                    <StatsTab userId={user?.id} />
                  </TabsContent>

                  <TabsContent
                    value="gamification"
                    className="mt-0 border-none p-6 outline-none animate-in fade-in-50 duration-300"
                  >
                    <GamificationTab userId={user?.id} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

