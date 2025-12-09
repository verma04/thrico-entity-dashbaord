"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SettingsData {
  allowNewUser: boolean;
  autoApproveUser: boolean;
}

export function SettingsForm({
  data,
  onSave,
  isLoading,
}: {
  data?: SettingsData;
  onSave: (data: SettingsData) => void;
  isLoading?: boolean;
}) {
  const defaultData: SettingsData = {
    allowNewUser: true,
    autoApproveUser: false,
  };

  const [settings, setSettings] = useState<SettingsData>(data || defaultData);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (data) {
      setSettings(data);
      setHasChanged(false);
    }
  }, [data]);

  const handleToggle = (key: keyof SettingsData) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    setHasChanged(
      JSON.stringify(newSettings) !== JSON.stringify(data || defaultData)
    );
  };

  const handleSave = () => {
    onSave(settings);
    setHasChanged(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Configure system-wide settings for user management
            </CardDescription>
          </div>
          <Button
            onClick={handleSave}
            disabled={!hasChanged || isLoading}
            size="sm"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-approve">Auto Approve New Users</Label>
              <p className="text-sm text-muted-foreground">
                Automatically approve new user registrations
              </p>
            </div>
            <Switch
              id="auto-approve"
              checked={settings.autoApproveUser}
              onCheckedChange={() => handleToggle("autoApproveUser")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-new">Allow New User Registration</Label>
              <p className="text-sm text-muted-foreground">
                Turn off temporarily if you need to pause new user registrations
              </p>
            </div>
            <Switch
              id="allow-new"
              checked={settings.allowNewUser}
              onCheckedChange={() => handleToggle("allowNewUser")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
