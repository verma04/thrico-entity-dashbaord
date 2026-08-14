"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Camera, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IntegrationCard } from "./integration-card";
import { useGetEntity } from "@/graphql/actions";
import { GoogleMeetIcon } from "@/components/icons/google-meet-icon";

const API_BASE =
  "https://nysr255hb3.execute-api.ap-south-1.amazonaws.com/prod/integrations/google";

export const GoogleMeetIntegrationCard = () => {
  const { data: entityData } = useGetEntity();
  const entityId = entityData?.getEntity?.id;

  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);

  const fetchWithAuth = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const token = localStorage.getItem("key");
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
          errorData.message ||
            errorData.error ||
            `Request failed with status ${response.status}`
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
    } catch (error) {
      console.warn("Failed to check Google Meet status:", error);
    }
  }, [fetchWithAuth, entityId]);

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
      const data = await fetchWithAuth(`/connect?entityId=${entityId}`);
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else if (data.url) {
        window.location.href = data.url;
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
      toast.info("Disconnected from Google Meet");
    } catch (error: any) {
      toast.error("Failed to disconnect", {
        description: error.message,
      });
    }
  };

  const createTestMeeting = async () => {
    if (!entityId) return;
    setIsCreatingMeeting(true);
    try {
      const startTime = new Date().toISOString();
      const endTime = new Date(Date.now() + 3600000).toISOString(); // 1 hour later

      const data = await fetchWithAuth("/meeting", {
        method: "POST",
        body: JSON.stringify({
          entityId,
          summary: "Test Meeting from Dashboard",
          startTime,
          endTime,
          requestId: `req-${Date.now()}`, // Idempotency
        }),
      });

      toast.success("Test meeting created!", {
        description: "Click to join the meeting.",
        action: {
          label: "Join",
          onClick: () => window.open(data.meetLink, "_blank"),
        },
      });
    } catch (error: any) {
      console.error("Error creating meeting:", error);
      toast.error("Failed to create test meeting", {
        description: error.message,
      });
    } finally {
      setIsCreatingMeeting(false);
    }
  };

  return (
    <IntegrationCard
      title="Google Meet"
      category="Video & Meetings"
      description="Auto-generate secure Google Meet video links for events, coaching sessions, and community calls."
      icon={GoogleMeetIcon}
      iconBgColor="bg-[#E6F4EA]"
      isConnected={isConnected}
      isConnecting={isConnecting}
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
    >
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Google Meet is active. Meeting links will be automatically synced with your calendar events.
        </p>

        <Button
          variant="secondary"
          size="sm"
          className="w-full text-xs h-7.5 gap-1.5"
          onClick={createTestMeeting}
          disabled={isCreatingMeeting}
        >
          {isCreatingMeeting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Calendar className="h-3.5 w-3.5" />
          )}
          Create Test Meeting Link
        </Button>
      </div>
    </IntegrationCard>
  );
};
