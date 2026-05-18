"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

// Pass the logged in userId and workspaceId as props to this component
export default function ChatInterface({ userId, workspaceId }: { userId: string, workspaceId: string }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // 1. Auto-scroll to the bottom when messages update
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 2. Initialize a Chat Session when component mounts
  useEffect(() => {
    async function initSession() {
      try {
        const res = await fetch("http://localhost:4010/chat/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, workspaceId, title: "New Chat Session" }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setSessionId(data.sessionId);
      } catch (err) {
        console.error("Failed to initialize chat session, using fallback", err);
        // Fallback so the input becomes enabled even if the backend is down
        setSessionId("fallback-" + Math.random().toString(36).slice(2, 9));
      }
    }
    
    if (userId) {
      initSession();
    }
  }, [userId, workspaceId]);

  // 3. Handle sending the message & streaming the response via SSE
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || isTyping) return;
    
    const userMessage = input.trim();
    setInput("");
    
    // Add user message to UI immediately
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);
    
    try {
      // Create a placeholder for the assistant's streaming response
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      
      const response = await fetch("http://localhost:4010/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userId,
          workspaceId,
          message: userMessage,
        }),
      });
      
      if (!response.body) throw new Error("No ReadableStream available.");
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      let buffer = "";
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep the last partial line in the buffer
        buffer = lines.pop() ?? "";
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          
          const dataString = trimmed.slice(6).trim();
          if (dataString === "[DONE]") {
            setIsTyping(false);
            continue;
          }
          
          try {
            const event = JSON.parse(dataString);
            
            // When we receive a token, append it to the full reply and update the UI
            if (event.type === "token") {
              fullReply += event.token;
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastIdx = newMessages.length - 1;
                newMessages[lastIdx] = {
                  ...newMessages[lastIdx],
                  content: fullReply,
                };
                return newMessages;
              });
            }
            
            // When the stream finishes
            if (event.type === "message_done") {
              setIsTyping(false);
            }
            
            // If there's an error
            if (event.type === "error") {
              setIsTyping(false);
              console.error("Agent error:", event.message);
            }
          } catch (err) {
            // Ignore parse errors from partial chunks
          }
        }
      }
    } catch (error) {
      console.error("Error streaming message:", error);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto border rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 font-semibold text-gray-700">
        AI Assistant {sessionId && `(Session: ${sessionId.split("-")[0]})`}
      </div>
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm"
              }`}
            >
              {msg.role === "user" ? (
                msg.content
              ) : (
                <div className="prose prose-sm max-w-none break-words [&>p]:mb-2 [&>p:last-child]:mb-0 [&>pre]:bg-gray-800 [&>pre]:text-gray-100 [&>pre]:p-3 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>code]:bg-gray-100 [&>code]:px-1 [&>code]:rounded [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:ml-4 [&>ol]:mb-2">
                  <ReactMarkdown>
                    {msg.content || "..."}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t bg-white flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          disabled={!sessionId || isTyping}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!sessionId || !input.trim() || isTyping}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
