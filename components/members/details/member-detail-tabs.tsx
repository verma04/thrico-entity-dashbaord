"use client";

import React from "react";
import { User as UserIcon, Activity, Trophy, Network } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "./profile-tab";
import { StatsTab } from "./stats-tab";
import { GamificationTab } from "./gamification-tab";
import { ReferralsTab } from "./referrals-tab";

const MEMBER_TABS = [
  { value: "profile", label: "Profile", icon: UserIcon },
  { value: "stats", label: "Activity", icon: Activity },
  { value: "gamification", label: "Gamification", icon: Trophy },
  { value: "referrals", label: "Referrals", icon: Network },
] as const;

interface MemberDetailTabsProps {
  member: any;
  userId: string;
}

export function MemberDetailTabs({ member, userId }: MemberDetailTabsProps) {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="w-full justify-start gap-2 bg-transparent p-0 h-auto border-b border-border/60 rounded-none mb-6">
        {MEMBER_TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="gap-2 px-4 py-3 text-xs font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors"
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

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
      </div>
    </Tabs>
  );
}
