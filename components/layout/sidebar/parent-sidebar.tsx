"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Trophy,
  Grid,
  Settings,
  UserPlus,
  ArrowUpCircle,
  Users2,
  Mail,
  Smartphone,
  Blocks,
} from "lucide-react";
import { NavRailItem } from "./sidebar-components";

// Helper to determine the active tab for the parent sidebar
function getActiveTab(pathName: string) {
  if (pathName.startsWith("/gamification")) return "gamification";
  if (pathName.startsWith("/members")) return "community";
  if (pathName.startsWith("/settings/modules")) return "modules";
  if (pathName.startsWith("/settings")) return "settings";
  if (pathName.startsWith("/email")) return "email";
  if (pathName.startsWith("/mobile-app")) return "mobile-app";
  return "home";
}

export function ParentSidebar() {
  const pathName = usePathname();
  const activeTab = getActiveTab(pathName);

  return (
    <div className="hidden md:flex w-[72px] flex-shrink-0 bg-black text-white flex-col items-center py-4 border-r border-neutral-900 z-50 rounded-xl my-2 mt-2 ml-2 mt-0 shadow-sm">
      <div className="flex flex-col gap-6 w-full items-center">
        {/* Nav Items */}
        <NavRailItem
          icon={<Home size={20} />}
          label="Home"
          href="/"
          active={activeTab === "home"}
        />
        <NavRailItem
          icon={<Users size={20} />}
          label="Community"
          href="/members"
          active={activeTab === "community"}
        />
        <NavRailItem
          icon={<Trophy size={20} />}
          label="Gamification"
          href="/gamification/points-and-badges"
          active={activeTab === "gamification"}
        />
        <NavRailItem
          icon={<Blocks size={20} />}
          label="Modules"
          href="/communities"
          active={activeTab === "modules"}
        />
        <NavRailItem
          icon={<Mail size={20} />}
          label="Email"
          href="/email"
          active={activeTab === "email"}
        />
        <NavRailItem
          icon={<Smartphone size={20} />}
          label="Mobile App"
          href="/mobile-app/android"
          active={activeTab === "mobile-app"}
        />
        <NavRailItem
          icon={<Settings size={20} />}
          label="Settings"
          href="/settings"
          active={activeTab === "settings"}
        />
      </div>

      <div className="mt-auto flex flex-col gap-6 w-full items-center">
        <NavRailItem
          icon={<Users2 size={20} />}
          label="Team"
          href="/settings/users/all"
        />
        <NavRailItem
          icon={<ArrowUpCircle size={20} className="text-purple-400" />}
          label="Upgrade"
          href="/settings/subscription"
        />
      </div>
    </div>
  );
}
