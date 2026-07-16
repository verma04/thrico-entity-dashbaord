"use client";
import * as React from "react";

import { Images, Settings } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

function MediaGalleryLayout({ children }: { children: React.ReactNode }) {
  const items = React.useMemo(() => {
    return [
      {
        key: "", // maps to /media-gallery
        label: `Albums`,
        icon: <Images size={18} />,
      },
      {
        key: "settings", // maps to /media-gallery/settings
        label: `Settings`,
        icon: <Settings size={18} />,
      },
    ];
  }, []);

  return (
    <MenuItemsLayout active={"media-gallery"} items={items} showAdminTabs={false}>
      {children}
    </MenuItemsLayout>
  );
}

export default MediaGalleryLayout;
