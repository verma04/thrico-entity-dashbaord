import { PreviewDevice, PreviewBg } from "../html-preview-renderer";
import { HtmlProblem, DomOutlineItem, DocStats } from "../vscode-editor-utils";
import { HtmlSnippet } from "../html-editor-utils";

export type SidebarTab = "explorer" | "search" | "media" | "snippets" | "settings" | null;
export type DevToolsTab = "problems" | "console" | "dom" | "stats";
export type ViewMode = "split" | "code" | "preview";
export type ActiveCodeTab = "html" | "css";

export interface ConsoleLog {
  id: string;
  time: string;
  level: "info" | "warn" | "error" | "success";
  text: string;
}

export interface StarterTemplate {
  name: string;
  category: string;
  code: string;
}

export interface UploadedImage {
  url: string;
  name: string;
  uploadedAt: Date;
}

export interface CommandItem {
  id: string;
  label: string;
  category: string;
  desc: string;
}

export {
  type PreviewDevice,
  type PreviewBg,
  type HtmlProblem,
  type DomOutlineItem,
  type DocStats,
  type HtmlSnippet,
};
