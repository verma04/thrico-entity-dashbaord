"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2, Circle, Settings } from "lucide-react";
import Link from "next/link";
import { Smartphone } from "lucide-react";

export default function AndroidDashboardPage() {
  const isSetupComplete = false;
  const setupProgress = 20;

  return (
    <div className="space-y-6">
      {!isSetupComplete && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-primary/10 p-4 rounded-full text-primary">
              <Smartphone className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Continue Android Setup</h3>
              <p className="text-muted-foreground mb-4">
                Your Android application is almost ready. Complete the remaining steps to publish your app to the Google Play Store.
              </p>
              <div className="flex items-center gap-4 mb-2">
                <Progress value={setupProgress} className="flex-1" />
                <span className="text-sm font-medium">{setupProgress}%</span>
              </div>
            </div>
            <div>
              <Link href="/mobile-app/android/setup">
                <Button className="w-full md:w-auto" size="lg">
                  Resume Setup <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Setup Status</CardTitle>
            <CardDescription>Track your progress towards publishing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Application Information</span>
                </div>
                <span className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded">Complete</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Circle className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Branding & Assets</span>
                </div>
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">Pending</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Circle className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Push Notifications</span>
                </div>
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">Pending</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Circle className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Store Information</span>
                </div>
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled>
                View Build History
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                Activity Log
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                App Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Check our documentation on how to set up your Google Play Developer account and configure your app.
              </p>
              <Button variant="link" className="px-0 h-auto">
                Read Android Guide <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
