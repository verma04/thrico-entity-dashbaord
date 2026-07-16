"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, PlaySquare } from "lucide-react";
import { GooglePlayWizard, type GooglePlayConnection } from "@/components/mobile-app/android/google-play-wizard";

export default function GooglePlayPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [googlePlayConnection, setGooglePlayConnection] = useState<GooglePlayConnection | null>(null);

  return (
    <div className="space-y-6">
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
              <p className="text-sm text-green-700/80 dark:text-green-400/80 mt-1">
                Your Google Play Developer account is configured correctly.
              </p>
            </div>
          </div>
        </div>
      )}

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
