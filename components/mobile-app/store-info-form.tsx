import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface StoreInfoFormProps {
  platform: "android" | "ios";
}

export function StoreInfoForm({ platform }: StoreInfoFormProps) {
  const storeName = platform === "android" ? "Google Play Store" : "Apple App Store";
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg font-medium">{storeName} Listing</h4>
            <p className="text-sm text-muted-foreground">
              This information will be visible to users when they view your app in the store.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="appTitle">App Title (Max 30 characters)</Label>
              <Input id="appTitle" placeholder="e.g. Community Hub" maxLength={30} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="shortDesc">Short Description (Max 80 characters)</Label>
              <Input id="shortDesc" placeholder="A brief summary of your app..." maxLength={80} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fullDesc">Full Description</Label>
              <Textarea 
                id="fullDesc" 
                placeholder="Describe your app's features in detail..." 
                className="min-h-[150px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="keywords">Keywords (Comma separated)</Label>
              <Input id="keywords" placeholder="community, social, networking" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg font-medium">Developer Information</h4>
            <p className="text-sm text-muted-foreground">
              Contact and legal information required by the store.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="category">App Category</Label>
              <select 
                id="category" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a category</option>
                <option value="social">Social Networking</option>
                <option value="education">Education</option>
                <option value="business">Business</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="copyright">Copyright Text</Label>
              <Input id="copyright" placeholder={`© ${new Date().getFullYear()} Your Organization`} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="supportUrl">Support URL</Label>
              <Input id="supportUrl" type="url" placeholder="https://yourwebsite.com/support" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="marketingUrl">Marketing URL (Optional)</Label>
              <Input id="marketingUrl" type="url" placeholder="https://yourwebsite.com" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
