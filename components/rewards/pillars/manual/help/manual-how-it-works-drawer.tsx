"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import {
  HelpCircle,
  X,
  Layers,
  Ticket,
  Coins,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Gamepad2,
  Lock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualLifecycleFlow } from "../manual-lifecycle-flow";
import { ManualArchitectureSimulator } from "../manual-architecture-simulator";
import { ManualAssetClasses } from "../manual-asset-classes";
import { ManualBenefitsGrid } from "../manual-benefits-grid";
import { ManualGamificationHooks } from "../manual-gamification-hooks";
import { ManualCouponType } from "@/graphql/actions/rewards/manual";
import { toast } from "sonner";

interface ManualHowItWorksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateClick?: () => void;
}

export function ManualHowItWorksDrawer({
  isOpen,
  onClose,
  onCreateClick,
}: ManualHowItWorksDrawerProps) {
  const [activeTab, setActiveTab] = useState<string>("lifecycle");
  const [selectedType, setSelectedType] = useState<ManualCouponType>(
    ManualCouponType.ONE_TO_ONE
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied "${code}" to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSimulateAssignment = () => {
    const code =
      selectedType === ManualCouponType.ONE_TO_ONE
        ? `VIP-SUMMER-${Math.floor(1000 + Math.random() * 9000)}`
        : "WELCOME-HERO-2026";
    toast.success(`Allocated Code: ${code}`, {
      description: "State transitioned: UNASSIGNED → ASSIGNED (Single-use lock).",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="top"
        className="h-[100dvh] w-screen p-0 border-none outline-none bg-background dark:bg-zinc-950 z-50 overflow-hidden flex flex-col"
      >
        {/* Top Navigation Bar */}
        <div className="border-b border-border/80 bg-card/95 backdrop-blur-md px-6 py-3.5 shrink-0 z-10">
          <div className="w-12 h-1 bg-muted-foreground/25 rounded-full mx-auto mb-3" />

          <div className="max-w-[1080px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground tracking-tight">
                    How Manual & Internal Vouchers Work
                  </h3>
                  <Badge className="bg-emerald-600 text-white font-bold text-[9px] px-1.5 py-0 uppercase tracking-wider">
                    Step Guide
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Architecture overview, supported asset types, and gamification distribution hooks.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onCreateClick && (
                <Button
                  onClick={() => {
                    onClose();
                    onCreateClick();
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold h-8 shadow-xs cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Create Internal Voucher
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Step Tabs */}
        <div className="border-b border-border/60 bg-muted/30 px-6 py-2 shrink-0">
          <div className="max-w-[1080px] mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-muted/70 p-1 rounded-lg border border-border h-auto flex flex-wrap sm:flex-nowrap gap-1">
                <TabsTrigger
                  value="lifecycle"
                  className="text-xs font-semibold px-3 py-1.5 gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs cursor-pointer"
                >
                  <span className="h-4 w-4 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                    1
                  </span>
                  Lifecycle & Architecture
                </TabsTrigger>

                <TabsTrigger
                  value="assets"
                  className="text-xs font-semibold px-3 py-1.5 gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs cursor-pointer"
                >
                  <span className="h-4 w-4 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px] font-bold">
                    2
                  </span>
                  Supported Asset Classes
                </TabsTrigger>

                <TabsTrigger
                  value="benefits"
                  className="text-xs font-semibold px-3 py-1.5 gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs cursor-pointer"
                >
                  <span className="h-4 w-4 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center text-[10px] font-bold">
                    3
                  </span>
                  Platform Advantages
                </TabsTrigger>

                <TabsTrigger
                  value="gamification"
                  className="text-xs font-semibold px-3 py-1.5 gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs cursor-pointer"
                >
                  <span className="h-4 w-4 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 flex items-center justify-center text-[10px] font-bold">
                    4
                  </span>
                  Gamification Hooks
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          <div className="max-w-[1080px] mx-auto space-y-6">
            {activeTab === "lifecycle" && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                {/* 3-Step Lifecycle Visual Flow */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Step 1 • End-to-End Voucher Lifecycle
                  </span>
                  <ManualLifecycleFlow />
                </div>

                {/* Architecture Mode Selector & Simulator */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Emission Engine Simulation
                  </span>
                  <ManualArchitectureSimulator
                    selectedType={selectedType}
                    onSelectType={setSelectedType}
                    onSimulateAssignment={handleSimulateAssignment}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => setActiveTab("assets")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold h-9 cursor-pointer"
                  >
                    Next: Supported Asset Classes
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "assets" && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">
                    Supported Proprietary Asset Types
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Pillar 1 rewards can issue promo codes, pre-generated voucher batches, entity currency, status badges, and event access tickets.
                  </p>
                </div>

                <ManualAssetClasses
                  copiedCode={copiedCode}
                  onCopyCode={copyCode}
                />

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("lifecycle")}
                    className="text-xs font-semibold h-9"
                  >
                    Back: Lifecycle Flow
                  </Button>
                  <Button
                    onClick={() => setActiveTab("benefits")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold h-9 cursor-pointer"
                  >
                    Next: Strategic Advantages
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "benefits" && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">
                    Strategic Advantages of Internal Rewards
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Why high-growth communities use self-sovereign voucher pools alongside external gift cards.
                  </p>
                </div>

                <ManualBenefitsGrid />

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("assets")}
                    className="text-xs font-semibold h-9"
                  >
                    Back: Asset Classes
                  </Button>
                  <Button
                    onClick={() => setActiveTab("gamification")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold h-9 cursor-pointer"
                  >
                    Next: Gamification Hooks
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "gamification" && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">
                    Gamification & Minigame Distribution
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Attach manual reward vouchers directly into engagement minigames, milestone unlocks, and automated drop rules.
                  </p>
                </div>

                <ManualGamificationHooks />

                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("benefits")}
                    className="text-xs font-semibold h-9"
                  >
                    Back: Strategic Advantages
                  </Button>

                  {onCreateClick && (
                    <Button
                      onClick={() => {
                        onClose();
                        onCreateClick();
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold h-9 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Create Your First Internal Voucher
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
