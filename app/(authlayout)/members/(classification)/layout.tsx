"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { Building2, Briefcase, Award, Heart } from "lucide-react";

export default function ClassificationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active tab based on route
  const activeTab = pathname.includes("/members/industries")
    ? "industries"
    : pathname.includes("/members/functions")
    ? "functions"
    : pathname.includes("/members/skills")
    ? "skills"
    : pathname.includes("/members/interests")
    ? "interests"
    : "industries";

  const tabs = [
    {
      id: "industries",
      label: "Industries",
      icon: <Building2 className="h-4 w-4" />,
      href: "/members/industries",
    },
    {
      id: "functions",
      label: "Job Functions",
      icon: <Briefcase className="h-4 w-4" />,
      href: "/members/functions",
    },
    {
      id: "skills",
      label: "Skills",
      icon: <Award className="h-4 w-4" />,
      href: "/members/skills",
    },
    {
      id: "interests",
      label: "Interests",
      icon: <Heart className="h-4 w-4" />,
      href: "/members/interests",
    },
  ];

  return (
    <EcosystemWrapper anonymized-1="member-classifications">
      <div className="flex flex-col gap-6">
        <EcosystemHeader
          title="Member Classifications"
          badgeText="Directory Settings"
          description="Manage taxonomy classifications to catalog, segment, and filter community members."
          icon={Building2}
        />

        {/* Modern Sub-tabs Navigation */}
        <div className="border-b border-border bg-card rounded-xl shadow-sm px-6 flex items-center justify-between">
          <div className="flex gap-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => router.push(tab.href)}
                  className={`flex items-center gap-2 px-1 py-4 text-sm font-semibold border-b-2 transition-all duration-200 -mb-[2px] ${
                    isActive
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full">
          {children}
        </div>
      </div>
    </EcosystemWrapper>
  );
}
