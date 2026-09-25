"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_COMMUNITY_BY_ID,
  UPDATE_COMMUNITY_RULES,
} from "@/graphql/quries/group/approval";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShieldAlert,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Loader2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Info,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";
import { cn } from "@/lib/utils";

interface CommunityRule {
  id?: string;
  title: string;
  description: string;
  isActive: boolean;
  order: number;
}

const RULE_TEMPLATES = [
  {
    title: "Be Respectful & Constructive",
    description:
      "Treat everyone with respect and empathy. Healthy debate is encouraged, but personal attacks and hostility will not be tolerated.",
    icon: Sparkles,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    title: "No Spam or Unsolicited Promotion",
    description:
      "Keep this space focused on value. Do not post advertisements, referral links, or unapproved commercial promotions.",
    icon: Zap,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "Stay Relevant to Community Topics",
    description:
      "Ensure all posts and comments align with the mission of this community. Off-topic posts may be moderated or archived.",
    icon: Layers,
    gradient: "from-purple-500 to-pink-600",
  },
  {
    title: "Protect Privacy & Confidentiality",
    description:
      "Never share private personal information, confidential messages, or sensitive internal data without explicit consent.",
    icon: ShieldCheck,
    gradient: "from-emerald-500 to-teal-600",
  },
];

