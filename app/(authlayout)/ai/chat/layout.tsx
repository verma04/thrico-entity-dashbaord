"use client";

import React, { useState, createContext, useContext } from "react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { ChatSessionsSidebar } from "@/components/ai/chat-sessions-sidebar";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

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
