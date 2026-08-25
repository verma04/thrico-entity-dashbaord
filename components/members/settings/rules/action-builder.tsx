"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Award,
  Mail,
  Bell,
  Tag,
  Zap,
  Users,
  Check,
  ChevronRight,
  Sparkles,
  Info,
  Globe,
  Lock,
  Plus,
  X,
  Code2,
  Smartphone,
  Monitor,
  Eye,
  Paintbrush,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  GrapesJsEmailEditor,
  getDefaultStarter,
} from "@/components/email/grapesjs-editor/grapesjs-email-editor";
import { GET_MEMBERSHIP_TIERS } from "@/graphql/membership-tier";
import { GET_EMAIL_TEMPLATES } from "@/graphql/quries/email";
import { GET_COMMUNITIES } from "@/graphql/quries/group/approval";
import {
  MemberRuleActionInput,
  MemberRuleActionType,
} from "@/graphql/member-automation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ActionBuilderProps {
  actions: MemberRuleActionInput[];
  onChange: (actions: MemberRuleActionInput[]) => void;
}

const TEMPLATE_VARIABLES = [
  { tag: "{{firstName}}", label: "First Name", sample: "Alex" },
  { tag: "{{lastName}}", label: "Last Name", sample: "Rivers" },
  { tag: "{{email}}", label: "Email", sample: "alex@stanford.edu" },
  { tag: "{{college}}", label: "College", sample: "Stanford University" },
  { tag: "{{city}}", label: "City", sample: "San Francisco" },
  { tag: "{{tierName}}", label: "Tier Name", sample: "Gold VIP" },
];

const SUGGESTED_TAGS = [
  "VIP",
  "Alumni",
  "Honor Roll",
  "Founder",
  "Mentor",
  "Investor",
  "Early Adopter",
  "Verified",
];

