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
          placeholder="Annual Conference 2024"
          className="h-8 text-xs"
        />
      </div>

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
        <Label className="text-[10px] text-muted-foreground">Description</Label>
        <Textarea
          value={content.description || ""}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Event description..."
          className="text-xs min-h-[50px]"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Registration Link</Label>
        <Input
          value={content.registrationLink || ""}
          onChange={(e) => onChange({ registrationLink: e.target.value })}
          placeholder="https://..."
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
};
