"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import {
  Building2,
  Briefcase,
  Award,
  Heart,
  GraduationCap,
  Building,
  Type,
  MapPin,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";

export default function ClassificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          : pathname.includes("/members/experience")
            ? "experience"
            : pathname.includes("/members/education")
              ? "education"
              : pathname.includes("/members/headline")
                ? "headline"
                : pathname.includes("/members/location")
                  ? "location"
                  : "industries";

  const tabs = [
    {
      id: "interests",
      label: "Interests",
      icon: <Heart className="h-4 w-4" />,
      href: "/members/interests",
    },
    {
      id: "industries",
      label: "Industries",
      icon: <Building2 className="h-4 w-4" />,
      href: "/members/industries",
    },

    {
      id: "skills",
      label: "Skills",
      icon: <Award className="h-4 w-4" />,
      href: "/members/skills",
    },
    {
      id: "functions",
      label: "Job Functions",
      icon: <Briefcase className="h-4 w-4" />,
      href: "/members/functions",
    },
    {
      id: "experience",
      label: "Experience",
      icon: <Building className="h-4 w-4" />,
      href: "/members/experience",
    },
    {
      id: "education",
      label: "Education",
      icon: <GraduationCap className="h-4 w-4" />,
      href: "/members/education",
    },
    {
      id: "headline",
      label: "Headlines",
      icon: <Type className="h-4 w-4" />,
      href: "/members/headline",
    },
    {
      id: "location",
      label: "Locations",
      icon: <MapPin className="h-4 w-4" />,
      href: "/members/location",
    },
  ];

  const { data: subData, loading: subLoading } = useCheckMemberSubscription();
  const hasReachedLimit = subData?.checkMemberSubscription?.hasReachedLimit;
  const message = subData?.checkMemberSubscription?.message;

  console.log(message);
  if (subLoading) {
    return (
      <EcosystemWrapper anonymized-1="member-classifications">
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </EcosystemWrapper>
    );
  }

  if (hasReachedLimit) {
    return (
      <EcosystemWrapper anonymized-1="member-classifications">
        <div className="flex flex-col gap-6">
          <EcosystemHeader
            title="Member Classifications"
            badgeText="Directory Settings"
            description="Manage taxonomy classifications to catalog, segment, and filter community members."
            icon={Building2}
          />
          <div className="flex h-[400px] items-center justify-center bg-card rounded-xl border border-border p-6">
            <div className="max-w-md w-full bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-8 text-center space-y-4 shadow-sm">
              <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto" />
              <h2 className="text-xl font-bold text-amber-900">
                Feature Locked
              </h2>
              <p className="text-amber-700 font-medium">
                {message ||
                  "You have reached your subscription limit. Please upgrade your subscription to access member classifications."}
              </p>
              <div className="pt-4">
                <button
                  className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-white border border-amber-200 text-amber-900 hover:bg-amber-100 h-10 py-2 px-4 w-full"
                  onClick={() => router.push("/settings/subscription")}
                >
                  Upgrade Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      </EcosystemWrapper>
    );
  }

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

        <div className="w-full">{children}</div>
      </div>
    </EcosystemWrapper>
  );
}
