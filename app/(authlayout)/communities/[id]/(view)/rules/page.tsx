"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { GET_COMMUNITY_BY_ID, UPDATE_COMMUNITY_RULES } from "@/graphql/quries/group/approval";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldAlert, Plus, Trash2, GripVertical, CheckCircle2 } from "lucide-react";

interface CommunityRule {
  id?: string;
  title: string;
  description: string;
  isActive: boolean;
  order: number;
}

export default function CommunityRulesSettings() {
  const params = useParams();
  const id = params?.id as string;
  const { toast } = useToast();

  const { data, loading: fetchingCommunity } = useQuery(GET_COMMUNITY_BY_ID, {
    variables: {
      input: {
        communityId: id,
      },
    },
    skip: !id,
  });

  const [updateCommunityRules, { loading: updating }] = useMutation(UPDATE_COMMUNITY_RULES, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Community rules updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update community rules",
        variant: "destructive",
      });
    },
  });

  const [rules, setRules] = useState<CommunityRule[]>([]);

  useEffect(() => {
    if (data?.getCommunityById?.rules) {
      // Create a clean copy without __typename
      const cleanRules = data.getCommunityById.rules.map((rule: any) => ({
        id: rule.id,
        title: rule.title || "",
        description: rule.description || "",
        isActive: rule.isActive ?? true,
        order: rule.order ?? 0,
      }));
      // Sort by order
      cleanRules.sort((a: any, b: any) => a.order - b.order);
      setRules(cleanRules);
    } else if (data?.getCommunityById && !data.getCommunityById.rules) {
      setRules([]);
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
  };

  const handleRemoveRule = (index: number) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    // Reassign order
    newRules.forEach((rule, idx) => {
      rule.order = idx + 1;
    });
    setRules(newRules);
  };

  const handleRuleChange = (index: number, field: keyof CommunityRule, value: any) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const handleSave = () => {
    // Validate rules
    const hasEmptyTitles = rules.some((rule) => !rule.title.trim());
    if (hasEmptyTitles) {
      toast({
        title: "Validation Error",
        description: "All rules must have a title.",
        variant: "destructive",
      });
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
      <div className="max-w-4xl mx-auto space-y-8 p-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 overflow-hidden bg-gradient-to-br from-card to-muted/10 rounded-2xl">
        <CardHeader className="pb-6 pt-8 px-8 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-500/10 rounded-xl">
                <ShieldAlert className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Community Rules
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground mt-1">
                  Define the guidelines and code of conduct for your community members.
                </CardDescription>
              </div>
            </div>
            <Button onClick={handleSave} disabled={updating} className="rounded-xl px-6">
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div
                key={rule.id || index}
                className="flex gap-4 p-5 rounded-2xl border border-border/60 bg-card shadow-sm group hover:border-primary/30 transition-colors relative"
              >
                <div className="mt-2 flex-shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground cursor-grab">
                  <GripVertical className="h-5 w-5" />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Rule Title
                      </Label>
                      <Input
                        value={rule.title}
                        onChange={(e) => handleRuleChange(index, "title", e.target.value)}
                        placeholder="e.g. Be Respectful"
                        className="font-medium"
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={(checked) => handleRuleChange(index, "isActive", checked)}
                        />
                        <Label className="text-sm font-medium">Active</Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveRule(index)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Description (Optional)
                    </Label>
                    <Textarea
                      value={rule.description}
                      onChange={(e) => handleRuleChange(index, "description", e.target.value)}
                      placeholder="Add more details about this rule..."
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full rounded-2xl border-dashed border-2 py-8 hover:bg-muted/50 transition-colors"
            onClick={handleAddRule}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Rule
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
