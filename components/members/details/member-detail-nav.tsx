"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User as UserIcon, Activity, Trophy, Network, 
  BarChart3, Clock, MessageSquare, LayoutGrid, 
  Store, Briefcase, Tag, Users, Calendar
} from "lucide-react";

import { useMemberDetails } from "./member-context";

const MEMBER_TABS = [
  { value: "", label: "Profile", icon: UserIcon },
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
  { value: "events", label: "Events", icon: Calendar },
] as const;

export function MemberDetailNav() {
  const pathname = usePathname();
  const { member } = useMemberDetails();
  
  if (!member) return null;

  const basePath = `/members/${member.id}`;

  return (
    <div className="w-full">
      <div className="overflow-x-auto overflow-y-hidden border-b border-border/60 mb-6 pb-[1px] no-scrollbar">
        <nav className="w-auto flex justify-start gap-2 bg-transparent p-0 h-auto rounded-none">
          {MEMBER_TABS.map((tab) => {
            const href = tab.value ? `${basePath}/${tab.value}` : basePath;
            const isActive = pathname === href;
            
            return (
              <Link
                key={tab.value}
                href={href}
                className={`
                  flex items-center gap-2 px-4 py-3 text-xs font-semibold rounded-none border-b-2 transition-colors whitespace-nowrap
                  ${isActive 
                    ? "border-primary text-primary" 
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}
                `}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
