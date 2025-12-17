import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AnnouncementSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const AnnouncementSettings = ({
  content,
  onChange,
}: AnnouncementSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Announcement Text</Label>
        <Textarea
          value={content.text || ""}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Important announcement..."
          className="text-xs min-h-[50px]"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Link URL (optional)</Label>
        <Input
          value={content.link || ""}
          onChange={(e) => onChange({ link: e.target.value })}
          placeholder="https://..."
          className="h-8 text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Link Text</Label>
        <Input
          value={content.linkText || "Learn More"}
          onChange={(e) => onChange({ linkText: e.target.value })}
          placeholder="Learn More"
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
};
