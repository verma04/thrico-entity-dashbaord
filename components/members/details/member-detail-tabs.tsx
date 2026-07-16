"use client";

import React from "react";
import { 
  User as UserIcon, Activity, Trophy, Network, 
  BarChart3, Clock, MessageSquare, LayoutGrid, 
  Store, Briefcase, Tag, Users 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "./profile-tab";
import { StatsTab } from "./stats-tab";
import { GamificationTab } from "./gamification-tab";
import { ReferralsTab } from "./referrals-tab";

import { PollsTab } from "./polls-tab";
import { MomentsTab } from "./moments-tab";
import { ForumsTab } from "./forums-tab";
import { FeedTab } from "./feed-tab";
import { ListingsTab } from "./listings-tab";
import { JobsTab } from "./jobs-tab";
import { OffersTab } from "./offers-tab";
import { CommunitiesTab } from "./communities-tab";

const MEMBER_TABS = [
  { value: "profile", label: "Profile", icon: UserIcon },
  { value: "stats", label: "Activity", icon: Activity },
  { value: "gamification", label: "Gamification", icon: Trophy },
  { value: "referrals", label: "Referrals", icon: Network },
  { value: "polls", label: "Polls", icon: BarChart3 },
  { value: "moments", label: "Moments", icon: Clock },
  { value: "forums", label: "Forums", icon: MessageSquare },
  { value: "feed", label: "Feed", icon: LayoutGrid },
  { value: "listings", label: "Listings", icon: Store },
  { value: "jobs", label: "Jobs", icon: Briefcase },
  { value: "offers", label: "Offers", icon: Tag },
  { value: "communities", label: "Communities", icon: Users },
] as const;

interface MemberDetailTabsProps {
  member: any;
  userId: string;
}

export function MemberDetailTabs({ member, userId }: MemberDetailTabsProps) {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <div className="overflow-x-auto overflow-y-hidden border-b border-border/60 mb-6 pb-[1px] no-scrollbar">
        <TabsList className="w-auto flex justify-start gap-2 bg-transparent p-0 h-auto rounded-none">
          {MEMBER_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="gap-2 px-4 py-3 text-xs font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="mt-4">
        <TabsContent value="profile" className="mt-0 outline-none animate-in fade-in-50 duration-500">
          <ProfileTab member={member} />
        </TabsContent>

        <TabsContent value="stats" className="mt-0 outline-none animate-in fade-in-50 duration-500">
          <StatsTab userId={userId} />
        </TabsContent>

        <TabsContent value="gamification" className="mt-0 outline-none animate-in fade-in-50 duration-500">
          <GamificationTab userId={userId} />
        </TabsContent>

        <TabsContent value="referrals" className="mt-0 outline-none animate-in fade-in-50 duration-500">
          <ReferralsTab userId={userId} />
        </TabsContent>

        <TabsContent value="polls" className="mt-0 outline-none animate-in fade-in-50 duration-500">
          <PollsTab userId={userId} />
        </TabsContent>

        <TabsContent value="moments" className="mt-0 outline-none animate-in fade-in-50 duration-500">
          <MomentsTab userId={userId} />
        </TabsContent>

        <TabsContent value="forums" className="mt-0 outline-none animate-in fade-in-50 duration-500">
          <ForumsTab userId={userId} />
        </TabsContent>

        <TabsContent value="feed" className="mt-0 outline-none animate-in fade-in-50 duration-500">
          <FeedTab userId={userId} />
        </TabsContent>

        <TabsContent value="listings" className="mt-0 outline-none animate-in fade-in-50 duration-500">
          <ListingsTab userId={userId} />
        </TabsContent>

        <TabsContent value="jobs" className="mt-0 outline-none animate-in fade-in-50 duration-500">
          <JobsTab userId={userId} />
        </TabsContent>

        <TabsContent value="offers" className="mt-0 outline-none animate-in fade-in-50 duration-500">
          <OffersTab userId={userId} />
        </TabsContent>

        <TabsContent value="communities" className="mt-0 outline-none animate-in fade-in-50 duration-500">
          <CommunitiesTab userId={userId} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
