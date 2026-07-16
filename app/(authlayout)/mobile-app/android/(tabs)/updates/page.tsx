"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

export default function UpdatesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><RefreshCw className="w-5 h-5" /> Recent Updates</CardTitle>
        <CardDescription>Activity log of updates made to the Android app</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border border-dashed rounded-lg">
          <RefreshCw className="w-12 h-12 mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No recent activity</h3>
          <p>Updates, configuration changes, and store listing modifications will be logged here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
