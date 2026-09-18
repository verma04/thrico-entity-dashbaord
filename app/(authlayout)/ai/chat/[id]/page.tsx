"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  PanelLeft,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useChatSidebar } from "../layout";
import { Button } from "@/components/ui/button";
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
  MessageFooter,
  Bubble,
  BubbleContent,
  Marker,
  MarkerIcon,
  MarkerContent,
  MarkerSeparator,
  AgentWidgetAttachment,
} from "@/components/ui/chat";
import {
  useGetAiSession,
  useAiAnalyticsChat,
  AiChatMessage,
} from "@/graphql/actions/ai";
import { cn } from "@/lib/utils";

export default function ExistingAIChatPage() {
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useChatSidebar();
  const params = useParams();
  const sessionId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    data: sessionData,
    loading: sessionLoading,
    refetch: refetchSession,
  } = useGetAiSession(sessionId);

  const { sendMessage, loading: sendingMessage } = useAiAnalyticsChat();

  // Load message history when session detail updates
  useEffect(() => {
    if (sessionData?.getAiSession?.messages) {
      const history = sessionData.getAiSession.messages.map((m: any) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        widgets: m.widgets,
        actions: m.actions,
        createdAt: m.createdAt,
      }));
      setMessages(history);
    }
  }, [sessionData]);

  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
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
    if (!textToSend || sendingMessage || !sessionId) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: AiChatMessage = {
      id: userMessageId,
      role: "user",
      content: textToSend,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await sendMessage(textToSend, sessionId);
      if (res) {
        const botMsg: AiChatMessage = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: res.message || "Request completed.",
          widgets: res.widgets,
          actions: res.actions,
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botMsg]);
        refetchSession();
      }
    } catch (err: any) {
      console.error("Chat turn error:", err);
      const errorMsg: AiChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Error during agent execution. Please try again.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sessionTitle =
    sessionData?.getAiSession?.title || `Session ${sessionId?.slice(0, 8) || ""}`;

  return (
    <div className="flex-1 h-full min-h-0 flex flex-col overflow-hidden bg-background">
      {/* Top Header */}
      <div className="h-14 px-4 sm:px-5 border-b border-border/70 flex items-center justify-between bg-card/40 backdrop-blur-xs select-none shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
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
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-foreground truncate flex items-center gap-2">
              <span>{sessionTitle}</span>
              <span className="text-[10px] font-mono text-muted-foreground/60 hidden sm:inline">
                ({sessionId?.slice(0, 8)})
              </span>
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Autonomous Multi-Agent Orchestrator</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetchSession()}
            className="h-7 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Refresh history"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Conversation Area with MessageScroller */}
      <MessageScrollerProvider>
        <MessageScroller className="flex-1 min-h-0 h-full overflow-hidden">
          <MessageScrollerViewport className="py-6 px-4 sm:px-8">
            {sessionLoading && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3 my-auto">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                <span className="text-xs text-muted-foreground">
                  Restoring session history…
                </span>
              </div>
            ) : (
              <MessageScrollerContent>
                <MarkerSeparator>Conversation History</MarkerSeparator>

                {messages.map((msg, idx) => {
                  const isUser = msg.role === "user" || msg.role === "human";
                  return (
                    <MessageScrollerItem
                      key={msg.id || idx}
                      messageId={msg.id || `msg-${idx}`}
                      scrollAnchor={isUser}
                    >
                      {isUser ? (
                        <Message align="end">
                          <MessageContent className="items-end">
                            <Bubble variant="primary" className="max-w-full">
                              <BubbleContent markdown={false}>
                                {msg.content}
                              </BubbleContent>
                            </Bubble>

                            <MessageFooter className="justify-end pr-1">
                              {msg.createdAt && (
                                <span className="text-[10px] text-muted-foreground/60 mr-1 select-none">
                                  {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleCopy(msg.content, msg.id)}
                                className="flex items-center gap-1 hover:text-foreground hover:bg-muted/70 rounded-md px-1.5 py-0.5 transition-colors cursor-pointer"
                                title="Copy message"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-500" />
                                    <span className="text-[10px] text-emerald-500 font-medium">
                                      Copied
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span className="text-[10px]">Copy</span>
                                  </>
                                )}
                              </button>
                            </MessageFooter>
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
                              {msg.createdAt && (
                                <span className="text-[10px] text-muted-foreground/60 font-normal">
                                  {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              )}
                            </MessageHeader>

                            <Bubble variant="muted">
                              <BubbleContent markdown={true}>
                                {msg.content}
                              </BubbleContent>
                            </Bubble>

                            {/* Embedded Widgets */}
                            {msg.widgets && msg.widgets.length > 0 && (
                              <div className="space-y-2 w-full pt-1">
                                {msg.widgets.map((widget: any, wIdx: number) => (
                                  <AgentWidgetAttachment
                                    key={wIdx}
                                    widget={widget}
                                    onActionClick={handleSend}
                                  />
                                ))}
                              </div>
                            )}

                            {/* Action chips */}
                            {msg.actions && msg.actions.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {msg.actions.map((act: any, aIdx: number) => {
                                  const labelText =
                                    typeof act === "string"
                                      ? act
                                      : typeof act?.label === "string"
                                      ? act.label
                                      : act?.label?.label || act?.label?.title || act?.title || "Action";
                                  const actionPayload =
                                    act?.payload?.message ||
                                    (typeof act?.payload === "string" ? act.payload : null) ||
                                    (typeof act?.label === "string" ? act.label : labelText);
                                  return (
                                    <Button
                                      key={aIdx}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleSend(actionPayload)}
                                      className="h-6 px-2.5 rounded-lg text-[10px] font-medium border-border/80 bg-background/80 hover:bg-muted text-foreground gap-1 cursor-pointer transition-colors"
                                    >
                                      <Zap className="h-2.5 w-2.5 text-indigo-500" />
                                      <span>{labelText}</span>
                                    </Button>
                                  );
                                })}
                              </div>
                            )}

                            {/* Footer */}
                            <MessageFooter className="pl-1 pt-1">
                              <button
                                type="button"
                                onClick={() => handleCopy(msg.content, msg.id)}
                                className="flex items-center gap-1.5 hover:text-foreground hover:bg-muted/70 rounded-md px-2 py-0.5 text-[11px] transition-colors cursor-pointer"
                                title="Copy message"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-500" />
                                    <span className="text-[10px] text-emerald-500 font-medium">
                                      Copied
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span className="text-[10px]">Copy</span>
                                  </>
                                )}
                              </button>
                            </MessageFooter>
                          </MessageContent>
                        </Message>
                      )}
                    </MessageScrollerItem>
                  );
                })}

                {/* Reasoning Indicator */}
                {sendingMessage && (
                  <MessageScrollerItem
                    messageId="streaming-indicator"
                    scrollAnchor={true}
                  >
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
                            Agent is reasoning & orchestrating tools…
                          </MarkerContent>
                        </Marker>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                )}
              </MessageScrollerContent>
            )}
          </MessageScrollerViewport>

          <MessageScrollerButton />
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
              placeholder="Ask a follow-up or provide an instruction..."
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
