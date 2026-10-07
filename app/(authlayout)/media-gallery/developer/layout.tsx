"use client";

import React, { ReactNode } from "react";
import {
  MediaGalleryDeveloperProvider,
  MediaGalleryDeveloperLayoutShell,
} from "@/components/media-gallery/developer";

export default function MediaGalleryDeveloperLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MediaGalleryDeveloperProvider>
      <MediaGalleryDeveloperLayoutShell>
        {children}
      </MediaGalleryDeveloperLayoutShell>
    </MediaGalleryDeveloperProvider>
  );
}
