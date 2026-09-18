"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Coins, AlertCircle, Plus, Loader2 } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { ChatSessionsSidebar } from "@/components/ai/chat-sessions-sidebar";
import { useGetAiWalletOverview } from "@/graphql/actions/ai";
import { Button } from "@/components/ui/button";
import { AITopupModal } from "@/components/ai/ai-topup-modal";

interface ChatSidebarContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const ChatSidebarContext = createContext<ChatSidebarContextType>({
  sidebarOpen: true,
  setSidebarOpen: () => {},
  toggleSidebar: () => {},
});

export const useChatSidebar = () => useContext(ChatSidebarContext);

export default function AIChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showTopupModal, setShowTopupModal] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const { data, loading, refetch } = useGetAiWalletOverview();
  const quota = data?.getAiWalletOverview?.quota;
  const balance = quota?.balance;
  const isZeroBalance = !loading && quota !== undefined && (balance ?? 0) <= 0;

  useEffect(() => {
    if (isZeroBalance) {
      toast.error(
        "AI Chat is unavailable. Your token balance is 0. Please top up tokens in Usage & Billing.",
        { id: "zero-ai-balance" }
      );
      router.replace("/ai/usage?insufficient_balance=true");
    }
  }, [isZeroBalance, router]);

  // Loading state while verifying token quota
  if (loading) {
    return (
      <ChatSidebarContext.Provider
        value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}
      >
        <EcosystemWrapper className="m-2 flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="h-[calc(100vh-125px)] max-h-[calc(100vh-125px)] w-full flex items-center justify-center rounded-2xl border border-border/70 bg-background shadow-xs relative">
            <div className="flex flex-col items-center gap-3 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-xs text-muted-foreground font-medium">
                Verifying AI token quota…
              </p>
            </div>
          </div>
        </EcosystemWrapper>
      </ChatSidebarContext.Provider>
    );
  }

  // Zero balance state: block chat completely and provide immediate topup options
  if (isZeroBalance) {
    return (
      <ChatSidebarContext.Provider
        value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}
      >
        <EcosystemWrapper className="m-2 flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="h-[calc(100vh-125px)] max-h-[calc(100vh-125px)] w-full flex items-center justify-center rounded-2xl border border-border/70 bg-background shadow-xs relative p-6">
            <div className="max-w-md w-full text-center space-y-5 bg-card/60 backdrop-blur-xs p-8 rounded-2xl border border-border/80 shadow-sm">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Coins className="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-foreground">
                  AI Chat Unavailable
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your AI token balance is currently{" "}
                  <span className="font-semibold text-foreground">0 tokens</span>.
                  To open chat sessions and interact with the AI Copilot and autonomous agents, please add compute credits.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/ai/usage")}
                  className="text-xs h-9 cursor-pointer"
                >
                  View AI Usage
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowTopupModal(true)}
                  className="text-xs h-9 gap-1.5 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Credits Now
                </Button>
              </div>

              <p className="text-[11px] text-muted-foreground/70">
                Redirecting to AI Usage & Billing…
              </p>
            </div>

            {showTopupModal && (
              <AITopupModal
                onClose={() => {
                  setShowTopupModal(false);
                  refetch();
                }}
                quota={quota}
              />
            )}
          </div>
        </EcosystemWrapper>
      </ChatSidebarContext.Provider>
    );
  }

  return (
    <ChatSidebarContext.Provider
      value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}
    >
      <EcosystemWrapper className="m-2 flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="h-[calc(100vh-125px)] max-h-[calc(100vh-125px)] w-full flex overflow-hidden rounded-2xl border border-border/70 bg-background shadow-xs relative">
          {/* Left Sessions Sidebar */}
          <ChatSessionsSidebar
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
          />

          {/* Center Chat Area */}
          <div className="flex-1 h-full min-h-0 min-w-0 flex flex-col overflow-hidden relative">
            {children}
          </div>
        </div>
      </EcosystemWrapper>
    </ChatSidebarContext.Provider>
  );
}
