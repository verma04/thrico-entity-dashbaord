"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Plus,
  Trash2,
  Code2,
  Zap,
  Play,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GET_TRIGGER_AVAILABLE_FIELDS,
  TEST_AUTOMATION_WEBHOOK,
  TriggerAvailableField,
  WebhookFieldMapping,
} from "@/graphql/member-automation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FALLBACK_TRIGGER_FIELDS: Record<string, TriggerAvailableField[]> = {
  MEMBER_JOINED: [
    { category: "User", key: "user.id", label: "User ID", path: "{{user.id}}", type: "STRING" },
    { category: "User", key: "user.name", label: "User Name", path: "{{user.name}}", type: "STRING" },
    { category: "User", key: "user.email", label: "User Email", path: "{{user.email}}", type: "STRING" },
    { category: "User", key: "user.phone", label: "User Phone", path: "{{user.phone}}", type: "STRING" },
    { category: "Profile", key: "profile.firstName", label: "First Name", path: "{{profile.firstName}}", type: "STRING" },
    { category: "Profile", key: "profile.lastName", label: "Last Name", path: "{{profile.lastName}}", type: "STRING" },
    { category: "Profile", key: "profile.headline", label: "Headline", path: "{{profile.headline}}", type: "STRING" },
    { category: "Entity", key: "entity.id", label: "Entity ID", path: "{{entity.id}}", type: "STRING" },
  ],
  MEMBER_VERIFIED: [
    { category: "User", key: "user.id", label: "User ID", path: "{{user.id}}", type: "STRING" },
    { category: "User", key: "user.name", label: "User Name", path: "{{user.name}}", type: "STRING" },
    { category: "User", key: "user.email", label: "User Email", path: "{{user.email}}", type: "STRING" },
  ],
  MEMBER_APPROVED: [
    { category: "User", key: "user.id", label: "User ID", path: "{{user.id}}", type: "STRING" },
    { category: "User", key: "user.name", label: "User Name", path: "{{user.name}}", type: "STRING" },
    { category: "User", key: "user.email", label: "User Email", path: "{{user.email}}", type: "STRING" },
  ],
  SURVEY_SUBMITTED: [
    { category: "User", key: "user.id", label: "User ID", path: "{{user.id}}", type: "STRING" },
    { category: "User", key: "user.name", label: "User Name", path: "{{user.name}}", type: "STRING" },
    { category: "User", key: "user.email", label: "User Email", path: "{{user.email}}", type: "STRING" },
    { category: "User", key: "user.phone", label: "User Phone", path: "{{user.phone}}", type: "STRING" },
    { category: "Survey", key: "survey.id", label: "Survey ID", path: "{{survey.id}}", type: "STRING" },
    { category: "Survey", key: "survey.name", label: "Survey Title", path: "{{survey.name}}", type: "STRING" },
    { category: "Survey", key: "survey.responseId", label: "Response ID", path: "{{survey.responseId}}", type: "STRING" },
    { category: "Answers", key: "answers.all", label: "All Answers (JSON)", path: "{{answers.all}}", type: "JSON" },
  ],
};

interface WebhookFieldMappingBuilderProps {
  mapping: WebhookFieldMapping[];
  onChange: (mapping: WebhookFieldMapping[]) => void;
  trigger?: string;
  webhookConfig?: {
    url: string;
    method: string;
    authType?: string | null;
    authToken?: string | null;
    authHeaderKey?: string | null;
    authHeaderValue?: string | null;
  };
  compact?: boolean;
}

