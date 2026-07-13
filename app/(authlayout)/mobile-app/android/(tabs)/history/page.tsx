"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { History } from "lucide-react";

export default function HistoryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><History className="w-5 h-5" /> Build History</CardTitle>
        <CardDescription>View all past builds and releases for Android</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border border-dashed rounded-lg">
          <History className="w-12 h-12 mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No builds yet</h3>
          <p>Once you publish your app, your build history will appear here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
