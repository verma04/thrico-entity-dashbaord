"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateEmailTemplate,
  useUpdateEmailTemplate,
} from "@/graphql/actions/email";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Eye,
  Smartphone,
  Monitor,
  Type,
  Image as ImageIcon,
  MousePointer2,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link,
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
  Palette,
  Sparkles,
  Layout,
  GripVertical,
  Settings2,
  Check,
  X,
  Space,
  Mail,
} from "lucide-react";
import { useEmailStore, type EmailTemplate } from "@/store/useEmailStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { STARTER_TEMPLATES } from "@/lib/email-templates";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type BlockType =
  | "text"
  | "heading"
  | "image"
  | "button"
  | "divider"
  | "spacer"
  | "header"
  | "navbar"
  | "footer";
type TextAlign = "left" | "center" | "right";
type SpacerSize = "sm" | "md" | "lg" | "xl";

interface BuilderBlock {
  id: string;
  type: BlockType;
  content: string;
  align: TextAlign;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  fontSize: number;
  color: string;
  bgColor: string;
  href: string;
  spacerSize: SpacerSize;
  imageAlt: string;
  logoUrl?: string;
  secondaryContent?: string;
}

const SPACER_MAP: Record<SpacerSize, number> = {
  sm: 16,
  md: 32,
  lg: 48,
  xl: 64,
};

const defaultBlock = (type: BlockType, id: string): BuilderBlock => ({
  id,
  type,
  content:
    type === "text"
      ? "Write your message here..."
      : type === "heading"
        ? "Your Heading"
        : type === "button"
          ? "Click Here"
          : type === "navbar"
            ? JSON.stringify([
                { label: "Home", url: "#" },
                { label: "Products", url: "#" },
                { label: "Contact", url: "#" },
              ])
            : type === "footer"
              ? "© 2026 Thrico. All rights reserved. 123 Innovation Way, San Francisco, CA"
              : "",
  align:
    type === "header" || type === "navbar" || type === "footer"
      ? "center"
      : "left",
  bold: type === "heading" || type === "button",
  italic: false,
  underline: false,
  fontSize:
    type === "heading" ? 24 : type === "button" || type === "navbar" ? 14 : 14,
  color: type === "button" ? "#ffffff" : "#1e293b",
  bgColor: type === "button" ? "#0f172a" : "transparent",
  href: "",
  spacerSize: "md",
  imageAlt: "",
  logoUrl: type === "header" ? "https://cdn.thrico.network/thrico.png" : "",
  secondaryContent: type === "header" ? "Premium Ecosystem Dashboard" : "",
});

