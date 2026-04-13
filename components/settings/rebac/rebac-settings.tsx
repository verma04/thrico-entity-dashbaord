"use client";

import { useState } from "react";
import { Users, ShieldCheck, ShieldAlert, Key, Settings2 } from "lucide-react";
import { motion } from "framer-motion";
import UsersTab from "./users-tab";
import RolesTab from "./roles-tab";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "users", label: "Team Members", icon: Users, description: "Manage platform access" },
  { id: "roles", label: "Roles", icon: ShieldAlert, description: "Define permission logic" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function RebacSettings() {
  const [activeTab, setActiveTab] = useState<TabId>("users");

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Users & Access"
        description="Manage team members, roles, and platform permissions."
        badgeText="IAM"
        icon={ShieldCheck}
      />

      <EcosystemActionBar shadow="none">
         <EcosystemActionBar.Group grow>
            <div className="flex items-center gap-1 bg-zinc-100/50 p-1 rounded-xl border border-zinc-200/50 w-fit">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "group/tab relative flex items-center gap-2 px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200",
                      isActive
                        ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/50"
                        : "text-zinc-500 hover:text-zinc-800 hover:bg-white/50"
                    )}
                  >
                    <Icon className={cn("h-3.5 w-3.5 shrink-0 transition-all duration-200", isActive ? "text-zinc-900" : "text-zinc-400 group-hover/tab:text-zinc-600")} strokeWidth={isActive ? 2 : 1.5} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
         </EcosystemActionBar.Group>

         <EcosystemActionBar.Group align="right">
            <EcosystemActionBar.Item>
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-400">
                  <Key className="h-3 w-3" />
                  IAM Active
               </div>
            </EcosystemActionBar.Item>
         </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out px-1">
        {activeTab === "users" && <UsersTab />}
        {activeTab === "roles" && <RolesTab />}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </EcosystemWrapper>
  );
}
