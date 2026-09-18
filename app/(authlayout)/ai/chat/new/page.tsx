"use client";

import React, { useState, useRef } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Shield,
  FileText,
  Users,
  Compass,
  ArrowUpRight,
  Loader2,
  PanelLeft,
  BarChart3,
  CheckSquare,
  Briefcase,
  Search,
  LifeBuoy,
  Rocket,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useChatSidebar } from "../layout";
import { Button } from "@/components/ui/button";
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
  Bubble,
  BubbleContent,
  Marker,
  MarkerIcon,
  MarkerContent,
} from "@/components/ui/chat";
import { useAiAnalyticsChat, AiChatMessage } from "@/graphql/actions/ai";
import { cn } from "@/lib/utils";

export default function NewAIChatPage() {
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useChatSidebar();
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { sendMessage, loading: sendingMessage } = useAiAnalyticsChat();

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180,
      )}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = (overrideText ?? input).trim();
    if (!textToSend || sendingMessage) return;

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      createdAt: new Date().toISOString(),
    };

    setMessages([userMsg]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await sendMessage(textToSend);
      if (res?.sessionId) {
        // Navigate to the newly created session conversation
        router.replace(`/ai/chat/${res.sessionId}`);
      }
    } catch (err) {
      console.error("Failed to send first message:", err);
      const errorMsg: AiChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Failed to connect to agent. Please try again.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const aiQuickActions = [
    {
      label: "Search Members",
      desc: "Find members, profile details, activity & stats",
      message: "Search active community members",
      icon: Users,
      badge: "Member Agent",
    },
    {
      label: "Platform Analytics",
      desc: "Dashboard analytics overview for the last 30 days",
      message: "Show me dashboard analytics overview for the last 30 days",
      icon: BarChart3,
      badge: "Analytics Agent",
    },
    {
      label: "Create Community Poll",
      desc: "Create and publish an interactive poll for the community",
      message: "Create a poll for the community",
      icon: CheckSquare,
      badge: "Surveys Agent",
    },
    {
      label: "Manage Communities",
      desc: "Show active communities and member clusters",
      message: "Show my communities",
      icon: Compass,
      badge: "Community Agent",
    },
    {
      label: "Post a Job",
      desc: "Publish a new job opening in the community",
      message: "Post a job opening in the community",
      icon: Briefcase,
      badge: "Jobs Agent",
    },
    {
      label: "Network & Talent Search",
      desc: "Find founders, skills, live docs, or internet search",
      message: "Search network for talent and founders",
      icon: Search,
      badge: "Search Agent",
    },
    {
      label: "Support Tickets",
      desc: "Check, inspect, or create support tickets",
      message: "Check my support tickets",
      icon: LifeBuoy,
      badge: "Support Agent",
    },
    {
      label: "Member Onboarding",
      desc: "Step-by-step guidance on member onboarding",
      message: "Guide me on member onboarding",
      icon: Rocket,
      badge: "Onboarding Agent",
    },
  ];

  return (
    <div className="flex-1 h-full min-h-0 flex flex-col overflow-hidden bg-background">
      {/* Top Header */}
      <div className="h-14 px-4 sm:px-5 border-b border-border/70 flex items-center justify-between bg-card/40 backdrop-blur-xs select-none shrink-0">
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer shrink-0"
              title="Open history sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="h-8 w-8 rounded-xl overflow-hidden border border-border/70 shrink-0 shadow-2xs bg-background">
            <Image
              src="/thrico_ai.png"
              alt="Thrico AI"
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">
              New Conversation
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Autonomous Multi-Agent Orchestrator</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation / Greeting Area with MessageScroller */}
      <MessageScrollerProvider>
        <MessageScroller className="flex-1 min-h-0 h-full overflow-hidden">
          <MessageScrollerViewport className="py-6 px-4 sm:px-8">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center max-w-2xl mx-auto my-auto text-center space-y-6 py-6">
                <div className="relative">
                  <div className="h-18 w-18 rounded-2xl overflow-hidden border border-border/80 shadow-md bg-background p-1">
                    <Image
                      src="/thrico_ai.png"
                      alt="Thrico AI"
                      width={72}
                      height={72}
                      className="h-full w-full rounded-xl object-cover"
                      priority
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
                  </span>
                </div>

                <div className="space-y-1.5 max-w-lg">
                  <h2 className="text-base font-bold text-foreground">
                    What can Thrico AI Copilot help you with?
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Query member profiles, search talent graphs, launch surveys & polls,
                    monitor platform analytics, or manage jobs and tickets through
                    8 autonomous specialized agents.
                  </p>
                </div>

                {/* AI Quick Actions Grid */}
                <div className="w-full pt-1 text-left space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Suggested Actions
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">
                      Click to run action
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                    {aiQuickActions.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(item.message)}
                          className="group flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/40 hover:border-border hover:shadow-2xs transition-all cursor-pointer text-left gap-2.5"
                        >
                          <div className="h-8 w-8 rounded-lg bg-muted/60 border border-border/60 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:bg-background transition-colors shrink-0">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <strong className="text-xs font-semibold text-foreground block truncate">
                                {item.label}
                              </strong>
                              <span className="text-[9px] font-medium text-muted-foreground/70 bg-muted/80 px-1.5 py-0.5 rounded shrink-0">
                                {item.badge}
                              </span>
                            </div>
                            <span className="text-[11px] text-muted-foreground leading-tight line-clamp-1 mt-0.5">
                              {item.desc}
                            </span>
                          </div>
                          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <MessageScrollerContent>
                {messages.map((msg, idx) => {
                  const isUser = msg.role === "user" || msg.role === "human";
                  return (
                    <MessageScrollerItem
                      key={msg.id || idx}
                      messageId={msg.id || `msg-${idx}`}
                      scrollAnchor={true}
                    >
                      {isUser ? (
                        <Message align="end">
                          <MessageContent className="items-end">
                            <Bubble variant="primary" className="max-w-full">
                              <BubbleContent markdown={false}>
                                {msg.content}
                              </BubbleContent>
                            </Bubble>
                          </MessageContent>
                        </Message>
                      ) : (
                        <Message align="start">
                          <MessageAvatar className="border-border/70 shadow-2xs bg-background p-0.5">
                            <Image
                              src="/thrico_ai.png"
                              alt="Thrico AI"
                              width={28}
                              height={28}
                              className="h-full w-full rounded-lg object-cover"
                            />
                          </MessageAvatar>
                          <MessageContent>
                            <MessageHeader>
                              <span className="font-semibold text-foreground text-xs">
                                Thrico Copilot
                              </span>
                            </MessageHeader>
                            <Bubble variant="muted">
                              <BubbleContent markdown>
                                {msg.content}
                              </BubbleContent>
                            </Bubble>
                          </MessageContent>
                        </Message>
                      )}
                    </MessageScrollerItem>
                  );
                })}

                {sendingMessage && (
                  <MessageScrollerItem messageId="thinking" scrollAnchor={true}>
                    <Message align="start">
                      <MessageAvatar className="border-border/70 shadow-2xs bg-background p-0.5">
                        <Image
                          src="/thrico_ai.png"
                          alt="Thrico AI"
                          width={28}
                          height={28}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      </MessageAvatar>
                      <MessageContent>
                        <Marker variant="status">
                          <MarkerIcon>
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                          </MarkerIcon>
                          <MarkerContent shimmer={true}>
                            Initializing session and orchestrating tools…
                          </MarkerContent>
                        </Marker>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                )}
              </MessageScrollerContent>
            )}
          </MessageScrollerViewport>
        </MessageScroller>
      </MessageScrollerProvider>

      {/* Docked Prompt Input */}
      <div className="p-4 sm:p-5 border-t border-border/70 bg-card/60 backdrop-blur-md shrink-0">
        <div className="max-w-3xl mx-auto space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-end gap-2 rounded-2xl border border-border/80 bg-background/95 p-2 shadow-xs focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/15 transition-all"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything or instruction an autonomous agent..."
              rows={1}
              disabled={sendingMessage}
              className="flex-1 max-h-36 resize-none bg-transparent px-3.5 py-2 text-xs sm:text-[13px] outline-none placeholder:text-muted-foreground/60 leading-relaxed font-sans"
            />

            <div className="flex items-center gap-1 shrink-0 pb-0.5 pr-0.5">
              <Button
                type="submit"
                disabled={!input.trim() || sendingMessage}
                size="icon"
                className="h-8 w-8 rounded-xl bg-[#1e1e24] text-white hover:bg-black dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs transition-all cursor-pointer"
              >
                {sendingMessage ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </form>

          <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 px-1 select-none">
            <span>Enter to send • Shift+Enter for new line</span>
            <span>Thrico Copilot</span>
          </div>
        </div>
      </div>
    </div>
  );
}
