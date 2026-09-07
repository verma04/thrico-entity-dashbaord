import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  ModuleData,
  useWebsiteBuilderStore,
} from "@/store/useWebsiteBuilderStore";
import { SocialLinksEditor } from "./social-links-editor";
import { MenuEditor } from "./menu-editor";
import { ContainerSettings } from "./container-settings";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { ColorPicker } from "../color-picker";
import { cn } from "@/lib/utils";
import {
  Mail,
  Building2,
  Columns3,
  Rows,
  AlignCenter,
  Sparkles,
  Code2,
  Upload,
  FileCode,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FooterSettingsProps {
  content: ModuleData["content"];
  moduleId: string;
  onContentUpdate: (updates: Partial<ModuleData["content"]>) => void;
}

const COLOR_PRESETS = [
  { label: "Dark Navy", bg: "#0f172a", text: "#f8fafc" },
  { label: "Charcoal", bg: "#1c1c1e", text: "#ffffff" },
  { label: "Slate", bg: "#1e293b", text: "#e2e8f0" },
  { label: "Pure Black", bg: "#000000", text: "#ffffff" },
  { label: "Deep Indigo", bg: "#1e1b4b", text: "#e0e7ff" },
  { label: "Forest", bg: "#064e3b", text: "#d1fae5" },
  { label: "Deep Purple", bg: "#2e1065", text: "#f3e8ff" },
  { label: "Midnight Blue", bg: "#172554", text: "#dbeafe" },
  { label: "Warm Sand", bg: "#f5f0e8", text: "#1c1917" },
  { label: "Light Gray", bg: "#f8fafc", text: "#0f172a" },
  { label: "Off White", bg: "#fafafa", text: "#171717" },
  { label: "Warm White", bg: "#fffbf5", text: "#1c1917" },
];

export const FooterSettings = ({
  moduleId,
  onContentUpdate,
}: FooterSettingsProps) => {
  const { toast } = useToast();
  const { globalFooter } = useWebsiteBuilderStore();
  const htmlFileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);

  const handleHtmlFileRead = (file: File) => {
    if (!file) return;
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
        onContentUpdate({
          htmlCode: result,
          fileName: file.name,
        });
        toast({
          title: "HTML File Loaded",
          description: `Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB).`,
        });
      }
    };
    reader.readAsText(file);
  };

  const content = globalFooter.id === moduleId ? globalFooter.content : {};
  const currentLayout = globalFooter.layout || "columns";

  const currentBg = content?.containerSettings?.background || "";
  const currentText = content?.containerSettings?.textColor || "";

  const applyColorPreset = (bg: string, text: string) => {
    onContentUpdate({
      containerSettings: {
        ...content?.containerSettings,
        background: bg,
        textColor: text,
      },
    });
  };

  const isPresetActive = (bg: string, text: string) =>
    currentBg === bg && currentText === text;

  return (
    <div className="space-y-6">
      {/* Logo Type */}
      <div className="space-y-3">
        <Label>Logo Type</Label>
        <RadioGroup
          value={content.logoType || "text"}
          onValueChange={(val) => onContentUpdate({ logoType: val })}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="logo-text-footer" />
            <Label htmlFor="logo-text-footer" className="font-normal">
              Text
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image" id="logo-image-footer" />
            <Label htmlFor="logo-image-footer" className="font-normal">
              Image
            </Label>
          </div>
        </RadioGroup>

        {/* Text Logo */}
        {(content.logoType === "text" || !content.logoType) && (
          <div className="space-y-2">
            <Label htmlFor="logo-text-input-footer">Logo Text</Label>
            <Input
              id="logo-text-input-footer"
              value={content.logoText || ""}
              onChange={(e) => onContentUpdate({ logoText: e.target.value })}
              placeholder="Enter brand name..."
            />
          </div>
        )}

        {/* Image Logo */}
        {content.logoType === "image" && (
          <ImageUploadWithCrop
            label="Footer Logo"
            currentImage={content.logoImage}
            onImageUpdate={(imageUrl: string) => {
              onContentUpdate({ logoImage: imageUrl });
            }}
            recommendedWidth={150}
            recommendedHeight={50}
            aspectRatio={3}
            maxFileSize={2}
          />
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="footer-description">Description</Label>
        <Textarea
          id="footer-description"
          value={content.description || ""}
          onChange={(e) => onContentUpdate({ description: e.target.value })}
          placeholder="Footer description or tagline..."
          rows={3}
        />
      </div>

      {/* Copyright Text */}
      <div className="space-y-2">
        <Label htmlFor="footer-copyright">Copyright Text</Label>
        <Input
          id="footer-copyright"
          value={content.copyrightText || ""}
          onChange={(e) => onContentUpdate({ copyrightText: e.target.value })}
          placeholder={`© ${new Date().getFullYear()} All rights reserved.`}
        />
      </div>

      {/* ─── Layout Specific Settings ─── */}
      <div className="pt-4 border-t space-y-4">
        <div className="flex items-center justify-between">
          <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider flex items-center gap-1.5">
            {currentLayout === "newsletter" && <Mail className="h-3.5 w-3.5 text-primary" />}
            {currentLayout === "corporate" && <Building2 className="h-3.5 w-3.5 text-primary" />}
            {currentLayout === "columns" && <Columns3 className="h-3.5 w-3.5 text-primary" />}
            {currentLayout === "minimal" && <Rows className="h-3.5 w-3.5 text-primary" />}
            {currentLayout === "simple" && <AlignCenter className="h-3.5 w-3.5 text-primary" />}
            {currentLayout === "custom-html" && <Code2 className="h-3.5 w-3.5 text-primary" />}
            <span>{currentLayout.replace(/-/g, " ")} Options</span>
          </Label>
          <span className="text-[9px] font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">
            Active Layout
          </span>
        </div>

        {/* Newsletter Specific Fields */}
        {currentLayout === "newsletter" && (
          <div className="space-y-3 bg-muted/20 p-3 rounded-lg border border-border/50">
            <div className="space-y-1.5">
              <Label htmlFor="newsletter-title" className="text-xs">Headline</Label>
              <Input
                id="newsletter-title"
                value={content.newsletterTitle ?? "Stay in the loop with our newsletter"}
                onChange={(e) => onContentUpdate({ newsletterTitle: e.target.value })}
                placeholder="Stay in the loop with our newsletter"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newsletter-desc" className="text-xs">Subtitle</Label>
              <Textarea
                id="newsletter-desc"
                value={content.newsletterDescription ?? ""}
                onChange={(e) => onContentUpdate({ newsletterDescription: e.target.value })}
                placeholder="Weekly product updates, design insights, and community stories..."
                rows={2}
                className="text-xs resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="newsletter-ph" className="text-xs">Placeholder</Label>
                <Input
                  id="newsletter-ph"
                  value={content.newsletterPlaceholder ?? "Enter your email address..."}
                  onChange={(e) => onContentUpdate({ newsletterPlaceholder: e.target.value })}
                  placeholder="Enter your email address..."
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newsletter-btn" className="text-xs">Button Text</Label>
                <Input
                  id="newsletter-btn"
                  value={content.newsletterButtonText ?? "Subscribe"}
                  onChange={(e) => onContentUpdate({ newsletterButtonText: e.target.value })}
                  placeholder="Subscribe"
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newsletter-disc" className="text-xs">Trust / Disclaimer Note</Label>
              <Input
                id="newsletter-disc"
                value={content.newsletterDisclaimer ?? "We respect your privacy. No spam ever."}
                onChange={(e) => onContentUpdate({ newsletterDisclaimer: e.target.value })}
                placeholder="We respect your privacy. No spam ever."
                className="h-8 text-xs"
              />
            </div>
          </div>
        )}

        {/* Corporate Specific Fields */}
        {currentLayout === "corporate" && (
          <div className="space-y-3 bg-muted/20 p-3 rounded-lg border border-border/50">
            <div className="space-y-1.5">
              <Label htmlFor="corp-company" className="text-xs">Entity / Company Name</Label>
              <Input
                id="corp-company"
                value={content.companyName || ""}
                onChange={(e) => onContentUpdate({ companyName: e.target.value })}
                placeholder="Acme Global Inc."
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="corp-address" className="text-xs">Office Address</Label>
              <Input
                id="corp-address"
                value={content.address || ""}
                onChange={(e) => onContentUpdate({ address: e.target.value })}
                placeholder="100 Innovation Way, Suite 400, San Francisco, CA"
                className="h-8 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="corp-email" className="text-xs">Contact Email</Label>
                <Input
                  id="corp-email"
                  value={content.email || ""}
                  onChange={(e) => onContentUpdate({ email: e.target.value })}
                  placeholder="contact@company.com"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="corp-phone" className="text-xs">Phone</Label>
                <Input
                  id="corp-phone"
                  value={content.phone || ""}
                  onChange={(e) => onContentUpdate({ phone: e.target.value })}
                  placeholder="+1 (800) 555-0199"
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="corp-reg" className="text-xs">Registration / Compliance ID</Label>
              <Input
                id="corp-reg"
                value={content.registrationNumber || ""}
                onChange={(e) => onContentUpdate({ registrationNumber: e.target.value })}
                placeholder="Reg. No. 8923-4410 • ISO 27001 Certified"
                className="h-8 text-xs"
              />
            </div>
          </div>
        )}

        {/* Columns Specific Fields */}
        {currentLayout === "columns" && (
          <div className="space-y-3 bg-muted/20 p-3 rounded-lg border border-border/50">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="col-newsletter" className="text-xs cursor-pointer">
                  Brand Column Newsletter Box
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Show compact subscribe box below brand info
                </p>
              </div>
              <Switch
                id="col-newsletter"
                checked={content.showNewsletterSnippet ?? false}
                onCheckedChange={(checked) => onContentUpdate({ showNewsletterSnippet: checked })}
              />
            </div>
          </div>
        )}

        {/* Minimal Specific Fields */}
        {currentLayout === "minimal" && (
          <div className="space-y-3 bg-muted/20 p-3 rounded-lg border border-border/50">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="min-status" className="text-xs cursor-pointer">
                  System Status Badge
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Pulsing indicator for platform status
                </p>
              </div>
              <Switch
                id="min-status"
                checked={content.showStatusIndicator ?? true}
                onCheckedChange={(checked) => onContentUpdate({ showStatusIndicator: checked })}
              />
            </div>
            {content.showStatusIndicator !== false && (
              <div className="space-y-1.5 pt-1">
                <Label htmlFor="min-status-text" className="text-xs">Status Label</Label>
                <Input
                  id="min-status-text"
                  value={content.statusText ?? "All systems operational"}
                  onChange={(e) => onContentUpdate({ statusText: e.target.value })}
                  placeholder="All systems operational"
                  className="h-8 text-xs"
                />
              </div>
            )}
          </div>
        )}

        {/* Simple Specific Fields */}
        {currentLayout === "simple" && (
          <div className="space-y-3 bg-muted/20 p-3 rounded-lg border border-border/50">
            <div className="space-y-1.5">
              <Label htmlFor="sim-badge" className="text-xs">Top Badge Pill (Optional)</Label>
              <Input
                id="sim-badge"
                value={content.badgeText || ""}
                onChange={(e) => onContentUpdate({ badgeText: e.target.value })}
                placeholder="e.g., ✦ Official Community Hub"
                className="h-8 text-xs"
              />
            </div>
          </div>
        )}

        {/* Custom HTML Specific Fields */}
        {currentLayout === "custom-html" && (
          <div className="space-y-4 bg-muted/20 p-3 rounded-lg border border-border/50">
            {/* File Upload Dropzone */}
            <input
              type="file"
              ref={htmlFileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleHtmlFileRead(file);
                  e.target.value = "";
                }
              }}
              accept=".html,.htm,.txt"
              className="hidden"
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleHtmlFileRead(file);
              }}
              onClick={() => htmlFileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 bg-background/50"
              )}
            >
              <div className="flex flex-col items-center justify-center gap-1.5">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Upload className="h-4 w-4" />
                </div>
                <div className="text-xs font-medium">
                  {content.fileName ? `File: ${content.fileName}` : "Upload .html file"}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Click to browse or drag & drop HTML
                </div>
              </div>
            </div>

            {/* Render Mode & Source Ref */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Render Mode</Label>
                <RadioGroup
                  value={content.renderMode || "direct"}
                  onValueChange={(val) => onContentUpdate({ renderMode: val })}
                  className="flex gap-2 pt-1"
                >
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="direct" id="ft-rm-direct" />
                    <Label htmlFor="ft-rm-direct" className="text-[11px] font-normal cursor-pointer">
                      Direct
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="iframe" id="ft-rm-iframe" />
                    <Label htmlFor="ft-rm-iframe" className="text-[11px] font-normal cursor-pointer">
                      IFrame
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-1">
                <Label htmlFor="ft-file-ref" className="text-xs">File Reference</Label>
                <Input
                  id="ft-file-ref"
                  value={content.fileName || ""}
                  onChange={(e) => onContentUpdate({ fileName: e.target.value })}
                  placeholder="footer.html"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Raw HTML Editor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="ft-html-code" className="text-xs">Raw HTML Code</Label>
                {content.htmlCode && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(content.htmlCode || "");
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      <span>{isCopied ? "Copied" : "Copy"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onContentUpdate({ htmlCode: "", fileName: "" })}
                      className="inline-flex items-center gap-1 text-[10px] text-destructive hover:opacity-80"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                )}
              </div>
              <Textarea
                id="ft-html-code"
                value={content.htmlCode || ""}
                onChange={(e) => onContentUpdate({ htmlCode: e.target.value })}
                placeholder="<!-- Paste your raw <footer> or HTML markup here -->"
                rows={8}
                className="font-mono text-xs bg-slate-950 text-slate-100 p-2.5 resize-none leading-relaxed"
              />
            </div>

            {/* Custom CSS */}
            <div className="space-y-1.5">
              <Label htmlFor="ft-custom-css" className="text-xs">Custom CSS (Optional)</Label>
              <Textarea
                id="ft-custom-css"
                value={content.customCss || ""}
                onChange={(e) => onContentUpdate({ customCss: e.target.value })}
                placeholder="/* Custom CSS styling for footer */"
                rows={2}
                className="font-mono text-xs bg-background text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* Menu & Column Links Editor */}
      <div className="pt-4 border-t space-y-2">
        <Label>Footer Navigation & Columns</Label>
        <MenuEditor
          menuItems={content.menuItems}
          onChange={(items) => onContentUpdate({ menuItems: items })}
        />
      </div>

      {/* Social Links Editor */}
      <div className="pt-4 border-t space-y-2">
        <Label>Social Media Links</Label>
        <SocialLinksEditor
          links={content.socialLinks}
          onChange={(links) => onContentUpdate({ socialLinks: links })}
        />
      </div>

      {/* ─── Footer Colors ─── */}
      <div className="pt-4 border-t space-y-4">
        <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">
          Footer Colors
        </Label>

        {/* Preset swatches */}
        <div className="space-y-1.5">
          <Label className="text-[10px] text-muted-foreground">
            Color Presets
          </Label>
          <div className="grid grid-cols-4 gap-1.5">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.label}
                title={preset.label}
                onClick={() => applyColorPreset(preset.bg, preset.text)}
                className={cn(
                  "relative h-9 rounded-md border-2 overflow-hidden transition-all duration-150",
                  isPresetActive(preset.bg, preset.text)
                    ? "border-primary ring-1 ring-primary/40 scale-[1.05]"
                    : "border-transparent hover:border-border hover:scale-[1.04]"
                )}
                style={{ backgroundColor: preset.bg }}
              >
                <span
                  className="absolute inset-0 flex items-center justify-center text-[7px] font-semibold leading-none tracking-wide px-0.5 text-center"
                  style={{ color: preset.text, opacity: 0.85 }}
                >
                  {preset.label}
                </span>
                {isPresetActive(preset.bg, preset.text) && (
                  <span
                    className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: preset.text + "33" }}
                  >
                    <svg
                      viewBox="0 0 12 12"
                      width="8"
                      height="8"
                      fill="none"
                      stroke={preset.text}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="2,6 5,9 10,3" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom color pickers */}
        <div className="grid grid-cols-2 gap-3">
          <ColorPicker
            label="Background"
            value={currentBg || "#0f172a"}
            onChange={(color) =>
              onContentUpdate({
                containerSettings: {
                  ...content?.containerSettings,
                  background: color,
                },
              })
            }
            compact
          />
          <ColorPicker
            label="Text Color"
            value={currentText || "#f8fafc"}
            onChange={(color) =>
              onContentUpdate({
                containerSettings: {
                  ...content?.containerSettings,
                  textColor: color,
                },
              })
            }
            compact
          />
        </div>

        {/* Live mini-preview */}
        <div
          className="rounded-md p-3 text-center border border-border/30 transition-all duration-200"
          style={{
            backgroundColor: currentBg || "#0f172a",
            color: currentText || "#f8fafc",
          }}
        >
          <div className="text-xs font-semibold">Footer Preview</div>
          <div className="text-[10px] mt-0.5" style={{ opacity: 0.6 }}>
            Sample footer text color
          </div>
        </div>

        {/* Reset to default */}
        {(currentBg || currentText) && (
          <button
            onClick={() =>
              onContentUpdate({
                containerSettings: {
                  ...content?.containerSettings,
                  background: "",
                  textColor: "",
                },
              })
            }
            className="w-full h-7 rounded border border-dashed border-border text-[10px] text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            Reset to default
          </button>
        )}
      </div>

      <div className="pt-4 border-t">
        <ContainerSettings
          selectedModule={{ id: moduleId, content }}
          updateModuleContent={(_, updates) => onContentUpdate(updates)}
        />
      </div>
    </div>
  );
};
