"use client";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Separator } from "@/components/ui/separator";
import { SlackIntegrationCard } from "@/components/settings/integrations/slack-integration-card";
import { GoogleMeetIntegrationCard } from "@/components/settings/integrations/google-meet-integration-card";
import { SendGridIntegrationCard } from "@/components/settings/integrations/sendgrid-integration-card";
import { Search, Blocks, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemHeader } from "@/components/layout/ecosystem";

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const allIntegrations = [
    {
      id: "slack",
      name: "Slack",
      component: <SlackIntegrationCard />,
    },
  ];

  const filteredIntegrations = allIntegrations.filter((integration) =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="App Integrations"
        description="Connect your favorite tools to enhance your workflow and automate data syncing."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Integrations" },
        ]}
        icon={Blocks}
        badgeText="Webhooks & API"
        showLiveIndicator={false}
        actions={
          <EcosystemActionBar
            shadow="none"
            className="p-0 border-none bg-transparent gap-2"
          >
            <EcosystemActionBar.Group align="right">
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search integrations..."
                  className="pl-8 h-8 text-[12px] bg-card border-border shadow-sm transition-all focus-visible:ring-1 focus-visible:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </EcosystemActionBar.Group>
          </EcosystemActionBar>
        }
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-8">
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
            {/* Table Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/50">
              <div className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
                Application Provider
              </div>
              <div className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase w-[100px] text-right sm:text-center">
                Connection
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-border p-0">
              {filteredIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="p-5 hover:bg-muted/50 transition-colors"
                >
                  {integration.component}
                </div>
              ))}
            </div>

            {filteredIntegrations.length === 0 && (
              <div className="p-16 flex flex-col items-center text-center justify-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Inbox className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-[13px] font-semibold text-foreground">
                  No matching integrations
                </p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  We couldn't find any tools matching "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
