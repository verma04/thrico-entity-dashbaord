import React from "react";
import { LivePreviewFooter } from "../preview/live-preview-footer";
import { FooterContentConfig } from "@/store/useWebsiteBuilderStore";

interface FooterModuleProps {
  content: FooterContentConfig;
  layout: string;
}

export const FooterModule = ({ content, layout }: FooterModuleProps) => {
  return <LivePreviewFooter content={content} layout={layout} />;
};


