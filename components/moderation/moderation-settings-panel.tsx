"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  useGetModerationSettings,
  useUpdateModerationSettings,
} from "@/graphql/moderation/hooks";
import { toast } from "sonner";

export function ModerationSettingsPanel() {
  const { data, loading, error } = useGetModerationSettings();
  const [updateSettings] = useUpdateModerationSettings();

  const [settings, setSettings] = useState({
    autoModerationEnabled: true,
    bannedWordsAction: "FLAG",
    blockedLinksAction: "BLOCK",
    spamDetectionEnabled: true,
    spamThreshold: 80,
    autoFlagThreshold: 3,
    autoHideThreshold: 5,
  });

  // Sync settings with fetched data
  useEffect(() => {
    if (data?.getModerationSettings) {
      const { id, __typename, ...rest } = data.getModerationSettings;
      setSettings(rest as any);
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateSettings({
        variables: {
          input: settings,
        },
      });
      toast.success("Moderation settings updated");
    } catch (err) {
      toast.error("Failed to update settings");
    }
  };

  if (error) return <div>Error loading moderation settings.</div>;
  if (loading && !data) return <div>Loading settings...</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Moderation Settings
          </h2>
          <p className="text-muted-foreground">
            Configure how the automated moderation system behaves
          </p>
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <div className="grid gap-6">
        {/* General Auto-Moderation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Automated Moderation</CardTitle>
                <CardDescription>
                  Enable or disable all automated moderation processes
                </CardDescription>
              </div>
              <Switch
                checked={settings.autoModerationEnabled}
                onCheckedChange={(c) =>
                  setSettings({ ...settings, autoModerationEnabled: c })
                }
              />
            </div>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Content Filtering Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Filtering</CardTitle>
              <CardDescription>
                Default actions for filter matches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Banned Words Action</Label>
                <Select
                  value={settings.bannedWordsAction}
                  onValueChange={(v) =>
                    setSettings({ ...settings, bannedWordsAction: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FLAG">Flag for Review</SelectItem>
                    <SelectItem value="BLOCK">Block Immediately</SelectItem>
                    <SelectItem value="REPLACE">
                      Replace with asterisks (***)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Blocked Links Action</Label>
                <Select
                  value={settings.blockedLinksAction}
                  onValueChange={(v) =>
                    setSettings({ ...settings, blockedLinksAction: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BLOCK">Block Immediately</SelectItem>
                    <SelectItem value="WARN">Warn User</SelectItem>
                    <SelectItem value="FLAG">Flag for Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Spam Detection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Spam Detection</CardTitle>
              <CardDescription>
                Configure AI-driven spam filters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="flex flex-col gap-1">
                  <span>AI Spam Filter</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Use machine learning to detect spam patterns
                  </span>
                </Label>
                <Switch
                  checked={settings.spamDetectionEnabled}
                  onCheckedChange={(c) =>
                    setSettings({ ...settings, spamDetectionEnabled: c })
                  }
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <Label>Sensitivity Threshold</Label>
                  <span className="font-medium text-primary">
                    {settings.spamThreshold}%
                  </span>
                </div>
                <Slider
                  value={[settings.spamThreshold]}
                  max={100}
                  step={1}
                  onValueChange={([v]) =>
                    setSettings({ ...settings, spamThreshold: v })
                  }
                />
                <p className="text-[10px] text-muted-foreground">
                  Lower values are more aggressive, higher values are more
                  lenient.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Reporting Thresholds */}
        <Card>
          <CardHeader>
            <CardTitle>Community Reporting</CardTitle>
            <CardDescription>
              Automated actions based on user reports
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Auto-Flag Threshold</Label>
                <Input
                  type="number"
                  value={settings.autoFlagThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoFlagThreshold: parseInt(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Number of reports before content is automatically flagged for
                  review.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Auto-Hide Threshold</Label>
                <Input
                  type="number"
                  value={settings.autoHideThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoHideThreshold: parseInt(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Number of reports before content is automatically hidden from
                  public view.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