// ---------------------------------------------------------------------------
// Block Config
// ---------------------------------------------------------------------------
const blockDefs: {
  type: BlockType;
  label: string;
  icon: React.ElementType;
  description: string;
  accent: string;
  pill: string;
}[] = [
  {
    type: "header",
    label: "Header",
    icon: Layout,
    description: "Brand logo & tagline",
    accent: "bg-indigo-500 shadow-indigo-100",
    pill: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  {
    type: "navbar",
    label: "Navbar",
    icon: Link,
    description: "Row of navigation links",
    accent: "bg-cyan-500 shadow-cyan-100",
    pill: "bg-cyan-50 text-cyan-700 border-cyan-100",
  },
  {
    type: "heading",
    label: "Heading",
    icon: Type,
    description: "Large title text",
    accent: "bg-violet-600 shadow-violet-100",
    pill: "bg-violet-50 text-violet-700 border-violet-100",
  },
  {
    type: "text",
    label: "Text",
    icon: AlignLeft,
    description: "Body paragraph",
    accent: "bg-blue-500 shadow-blue-100",
    pill: "bg-blue-50 text-blue-700 border-blue-100",
  },
  {
    type: "image",
    label: "Image",
    icon: ImageIcon,
    description: "Remote URL media",
    accent: "bg-emerald-500 shadow-emerald-100",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    type: "button",
    label: "Button",
    icon: MousePointer2,
    description: "Call-to-action link",
    accent: "bg-amber-500 shadow-amber-100",
    pill: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    type: "divider",
    label: "Divider",
    icon: Minus,
    description: "Horizontal rule",
    accent: "bg-slate-400 shadow-slate-100",
    pill: "bg-slate-100 text-slate-600 border-slate-200",
  },
  {
    type: "spacer",
    label: "Spacer",
    icon: Space,
    description: "Vertical gap",
    accent: "bg-rose-400 shadow-rose-100",
    pill: "bg-rose-50 text-rose-700 border-rose-100",
  },
  {
    type: "footer",
    label: "Footer",
    icon: Settings2,
    description: "Legal & social footer",
    accent: "bg-zinc-800 shadow-zinc-100",
    pill: "bg-zinc-50 text-zinc-700 border-zinc-100",
  },
];

// ---------------------------------------------------------------------------
// Block Preview in Canvas
// ---------------------------------------------------------------------------
function BlockCanvas({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  brandColor,
}: {
  block: BuilderBlock;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (id: string, patch: Partial<BuilderBlock>) => void;
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  isFirst: boolean;
  isLast: boolean;
  brandColor: string;
}) {
  const def = blockDefs.find((d) => d.type === block.type)!;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative rounded-xl border-2 transition-all duration-150 cursor-pointer",
        isSelected
          ? "border-indigo-400 shadow-lg shadow-indigo-100/60 bg-white"
          : "border-transparent hover:border-slate-200 bg-white hover:shadow-sm",
      )}
    >
      {/* Selection ring glow */}
      {isSelected && (
        <div className="absolute -inset-px rounded-xl pointer-events-none ring-1 ring-indigo-300/30" />
      )}

      {/* Top action bar — only visible on hover/select */}
      <div
        className={cn(
          "absolute -top-9 left-0 right-0 flex items-center justify-between px-2 transition-all duration-150 pointer-events-none",
          isSelected ? "opacity-100 pointer-events-auto" : "opacity-0",
        )}
      >
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border",
            def.pill,
          )}
        >
          <def.icon className="h-2.5 w-2.5" />
          {def.label}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp(block.id);
            }}
            disabled={isFirst}
            className="h-6 w-6 rounded-md bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-all"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown(block.id);
            }}
            disabled={isLast}
            className="h-6 w-6 rounded-md bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-all"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(block.id);
            }}
            className="h-6 w-6 rounded-md bg-red-50 border border-red-100 shadow-sm flex items-center justify-center text-red-400 hover:text-red-600 transition-all"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {(block.type === "text" || block.type === "heading") && (
          <div className="w-full" style={{ textAlign: block.align }}>
            <textarea
              value={block.content}
              onChange={(e) => onUpdate(block.id, { content: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-transparent border-none outline-none resize-none text-slate-800 leading-relaxed placeholder:text-slate-300"
              style={{
                fontSize: block.fontSize,
                fontWeight: block.bold ? 700 : 400,
                fontStyle: block.italic ? "italic" : "normal",
                textDecoration: block.underline ? "underline" : "none",
                color: block.color === "transparent" ? "#1e293b" : block.color,
                textAlign: block.align,
                minHeight: block.type === "heading" ? "48px" : "80px",
              }}
              placeholder={
                block.type === "heading" ? "Enter heading…" : "Enter text…"
              }
            />
          </div>
        )}

        {block.type === "image" && (
          <div>
            {block.content ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={block.content}
                alt={block.imageAlt || "Email image"}
                className="w-full rounded-lg object-cover max-h-64"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/600x200/f8fafc/94a3b8?text=Invalid+URL";
                }}
              />
            ) : (
              <div className="h-32 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-400">
                <ImageIcon className="h-6 w-6 opacity-40" />
                <span className="text-[11px] font-medium">
                  Enter image URL in the properties panel →
                </span>
              </div>
            )}
          </div>
        )}

        {block.type === "button" && (
          <div style={{ textAlign: block.align }}>
            <span
              className="inline-block px-6 py-3 rounded-lg text-[14px] cursor-default select-none"
              style={{
                backgroundColor:
                  block.bgColor === "transparent" ? brandColor : block.bgColor,
                color: block.color,
                fontWeight: block.bold ? 700 : 600,
              }}
            >
              {block.content || "Button Label"}
            </span>
          </div>
        )}

        {block.type === "header" && (
          <div
            className="flex flex-col items-center gap-2 py-4"
            style={{ textAlign: block.align }}
          >
            {block.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={block.logoUrl}
                alt="Logo"
                className="h-10 object-contain"
              />
            ) : (
              <div className="h-10 w-24 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-400">
                Logo
              </div>
            )}
            {block.secondaryContent && (
              <p className="text-[12px] text-slate-500 font-medium">
                {block.secondaryContent}
              </p>
            )}
          </div>
        )}

        {block.type === "navbar" && (
          <div
            className="flex flex-wrap items-center justify-center gap-6 py-4"
            style={{ textAlign: block.align }}
          >
            {(() => {
              try {
                const links = JSON.parse(block.content);
                return links.map((link: any, i: number) => (
                  <span
                    key={i}
                    className="text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {link.label}
                  </span>
                ));
              } catch (e) {
                return (
                  <span className="text-[12px] text-red-400">
                    Invalid Navbar Links Data
                  </span>
                );
              }
            })()}
          </div>
        )}

        {block.type === "footer" && (
          <div
            className="py-8 px-4 flex flex-col items-center gap-4 border-t border-slate-100"
            style={{ textAlign: block.align }}
          >
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-[400px]">
              {block.content}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest border-b border-indigo-200">
                Unsubscribe
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Manage Preferences
              </span>
            </div>
          </div>
        )}

        {block.type === "divider" && (
          <div className="py-2">
            <div className="h-px bg-slate-200 w-full" />
          </div>
        )}

        {block.type === "spacer" && (
          <div
            className="w-full rounded-lg border border-dashed border-slate-200 bg-slate-50/70 flex items-center justify-center"
            style={{ height: SPACER_MAP[block.spacerSize] }}
          >
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              {SPACER_MAP[block.spacerSize]}px spacer
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Properties Panel
// ---------------------------------------------------------------------------
function PropertiesPanel({
  block,
  onUpdate,
  brandColor,
}: {
  block: BuilderBlock;
  onUpdate: (id: string, patch: Partial<BuilderBlock>) => void;
  brandColor: string;
}) {
  const def = blockDefs.find((d) => d.type === block.type)!;

  const update = (patch: Partial<BuilderBlock>) => onUpdate(block.id, patch);

  return (
    <div className="space-y-5">
      {/* Block type header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div
          className={cn(
            "h-7 w-7 rounded-lg flex items-center justify-center text-white shadow-sm",
            def.accent,
          )}
        >
          <def.icon className="h-3.5 w-3.5" />
        </div>
        <div>
          <p className="text-[12px] font-bold text-slate-800">
            {def.label} Block
          </p>
          <p className="text-[10px] text-slate-400">{def.description}</p>
        </div>
      </div>

      {/* Text content / Button label */}
      {(block.type === "text" ||
        block.type === "heading" ||
        block.type === "button") && (
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            {block.type === "button" ? "Button Label" : "Content"}
          </label>
          <textarea
            value={block.content}
            onChange={(e) => update({ content: e.target.value })}
            className="w-full h-20 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[12px] text-slate-800 outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 resize-none transition-all"
          />
        </div>
      )}

      {/* Asset Upload */}
      {block.type === "image" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Asset Deployment
            </label>
            <ImageUploadWithCrop
              currentImage={block.content}
              onImageUpdate={(url) => update({ content: url })}
              label=""
              recommendedWidth={1200}
              recommendedHeight={600}
              aspectRatio={undefined}
              showAspectRatioPresets={true}
              showQualitySlider={true}
              showFormatSelector={true}
              className="mt-2"
              dropzoneClassName="py-10 border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all rounded-xl"
              previewClassName="bg-slate-50 border-slate-100 p-2 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-none">
              Image Reference URL (Manual)
            </label>
            <input
              type="text"
              value={block.content}
              onChange={(e) => update({ content: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] text-slate-800 outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-none">
              Accessible Alt Text
            </label>
            <input
              type="text"
              value={block.imageAlt || ""}
              onChange={(e) => update({ imageAlt: e.target.value })}
              placeholder="Describe the image context…"
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] text-slate-800 outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
            />
          </div>
        </div>
      )}

      {/* Global Hyperlink Property (Anchor) */}
      {(block.type === "text" ||
        block.type === "heading" ||
        block.type === "button" ||
        block.type === "image") && (
        <div className="pt-4 border-t border-slate-50">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-none">
            Hyperlink Payload (Optional)
          </label>
          <div className="relative group">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
            <input
              type="text"
              value={block.href || ""}
              onChange={(e) => update({ href: e.target.value })}
              placeholder="https://example.com/target"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] text-slate-800 outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 transition-all font-mono"
            />
          </div>
          <p className="text-[9px] text-slate-400 mt-1.5 px-1 italic">
            Makes this entire section clickable as an anchor.
          </p>
        </div>
      )}

      {/* Text formatting */}
      {(block.type === "text" || block.type === "heading") && (
        <>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Formatting
            </label>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => update({ bold: !block.bold })}
                className={cn(
                  "h-8 w-8 rounded-md flex items-center justify-center text-[13px] font-extrabold border transition-all",
                  block.bold
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300",
                )}
              >
                B
              </button>
              <button
                onClick={() => update({ italic: !block.italic })}
                className={cn(
                  "h-8 w-8 rounded-md flex items-center justify-center italic text-[13px] font-bold border transition-all",
                  block.italic
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300",
                )}
              >
                I
              </button>
              <button
                onClick={() => update({ underline: !block.underline })}
                className={cn(
                  "h-8 w-8 rounded-md flex items-center justify-center underline text-[13px] font-bold border transition-all",
                  block.underline
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300",
                )}
              >
                U
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Alignment
            </label>
            <div className="flex gap-1.5">
              {(["left", "center", "right"] as TextAlign[]).map((a) => (
                <button
                  key={a}
                  onClick={() => update({ align: a })}
                  className={cn(
                    "h-8 w-8 rounded-md flex items-center justify-center border transition-all",
                    block.align === a
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-400 border-slate-200 hover:border-slate-300",
                  )}
                >
                  {a === "left" && <AlignLeft className="h-3.5 w-3.5" />}
                  {a === "center" && <AlignCenter className="h-3.5 w-3.5" />}
                  {a === "right" && <AlignRight className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Font Size — {block.fontSize}px
            </label>
            <input
              type="range"
              min={10}
              max={48}
              value={block.fontSize}
              onChange={(e) => update({ fontSize: Number(e.target.value) })}
              className="w-full accent-slate-900"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Text Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={block.color === "transparent" ? "#1e293b" : block.color}
                onChange={(e) => update({ color: e.target.value })}
                className="h-8 w-8 rounded-md cursor-pointer border border-slate-200 p-0 overflow-hidden"
              />
              <input
                type="text"
                value={block.color}
                onChange={(e) => update({ color: e.target.value })}
                className="flex-1 h-8 px-2 rounded-md border border-slate-200 bg-slate-50 font-mono text-[11px] outline-none"
              />
            </div>
          </div>
        </>
      )}

      {/* Button colors */}
      {block.type === "button" && (
        <>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={
                  block.bgColor === "transparent" ? brandColor : block.bgColor
                }
                onChange={(e) => update({ bgColor: e.target.value })}
                className="h-8 w-8 rounded-md cursor-pointer border border-slate-200 p-0 overflow-hidden"
              />
              <input
                type="text"
                value={block.bgColor}
                onChange={(e) => update({ bgColor: e.target.value })}
                className="flex-1 h-8 px-2 rounded-md border border-slate-200 bg-slate-50 font-mono text-[11px] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Text Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={block.color}
                onChange={(e) => update({ color: e.target.value })}
                className="h-8 w-8 rounded-md cursor-pointer border border-slate-200 p-0 overflow-hidden"
              />
              <input
                type="text"
                value={block.color}
                onChange={(e) => update({ color: e.target.value })}
                className="flex-1 h-8 px-2 rounded-md border border-slate-200 bg-slate-50 font-mono text-[11px] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Alignment
            </label>
            <div className="flex gap-1.5">
              {(["left", "center", "right"] as TextAlign[]).map((a) => (
                <button
                  key={a}
                  onClick={() => update({ align: a })}
                  className={cn(
                    "h-8 w-8 rounded-md flex items-center justify-center border transition-all",
                    block.align === a
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-400 border-slate-200 hover:border-slate-300",
                  )}
                >
                  {a === "left" && <AlignLeft className="h-3.5 w-3.5" />}
                  {a === "center" && <AlignCenter className="h-3.5 w-3.5" />}
                  {a === "right" && <AlignRight className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Header properties */}
      {block.type === "header" && (
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Logo URL
            </label>
            <input
              type="text"
              value={block.logoUrl}
              onChange={(e) => update({ logoUrl: e.target.value })}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] text-slate-800 outline-none focus:ring-1 focus:ring-indigo-300 transition-all font-mono"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Tagline / Subtext
            </label>
            <input
              type="text"
              value={block.secondaryContent}
              onChange={(e) => update({ secondaryContent: e.target.value })}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] text-slate-800 outline-none focus:ring-1 focus:ring-indigo-300 transition-all"
            />
          </div>
        </div>
      )}

      {/* Navbar properties */}
      {block.type === "navbar" && (
        <div className="space-y-4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            Manage Links
          </label>
          <div className="space-y-2">
            {(() => {
              try {
                const links = JSON.parse(block.content);
                return links.map((link: any, i: number) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100 relative group/link"
                  >
                    <button
                      onClick={() => {
                        const next = [...links];
                        next.splice(i, 1);
                        update({ content: JSON.stringify(next) });
                      }}
                      className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-400 text-white flex items-center justify-center opacity-0 group-hover/link:opacity-100 transition-opacity"
                    >
                      <X className="h-2 w-2" />
                    </button>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const next = links.map((l: any, idx: number) =>
                          idx === i ? { ...l, label: e.target.value } : l,
                        );
                        update({ content: JSON.stringify(next) });
                      }}
                      placeholder="Label"
                      className="h-7 px-2 bg-white border border-slate-200 rounded text-[11px] outline-none focus:ring-1 focus:ring-indigo-300"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => {
                        const next = links.map((l: any, idx: number) =>
                          idx === i ? { ...l, url: e.target.value } : l,
                        );
                        update({ content: JSON.stringify(next) });
                      }}
                      placeholder="URL"
                      className="h-7 px-2 bg-white border border-slate-200 rounded text-[11px] outline-none focus:ring-1 focus:ring-indigo-300 font-mono"
                    />
                  </div>
                ));
              } catch (e) {
                return null;
              }
            })()}
            <button
              onClick={() => {
                try {
                  const links = JSON.parse(block.content);
                  links.push({ label: "New Link", url: "#" });
                  update({ content: JSON.stringify(links) });
                } catch (e) {}
              }}
              className="w-full py-2 border border-dashed border-slate-200 rounded-lg text-[10px] font-bold text-slate-400 hover:text-indigo-500 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="h-3 w-3" />
              Add Link
            </button>
          </div>
        </div>
      )}

      {/* Footer properties */}
      {block.type === "footer" && (
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            Footer Text / Address
          </label>
          <textarea
            value={block.content}
            onChange={(e) => update({ content: e.target.value })}
            className="w-full h-24 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[12px] text-slate-800 outline-none focus:ring-1 focus:ring-indigo-300 transition-all resize-none"
          />
        </div>
      )}

      {/* Spacer size */}
      {block.type === "spacer" && (
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Spacer Height
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(["sm", "md", "lg", "xl"] as SpacerSize[]).map((s) => (
              <button
                key={s}
                onClick={() => update({ spacerSize: s })}
                className={cn(
                  "h-9 rounded-lg border text-[11px] font-bold transition-all uppercase",
                  block.spacerSize === s
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-400 border-slate-200 hover:border-slate-300",
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            {SPACER_MAP[block.spacerSize]}px vertical gap
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Builder
// ---------------------------------------------------------------------------
export default function TemplateBuilder({
  id,
  initialData,
}: {
  id?: string;
  initialData?: EmailTemplate;
}) {
  const router = useRouter();
  const { addTemplate, updateTemplate: updateLocalTemplate } = useEmailStore();
  const [createTemplate, { loading: isCreating }] = useCreateEmailTemplate();
  const [updateTemplate, { loading: isUpdating }] = useUpdateEmailTemplate();

  const isSaving = isCreating || isUpdating;

  const [name, setName] = useState(initialData?.name || "");
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [brandColor, setBrandColor] = useState("#0f172a");

  const getInitialBlocks = useCallback((): BuilderBlock[] => {
    if (!initialData?.json) {
      return [
        {
          ...defaultBlock("heading", "block-1"),
          content: "Welcome to Our Platform 🎉",
          align: "center",
          fontSize: 28,
        },
        {
          ...defaultBlock("text", "block-2"),
          content:
            "Thank you for joining our community. We're excited to have you on board. Here's everything you need to get started.",
          align: "center",
        },
        {
          ...defaultBlock("button", "block-3"),
          content: "Get Started",
          align: "center",
        },
      ];
    }
    try {
      if (typeof initialData.json === "string") {
        return JSON.parse(initialData.json);
      }
      return initialData.json; // Fallback if already an object
    } catch (e) {
      console.error("Failed to parse template JSON:", e);
      return [];
    }
  }, [initialData]);

  const [blocks, setBlocks] = useState<BuilderBlock[]>(getInitialBlocks());
  const [selectedId, setSelectedId] = useState<string | null>("block-1");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const [activeTab, setActiveTab] = useState<
    "blocks" | "templates" | "settings"
  >("blocks");

  const selectedBlock = blocks.find((b) => b.id === selectedId) ?? null;

  const addBlock = useCallback((type: BlockType) => {
    const id = `block-${Date.now()}`;
    const nb = defaultBlock(type, id);
    setBlocks((prev) => [...prev, nb]);
    setSelectedId(id);
  }, []);

  const updateBlock = useCallback(
    (id: string, patch: Partial<BuilderBlock>) => {
      setBlocks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      );
    },
    [],
  );

  const removeBlock = useCallback(
    (id: string) => {
      setBlocks((prev) => {
        const next = prev.filter((b) => b.id !== id);
        if (selectedId === id) {
          setSelectedId(next[0]?.id ?? null);
        }
        return next;
      });
    },
    [selectedId],
  );

  const moveBlock = useCallback((id: string, dir: "up" | "down") => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= next.length) return prev;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  }, []);

  const generateHtml = useCallback(() => {
    const rows = blocks
      .map((b) => {
        const alignStyle = `text-align:${b.align}`;
        let blockHtml = "";

        switch (b.type) {
          case "header":
            blockHtml = `<div style="text-align:${b.align};padding:32px 0">
              <img src="${b.logoUrl || "https://cdn.thrico.network/thrico.png"}" alt="Logo" style="height:40px;display:inline-block;margin-bottom:8px" />
              ${b.secondaryContent ? `<p style="margin:0;font-size:12px;color:#64748b;font-family:ui-sans-serif,system-ui,sans-serif">${b.secondaryContent}</p>` : ""}
            </div>`;
            break;
          case "navbar":
            try {
              const links = JSON.parse(b.content);
              const linksHtml = links
                .map(
                  (l: any) =>
                    `<a href="${l.url}" style="text-decoration:none;color:#475569;font-size:13px;font-weight:600;margin:0 12px;font-family:ui-sans-serif,system-ui,sans-serif">${l.label}</a>`,
                )
                .join("");
              blockHtml = `<div style="text-align:${b.align};padding:16px 0;border-bottom:1px solid #f1f5f9;margin-bottom:24px">${linksHtml}</div>`;
            } catch (e) {
              blockHtml = "";
            }
            break;
          case "footer":
            blockHtml = `<div style="text-align:${b.align};padding:48px 24px;background:#f8fafc;border-radius:12px;margin-top:24px">
              <p style="margin:0 0 16px;font-size:12px;color:#64748b;line-height:1.6;font-family:ui-sans-serif,system-ui,sans-serif">${b.content}</p>
              <div style="font-size:11px;font-weight:700;color:${brandColor};text-transform:uppercase;letter-spacing:0.05em;font-family:ui-sans-serif,system-ui,sans-serif">
                <a href="#" style="color:${brandColor};text-decoration:none;border-bottom:1px solid ${brandColor}40">Unsubscribe</a>
                <span style="margin:0 12px;color:#cbd5e1">|</span>
                <a href="#" style="color:${brandColor};text-decoration:none">Manage Preferences</a>
              </div>
            </div>`;
            break;
          case "heading":
            blockHtml = `<h1 style="${alignStyle};font-size:${b.fontSize}px;font-weight:${b.bold ? 700 : 400};font-style:${b.italic ? "italic" : "normal"};text-decoration:${b.underline ? "underline" : "none"};color:${b.color};margin:0 0 16px;font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.2">${b.content}</h1>`;
            break;
          case "text":
            blockHtml = `<p style="${alignStyle};font-size:${b.fontSize}px;font-weight:${b.bold ? 700 : 400};font-style:${b.italic ? "italic" : "normal"};text-decoration:${b.underline ? "underline" : "none"};color:${b.color};margin:0 0 16px;font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.6">${b.content}</p>`;
            break;
          case "image":
            blockHtml = `<img src="${b.content || "https://placehold.co/600x200/f8fafc/cbd5e1?text=Image"}" alt="${b.imageAlt}" style="width:100%;border-radius:8px;margin:0 0 16px;display:block" />`;
            break;
          case "button":
            return `<div style="${alignStyle};margin:0 0 16px"><a href="${b.href || "#"}" style="display:inline-block;padding:12px 28px;background:${b.bgColor === "transparent" ? brandColor : b.bgColor};color:${b.color};border-radius:8px;text-decoration:none;font-weight:${b.bold ? 700 : 600};font-size:14px;font-family:ui-sans-serif,system-ui,sans-serif">${b.content}</a></div>`;
          case "divider":
            return `<hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 16px" />`;
          case "spacer":
            return `<div style="height:${SPACER_MAP[b.spacerSize]}px"></div>`;
          default:
            return "";
        }

        if (b.href && blockHtml) {
          return `<a href="${b.href}" style="text-decoration:none;display:block">${blockHtml}</a>`;
        }
        return blockHtml;
      })
      .join("\n");

    const hasFooter = blocks.some((b) => b.type === "footer");

    return `<div style="max-width:600px;margin:0 auto;padding:40px 32px;background:#ffffff;font-family:ui-sans-serif,system-ui,sans-serif">
  <div style="height:3px;background:${brandColor};border-radius:2px;margin-bottom:32px"></div>
  ${rows}
  ${
    !hasFooter
      ? `<div style="margin-top:32px;padding-top:24px;border-top:1px solid #f1f5f9;text-align:center">
    <p style="font-size:11px;color:#94a3b8;margin:0">Sent with Thrico · <a href="#" style="color:#94a3b8">Unsubscribe</a></p>
  </div>`
      : ""
  }
</div>`;
  }, [blocks, brandColor]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    const html = generateHtml();
    const json = JSON.stringify(blocks);

    try {
      if (id) {
        // --- Edit Mode ---
        const { data } = await updateTemplate({
          variables: { id, name, subject, html, json },
        });

        if (data?.updateEmailTemplate?.success) {
          updateLocalTemplate(id, { name, subject, html, json });
          toast.success("Template updated ✓");
          router.push("/email/templates");
        } else {
          toast.error("Failed to update template");
        }
      } else {
        // --- Create Mode ---
        const { data } = await createTemplate({
          variables: { name, subject, html, json },
        });

        if (data?.createEmailTemplate?.id) {
          const template: EmailTemplate = {
            id: data.createEmailTemplate.id,
            name,
            subject,
            html,
            json,
            updatedAt: new Date().toISOString(),
          };
          addTemplate(template);
          toast.success("Template saved ✓");
          router.push("/email/templates");
        } else {
          toast.error("Failed to save template");
        }
      }
    } catch (e: any) {
      console.error("Save Error:", e);
      toast.error(e.message || "Failed to finalize template");
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-[#FBFBFC] selection:bg-indigo-100 selection:text-indigo-900">
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 h-16 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/email/templates")}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-8 min-w-0 flex-1">
            <div className="flex flex-col min-w-[160px]">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">
                Alias
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name your template..."
                className="text-[14px] font-bold text-slate-900 bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-slate-300 w-full"
              />
            </div>

            <div className="h-8 w-px bg-slate-100 shrink-0" />

            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mb-1 flex items-center gap-1">
                <Mail className="h-2 w-2" />
                Default Subject
              </span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Add an outbound subject line..."
                className="text-[13px] font-medium text-slate-500 bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-slate-300 w-full truncate"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100/80 rounded-xl p-1 border border-slate-200 shadow-sm">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={cn(
                "h-7 px-4 rounded-lg flex items-center gap-1.5 text-[11px] font-bold transition-all",
                previewMode === "desktop"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              <Monitor className="h-3.5 w-3.5" />
              Desktop
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={cn(
                "h-7 px-4 rounded-lg flex items-center gap-1.5 text-[11px] font-bold transition-all",
                previewMode === "mobile"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              <Smartphone className="h-3.5 w-3.5" />
              Mobile
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1" />

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="h-9 px-5 bg-slate-900 hover:bg-black text-white text-[12px] font-bold rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)] disabled:opacity-60 disabled:cursor-not-allowed group active:scale-95"
          >
            <Save className="h-3.5 w-3.5 group-hover:animate-pulse" />
            {isSaving ? "Saving..." : "Save Template"}
          </button>
        </div>
      </header>

      {/* ── 3-Column Body ──────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* ── Left Panel: Blocks & Settings ─────────────────────────────── */}
        <div className="w-[240px] shrink-0 bg-white border-r border-slate-100 flex flex-col">
          {/* Tabs */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/50">
            <div className="relative flex p-1 bg-slate-200/50 rounded-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  layoutId="sidebar-tab-pill"
                  className="absolute inset-y-1 bg-white rounded-lg shadow-sm border border-slate-100"
                  style={{
                    width: "calc(33.33% - 4px)",
                    left:
                      activeTab === "blocks"
                        ? "4px"
                        : activeTab === "templates"
                          ? "33.33%"
                          : "66.66%",
                  }}
                  transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                />
              </AnimatePresence>
              {(["blocks", "templates", "settings"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "relative z-10 flex-1 h-9 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5",
                    activeTab === tab
                      ? "text-slate-900"
                      : "text-slate-400 hover:text-slate-600",
                  )}
                >
                  {tab === "blocks" && <Layout className="h-3 w-3" />}
                  {tab === "templates" && <Sparkles className="h-3 w-3" />}
                  {tab === "settings" && <Settings2 className="h-3 w-3" />}
                  <span className="hidden min-[1100px]:inline">{tab}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeTab === "blocks" && (
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1 pb-1">
                  Add a block to canvas
                </p>
                {blockDefs.map((def) => (
                  <button
                    key={def.type}
                    onClick={() => addBlock(def.type)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all group text-left"
                  >
                    <div
                      className={cn(
                        "h-7 w-7 rounded-md flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-sm",
                        def.accent,
                      )}
                    >
                      <def.icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-slate-800 group-hover:text-slate-900">
                        {def.label}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {def.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === "templates" && (
              <div className="space-y-4 pt-1">
                <div className="px-1">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pb-1.5 flex items-center justify-between">
                    Blueprint Presets
                    <Sparkles className="h-2 w-2 text-indigo-400" />
                  </p>
                  <div className="grid gap-3">
                    <button
                      onClick={() => {
                        setBlocks(STARTER_TEMPLATES.NEWSLETTER.blocks as any);
                        setSelectedId("h1");
                        toast.success("Newsletter layout applied");
                      }}
                      className="w-full text-left p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-[13px] font-bold text-slate-800">
                        Newsletter
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Clean, information-dense layout with hero sections
                      </p>
                    </button>
                    <button
                      onClick={() => {
                        setBlocks(STARTER_TEMPLATES.WELCOME.blocks as any);
                        setSelectedId("he1");
                        toast.success("Welcome layout applied");
                      }}
                      className="w-full text-left p-4 rounded-2xl border border-slate-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-[13px] font-bold text-slate-800">
                        Welcome Series
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Engagement-focused greeting for onboarding
                      </p>
                    </button>
                    <button
                      onClick={() => {
                        setBlocks(STARTER_TEMPLATES.EVENT.blocks as any);
                        setSelectedId("he1");
                        toast.success("Event layout applied");
                      }}
                      className="w-full text-left p-4 rounded-2xl border border-slate-100 bg-white hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-xl hover:shadow-amber-500/5 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-[13px] font-bold text-slate-800">
                        Event Invite
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Bold invitation with date and venue details
                      </p>
                    </button>
                    <button
                      onClick={() => {
                        setBlocks(STARTER_TEMPLATES.ANNOUNCEMENT.blocks as any);
                        setSelectedId("he1");
                        toast.success("Announcement layout applied");
                      }}
                      className="w-full text-left p-4 rounded-2xl border border-slate-100 bg-white hover:border-rose-200 hover:bg-rose-50/30 hover:shadow-xl hover:shadow-rose-500/5 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-[13px] font-bold text-slate-800">
                        Announcement
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        High-impact layout for sharing big news
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-5 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Welcome Email"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Welcome to Thrico!"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="h-9 w-9 rounded-lg cursor-pointer border border-slate-200 p-0.5 overflow-hidden"
                    />
                    <input
                      type="text"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="flex-1 h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 font-mono text-[12px] text-slate-600 outline-none focus:ring-1 focus:ring-indigo-300"
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-indigo-50/50 border border-indigo-100 p-4 flex gap-3 shadow-sm shadow-indigo-100/20">
                  <Sparkles className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                  <p className="text-[12px] text-indigo-800 font-medium leading-relaxed">
                    Pro-tip: Use{" "}
                    <code className="bg-indigo-100/50 px-1.5 py-0.5 rounded-md font-mono text-[10px] text-indigo-600 border border-indigo-200/50">
                      {"{{variable}}"}
                    </code>{" "}
                    to inject dynamic recipient data during dispatch.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Center: Viewport ────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 overflow-hidden bg-slate-100/30 flex flex-col">
          <div className="flex-1 overflow-y-auto scroll-smooth">
            <div
              className={cn(
                "mx-auto my-12 transition-all duration-500 origin-top flex flex-col",
                previewMode === "desktop"
                  ? "max-w-[680px] w-full"
                  : "w-[375px] h-[667px] bg-white rounded-[40px] border-10 border-slate-900 shadow-2xl relative overflow-hidden",
              )}
            >
              {/* Mobile-only status bar mockup */}
              {previewMode === "mobile" && (
                <div className="h-6 bg-slate-900 flex justify-center items-center gap-1.5 shrink-0">
                  <div className="h-1 w-12 bg-slate-800 rounded-full" />
                </div>
              )}

              <div
                className={cn(
                  "flex-1 overflow-y-auto px-6 py-8 bg-white",
                  previewMode === "mobile" && "px-4 pt-4",
                )}
              >
                {/* Canvas header indicator */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Canvas — {blocks.length} block
                      {blocks.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium">
                    Click a block to select & edit
                  </span>
                </div>

                {/* Brand bar preview */}
                <div
                  className="h-1 rounded-full mb-6 transition-all duration-300"
                  style={{ backgroundColor: brandColor }}
                />

                {/* Blocks */}
                <div className="space-y-3">
                  <AnimatePresence>
                    {blocks.map((block, i) => (
                      <motion.div
                        key={block.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="relative pt-9"
                      >
                        <BlockCanvas
                          block={block}
                          isSelected={selectedId === block.id}
                          onSelect={() => setSelectedId(block.id)}
                          onUpdate={updateBlock}
                          onRemove={removeBlock}
                          onMoveUp={moveBlock.bind(null, block.id, "up")}
                          onMoveDown={moveBlock.bind(null, block.id, "down")}
                          isFirst={i === 0}
                          isLast={i === blocks.length - 1}
                          brandColor={brandColor}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Add block button */}
                <motion.button
                  layout
                  onClick={() => addBlock("text")}
                  className="mt-6 w-full h-14 rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 hover:bg-white hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 flex items-center justify-center gap-3 group transition-all"
                >
                  <div className="h-6 w-6 rounded-lg bg-slate-100 group-hover:bg-slate-900 group-hover:scale-110 flex items-center justify-center transition-all duration-300">
                    <Plus className="h-4 w-4 text-slate-400 group-hover:text-white" />
                  </div>
                  <span className="text-[12px] font-bold text-slate-400 group-hover:text-slate-800 uppercase tracking-widest transition-colors">
                    Add Text Component
                  </span>
                </motion.button>

                {/* Empty state */}
                {blocks.length === 0 && (
                  <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-400">
                    <Layout className="h-10 w-10 opacity-20" />
                    <div className="text-center">
                      <p className="text-[14px] font-bold text-slate-700">
                        Canvas is empty
                      </p>
                      <p className="text-[12px] text-slate-400 mt-1">
                        Add blocks from the left panel
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer preview */}
                <div className="mt-8 pt-5 border-t border-slate-100 text-center">
                  <p className="text-[10px] text-slate-300 font-medium">
                    Sent with Thrico · Unsubscribe
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel: Properties or Preview ────────────────────────── */}
        <div className="w-[260px] shrink-0 border-l border-slate-100 bg-white flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">
              {selectedBlock ? "Properties" : "Preview"}
            </span>
            {selectedBlock && (
              <button
                onClick={() => setSelectedId(null)}
                className="h-5 w-5 rounded flex items-center justify-center text-slate-300 hover:text-slate-600 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {selectedBlock ? (
              <div className="p-4">
                <PropertiesPanel
                  block={selectedBlock}
                  onUpdate={updateBlock}
                  brandColor={brandColor}
                />
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Live HTML Preview */}
                <div className="flex-1 bg-slate-100/50 overflow-auto p-6 flex flex-col items-center">
                  <div
                    className={cn(
                      "bg-white shadow-2xl border border-slate-200 overflow-hidden transition-all duration-500 origin-top flex flex-col",
                      previewMode === "desktop"
                        ? "w-[600px] rounded-lg"
                        : "w-[375px] rounded-[32px] border-8 border-slate-900 h-[667px]",
                    )}
                    style={{
                      transform:
                        previewMode === "desktop"
                          ? "scale(0.4)"
                          : "scale(0.35)",
                      marginTop: "20px",
                    }}
                  >
                    {/* Device Status Bar for Mobile */}
                    {previewMode === "mobile" && (
                      <div className="h-6 bg-slate-900 flex justify-center items-center gap-1.5 px-6 pt-1">
                        <div className="h-1.5 w-10 bg-slate-800 rounded-full" />
                      </div>
                    )}

                    <div className="flex-1 bg-white overflow-y-auto">
                      <div
                        dangerouslySetInnerHTML={{ __html: generateHtml() }}
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-slate-100 bg-white">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest text-center">
                    {previewMode === "desktop"
                      ? "Desktop Preview (600px)"
                      : "Mobile Preview (375px)"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
