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
          <div className="space-y-2">
            <h4 className="text-lg font-medium">{storeName} Listing</h4>
            <p className="text-sm text-muted-foreground">
              This information will be visible to users when they view your app in the store.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="appTitle">App Title (Max 30 characters) *</Label>
              <Input 
                id="appTitle" 
                name="appTitle"
                placeholder="e.g. Community Hub" 
                maxLength={30} 
                value={values.appTitle}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.appTitle && errors.appTitle && <p className="text-sm text-red-500">{errors.appTitle}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="shortDescription">Short Description (Max 80 characters) *</Label>
              <Input 
                id="shortDescription" 
                name="shortDescription"
                placeholder="A brief summary of your app..." 
                maxLength={80} 
                value={values.shortDescription}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.shortDescription && errors.shortDescription && <p className="text-sm text-red-500">{errors.shortDescription}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fullDescription">Full Description (Max 4000 characters) *</Label>
              <Textarea 
                id="fullDescription" 
                name="fullDescription"
                placeholder="Describe your app's features in detail..." 
                className="min-h-[150px]"
                maxLength={4000}
                value={values.fullDescription}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.fullDescription && errors.fullDescription && <p className="text-sm text-red-500">{errors.fullDescription}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="keywords">Keywords (Comma separated)</Label>
              <Input 
                id="keywords" 
                name="keywords"
                placeholder="community, social, networking" 
                value={values.keywords}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.keywords && errors.keywords && <p className="text-sm text-red-500">{errors.keywords}</p>}
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
              <Label htmlFor="copyrightText">Copyright Text *</Label>
              <Input 
                id="copyrightText" 
                name="copyrightText"
                placeholder={`© ${new Date().getFullYear()} Your Organization`} 
                value={values.copyrightText}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.copyrightText && errors.copyrightText && <p className="text-sm text-red-500">{errors.copyrightText}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="supportUrl">Support URL *</Label>
              <Input 
                id="supportUrl" 
                name="supportUrl"
                type="url" 
                placeholder="https://yourwebsite.com/support" 
                value={values.supportUrl}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.supportUrl && errors.supportUrl && <p className="text-sm text-red-500">{errors.supportUrl}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="marketingUrl">Marketing URL (Optional)</Label>
              <Input 
                id="marketingUrl" 
                name="marketingUrl"
                type="url" 
                placeholder="https://yourwebsite.com" 
                value={values.marketingUrl}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.marketingUrl && errors.marketingUrl && <p className="text-sm text-red-500">{errors.marketingUrl}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
