import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EventCountdownSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const EventCountdownSettings = ({
  content,
  onChange,
}: EventCountdownSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Event Name</Label>
        <Input
          value={content.eventName || ""}
          onChange={(e) => onChange({ eventName: e.target.value })}
          placeholder="Annual Tech Conference 2024"
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Description</Label>
        <Textarea
          value={content.description || ""}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Join us for an amazing experience with industry leaders..."
          className="text-xs min-h-[60px]"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">Event Date & Time</Label>
          <Input
            type="datetime-local"
            value={content.eventDate || ""}
            onChange={(e) => onChange({ eventDate: e.target.value })}
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">Venue/Location</Label>
          <Input
            value={content.venue || ""}
            onChange={(e) => onChange({ venue: e.target.value })}
            placeholder="Grand Convention Center"
            className="h-8 text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">Expected Attendees</Label>
          <Input
            value={content.attendees || ""}
            onChange={(e) => onChange({ attendees: e.target.value })}
            placeholder="500+ Attendees Expected"
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] text-muted-foreground">CTA Button Text</Label>
          <Input
            value={content.ctaText || ""}
            onChange={(e) => onChange({ ctaText: e.target.value })}
            placeholder="Register Now"
            className="h-8 text-xs"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Registration Link</Label>
        <Input
          value={content.registrationLink || ""}
          onChange={(e) => onChange({ registrationLink: e.target.value })}
          placeholder="https://example.com/register"
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
};
