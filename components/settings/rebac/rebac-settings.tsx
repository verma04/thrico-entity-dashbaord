"use client";

import { useState } from "react";
import { Users, ShieldCheck, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import UsersTab from "./users-tab";
import RolesTab from "./roles-tab";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "users", label: "Team Members", icon: Users },
  { id: "roles", label: "Roles & Permissions", icon: ShieldAlert },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function RebacSettings() {
  const [activeTab, setActiveTab] = useState<TabId>("users");

  return (
    <EcosystemWrapper>
      {/* Page Header */}
      <div className="px-6 pt-6">
        <EcosystemHeader
          title="Users & Access"
          description="Manage team members, roles, and permission scopes for your workspace."
          breadcrumb="Settings"
          icon={ShieldCheck}
          badgeText="IAM"
          showLiveIndicator={false}
        />
      </div>

      {/* Tab Bar - Styled like MenuItemsLayout */}
      <div className="px-6 border-b border-zinc-100/80 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <nav className="flex items-center h-12 gap-0.5 overflow-x-auto no-scrollbar" role="tablist">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "group/tab relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 whitespace-nowrap overflow-hidden",
                  isActive
                    ? "text-indigo-700 font-semibold"
                    : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/70"
                )}
              >
                {/* Animated pill background */}
                {isActive && (
                  <motion.span
                    layoutId="rebac-tab-pill"
                    className="absolute inset-0 rounded-lg bg-indigo-50 border border-indigo-100/80 shadow-[0_1px_3px_0_oklch(0.55_0.24_264/0.08)]"
                    transition={{ type: "spring", bounce: 0.18, duration: 0.38 }}
                  />
                )}

                {/* Icon */}
                <Icon
                  className={cn(
                    "relative z-10 h-3.5 w-3.5 shrink-0 transition-all duration-200",
                    isActive
                      ? "text-indigo-600"
                      : "text-zinc-400 group-hover/tab:text-zinc-600"
                  )}
                  strokeWidth={2}
                />

                {/* Label */}
                <span className="relative z-10 leading-none">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="px-6 pb-6">
        {activeTab === "users" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
            <UsersTab />
          </div>
        )}
        {activeTab === "roles" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
            <RolesTab />
          </div>
        )}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </EcosystemWrapper>
  );
}
