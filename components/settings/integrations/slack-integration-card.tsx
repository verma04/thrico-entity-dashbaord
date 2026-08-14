"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Slack, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IntegrationCard } from "./integration-card";
import { useGetEntity } from "@/graphql/actions";

const API_BASE =
  "https://nysr255hb3.execute-api.ap-south-1.amazonaws.com/prod/integrations/slack";

export const SlackIntegrationCard = () => {
  const { data: entityData } = useGetEntity();
  // Provide a fallback or wait for entityData
  const entityId = entityData?.getEntity?.id;

  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [channels, setChannels] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Still keeping auth for security, though user docs focused on entityId
  const fetchWithAuth = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const token = localStorage.getItem("key"); // Confirmed key from withAuth.tsx
      const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }

      return response.json();
    },
    []
  );

  const checkStatus = useCallback(async () => {
    if (!entityId) return;
    try {
      const data = await fetchWithAuth(`/status?entityId=${entityId}`);
      setIsConnected(!!data.connected);
      if (data.connected) {
        if (data.defaultChannel) setSelectedChannel(data.defaultChannel);
        fetchChannels();
      }
    } catch (error) {
      console.error("Failed to check Slack status:", error);
    }
  }, [fetchWithAuth, entityId]);

  const fetchChannels = async () => {
    if (!entityId) return;
    setIsLoadingChannels(true);
    try {
      const data = await fetchWithAuth(`/channels?entityId=${entityId}`);
      // API returns array directly according to docs: [{ "id": "C12345", "name": "general" }, ...]
      if (Array.isArray(data)) {
        setChannels(data);
      } else if (data.channels) {
        // Fallback if wrapped
        setChannels(data.channels);
      }
    } catch (error) {
      console.error("Failed to fetch channels:", error);
      toast.error("Failed to load Slack channels");
    } finally {
      setIsLoadingChannels(false);
    }
  };

  useEffect(() => {
    if (entityId) {
      checkStatus();
    }
  }, [checkStatus, entityId]);

  const handleConnect = async () => {
    if (!entityId) {
      toast.error("Entity ID not found. Please refresh.");
      return;
    }
    setIsConnecting(true);
    try {
      // Fetch the authorization URL from the backend
      const data = await fetchWithAuth(`/connect?entityId=${entityId}`);
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error("No authorization URL returned");
      }
    } catch (error: any) {
      setIsConnecting(false);
      toast.error("Failed to initiate connection", {
        description: error.message,
      });
    }
  };

  const handleDisconnect = async () => {
    if (!entityId) return;
    try {
      await fetchWithAuth("/disconnect", {
        method: "POST",
        body: JSON.stringify({ entityId }),
      });
      setIsConnected(false);
      setSelectedChannel("");
      setChannels([]);
      toast.info("Disconnected from Slack");
    } catch (error: any) {
      toast.error("Failed to disconnect", {
        description: error.message,
      });
    }
  };

  const handleChannelChange = async (channelId: string) => {
    if (!entityId) return;
    setSelectedChannel(channelId);
    setIsSavingSettings(true);
    try {
      await fetchWithAuth("/settings", {
        method: "POST",
        body: JSON.stringify({
          entityId,
          defaultChannel: channelId,
          events: {
            lead_created: true, // Default event
          },
        }),
      });
      toast.success("Notification channel updated");
    } catch (error: any) {
      toast.error("Failed to save settings", {
        description: error.message,
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleTestMessage = async () => {
    if (!entityId) return;
    setIsSendingTest(true);
    try {
      await fetchWithAuth("/test", {
        method: "POST",
        body: JSON.stringify({ entityId }),
      });
      toast.success("Test message sent!");
    } catch (error: any) {
      toast.error("Failed to send test message", {
        description: error.message,
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <IntegrationCard
      title="Slack"
      category="Communication"
      description="Send real-time alerts, member activity updates, and system notifications directly to workspace channels."
      icon={Slack}
      iconBgColor="bg-[#4A154B]"
      isConnected={isConnected}
      isConnecting={isConnecting}
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
              Notification Channel
            </Label>
            {isSavingSettings && (
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
            )}
          </div>
          <Select
            value={selectedChannel}
            onValueChange={handleChannelChange}
            disabled={isLoadingChannels}
          >
            <SelectTrigger className="h-8 text-xs bg-background">
              <SelectValue
                placeholder={
                  isLoadingChannels ? "Loading channels..." : "Select channel"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {channels.map((channel) => (
                <SelectItem key={channel.id} value={channel.id} className="text-xs">
                  #{channel.name}
                </SelectItem>
              ))}
              {channels.length === 0 && !isLoadingChannels && (
                <div className="p-2 text-xs text-muted-foreground text-center">
                  No public channels found
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="w-full text-xs h-7.5 gap-1.5"
          onClick={handleTestMessage}
          disabled={isSendingTest || !selectedChannel}
        >
          {isSendingTest ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3 w-3" />
          )}
          Send Test Message
        </Button>
      </div>
    </IntegrationCard>
  );
};
