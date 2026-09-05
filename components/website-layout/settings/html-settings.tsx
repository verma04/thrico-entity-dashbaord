"use client";

import React, { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Upload,
  FileCode,
  Copy,
  Check,
  Trash2,
  Code2,
  Sparkles,
  Layers,
  Eye,
  Sliders,
  Maximize2,
  Info,
  CheckCircle2,
  RefreshCw,
  FileUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface HtmlSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

const HTML_STARTER_TEMPLATES = [
  {
    name: "Gradient Banner",
    category: "Hero",
    code: `<div style="padding: 40px 24px; text-align: center; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.3);">
  <span style="display: inline-block; padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Exclusive Feature</span>
  <h2 style="font-size: 28px; font-weight: 700; margin: 0 0 12px 0; color: #ffffff;">Build Custom Experiences</h2>
  <p style="font-size: 15px; opacity: 0.9; max-width: 540px; margin: 0 auto 20px auto; line-height: 1.6;">Design custom layouts, embed widgets, or inject high-converting sections with custom HTML.</p>
  <a href="#learn-more" style="display: inline-block; padding: 10px 24px; background: #ffffff; color: #4f46e5; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">Get Started &rarr;</a>
</div>`,
  },
  {
    name: "3-Column Feature Cards",
    category: "Features",
    code: `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
  <div style="padding: 24px; border-radius: 14px; background: #f8fafc; border: 1px solid #e2e8f0; text-align: left;">
    <div style="width: 40px; height: 40px; border-radius: 10px; background: #e0e7ff; color: #4338ca; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 14px;">01</div>
    <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 8px 0; color: #0f172a;">Lightning Fast</h3>
    <p style="font-size: 14px; color: #64748b; margin: 0; line-height: 1.5;">Optimized performance and clean markup for instant loading times.</p>
  </div>
  <div style="padding: 24px; border-radius: 14px; background: #f8fafc; border: 1px solid #e2e8f0; text-align: left;">
    <div style="width: 40px; height: 40px; border-radius: 10px; background: #fef3c7; color: #b45309; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 14px;">02</div>
    <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 8px 0; color: #0f172a;">Full Flexibility</h3>
    <p style="font-size: 14px; color: #64748b; margin: 0; line-height: 1.5;">Supports complete HTML5, custom CSS styling, and responsive design.</p>
  </div>
  <div style="padding: 24px; border-radius: 14px; background: #f8fafc; border: 1px solid #e2e8f0; text-align: left;">
    <div style="width: 40px; height: 40px; border-radius: 10px; background: #dcfce7; color: #15803d; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 14px;">03</div>
    <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 8px 0; color: #0f172a;">Easy Integration</h3>
    <p style="font-size: 14px; color: #64748b; margin: 0; line-height: 1.5;">Drop in any third-party embeds, lead forms, or external components.</p>
  </div>
</div>`,
  },
  {
    name: "Pricing Highlights",
    category: "Pricing",
    code: `<div style="max-w: 600px; margin: 0 auto; padding: 32px 24px; border-radius: 18px; background: #ffffff; border: 2px solid #4f46e5; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05); text-align: center;">
  <span style="display: inline-block; padding: 4px 12px; background: #e0e7ff; color: #4338ca; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase;">Most Popular</span>
  <h3 style="font-size: 24px; font-weight: 700; margin: 12px 0 6px 0; color: #0f172a;">Pro Membership</h3>
  <div style="font-size: 42px; font-weight: 800; color: #0f172a; margin: 12px 0;">$29<span style="font-size: 16px; font-weight: 500; color: #64748b;">/month</span></div>
  <p style="font-size: 14px; color: #64748b; margin-bottom: 24px;">Everything you need to scale your organization and engage members.</p>
  <a href="#subscribe" style="display: block; width: 100%; padding: 12px 0; background: #4f46e5; color: #ffffff; border-radius: 10px; font-weight: 600; text-decoration: none; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);">Upgrade to Pro</a>
</div>`,
  },
  {
    name: "Interactive Lead Box",
    category: "Form",
    code: `<div style="padding: 32px 24px; background: #f1f5f9; border-radius: 16px; text-align: center; border: 1px solid #cbd5e1;">
  <h3 style="font-size: 22px; font-weight: 700; margin: 0 0 8px 0; color: #0f172a;">Subscribe to our Newsletter</h3>
  <p style="font-size: 14px; color: #64748b; margin: 0 0 20px 0;">Receive monthly digests and curated industry reports straight to your inbox.</p>
  <form style="display: flex; gap: 10px; max-width: 440px; margin: 0 auto; flex-wrap: wrap;" onsubmit="event.preventDefault(); alert('Subscribed successfully!');">
    <input type="email" placeholder="Enter your email" required style="flex: 1; min-width: 220px; padding: 10px 16px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; outline: none;" />
    <button type="submit" style="padding: 10px 20px; background: #0f172a; color: white; border-radius: 8px; border: none; font-weight: 600; cursor: pointer;">Join Now</button>
  </form>
</div>`,
  },
  {
    name: "Video Embed Container",
    category: "Media",
    code: `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
  <iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" title="Video player" style="position: absolute; top:0; left: 0; width: 100%; height: 100%; border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>`,
  },
];

export const HtmlSettings: React.FC<HtmlSettingsProps> = ({
  content,
  onChange,
  layout,
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showCssEditor, setShowCssEditor] = useState(false);

  const htmlCode = content?.htmlCode || content?.embedCode || "";
  const renderMode = content?.renderMode || "direct";
  const containerWidth = content?.containerWidth || "contained";
  const padding = content?.padding || "medium";
  const minHeight = content?.minHeight !== undefined ? Number(content.minHeight) : 200;
  const customCss = content?.customCss || "";
  const fileName = content?.fileName || "";

  // Handle file reading
  const handleFileRead = (file: File) => {
    if (!file) return;

    // Check file extension
    const validExtensions = [".html", ".htm", ".txt"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an .html, .htm, or .txt file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange({
          htmlCode: result,
          fileName: file.name,
          fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        });

        toast({
          title: "HTML file loaded!",
          description: `Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB) into editor.`,
        });
      }
    };
    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Failed to read the uploaded HTML file.",
        variant: "destructive",
      });
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileRead(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleCopyCode = () => {
    if (!htmlCode) return;
    navigator.clipboard.writeText(htmlCode);
    setIsCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "HTML code copied to clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClearCode = () => {
    onChange({
      htmlCode: "",
      fileName: "",
      fileSize: "",
    });
    toast({
      title: "Cleared",
      description: "HTML code has been cleared.",
    });
  };

  const handleApplyTemplate = (templateCode: string) => {
    onChange({
      htmlCode: templateCode,
      fileName: "",
    });
    toast({
      title: "Template applied",
      description: "Starter HTML template has been loaded into the editor.",
    });
  };

  // Basic code line counting
  const lineCount = htmlCode ? htmlCode.split("\n").length : 1;
  const charCount = htmlCode.length;

  return (
    <div className="space-y-5">
      {/* ─── 1. File Upload Dropzone ─── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] uppercase font-semibold text-muted-foreground/80 tracking-wider flex items-center gap-1.5">
            <Upload className="h-3 w-3 text-primary" />
            <span>Upload HTML File</span>
          </Label>
          {fileName && (
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Uploaded
            </span>
          )}
        </div>

        {/* Hidden Native File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.htm,.txt"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileRead(e.target.files[0]);
            }
          }}
        />

        {/* Drag & Drop Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "group relative rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/10 scale-[0.99]"
              : fileName
              ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/60"
              : "border-border/60 bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
          )}
        >
          {fileName ? (
            <div className="flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                  <FileCode className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate text-foreground">
                    {fileName}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {content?.fileSize || "HTML Document"} &bull; Click to replace
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-[10px] text-muted-foreground hover:text-foreground shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Change
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
              <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Click to upload or drag &amp; drop
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Supports .html, .htm, or .txt files
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-border/40" />

      {/* ─── 2. HTML Code Editor & Templates ─── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] uppercase font-semibold text-muted-foreground/80 tracking-wider flex items-center gap-1.5">
            <Code2 className="h-3 w-3 text-primary" />
            <span>HTML Code Editor</span>
          </Label>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopyCode}
              disabled={!htmlCode}
              className="p-1 rounded text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
              title="Copy Code"
            >
              {isCopied ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
            <button
              type="button"
              onClick={handleClearCode}
              disabled={!htmlCode}
              className="p-1 rounded text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Clear Code"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Starter Templates Dropdown */}
        <div className="flex items-center gap-2">
          <Select onValueChange={handleApplyTemplate}>
            <SelectTrigger className="h-8 text-xs bg-background">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>Insert Starter Template...</span>
              </div>
            </SelectTrigger>
            <SelectContent className="z-[2500]">
              {HTML_STARTER_TEMPLATES.map((tmpl) => (
                <SelectItem key={tmpl.name} value={tmpl.code} className="text-xs">
                  <span className="font-medium">{tmpl.name}</span>
                  <span className="text-[10px] text-muted-foreground ml-2">
                    ({tmpl.category})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Code Textarea */}
        <div className="relative rounded-lg border bg-zinc-950 font-mono text-zinc-100 overflow-hidden shadow-inner focus-within:ring-1 focus-within:ring-primary">
          <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-400">
            <span>HTML / CSS</span>
            <span>
              {lineCount} {lineCount === 1 ? "line" : "lines"} &bull; {charCount} chars
            </span>
          </div>

          <Textarea
            value={htmlCode}
            onChange={(e) => onChange({ htmlCode: e.target.value })}
            placeholder="<!-- Paste or write custom HTML here -->&#10;<div style=&quot;padding: 20px;&quot;>&#10;  <h1>Hello World</h1>&#10;</div>"
            className="w-full min-h-[220px] max-h-[360px] text-xs font-mono bg-transparent border-0 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 resize-y p-3 leading-relaxed"
            rows={10}
            spellCheck={false}
          />
        </div>
      </div>

      <div className="h-px bg-border/40" />

      {/* ─── 3. Render Mode Options ─── */}
      <div className="space-y-2">
        <Label className="text-[10px] uppercase font-semibold text-muted-foreground/80 tracking-wider flex items-center gap-1.5">
          <Eye className="h-3 w-3 text-primary" />
          <span>Render Mode</span>
        </Label>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ renderMode: "direct" })}
            className={cn(
              "p-2.5 rounded-lg border text-left transition-all",
              renderMode === "direct"
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-border/60 hover:border-border hover:bg-muted/30 text-foreground"
            )}
          >
            <div className="text-xs font-semibold">Direct HTML</div>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
              Inherits website theme &amp; global CSS styles.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onChange({ renderMode: "iframe" })}
            className={cn(
              "p-2.5 rounded-lg border text-left transition-all",
              renderMode === "iframe"
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-border/60 hover:border-border hover:bg-muted/30 text-foreground"
            )}
          >
            <div className="text-xs font-semibold">Sandboxed IFrame</div>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
              Isolated frame for complete HTML pages &amp; scripts.
            </p>
          </button>
        </div>
      </div>

      <div className="h-px bg-border/40" />

      {/* ─── 4. Layout & Dimensions ─── */}
      <div className="space-y-3">
        <Label className="text-[10px] uppercase font-semibold text-muted-foreground/80 tracking-wider flex items-center gap-1.5">
          <Sliders className="h-3 w-3 text-primary" />
          <span>Layout &amp; Sizing</span>
        </Label>

        {/* Container Width */}
        <div className="space-y-1.5">
          <Label className="text-[11px] text-muted-foreground">Container Width</Label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "contained", label: "Contained" },
              { id: "full", label: "Full Width" },
              { id: "narrow", label: "Narrow" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ containerWidth: item.id })}
                className={cn(
                  "py-1.5 px-2 rounded-md border text-xs font-medium transition-all text-center",
                  containerWidth === item.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section Padding */}
        <div className="space-y-1.5">
          <Label className="text-[11px] text-muted-foreground">Vertical Padding</Label>
          <div className="grid grid-cols-4 gap-1">
            {[
              { id: "none", label: "None" },
              { id: "small", label: "Small" },
              { id: "medium", label: "Medium" },
              { id: "large", label: "Large" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ padding: item.id })}
                className={cn(
                  "py-1 px-1.5 rounded-md border text-[11px] font-medium transition-all text-center",
                  padding === item.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Minimum Height */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] text-muted-foreground">
              Min Height ({minHeight}px)
            </Label>
          </div>
          <Slider
            value={[minHeight]}
            min={50}
            max={800}
            step={25}
            onValueChange={(vals) => onChange({ minHeight: vals[0] })}
            className="w-full"
          />
        </div>
      </div>

      <div className="h-px bg-border/40" />

      {/* ─── 5. Custom CSS (Optional) ─── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] uppercase font-semibold text-muted-foreground/80 tracking-wider flex items-center gap-1.5">
            <Layers className="h-3 w-3 text-primary" />
            <span>Custom CSS (Optional)</span>
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 text-[10px] px-2 text-primary"
            onClick={() => setShowCssEditor(!showCssEditor)}
          >
            {showCssEditor ? "Hide CSS" : "Add CSS"}
          </Button>
        </div>

        {showCssEditor && (
          <Textarea
            value={customCss}
            onChange={(e) => onChange({ customCss: e.target.value })}
            placeholder="/* Add custom CSS rules here */&#10;.my-button { border-radius: 8px; }"
            className="w-full text-xs font-mono min-h-[100px]"
            rows={4}
          />
        )}
      </div>

      <div className="h-px bg-border/40" />

      {/* ─── 6. Section Header Settings ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-semibold">Section Heading</Label>
            <p className="text-[10px] text-muted-foreground">
              Show title above the HTML content
            </p>
          </div>
          <Switch
            checked={!content?.hideTitle}
            onCheckedChange={(checked) => onChange({ hideTitle: !checked })}
          />
        </div>

        {!content?.hideTitle && (
          <div className="space-y-2 pt-1">
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Title</Label>
              <Input
                value={content?.title || ""}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="Section Title"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Description</Label>
              <Input
                value={content?.description || ""}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder="Optional description..."
                className="h-8 text-xs"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
