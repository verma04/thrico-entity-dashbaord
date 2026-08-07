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
  Globe,
  FileText,
  Sparkles,
} from "lucide-react";
import { NavRailItem } from "./sidebar-components";

// Helper to determine the active tab for the parent sidebar
function getActiveTab(pathName: string) {
  if (pathName.startsWith("/ai-agent")) return "ai";
  if (pathName.startsWith("/gamification")) return "gamification";
  if (pathName.startsWith("/members")) return "members";

  if (
    pathName.startsWith("/moderation") ||
    pathName.startsWith("/feed") ||
    pathName.startsWith("/reports") ||
    pathName.startsWith("/trust-center")
  )
    return "content";

  const moduleRoutes = [
    "/communities",
    "/events",
    "/forums",
    "/moments",
    "/jobs",
    "/news",
    "/opportunities",
    "/polls",
    "/shop",
    "/sponsors",
    "/surveys",
    "/stories",
    "/learnings",
    "/mentorship",
    "/offers",
    "/media-gallery",
    "/feed",
    "/celebrations",
    "/faq",
    "/chat",
    "/contacts",
    "/feedback",
    "/listing",
    "/moderation",
    "/reports",
    "/support",
    "/trust-center",
    "/wall-of-fame",
  ];
  if (moduleRoutes.some((route) => pathName.startsWith(route)))
    return "modules";

  if (pathName.startsWith("/app-layout")) return "website";
  if (pathName.startsWith("/settings")) return "settings";
  if (pathName.startsWith("/email")) return "email";
  if (pathName.startsWith("/mobile-app")) return "mobile-app";
  if (pathName.startsWith("/ai-agent")) return "ai";
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
          label="Members"
          href="/members"
          active={activeTab === "members"}
        />
        <NavRailItem
          icon={<FileText size={20} />}
          label="Content"
          href="/feed"
          active={activeTab === "content"}
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
          icon={<Globe size={20} />}
          label="Website"
          href="/app-layout"
          active={activeTab === "website"}
        />
        <NavRailItem
          icon={<Smartphone size={20} />}
          label="Mobile App"
          href="/mobile-app"
          active={activeTab === "mobile-app"}
        />
        <NavRailItem
          icon={<Sparkles size={20} />}
          label="AI"
          href="/ai-agent"
          active={activeTab === "ai"}
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
          active={pathName === "/settings/users/all"}
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
