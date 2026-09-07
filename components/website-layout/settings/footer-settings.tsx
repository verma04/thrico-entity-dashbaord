import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ModuleData,
  useWebsiteBuilderStore,
} from "@/store/useWebsiteBuilderStore";
import { SocialLinksEditor } from "./social-links-editor";
import { ContainerSettings } from "./container-settings";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { ColorPicker } from "../color-picker";
import { cn } from "@/lib/utils";

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
  const { globalFooter } = useWebsiteBuilderStore();

  const content = globalFooter.id === moduleId ? globalFooter.content : {};

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

      {/* Social Links Editor */}
      <div className="space-y-2">
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
