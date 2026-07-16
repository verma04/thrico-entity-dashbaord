"use client";

import { useUploadEntityLogo } from "@/graphql/actions";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon, Globe } from "lucide-react";
import { FaviconUpload } from "./favicon-upload";
import React from "react";

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
    onCompleted: (data: any) => {},
    onError: (error: any) => {},
  });

  return (
    <div className="max-w-2xl space-y-6">
      <SectionCard
        icon={ImageIcon}
        title="Primary Logo"
        description="Used in the header, email templates, and all public-facing surfaces. Use PNG or SVG with a transparent background."
      >
        <div className="p-4 rounded-lg border border-border bg-muted/50/40">
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
                    data?.uploadEntityLogo?.message || "Failed to upload logo",
                  );
                }
              } catch (error: any) {
                throw new Error(error.message || "Failed to upload logo");
              }
            }}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={Globe}
        title="Browser Favicon"
        description="Displayed in browser tabs and bookmarks. Recommend 32×32px or 64×64px ICO, PNG, or SVG."
      >
        <div className="p-4 rounded-lg border border-border bg-muted/50/40">
          <FaviconUpload
            currentImage={faviconImage}
            onImageUpdate={onFaviconUpdate}
          />
        </div>
      </SectionCard>

      {/* Asset guidelines */}
      <div className="rounded-xl border border-border/60 bg-primary p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md bg-card/10 flex items-center justify-center">
            <ImageIcon size={12} className="text-muted-foreground" />
          </div>
          <p className="text-[12px] font-semibold text-zinc-100">
            Asset Guidelines
          </p>
        </div>
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          Use high-quality assets with transparent backgrounds. PNG or SVG are
          preferred formats. Minimum recommended size is 256×256px for the logo.
        </p>
      </div>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: any;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="flex items-start gap-3 px-5 py-4 border-b border-border bg-muted/50/40">
        <div className="w-7 h-7 rounded-lg bg-muted border border-border/60 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
          <Icon size={13} strokeWidth={2} />
        </div>
        <div>
          <p className="text-[13.5px] font-semibold text-foreground leading-none">
            {title}
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground leading-snug">
            {description}
          </p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
