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
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";

interface CommunityRule {
  id?: string;
  title: string;
  description: string;
  isActive: boolean;
  order: number;
}

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
        toast.success("Community rules updated successfully");
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

  const handleAddRule = () => {
    setRules([
      ...rules,
      {
        id: Math.random().toString(36).substring(2, 9),
        title: "",
        description: "",
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
      <div className="space-y-4 animate-pulse">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-sm border border-border/70 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              Community Guidelines & Rules
            </h2>
            <Badge variant="secondary" className="text-[10px] font-semibold">
              {rules.length} Configured
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Define community expectations, member conduct policies, and moderation guidelines.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={updating || (!dirty && rules.length === (data?.getCommunityById?.rules?.length || 0))}
          size="sm"
          className="h-8 text-xs font-medium gap-1.5 shadow-sm"
        >
          {updating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {updating ? "Saving..." : "Save Rules"}
        </Button>
      </div>

      {/* Rules List Container */}
      <div className="bg-card border border-border/80 rounded-xl p-5 shadow-sm space-y-4">
        {rules.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
            <ShieldAlert className="h-8 w-8 mx-auto opacity-40 mb-2" />
            <p className="font-medium text-foreground">No guidelines created yet</p>
            <p className="text-muted-foreground">
              Set clear conduct policies so members understand expectations when interacting in this {singularName.toLowerCase()}.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddRule}
              className="mt-2 text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add First Rule
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <div
                key={rule.id || index}
                className="p-3.5 rounded-xl border border-border/70 hover:border-border bg-background/50 transition-all space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="flex items-center justify-center w-5 h-5 rounded-md bg-muted text-muted-foreground text-[10px] font-bold shrink-0">
                      {index + 1}
                    </span>
                    <Input
                      value={rule.title}
                      onChange={(e) => handleRuleChange(index, "title", e.target.value)}
                      placeholder="Rule Title (e.g. Be respectful and constructive)"
                      className="h-8 text-xs font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={(checked) => handleRuleChange(index, "isActive", checked)}
                        className="scale-75"
                      />
                      <span className="text-[11px] font-medium text-muted-foreground">
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
                    onChange={(e) => handleRuleChange(index, "description", e.target.value)}
                    placeholder="Rule details or specific examples (optional)..."
                    rows={2}
                    className="text-xs resize-none"
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs border-dashed text-muted-foreground hover:text-foreground gap-1.5 mt-2"
              onClick={handleAddRule}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Another Rule
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
