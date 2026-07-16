"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import Link from "next/link";

export default function PublishPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><UploadCloud className="w-5 h-5" /> Publish to Play Store</CardTitle>
        <CardDescription>Submit a new version of your Android application</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg">
          <UploadCloud className="w-12 h-12 mb-4 text-primary opacity-80" />
          <h3 className="text-lg font-medium text-foreground mb-2">Ready to publish?</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Make sure your application information, branding, and store listings are up to date before submitting a new version.
          </p>
          <Link href="/mobile-app/android/setup">
            <Button>Start Publish Wizard</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
