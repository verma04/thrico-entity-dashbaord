"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function ErrorsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500" /> Errors & Crash Reports</CardTitle>
        <CardDescription>Monitor stability issues and crashes from Android users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg bg-red-50/50">
          <AlertCircle className="w-12 h-12 mb-4 text-red-300" />
          <h3 className="text-lg font-medium text-foreground">All systems go</h3>
          <p className="text-muted-foreground mb-4">No critical errors reported in the latest version.</p>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">Contact Support Thrico</Button>
        </div>
      </CardContent>
    </Card>
  );
}
