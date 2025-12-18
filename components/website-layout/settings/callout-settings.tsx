import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconPicker } from "./icon-picker";

interface CalloutSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const CalloutSettings = ({
  content,
  onChange,
}: CalloutSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Callout Type</Label>
        <Select
          value={content.type || "info"}
          onValueChange={(value) => onChange({ type: value })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="info">ℹ️ Info</SelectItem>
            <SelectItem value="warning">⚠️ Warning</SelectItem>
            <SelectItem value="success">✅ Success</SelectItem>
            <SelectItem value="error">❌ Error</SelectItem>
            <SelectItem value="tip">💡 Tip</SelectItem>
            <SelectItem value="announcement">📢 Announcement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Icon</Label>
        <IconPicker
          value={content.icon || ""}
          onChange={(icon) => onChange({ icon })}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Heading</Label>
        <Input
          value={content.heading || ""}
          onChange={(e) => onChange({ heading: e.target.value })}
          placeholder="Important Note"
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Message</Label>
        <Textarea
          value={content.message || ""}
          onChange={(e) => onChange({ message: e.target.value })}
          placeholder="Your callout message..."
          className="text-xs min-h-[60px]"
          rows={3}
        />
      </div>

      <div className="space-y-3 pt-2 border-t">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-medium">Show Action Button</Label>
            <p className="text-[10px] text-muted-foreground">Add a call-to-action button</p>
          </div>
          <Switch
            checked={content.showButton || false}
            onCheckedChange={(checked) => onChange({ showButton: checked })}
          />
        </div>

        {content.showButton && (
          <>
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground">Button Text</Label>
              <Input
                value={content.buttonText || ""}
                onChange={(e) => onChange({ buttonText: e.target.value })}
                placeholder="Learn More"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground">Button URL</Label>
              <Input
                value={content.buttonUrl || ""}
                onChange={(e) => onChange({ buttonUrl: e.target.value })}
                placeholder="https://..."
                className="h-8 text-xs"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
