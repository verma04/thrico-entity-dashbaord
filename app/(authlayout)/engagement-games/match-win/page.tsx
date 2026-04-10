"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchWinManager } from "@/components/rewards/match-win/match-win-manager";
import { MatchWinGame } from "@/components/rewards/match-win/match-win-game";
import { Settings2, Gamepad2, Trophy } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export default function MatchWinPage() {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Match & Win"
        badgeText="Engagement"
        description="Configure the 3-column symbol matching game — set probabilities, rewards, and campaign windows."
        icon={Trophy}
      />

      <Tabs defaultValue="manage" className="w-full flex-col gap-4 flex">
        <EcosystemActionBar shadow="none">
          <EcosystemActionBar.Group>
            <TabsList className="h-8 bg-muted/40 border border-border rounded-lg p-0.5 gap-0.5">
              <TabsTrigger
                value="manage"
                className="h-7 px-4 rounded-md text-xs font-medium gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground"
              >
                <Settings2 className="h-3 w-3" />
                Configuration
              </TabsTrigger>
              <TabsTrigger
                value="play"
                className="h-7 px-4 rounded-md text-xs font-medium gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground"
              >
                <Gamepad2 className="h-3 w-3" />
                Live Preview
              </TabsTrigger>
            </TabsList>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Group align="right">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground font-medium">
                Live
              </span>
            </div>
          </EcosystemActionBar.Group>
        </EcosystemActionBar>

        <EcosystemContainer className="p-2">
          <TabsContent
            value="manage"
            className="m-0 focus-visible:outline-hidden"
          >
            <MatchWinManager />
          </TabsContent>

          <TabsContent
            value="play"
            className="m-0 focus-visible:outline-hidden"
          >
            <div className="p-8">
              <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-8 text-center space-y-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto">
                  <Gamepad2 className="h-5 w-5 text-indigo-500" />
                </div>
                <h2 className="text-base font-semibold text-foreground">
                  Game Preview
                </h2>
                <p className="text-xs text-muted-foreground">
                  Interactive preview of the match-win game as users experience
                  it.
                </p>
                <div className="pt-2">
                  <MatchWinGame />
                </div>
              </div>
            </div>
          </TabsContent>
        </EcosystemContainer>
      </Tabs>
    </EcosystemWrapper>
  );
}
