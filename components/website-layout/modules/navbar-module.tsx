import { LivePreviewNavbar } from "../preview/live-preview-navbar";
import { NavbarContentConfig } from "@/store/useWebsiteBuilderStore";

interface NavbarModuleProps {
  content: NavbarContentConfig;
  layout: string;
  previewDevice: string;
}


export const NavbarModule = ({
  content,
  layout,
  previewDevice,
}: NavbarModuleProps) => {
  return (
    <LivePreviewNavbar
      content={content}
      layout={layout}
      previewDevice={previewDevice}
    />
  );
};

