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
          <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold mb-1">Continue Android Setup</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Your Android application is almost ready. Complete the remaining steps to publish your app to the Google Play Store.
              </p>
              <div className="flex items-center gap-3 mb-1">
                <Progress value={setupProgress} className="flex-1 h-1.5" />
                <span className="text-xs font-medium">{setupProgress}%</span>
              </div>
            </div>
            <div>
              <Link href="/mobile-app/android/setup">
                <Button className="w-full md:w-auto h-9 text-xs font-medium">
                  Resume Setup <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Setup Status</CardTitle>
            <CardDescription className="text-xs">Track your progress towards publishing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-medium">Application Information</span>
                </div>
                <span className="text-[11px] text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded">Complete</span>
              </div>

              <div className="flex items-center justify-between p-2.5 border rounded-lg">
                <div className="flex items-center gap-2.5">
                  <Circle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium">Branding & Assets</span>
                </div>
                <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded">Pending</span>
              </div>

              <div className="flex items-center justify-between p-2.5 border rounded-lg">
                <div className="flex items-center gap-2.5">
                  <Circle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium">Push Notifications</span>
                </div>
                <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded">Pending</span>
              </div>

              <div className="flex items-center justify-between p-2.5 border rounded-lg">
                <div className="flex items-center gap-2.5">
                  <Circle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium">Store Information</span>
                </div>
                <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Settings className="w-4 h-4" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8" disabled>
                View Build History
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8" disabled>
                Activity Log
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8" disabled>
                App Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                Check our documentation on how to set up your Google Play Developer account and configure your app.
              </p>
              <Button variant="link" className="px-0 h-auto text-xs">
                Read Android Guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
