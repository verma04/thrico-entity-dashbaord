import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface StoreInfoFormProps {
  platform: "android" | "ios";
  values: any;
  errors: any;
  touched: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
}

export function StoreInfoForm({ platform, values, errors, touched, handleChange, handleBlur }: StoreInfoFormProps) {
  const storeName = platform === "android" ? "Google Play Store" : "Apple App Store";
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{storeName} Listing</h4>
            <p className="text-xs text-muted-foreground">
              This information will be visible to users when they view your app in the store.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="appTitle" className="text-xs font-medium">App Title (Max 30 characters) *</Label>
              <Input 
                id="appTitle" 
                name="appTitle"
                placeholder="e.g. Community Hub" 
                maxLength={30} 
                className="h-9 text-xs"
                value={values.appTitle}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.appTitle && errors.appTitle && <p className="text-xs text-red-500">{errors.appTitle}</p>}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="shortDescription" className="text-xs font-medium">Short Description (Max 80 characters) *</Label>
              <Input 
                id="shortDescription" 
                name="shortDescription"
                placeholder="A brief summary of your app..." 
                maxLength={80} 
                className="h-9 text-xs"
                value={values.shortDescription}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.shortDescription && errors.shortDescription && <p className="text-xs text-red-500">{errors.shortDescription}</p>}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="fullDescription" className="text-xs font-medium">Full Description (Max 4000 characters) *</Label>
              <Textarea 
                id="fullDescription" 
                name="fullDescription"
                placeholder="Describe your app's features in detail..." 
                className="min-h-[120px] text-xs resize-none"
                maxLength={4000}
                value={values.fullDescription}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.fullDescription && errors.fullDescription && <p className="text-xs text-red-500">{errors.fullDescription}</p>}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="keywords" className="text-xs font-medium">Keywords (Comma separated)</Label>
              <Input 
                id="keywords" 
                name="keywords"
                placeholder="community, social, networking" 
                className="h-9 text-xs"
                value={values.keywords}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.keywords && errors.keywords && <p className="text-xs text-red-500">{errors.keywords}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Developer Information</h4>
            <p className="text-xs text-muted-foreground">
              Contact and legal information required by the store.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="copyrightText" className="text-xs font-medium">Copyright Text *</Label>
              <Input 
                id="copyrightText" 
                name="copyrightText"
                placeholder={`© ${new Date().getFullYear()} Your Organization`} 
                className="h-9 text-xs"
                value={values.copyrightText}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.copyrightText && errors.copyrightText && <p className="text-xs text-red-500">{errors.copyrightText}</p>}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="supportUrl" className="text-xs font-medium">Support URL *</Label>
              <Input 
                id="supportUrl" 
                name="supportUrl"
                type="url" 
                placeholder="https://yourwebsite.com/support" 
                className="h-9 text-xs"
                value={values.supportUrl}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.supportUrl && errors.supportUrl && <p className="text-xs text-red-500">{errors.supportUrl}</p>}
            </div>
            
            <div className="grid gap-1.5">
              <Label htmlFor="marketingUrl" className="text-xs font-medium">Marketing URL (Optional)</Label>
              <Input 
                id="marketingUrl" 
                name="marketingUrl"
                type="url" 
                placeholder="https://yourwebsite.com" 
                className="h-9 text-xs"
                value={values.marketingUrl}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.marketingUrl && errors.marketingUrl && <p className="text-xs text-red-500">{errors.marketingUrl}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
