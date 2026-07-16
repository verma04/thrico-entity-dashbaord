"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2, Circle, Settings, Apple, History, AlertCircle, RefreshCw, UploadCloud } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function IosOverviewPage() {
  const isSetupComplete = false;
  const setupProgress = 0;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <PageHeader 
        title="iOS App Management" 
        description="Manage your custom iOS application for the Apple App Store." 
        icon={Apple}
      />

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3 md:grid-cols-6 lg:w-[600px]">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="publish">Publish</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {!isSetupComplete && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="bg-primary/10 p-4 rounded-full text-primary">
                  <Apple className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Begin iOS Setup</h3>
                  <p className="text-muted-foreground mb-4">
                    Your iOS application setup hasn't started yet. Follow our guided wizard to prepare your app for the Apple App Store.
                  </p>
                  <div className="flex items-center gap-4 mb-2">
                    <Progress value={setupProgress} className="flex-1" />
                    <span className="text-sm font-medium">{setupProgress}%</span>
                  </div>
                </div>
                <div>
                  <Link href="/mobile-app/ios/setup">
                    <Button className="w-full md:w-auto" size="lg">
                      Start Setup <ArrowRight className="w-4 h-4 ml-2" />
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
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Circle className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Application Information</span>
                    </div>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">Pending</span>
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
                    Check our documentation on how to set up your Apple Developer account and configure your iOS app.
                  </p>
                  <Button variant="link" className="px-0 h-auto">
                    Read iOS Guide <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><History className="w-5 h-5" /> Build History</CardTitle>
              <CardDescription>View all past builds and releases for iOS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border border-dashed rounded-lg">
                <History className="w-12 h-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground">No builds yet</h3>
                <p>Once you publish your app, your build history will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500" /> Errors & Crash Reports</CardTitle>
              <CardDescription>Monitor stability issues and crashes from iOS users</CardDescription>
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
        </TabsContent>

        <TabsContent value="updates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><RefreshCw className="w-5 h-5" /> Recent Updates</CardTitle>
              <CardDescription>Activity log of updates made to the iOS app</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border border-dashed rounded-lg">
                <RefreshCw className="w-12 h-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground">No recent activity</h3>
                <p>Updates, configuration changes, and store listing modifications will be logged here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publish">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UploadCloud className="w-5 h-5" /> Publish to App Store</CardTitle>
              <CardDescription>Submit a new version of your iOS application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg">
                <UploadCloud className="w-12 h-12 mb-4 text-primary opacity-80" />
                <h3 className="text-lg font-medium text-foreground mb-2">Ready to publish?</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Make sure your application information, branding, and store listings are up to date before submitting a new version.
                </p>
                <Link href="/mobile-app/ios/setup">
                  <Button>Start Publish Wizard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> iOS Settings</CardTitle>
              <CardDescription>Configure core iOS app properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your iOS configurations by launching the setup wizard.
                </p>
                <Link href="/mobile-app/ios/setup">
                  <Button variant="outline">Open Settings Wizard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
