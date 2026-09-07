import React from "react";
import { LivePreviewFooter } from "../preview/live-preview-footer";

interface FooterModuleProps {
  content: Record<string, any>;
  layout: string;
}

export const FooterModule = ({ content, layout }: FooterModuleProps) => {
  return <LivePreviewFooter content={content} layout={layout} />;
};

