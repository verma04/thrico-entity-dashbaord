"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ShieldCheck, ShieldAlert } from "lucide-react";
import UsersTab from "./users-tab";
import RolesTab from "./roles-tab";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { cn } from "@/lib/utils";

export default function RebacSettings() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Access Control"
        description="Manage administrative identities, resource policies, and platform security scopes."
        breadcrumb="IAM & Governance"
        icon={ShieldCheck}
        badgeText="Security Center"
        showLiveIndicator={false}
      />

      {/* Header & Tabs */}
      <div className="px-6 py-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl border border-border/40 w-fit">
          <button
            onClick={() => setActiveTab("users")}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
              activeTab === "users"
                ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            <Users className="h-3.5 w-3.5" />
            Identity Directory
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
              activeTab === "roles"
                ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            IAM Policies
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-medium text-emerald-600 uppercase tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ReBAC Active
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "users" && (
          <div className="animate-in fade-in slide-in-from-bottom-1 duration-400">
            <UsersTab />
          </div>
        )}
        {activeTab === "roles" && (
          <div className="animate-in fade-in slide-in-from-bottom-1 duration-400">
            <RolesTab />
          </div>
        )}
      </div>
    </EcosystemWrapper>
  );
}