export const WebhookFieldMappingBuilder: React.FC<WebhookFieldMappingBuilderProps> = ({
  mapping = [],
  onChange,
  trigger = "MEMBER_JOINED",
  webhookConfig,
  compact = false,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const { data: fieldsData, loading: fieldsLoading } = useQuery(
    GET_TRIGGER_AVAILABLE_FIELDS,
    {
      variables: { trigger },
      fetchPolicy: "cache-first",
    }
  );

  const [testWebhook, { loading: testLoading }] = useMutation(
    TEST_AUTOMATION_WEBHOOK,
    {
      onCompleted: (res) => {
        setTestResult(res?.testAutomationWebhook);
        if (res?.testAutomationWebhook?.success) {
          toast.success(
            `Webhook test succeeded (${res.testAutomationWebhook.statusCode || 200} OK)`
          );
        } else {
          toast.error(
            res?.testAutomationWebhook?.errorMessage || "Webhook test failed"
          );
        }
      },
      onError: (err) => {
        toast.error(err.message || "Failed to test webhook");
      },
    }
  );

  const availableFields: TriggerAvailableField[] =
    fieldsData?.getTriggerAvailableFields ||
    FALLBACK_TRIGGER_FIELDS[trigger] ||
    FALLBACK_TRIGGER_FIELDS["MEMBER_JOINED"];

  // Group fields by category
  const groupedFields = availableFields.reduce<Record<string, TriggerAvailableField[]>>(
    (acc, field) => {
      const cat = field.category || "General";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(field);
      return acc;
    },
    {}
  );

  const handleAddField = () => {
    const defaultToken = availableFields[0]?.path || "{{user.email}}";
    onChange([...mapping, { field: "", value: defaultToken }]);
  };

  const handleUpdateField = (index: number, key: "field" | "value", val: string) => {
    const updated = mapping.map((item, idx) =>
      idx === index ? { ...item, [key]: val } : item
    );
    onChange(updated);
  };

  const handleRemoveField = (index: number) => {
    onChange(mapping.filter((_, idx) => idx !== index));
  };

  const handleLoadStandardPreset = () => {
    const standardMapping: WebhookFieldMapping[] = [
      { field: "user_id", value: "{{user.id}}" },
      { field: "customer_email", value: "{{user.email}}" },
      { field: "full_name", value: "{{user.name}}" },
      { field: "first_name", value: "{{profile.firstName}}" },
      { field: "last_name", value: "{{profile.lastName}}" },
    ];
    onChange(standardMapping);
    toast.success("Standard member fields loaded.");
  };

  const handleRunTest = async () => {
    if (!webhookConfig?.url) {
      toast.error("Please enter a webhook URL first.");
      return;
    }

    try {
      await testWebhook({
        variables: {
          input: {
            url: webhookConfig.url,
            method: webhookConfig.method || "POST",
            authType: webhookConfig.authType || "NONE",
            authToken: webhookConfig.authToken,
            authHeaderKey: webhookConfig.authHeaderKey,
            authHeaderValue: webhookConfig.authHeaderValue,
            mapping: mapping.map((m) => ({ field: m.field, value: m.value })),
          },
        },
      });
    } catch {
      // Handled by onError
    }
  };

  // Build JSON preview
  const payloadPreview = mapping.reduce<Record<string, string>>((acc, item) => {
    if (item.field.trim()) {
      acc[item.field.trim()] = item.value;
    }
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            Payload Field Mapping
            <Badge
              variant="outline"
              className="text-[9px] font-bold text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-900 bg-violet-50 dark:bg-violet-950/40"
            >
              {mapping.length} {mapping.length === 1 ? "Field" : "Fields"}
            </Badge>
          </label>
          <p className="text-[10.5px] text-muted-foreground">
            Map external API property names to dynamic Thrico event values.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {mapping.length === 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleLoadStandardPreset}
              className="h-7 text-[10px] font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/40 gap-1 px-2"
            >
              <Sparkles className="w-3 h-3" />
              Standard Preset
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddField}
            className="h-7 text-[10.5px] font-semibold gap-1 px-2 border-dashed border-violet-300 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/40"
          >
            <Plus className="w-3 h-3" />
            Add Field
          </Button>
        </div>
      </div>

      {/* Mapping Rows Table */}
      {mapping.length === 0 ? (
        <div className="p-3.5 rounded-xl border border-dashed border-border/80 bg-zinc-50/50 dark:bg-zinc-900/40 text-center space-y-2">
          <p className="text-xs font-medium text-foreground">
            No Custom Fields Mapped
          </p>
          <p className="text-[10.5px] text-muted-foreground max-w-sm mx-auto">
            Without custom mapping, Thrico sends the complete standard event payload. Add field mappings to format the JSON payload specifically for your CRM or API.
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleAddField}
              className="h-7 text-xs bg-violet-600 hover:bg-violet-700 text-white gap-1"
            >
              <Plus className="w-3 h-3" />
              Add First Mapping
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLoadStandardPreset}
              className="h-7 text-xs gap-1 text-violet-600 dark:text-violet-400"
            >
              <Sparkles className="w-3 h-3" />
              Load Standard Preset
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-2 px-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <span>Client API Field (Destination Key)</span>
            <span className="w-3 text-center" />
            <span>Thrico Dynamic Value</span>
            <span className="w-7" />
          </div>

          {/* Rows */}
          <div className="space-y-1.5">
            {mapping.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[1fr_auto_1fr_auto] gap-2 items-center p-1.5 rounded-lg bg-background border border-border hover:border-violet-300 dark:hover:border-violet-800 transition-colors"
              >
                {/* Left: Client API Field Name */}
                <Input
                  type="text"
                  placeholder="e.g. customer_email"
                  value={item.field}
                  onChange={(e) =>
                    handleUpdateField(idx, "field", e.target.value)
                  }
                  className="h-8 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border-border"
                />

                {/* Equals Arrow */}
                <span className="text-xs font-bold text-muted-foreground px-0.5">
                  =
                </span>

                {/* Right: Thrico Value Selector */}
                <Select
                  value={item.value}
                  onValueChange={(val) => handleUpdateField(idx, "value", val)}
                >
                  <SelectTrigger className="h-8 text-xs bg-zinc-50 dark:bg-zinc-900 border-border font-medium">
                    <SelectValue placeholder="Select dynamic token" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {Object.entries(groupedFields).map(([category, fields]) => (
                      <SelectGroup key={category}>
                        <SelectLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          {category}
                        </SelectLabel>
                        {fields.map((f) => (
                          <SelectItem
                            key={f.path}
                            value={f.path}
                            className="text-xs"
                          >
                            <div className="flex items-center justify-between gap-3 w-full">
                              <span className="font-medium">{f.label}</span>
                              <span className="font-mono text-[10px] text-muted-foreground">
                                {f.path}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>

                {/* Delete Row Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveField(idx)}
                  className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 shrink-0"
                  title="Remove Field"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer: JSON Preview & Test Webhook */}
      <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Code2 className="w-3.5 h-3.5" />
          {showPreview ? "Hide JSON Payload Preview" : "View Outgoing JSON Payload"}
        </button>

        {webhookConfig?.url && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRunTest}
            disabled={testLoading}
            className="h-7 text-xs font-semibold gap-1.5 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
          >
            {testLoading ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Play className="w-3 h-3 fill-current" />
            )}
            Test Webhook Dispatch
          </Button>
        )}
      </div>

      {/* Collapsible JSON Preview */}
      {showPreview && (
        <div className="p-3 rounded-xl bg-zinc-950 text-zinc-100 border border-zinc-800 font-mono text-xs space-y-1.5 shadow-inner">
          <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase tracking-wider pb-1 border-b border-zinc-800">
            <span>Outgoing JSON Body</span>
            <span>Content-Type: application/json</span>
          </div>
          <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400">
            {Object.keys(payloadPreview).length > 0
              ? JSON.stringify(payloadPreview, null, 2)
              : `// Add mapping rows above to construct your custom JSON payload`}
          </pre>
        </div>
      )}

      {/* Test Execution Result Banner */}
      {testResult && (
        <div
          className={cn(
            "p-3 rounded-xl border text-xs space-y-2",
            testResult.success
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
              : "bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200"
          )}
        >
          <div className="flex items-center justify-between font-bold">
            <div className="flex items-center gap-1.5">
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>
                {testResult.success
                  ? `Dispatch Succeeded: HTTP ${testResult.statusCode}`
                  : `Dispatch Failed: ${testResult.errorMessage || `HTTP ${testResult.statusCode}`}`}
              </span>
            </div>
            {testResult.latencyMs && (
              <span className="text-[10px] font-mono opacity-80">
                {testResult.latencyMs}ms
              </span>
            )}
          </div>

          {testResult.responseBody && (
            <div className="space-y-1 pt-1 border-t border-current/20">
              <span className="text-[10px] font-bold uppercase opacity-80">
                Response Body:
              </span>
              <pre className="p-2 rounded bg-black/20 font-mono text-[10.5px] max-h-24 overflow-auto">
                {testResult.responseBody}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
