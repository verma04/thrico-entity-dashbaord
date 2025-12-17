import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CountdownBannerSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const CountdownBannerSettings = ({
  content,
  onChange,
}: CountdownBannerSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Countdown Message</Label>
        <Input
          value={content.message || ""}
          onChange={(e) => onChange({ message: e.target.value })}
          placeholder="Limited Time Offer!"
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">End Date & Time</Label>
        <Input
          type="datetime-local"
          value={content.endDate || ""}
          onChange={(e) => onChange({ endDate: e.target.value })}
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">CTA Text</Label>
        <Input
          value={content.ctaText || ""}
          onChange={(e) => onChange({ ctaText: e.target.value })}
          placeholder="Shop Now"
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">CTA Link</Label>
        <Input
          value={content.ctaLink || ""}
          onChange={(e) => onChange({ ctaLink: e.target.value })}
          placeholder="https://..."
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
};
