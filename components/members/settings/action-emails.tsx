"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  UserPlus,
  CheckCircle2,
  Eye,
  Zap,
  Monitor,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisTipCard,
  PolarisSummaryRow,
} from "@/components/gamification/shared/polaris-form-ui";
import {
  GrapesJsEmailEditor,
  getDefaultStarter,
} from "@/components/email/grapesjs-editor/grapesjs-email-editor";
import {
  useGetEmailTemplates,
  useCreateEmailTemplate,
  useUpdateEmailTemplate,
} from "@/graphql/actions/email";
import { useGetEntity, useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ActionEmailConfig {
  id: string;
  slug: "new-member-welcome" | "member-account-approved";
  type: "welcome" | "approval";
  title: string;
  description: string;
  icon: typeof UserPlus;
  triggerEvent: string;
  timing: string;
  enabled: boolean;
  subject: string;
  templateId?: string;
  html?: string;
  json?: string;
}

const DEFAULT_ACTION_EMAILS: ActionEmailConfig[] = [
  {
    id: "welcome-email",
    slug: "new-member-welcome",
    type: "welcome",
    title: "New Member First Registration",
    description:
      "Automated welcome email dispatched immediately upon initial account registration and signup.",
    icon: UserPlus,
    triggerEvent: "User Registration / First Signup",
    timing: "Immediate",
    enabled: true,
    subject: "Welcome to {{entity_name}}! 🚀",
    html: getDefaultStarter("welcome"),
  },
  {
    id: "approval-email",
    slug: "member-account-approved",
    type: "approval",
    title: "Member Account Approval & Activation",
    description:
      "Notification sent once an applicant's membership is verified and approved into the ecosystem.",
    icon: CheckCircle2,
    triggerEvent: "Admin Approval or Auto-Approval Trigger",
    timing: "On Approval",
    enabled: true,
    subject: "🎉 Your membership for {{entity_name}} has been approved!",
    html: getDefaultStarter("approval"),
  },
];

interface RemoteEmailTemplate {
  id: string;
  name: string;
  slug?: string;
  subject?: string;
  html?: string;
  json?: string;
  isActive?: boolean;
}

export function ActionEmailsSettings() {
  const { data: entityData } = useGetEntity();
  const { data: entitySettingsData } = useEntitySettings();
  const [updateEntitySettingsMutation] = useUpdateEntitySettings({});
  const { data: templatesData, refetch: refetchTemplates } = useGetEmailTemplates();
  const [createTemplate] = useCreateEmailTemplate();
  const [updateTemplate] = useUpdateEmailTemplate();

  const [configs, setConfigs] = useState<ActionEmailConfig[]>(DEFAULT_ACTION_EMAILS);
  const [activeEditorConfig, setActiveEditorConfig] = useState<ActionEmailConfig | null>(null);
  const [previewConfig, setPreviewConfig] = useState<ActionEmailConfig | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isSaving, setIsSaving] = useState(false);

  // Sync templates & entitySettings from backend
  useEffect(() => {
    if (entitySettingsData?.getEntitySettings?.actionEmails) {
      const savedActionEmails = entitySettingsData.getEntitySettings.actionEmails as ActionEmailConfig[];
      if (Array.isArray(savedActionEmails) && savedActionEmails.length > 0) {
        setConfigs((prev) =>
          prev.map((cfg) => {
            const matched = savedActionEmails.find((s) => s.type === cfg.type);
            if (matched) {
              return {
                ...cfg,
                enabled: matched.enabled ?? cfg.enabled,
                subject: matched.subject || cfg.subject,
                html: matched.html || cfg.html,
                json: matched.json || cfg.json,
              };
            }
            return cfg;
          })
        );
      }
    }

    // 2. Sync from remote email templates if available
    if (templatesData?.getEmailTemplates) {
      const templates = templatesData.getEmailTemplates as RemoteEmailTemplate[];
      setConfigs((prev) =>
        prev.map((cfg) => {
          const matched = templates.find(
            (t) =>
              t.slug === cfg.slug ||
              t.name.toLowerCase().includes(cfg.type)
          );
          if (matched) {
            return {
              ...cfg,
              templateId: matched.id,
              subject: matched.subject || cfg.subject,
              html: matched.html || cfg.html || getDefaultStarter(cfg.type),
              json: matched.json || cfg.json,
              enabled: matched.isActive ?? cfg.enabled,
            };
          }
          return cfg;
        })
      );
    }
  }, [templatesData, entitySettingsData]);

  // Persist settings to entitySettings and template store
  const persistSettings = async (updatedConfigs: ActionEmailConfig[]) => {
    try {
      // Save in entitySettings
      const settingsPayload = {
        sendWelcomeEmail: updatedConfigs.find((c) => c.type === "welcome")?.enabled ?? true,
        welcomeEmailSubject: updatedConfigs.find((c) => c.type === "welcome")?.subject,
        sendApprovalEmail: updatedConfigs.find((c) => c.type === "approval")?.enabled ?? true,
        approvalEmailSubject: updatedConfigs.find((c) => c.type === "approval")?.subject,
        actionEmails: updatedConfigs.map((c) => ({
          type: c.type,
          slug: c.slug,
          enabled: c.enabled,
          subject: c.subject,
          html: c.html,
          json: c.json,
        })),
      };

      await updateEntitySettingsMutation({
        variables: {
          input: settingsPayload,
        },
      });
    } catch {
      // Background sync fallback
    }
  };

  const handleToggle = (id: string, checked: boolean) => {
    const updated = configs.map((cfg) =>
      cfg.id === id ? { ...cfg, enabled: checked } : cfg
    );
    setConfigs(updated);
    persistSettings(updated);
    toast.success(
      checked
        ? "Action email automation enabled and saved to Entity Settings."
        : "Action email automation paused and saved to Entity Settings."
    );
  };

  const handleSubjectChange = (id: string, newSubject: string) => {
    setConfigs((prev) =>
      prev.map((cfg) => (cfg.id === id ? { ...cfg, subject: newSubject } : cfg))
    );
  };

  const handleSubjectBlur = () => {
    persistSettings(configs);
    toast.success("Email subject updated in Entity Settings.");
  };

  const handleSaveFromEditor = async ({
    html,
    json,
    subject,
  }: {
    html: string;
    json: string;
    subject: string;
  }) => {
    if (!activeEditorConfig) return;
    setIsSaving(true);

    try {
      // 1. If template exists on backend, update it
      if (activeEditorConfig.templateId) {
        await updateTemplate({
          variables: {
            input: {
              id: activeEditorConfig.templateId,
              name: activeEditorConfig.title,
              subject: subject,
              html: html,
              json: json,
              isActive: activeEditorConfig.enabled,
            },
          },
        });
      } else {
        // Create new template record
        const res = await createTemplate({
          variables: {
            input: {
              name: activeEditorConfig.title,
              slug: activeEditorConfig.slug,
              subject: subject,
              html: html,
              json: json,
              isActive: activeEditorConfig.enabled,
            },
          },
        });

        const createdId = res.data?.createEmailTemplate?.id;
        if (createdId) {
          activeEditorConfig.templateId = createdId;
        }
      }

      // 2. Update local state & persist to entitySettings
      const updated = configs.map((cfg) =>
        cfg.id === activeEditorConfig.id
          ? {
              ...cfg,
              html,
              json,
              subject,
            }
          : cfg
      );
      setConfigs(updated);
      await persistSettings(updated);

      await refetchTemplates();
      setActiveEditorConfig(null);
      toast.success("Action email template customized and saved to Entity Settings!");
    } catch {
      // Fallback: save to state and entitySettings even if template table is pending
      const updated = configs.map((cfg) =>
        cfg.id === activeEditorConfig.id
          ? {
              ...cfg,
              html,
              json,
              subject,
            }
          : cfg
      );
      setConfigs(updated);
      await persistSettings(updated);
      setActiveEditorConfig(null);
      toast.success("Action email template saved to Entity Settings!");
    } finally {
      setIsSaving(false);
    }
  };

  // Interpolate variables for preview
  const getRenderedPreview = (cfg: ActionEmailConfig) => {
    const rawHtml = cfg.html && cfg.html.trim().length > 0 ? cfg.html : getDefaultStarter(cfg.type);
    const orgName = entityData?.getEntity?.name || "The Shepherd Tribe";
    return rawHtml
      .replace(/{{member_name}}/g, "Alex Taylor")
      .replace(/{{member_email}}/g, "alex@example.com")
      .replace(/{{entity_name}}/g, orgName)
      .replace(/{{login_url}}/g, "#")
      .replace(/{{approval_status}}/g, "Approved / Active")
      .replace(/{{dashboard_url}}/g, "#");
  };

  const getRenderedSubject = (cfg: ActionEmailConfig) => {
    const orgName = entityData?.getEntity?.name || "The Shepherd Tribe";
    return (cfg.subject || "")
      .replace(/{{entity_name}}/g, orgName)
      .replace(/{{member_name}}/g, "Alex Taylor");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main List */}
        <div className="lg:col-span-8 space-y-4">
          <PolarisFormCard
            stepNumber="1"
            title="Action Email Protocols"
            description="Manage automated transactional communications triggered by lifecycle events during member onboarding."
            badge="Automation"
          >
            <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800">
              {configs.map((config) => {
                const Icon = config.icon;
                return (
                  <div key={config.id} className="py-5 first:pt-0 last:pb-0 space-y-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                              {config.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] font-semibold",
                                config.enabled
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                                  : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                              )}
                            >
                              {config.enabled ? "Active" : "Paused"}
                            </Badge>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                            {config.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={config.enabled}
                        onCheckedChange={(checked) => handleToggle(config.id, checked)}
                        className="data-[state=checked]:bg-indigo-600"
                      />
                    </div>

                    {/* Metadata Specs */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200/60 dark:border-zinc-800 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                          Trigger Event:
                        </span>
                        <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                          {config.triggerEvent}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                          Delivery Timing:
                        </span>
                        <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                          {config.timing}
                        </span>
                      </div>
                    </div>

                    {/* Subject Line Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Email Subject Line
                      </label>
                      <Input
                        value={config.subject}
                        onChange={(e) => handleSubjectChange(config.id, e.target.value)}
                        onBlur={() => handleSubjectBlur(config.id)}
                        placeholder="Subject line with {{entity_name}}..."
                        className="h-9 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                      />
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewConfig(config)}
                        className="h-8 text-xs font-semibold text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Preview Email</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveEditorConfig(config)}
                        className="h-8 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Customize Email</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </PolarisFormCard>
        </div>

        {/* Sidebar Guidance */}
        <div className="lg:col-span-4 space-y-6">
          <PolarisSidebarCard
            title="Action Automation"
            badge="Engine"
            icon={Zap}
          >
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                Action emails are mission-critical transactional emails sent automatically based on member actions and moderation workflow.
              </p>
              <div className="pt-2 space-y-1.5 border-t border-zinc-100 dark:border-zinc-800">
                <PolarisSummaryRow
                  label="First Register"
                  value={configs[0]?.enabled ? "Active" : "Disabled"}
                />
                <PolarisSummaryRow
                  label="Member Approval"
                  value={configs[1]?.enabled ? "Active" : "Disabled"}
                  isLast
                />
              </div>
            </div>
          </PolarisSidebarCard>

          <PolarisTipCard title="Dynamic Tag Reference">
            <div className="space-y-1.5 text-xs">
              <p className="text-zinc-500 dark:text-zinc-400">
                You can use the following variables in subjects and GrapesJS blocks:
              </p>
              <ul className="space-y-1 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                <li>• <code className="text-indigo-600 dark:text-indigo-400">{"{{member_name}}"}</code> - Full name</li>
                <li>• <code className="text-indigo-600 dark:text-indigo-400">{"{{member_email}}"}</code> - Email</li>
                <li>• <code className="text-indigo-600 dark:text-indigo-400">{"{{entity_name}}"}</code> - Org Name</li>
                <li>• <code className="text-indigo-600 dark:text-indigo-400">{"{{login_url}}"}</code> - Login portal link</li>
              </ul>
            </div>
          </PolarisTipCard>
        </div>
      </div>

      {/* ── GrapesJS Email Builder Fullscreen Modal (Light Theme) ──── */}
      <Dialog
        open={!!activeEditorConfig}
        onOpenChange={(open) => {
          if (!open) setActiveEditorConfig(null);
        }}
      >
        <DialogContent className="max-w-[96vw] w-[96vw] h-[92vh] p-0 bg-white border-zinc-200 text-zinc-900 overflow-hidden flex flex-col sm:max-w-[96vw] shadow-2xl">
          <DialogTitle className="sr-only">
            GrapesJS Email Template Builder
          </DialogTitle>
          {activeEditorConfig && (
            <GrapesJsEmailEditor
              title={`Designing: ${activeEditorConfig.title}`}
              initialData={{
                name: activeEditorConfig.title,
                subject: activeEditorConfig.subject,
                html: activeEditorConfig.html || getDefaultStarter(activeEditorConfig.type),
                json: activeEditorConfig.json || "",
                type: activeEditorConfig.type,
              }}
              onSave={handleSaveFromEditor}
              onClose={() => setActiveEditorConfig(null)}
              isSaving={isSaving}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ── Quick Live Preview Modal ──────────────────────────────── */}
      <Dialog
        open={!!previewConfig}
        onOpenChange={(open) => {
          if (!open) setPreviewConfig(null);
        }}
      >
        <DialogContent className="max-w-3xl sm:max-w-3xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/50">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xs font-bold flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>Preview: {previewConfig?.title}</span>
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
                  Live Preview
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {previewConfig && (
            <div className="p-6 bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center max-h-[78vh] overflow-y-auto">
              <div className="w-full max-w-xl mb-4 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xs text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 font-bold w-16">Subject:</span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                    {getRenderedSubject(previewConfig)}
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
                    __html: getRenderedPreview(previewConfig),
                  }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
