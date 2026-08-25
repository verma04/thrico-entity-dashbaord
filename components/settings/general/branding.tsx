"use client";

import React from "react";
import Image from "next/image";
import { useUploadEntityLogo } from "@/graphql/actions";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon, Globe, Sparkles, CheckCircle2 } from "lucide-react";
import { FaviconUpload } from "./favicon-upload";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";

export default function Branding({
  currentImage,
  onImageUpdate,
  faviconImage,
  onFaviconUpdate,
}: {
  currentImage: string;
  onImageUpdate: (url: string) => void;
  faviconImage: string;
  onFaviconUpdate: (url: string) => void;
}) {
  const { toast } = useToast();
  const [uploadEntityLogo] = useUploadEntityLogo({
    onCompleted: () => {},
    onError: () => {},
  });

  return (
    <PolarisFormLayout
      sidebar={
        <div className="space-y-4">
          {/* Live Brand Assets Preview */}
          <PolarisSidebarCard
            title="Brand Assets Preview"
            badge="Live Identity"
            icon={Sparkles}
          >
            <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3.5 space-y-3.5 shadow-xs">
              {/* Logo Preview */}
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-white dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 flex items-center justify-center overflow-hidden shrink-0 shadow-xs relative">
                  {currentImage ? (
                    <Image
                      src={currentImage}
                      alt="Brand Logo"
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-[#8c9196]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#616161] block">
                    Primary Logo
                  </span>
                  <p className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100 truncate mt-0.5">
                    {currentImage ? "Active & Configured" : "Default Logo"}
                  </p>
                  <p className="text-[11.5px] text-[#616161] dark:text-zinc-400">
                    512×512px WebP / PNG
                  </p>
                </div>
              </div>

              {/* Browser Tab Favicon Mockup */}
              <div className="pt-2.5 border-t border-[#e1e3e5] dark:border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#616161] block">
                  Browser Tab Simulation
                </span>
                <div className="h-8 rounded-[6px] bg-white dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 flex items-center px-2.5 gap-2 max-w-[200px]">
                  <div className="h-4 w-4 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                    {faviconImage ? (
                      <Image
                        src={faviconImage}
                        alt="Favicon"
                        width={16}
                        height={16}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Globe className="h-3.5 w-3.5 text-[#8c9196]" />
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-[#303030] dark:text-zinc-200 truncate">
                    Community Portal
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Metadata */}
            <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisSummaryRow
                label="Logo Status"
                value={currentImage ? "Uploaded" : "Pending"}
              />
              <PolarisSummaryRow
                label="Favicon Status"
                value={faviconImage ? "Configured" : "Default"}
              />
              <PolarisSummaryRow
                label="Format Target"
                value="WebP / Transparent PNG"
                isLast
              />
            </div>
          </PolarisSidebarCard>

          {/* Asset Guidelines Tip */}
          <PolarisTipCard title="Asset Specifications">
            Use high-resolution vectors or square images (512×512px) with
            transparent backgrounds for optimal contrast across both light and
            dark UI surfaces.
          </PolarisTipCard>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Step 1: Primary Logo */}
        <PolarisFormCard
          step={1}
          title="Primary Brand Logo"
          description="Used in the navigation bar, transactional emails, mobile apps, and public portal headers."
          badge="Header & Nav"
        >
          <div className="p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40">
            <ImageUploadWithCrop
              currentImage={currentImage}
              onImageUpdate={onImageUpdate}
              label="Logo"
              recommendedWidth={512}
              recommendedHeight={512}
              aspectRatio={1}
              circularCrop={true}
              showAspectRatioPresets={true}
              showQualitySlider={true}
              showFormatSelector={true}
              enableDragDrop={true}
              enableZoom={true}
              maxFileSize={5}
              defaultQuality={90}
              defaultFormat="webp"
              uploadButtonText="Upload Entity Logo"
              changeButtonText="Change Logo"
              maxWidth={2048}
              maxHeight={2048}
              minWidth={256}
              minHeight={256}
              customDescription="Square logo recommended for best results. Drag & drop or click to upload."
              customUploadHandler={async (file) => {
                try {
                  const { data } = await uploadEntityLogo({
                    variables: { file },
                  });
                  if (data?.uploadEntityLogo?.success) {
                    toast({
                      title: "Success",
                      description:
                        data.uploadEntityLogo.message ||
                        "Logo updated successfully!",
                    });
                    return `https://cdn.thrico.network/${data.uploadEntityLogo.logo}`;
                  } else {
                    throw new Error(
                      data?.uploadEntityLogo?.message ||
                        "Failed to upload logo",
                    );
                  }
                } catch (error: any) {
                  throw new Error(error.message || "Failed to upload logo");
                }
              }}
            />
          </div>
        </PolarisFormCard>

        {/* Step 2: Browser Favicon */}
        <PolarisFormCard
          step={2}
          title="Browser Favicon Icon"
          description="Displayed in desktop browser tabs, search engine results, and mobile bookmark icons."
          badge="Browser Tab"
        >
          <div className="p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40">
            <FaviconUpload
              currentImage={faviconImage}
              onImageUpdate={onFaviconUpdate}
            />
          </div>
        </PolarisFormCard>
      </div>
    </PolarisFormLayout>
  );
}
