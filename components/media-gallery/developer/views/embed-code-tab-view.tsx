"use client";

import React, { useState } from "react";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisTipCard,
  PolarisSidebarCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  Code2,
  FileCode2,
  Laptop,
  MousePointerClick,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { useMediaGalleryDeveloper } from "../media-gallery-developer-context";

export function EmbedCodeTabView() {
  const { client, formik, albums } = useMediaGalleryDeveloper();
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const clientId = client?.clientId || "thrico_client_YOUR_KEY";
  const defaultAlbumId =
    formik.values.defaultAlbumId || albums[0]?.id || "ALBUM_ID";

  const handleCopy = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  // 1. Attach to existing button
  const attachButtonCode = `<!-- 1. Your existing button on your website -->
<button id="uploadBtn" class="btn btn-primary">
  Upload to Community Gallery
</button>

<!-- 2. Thrico Gallery CDN Script (< 11 KB) -->
<script src="https://sdk.thrico.network/gallery-uploader.min.js"></script>

<!-- 3. Attach one-click upload to your button -->
<script>
  ThricoGallery.attachButton("#uploadBtn", {
    clientId: "${clientId}",
    albumId: "${defaultAlbumId}",
    onSuccess: (item) => {
      console.log("Uploaded successfully:", item.url);
      alert("Photo uploaded successfully!");
    },
    onError: (err) => {
      alert("Upload failed: " + err.message);
    }
  });
</script>`;

  // 2. Direct raw file upload
  const rawUploadCode = `<!-- Your own custom file input or drag-and-drop -->
<input type="file" id="mediaInput" accept="image/*,video/*" />

<!-- Thrico Gallery CDN Script -->
<script src="https://sdk.thrico.network/gallery-uploader.min.js"></script>

<script>
  // 1. Initialize client once
  ThricoGallery.init({
    clientId: "${clientId}",
    albumId: "${defaultAlbumId}"
  });

  // 2. Pass raw file directly to ThricoGallery.upload(file)
  document.getElementById("mediaInput").addEventListener("change", async (e) => {
    const rawFile = e.target.files[0];
    if (!rawFile) return;

    try {
      const item = await ThricoGallery.upload(rawFile, {
        onProgress: (percent) => console.log("Uploading: " + percent + "%")
      });
      console.log("Uploaded media:", item.url);
      alert("Uploaded successfully: " + item.url);
    } catch (err) {
      alert("Upload error: " + err.message);
    }
  });
</script>`;

  // 3. Turnkey Minimal Button
  const turnkeyButtonCode = `<!-- Standalone Button Container -->
<div id="thrico-gallery-uploader"
     data-client-id="${clientId}"
     data-album-id="${defaultAlbumId}"
     data-button-text="Upload Photo / Video">
</div>

<!-- Thrico Gallery CDN Script (11 KB minified) -->
<script src="https://sdk.thrico.network/gallery-uploader.min.js" async></script>`;

  // 4. React Component
  const reactCode = `import React, { useState } from "react";
import { ThricoMediaGalleryClient } from "@thrico/media-gallery-sdk";

export function CommunityGalleryUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const gallery = new ThricoMediaGalleryClient({
        clientId: "${clientId}",
        defaultAlbumId: "${defaultAlbumId}",
      });

      const item = await gallery.upload(file, {
        onProgress: (percent) => setProgress(percent),
      });

      console.log("Uploaded item:", item.url);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleUpload}
        disabled={isUploading}
      />
      {isUploading && <span className="text-sm text-muted-foreground">{progress}%</span>}
    </div>
  );
}`;

  return (
    <PolarisFormLayout
      sidebar={
        <div className="space-y-4">
          <PolarisSidebarCard
            title="SDK Methods Reference"
            badge="SDK v1.0"
            icon={Code2}
          >
            <div className="space-y-2.5 text-xs">
              <p className="text-[11.5px] text-muted-foreground leading-snug">
                The SDK is 100% headless with zero UI bloat. Use the method that matches your needs:
              </p>

              <div className="space-y-2 pt-1 font-mono text-[10.5px]">
                <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold block">
                    ThricoGallery.attachButton()
                  </span>
                  <span className="text-muted-foreground font-sans text-[11px]">
                    Turns any existing button on your website into a direct uploader.
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold block">
                    ThricoGallery.upload(file)
                  </span>
                  <span className="text-muted-foreground font-sans text-[11px]">
                    Pass raw File/Blob from your own file input or dropzone.
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold block">
                    ThricoGallery.pickAndUpload()
                  </span>
                  <span className="text-muted-foreground font-sans text-[11px]">
                    Opens native file picker and uploads selected file in 1 call.
                  </span>
                </div>
              </div>
            </div>
          </PolarisSidebarCard>

          <PolarisTipCard title="Integration Best Practices">
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                • <strong>Direct S3 Upload:</strong> Files stream directly from the user&apos;s browser to AWS S3 via pre-signed URLs, keeping server memory overhead at 0.
              </p>
              <p>
                • <strong>CORS Whitelist:</strong> Ensure the domain hosting the upload button is added to the <strong>Allowed CORS Domains</strong> tab.
              </p>
            </div>
          </PolarisTipCard>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Step 1: Attach to Custom Button (Recommended) */}
        <PolarisFormCard
          step={1}
          icon={MousePointerClick}
          title="Attach to Existing Button (Recommended)"
          description="Turn any existing button on your website into a 1-click media uploader with zero custom CSS needed."
          badge="Most Popular"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] bg-muted/50 text-foreground"
                >
                  HTML + JavaScript
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Works with Bootstrap, Tailwind, or custom buttons.
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(attachButtonCode, "Button Attachment Code")}
                className="h-7 text-xs gap-1.5 cursor-pointer"
              >
                {copiedSnippet === "Button Attachment Code" ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span>
                  {copiedSnippet === "Button Attachment Code"
                    ? "Copied!"
                    : "Copy Snippet"}
                </span>
              </Button>
            </div>

            <pre className="p-3.5 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-[11px] leading-relaxed overflow-x-auto border border-border/80 shadow-2xs">
              <code>{attachButtonCode}</code>
            </pre>
          </div>
        </PolarisFormCard>

        {/* Step 2: Pass Raw Image File Directly */}
        <PolarisFormCard
          step={2}
          icon={UploadCloud}
          title="Pass Raw File Directly (Zero UI)"
          description="Use your own custom file input, drag-and-drop zone, or camera capture and upload the raw file directly."
          badge="Pure Headless"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] bg-muted/50 text-foreground"
                >
                  Custom File Input
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Zero UI injected by SDK.
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(rawUploadCode, "Raw Upload Code")}
                className="h-7 text-xs gap-1.5 cursor-pointer"
              >
                {copiedSnippet === "Raw Upload Code" ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span>
                  {copiedSnippet === "Raw Upload Code"
                    ? "Copied!"
                    : "Copy Snippet"}
                </span>
              </Button>
            </div>

            <pre className="p-3.5 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-[11px] leading-relaxed overflow-x-auto border border-border/80 shadow-2xs">
              <code>{rawUploadCode}</code>
            </pre>
          </div>
        </PolarisFormCard>

        {/* Step 3: Turnkey Minimal Button */}
        <PolarisFormCard
          step={3}
          icon={FileCode2}
          title="Turnkey Minimal Button Container"
          description="Embed a ready-to-use minimal upload button if you don't already have a button on your page."
          badge="Turnkey"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] bg-muted/50 text-foreground"
                >
                  Single HTML Tag
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(turnkeyButtonCode, "Turnkey Button Code")}
                className="h-7 text-xs gap-1.5 cursor-pointer"
              >
                {copiedSnippet === "Turnkey Button Code" ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span>
                  {copiedSnippet === "Turnkey Button Code"
                    ? "Copied!"
                    : "Copy Snippet"}
                </span>
              </Button>
            </div>

            <pre className="p-3.5 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-[11px] leading-relaxed overflow-x-auto border border-border/80 shadow-2xs">
              <code>{turnkeyButtonCode}</code>
            </pre>
          </div>
        </PolarisFormCard>

        {/* Step 4: React Component */}
        <PolarisFormCard
          step={4}
          icon={Laptop}
          title="React & Next.js Implementation"
          description="Build custom headless upload experiences in modern frontend frameworks using our TypeScript SDK."
          badge="React / Next.js"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] bg-muted/50 text-foreground"
                >
                  React Component
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Typed with full TypeScript declarations.
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(reactCode, "React Component")}
                className="h-7 text-xs gap-1.5 cursor-pointer"
              >
                {copiedSnippet === "React Component" ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span>
                  {copiedSnippet === "React Component" ? "Copied!" : "Copy React Code"}
                </span>
              </Button>
            </div>

            <pre className="p-3.5 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-[11px] leading-relaxed overflow-x-auto border border-border/80 shadow-2xs">
              <code>{reactCode}</code>
            </pre>
          </div>
        </PolarisFormCard>

        
      </div>
    </PolarisFormLayout>
  );
}
