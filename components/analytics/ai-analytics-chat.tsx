"use client";

import React, { useState } from "react";
import { useAiAnalyticsChat } from "@/graphql/analytics/aiAnalytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles, Loader2, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  widgets?: any;
}

export function AiAnalyticsChat({ className }: { className?: string }) {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your AI Supervisor. Ask me anything about member churn, conversion funnels, event attendance, or cohort retention.",
    },
  ]);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const { sendMessage, loading } = useAiAnalyticsChat();

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage;
    setInputMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);

    try {
      const response = await sendMessage(userText, sessionId);
      if (response) {
        if (response.sessionId) {
          setSessionId(response.sessionId);
        }
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.message,
            widgets: response.widgets,
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${err.message || "Failed to reach AI agent"}`,
        },
      ]);
    }
  };

  return (
    <Card className={`flex flex-col h-[500px] border shadow-sm ${className || ""}`}>
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">AI Analytics Assistant</CardTitle>
            <CardDescription className="text-xs">
              Natural Language ClickHouse & User 360 Insights
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 text-sm ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div
              className={`p-3 rounded-2xl max-w-[80%] ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-muted rounded-tl-none text-foreground"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Analyzing query with ClickHouse...
          </div>
        )}
      </CardContent>

      <form onSubmit={handleSend} className="p-3 border-t flex items-center gap-2">
        <Input
          placeholder="Ask a question (e.g. What is the ticket conversion for summit?)..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={loading}
          className="flex-1 text-sm"
        />
        <Button type="submit" size="icon" disabled={loading || !inputMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