export const ActionBuilder: React.FC<ActionBuilderProps> = ({
  actions,
  onChange,
}) => {
  const { data: tiersData, loading: tiersLoading } =
    useQuery(GET_MEMBERSHIP_TIERS);
  const { data: emailsData, loading: emailsLoading } =
    useQuery(GET_EMAIL_TEMPLATES);
  const { data: communitiesData, loading: communitiesLoading } = useQuery(
    GET_COMMUNITIES,
    {
      variables: { input: {} },
    }
  );

  const [tagInput, setTagInput] = useState("");
  const [emailTab, setEmailTab] = useState<"custom" | "template">("custom");
  const [isGrapesModalOpen, setIsGrapesModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">(
    "desktop"
  );
  const [isSavingGrapes, setIsSavingGrapes] = useState(false);

  const tiers: any[] = tiersData?.getMembershipTiers || [];
  const emailTemplates: any[] = emailsData?.getEmailTemplates || [];
  const communities: any[] =
    communitiesData?.getCommunities?.data ||
    communitiesData?.getAllCommunities ||
    [];

  // Helper to find existing action by type
  const getAction = (type: MemberRuleActionType) => {
    return actions.find((a) => a.type === type);
  };

  const isActionActive = (type: MemberRuleActionType) => {
    return actions.some((a) => a.type === type);
  };

  const toggleAction = (type: MemberRuleActionType, enabled: boolean) => {
    if (!enabled) {
      onChange(actions.filter((a) => a.type !== type));
    } else {
      let defaultAction: MemberRuleActionInput;
      switch (type) {
        case "ASSIGN_MEMBERSHIP_TIER":
          defaultAction = {
            type: "ASSIGN_MEMBERSHIP_TIER",
            tierId: tiers[0]?.id || "",
          };
          break;
        case "COMMUNITY_JOIN":
          defaultAction = {
            type: "COMMUNITY_JOIN",
            communityId: communities[0]?.id || "",
          };
          break;
        case "EMAIL":
          defaultAction = {
            type: "EMAIL",
            emailSubject: "Welcome to our community! 🎉",
            emailBody: getDefaultStarter("welcome"),
            templateId: emailTemplates[0]?.id || undefined,
          };
          break;
        case "NOTIFICATION":
          defaultAction = {
            type: "NOTIFICATION",
            pushTitle: "Welcome to our community! ✨",
            pushBody: "Your membership tier has been automatically updated.",
            notificationMessage:
              "Your membership tier has been automatically updated.",
            push: true,
          };
          break;
        case "ADD_MEMBER_TAG":
          defaultAction = {
            type: "ADD_MEMBER_TAG",
            tags: ["VIP", "Auto-Assigned"],
          };
          break;
        default:
          defaultAction = { type };
      }
      onChange([...actions, defaultAction]);
    }
  };

  const updateAction = (
    type: MemberRuleActionType,
    updates: Partial<MemberRuleActionInput>
  ) => {
    onChange(
      actions.map((a) => (a.type === type ? { ...a, ...updates } : a))
    );
  };

  const tierAction = getAction("ASSIGN_MEMBERSHIP_TIER");
  const communityAction = getAction("COMMUNITY_JOIN");
  const emailAction = getAction("EMAIL");
  const notificationAction = getAction("NOTIFICATION");
  const tagAction = getAction("ADD_MEMBER_TAG");

  const selectedTier = tiers.find((t) => t.id === tierAction?.tierId);
  const selectedCommunity = communities.find(
    (c) => c.id === communityAction?.communityId
  );
  const selectedTemplate = emailTemplates.find(
    (t) => t.id === emailAction?.templateId
  );

  // Tag helper
  const handleAddTag = (tag: string) => {
    const clean = tag.trim();
    if (!clean) return;
    const currentTags = tagAction?.tags || [];
    if (!currentTags.includes(clean)) {
      updateAction("ADD_MEMBER_TAG", { tags: [...currentTags, clean] });
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = tagAction?.tags || [];
    updateAction("ADD_MEMBER_TAG", {
      tags: currentTags.filter((t) => t !== tagToRemove),
    });
  };

  // Variable insertion for custom email
  const insertVariable = (varTag: string) => {
    const currentBody = emailAction?.emailBody || "";
    updateAction("EMAIL", {
      emailBody: currentBody + (currentBody ? " " : "") + varTag,
    });
  };

  // Email Studio Save Handler
  const handleSaveFromGrapes = async (data: {
    html: string;
    json: string;
    subject?: string;
  }) => {
    try {
      setIsSavingGrapes(true);
      updateAction("EMAIL", {
        emailBody: data.html,
        emailSubject: data.subject || emailAction?.emailSubject,
      });
      setIsGrapesModalOpen(false);
      toast.success("Email template designed with Email Studio updated!");
    } catch (err: any) {
      toast.error("Failed to save email design.");
    } finally {
      setIsSavingGrapes(false);
    }
  };

  // Render preview helper
  const getRenderedPreview = () => {
    const raw = emailAction?.emailBody || getDefaultStarter("welcome");
    return raw
      .replace(/{{firstName}}/g, "Alex")
      .replace(/{{lastName}}/g, "Taylor")
      .replace(/{{member_name}}/g, "Alex Taylor")
      .replace(/{{email}}/g, "alex@example.com")
      .replace(/{{member_email}}/g, "alex@example.com")
      .replace(/{{entity_name}}/g, "Your Community")
      .replace(/{{college}}/g, "Stanford University")
      .replace(/{{city}}/g, "San Francisco")
      .replace(/{{tierName}}/g, "Gold Tier");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Automated Execution Actions
          </h3>
          <Badge
            variant="secondary"
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          >
            {actions.length} {actions.length === 1 ? "Action" : "Actions"} Configured
          </Badge>
        </div>
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
          Triggered automatically when conditions match
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {/* ================================================================ */}
        {/* Action 1: Assign Membership Tier */}
        {/* ================================================================ */}
        <div
          className={`p-4 rounded-xl border transition-all duration-200 ${
            isActionActive("ASSIGN_MEMBERSHIP_TIER")
              ? "bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/60 shadow-xs"
              : "bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200/70 dark:border-zinc-800/70 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  isActionActive("ASSIGN_MEMBERSHIP_TIER")
                    ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xs"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                }`}
              >
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  Assign Membership Tier
                  <Badge
                    variant="outline"
                    className="text-[9px] font-bold text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                  >
                    Primary
                  </Badge>
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Automatically grant a tier badge, ranking, and exclusive ecosystem perks.
                </p>
              </div>
            </div>

            <Switch
              checked={isActionActive("ASSIGN_MEMBERSHIP_TIER")}
              onCheckedChange={(checked) =>
                toggleAction("ASSIGN_MEMBERSHIP_TIER", checked)
              }
            />
          </div>

          {isActionActive("ASSIGN_MEMBERSHIP_TIER") && (
            <div className="mt-3.5 pt-3 border-t border-amber-200/60 dark:border-amber-900/40 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Target Membership Tier
                </label>
                <Select
                  value={tierAction?.tierId || ""}
                  onValueChange={(val) =>
                    updateAction("ASSIGN_MEMBERSHIP_TIER", { tierId: val })
                  }
                  disabled={tiersLoading}
                >
                  <SelectTrigger className="h-9 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                    <SelectValue placeholder="Choose membership tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiers.map((tier) => (
                      <SelectItem
                        key={tier.id}
                        value={tier.id}
                        className="text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                            style={{
                              backgroundColor: tier.badgeColor || "#eab308",
                            }}
                          />
                          <span className="font-medium">{tier.name}</span>
                          {tier.isDefault && (
                            <span className="text-[10px] text-zinc-400">
                              (Default)
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTier && (
                <div className="p-2.5 rounded-lg bg-white/90 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center gap-2.5 shadow-2xs">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-xs shrink-0"
                    style={{
                      backgroundColor: selectedTier.badgeColor || "#eab308",
                    }}
                  >
                    {selectedTier.badgeIcon || "★"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate text-zinc-900 dark:text-zinc-100">
                      {selectedTier.name}
                    </div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                      {selectedTier.benefits?.length || 0} perks · Rank #{selectedTier.rank || 1}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* Action 2: Auto-Join Community */}
        {/* ================================================================ */}
        <div
          className={`p-4 rounded-xl border transition-all duration-200 ${
            isActionActive("COMMUNITY_JOIN")
              ? "bg-blue-50/40 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-900/60 shadow-xs"
              : "bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200/70 dark:border-zinc-800/70 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  isActionActive("COMMUNITY_JOIN")
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xs"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                }`}
              >
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Auto-Join Community Circle
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Instantly enroll matched members into a specific community or hub.
                </p>
              </div>
            </div>

            <Switch
              checked={isActionActive("COMMUNITY_JOIN")}
              onCheckedChange={(checked) =>
                toggleAction("COMMUNITY_JOIN", checked)
              }
            />
          </div>

          {isActionActive("COMMUNITY_JOIN") && (
            <div className="mt-3.5 pt-3 border-t border-blue-200/60 dark:border-blue-900/40 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Target Community
                </label>
                <Select
                  value={communityAction?.communityId || ""}
                  onValueChange={(val) =>
                    updateAction("COMMUNITY_JOIN", { communityId: val })
                  }
                  disabled={communitiesLoading}
                >
                  <SelectTrigger className="h-9 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                    <SelectValue placeholder="Select community to auto-join" />
                  </SelectTrigger>
                  <SelectContent>
                    {communities.map((comm) => (
                      <SelectItem
                        key={comm.id}
                        value={comm.id}
                        className="text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate max-w-[200px]">
                            {comm.title || comm.name}
                          </span>
                          {comm.privacy && (
                            <span className="text-[9px] uppercase text-zinc-400">
                              ({comm.privacy})
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCommunity && (
                <div className="p-2.5 rounded-lg bg-white/90 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center gap-2.5 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate text-zinc-900 dark:text-zinc-100">
                      {selectedCommunity.title || selectedCommunity.name}
                    </div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate flex items-center gap-1">
                      <span>{selectedCommunity.numberOfUser || 0} members</span>
                      <span>·</span>
                      <span className="capitalize">
                        {selectedCommunity.privacy || "Public"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* Action 3: Send Email (Linked to GrapesJS Studio Email Designer) */}
        {/* ================================================================ */}
        <div
          className={`p-4 rounded-xl border transition-all duration-200 ${
            isActionActive("EMAIL")
              ? "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200/80 dark:border-indigo-900/60 shadow-xs"
              : "bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200/70 dark:border-zinc-800/70 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  isActionActive("EMAIL")
                    ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-xs"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                }`}
              >
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  Send Onboarding / Welcome Email
                  <Badge
                    variant="outline"
                    className="text-[9px] font-semibold text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40"
                  >
                    Email Studio
                  </Badge>
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Deliver a rich visual email template created via Email Studio visual editor or saved template.
                </p>
              </div>
            </div>

            <Switch
              checked={isActionActive("EMAIL")}
              onCheckedChange={(checked) => toggleAction("EMAIL", checked)}
            />
          </div>

          {isActionActive("EMAIL") && (
            <div className="mt-3.5 pt-3 border-t border-indigo-200/60 dark:border-indigo-900/40 space-y-3.5">
              {/* Top controls: Mode Switch & Email Studio Launcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/90 p-0.5 rounded-lg border border-zinc-200/60 dark:border-zinc-700">
                  <button
                    type="button"
                    onClick={() => setEmailTab("custom")}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all ${
                      emailTab === "custom"
                        ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    Visual & Custom Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailTab("template")}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all ${
                      emailTab === "template"
                        ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    Saved Email Template
                  </button>
                </div>

                {emailTab === "custom" && (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setIsPreviewModalOpen(true)}
                      className="h-8 text-xs gap-1 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-500" />
                      Preview
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setIsGrapesModalOpen(true)}
                      className="h-8 text-xs gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold shadow-xs"
                    >
                      <Paintbrush className="w-3.5 h-3.5" />
                      Open Email Studio
                    </Button>
                  </div>
                )}
              </div>

              {emailTab === "custom" ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                      Email Subject Line
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Welcome to Stanford Alumni Circle 🎓"
                      value={emailAction?.emailSubject || ""}
                      onChange={(e) =>
                        updateAction("EMAIL", {
                          emailSubject: e.target.value,
                        })
                      }
                      className="h-9 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 font-medium"
                    />
                  </div>

                  {/* Email Studio Design Banner */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/80 dark:from-indigo-950/30 dark:via-zinc-900/40 dark:to-purple-950/30 border border-indigo-200/70 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                          Drag & Drop Email Studio Designer
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {emailAction?.emailBody
                            ? `Rich HTML Email compiled (${emailAction.emailBody.length} bytes). Click to edit visually.`
                            : "Build responsive columns, buttons, cards, and banners."}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setIsGrapesModalOpen(true)}
                      className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white font-bold shrink-0 gap-1.5"
                    >
                      <Paintbrush className="w-3.5 h-3.5" />
                      Launch Visual Designer
                    </Button>
                  </div>

                  {/* Raw HTML / Manual Editor Accordion / Details */}
                  <details className="group">
                    <summary className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 cursor-pointer select-none flex items-center gap-1">
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90" />
                      <span>View / Edit Raw HTML Code Directly</span>
                    </summary>
                    <div className="mt-2 space-y-2">
                      <Textarea
                        placeholder="<p>Hi {{firstName}}, welcome to the community!</p>"
                        value={emailAction?.emailBody || ""}
                        onChange={(e) =>
                          updateAction("EMAIL", {
                            emailBody: e.target.value,
                          })
                        }
                        className="text-[11px] font-mono bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 resize-none min-h-[100px]"
                      />

                      {/* Variable Pills */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                          <Code2 className="w-3 h-3" /> Insert variable:
                        </span>
                        {TEMPLATE_VARIABLES.map((v) => (
                          <button
                            key={v.tag}
                            type="button"
                            onClick={() => insertVariable(v.tag)}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 border border-zinc-200 dark:border-zinc-700 transition-colors"
                            title={`Sample: ${v.sample}`}
                          >
                            {v.tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </details>
                </div>
              ) : (
                <div>
                  <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Select Pre-Saved Email Template
                  </label>
                  <Select
                    value={emailAction?.templateId || ""}
                    onValueChange={(val) =>
                      updateAction("EMAIL", { templateId: val })
                    }
                    disabled={emailsLoading}
                  >
                    <SelectTrigger className="h-9 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                      <SelectValue placeholder="Choose email template" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.length === 0 ? (
                        <SelectItem value="default_welcome" className="text-xs">
                          Default Member Onboarding Email
                        </SelectItem>
                      ) : (
                        emailTemplates.map((template) => (
                          <SelectItem
                            key={template.id}
                            value={template.id}
                            className="text-xs"
                          >
                            {template.name} ({template.subject || "No Subject"})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  {selectedTemplate && (
                    <p className="text-[10px] text-zinc-500 mt-1 italic">
                      Subject: {selectedTemplate.subject || "Default Subject"}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* Action 4: Push Notification */}
        {/* ================================================================ */}
        <div
          className={`p-4 rounded-xl border transition-all duration-200 ${
            isActionActive("NOTIFICATION")
              ? "bg-purple-50/40 dark:bg-purple-950/20 border-purple-200/80 dark:border-purple-900/60 shadow-xs"
              : "bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200/70 dark:border-zinc-800/70 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  isActionActive("NOTIFICATION")
                    ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xs"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                }`}
              >
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Send Mobile Push & In-App Alert
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Deliver instant notifications directly to the member's mobile device and bell feed.
                </p>
              </div>
            </div>

            <Switch
              checked={isActionActive("NOTIFICATION")}
              onCheckedChange={(checked) =>
                toggleAction("NOTIFICATION", checked)
              }
            />
          </div>

          {isActionActive("NOTIFICATION") && (
            <div className="mt-3.5 pt-3 border-t border-purple-200/60 dark:border-purple-900/40 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                      Notification Title
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Gold Membership Activated ✨"
                      value={notificationAction?.pushTitle || ""}
                      onChange={(e) =>
                        updateAction("NOTIFICATION", {
                          pushTitle: e.target.value,
                        })
                      }
                      className="h-9 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                      Notification Message Body
                    </label>
                    <Textarea
                      placeholder="e.g. Welcome Stanford Alumni! Your Gold tier perks are now active."
                      value={notificationAction?.pushBody || ""}
                      onChange={(e) =>
                        updateAction("NOTIFICATION", {
                          pushBody: e.target.value,
                          notificationMessage: e.target.value,
                        })
                      }
                      className="text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 resize-none min-h-[64px]"
                    />
                  </div>
                </div>

                {/* Mobile Notification Preview Card */}
                <div className="p-3 rounded-xl bg-zinc-900 text-white border border-zinc-800 space-y-1.5 self-start shadow-sm">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1 font-semibold text-zinc-300">
                      <Smartphone className="w-3 h-3" /> APP NOTIFICATION
                    </span>
                    <span>now</span>
                  </div>
                  <div className="text-xs font-bold text-white line-clamp-1">
                    {notificationAction?.pushTitle || "Notification Title"}
                  </div>
                  <div className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed">
                    {notificationAction?.pushBody ||
                      "Your notification message will appear here for the member."}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* Action 5: Add Member Tags */}
        {/* ================================================================ */}
        <div
          className={`p-4 rounded-xl border transition-all duration-200 ${
            isActionActive("ADD_MEMBER_TAG")
              ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/60 shadow-xs"
              : "bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200/70 dark:border-zinc-800/70 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  isActionActive("ADD_MEMBER_TAG")
                    ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xs"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                }`}
              >
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Assign Member Tags & Badges
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Append custom labels and segments to the user profile for categorization.
                </p>
              </div>
            </div>

            <Switch
              checked={isActionActive("ADD_MEMBER_TAG")}
              onCheckedChange={(checked) =>
                toggleAction("ADD_MEMBER_TAG", checked)
              }
            />
          </div>

          {isActionActive("ADD_MEMBER_TAG") && (
            <div className="mt-3.5 pt-3 border-t border-emerald-200/60 dark:border-emerald-900/40 space-y-2.5">
              <div>
                <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Active Tags for this Rule
                </label>

                {/* Tag Chips */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 min-h-[42px]">
                  {(tagAction?.tags || []).length === 0 ? (
                    <span className="text-xs text-zinc-400 italic">
                      No tags added yet. Type below or click suggestions.
                    </span>
                  ) : (
                    (tagAction?.tags || []).map((tag, idx) => (
                      <Badge
                        key={idx}
                        className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-xs py-0.5 px-2 gap-1 font-semibold flex items-center"
                      >
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-emerald-500 hover:text-emerald-700 ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              {/* Tag Input Box */}
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Type tag name and press Enter (e.g. Stanford Alumni, VIP)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(tagInput);
                    }
                  }}
                  className="h-9 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddTag(tagInput)}
                  className="h-9 text-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add
                </Button>
              </div>

              {/* Tag Suggestions */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-zinc-400">Suggestions:</span>
                {SUGGESTED_TAGS.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleAddTag(st)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 border border-zinc-200 dark:border-zinc-700 transition-colors"
                  >
                    + {st}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================================================================ */}
      {/* Email Studio Designer Modal (Full-Screen Visual Studio)          */}
      {/* ================================================================ */}
      <Dialog open={isGrapesModalOpen} onOpenChange={setIsGrapesModalOpen}>
        <DialogContent className="max-w-[96vw] w-[96vw] h-[92vh] p-0 bg-white border-zinc-200 text-zinc-900 overflow-hidden flex flex-col sm:max-w-[96vw] shadow-2xl rounded-2xl">
          <DialogTitle className="sr-only">
            Email Studio Template Designer
          </DialogTitle>
          <GrapesJsEmailEditor
            title={`Designing Automation Email: ${emailAction?.emailSubject || "Custom Email"}`}
            initialData={{
              name: emailAction?.emailSubject || "Automation Email",
              subject: emailAction?.emailSubject || "Welcome to our community! 🎉",
              html: emailAction?.emailBody || getDefaultStarter("welcome"),
              json: "",
              type: "custom",
            }}
            onSave={handleSaveFromGrapes}
            onClose={() => setIsGrapesModalOpen(false)}
            isSaving={isSavingGrapes}
          />
        </DialogContent>
      </Dialog>

      {/* ================================================================ */}
      {/* Live Email HTML Preview Modal (Desktop & Mobile)                */}
      {/* ================================================================ */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-3xl sm:max-w-3xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-0 overflow-hidden shadow-2xl rounded-2xl">
          <DialogHeader className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/50">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>Email HTML Render Preview</span>
              </DialogTitle>
              <div className="flex items-center gap-2 mr-6">
                <div className="flex items-center bg-zinc-200/70 dark:bg-zinc-800 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 transition-all",
                      previewDevice === "desktop"
                        ? "bg-white text-zinc-900 shadow-xs"
                        : "text-zinc-500 hover:text-zinc-900"
                    )}
                  >
                    <Monitor className="w-3 h-3" />
                    <span className="text-[11px]">Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 transition-all",
                      previewDevice === "mobile"
                        ? "bg-white text-zinc-900 shadow-xs"
                        : "text-zinc-500 hover:text-zinc-900"
                    )}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span className="text-[11px]">Mobile</span>
                  </button>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                >
                  Live Render
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center max-h-[78vh] overflow-y-auto">
            <div className="w-full max-w-xl mb-4 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xs text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 font-bold w-16">Subject:</span>
                <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                  {emailAction?.emailSubject || "Welcome to our community!"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 font-bold w-16">Recipient:</span>
                <span className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
                  Alex Taylor &lt;alex@example.com&gt;
                </span>
              </div>
            </div>

            <div
              className={cn(
                "bg-white rounded-xl shadow-lg border border-zinc-200 overflow-hidden transition-all duration-300",
                previewDevice === "mobile" ? "w-[375px]" : "w-full max-w-xl"
              )}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: getRenderedPreview(),
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
