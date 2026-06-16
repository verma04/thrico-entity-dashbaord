"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

import { useModuleStore } from "@/store/useModuleStore";

export default function ForumSettingsPage() {
  const singularName = useModuleStore((state) => state.forumSingularName);
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6" />
          {singularName} Settings
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Advanced configurations for this {singularName.toLowerCase()}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Additional settings will be available here soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No advanced settings currently available for {singularName.toLowerCase()}s.</p>
        </CardContent>
      </Card>
    </div>
  );
}
