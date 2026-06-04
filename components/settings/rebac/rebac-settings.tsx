"use client";

import { useState } from "react";
import { Users, ShieldCheck, ShieldAlert, Key } from "lucide-react";
import UsersTab from "./users-tab";
import RolesTab from "./roles-tab";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "users", label: "Members", icon: Users },
  { id: "roles", label: "Roles", icon: ShieldAlert },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function RebacSettings() {
  const [activeTab, setActiveTab] = useState<TabId>("users");

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Users & Access"
        description="Manage team members and their permissions."
        badgeText="Settings"
        icon={ShieldCheck}
      />

      <EcosystemActionBar shadow="none">
         <EcosystemActionBar.Group grow>
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/50 w-fit">
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
                        ? "bg-card text-foreground shadow-sm border border-border/50"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    )}
                  >
                    <Icon className={cn("h-3.5 w-3.5 shrink-0 transition-all duration-200", isActive ? "text-foreground" : "text-muted-foreground group-hover/tab:text-muted-foreground")} strokeWidth={isActive ? 2 : 1.5} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
         </EcosystemActionBar.Group>

         <EcosystemActionBar.Group align="right">
            <EcosystemActionBar.Item>
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-muted/30 text-xs text-muted-foreground">
                  <Key className="h-3 w-3" />
                  Active
               </div>
            </EcosystemActionBar.Item>
         </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out px-1">
        {activeTab === "users" && <UsersTab />}
        {activeTab === "roles" && <RolesTab />}
      </div>
    </EcosystemWrapper>
  );
}
