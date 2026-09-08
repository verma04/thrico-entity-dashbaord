"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Compass } from "lucide-react";
import { PremiumLock } from "./premium-lock";
import { SOCIAL_PLATFORMS } from "./constants";
import { SiteSettings } from "@/store/useWebsiteBuilderStore";

interface SocialTabProps {
  isPremium: boolean;
  siteSettings: SiteSettings;
  onUpdateSocial: (platformKey: string, value: string) => void;
}

export function SocialTab({
  isPremium,
  siteSettings,
  onUpdateSocial,
}: SocialTabProps) {
  if (!isPremium) {
    return (
      <PremiumLock
        title="Social Bridges"
        icon={Share2}
        description="Connect your community footprint across decentralized networks. Amplify reach with verified external profile links."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        <Card className="border-border bg-card shadow-2xs overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4 border-b border-border/60">
            <div className="flex items-center gap-2 mb-1">
              <Share2 className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold text-foreground">
                Social Connection Links
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Configure public social profiles displayed on your website navbar and footer.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SOCIAL_PLATFORMS.map((platform) => {
                const currentVal =
                  (siteSettings?.socialLinks as any)?.[platform.key] || "";
                return (
                  <div key={platform.key} className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      {platform.label}
                    </Label>
                    <Input
                      placeholder={platform.placeholder}
                      value={currentVal}
                      onChange={(e) => onUpdateSocial(platform.key, e.target.value)}
                      className="h-9 text-xs bg-background border-border"
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guidance Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="border-border bg-card shadow-2xs">
          <CardHeader className="pb-3 border-b border-border/60 bg-muted/30">
            <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Compass className="h-3.5 w-3.5 text-primary" />
              Social Graph Tip
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2 text-xs text-muted-foreground">
            <p>
              Social URLs automatically link into OpenGraph and Twitter card metadata for
              rich embeds when members share pages.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
