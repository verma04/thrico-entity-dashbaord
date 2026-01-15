"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Video } from "lucide-react";
import { toast } from "sonner";
import { IntegrationCard } from "./integration-card";
import { useGetEntity } from "@/graphql/actions";

const API_BASE =
  "https://nysr255hb3.execute-api.ap-south-1.amazonaws.com/prod/integrations/zoom";

export const ZoomIntegrationCard = () => {
  const { data: entityData } = useGetEntity();
  const entityId = entityData?.getEntity?.id;

  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

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
      // Inferred status endpoint
      const data = await fetchWithAuth(`/status?entityId=${entityId}`);
      setIsConnected(!!data.connected);
    } catch (error) {
      console.warn(
        "Failed to check Zoom status (endpoint might not exist yet):",
        error
      );
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
      // Using the provided endpoint
      const data = await fetchWithAuth(`/connect?entityId=${entityId}`);
      //   if (data.authUrl) {
      //     window.location.href = data.authUrl;
      //   } else if (data.url) {
      //     // Handle potential 'url' key variation just in case, similar to Slack
      //     window.location.href = data.url;
      //   } else {
      //     throw new Error("No authorization URL returned");
      //   }
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
      // Inferred disconnect endpoint
      await fetchWithAuth("/disconnect", {
        method: "POST",
        body: JSON.stringify({ entityId }),
      });
      setIsConnected(false);
      toast.info("Disconnected from Zoom");
    } catch (error: any) {
      toast.error("Failed to disconnect", {
        description: error.message,
      });
    }
  };

  return (
    <IntegrationCard
      title="Zoom"
      description="Video Conferencing"
      icon={Video}
      iconBgColor="bg-[#2D8CFF]"
      isConnected={isConnected}
      isConnecting={isConnecting}
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
    >
      <div className="pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-300">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Zoom is connected. You can now automatically generate meeting links
          for events and appointments.
        </p>
      </div>
    </IntegrationCard>
  );
};
