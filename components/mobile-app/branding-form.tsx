import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, Image as ImageIcon } from "lucide-react";

interface BrandingFormProps {
  platform: "android" | "ios";
}

export function BrandingForm({ platform }: BrandingFormProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h4 className="text-lg font-medium border-b pb-2">Brand Colors</h4>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-3">
                <Input
                  id="primaryColor"
                  type="color"
                  className="w-12 h-12 p-1 cursor-pointer"
                  defaultValue="#6366f1"
                />
                <Input
                  type="text"
                  className="flex-1"
                  defaultValue="#6366f1"
                  readOnly
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-3">
                <Input
                  id="secondaryColor"
                  type="color"
                  className="w-12 h-12 p-1 cursor-pointer"
                  defaultValue="#a855f7"
                />
                <Input
                  type="text"
                  className="flex-1"
                  defaultValue="#a855f7"
                  readOnly
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex gap-3">
                <Input
                  id="accentColor"
                  type="color"
                  className="w-12 h-12 p-1 cursor-pointer"
                  defaultValue="#ec4899"
                />
                <Input
                  type="text"
                  className="flex-1"
                  defaultValue="#ec4899"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-medium border-b pb-2">App Assets</h4>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>App Icon</Label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                <UploadCloud className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Click to upload icon</span>
                <span className="text-xs">Recommended size: 1024x1024px</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Splash Screen Background</Label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                <UploadCloud className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Click to upload splash</span>
                <span className="text-xs">PNG or JPG, up to 5MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t">
        <h4 className="text-lg font-medium mb-4">Live Preview</h4>
        <div className="bg-muted rounded-xl p-8 flex items-center justify-center">
          {/* Mock Phone Preview */}
          <div className="w-[280px] h-[580px] bg-background rounded-[40px] shadow-2xl border-[8px] border-slate-800 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-3xl mx-16 z-10" />
            
            {/* Mock Splash Screen */}
            <div className="flex-1 bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex flex-col items-center justify-center text-white relative">
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-6 shadow-lg border border-white/30">
                <ImageIcon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Your App</h2>
              
              <div className="absolute bottom-12 inset-x-0 flex justify-center">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
