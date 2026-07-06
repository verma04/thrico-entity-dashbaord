"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2, Circle, Settings, Smartphone, History, AlertCircle, RefreshCw, UploadCloud, PlaySquare } from "lucide-react";
import Link from "next/link";
import { GooglePlayWizard, type GooglePlayConnection } from "@/components/mobile-app/android/google-play-wizard";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AndroidOverviewPage() {
  const isSetupComplete = false;
  const setupProgress = 20;
  
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [googlePlayConnection, setGooglePlayConnection] = useState<GooglePlayConnection | null>(null);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <PageHeader 
        title="Android App Management" 
        description="Manage your custom Android application for the Google Play Store." 
        icon={Smartphone}
      />

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-4 md:grid-cols-7 lg:w-[750px]">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="google-play">Google Play</TabsTrigger>
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
        </TabsContent>

        <TabsContent value="google-play" className="space-y-6">
          {!googlePlayConnection ? (
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Google Play Console</CardTitle>
                <CardDescription>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                    <AlertCircle className="w-3.5 h-3.5" /> Not Connected
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <PlaySquare className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <p className="text-muted-foreground">
                    Connect your Google Play Developer account to publish Android applications.
                  </p>
                  <p className="text-sm font-medium">Estimated setup time: 10–15 Minutes</p>
                </div>
                <Button size="lg" onClick={() => setIsWizardOpen(true)}>
                  Connect Google Play
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Google Play Console</CardTitle>
                  <CardDescription>Manage your store connection settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Connection</p>
                        <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setGooglePlayConnection(null)}>
                      Disconnect
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Developer</p>
                        <p className="font-medium">{googlePlayConnection.developerName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Package</p>
                        <p className="font-medium text-muted-foreground">{googlePlayConnection.packageName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Application</p>
                        <p className="font-medium">{googlePlayConnection.applicationName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Permission</p>
                        <p className="font-medium text-green-600">Verified</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Last Verified</p>
                        <p className="font-medium">{googlePlayConnection.lastVerified}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t flex justify-end">
                    <Button variant="secondary">Verify Again</Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="p-4 border border-green-200 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300">Ready for Android Publishing</h4>
                  <p className="text-sm text-green-700/80 dark:text-green-400/80 mt-1">Your Google Play Developer account is configured correctly.</p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
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
        </TabsContent>

        <TabsContent value="errors">
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
        </TabsContent>

        <TabsContent value="updates">
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
        </TabsContent>

        <TabsContent value="publish">
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
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Android Settings</CardTitle>
              <CardDescription>Configure core Android app properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your Android configurations by launching the setup wizard.
                </p>
                <Link href="/mobile-app/android/setup">
                  <Button variant="outline">Open Settings Wizard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      <GooglePlayWizard 
        open={isWizardOpen} 
        onOpenChange={setIsWizardOpen}
        onComplete={(connection) => {
          setGooglePlayConnection(connection);
          setIsWizardOpen(false);
        }}
      />
    </div>
  );
}
