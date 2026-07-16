import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon } from "lucide-react";
import { FileUploadBox } from "./file-upload-box";
import { getPreferredMediaUrl } from "@/lib/media-utils";

interface BrandingFormProps {
  platform: "android" | "ios";
  values: any;
  errors: any;
  touched: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  getFieldProps: (nameOrOptions: any) => any;
  initialBranding?: any;
}

export function BrandingForm({ 
  platform,
  values,
  errors,
  touched,
  setFieldValue,
  getFieldProps,
  initialBranding = {}
}: BrandingFormProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h4 className="text-lg font-medium border-b pb-2">Brand Colors</h4>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="primaryColor">Primary Color *</Label>
              <div className="flex gap-3">
                <Input
                  id="primaryColor"
                  type="color"
                  className="w-12 h-12 p-1 cursor-pointer"
                  {...getFieldProps("primaryColor")}
                />
                <Input
                  type="text"
                  className="flex-1"
                  {...getFieldProps("primaryColor")}
                  readOnly
                />
              </div>
              {touched.primaryColor && errors.primaryColor && <p className="text-sm text-red-500">{errors.primaryColor}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="secondaryColor">Secondary Color *</Label>
              <div className="flex gap-3">
                <Input
                  id="secondaryColor"
                  type="color"
                  className="w-12 h-12 p-1 cursor-pointer"
                  {...getFieldProps("secondaryColor")}
                />
                <Input
                  type="text"
                  className="flex-1"
                  {...getFieldProps("secondaryColor")}
                  readOnly
                />
              </div>
              {touched.secondaryColor && errors.secondaryColor && <p className="text-sm text-red-500">{errors.secondaryColor}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="accentColor">Accent Color *</Label>
              <div className="flex gap-3">
                <Input
                  id="accentColor"
                  type="color"
                  className="w-12 h-12 p-1 cursor-pointer"
                  {...getFieldProps("accentColor")}
                />
                <Input
                  type="text"
                  className="flex-1"
                  {...getFieldProps("accentColor")}
                  readOnly
                />
              </div>
              {touched.accentColor && errors.accentColor && <p className="text-sm text-red-500">{errors.accentColor}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-medium border-b pb-2">App Assets</h4>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>App Icon {!initialBranding.appIconPath && "*"}</Label>
              <FileUploadBox 
                label="Click to upload icon" 
                desc="Recommended size: 1024x1024px" 
                accept="image/png,image/jpeg" 
                selectedFile={values.appIcon} 
                onFileSelect={(f: File) => setFieldValue("appIcon", f)} 
                error={touched.appIcon && errors.appIcon}
                existingPath={initialBranding.appIconPath}
                showPreview={true}
                recommendedWidth={512}
                recommendedHeight={512}
                aspectRatio={1}
                lockDimensions={true}
              />
            </div>

            <div className="grid gap-2">
              <Label>Splash Screen Background {!initialBranding.splashScreenPath && "*"}</Label>
              <FileUploadBox 
                label="Click to upload splash" 
                desc="PNG or JPG, up to 5MB" 
                accept="image/png,image/jpeg" 
                selectedFile={values.splashScreen} 
                onFileSelect={(f: File) => setFieldValue("splashScreen", f)} 
                error={touched.splashScreen && errors.splashScreen}
                existingPath={initialBranding.splashScreenPath}
                showPreview={true}
                recommendedWidth={1080}
                recommendedHeight={1920}
                aspectRatio={9 / 16}
                lockDimensions={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t">
        <h4 className="text-lg font-medium mb-4">Live Preview</h4>
        <div className="bg-muted rounded-xl p-8 flex flex-col md:flex-row items-center justify-center gap-16">
          
          {/* App Icon Preview */}
          <div className="flex flex-col items-center gap-2">
            <h5 className="font-medium text-sm text-muted-foreground mb-4">App Icon</h5>
            <div className="w-24 h-24 bg-white rounded-[22px] shadow-xl flex items-center justify-center overflow-hidden border border-border/50">
              {values.appIcon ? (
                <img src={URL.createObjectURL(values.appIcon)} className="w-full h-full object-cover" />
              ) : initialBranding.appIconPath ? (
                <img src={getPreferredMediaUrl(initialBranding.appIconPath)} className="w-full h-full object-cover" />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-white"
                  style={{ background: values.primaryColor || '#6366f1' }}
                >
                  <ImageIcon className="w-10 h-10" />
                </div>
              )}
            </div>
            <span className="text-sm font-medium mt-2">Your App</span>
          </div>

          {/* Mock Phone Preview */}
          <div className="flex flex-col items-center gap-4">
            <h5 className="font-medium text-sm text-muted-foreground">Splash Screen</h5>
            <div className="w-[280px] h-[580px] bg-background rounded-[40px] shadow-2xl border-[8px] border-slate-800 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-3xl mx-16 z-10" />
              
              {/* Mock Splash Screen */}
              <div 
                className="flex-1 flex flex-col items-center justify-center text-white relative bg-cover bg-center"
                style={{
                  backgroundImage: (values.splashScreen || initialBranding.splashScreenPath)
                    ? `url(${values.splashScreen ? URL.createObjectURL(values.splashScreen) : getPreferredMediaUrl(initialBranding.splashScreenPath)})`
                    : `linear-gradient(to bottom right, ${values.primaryColor || '#6366f1'}, ${values.secondaryColor || '#a855f7'})`
                }}
              >
                {/* Only show fallback logo if no custom splash image is uploaded, as custom images usually have the logo baked in */}
                {!(values.splashScreen || initialBranding.splashScreenPath) && (
                  <>
                    <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-6 shadow-lg border border-white/30 overflow-hidden">
                      {values.appIcon ? (
                        <img src={URL.createObjectURL(values.appIcon)} className="w-full h-full object-cover" />
                      ) : initialBranding.appIconPath ? (
                        <img src={getPreferredMediaUrl(initialBranding.appIconPath)} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-white" />
                      )}
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">Your App</h2>
                  </>
                )}
                
                <div className="absolute bottom-12 inset-x-0 flex justify-center">
                  <div 
                    className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" 
                    style={{ borderTopColor: values.accentColor || '#ec4899' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
