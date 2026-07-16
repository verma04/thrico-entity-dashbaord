"use client";

import React from "react";
import ChatInterface from "@/components/chat/chat-interface";
import { useGetUser } from "@/graphql/actions";

export default function ChatPage() {
  const { data } = useGetUser();

  // Provide fallback IDs for testing if the user data isn't loaded yet
  const userId = data?.getUser?.id || "user_1";
  const workspaceId = "131c5015-7456-4c83-a9df-a2b3288489cc";

  return (
    <div className="h-full w-full bg-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          AI Assistant Chat
        </h1>
        <ChatInterface userId={userId} workspaceId={workspaceId} />
      </div>
    </div>
  );
}
