"use client";

import React, { useState } from "react";
import {
  Settings,
  Sliders,
  Save,
  RotateCcw,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export default function AISettingsPage() {
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(4096);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Inference parameters saved successfully");
    }, 400);
  };

  const handleReset = () => {
    setTemperature(0.7);
    setMaxTokens(4096);
    toast.info("Inference parameters reset to defaults");
  };

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title="AI Inference Settings"
        description="Configure runtime sampling temperature, randomness, and token generation limits for autonomous agents"
        icon={Settings}
        badgeText="Configuration"
        breadcrumbs={[{ label: "AI", href: "/ai" }, { label: "Settings" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-9 text-xs font-medium cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-9 rounded-lg gap-2 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        {/* Inference Parameters */}
        <Card className="border-border/60 bg-card">
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-foreground">Inference Hyperparameters</h3>
              <p className="text-xs text-muted-foreground">Adjust sampling temperature and token generation limits</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground">Temperature: {temperature}</span>
                  <span className="text-muted-foreground">
                    {temperature < 0.4
                      ? "Precise & Deterministic"
                      : temperature > 0.8
                      ? "Creative & Exploratory"
                      : "Balanced"}
                  </span>
                </div>
                <Slider
                  value={[temperature]}
                  min={0}
                  max={1.5}
                  step={0.05}
                  onValueChange={([val]) => setTemperature(val)}
                  className="py-2"
                />
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground">Max Output Tokens: {maxTokens}</span>
                  <span className="text-muted-foreground">Up to 8,192 tokens</span>
                </div>
                <Slider
                  value={[maxTokens]}
                  min={512}
                  max={8192}
                  step={256}
                  onValueChange={([val]) => setMaxTokens(val)}
                  className="py-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
