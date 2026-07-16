import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { IconPicker } from "./icon-picker";

interface AnnouncementBarSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const AnnouncementBarSettings = ({
  content,
  onChange,
  layout,
}: AnnouncementBarSettingsProps) => {
  return (
    <div className="space-y-4">
      {/* Message */}
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Message</Label>
        <Textarea
          value={content.message || ""}
          onChange={(e) => onChange({ message: e.target.value })}
          placeholder="Important announcement message..."
          className="text-xs min-h-[60px]"
          rows={3}
        />
      </div>

      {/* Icon (for applicable layouts) */}
      {!["countdown-alert"].includes(layout || "") && (
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">Icon (Optional)</Label>
          <IconPicker
            value={content.icon || ""}
            onChange={(icon) => onChange({ icon })}
          />
        </div>
      )}

      {/* Link URL */}
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Link URL (Optional)</Label>
        <Input
          value={content.link || ""}
          onChange={(e) => onChange({ link: e.target.value })}
          placeholder="https://example.com"
          className="h-8 text-xs"
        />
      </div>

      {/* Link Text */}
      {content.link && (
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">Link Text</Label>
          <Input
            value={content.linkText || "Learn More"}
            onChange={(e) => onChange({ linkText: e.target.value })}
            placeholder="Learn More"
            className="h-8 text-xs"
          />
        </div>
      )}

      {/* Button Text (for promotion-banner layout) */}
      {layout === "promotion-banner" && (
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">Button Text</Label>
          <Input
            value={content.buttonText || "Get Started"}
            onChange={(e) => onChange({ buttonText: e.target.value })}
            placeholder="Get Started"
            className="h-8 text-xs"
          />
        </div>
      )}

      {/* Countdown Date (for countdown-alert layout) */}
      {layout === "countdown-alert" && (
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">Target Date & Time</Label>
          <Input
            type="datetime-local"
            value={content.targetDate || ""}
            onChange={(e) => onChange({ targetDate: e.target.value })}
            className="h-8 text-xs"
          />
        </div>
      )}

      {/* Dismissible Toggle */}
      {layout === "dismissible-bar" && (
        <div className="flex items-center justify-between space-y-2">
          <Label className="text-[10px] text-muted-foreground">Allow Dismissal</Label>
          <Switch
            checked={content.dismissible !== false}
            onCheckedChange={(checked) => onChange({ dismissible: checked })}
          />
        </div>
      )}

      {/* Background Color */}
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Background Color</Label>
        <div className="flex gap-2">
          <input
            type="color"
            value={content.backgroundColor || getDefaultColor(layout)}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
            className="h-8 w-16 rounded border border-input cursor-pointer"
          />
          <Input
            type="text"
            value={content.backgroundColor || ""}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
            placeholder={getDefaultColor(layout)}
            className="h-8 flex-1 text-xs"
          />
        </div>
      </div>

      {/* Text Color */}
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Text Color</Label>
        <div className="flex gap-2">
          <input
            type="color"
            value={content.textColor || "#ffffff"}
            onChange={(e) => onChange({ textColor: e.target.value })}
            className="h-8 w-16 rounded border border-input cursor-pointer"
          />
          <Input
            type="text"
            value={content.textColor || ""}
            onChange={(e) => onChange({ textColor: e.target.value })}
            placeholder="#ffffff"
            className="h-8 flex-1 text-xs"
          />
        </div>
      </div>
    </div>
  );
};

// Helper function to get default colors based on layout
function getDefaultColor(layout?: string): string {
  switch (layout) {
    case "info-message":
      return "#3b82f6"; // blue
    case "warning-alert":
      return "#f59e0b"; // amber
    case "success-message":
      return "#10b981"; // green
    case "error-alert":
      return "#ef4444"; // red
    case "promotion-banner":
      return "#8b5cf6"; // purple
    case "maintenance-notice":
      return "#6b7280"; // gray
    case "dismissible-bar":
      return "#06b6d4"; // cyan
    case "countdown-alert":
      return "#ec4899"; // pink
    case "link-notification":
      return "#14b8a6"; // teal
    default:
      return "#3b82f6"; // blue
  }
}
