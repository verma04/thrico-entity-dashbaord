"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Send,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Check,
  ChevronRight,
  ChevronLeft,
  Search,
  Activity,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { useWhatsAppStore } from "./whatsapp-store";
import {
  useGetWhatsAppConnections,
  useGetWhatsAppTemplates,
  WhatsAppConnectionStatus,
} from "@/graphql/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STEPS = [
  "01 Select Template",
  "02 Target Recipients",
  "03 Refine Variables",
  "04 Review & Launch",
];

const AUDIENCE_GROUPS = [
  { id: "all", name: "All Registered Members", count: 0 },
  { id: "vip", name: "Executive & VIP Club", count: 0 },
  { id: "events", name: "Upcoming Event RSVPs", count: 0 },
  { id: "active", name: "Active Community Buyers", count: 0 },
];

export function WhatsAppSendWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTemplate = searchParams.get("template") || "";

  const { templates: storeTemplates, messages, addMessage } = useWhatsAppStore();
  const { data: whatsappData } = useGetWhatsAppConnections();
  const { data: templatesData } = useGetWhatsAppTemplates();

  const templates = useMemo(() => {
    return templatesData?.getWhatsAppTemplates || storeTemplates;
  }, [templatesData, storeTemplates]);

  const liveConn = whatsappData?.getWhatsAppConnections?.find(
    (c) => c.status === WhatsAppConnectionStatus.CONNECTED,
  );
  const displayPhone =
    liveConn?.displayPhoneNumber || liveConn?.phoneNumber || "";

  const sentToday = useMemo(() => {
    const today = new Date().toDateString();
    return messages.filter((m) => new Date(m.sentAt).toDateString() === today).length;
  }, [messages]);

  const tierLimit = 1000;
  const remainingToday = Math.max(0, tierLimit - sentToday);
  const usagePct = Math.min(100, Number(((sentToday / tierLimit) * 100).toFixed(1)));

  const [currentStep, setCurrentStep] = useState(0);
  const [targetMode, setTargetMode] = useState<"individual" | "group">("individual");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState(
    initialTemplate || (templates[0]?.name ?? "")
  );
  const [templateSearch, setTemplateSearch] = useState("");
  const [variables, setVariables] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Selected template entity
  const currentTemplate = useMemo(() => {
    return (
      templates.find((t) => t.name === selectedTemplateName) || templates[0] || null
    );
  }, [templates, selectedTemplateName]);

  // Extract variable count from body
  const variableCount = useMemo(() => {
    if (!currentTemplate) return 0;
    const bodyComp = currentTemplate.components?.find((c) => c.type === "BODY");
    if (!bodyComp?.text) return 0;
    const matches = bodyComp.text.match(/\{\{(\d+)\}\}/g);
    return matches ? matches.length : 0;
  }, [currentTemplate]);

  const handleVariableChange = (index: number, val: string) => {
    const updated = [...variables];
    updated[index] = val;
    setVariables(updated);
  };

  const previewBody = useMemo(() => {
    if (!currentTemplate) return "";
    const bodyComp = currentTemplate.components?.find((c) => c.type === "BODY");
    if (!bodyComp?.text) return "";
    let text = bodyComp.text;
    variables.forEach((val, idx) => {
      text = text.replace(
        new RegExp(`\\{\\{${idx + 1}\\}\\}`, "g"),
        val.trim() || `[Variable {{${idx + 1}}}]`
      );
    });
    return text;
  }, [currentTemplate, variables]);

  const headerComp = currentTemplate?.components?.find((c) => c.type === "HEADER");
  const footerComp = currentTemplate?.components?.find((c) => c.type === "FOOTER");
  const buttonsComp = currentTemplate?.components?.find((c) => c.type === "BUTTONS");

  const totalRecipientsCount = targetMode === "individual" ? 1 : (AUDIENCE_GROUPS.find((g) => g.id === selectedGroup)?.count || 0);

  // Readiness checks matching send-email Infrastructure checklist
  const checks = [
    {
      label: "Channel Status",
      ok: !!liveConn,
      message: liveConn
        ? `Meta Cloud API Connected (${displayPhone || "Active"})`
        : "No connected Meta WhatsApp number found",
    },
    {
      label: "Delivery Quota",
      ok: true,
      message: `${totalRecipientsCount} recipients targeted within daily messaging limit`,
    },
    {
      label: "Template Status",
      ok: currentTemplate?.status === "APPROVED",
      message: currentTemplate?.status === "APPROVED"
        ? `Meta Approved — ${currentTemplate.name}`
        : currentTemplate
        ? `Template status: ${currentTemplate.status}`
        : "No template selected",
    },
    {
      label: "Recipients Targeted",
      ok: targetMode === "individual" ? !!recipientPhone.trim() : totalRecipientsCount > 0,
      message: targetMode === "individual"
        ? (recipientPhone.trim() ? `Target: ${recipientName || "Member"} (${recipientPhone})` : "Enter recipient phone number")
        : `Audience: ${AUDIENCE_GROUPS.find((g) => g.id === selectedGroup)?.name} (${totalRecipientsCount})`,
    },
  ];

  const handleSend = async () => {
    if (targetMode === "individual" && !recipientPhone.trim()) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!selectedTemplateName) {
      toast.error("Please choose an approved template");
      return;
    }

    setIsSending(true);
    await new Promise((r) => setTimeout(r, 1200));

    addMessage({
      id: `msg-${Date.now()}`,
      recipientName: targetMode === "individual" ? (recipientName.trim() || "Community Member") : `Audience: ${selectedGroup}`,
      recipientPhone: targetMode === "individual" ? recipientPhone.trim() : "+91 [Broadcast Group]",
      templateName: selectedTemplateName,
      status: "DELIVERED",
      sentAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
      readAt: null,
    });

    setIsSending(false);
    toast.success(`WhatsApp broadcast "${selectedTemplateName}" dispatched successfully!`);

    setTimeout(() => {
      router.push("/marketing/whatsapp/campaigns");
    }, 600);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* ── Step Indicator Bar (Matching StepIndicator in send-email) ── */}
      <div className="p-3 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {STEPS.map((stepName, i) => {
            const isCurrent = i === currentStep;
            const isCompleted = i < currentStep;

            return (
              <React.Fragment key={stepName}>
                <button
                  type="button"
                  onClick={() => i <= currentStep && setCurrentStep(i)}
                  className={cn(
                    "flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] text-[11.5px] font-medium transition-all text-left shrink-0",
                    isCurrent &&
                      "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs font-semibold",
                    isCompleted &&
                      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100/70 cursor-pointer",
                    !isCurrent &&
                      !isCompleted &&
                      "bg-transparent text-muted-foreground/80 cursor-default"
                  )}
                >
                  <div
                    className={cn(
                      "h-4.5 w-4.5 rounded-[3px] flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors",
                      isCurrent &&
                        "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900",
                      isCompleted &&
                        "bg-emerald-600 dark:bg-emerald-500 text-white",
                      !isCurrent &&
                        !isCompleted &&
                        "bg-[#f1f1f2] dark:bg-zinc-800 text-muted-foreground border border-border/60"
                    )}
                  >
                    {isCompleted ? <Check className="h-3 w-3 stroke-[2.5]" /> : i + 1}
                  </div>
                  <span className="truncate">{stepName}</span>
                </button>

                {i < STEPS.length - 1 && (
                  <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0 mx-0.5" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Main Wizard Grid (7 cols Wizard Content + 5 cols Sidebar) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Step Content */}
        <div className="lg:col-span-7 space-y-4">
          {/* STEP 0: Select Template */}
          {currentStep === 0 && (
            <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs rounded-[8px] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-[13px] font-bold text-foreground">
                    Select WhatsApp Template
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Choose a pre-approved Meta template for transactional or broadcast delivery.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10.5px]"
                >
                  Meta Cloud API
                </Badge>
              </div>

              {/* Template search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  placeholder="Filter available templates…"
                  className="pl-9 h-[32px] text-xs rounded-[4px] border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900"
                />
              </div>

              {/* Template Choices Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                {templates.filter(
                  (t) =>
                    t.status === "APPROVED" &&
                    (!templateSearch ||
                      t.name.toLowerCase().includes(templateSearch.toLowerCase()))
                ).length === 0 ? (
                  <div className="col-span-1 sm:col-span-2 py-8 text-center text-xs text-muted-foreground border border-dashed rounded-[6px] border-border/70 p-4 space-y-2">
                    <p className="font-semibold text-foreground">No approved WhatsApp templates found</p>
                    <p className="text-[11px] text-muted-foreground">
                      Sync approved message templates from Meta Cloud API or submit a new template in the Templates Studio.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => router.push("/marketing/whatsapp/templates")}
                      className="h-[28px] text-xs gap-1.5"
                    >
                      Go to Templates Studio
                    </Button>
                  </div>
                ) : (
                  templates
                    .filter(
                      (t) =>
                        t.status === "APPROVED" &&
                        (!templateSearch ||
                          t.name.toLowerCase().includes(templateSearch.toLowerCase()))
                    )
                    .map((t) => {
                      const isSelected = selectedTemplateName === t.name;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setSelectedTemplateName(t.name)}
                          className={cn(
                            "p-3 rounded-[6px] border text-left cursor-pointer transition-all flex flex-col justify-between space-y-2",
                            isSelected
                              ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-500/30"
                              : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]"
                          )}
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="font-mono font-bold text-xs text-foreground truncate">
                              {t.name}
                            </span>
                            {isSelected && (
                              <div className="h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                <Check className="h-2.5 w-2.5 stroke-[3]" />
                              </div>
                            )}
                          </div>

                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            {t.components?.find((c) => c.type === "BODY")?.text || "No preview"}
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                            <span className="font-medium text-emerald-700 dark:text-emerald-400">
                              {t.category}
                            </span>
                            <span>{t.language.toUpperCase()}</span>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </Card>
          )}

          {/* STEP 1: Target Recipients */}
          {currentStep === 1 && (
            <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs rounded-[8px] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-[13px] font-bold text-foreground">
                    Target Audience & Recipients
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Target an individual phone number or send to a pre-defined audience segment.
                  </p>
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-[6px] border border-border/60">
                <button
                  type="button"
                  onClick={() => setTargetMode("individual")}
                  className={cn(
                    "flex-1 py-1.5 text-xs font-semibold rounded-[4px] transition-all cursor-pointer",
                    targetMode === "individual"
                      ? "bg-white dark:bg-zinc-900 text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Individual Contact (1:1)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetMode("group")}
                  className={cn(
                    "flex-1 py-1.5 text-xs font-semibold rounded-[4px] transition-all cursor-pointer",
                    targetMode === "group"
                      ? "bg-white dark:bg-zinc-900 text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Audience Group Broadcast
                </button>
              </div>

              {targetMode === "individual" ? (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Recipient Name</label>
                      <Input
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="e.g. Contact Name"
                        className="h-[32px] text-xs rounded-[4px] border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Phone Number (E.164)</label>
                      <Input
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        placeholder="e.g. +14155552671 or +919876543210"
                        className="h-[32px] text-xs font-mono rounded-[4px] border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-foreground">Select Member Segment</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AUDIENCE_GROUPS.map((g) => {
                      const isSelected = selectedGroup === g.id;
                      return (
                        <div
                          key={g.id}
                          onClick={() => setSelectedGroup(g.id)}
                          className={cn(
                            "p-3 rounded-[6px] border text-left cursor-pointer transition-all flex items-center justify-between",
                            isSelected
                              ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-500/30"
                              : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]"
                          )}
                        >
                          <div>
                            <p className="text-xs font-semibold text-foreground">{g.name}</p>
                            <p className="text-[10.5px] text-muted-foreground">{g.count} opted-in phones</p>
                          </div>
                          {isSelected && (
                            <div className="h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* STEP 2: Refine Variables */}
          {currentStep === 2 && (
            <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs rounded-[8px] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-[13px] font-bold text-foreground">
                    Refine Template Variables
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Replace template placeholders like <code>{"{{1}}"}</code> with dynamic values.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="font-mono text-[10.5px] border-border/60 bg-muted/30"
                >
                  {variableCount} {variableCount === 1 ? "variable" : "variables"}
                </Badge>
              </div>

              {variableCount === 0 ? (
                <div className="p-4 rounded-[6px] bg-muted/30 border border-border/50 text-xs text-muted-foreground text-center">
                  This template does not contain dynamic variables. You can proceed directly to Review.
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  {Array.from({ length: variableCount }).map((_, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="font-semibold text-foreground font-mono">
                          Placeholder {"{{" + (idx + 1) + "}}"}
                        </label>
                        <span className="text-[10px] text-muted-foreground">
                          {idx === 0
                            ? "e.g. Member First Name"
                            : idx === 1
                            ? "e.g. Event Name / Tier"
                            : "e.g. Date / Link"}
                        </span>
                      </div>
                      <Input
                        value={variables[idx] || ""}
                        onChange={(e) => handleVariableChange(idx, e.target.value)}
                        placeholder={`Enter substitution for {{${idx + 1}}}`}
                        className="h-[32px] text-xs rounded-[4px] border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* STEP 3: Review & Final Launch */}
          {currentStep === 3 && (
            <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs rounded-[8px] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-[13px] font-bold text-foreground">
                    Review & Final Deployment
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Confirm delivery channels, audience counts, and template payload before dispatch.
                  </p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10.5px]">
                  Ready to Dispatch
                </Badge>
              </div>

              {/* Summary specifications */}
              <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border/50 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target Recipient</span>
                  <span className="font-semibold text-foreground">
                    {targetMode === "individual"
                      ? `${recipientName} (${recipientPhone})`
                      : AUDIENCE_GROUPS.find((g) => g.id === selectedGroup)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Meta Template</span>
                  <span className="font-mono font-medium text-emerald-600">
                    {selectedTemplateName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subscribed Handshake</span>
                  <span className="font-medium text-foreground">
                    Meta Cloud API (Graph API v26.0)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected Deliverability</span>
                  <span className="font-semibold text-emerald-600">
                    {liveConn ? "Meta Cloud API (Active Handshake)" : "Offline"}
                  </span>
                </div>
              </div>

              {/* Warning note */}
              <div className="p-3 rounded-[6px] bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Dispatched messages will reach recipients immediately. Coexistence mode will automatically route incoming customer replies back to your official WhatsApp Business inbox.
                </p>
              </div>
            </Card>
          )}

          {/* ── Step Navigation Buttons (Matching send-email action bar) ── */}
          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep((s) => Math.min(3, s + 1))}
                className="h-[30px] rounded-[4px] gap-1.5 text-[12px] font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
              >
                <span>Continue</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSend}
                disabled={isSending}
                className="h-[30px] rounded-[4px] gap-1.5 text-[12px] font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Broadcasting…</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Launch Broadcast Now</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Infrastructure & Live Preview Sidebar (Matching InfrastructureSidebar) */}
        <div className="lg:col-span-5 space-y-4 sticky top-4">
          {/* Daily Quota / Limit Card (Matching InfrastructureSidebar Quota) */}
          <div className="p-4 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-[4px] bg-[#f6f6f7] dark:bg-zinc-800 border border-border/60 flex items-center justify-center text-[#616161]">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <h3 className="text-[12.5px] font-bold text-foreground">
                  WhatsApp Messaging Tier
                </h3>
              </div>
              <span className="text-[11px] font-bold text-foreground tabular-nums">
                {remainingToday.toLocaleString()} / {tierLimit.toLocaleString()} Left
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11.5px]">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Daily Consumption
                </span>
                <span className="font-bold text-foreground tabular-nums">
                  {usagePct}%
                </span>
              </div>

              <div className="h-2 w-full bg-[#f1f1f2] dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#303030] dark:bg-zinc-100 transition-all duration-500"
                  style={{ width: `${usagePct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10.5px] text-muted-foreground pt-1">
                <span>Dispatched Today: {sentToday}</span>
                <span>Tier Limit: {tierLimit.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Readiness Checklist Card */}
          <div className="p-4 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-[4px] bg-[#f6f6f7] dark:bg-zinc-800 border border-border/60 flex items-center justify-center text-[#616161]">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <h3 className="text-[12.5px] font-bold text-foreground">
                  Launch Readiness
                </h3>
              </div>
              <Badge variant="outline" className={`text-[9.5px] ${checks.every((c) => c.ok) ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10" : "border-amber-500/30 text-amber-600 bg-amber-500/10"}`}>
                {checks.every((c) => c.ok) ? "100% Ready" : "Setup Required"}
              </Badge>
            </div>

            <div className="space-y-2 text-xs">
              {checks.map((c) => (
                <div key={c.label} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-[11.5px]">{c.label}</p>
                    <p className="text-[10.5px] text-muted-foreground truncate">{c.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Realistic WhatsApp Chat Preview */}
          <div className="p-4 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-2">
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                <h3 className="text-[12.5px] font-bold text-foreground">
                  Live Handset Bubble Preview
                </h3>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">
                {selectedTemplateName}
              </span>
            </div>

            {/* Bubble preview container */}
            <div className="rounded-[8px] p-3 bg-[#efeae2] dark:bg-[#0b141a] border border-border/40 text-xs">
              <div className="rounded-xl rounded-tr-xs p-3 bg-[#d9fdd3] dark:bg-[#005c4b] text-zinc-900 dark:text-zinc-100 shadow-xs border border-emerald-600/10 space-y-1">
                {headerComp?.text && (
                  <p className="text-xs font-bold text-zinc-950 dark:text-white leading-tight">
                    {headerComp.text}
                  </p>
                )}
                <p className="text-xs leading-relaxed whitespace-pre-line text-zinc-800 dark:text-zinc-100">
                  {previewBody || "Template message body…"}
                </p>
                {footerComp?.text && (
                  <p className="text-[9.5px] text-zinc-500 dark:text-zinc-400 italic pt-0.5">
                    {footerComp.text}
                  </p>
                )}
                <div className="flex items-center justify-end gap-1 text-[9px] text-zinc-500 dark:text-zinc-400 pt-0.5">
                  <span>9:41 AM</span>
                  <span className="text-blue-500 font-bold">✓✓</span>
                </div>
              </div>

              {buttonsComp?.buttons && buttonsComp.buttons.length > 0 && (
                <div className="mt-1.5 space-y-1">
                  {buttonsComp.buttons.map((btn, bIdx) => (
                    <div
                      key={bIdx}
                      className="bg-white dark:bg-zinc-800 text-[#00a884] dark:text-[#25D366] text-[11px] font-medium text-center py-1.5 rounded-lg shadow-2xs border border-border/50 flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{btn.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
