"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SetupWizard, WizardStep } from "@/components/mobile-app/setup-wizard";
import { BrandingForm } from "@/components/mobile-app/branding-form";
import { StoreInfoForm } from "@/components/mobile-app/store-info-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UploadCloud } from "lucide-react";

export default function AndroidSetupPage() {
  const router = useRouter();

  const handleComplete = () => {
    // Navigate back to overview when complete
    router.push("/mobile-app/android");
  };

  const handleCancel = () => {
    router.push("/mobile-app/android");
  };

  const steps: WizardStep[] = [
    {
      id: "app-info",
      title: "Application Information",
      description: "Basic details about your application",
      component: (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="appName">Application Name</Label>
              <Input id="appName" placeholder="e.g. My Community" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shortName">Short Name</Label>
              <Input id="shortName" placeholder="e.g. Community" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input id="orgName" placeholder="e.g. Acme Corp" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" type="url" placeholder="https://" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" type="email" placeholder="support@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="privacyPolicy">Privacy Policy URL</Label>
              <Input id="privacyPolicy" type="url" placeholder="https://" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "branding",
      title: "Branding",
      description: "Customize colors and assets",
      component: <BrandingForm platform="android" />,
    },
    {
      id: "push-notifications",
      title: "Push Notifications",
      description: "Configure Firebase for Android",
      component: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl">
          <div className="space-y-4">
            <Label className="text-base font-medium">Does your organization already use Firebase?</Label>
            <RadioGroup defaultValue="no" className="flex flex-col gap-3 mt-2">
              <div className="flex items-center space-x-2 border p-4 rounded-lg">
                <RadioGroupItem value="yes" id="fb-yes" />
                <Label htmlFor="fb-yes" className="font-normal cursor-pointer w-full">
                  Yes, we have our own Firebase project
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-lg">
                <RadioGroupItem value="no" id="fb-no" />
                <Label htmlFor="fb-no" className="font-normal cursor-pointer w-full">
                  No, guide me through setting it up
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2 mt-6">
            <Label>google-services.json</Label>
            <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
              <UploadCloud className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">Upload Android Configuration</span>
              <span className="text-xs">JSON file from Firebase</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "android-setup",
      title: "Android Setup",
      description: "Package name and signing credentials",
      component: (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="packageName">Package Name</Label>
            <Input id="packageName" placeholder="com.company.community" />
            <p className="text-xs text-muted-foreground mt-1">
              This is the unique identifier for your app on the Play Store. It cannot be changed later.
            </p>
          </div>

          <div className="grid gap-2 mt-4">
            <Label>Android Signing Key (Keystore)</Label>
            <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
              <UploadCloud className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">Upload Keystore File</span>
              <span className="text-xs">.jks or .keystore file</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "store-info",
      title: "Store Information",
      description: "Google Play Store listing details",
      component: <StoreInfoForm platform="android" />,
    },
    {
      id: "screenshots",
      title: "Screenshots",
      description: "Upload app preview images",
      component: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4">
            <h4 className="text-lg font-medium border-b pb-2">Android Phone Screenshots</h4>
            <p className="text-sm text-muted-foreground">Upload 2-8 screenshots. Recommended size: 1080x1920px.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[9/16] border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                  <UploadCloud className="w-6 h-6 mb-2" />
                  <span className="text-xs font-medium">Upload</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-medium border-b pb-2">Android Tablet Screenshots (Optional)</h4>
            <p className="text-sm text-muted-foreground">Upload up to 8 screenshots for 7-inch or 10-inch tablets.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="aspect-[4/3] border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                <UploadCloud className="w-6 h-6 mb-2" />
                <span className="text-xs font-medium">Upload</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "review",
      title: "Review & Publish",
      description: "Final check before building",
      component: (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xl font-medium">Ready to Build!</h3>
          <p className="text-muted-foreground">
            All required information for your Android application has been collected. Once you click "Complete Setup", we will begin generating your application build.
          </p>
          
          <div className="bg-muted p-6 rounded-lg space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span>Application Information</span>
              <span className="text-green-600 font-medium">✓ Complete</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>Branding</span>
              <span className="text-green-600 font-medium">✓ Complete</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>Android Setup</span>
              <span className="text-green-600 font-medium">✓ Complete</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Store Listing</span>
              <span className="text-green-600 font-medium">✓ Complete</span>
            </div>
          </div>
        </div>
      ),
    }
  ];

  return (
    <div className="p-4 md:p-6 pb-20">
      <SetupWizard 
        title="Android App Setup" 
        description="Follow these steps to configure your Android application for the Google Play Store."
        steps={steps}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
}
