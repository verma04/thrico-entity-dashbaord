"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Hash, Users, Star, Phone, Search, Info, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import ChannelSidebar from "./channel-sidebar";
import MessageList from "./message-list";
import MessageComposer from "./message-composer";
import ThreadPanel from "./thread-panel";
import {
  MOCK_CHANNELS,
  MOCK_MESSAGES,
  MOCK_USERS,
  CURRENT_USER_ID,
  type ChatMessage,
} from "./chat-mock-data";

interface CommunityChatProps {
  communityId: string;
  communityTitle?: string;
}

export default function CommunityChat({
  communityId,
  communityTitle,
}: CommunityChatProps) {
  const [activeChannelId, setActiveChannelId] = useState(
    MOCK_CHANNELS[0]?.id || ""
  );
  const [messagesMap, setMessagesMap] = useState<
    Record<string, ChatMessage[]>
  >(() => JSON.parse(JSON.stringify(MOCK_MESSAGES)));
  const [openThreadMessageId, setOpenThreadMessageId] = useState<
    string | null
  >(null);

  const activeChannel = useMemo(
    () => MOCK_CHANNELS.find((c) => c.id === activeChannelId),
    [activeChannelId]
  );

  const currentMessages = useMemo(
    () => messagesMap[activeChannelId] || [],
    [messagesMap, activeChannelId]
  );

  const threadMessage = useMemo(() => {
    if (!openThreadMessageId) return null;
    return currentMessages.find((m) => m.id === openThreadMessageId) || null;
  }, [currentMessages, openThreadMessageId]);

  // ─── Handlers ─────────────────────────────────────────────
  const handleSendMessage = useCallback(
    (content: string) => {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        userId: CURRENT_USER_ID,
        content,
        timestamp: Date.now(),
        reactions: [],
      };
      setMessagesMap((prev) => ({
        ...prev,
        [activeChannelId]: [...(prev[activeChannelId] || []), newMsg],
      }));
    },
    [activeChannelId]
  );

  const handleReact = useCallback(
    (messageId: string, emoji: string) => {
      setMessagesMap((prev) => {
        const msgs = [...(prev[activeChannelId] || [])];
        const idx = msgs.findIndex((m) => m.id === messageId);
        if (idx === -1) return prev;

        const msg = { ...msgs[idx] };
        const reactions = [...msg.reactions];
        const reactionIdx = reactions.findIndex((r) => r.emoji === emoji);

        if (reactionIdx >= 0) {
          const reaction = { ...reactions[reactionIdx] };
          const userIdx = reaction.users.indexOf(CURRENT_USER_ID);
          if (userIdx >= 0) {
            reaction.users = reaction.users.filter(
              (u) => u !== CURRENT_USER_ID
            );
            if (reaction.users.length === 0) {
              reactions.splice(reactionIdx, 1);
            } else {
              reactions[reactionIdx] = reaction;
            }
          } else {
            reaction.users = [...reaction.users, CURRENT_USER_ID];
            reactions[reactionIdx] = reaction;
          }
        } else {
          reactions.push({ emoji, users: [CURRENT_USER_ID] });
        }

        msg.reactions = reactions;
        msgs[idx] = msg;
        return { ...prev, [activeChannelId]: msgs };
      });
    },
    [activeChannelId]
  );

  const handleEdit = useCallback(
    (messageId: string, newContent: string) => {
      setMessagesMap((prev) => {
        const msgs = [...(prev[activeChannelId] || [])];
        const idx = msgs.findIndex((m) => m.id === messageId);
        if (idx === -1) return prev;

        msgs[idx] = { ...msgs[idx], content: newContent, edited: true };
        return { ...prev, [activeChannelId]: msgs };
      });
    },
    [activeChannelId]
  );

  const handleDelete = useCallback(
    (messageId: string) => {
      setMessagesMap((prev) => {
        const msgs = (prev[activeChannelId] || []).filter(
          (m) => m.id !== messageId
        );
        return { ...prev, [activeChannelId]: msgs };
      });
      if (openThreadMessageId === messageId) {
        setOpenThreadMessageId(null);
      }
    },
    [activeChannelId, openThreadMessageId]
  );

  const handleOpenThread = useCallback((messageId: string) => {
    setOpenThreadMessageId(messageId);
  }, []);

  const handleSendThreadReply = useCallback(
    (content: string) => {
      if (!openThreadMessageId) return;

      setMessagesMap((prev) => {
        const msgs = [...(prev[activeChannelId] || [])];
        const idx = msgs.findIndex(
          (m) => m.id === openThreadMessageId
        );
        if (idx === -1) return prev;

        const msg = { ...msgs[idx] };
        const newReply: ChatMessage = {
          id: `reply-${Date.now()}`,
          userId: CURRENT_USER_ID,
          content,
          timestamp: Date.now(),
          reactions: [],
        };

        msg.threadMessages = [...(msg.threadMessages || []), newReply];
        msg.threadCount = (msg.threadCount || 0) + 1;
        msgs[idx] = msg;
        return { ...prev, [activeChannelId]: msgs };
      });
    },
    [activeChannelId, openThreadMessageId]
  );

  const handleSelectChannel = useCallback(
    (channelId: string) => {
      setActiveChannelId(channelId);
      setOpenThreadMessageId(null);
    },
    []
  );

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[500px] rounded-xl border border-border/50 overflow-hidden shadow-lg shadow-black/[0.04] bg-background">
      {/* Channel Sidebar */}
      <ChannelSidebar
        channels={MOCK_CHANNELS}
        activeChannelId={activeChannelId}
        onSelectChannel={handleSelectChannel}
        communityTitle={communityTitle}
      />

      {/* Main Message Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Channel Header */}
        <div className="h-[52px] flex items-center justify-between px-4 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
            <h2 className="text-[15px] font-bold text-foreground truncate">
              {activeChannel?.name || "general"}
            </h2>
            <div className="hidden sm:block w-px h-4 bg-border/50 mx-1" />
            <span className="hidden sm:block text-[12px] text-muted-foreground truncate max-w-[280px]">
              {activeChannel?.description}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span className="text-[12px] font-medium">
                    {activeChannel?.memberCount || 0}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Members</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                  <Search className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Search in channel</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                  <Star className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Star channel</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Channel details</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Messages */}
        <MessageList
          messages={currentMessages}
          users={MOCK_USERS}
          onReact={handleReact}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onOpenThread={handleOpenThread}
        />

        {/* Composer */}
        <MessageComposer
          channelName={activeChannel?.name || "general"}
          onSend={handleSendMessage}
        />
      </div>

      {/* Thread Panel (conditional) */}
      {threadMessage && (
        <ThreadPanel
          parentMessage={threadMessage}
          users={MOCK_USERS}
          onClose={() => setOpenThreadMessageId(null)}
          onSendReply={handleSendThreadReply}
          channelName={activeChannel?.name || "general"}
        />
      )}
    </div>
  );
}
