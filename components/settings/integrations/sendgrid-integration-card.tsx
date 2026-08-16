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
      category="Email & Marketing"
      description="Deliver high-deliverability transactional emails, event reminders, and member onboarding emails."
      icon={SendGridIcon}
      iconBgColor="bg-[#00B3E9]"
      isConnected={isConnected}
      isConnecting={isConnecting}
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
    >
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-[10px] font-semibold uppercase text-muted-foreground/70 tracking-wider flex items-center gap-1.5">
              <Key className="w-3 h-3" /> API Key
            </Label>
            <Input
              type="password"
              placeholder="SG.xxxxxxxxxxxx"
              className="h-8 text-xs font-mono bg-background/80 border-border/50 rounded-lg"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-semibold uppercase text-muted-foreground/70 tracking-wider flex items-center gap-1.5">
              <Mail className="w-3 h-3" /> Verified Sender Email
            </Label>
            <Input
              type="email"
              placeholder="hello@yourdomain.com"
              className="h-8 text-xs bg-background/80 border-border/50 rounded-lg"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
            />
          </div>

          <Button
            size="sm"
            className="w-full text-xs h-8 gap-1.5 font-medium rounded-lg"
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
      </div>
    </IntegrationCard>
  );
};