export default function CommunityRulesSettings() {
  const singularName = useModuleStore((state) => state.communitySingularName);
  const params = useParams();
  const id = params?.id as string;

  const { data, loading: fetchingCommunity } = useQuery(GET_COMMUNITY_BY_ID, {
    variables: { input: { communityId: id } },
    skip: !id,
  });

  const [updateCommunityRules, { loading: updating }] = useMutation(
    UPDATE_COMMUNITY_RULES,
    {
      onCompleted: () => {
        toast.success("Community guidelines saved successfully");
        setDirty(false);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update community rules");
      },
    }
  );

  const [rules, setRules] = useState<CommunityRule[]>([]);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (data?.getCommunityById?.rules) {
      const cleanRules = data.getCommunityById.rules.map((rule: any) => ({
        id: rule.id,
        title: rule.title || "",
        description: rule.description || "",
        isActive: rule.isActive ?? true,
        order: rule.order ?? 0,
      }));
      cleanRules.sort((a: any, b: any) => a.order - b.order);
      setRules(cleanRules);
      setDirty(false);
    } else if (data?.getCommunityById && !data.getCommunityById.rules) {
      setRules([]);
      setDirty(false);
    }
  }, [data]);

  const handleAddRule = (templateTitle = "", templateDesc = "") => {
    setRules([
      ...rules,
      {
        id: Math.random().toString(36).substring(2, 9),
        title: templateTitle,
        description: templateDesc,
        isActive: true,
        order: rules.length + 1,
      },
    ]);
    setDirty(true);
  };

  const handleRemoveRule = (index: number) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    newRules.forEach((rule, idx) => {
      rule.order = idx + 1;
    });
    setRules(newRules);
    setDirty(true);
  };

  const moveRule = (fromIndex: number, toIndex: number) => {
    const newRules = [...rules];
    const [moved] = newRules.splice(fromIndex, 1);
    newRules.splice(toIndex, 0, moved);
    newRules.forEach((rule, idx) => {
      rule.order = idx + 1;
    });
    setRules(newRules);
    setDirty(true);
  };

  const handleRuleChange = (
    index: number,
    field: keyof CommunityRule,
    value: any
  ) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
    setDirty(true);
  };

  const handleSave = () => {
    const hasEmptyTitles = rules.some((rule) => !rule.title.trim());
    if (hasEmptyTitles) {
      toast.error("All rules must have a title before saving.");
      return;
    }

    updateCommunityRules({
      variables: {
        input: {
          communityId: id,
          rules: rules.map((r) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            isActive: r.isActive,
            order: r.order,
          })),
        },
      },
    });
  };

  if (fetchingCommunity) {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const activeRules = rules.filter((r) => r.isActive);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Top Header Strip ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/60 rounded-xl p-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              Community Guidelines & Conduct Policies
            </h2>
            <Badge variant="secondary" className="text-[10px] font-semibold">
              {rules.length} Total Rules
            </Badge>
            {dirty && (
              <Badge
                variant="outline"
                className="text-[10px] font-semibold bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
              >
                Unsaved Changes
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Establish standards of behavior, content expectations, and moderation policies for all members.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddRule()}
            className="h-8 text-xs font-semibold gap-1.5 border-border/60 rounded-lg shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Rule
          </Button>

          <Button
            onClick={handleSave}
            disabled={updating || !dirty}
            size="sm"
            className="h-8 text-xs font-semibold gap-1.5 rounded-lg shadow-2xs bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
          >
            {updating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {updating ? "Saving…" : "Save Guidelines"}
          </Button>
        </div>
      </div>

      {/* ── Rule Starters / Preset Recipes (Inspired by Email Hub) ────────── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-[11.5px] font-bold text-foreground uppercase tracking-wider">
            Quick Rule Starters & Presets
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {RULE_TEMPLATES.map((tmpl, idx) => {
            const Icon = tmpl.icon;
            const alreadyAdded = rules.some(
              (r) => r.title.toLowerCase() === tmpl.title.toLowerCase()
            );

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (!alreadyAdded) {
                    handleAddRule(tmpl.title, tmpl.description);
                    toast.success(`Added "${tmpl.title}"`);
                  } else {
                    toast.info("Rule template is already in your guidelines");
                  }
                }}
                className={cn(
                  "group flex flex-col justify-between p-3.5 rounded-xl border border-border/60 bg-card hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-2xs transition-all text-left cursor-pointer",
                  alreadyAdded && "opacity-60 bg-muted/20"
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "h-7 w-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shrink-0 shadow-xs",
                        tmpl.gradient
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-[9px] px-1.5 py-0 font-semibold rounded-[3px]"
                    >
                      {alreadyAdded ? "Added" : "+ Preset"}
                    </Badge>
                  </div>
                  <p className="text-[12px] font-bold text-foreground group-hover:text-indigo-600 transition-colors">
                    {tmpl.title}
                  </p>
                  <p className="text-[10.5px] text-muted-foreground leading-snug line-clamp-2">
                    {tmpl.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10.5px] font-semibold text-indigo-600 dark:text-indigo-400 pt-2.5 border-t border-border/40 mt-3">
                  <span>{alreadyAdded ? "Already Included" : "Insert Template"}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Layout: Editor (7/12) + Live Member Preview (5/12) ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor Column (7/12) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-semibold text-foreground">
                Active Guidelines ({rules.length})
              </h3>
              <span className="text-[11px] text-muted-foreground">
                Drag or use arrows to reorder
              </span>
            </div>

            {rules.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground space-y-2.5 border border-dashed rounded-xl p-6">
                <ShieldAlert className="h-8 w-8 mx-auto opacity-30 text-amber-500 mb-1" />
                <p className="font-semibold text-foreground text-sm">
                  No community rules defined yet
                </p>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Set clear conduct policies so members understand what is expected when participating in this {singularName.toLowerCase()}.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddRule()}
                  className="mt-2 text-xs font-semibold gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add First Rule
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {rules.map((rule, index) => (
                  <div
                    key={rule.id || index}
                    className="p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:border-border transition-all space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="flex items-center justify-center w-5 h-5 rounded-md bg-muted border border-border/60 text-muted-foreground text-[10px] font-bold shrink-0">
                          {index + 1}
                        </span>
                        <Input
                          value={rule.title}
                          onChange={(e) =>
                            handleRuleChange(index, "title", e.target.value)
                          }
                          placeholder="Rule Title (e.g., Be respectful and constructive)"
                          className="h-8 text-xs font-semibold bg-background border-border/60"
                        />
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5">
                          <Switch
                            checked={rule.isActive}
                            onCheckedChange={(checked) =>
                              handleRuleChange(index, "isActive", checked)
                            }
                            className="scale-75"
                          />
                          <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
                            {rule.isActive ? "Active" : "Disabled"}
                          </span>
                        </div>

                        <div className="flex items-center gap-0.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground rounded"
                            onClick={() => moveRule(index, index - 1)}
                            disabled={index === 0}
                            title="Move Up"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground rounded"
                            onClick={() => moveRule(index, index + 1)}
                            disabled={index === rules.length - 1}
                            title="Move Down"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveRule(index)}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                            title="Delete Rule"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="pl-7">
                      <Textarea
                        value={rule.description}
                        onChange={(e) =>
                          handleRuleChange(index, "description", e.target.value)
                        }
                        placeholder="Detailed rule explanation and policy expectations (optional)…"
                        rows={2}
                        className="text-xs resize-none bg-background border-border/60"
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs border-dashed text-muted-foreground hover:text-foreground gap-1.5 mt-2 rounded-lg"
                  onClick={() => handleAddRule()}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Another Rule
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Live Member Preview Column (5/12) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-semibold text-foreground">
                  Live Member Preview
                </h3>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] font-semibold text-muted-foreground"
              >
                Frontend Display
              </Badge>
            </div>

            <p className="text-[11px] text-muted-foreground">
              This is how your published guidelines appear to members upon joining and in the community info drawer.
            </p>

            <div className="space-y-2.5">
              {activeRules.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
                  No active rules to display in preview.
                </div>
              ) : (
                activeRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-background shadow-xs"
                  >
                    <div className="mt-0.5 p-1 bg-emerald-500/10 rounded-md shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-xs font-semibold text-foreground">
                        {rule.title || `Rule #${idx + 1}`}
                      </h4>
                      {rule.description && (
                        <p className="text-[11px] text-muted-foreground leading-snug">
                          {rule.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
