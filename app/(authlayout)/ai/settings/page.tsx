"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Cpu,
  Key,
  Sliders,
  ShieldCheck,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetMyActiveAdapter,
  useEditAdapter,
  useAddAiKey,
} from "@/graphql/actions/ai";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AISettingsPage() {
  const { data: adapterData, loading: adapterLoading } = useGetMyActiveAdapter();
  const [editAdapter, { loading: savingAdapter }] = useEditAdapter({});
  const [addAiKey, { loading: savingKey }] = useAddAiKey({});

  const [provider, setProvider] = useState<string>("OPENAI");
  const [model, setModel] = useState<string>("gpt-4o");
  const [apiKey, setApiKey] = useState<string>("");
  const [showKey, setShowKey] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(4096);
  const [piiRedaction, setPiiRedaction] = useState<boolean>(true);
  const [autoFlagSpam, setAutoFlagSpam] = useState<boolean>(true);
  const [enforceGuardrails, setEnforceGuardrails] = useState<boolean>(true);

  // Sync with active adapter data
  useEffect(() => {
    if (adapterData?.getMyActiveAdapter) {
      const ad = adapterData.getMyActiveAdapter;
      if (ad.provider) setProvider(ad.provider);
      if (ad.model) setModel(ad.model);
    }
  }, [adapterData]);

  const handleSave = async () => {
    try {
      await editAdapter({
        variables: {
          input: {
            provider: provider as any,
            model,
          },
        },
      });

      if (apiKey.trim()) {
        await addAiKey({
          variables: {
            input: { apiKey: apiKey.trim() },
          },
        });
        setApiKey("");
      }

      toast.success("AI engine configuration saved successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update AI settings");
    }
  };

  const isSaving = savingAdapter || savingKey;

  const modelOptions: Record<string, Array<{ id: string; label: string }>> = {
    OPENAI: [
      { id: "gpt-4o", label: "GPT-4o (Omni - Recommended)" },
      { id: "gpt-4o-mini", label: "GPT-4o Mini (Fast & Cost Efficient)" },
      { id: "o3-mini", label: "o3-mini (High Reasoning)" },
    ],
    ANTHROPIC: [
      { id: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet (Superior Coding & Analysis)" },
      { id: "claude-3-haiku", label: "Claude 3 Haiku (Ultra Fast)" },
      { id: "claude-3-opus", label: "Claude 3 Opus (Complex Synthesis)" },
    ],
    GEMINI: [
      { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro (2M Context Window)" },
      { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash (Low Latency)" },
    ],
  };

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title="AI Engine & Copilot Settings"
        description="Configure foundation models, custom API keys (BYOK), inference parameters, and safety policies"
        icon={Settings}
        badgeText="Configuration"
        breadcrumbs={[{ label: "AI", href: "/ai" }, { label: "Settings" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTemperature(0.7);
                setMaxTokens(4096);
                toast.info("Parameters reset to defaults");
              }}
              className="h-9 text-xs font-medium"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-9 rounded-lg gap-2 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900"
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        {/* Section 1: Foundation Model & Provider */}
        <Card className="border-border/60 bg-card">
          <CardContent className="p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-foreground">Foundation Model Architecture</h3>
              <p className="text-xs text-muted-foreground">Select the core LLM provider that powers autonomous agent executions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-foreground">Provider</Label>
                <Select value={provider} onValueChange={(val) => {
                  setProvider(val);
                  const firstModel = modelOptions[val]?.[0]?.id || "gpt-4o";
                  setModel(firstModel);
                }}>
                  <SelectTrigger className="h-10 text-xs">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPENAI">OpenAI Platform</SelectItem>
                    <SelectItem value="ANTHROPIC">Anthropic Claude</SelectItem>
                    <SelectItem value="GEMINI">Google Gemini</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-foreground">Default Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="h-10 text-xs">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {(modelOptions[provider] || []).map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom API Key (BYOK) */}
            <div className="space-y-2 pt-2 border-t border-border/50">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground">
                  Custom API Key (BYOK)
                </Label>
                {adapterData?.getMyActiveAdapter?.hasKey && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Key Verified & Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Leave empty to use Thrico Managed Enterprise Tokens, or paste your own provider key to bill directly.
              </p>
              <div className="relative flex items-center">
                <Input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={adapterData?.getMyActiveAdapter?.hasKey ? "••••••••••••••••••••••••••••" : "sk-..."}
                  className="h-10 pr-10 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Inference Parameters */}
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
                    {temperature < 0.4 ? "Precise & Deterministic" : temperature > 0.8 ? "Creative & Exploratory" : "Balanced"}
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

        {/* Section 3: Safety Guardrails & Privacy */}
        <Card className="border-border/60 bg-card">
          <CardContent className="p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-foreground">Safety Guardrails & Privacy Policies</h3>
              <p className="text-xs text-muted-foreground">Enforce content filtering and automated redaction before ingestion</p>
            </div>

            <div className="space-y-4 divide-y divide-border/40">
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground block">Automated PII Redaction</span>
                  <span className="text-[11px] text-muted-foreground">Mask phone numbers, emails, and sensitive identifiers from prompt logs</span>
                </div>
                <Switch checked={piiRedaction} onCheckedChange={setPiiRedaction} />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground block">Auto-Flag Spam & Phishing URLs</span>
                  <span className="text-[11px] text-muted-foreground">Check URLs generated in community copilot answers against domain blacklists</span>
                </div>
                <Switch checked={autoFlagSpam} onCheckedChange={setAutoFlagSpam} />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground block">Strict Multi-Agent Safety Guardrails</span>
                  <span className="text-[11px] text-muted-foreground">Reject harmful prompt injections and enforce enterprise content guidelines</span>
                </div>
                <Switch checked={enforceGuardrails} onCheckedChange={setEnforceGuardrails} />
              </div>
            </div>
          </CardContent>
        </Card>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
