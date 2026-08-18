"use client";

import React, { Suspense } from "react";
import { AlbumsManager } from "@/components/media-gallery/manage";

export default function MediaGalleryPage() {
  return (
    <Suspense fallback={null}>
      <AlbumsManager />
    </Suspense>
  );
}
