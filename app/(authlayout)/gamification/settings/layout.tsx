"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { ScrollText, MessageCircleQuestion, Gamepad2, Layers } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

function GamificationSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Extract active tab from pathname
  const getActiveTab = () => {
    if (pathname.includes("/general")) return "general";
    if (pathname.includes("/term_and_conditions")) return "terms";
    if (pathname.includes("/faq")) return "faq";
    return "general"; // Default to general
  };

  const activeTab = getActiveTab();

  const handleTabChange = (value: string) => {
    const basePath = "/gamification/settings";
    switch (value) {
      case "general":
        router.push(`${basePath}/general`);
        break;
      case "terms":
        router.push(`${basePath}/term_and_conditions`);
        break;
      case "faq":
        router.push(`${basePath}/faq`);
        break;
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Gamification Content"
        badgeText="Settings"
        description="Manage the legal terms, conditions, and frequently asked questions for your gamification modules."
        icon={Gamepad2}
      />

      <EcosystemActionBar>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-transparent h-auto p-0 gap-8">
            <TabsTrigger 
              value="general" 
              className="px-0 py-4 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none gap-2"
            >
              <div className="flex items-center gap-2 group">
                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center group-data-[state=active]:bg-indigo-500/10 transition-colors">
                  <Layers className="h-4 w-4 text-slate-400 group-data-[state=active]:text-indigo-600" />
                </div>
                <span className="text-sm font-bold text-slate-500 group-data-[state=active]:text-slate-900 transition-colors">
                  General Config
                </span>
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="terms"
              className="px-0 py-4 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none gap-2"
            >
              <div className="flex items-center gap-2 group">
                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center group-data-[state=active]:bg-indigo-500/10 transition-colors">
                  <ScrollText className="h-4 w-4 text-slate-400 group-data-[state=active]:text-indigo-600" />
                </div>
                <span className="text-sm font-bold text-slate-500 group-data-[state=active]:text-slate-900 transition-colors">
                  Terms & Conditions
                </span>
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="faq"
              className="px-0 py-4 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none gap-2"
            >
              <div className="flex items-center gap-2 group">
                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center group-data-[state=active]:bg-indigo-500/10 transition-colors">
                  <MessageCircleQuestion className="h-4 w-4 text-slate-400 group-data-[state=active]:text-indigo-600" />
                </div>
                <span className="text-sm font-bold text-slate-500 group-data-[state=active]:text-slate-900 transition-colors">
                  Knowledge Base & FAQ
                </span>
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </EcosystemActionBar>

      <EcosystemContainer className="p-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default GamificationSettingsLayout;
