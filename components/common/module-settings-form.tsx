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

export interface SettingField {
  key: string;
  label: string;
  description: string;
  type?: "switch" | "text" | "number";
}

interface ModuleSettingsFormProps<T extends Record<string, any>> {
  title?: string;
  description?: string;
  data?: T;
  fields: SettingField[];
  onSave: (data: T) => void;
  isLoading?: boolean;
  defaultValues?: Partial<T>;
}

export function ModuleSettingsForm<T extends Record<string, any>>({
  title = "Settings",
  description = "Configure module settings",
  data,
  fields,
  onSave,
  isLoading,
  defaultValues = {},
}: ModuleSettingsFormProps<T>) {
  const [settings, setSettings] = useState<T>((data || defaultValues) as T);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (data) {
      setSettings(data);
      setHasChanged(false);
    }
  }, [data]);

  const handleToggle = (key: string) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    setHasChanged(
      JSON.stringify(newSettings) !== JSON.stringify(data || defaultValues)
    );
  };

  const handleChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setHasChanged(
      JSON.stringify(newSettings) !== JSON.stringify(data || defaultValues)
    );
  };

  const handleSave = () => {
    onSave(settings);
    setHasChanged(false);
  };

  const renderField = (field: SettingField) => {
    const fieldType = field.type || "switch";

    switch (fieldType) {
      case "switch":
        return (
          <div key={field.key} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor={field.key}>{field.label}</Label>
              <p className="text-sm text-muted-foreground">
                {field.description}
              </p>
            </div>
            <Switch
              id={field.key}
              checked={settings[field.key] || false}
              onCheckedChange={() => handleToggle(field.key)}
            />
          </div>
        );

      case "text":
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <p className="text-sm text-muted-foreground">{field.description}</p>
            <input
              id={field.key}
              type="text"
              value={settings[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        );

      case "number":
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <p className="text-sm text-muted-foreground">{field.description}</p>
            <input
              id={field.key}
              type="number"
              value={settings[field.key] || 0}
              onChange={(e) => handleChange(field.key, Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
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
          {fields.map((field) => renderField(field))}
        </div>
      </CardContent>
    </Card>
  );
}
