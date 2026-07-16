"use client";

import React, { useState } from "react";
import { Send, Loader2, Key, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IntegrationCard } from "./integration-card";
import { SendGridIcon } from "@/components/icons/sendgrid-icon";

export const SendGridIntegrationCard = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [senderEmail, setSenderEmail] = useState("");

  const handleConnect = async () => {
    setIsConnecting(true);
    // Mock connection logic
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      toast.success(
        "SendGrid integration initiated. Please configure your settings.",
      );
    }, 1500);
  };

  const handleDisconnect = async () => {
    setIsConnected(false);
    setApiKey("");
    setSenderEmail("");
    toast.info("SendGrid disconnected");
  };

  const handleSaveSettings = async () => {
    if (!apiKey || !senderEmail) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSaving(true);
    // Mock saving logic
    setTimeout(() => {
      setIsSaving(false);
      toast.success("SendGrid settings saved successfully");
    }, 1000);
  };

  return (
    <IntegrationCard
      title="SendGrid"
      description="Email Delivery & Marketing"
      icon={SendGridIcon}
      iconBgColor="bg-[#00B3E9]"
      isConnected={isConnected}
      isConnecting={isConnecting}
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
    >
      <div className="pt-4 border-t space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Configure your SendGrid account to send transactional emails and
          marketing campaigns directly from Thrico.
        </p>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground/80 flex items-center gap-2">
              <Key className="w-3 h-3" /> API Key
            </Label>
            <Input
              type="password"
              placeholder="SG.xxxxxxxxxxxx"
              className="h-8 text-sm"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground/80 flex items-center gap-2">
              <Mail className="w-3 h-3" /> Verified Sender Email
            </Label>
            <Input
              type="email"
              placeholder="hello@yourdomain.com"
              className="h-8 text-sm"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
            />
          </div>

          <Button
            size="sm"
            className="w-full text-xs h-8 gap-2"
            onClick={handleSaveSettings}
            disabled={isSaving || !apiKey || !senderEmail}
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Save Configuration
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground text-center">
          Make sure your sender email is verified in SendGrid's dashboard.
        </p>
      </div>
    </IntegrationCard>
  );
};
